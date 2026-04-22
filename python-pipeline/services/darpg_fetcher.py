"""
GrievanceIQ Pipeline — DARPG PDF Fetcher
Downloads monthly DARPG PDF reports, extracts ministry-wise tables,
and updates ministry_stats in D1 via REST API.
"""

import re
import logging
from datetime import datetime
from io import BytesIO
from typing import Any

import httpx
import pdfplumber

from config import DARPG_CENTRAL_URL, MINISTRY_NAMES
from services.d1_client import d1

logger = logging.getLogger(__name__)


async def fetch_darpg_data() -> dict[str, Any]:
    """
    Main entry point: fetch latest DARPG PDF, parse tables, update D1.
    Returns summary of what was updated.
    """
    result = {
        "rows_updated": 0,
        "ministries_matched": [],
        "ministries_skipped": [],
        "errors": [],
        "pdf_url": None,
    }

    try:
        # Step 1: Find the latest PDF link from the DARPG index page
        pdf_url = await _find_latest_pdf_url()
        if not pdf_url:
            result["errors"].append("Could not find latest PDF URL on DARPG page")
            return result
        result["pdf_url"] = pdf_url

        # Step 2: Download the PDF
        pdf_bytes = await _download_pdf(pdf_url)
        if not pdf_bytes:
            result["errors"].append(f"Failed to download PDF from {pdf_url}")
            return result

        # Step 3: Extract tables from PDF
        extracted_rows = _extract_tables_from_pdf(pdf_bytes)
        if not extracted_rows:
            result["errors"].append("No ministry data tables found in PDF")
            return result

        # Step 4: Match and update D1
        now = datetime.utcnow().isoformat() + "Z"
        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year

        for row in extracted_rows:
            ministry_name = _match_ministry_name(row.get("ministry", ""))
            if not ministry_name:
                result["ministries_skipped"].append(row.get("ministry", "unknown"))
                continue

            try:
                await d1.execute(
                    """UPDATE ministry_stats SET
                        complaints_received = ?,
                        complaints_disposed = ?,
                        complaints_pending = ?,
                        avg_resolution_days = ?,
                        official_resolution_rate = ?,
                        data_source = 'darpg_pdf',
                        last_synced_at = ?,
                        month = ?,
                        year = ?
                    WHERE ministry_name = ?""",
                    [
                        row.get("received", 0),
                        row.get("disposed", 0),
                        row.get("pending", 0),
                        row.get("avg_days", 0),
                        round(row.get("disposed", 0) / max(row.get("received", 1), 1) * 100, 1),
                        now,
                        current_month,
                        current_year,
                        ministry_name,
                    ],
                )
                result["rows_updated"] += 1
                result["ministries_matched"].append(ministry_name)
            except Exception as e:
                result["errors"].append(f"Failed to update {ministry_name}: {str(e)}")

        # Step 5: Log to audit_log
        try:
            await d1.execute(
                "INSERT INTO audit_log (event_type, event_detail, created_at) VALUES (?, ?, ?)",
                [
                    "pipeline_run",
                    f'{{"job":"darpg_fetch","status":"success","rows_updated":{result["rows_updated"]},"pdf":"{pdf_url}"}}',
                    now,
                ],
            )
        except Exception:
            pass  # Non-critical

    except Exception as e:
        result["errors"].append(f"Unexpected error: {str(e)}")
        logger.exception("DARPG fetch failed")

    return result


async def _find_latest_pdf_url() -> str | None:
    """Scrape the DARPG index page to find the latest monthly PDF link."""
    try:
        async with httpx.AsyncClient(timeout=20.0, follow_redirects=True) as client:
            response = await client.get(DARPG_CENTRAL_URL)
            response.raise_for_status()
            html = response.text

        # Look for PDF links in the page
        # Typical pattern: /sites/default/files/...Monthly_Report...pdf
        pdf_pattern = r'href=["\']([^"\']*\.pdf)["\']'
        matches = re.findall(pdf_pattern, html, re.IGNORECASE)

        if not matches:
            return None

        # Find the most recent one (usually contains month/year in name)
        for match in matches:
            if "monthly" in match.lower() or "report" in match.lower() or "central" in match.lower():
                if match.startswith("http"):
                    return match
                return f"https://darpg.gov.in{match}"

        # Fallback: return first PDF found
        first = matches[0]
        if first.startswith("http"):
            return first
        return f"https://darpg.gov.in{first}"

    except Exception as e:
        logger.error(f"Failed to find PDF URL: {e}")
        return None


