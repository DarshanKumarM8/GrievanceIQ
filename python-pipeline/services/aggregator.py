"""
GrievanceIQ Pipeline — Nightly Aggregator (v2)
Computes trending issues via TF-IDF + spike detection, fake closure rates,
citizen satisfaction, and state stats.

Runs on Render to avoid Cloudflare's 10ms CPU limit for NLP work.

Key improvements over v1:
- Proper week-over-week spike detection (not just TF-IDF score)
- RSS fallback corpus when not enough user complaints
- Detailed output for admin verification panel
- Duration tracking
- Never skips — always runs with available data
"""

import json
import logging
import re
from datetime import datetime, timezone, timedelta
from collections import Counter
from typing import Any, Optional

from services.db_client import db

logger = logging.getLogger(__name__)


# ─── Pipeline Run Logger ───

async def _log_pipeline_run(job: str, status: str, rows: int, error: str = None, details: dict = None):
    """Log to both pipeline_runs and audit_log for observability."""
    now = datetime.now(timezone.utc).isoformat()

    # Log to pipeline_runs
    try:
        await db.insert("pipeline_runs", {
            "job_name": "aggregator",
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

    # Log to audit_log
    try:
        await db.insert("audit_log", {
            "event_type": "pipeline_run",
            "event_detail": json.dumps({
                "job": job, "status": status,
                "rows": rows, "error": error,
            }),
            "created_at": now,
        })
    except Exception:
        pass


# ─── TF-IDF Engine ───

STOP_WORDS = {
    'the','a','an','is','are','was','were','be','been','being',
    'have','has','had','do','does','did','will','would','could',
    'should','may','might','shall','can','need','dare','ought',
    'used','to','of','in','on','at','by','for','with','about',
    'against','between','into','through','during','before','after',
    'above','below','from','up','down','out','off','over','under',
    'again','further','then','once','here','there','when','where',
    'why','how','all','both','each','few','more','most','other',
    'some','such','no','nor','not','only','own','same','so','than',
    'too','very','just','but','if','or','because','as','until',
    'while','i','me','my','myself','we','our','you','your','he',
    'him','his','she','her','they','them','their','this','that',
    'these','those','what','which','who','whom','and','it','its',
    'please','sir','madam','dear','respected','kindly','request',
    'complaint','grievance','issue','problem','matter','regarding',
    'also','said','been','new','one','two','three','government',
    # Hindi stop words
    'mera', 'meri', 'mere', 'hai', 'hain', 'ka', 'ki', 'ke', 'se', 'ko',
    'ne', 'par', 'ya', 'aur', 'nahi', 'nahin', 'kya', 'yeh', 'woh',
}


def _tokenize(text: str) -> list[str]:
    """Tokenize text into words, filtering stop words."""
    text = str(text).lower()
    tokens = re.findall(r'\b[a-z]{3,}\b', text)
    return [t for t in tokens if t not in STOP_WORDS]


def _get_bigrams(tokens: list[str]) -> list[str]:
    """Extract two-word phrases from token list."""
    return [f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens)-1)]


def compute_spike_factors(
    texts_this_week: list[str],
    texts_prev_week: list[str],
    top_n: int = 10,
) -> list[dict]:
    """
    Compare term frequencies between this week and last week.
    Returns terms sorted by spike factor (this_week / prev_week ratio).

    Also computes TF-IDF scores for ranking when spike data is sparse.
    """
    if not texts_this_week:
        return []

    # Count document frequency (unique terms per doc) for each week
    freq_this_week = Counter()
    freq_prev_week = Counter()

    for text in texts_this_week:
        tokens = _tokenize(text)
        bigrams = _get_bigrams(tokens)
        freq_this_week.update(set(tokens + bigrams))

    for text in texts_prev_week:
        tokens = _tokenize(text)
        bigrams = _get_bigrams(tokens)
        freq_prev_week.update(set(tokens + bigrams))

    # Compute spike factors
    spikes = []
    for term, count_this in freq_this_week.most_common(80):
        count_prev = freq_prev_week.get(term, 0)
        # Use max(count_prev, 1) to avoid division by zero
        spike_factor = count_this / max(count_prev, 1)

        # Only include terms that appear in at least 2 docs this week
        # and have a meaningful spike (>= 1.5x) or are totally new
        if count_this >= 2 and (spike_factor >= 1.5 or count_prev == 0):
            spikes.append({
                "term": term,
                "count_this_week": count_this,
                "count_prev_week": count_prev,
                "spike_factor": round(spike_factor, 2),
                "is_new": count_prev == 0,
            })

    # Sort by spike factor descending
    spikes.sort(key=lambda x: x["spike_factor"], reverse=True)
    return spikes[:top_n]


