"""
GrievanceIQ Pipeline — data.gov.in Historical Grievance Fetcher
Pulls aggregate CPGRAMS monthly statistics from the Open Government Data
platform and stores them in the monthly_history D1 table.

API docs: https://data.gov.in/ogpl_apis

Includes:
- Multi-resource-ID fallback
- Detailed error diagnosis for every failure mode
- DARPG website scrape fallback if API is unreachable
- Mock historical data generation as last resort
"""

import re
import logging
from datetime import datetime, timedelta, timezone
from typing import Any

import httpx

from config import DATAGOV_API_KEY
from services.db_client import db

logger = logging.getLogger("grievanceiq-pipeline.datagov")

# ─── data.gov.in resource IDs for CPGRAMS datasets ───
DATAGOV_BASE_URL = "https://api.data.gov.in/resource"

# Resource IDs — public CPGRAMS / DARPG datasets on data.gov.in
# We try multiple resource IDs since availability can change
RESOURCE_IDS = [
    "9ef84268-d588-465a-a308-a864a43d0070",  # DARPG grievance statistics
    "6176ee09-3d56-4a3b-8115-21841576b2f6",  # CPGRAMS monthly data
]


# ============================================
# DIAGNOSTIC LOGGING
# ============================================
async def _log_pipeline_run(status: str, rows: int, error: str = None, extra: dict = None):
    """Log a pipeline run to audit_log for admin dashboard visibility."""
    import json
    details = {"job": "datagov_fetch", "status": status, "rows_updated": rows}
    if error:
        details["error"] = error
    if extra:
        details.update(extra)
    try:
        await db.execute(
            "INSERT INTO audit_log (event_type, event_detail, created_at) VALUES (?,?,?)",
            ["pipeline_run", json.dumps(details), datetime.now(timezone.utc).isoformat()]
        )
    except Exception:
        pass


# ============================================
# PRIMARY: data.gov.in API FETCH
# ============================================
async def _try_fetch_resource(resource_id: str) -> dict:
    """
    Attempt to fetch rows from a specific data.gov.in resource.
    Returns a diagnostic dict instead of just records/None.
    """
    url = f"{DATAGOV_BASE_URL}/{resource_id}"
    params = {
        "api-key": DATAGOV_API_KEY,
        "format": "json",
        "limit": 500,
        "offset": 0,
    }
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params, headers=headers)

        response_preview = response.text[:500]
        logger.info(f"data.gov.in resource {resource_id}: HTTP {response.status_code}")

        # ── 401 Unauthorized ──
        if response.status_code == 401:
            return {
                "status": "failed",
                "reason": "Invalid API key (401 Unauthorized)",
                "response_preview": response_preview,
                "fix": "Regenerate API key at https://data.gov.in/user — old keys expire after 12 months"
            }

        # ── 404 Not Found ──
        if response.status_code == 404:
            return {
                "status": "failed",
                "reason": f"Resource ID not found: {resource_id}",
                "fix": "Search data.gov.in for 'CPGRAMS' and copy the current resource ID from the URL"
            }

        # ── 429 Rate Limited ──
        if response.status_code == 429:
            return {
                "status": "failed",
                "reason": "Rate limited (429) — free tier allows 1000 requests/day",
                "fix": "Wait 24 hours or upgrade data.gov.in API plan"
            }

        # ── Other HTTP errors ──
        if response.status_code != 200:
            return {
                "status": "failed",
                "reason": f"HTTP {response.status_code}",
                "response_preview": response_preview
            }

        # ── Parse JSON ──
        try:
            data = response.json()
        except Exception:
            return {
                "status": "failed",
                "reason": "Response is not valid JSON",
                "response_preview": response_preview
            }

        # ── Check for error messages in JSON body ──
        if "Invalid Resource ID" in str(data) or "Unauthorized" in str(data):
            return {
                "status": "failed",
                "reason": "API returned error in JSON body",
                "response_preview": response_preview
            }

        # ── Check for records ──
        if "records" not in data:
            return {
                "status": "failed",
                "reason": "No 'records' field in response — API format may have changed",
                "response_preview": response_preview,
                "available_keys": list(data.keys())[:10]
            }

        records = data.get("records", [])
        if len(records) == 0:
            return {
                "status": "failed",
                "reason": "API returned 0 records",
                "total_count": data.get("total", 0),
                "fix": "Dataset may be empty or resource ID points to wrong dataset"
            }

        # ── Success! ──
        # Log the field names of the first record for debugging
        first_record_fields = list(records[0].keys()) if records else []
        logger.info(f"Record fields: {first_record_fields}")

        return {
            "status": "success",
            "records": records,
            "record_count": len(records),
            "total_available": data.get("total", len(records)),
            "field_names": first_record_fields,
            "resource_id": resource_id
        }

    except httpx.TimeoutException:
        return {
            "status": "failed",
            "reason": "Request timed out (30s) — data.gov.in may be slow or down",
            "fix": "Retry later or use the DARPG website scrape fallback"
        }
    except Exception as e:
        return {
            "status": "failed",
            "reason": f"Network error: {type(e).__name__}: {str(e)}"
        }


