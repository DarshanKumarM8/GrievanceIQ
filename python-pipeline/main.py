"""
GrievanceIQ Pipeline — FastAPI Main Application
Headless compute backend deployed on Render.com free tier.
Exposes 4 internal endpoints called by Cloudflare Cron Triggers.
Uses Supabase for database operations.
"""

import logging
from datetime import datetime, timezone
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import JSONResponse

from config import INTERNAL_API_KEY, SUPABASE_URL
from services.darpg_fetcher import fetch_darpg_data
from services.rss_monitor import fetch_rss_signals
from services.aggregator import run_aggregator
from services.datagov_fetcher import fetch_datagov_history
from services.db_client import db

# --- Logging Setup ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("grievanceiq-pipeline")

# --- FastAPI App ---
app = FastAPI(
    title="GrievanceIQ Pipeline",
    description="Internal compute backend for GrievanceIQ data pipeline. Not for public use.",
    version="2.0.0",
    docs_url=None,   # Disable Swagger UI in production
    redoc_url=None,   # Disable ReDoc in production
)


# --- Auth Dependency ---
def verify_internal_key(authorization: str = Header(default="")):
    """Validate the internal API key from the Authorization header."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")

    token = authorization[7:]
    if not INTERNAL_API_KEY or token != INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

    return True


# ============================================
# HEALTH CHECK — Rich diagnostics
# ============================================
@app.get("/health")
async def health():
    """Health check with database connectivity info."""
    db_health = await db.health_check()
    return {
        "status": "alive",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "GrievanceIQ Pipeline",
        "version": "2.0.0",
        "database": {
            "backend": db_health.get("backend", "unknown"),
            "status": db_health.get("status", "unknown"),
            "supabase_configured": bool(SUPABASE_URL),
        },
    }


@app.get("/internal/ping")
async def ping():
    """Keep-alive endpoint for Cloudflare cron pings."""
    return {"status": "alive", "service": "grievanceiq-pipeline", "version": "2.0.0"}


# ============================================
# HELPER: Log pipeline run to pipeline_runs table
# ============================================
async def _log_run(job_name: str, status: str, rows: int = 0, error: str = None, details: dict = None):
    """Insert a pipeline run record for observability."""
    try:
        import json
        now = datetime.now(timezone.utc).isoformat()
        await db.insert("pipeline_runs", {
            "job_name": job_name,
            "status": status,
            "started_at": now,
            "completed_at": now,
            "rows_affected": rows,
            "error_message": error,
            "details": json.dumps(details) if details else None,
            "triggered_by": "api",
        })
    except Exception as e:
        logger.warning(f"Failed to log pipeline run: {e}")


# ============================================
# ENDPOINT 2: DARPG PDF Fetcher
# ============================================
@app.post("/internal/fetch-darpg")
async def trigger_darpg_fetch(authorized: bool = Header(default=False, alias="x-internal")):
    """
    Download latest DARPG monthly PDF, extract ministry tables,
    and update ministry_stats.
    """
    verify_internal_key(authorized) if isinstance(authorized, str) else None

    logger.info("Starting DARPG PDF fetch...")
    try:
        result = await fetch_darpg_data()
        status = "success" if not result["errors"] else "partial"
        logger.info(f"DARPG fetch complete: {result['rows_updated']} rows updated")
        await _log_run("darpg_fetch", status, result["rows_updated"], details=result)
        return JSONResponse(
            content={"status": status, "data": result},
            status_code=200,
        )
    except Exception as e:
        logger.exception("DARPG fetch failed")
        await _log_run("darpg_fetch", "failed", error=str(e))
        return JSONResponse(
            content={"status": "error", "error": str(e)},
            status_code=500,
        )


# ============================================
# ENDPOINT 3: RSS News Monitor
# ============================================
@app.post("/internal/fetch-rss")
async def trigger_rss_fetch(authorized: bool = Header(default=False, alias="x-internal")):
    """Fetch 5 RSS news feeds, filter for grievance keywords, and insert new signals."""
    verify_internal_key(authorized) if isinstance(authorized, str) else None

    logger.info("Starting RSS news monitor...")
    try:
        result = await fetch_rss_signals()
        logger.info(f"RSS monitor complete: {result['articles_inserted']} articles inserted")
        await _log_run("rss_monitor", "success", result["articles_inserted"], details=result)
        return JSONResponse(
            content={"status": "success", "data": result},
            status_code=200,
        )
    except Exception as e:
        logger.exception("RSS fetch failed")
        await _log_run("rss_monitor", "failed", error=str(e))
        return JSONResponse(
            content={"status": "error", "error": str(e)},
            status_code=500,
        )


# ============================================
# ENDPOINT 4: Nightly Aggregator
# ============================================
@app.post("/internal/run-aggregator")
async def trigger_aggregator(authorized: bool = Header(default=False, alias="x-internal")):
    """Run TF-IDF trending analysis, fake closure computation, and state stats aggregation."""
    verify_internal_key(authorized) if isinstance(authorized, str) else None

    logger.info("Starting nightly aggregator...")
    try:
        result = await run_aggregator()
        logger.info(
            f"Aggregator complete: {result['trending_issues_updated']} trending, "
            f"{result['fake_closure_ministries_updated']} fake closures, "
            f"{result['state_stats_updated']} states"
        )
        await _log_run("aggregator", "success", result["trending_issues_updated"], details=result)
        return JSONResponse(
            content={"status": "success", "data": result},
            status_code=200,
        )
    except Exception as e:
        logger.exception("Aggregator failed")
        await _log_run("aggregator", "failed", error=str(e))
        return JSONResponse(
            content={"status": "error", "error": str(e)},
            status_code=500,
        )


# ============================================
# ENDPOINT 5: data.gov.in Historical Data Fetch
# ============================================
@app.post("/internal/fetch-datagov")
async def trigger_datagov_fetch(authorized: bool = Header(default=False, alias="x-internal")):
    """Fetch historical grievance statistics and populate monthly_history table."""
    verify_internal_key(authorized) if isinstance(authorized, str) else None

    logger.info("Starting data.gov.in historical data fetch...")
    try:
        result = await fetch_datagov_history()
        status = "success" if not result["errors"] else "partial"
        logger.info(
            f"data.gov.in fetch complete: {result['rows_inserted']} inserted, "
            f"{result.get('rows_updated', 0)} updated"
        )
        await _log_run("datagov_fetch", status, result["rows_inserted"], details=result)
        return JSONResponse(
            content={"status": status, "data": result},
            status_code=200,
        )
    except Exception as e:
        logger.exception("data.gov.in fetch failed")
        await _log_run("datagov_fetch", "failed", error=str(e))
        return JSONResponse(
            content={"status": "error", "error": str(e)},
            status_code=500,
        )


# --- Auth middleware for all /internal/ endpoints ---
@app.middleware("http")
async def auth_middleware(request, call_next):
    """Enforce INTERNAL_API_KEY on all /internal/ endpoints except /internal/ping."""
    path = request.url.path

    if path.startswith("/internal/") and path != "/internal/ping":
        auth_header = request.headers.get("authorization", "")
        if not auth_header.startswith("Bearer "):
            return JSONResponse(
                content={"detail": "Missing Bearer token"},
                status_code=401,
            )
        token = auth_header[7:]
        if not INTERNAL_API_KEY or token != INTERNAL_API_KEY:
            return JSONResponse(
                content={"detail": "Invalid API key"},
                status_code=401,
            )

    response = await call_next(request)
    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
