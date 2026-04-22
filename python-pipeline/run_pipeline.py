"""
GrievanceIQ Pipeline — Local Runner
Runs all pipeline steps sequentially with timeouts and verbose logging.
"""

import asyncio
import logging
import signal
import sys
import os

# Ensure the pipeline directory is on the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("pipeline-runner")


async def run_with_timeout(coro, name, timeout_sec=120):
    """Run an async function with a timeout."""
    logger.info(f"{'='*60}")
    logger.info(f"Starting: {name}")
    logger.info(f"{'='*60}")
    try:
        result = await asyncio.wait_for(coro, timeout=timeout_sec)
        logger.info(f"✅ {name} completed: {result}")
        return result
    except asyncio.TimeoutError:
        logger.error(f"⏰ {name} TIMED OUT after {timeout_sec}s")
        return {"error": f"Timed out after {timeout_sec}s"}
    except Exception as e:
        logger.error(f"❌ {name} FAILED: {e}")
        return {"error": str(e)}


async def main():
    from services.d1_client import d1

    # Verify DB connection first
    logger.info("Verifying local D1 database connection...")
    if d1.use_local:
        logger.info(f"  Mode: LOCAL SQLite")
        logger.info(f"  Path: {d1.local_db_path}")
        if not d1.local_db_path:
            logger.error("❌ No local DB found! Run 'npm run db:reset' first.")
            return
    else:
        logger.info(f"  Mode: Cloudflare D1 REST API")

    ok = await d1.health_check()
    if not ok:
        logger.error("❌ Database health check failed!")
        return
    logger.info("✅ Database connection OK\n")

    # Step 1: DARPG PDF (with 90s timeout — PDFs can be big)
    from services.darpg_fetcher import fetch_darpg_data
    await run_with_timeout(fetch_darpg_data(), "DARPG PDF Fetch", timeout_sec=90)

    # Step 2: data.gov.in historical data
    from services.datagov_fetcher import fetch_datagov_history
    await run_with_timeout(fetch_datagov_history(), "data.gov.in Historical Fetch", timeout_sec=60)

    # Step 3: RSS news monitor
    from services.rss_monitor import fetch_rss_signals
    await run_with_timeout(fetch_rss_signals(), "RSS News Monitor", timeout_sec=60)

    # Step 4: Aggregator (trending, fake closure, state stats)
    from services.aggregator import run_aggregator
    await run_with_timeout(run_aggregator(), "Nightly Aggregator", timeout_sec=60)

    # Final: show what's in the DB
    logger.info(f"\n{'='*60}")
    logger.info("DATABASE SUMMARY")
    logger.info(f"{'='*60}")

    tables = [
        ("ministry_stats", "SELECT COUNT(*) as cnt FROM ministry_stats"),
        ("state_grievance_stats", "SELECT COUNT(*) as cnt FROM state_grievance_stats"),
        ("trending_issues", "SELECT COUNT(*) as cnt FROM trending_issues"),
        ("social_signals", "SELECT COUNT(*) as cnt FROM social_signals"),
        ("monthly_history", "SELECT COUNT(*) as cnt FROM monthly_history"),
        ("complaints", "SELECT COUNT(*) as cnt FROM complaints"),
    ]

    for name, sql in tables:
        try:
            rows = await d1.query(sql)
            cnt = rows[0]["cnt"] if rows else 0
            logger.info(f"  {name}: {cnt} rows")
        except Exception as e:
            logger.info(f"  {name}: ERROR - {e}")

    logger.info(f"\n✅ Pipeline run complete!")


if __name__ == "__main__":
    asyncio.run(main())