# ============================================
# FALLBACK: DARPG WEBSITE SCRAPE
# ============================================
async def _fetch_history_fallback() -> list[dict]:
    """
    Fallback: scrape publicly visible summary from DARPG website.
    No API key needed. Returns list of monthly history dicts.
    """
    urls_to_try = [
        "https://darpg.gov.in/content/cpgrams-statistics",
        "https://darpg.gov.in/cpgrams-statistics",
        "https://pgportal.gov.in/",
    ]
    headers = {"User-Agent": "GrievanceIQ Research Bot/1.0 (Academic Project)"}

    for url in urls_to_try:
        try:
            async with httpx.AsyncClient(timeout=20.0, follow_redirects=True) as client:
                response = await client.get(url, headers=headers)

            if response.status_code != 200:
                logger.info(f"Fallback scrape: {url} returned {response.status_code}")
                continue

            text = response.text

            # Look for table rows with year, month, received, disposed data
            # Pattern 1: "2026 | April | 120,456 | 98,234"
            rows = re.findall(
                r'(\d{4})\s*[-–|]\s*(\w+)[^0-9]*?(\d[\d,]+)[^0-9]*?(\d[\d,]+)',
                text
            )

            if rows:
                results = []
                for match in rows[:15]:  # last 15 months
                    year, month_name, received, disposed = match
                    month_num = _month_name_to_num(month_name)
                    if month_num:
                        results.append({
                            "month": f"{int(year):04d}-{month_num:02d}",
                            "year": int(year),
                            "total_received": int(received.replace(",", "")),
                            "total_disposed": int(disposed.replace(",", "")),
                            "total_pending": max(0, int(received.replace(",", "")) - int(disposed.replace(",", ""))),
                            "avg_resolution_days": None,
                        })
                if results:
                    logger.info(f"Fallback scrape: got {len(results)} months from {url}")
                    return results

            # Pattern 2: look for any large numbers in table-like structures
            table_nums = re.findall(r'>\s*(\d{2,3}[,\d]+)\s*<', text)
            if len(table_nums) >= 6:
                logger.info(f"Fallback scrape: found {len(table_nums)} numeric cells at {url}")
                # Can't reliably parse without structure, log and continue

        except Exception as e:
            logger.warning(f"Fallback scrape failed for {url}: {e}")
            continue

    return []


def _month_name_to_num(name: str) -> int:
    """Convert month name (full or abbreviated) to number."""
    month_names = {
        "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
        "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
        "january": 1, "february": 2, "march": 3, "april": 4,
        "june": 6, "july": 7, "august": 8, "september": 9,
        "october": 10, "november": 11, "december": 12,
    }
    return month_names.get(name.lower().strip(), None)


# ============================================
# LAST RESORT: MOCK HISTORICAL DATA
# ============================================
async def _generate_mock_history() -> dict:
    """Generate realistic mock monthly history based on CPGRAMS averages."""
    import random

    result = {"rows_inserted": 0, "rows_updated": 0, "errors": [], "source": "mock_generated"}
    now = datetime.now(timezone.utc)

    for i in range(15):  # 15 months of data
        dt = now - timedelta(days=30 * i)
        month_part = dt.month
        year_part = dt.year

        recv = random.randint(80000, 150000)
        disp = int(recv * random.uniform(0.85, 0.98))
        pend = recv - disp

        try:
            await db.execute(
                """INSERT INTO monthly_history (month, year, total_received, total_disposed,
                    total_pending, avg_resolution_days, data_source)
                VALUES (?, ?, ?, ?, ?, ?, 'mock_generated')
                ON CONFLICT(month, year) DO UPDATE SET
                    total_received=excluded.total_received,
                    total_disposed=excluded.total_disposed,
                    total_pending=excluded.total_pending,
                    avg_resolution_days=excluded.avg_resolution_days,
                    data_source='mock_generated'""",
                [str(month_part).zfill(2), year_part, recv, disp, pend, round(random.uniform(15, 30), 1)]
            )
            result["rows_inserted"] += 1
        except Exception as e:
            result["errors"].append(str(e))

    return result