def simple_tfidf(texts: list[str], top_n: int = 10) -> list[dict]:
    """
    Lightweight TF-IDF that runs in <1 second on up to 500 documents.
    Used as fallback when there's no previous week data for spike comparison.
    """
    if not texts:
        return []

    # Count document frequency for IDF
    doc_freq = Counter()
    all_doc_tokens = []

    for text in texts:
        tokens = _tokenize(text)
        bigrams = _get_bigrams(tokens)
        all_terms = tokens + bigrams
        all_doc_tokens.append(all_terms)
        doc_freq.update(set(all_terms))

    # Count total term frequency
    total_tf = Counter()
    for doc_terms in all_doc_tokens:
        total_tf.update(doc_terms)

    n_docs = len(texts)

    # Compute TF-IDF score
    scores = {}
    for term, tf in total_tf.items():
        if doc_freq[term] < 2:  # must appear in at least 2 docs
            continue
        idf = n_docs / doc_freq[term]
        scores[term] = tf * idf

    # Return top N
    top_terms = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
    return [{
        "term": t,
        "score": round(s, 2),
        "frequency": total_tf[t],
        "doc_count": doc_freq[t],
        "spike_factor": round(s / 2, 2),  # Approximate spike from score
        "count_this_week": total_tf[t],
        "count_prev_week": 0,
        "is_new": True,
    } for t, s in top_terms]


# ─── Main Aggregator Entry Point ───

