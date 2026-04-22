"""
GrievanceIQ Pipeline — FastAPI Main Application
Headless compute backend deployed on Render.com free tier.
Exposes 4 internal endpoints called by Cloudflare Cron Triggers.
"""

import logging
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import JSONResponse

from config import INTERNAL_API_KEY
from services.darpg_fetcher import fetch_darpg_data
from services.rss_monitor import fetch_rss_signals
from services.aggregator import run_aggregator
from services.datagov_fetcher import fetch_datagov_history

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
    version="1.0.0",
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
# ENDPOINT 1: Health Check / Cold Start Warmer
# ============================================
@app.get("/internal/ping")
async def ping():
    """
    Health check endpoint. Cloudflare cron sends a ping 2 minutes
    before heavy jobs to warm up the Render container from cold start.
    """
    return {"status": "alive", "service": "grievanceiq-pipeline", "version": "1.0.0"}


# ============================================
# ENDPOINT 2: DARPG PDF Fetcher
# ============================================
@app.post("/internal/fetch-darpg")
async def trigger_darpg_fetch(authorized: bool = Header(default=False, alias="x-internal")):
    """
    Download latest DARPG monthly PDF, extract ministry tables,
    and update ministry_stats in D1.
    Protected: requires valid INTERNAL_API_KEY.
    """
    # Manual auth check since Header dependency needs custom handling
    verify_internal_key(authorized) if isinstance(authorized, str) else None

    logger.info("Starting DARPG PDF fetch...")
    try:
        result = await fetch_darpg_data()
        status = "success" if not result["errors"] else "partial"
        logger.info(f"DARPG fetch complete: {result['rows_updated']} rows updated")
        return JSONResponse(
            content={
                "status": status,
                "data": result,
            },
            status_code=200,
        )
    except Exception as e:
        logger.exception("DARPG fetch failed")
        return JSONResponse(
            content={"status": "error", "error": str(e)},
            status_code=500,
        )


# ============================================
# ENDPOINT 3: RSS News Monitor
# ============================================
@app.post("/internal/fetch-rss")
async def trigger_rss_fetch(authorized: bool = Header(default=False, alias="x-internal")):
    """
    Fetch 5 RSS news feeds, filter for grievance keywords,
    and insert new signals into social_signals.
    Protected: requires valid INTERNAL_API_KEY.
    """
    verify_internal_key(authorized) if isinstance(authorized, str) else None

    logger.info("Starting RSS news monitor...")
    try:
        result = await fetch_rss_signals()
        logger.info(f"RSS monitor complete: {result['articles_inserted']} articles inserted")
        return JSONResponse(
            content={
                "status": "success",
                "data": result,
            },
            status_code=200,
        )
    except Exception as e:
        logger.exception("RSS fetch failed")
        return JSONResponse(
            content={"status": "error", "error": str(e)},
            status_code=500,
        )


# ============================================
# ENDPOINT 4: Nightly Aggregator
# ============================================
@app.post("/internal/run-aggregator")
async def trigger_aggregator(authorized: bool = Header(default=False, alias="x-internal")):
    """
    Run TF-IDF trending analysis, fake closure computation,
    and state stats aggregation.
    Protected: requires valid INTERNAL_API_KEY.
    """
    verify_internal_key(authorized) if isinstance(authorized, str) else None

    logger.info("Starting nightly aggregator...")
    try:
        result = await run_aggregator()
        logger.info(
            f"Aggregator complete: {result['trending_issues_updated']} trending, "
            f"{result['fake_closure_ministries_updated']} fake closures, "
            f"{result['state_stats_updated']} states"
        )
        return JSONResponse(
            content={
                "status": "success",
                "data": result,
            },
            status_code=200,
        )
    except Exception as e:
        logger.exception("Aggregator failed")
        return JSONResponse(
            content={"status": "error", "error": str(e)},
            status_code=500,
        )


# ============================================
# ENDPOINT 5: data.gov.in Historical Data Fetch
# ============================================
@app.post("/internal/fetch-datagov")
async def trigger_datagov_fetch(authorized: bool = Header(default=False, alias="x-internal")):
    """
    Fetch historical grievance statistics from data.gov.in
    and populate the monthly_history table for time-series charts.
    Protected: requires valid INTERNAL_API_KEY.
    """
    verify_internal_key(authorized) if isinstance(authorized, str) else None

    logger.info("Starting data.gov.in historical data fetch...")
    try:
        result = await fetch_datagov_history()
        status = "success" if not result["errors"] else "partial"
        logger.info(
            f"data.gov.in fetch complete: {result['rows_inserted']} inserted, "
            f"{result.get('rows_updated', 0)} updated"
        )
        return JSONResponse(
            content={
                "status": status,
                "data": result,
            },
            status_code=200,
        )
    except Exception as e:
        logger.exception("data.gov.in fetch failed")
        return JSONResponse(
            content={"status": "error", "error": str(e)},
            status_code=500,
        )


# --- Override auth for all internal endpoints properly ---
@app.middleware("http")
async def auth_middleware(request, call_next):
    """
    Enforce INTERNAL_API_KEY on all /internal/ endpoints except /internal/ping.
    """
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