# ============================================
# RECORD PARSING
# ============================================
def _parse_month_year(record: dict) -> tuple[str, int] | None:
    """Extract month string (YYYY-MM) and year from a data.gov.in record."""
    month_keys = ["month", "month_year", "period", "report_month", "grievance_month"]
    year_keys = ["year", "report_year", "financial_year"]

    month_val = None
    year_val = None

    for key in month_keys:
        for col in record:
            if col.lower().replace(" ", "_") == key:
                month_val = record[col]
                break
        if month_val:
            break

    for key in year_keys:
        for col in record:
            if col.lower().replace(" ", "_") == key:
                year_val = record[col]
                break
        if year_val:
            break

    if not month_val:
        return None

    month_str = str(month_val).strip()

    # Format: "2025-03" or "2025-3"
    if "-" in month_str and len(month_str) <= 7:
        parts = month_str.split("-")
        if len(parts) == 2 and parts[0].isdigit():
            y = int(parts[0])
            m = int(parts[1])
            return f"{y:04d}-{m:02d}", y

    # Format: "March 2025" or "Mar 2025"
    month_num = _month_name_to_num(month_str.split()[0]) if month_str.split() else None
    if month_num and year_val:
        y = int(str(year_val).strip()[:4])
        return f"{y:04d}-{month_num:02d}", y

    return None


def _extract_numeric(value) -> int:
    """Safely extract an integer from various data.gov.in value formats."""
    if value is None:
        return None
    s = str(value).strip().replace(",", "").replace(" ", "")
    if not s or s == "-" or s.lower() == "na" or s.lower() == "nil":
        return None
    try:
        return int(float(s))
    except (ValueError, TypeError):
        return None


def _extract_float(value) -> float:
    """Safely extract a float from various data.gov.in value formats."""
    if value is None:
        return None
    s = str(value).strip().replace(",", "").replace(" ", "")
    if not s or s == "-" or s.lower() == "na" or s.lower() == "nil":
        return None
    try:
        return round(float(s), 2)
    except (ValueError, TypeError):
        return None


def _map_record_to_history(record: dict) -> dict | None:
    """Map a data.gov.in record to our monthly_history schema."""
    parsed = _parse_month_year(record)
    if not parsed:
        return None

    month_str, year = parsed

    received_keys = [
        "total_received", "grievances_received", "complaints_received",
        "received", "total_complaints", "grievance_received",
    ]
    disposed_keys = [
        "total_disposed", "grievances_disposed", "complaints_disposed",
        "disposed", "resolved", "grievance_disposed",
    ]
    pending_keys = [
        "total_pending", "grievances_pending", "complaints_pending",
        "pending", "grievance_pending",
    ]
    days_keys = [
        "avg_disposal_days", "average_disposal_time", "avg_resolution_days",
        "average_days", "disposal_time",
    ]

    def find_value(keys, rec):
        for key in keys:
            for col in rec:
                if col.lower().replace(" ", "_") == key:
                    return rec[col]
        return None

    total_received = _extract_numeric(find_value(received_keys, record))
    total_disposed = _extract_numeric(find_value(disposed_keys, record))
    total_pending = _extract_numeric(find_value(pending_keys, record))
    avg_days = _extract_float(find_value(days_keys, record))

    if total_received is None and total_disposed is None and total_pending is None:
        return None

    return {
        "month": month_str,
        "year": year,
        "total_received": total_received or 0,
        "total_disposed": total_disposed or 0,
        "total_pending": total_pending or 0,
        "avg_resolution_days": avg_days,
    }