async def run_aggregator() -> dict[str, Any]:
    """
    Main entry point: runs all 3 aggregation tasks.
    Returns detailed output for the admin verification panel.
    """
    run_start = datetime.now(timezone.utc)

    result = {
        "corpus_source": None,
        "corpus_size": 0,
        "corpus_prev_size": 0,
        "top_keywords": [],
        "trending_issues_updated": 0,
        "fake_closure_ministries_updated": 0,
        "satisfaction_ministries_updated": 0,
        "state_stats_updated": 0,
        "errors": [],
        "duration_seconds": 0,
    }

    # ═══════════════════════════════════════════
    # STEP 1: BUILD CORPUS
    # ═══════════════════════════════════════════
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    two_weeks_ago = (datetime.now(timezone.utc) - timedelta(days=14)).isoformat()

    # Try real user complaints first (this week)
    try:
        complaints_this = await db.query(
            "SELECT raw_text FROM complaints WHERE created_at > ? AND (is_demo = 0 OR is_demo IS NULL) LIMIT 200",
            [week_ago]
        )
        texts_this_week = [r["raw_text"] for r in complaints_this if r.get("raw_text")]
    except Exception as e:
        texts_this_week = []
        result["errors"].append(f"Complaints query failed: {str(e)}")

    # Previous week complaints for spike comparison
    try:
        complaints_prev = await db.query(
            "SELECT raw_text FROM complaints WHERE created_at BETWEEN ? AND ? AND (is_demo = 0 OR is_demo IS NULL) LIMIT 200",
            [two_weeks_ago, week_ago]
        )
        texts_prev_week = [r["raw_text"] for r in complaints_prev if r.get("raw_text")]
    except Exception as e:
        texts_prev_week = []
        result["errors"].append(f"Previous week query failed: {str(e)}")

    result["corpus_source"] = "user_complaints"

    # Fallback 1: Supplement with RSS signals if < 10 complaints
    if len(texts_this_week) < 10:
        try:
            signals_result = await db.query(
                "SELECT source_title as content FROM social_signals WHERE captured_at > ? LIMIT 100",
                [week_ago]
            )
            rss_texts = [r["content"] for r in signals_result if r.get("content")]
            texts_this_week = texts_this_week + rss_texts
            result["corpus_source"] = "rss_supplement"
            logger.info(f"RSS supplement: added {len(rss_texts)} articles to corpus")
        except Exception as e:
            result["errors"].append(f"RSS supplement query failed: {str(e)}")

    # Fallback 2: Use last 30 days of RSS if still < 5
    if len(texts_this_week) < 5:
        try:
            month_ago = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
            signals_result = await db.query(
                "SELECT source_title as content FROM social_signals WHERE captured_at > ? LIMIT 100",
                [month_ago]
            )
            rss_texts = [r["content"] for r in signals_result if r.get("content")]
            texts_this_week = texts_this_week + rss_texts
            result["corpus_source"] = "rss_30day_fallback"
            logger.info(f"30-day RSS fallback: added {len(rss_texts)} articles")
        except Exception as e:
            result["errors"].append(f"30-day RSS fallback failed: {str(e)}")

    result["corpus_size"] = len(texts_this_week)
    result["corpus_prev_size"] = len(texts_prev_week)

    # Never crash — if no corpus, report failure but don't raise
    if len(texts_this_week) == 0:
        result["errors"].append("No text corpus available — RSS monitor may not have run yet")
        result["duration_seconds"] = round((datetime.now(timezone.utc) - run_start).total_seconds(), 2)
        await _log_pipeline_run("aggregator", "failed", 0, error="No corpus", details=result)
        return result

    # ═══════════════════════════════════════════
    # STEP 2: SPIKE DETECTION (TF-IDF + week-over-week)
    # ═══════════════════════════════════════════
    if len(texts_prev_week) >= 3:
        # We have enough previous week data for real spike comparison
        spikes = compute_spike_factors(texts_this_week, texts_prev_week, top_n=10)
        logger.info(f"Spike detection: {len(spikes)} terms with spike >= 1.5x")
    else:
        # Not enough previous data — fall back to pure TF-IDF
        spikes = simple_tfidf(texts_this_week, top_n=10)
        logger.info(f"TF-IDF fallback: {len(spikes)} top terms detected")

    result["top_keywords"] = spikes

    # ═══════════════════════════════════════════
    # STEP 3: UPDATE TRENDING ISSUES TABLE
    # ═══════════════════════════════════════════
    now = datetime.now(timezone.utc)
    week_start = now.strftime("%Y-%m-%d")
    updated = 0

    for i, spike in enumerate(spikes[:8]):
        try:
            cluster_id = f"TI-{now.year}-{now.isocalendar()[1]:02d}-{i + 1}"
            topic_name = str(spike["term"]).title()
            spike_factor = spike.get("spike_factor", spike.get("score", 1.0))

            severity = (
                "critical" if spike_factor >= 5.0
                else "high" if spike_factor >= 3.0
                else "medium" if spike_factor >= 1.5
                else "low"
            )

            # Check if topic already exists
            existing = await db.query(
                "SELECT id FROM trending_issues WHERE topic_name LIKE ? LIMIT 1",
                [f"%{spike['term'][:20]}%"]
            )

            if existing:
                await db.execute(
                    """UPDATE trending_issues SET
                        complaint_count = ?, previous_week_count = ?,
                        spike_factor = ?, is_flagged = ?,
                        severity = ?, week_start = ?, updated_at = datetime('now')
                    WHERE id = ?""",
                    [
                        spike.get("count_this_week", spike.get("frequency", 0)),
                        spike.get("count_prev_week", 0),
                        round(spike_factor, 2),
                        1 if spike_factor > 2.0 else 0,
                        severity, week_start, existing[0]["id"]
                    ]
                )
            else:
                await db.execute(
                    """INSERT INTO trending_issues
                        (cluster_id, topic_name, topic_keywords, description,
                         complaint_count, previous_week_count, spike_factor,
                         states_affected, ministries_affected, is_flagged,
                         severity, week_start)
                    VALUES (?, ?, ?, ?, ?, ?, ?, '[]', '[]', ?, ?, ?)""",
                    [
                        cluster_id, topic_name,
                        json.dumps([spike["term"]]),
                        f"Detected spike in '{spike['term']}': "
                        f"{spike.get('count_this_week', 0)} this week vs "
                        f"{spike.get('count_prev_week', 0)} last week "
                        f"({spike_factor}x).",
                        spike.get("count_this_week", spike.get("frequency", 0)),
                        spike.get("count_prev_week", 0),
                        round(spike_factor, 2),
                        1 if spike_factor > 2.0 else 0,
                        severity, week_start
                    ]
                )
            updated += 1
        except Exception as e:
            logger.error(f"Failed to upsert trending topic '{spike['term']}': {e}")
            result["errors"].append(f"Trending upsert: {str(e)[:100]}")

    result["trending_issues_updated"] = updated

    # ═══════════════════════════════════════════
    # STEP 4: FAKE CLOSURE DETECTION
    # ═══════════════════════════════════════════
    try:
        fc_count = await _compute_fake_closures()
        result["fake_closure_ministries_updated"] = fc_count
    except Exception as e:
        result["errors"].append(f"Fake closure error: {str(e)[:100]}")
        logger.exception("Fake closure computation failed")

    # ═══════════════════════════════════════════
    # STEP 5: CITIZEN SATISFACTION + STATE STATS
    # ═══════════════════════════════════════════
    try:
        state_count = await _compute_state_stats()
        result["state_stats_updated"] = state_count
    except Exception as e:
        result["errors"].append(f"State stats error: {str(e)[:100]}")
        logger.exception("State stats computation failed")

    # ═══════════════════════════════════════════
    # STEP 6: LOG AND RETURN
    # ═══════════════════════════════════════════
    duration = (datetime.now(timezone.utc) - run_start).total_seconds()
    result["duration_seconds"] = round(duration, 2)

    status = "success" if not result["errors"] else "partial"
    await _log_pipeline_run("aggregator", status, updated, details=result)

    logger.info(
        f"Aggregator complete: {updated} trending, "
        f"{result['fake_closure_ministries_updated']} fake closures, "
        f"{result['state_stats_updated']} states "
        f"({duration:.1f}s, corpus: {result['corpus_source']}={result['corpus_size']})"
    )

    return result


