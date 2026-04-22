"""
GrievanceIQ Pipeline — RSS News Monitor
Fetches grievance-related articles from 5 Indian news RSS feeds,
filters by keywords, and inserts into social_signals via D1.
Uses xmltodict (safe from XXE by default) instead of fast-xml-parser.
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Any

import httpx
import xmltodict

from config import RSS_FEEDS, GRIEVANCE_KEYWORDS
from services.d1_client import d1

logger = logging.getLogger(__name__)


async def fetch_rss_signals() -> dict[str, Any]:
    """
    Main entry point: fetch all RSS feeds, filter for grievance keywords,
    insert new signals into D1.
    """
    result = {
        "feeds_checked": 0,
        "articles_found": 0,
        "articles_matched": 0,
        "articles_inserted": 0,
        "articles_skipped_duplicate": 0,
        "errors": [],
    }

    for feed in RSS_FEEDS:
        try:
            articles = await _fetch_feed(feed["url"], feed["name"])
            result["feeds_checked"] += 1
            result["articles_found"] += len(articles)

            for article in articles:
                matched_keywords = _match_keywords(article)
                if not matched_keywords:
                    continue

                result["articles_matched"] += 1

                # Check for duplicate
                is_duplicate = await _check_duplicate(article["url"])
                if is_duplicate:
                    result["articles_skipped_duplicate"] += 1
                    continue

                # Insert into social_signals
                try:
                    await d1.execute(
                        """INSERT INTO social_signals
                            (platform, keyword_matched, source_url, source_title,
                             post_count_24h, post_count_7d, trending_direction, spike_detected, captured_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                        [
                            "news",
                            ", ".join(matched_keywords[:3]),  # Top 3 matched keywords
                            article["url"],
                            f"{feed['name']}: {article['title'][:200]}",
                            0,   # post_count_24h not applicable for news
                            0,   # post_count_7d not applicable for news
                            "rising",
                            1 if len(matched_keywords) >= 2 else 0,
                            article.get("published", datetime.now(timezone.utc).isoformat()),
                        ],
                    )
                    result["articles_inserted"] += 1
                except Exception as e:
                    result["errors"].append(f"Insert error for {article['url']}: {str(e)}")

        except Exception as e:
            result["errors"].append(f"Feed error ({feed['name']}): {str(e)}")
            logger.error(f"RSS feed error for {feed['name']}: {e}")

    # Log to audit
    now = datetime.now(timezone.utc).isoformat()
    try:
        await d1.execute(
            "INSERT INTO audit_log (event_type, event_detail, created_at) VALUES (?, ?, ?)",
            [
                "pipeline_run",
                f'{{"job":"rss_monitor","status":"success","inserted":{result["articles_inserted"]},"matched":{result["articles_matched"]}}}',
                now,
            ],
        )
    except Exception:
        pass

    return result


async def _fetch_feed(url: str, name: str) -> list[dict[str, str]]:
    """Fetch and parse a single RSS feed, returning article dicts."""
    articles = []
    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)

    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
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

        for item in items:
            title = _get_text(item, ["title"])
            link = _get_text(item, ["link", "guid"])
            description = _get_text(item, ["description", "summary", "content:encoded"])
            pub_date = _get_text(item, ["pubDate", "published", "updated", "dc:date"])

            if not title or not link:
                continue

            # Handle link being a dict (Atom feeds)
            if isinstance(link, dict):
                link = link.get("@href", link.get("#text", ""))

            # Filter by recency (last 24h)
            article_date = _parse_date(pub_date)
            if article_date and article_date < cutoff:
                continue

            articles.append({
                "title": _clean_text(title),
                "url": link.strip() if isinstance(link, str) else str(link),
                "description": _clean_text(description) if description else "",
                "published": article_date.isoformat() if article_date else datetime.now(timezone.utc).isoformat(),
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


def _get_text(item: dict, keys: list[str]) -> str | None:
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
    import re
    if not text:
        return ""
    # Remove HTML tags
    clean = re.sub(r"<[^>]+>", " ", text)
    # Remove extra whitespace
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean[:500]  # Limit length


def _match_keywords(article: dict) -> list[str]:
    """Check if article matches any grievance keywords. Returns list of matched keywords."""
    text = f"{article.get('title', '')} {article.get('description', '')}".lower()
    matched = []

    for keyword in GRIEVANCE_KEYWORDS:
        if keyword.lower() in text:
            matched.append(keyword)

    return matched


async def _check_duplicate(url: str) -> bool:
    """Check if a social_signals entry with this URL already exists today."""
    try:
        rows = await d1.query(
            "SELECT id FROM social_signals WHERE source_url = ? LIMIT 1",
            [url],
        )
        return len(rows) > 0
    except Exception:
        return False


def _parse_date(date_str: str | None) -> datetime | None:
    """Parse various date formats commonly found in RSS feeds."""
    if not date_str:
        return None

    date_str = date_str.strip()

    # Common RSS date formats
    formats = [
        "%a, %d %b %Y %H:%M:%S %z",     # RFC 822: Mon, 01 Jan 2026 12:00:00 +0530
        "%a, %d %b %Y %H:%M:%S %Z",     # With timezone name
        "%Y-%m-%dT%H:%M:%S%z",           # ISO 8601 with tz
        "%Y-%m-%dT%H:%M:%SZ",            # ISO 8601 UTC
        "%Y-%m-%d %H:%M:%S",             # Simple datetime
        "%d %b %Y %H:%M:%S %z",          # 01 Jan 2026 12:00:00 +0530
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
