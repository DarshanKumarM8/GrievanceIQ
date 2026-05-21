"""
GrievanceIQ Pipeline — RSS News Monitor
Fetches grievance-related articles from 5 Indian news RSS feeds,
filters by tiered keywords, and inserts into social_signals via Supabase.
Uses xmltodict (safe from XXE by default) instead of fast-xml-parser.

Tiered Matching Logic:
  TIER 1 match → ALWAYS insert (relevance_score: HIGH)
  TIER 2 match → insert (relevance_score: MEDIUM)
  TIER 2 + TIER 3 → insert (relevance_score: HIGH)
  TIER 3 alone → SKIP (too generic)
"""

import json
import logging
import re
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import httpx
import xmltodict

from config import RSS_FEEDS, TIER1_KEYWORDS, TIER2_KEYWORDS, TIER3_KEYWORDS
from services.db_client import db

logger = logging.getLogger(__name__)


async def fetch_rss_signals() -> dict[str, Any]:
    """
    Main entry point: fetch all RSS feeds, filter for grievance keywords
    using tiered matching, insert new signals into DB.
    Returns detailed results for the verification panel.
    """
    result = {
        "feeds_checked": 0,
        "feeds_failed": 0,
        "articles_fetched": 0,
        "articles_matched": 0,
        "articles_inserted": 0,
        "articles_skipped_duplicate": 0,
        "articles_skipped_irrelevant": 0,
        "errors": [],
        "matched_articles": [],  # Full list for verification panel
    }

    for feed in RSS_FEEDS:
        try:
            articles = await _fetch_feed(feed["url"], feed["name"])
            result["feeds_checked"] += 1
            result["articles_fetched"] += len(articles)

            for article in articles:
                matched_keywords, relevance = _match_keywords_tiered(article)

                if relevance is None:
                    # TIER 3 alone or no match — skip
                    result["articles_skipped_irrelevant"] += 1
                    continue

                result["articles_matched"] += 1

                # Check for duplicate by URL
                is_duplicate = await _check_duplicate(article["url"])
                if is_duplicate:
                    result["articles_skipped_duplicate"] += 1
                    continue

                # Build content string
                title = article.get("title", "")
                description = article.get("description", "")
                content_text = f"{feed['name']}: {title}"
                if description:
                    content_text += f" — {description[:200]}"

                # Insert into social_signals using db.insert() for Supabase compat
                try:
                    await db.insert("social_signals", {
                        "platform": "news",
                        "keyword_matched": ", ".join(matched_keywords[:3]),
                        "source_url": article["url"],
                        "source_title": content_text[:500],
                        "post_count_24h": 0,
                        "post_count_7d": 0,
                        "trending_direction": "rising",
                        "spike_detected": 1 if relevance == "HIGH" else 0,
                        "relevance_score": relevance,
                        "data_source": "rss",
                        "captured_at": article.get(
                            "published",
                            datetime.now(timezone.utc).isoformat()
                        ),
                    })
                    result["articles_inserted"] += 1
                    result["matched_articles"].append({
                        "source": feed["name"],
                        "title": title,
                        "url": article["url"],
                        "matched_keywords": matched_keywords,
                        "relevance": relevance,
                        "pub_date": article.get("published", ""),
                    })
                except Exception as e:
                    result["errors"].append(
                        f"Insert error for {article['url']}: {str(e)}"
                    )

        except Exception as e:
            result["feeds_failed"] += 1
            result["errors"].append(f"Feed error ({feed['name']}): {str(e)}")
            logger.error(f"RSS feed error for {feed['name']}: {e}")

    # Log to pipeline_runs
    now = datetime.now(timezone.utc).isoformat()
    try:
        await db.insert("pipeline_runs", {
            "job_name": "rss_monitor",
            "status": "success",
            "started_at": now,
            "completed_at": now,
            "rows_affected": result["articles_inserted"],
            "details": json.dumps({
                "feeds_checked": result["feeds_checked"],
                "feeds_failed": result["feeds_failed"],
                "articles_fetched": result["articles_fetched"],
                "articles_matched": result["articles_matched"],
                "articles_inserted": result["articles_inserted"],
                "articles_skipped_duplicate": result["articles_skipped_duplicate"],
                "articles_skipped_irrelevant": result["articles_skipped_irrelevant"],
            }),
            "triggered_by": "api",
        })
    except Exception:
        pass

    # Also log to audit_log
    try:
        await db.insert("audit_log", {
            "event_type": "pipeline_run",
            "event_detail": json.dumps({
                "job": "rss_monitor",
                "status": "success",
                "inserted": result["articles_inserted"],
                "matched": result["articles_matched"],
            }),
            "created_at": now,
        })
    except Exception:
        pass

    return result