# ─── Fake Closure Computation ───

async def _compute_fake_closures() -> int:
    """
    Compute fake closure rates from complaint_feedback and update ministry_stats.
    Formula: fake_closure_rate = (fake_reports / total_feedback) * 100
    Also computes citizen_satisfaction_rate.
    """
    rows = await db.query(
        """SELECT
            c.department_predicted as ministry,
            COUNT(*) as total_with_feedback,
            SUM(CASE WHEN f.official_status = 'Disposed'
                      AND f.citizen_actual_resolution != 'resolved'
                 THEN 1 ELSE 0 END) as fake_closures,
            AVG(f.satisfaction_score) as avg_satisfaction
        FROM complaints c
        JOIN complaint_feedback f ON c.id = f.complaint_id
        WHERE f.feedback_given_at > datetime('now', '-30 days')
        GROUP BY c.department_predicted
        HAVING total_with_feedback >= 1""",
    )

    updated = 0
    now = datetime.now(timezone.utc).isoformat()

    for row in rows:
        ministry = row.get("ministry")
        if not ministry:
            continue

        total = row.get("total_with_feedback", 0)
        fake = row.get("fake_closures", 0)
        satisfaction = row.get("avg_satisfaction")

        fake_rate = round((fake / max(total, 1)) * 100, 1)
        sat_rate = round((satisfaction or 3) * 20, 1)  # Scale 1-5 → 20-100

        try:
            await db.execute(
                """UPDATE ministry_stats SET
                    fake_closure_rate = ?,
                    citizen_satisfaction_rate = ?,
                    fake_closure_flag = ?,
                    data_source = 'platform_computed',
                    last_synced_at = ?
                WHERE ministry_name = ?""",
                [
                    fake_rate,
                    sat_rate,
                    1 if fake_rate > 30 else 0,
                    now,
                    ministry,
                ],
            )
            updated += 1
        except Exception as e:
            logger.error(f"Failed to update fake closure for {ministry}: {e}")

    return updated


# ─── State Stats Computation ───

async def _compute_state_stats() -> int:
    """
    Compute state-level stats from real platform complaints.
    """
    rows = await db.query(
        """SELECT
            state_name,
            COUNT(*) as total_complaints,
            SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
            SUM(CASE WHEN status = 'fake_closed' THEN 1 ELSE 0 END) as fake_closed
        FROM complaints
        WHERE created_at > datetime('now', '-30 days')
        AND state_name IS NOT NULL
        AND state_name != ''
        AND (is_demo = 0 OR is_demo IS NULL)
        GROUP BY state_name
        HAVING total_complaints >= 1""",
    )

    updated = 0
    now = datetime.now(timezone.utc).isoformat()

    for row in rows:
        state = row.get("state_name")
        if not state:
            continue

        total = row.get("total_complaints", 0)
        resolved = row.get("resolved", 0)
        fake_closed = row.get("fake_closed", 0)
        resolution_rate = round((resolved / max(total, 1)) * 100, 1)
        fake_rate = round((fake_closed / max(total, 1)) * 100, 1)

        try:
            await db.execute(
                """UPDATE state_grievance_stats SET
                    total_complaints = total_complaints + ?,
                    complaints_resolved = complaints_resolved + ?,
                    complaints_fake_closed = complaints_fake_closed + ?,
                    resolution_rate = ?,
                    fake_closure_rate = ?,
                    data_source = 'platform_computed',
                    last_synced_at = ?
                WHERE state_name = ?""",
                [total, resolved, fake_closed, resolution_rate, fake_rate, now, state],
            )
            updated += 1
        except Exception as e:
            logger.error(f"Failed to update state stats for {state}: {e}")

    return updated