async def _download_pdf(url: str) -> bytes | None:
    """Download a PDF file and return its bytes."""
    try:
        async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
            response = await client.get(url)
            response.raise_for_status()

            content_type = response.headers.get("content-type", "")
            if "pdf" not in content_type and not url.endswith(".pdf"):
                logger.warning(f"Response may not be PDF: {content_type}")

            return response.content
    except Exception as e:
        logger.error(f"Failed to download PDF: {e}")
        return None


def _extract_tables_from_pdf(pdf_bytes: bytes) -> list[dict[str, Any]]:
    """Extract ministry performance data from PDF tables using pdfplumber."""
    rows = []

    try:
        with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()
                if not tables:
                    continue

                for table in tables:
                    if not table or len(table) < 2:
                        continue

                    # Try to identify header row
                    header = table[0]
                    if not header:
                        continue

                    header_lower = [str(h).lower().strip() if h else "" for h in header]

                    # Look for columns that indicate ministry performance data
                    ministry_col = _find_col_index(header_lower, ["ministry", "department", "organisation", "name"])
                    received_col = _find_col_index(header_lower, ["received", "receipt", "filed", "registered"])
                    disposed_col = _find_col_index(header_lower, ["disposed", "disposal", "resolved", "closed"])
                    pending_col = _find_col_index(header_lower, ["pending", "balance", "remaining"])
                    days_col = _find_col_index(header_lower, ["days", "average", "avg", "time", "disposal time"])

                    if ministry_col is None or received_col is None:
                        continue

                    # Parse data rows
                    for data_row in table[1:]:
                        if not data_row or len(data_row) <= max(ministry_col, received_col):
                            continue

                        ministry = str(data_row[ministry_col] or "").strip()
                        if not ministry or ministry.lower() in ("total", "grand total", "s.no", "sl.no", ""):
                            continue

                        try:
                            row_data = {
                                "ministry": ministry,
                                "received": _parse_int(data_row[received_col] if received_col is not None else 0),
                                "disposed": _parse_int(data_row[disposed_col] if disposed_col is not None else 0),
                                "pending": _parse_int(data_row[pending_col] if pending_col is not None else 0),
                                "avg_days": _parse_float(data_row[days_col] if days_col is not None else 0),
                            }
                            if row_data["received"] > 0:
                                rows.append(row_data)
                        except (ValueError, IndexError):
                            continue

    except Exception as e:
        logger.error(f"PDF extraction error: {e}")

    return rows


def _find_col_index(header: list[str], keywords: list[str]) -> int | None:
    """Find the column index whose header contains one of the keywords."""
    for i, h in enumerate(header):
        for kw in keywords:
            if kw in h:
                return i
    return None


def _parse_int(value: Any) -> int:
    """Safely parse a value to int, handling commas and whitespace."""
    if value is None:
        return 0
    s = str(value).strip().replace(",", "").replace(" ", "")
    if not s or s == "-" or s == "—":
        return 0
    try:
        return int(float(s))
    except (ValueError, TypeError):
        return 0


def _parse_float(value: Any) -> float:
    """Safely parse a value to float."""
    if value is None:
        return 0.0
    s = str(value).strip().replace(",", "").replace(" ", "")
    if not s or s == "-" or s == "—":
        return 0.0
    try:
        return round(float(s), 1)
    except (ValueError, TypeError):
        return 0.0


def _match_ministry_name(extracted_name: str) -> str | None:
    """
    Fuzzy match an extracted ministry name against known ministry names.
    Returns the canonical name if found, None otherwise.
    """
    if not extracted_name:
        return None

    extracted_lower = extracted_name.lower().strip()

    # Direct match
    for canonical_name in MINISTRY_NAMES:
        if canonical_name.lower() == extracted_lower:
            return canonical_name

    # Partial match — check if key terms overlap
    for canonical_name in MINISTRY_NAMES:
        canonical_lower = canonical_name.lower()
        # Remove common prefixes for comparison
        canonical_core = (
            canonical_lower
            .replace("ministry of ", "")
            .replace("department of ", "")
            .strip()
        )
        extracted_core = (
            extracted_lower
            .replace("ministry of ", "")
            .replace("department of ", "")
            .replace("m/o ", "")
            .replace("d/o ", "")
            .strip()
        )

        if canonical_core == extracted_core:
            return canonical_name

        # Check if the first significant word matches
        canonical_words = set(canonical_core.split())
        extracted_words = set(extracted_core.split())
        overlap = canonical_words & extracted_words

        # If more than half the words match, consider it a match
        if len(overlap) >= max(1, len(canonical_words) // 2):
            return canonical_name

    return None