async def _fetch_feed(url: str, name: str) -> list[dict[str, str]]:
    """Fetch and parse a single RSS feed, returning article dicts."""
    articles = []
    cutoff = datetime.now(timezone.utc) - timedelta(hours=48)

    try:
        async with httpx.AsyncClient(
            timeout=15.0, follow_redirects=True
        ) as client:
            headers = {
                "User-Agent": "GrievanceIQ/1.0 (RSS Monitor; +https://grievanceiq.in)"
            }
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            xml_text = response.text

        # Parse XML safely with xmltodict (no XXE by default)
        parsed = xmltodict.parse(xml_text)

        # Navigate to items — RSS 2.0 and Atom have different structures
        items = _extract_items(parsed)

        for item in items[:30]:
            title = _get_text(item, ["title"])
            link = _get_text(item, ["link", "guid"])
            description = _get_text(
                item, ["description", "summary", "content:encoded"]
            )
            pub_date = _get_text(
                item, ["pubDate", "published", "updated", "dc:date"]
            )

            if not title or not link:
                continue

            # Handle link being a dict (Atom feeds)
            if isinstance(link, dict):
                link = link.get("@href", link.get("#text", ""))

            # Filter by recency (last 48h to catch more articles)
            article_date = _parse_date(pub_date)
            if article_date and article_date < cutoff:
                continue

            articles.append({
                "title": _clean_text(title),
                "url": link.strip() if isinstance(link, str) else str(link),
                "description": _clean_text(description) if description else "",
                "published": (
                    article_date.isoformat()
                    if article_date
                    else datetime.now(timezone.utc).isoformat()
                ),
                "source": name,
            })

    except Exception as e:
        logger.error(f"Failed to fetch RSS feed {name} ({url}): {e}")
        raise

    return articles


def _extract_items(parsed: dict) -> list:
    """Extract item/entry list from parsed RSS/Atom XML."""
    # RSS 2.0
    if "rss" in parsed:
        channel = parsed["rss"].get("channel", {})
        items = channel.get("item", [])
        if isinstance(items, dict):
            items = [items]
        return items

    # Atom
    if "feed" in parsed:
        entries = parsed["feed"].get("entry", [])
        if isinstance(entries, dict):
            entries = [entries]
        return entries

    # RDF/RSS 1.0
    if "rdf:RDF" in parsed:
        items = parsed["rdf:RDF"].get("item", [])
        if isinstance(items, dict):
            items = [items]
        return items

    return []


def _get_text(item: dict, keys: list[str]) -> str:
    """Get text value from an item dict, trying multiple possible keys."""
    for key in keys:
        value = item.get(key)
        if value is not None:
            if isinstance(value, dict):
                # CDATA or nested content
                return value.get("#text", str(value))
            return str(value)
    return None


def _clean_text(text: str) -> str:
    """Strip HTML tags and clean up text."""
    if not text:
        return ""
    # Remove HTML tags
    clean = re.sub(r"<[^>]+>", " ", text)
    # Remove extra whitespace
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean[:500]  # Limit length


def _match_keywords_tiered(
    article: dict,
) -> tuple[list[str], Optional[str]]:
    """
    Check article against tiered keywords.

    Returns:
        (matched_keywords, relevance_score) where relevance is:
        - 'HIGH' for TIER1 matches or TIER2+TIER3 combined
        - 'MEDIUM' for TIER2 matches alone
        - ([], None) for TIER3-only or no match (skip)
    """
    text = f"{article.get('title', '')} {article.get('description', '')}".lower()

    t1_matches = [kw for kw in TIER1_KEYWORDS if kw in text]
    t2_matches = [kw for kw in TIER2_KEYWORDS if kw in text]
    t3_matches = [kw for kw in TIER3_KEYWORDS if kw in text]

    if t1_matches:
        # TIER 1 → ALWAYS insert as HIGH
        return t1_matches, "HIGH"

    if t2_matches and t3_matches:
        # TIER 2 + TIER 3 combined → HIGH
        return t2_matches + t3_matches, "HIGH"

    if t2_matches:
        # TIER 2 alone → MEDIUM
        return t2_matches, "MEDIUM"

    # TIER 3 alone or no match → skip
    return [], None


async def _check_duplicate(url: str) -> bool:
    """Check if a social_signals entry with this URL already exists."""
    try:
        rows = await db.select(
            "social_signals",
            filters={"source_url": url},
            limit=1,
        )
        return len(rows) > 0
    except Exception:
        # Fallback: try raw query for local SQLite
        try:
            rows = await db.query(
                "SELECT id FROM social_signals WHERE source_url = ? LIMIT 1",
                [url],
            )
            return len(rows) > 0
        except Exception:
            return False


def _parse_date(date_str: str) -> datetime:
    """Parse various date formats commonly found in RSS feeds."""
    if not date_str:
        return None

    date_str = date_str.strip()

    # Common RSS date formats
    formats = [
        "%a, %d %b %Y %H:%M:%S %z",  # RFC 822: Mon, 01 Jan 2026 12:00:00 +0530
        "%a, %d %b %Y %H:%M:%S %Z",  # With timezone name
        "%Y-%m-%dT%H:%M:%S%z",  # ISO 8601 with tz
        "%Y-%m-%dT%H:%M:%SZ",  # ISO 8601 UTC
        "%Y-%m-%d %H:%M:%S",  # Simple datetime
        "%d %b %Y %H:%M:%S %z",  # 01 Jan 2026 12:00:00 +0530
    ]

    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            continue

    # Try dateutil as last resort
    try:
        from email.utils import parsedate_to_datetime

        return parsedate_to_datetime(date_str)
    except Exception:
        return None