# ============================================
# MAIN ENTRY POINT
# ============================================
async def fetch_datagov_history() -> dict:
    """
    Fetch historical grievance data from data.gov.in and populate monthly_history.
    
    Strategy:
    1. Try data.gov.in API with each known resource ID
    2. If API fails → try DARPG website scrape fallback
    3. If scrape fails → generate realistic mock data
    
    Returns detailed diagnostic dict.
    """
    result = {
        "rows_inserted": 0,
        "rows_updated": 0,
        "total_months": 0,
        "source": None,
        "errors": [],
        "diagnostics": [],
    }

    # ── Step 0: Check API key ──
    if not DATAGOV_API_KEY or DATAGOV_API_KEY == "your-free-api-key-here":
        diag = "DATAGOV_API_KEY not configured or is placeholder"
        result["diagnostics"].append(diag)
        logger.warning(diag + ". Trying fallback sources...")

        # Skip straight to fallback
        fallback_data = await _fetch_history_fallback()
        if fallback_data:
            result["source"] = "darpg_scrape_fallback"
            return await _upsert_history_entries(fallback_data, result)

        # Last resort: mock
        logger.warning("All sources failed. Using mock historical data.")
        mock_result = await _generate_mock_history()
        result.update(mock_result)
        return result

    # ── Step 1: Try data.gov.in API ──
    logger.info("Starting data.gov.in historical data fetch...")
    api_records = []
    api_diagnostics = []

    for resource_id in RESOURCE_IDS:
        fetch_result = await _try_fetch_resource(resource_id)
        api_diagnostics.append({
            "resource_id": resource_id,
            **{k: v for k, v in fetch_result.items() if k != "records"}
        })

        if fetch_result["status"] == "success":
            api_records = fetch_result["records"]
            result["source"] = "datagov_api"
            result["diagnostics"].append(f"Success with resource {resource_id}: {len(api_records)} records")
            logger.info(f"Using resource {resource_id} with {len(api_records)} records")
            break
        else:
            result["diagnostics"].append(
                f"Resource {resource_id}: {fetch_result.get('reason', 'unknown error')}"
            )

    # ── Step 2: Parse API records if we got them ──
    if api_records:
        history_entries = []
        for record in api_records:
            entry = _map_record_to_history(record)
            if entry:
                history_entries.append(entry)

        if history_entries:
            return await _upsert_history_entries(history_entries, result)
        else:
            result["diagnostics"].append(
                f"Got {len(api_records)} records but none could be parsed into monthly data"
            )

    # ── Step 3: Try DARPG website scrape fallback ──
    logger.info("API failed. Trying DARPG website scrape fallback...")
    result["diagnostics"].append("Attempting DARPG website scrape fallback")

    fallback_data = await _fetch_history_fallback()
    if fallback_data:
        result["source"] = "darpg_scrape_fallback"
        result["diagnostics"].append(f"Scrape fallback got {len(fallback_data)} months")
        return await _upsert_history_entries(fallback_data, result)

    # ── Step 4: Last resort — mock data ──
    logger.warning("All real sources failed. Using mock historical data.")
    result["diagnostics"].append("All sources failed — generating mock data")
    
    await _log_pipeline_run("failed", 0,
        error="All data sources failed (API + scrape). Using mock data.",
        extra={"api_diagnostics": api_diagnostics}
    )

    mock_result = await _generate_mock_history()
    result.update(mock_result)
    result["source"] = "mock_generated"
    return result


async def _upsert_history_entries(entries: list[dict], result: dict) -> dict:
    """Deduplicate and upsert a list of monthly history entries into D1."""
    # Deduplicate by month key
    history_map: dict[str, dict] = {}
    for entry in entries:
        key = entry["month"]
        if key in history_map:
            existing = history_map[key]
            existing["total_received"] += entry["total_received"]
            existing["total_disposed"] += entry["total_disposed"]
            existing["total_pending"] += entry["total_pending"]
            if entry.get("avg_resolution_days") is not None:
                if existing.get("avg_resolution_days") is not None:
                    existing["avg_resolution_days"] = round(
                        (existing["avg_resolution_days"] + entry["avg_resolution_days"]) / 2, 2
                    )
                else:
                    existing["avg_resolution_days"] = entry["avg_resolution_days"]
        else:
            history_map[key] = entry

    result["total_months"] = len(history_map)
    data_source = result.get("source", "datagov_api")

    for month_key, entry in sorted(history_map.items()):
        try:
            existing = await db.query(
                "SELECT id FROM monthly_history WHERE month = ?",
                [entry["month"]]
            )

            if existing:
                await db.execute(
                    """UPDATE monthly_history
                       SET total_received = ?, total_disposed = ?, total_pending = ?,
                           avg_resolution_days = ?, data_source = ?,
                           created_at = datetime('now')
                       WHERE month = ?""",
                    [
                        entry["total_received"],
                        entry["total_disposed"],
                        entry["total_pending"],
                        entry.get("avg_resolution_days"),
                        data_source,
                        entry["month"],
                    ],
                )
                result["rows_updated"] += 1
            else:
                await db.execute(
                    """INSERT INTO monthly_history
                       (month, year, total_received, total_disposed, total_pending,
                        avg_resolution_days, data_source)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    [
                        entry["month"],
                        entry.get("year", int(entry["month"][:4])),
                        entry["total_received"],
                        entry["total_disposed"],
                        entry["total_pending"],
                        entry.get("avg_resolution_days"),
                        data_source,
                    ],
                )
                result["rows_inserted"] += 1

        except Exception as e:
            error_msg = f"Failed to upsert month {entry['month']}: {e}"
            logger.error(error_msg)
            result["errors"].append(error_msg)

    total_rows = result["rows_inserted"] + result["rows_updated"]
    await _log_pipeline_run("success", total_rows, extra={"source": data_source, "months": result["total_months"]})

    logger.info(
        f"data.gov.in sync complete: {result['rows_inserted']} inserted, "
        f"{result['rows_updated']} updated, {len(result['errors'])} errors (source: {data_source})"
    )

    return result
