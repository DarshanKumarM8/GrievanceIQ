"""
GrievanceIQ Pipeline — Nightly Aggregator
Computes trending issues via TF-IDF, fake closure rates, and state stats.
Runs on Render to avoid Cloudflare's 10ms CPU limit for NLP work.
"""

import json
import logging
import re
from datetime import datetime, timezone, timedelta
from collections import Counter
from typing import Any

from services.db_client import db

logger = logging.getLogger(__name__)

async def log_pipeline_run(job: str, status: str, rows: int, error: str = None, extra: dict = None):
    details = {"job": job, "status": status, "rows_updated": rows}
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


def simple_tfidf(texts: list[str], top_n: int = 10) -> list[dict]:
    """
    Lightweight TF-IDF that runs in <1 second on up to 500 documents.
    No scikit-learn dependency needed.
    """
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
        'mera', 'meri', 'mere', 'hai', 'hain', 'ka', 'ki', 'ke', 'se', 'ko',
        'ne', 'par', 'ya', 'aur', 'nahi', 'nahin', 'kya', 'yeh', 'woh'
    }
    
    if not texts:
        return []
    
    # Tokenize all documents
    def tokenize(text: str) -> list[str]:
        text = str(text).lower()
        tokens = re.findall(r'\b[a-z]{3,}\b', text)
        return [t for t in tokens if t not in STOP_WORDS]
    
    # Also extract bigrams (two-word phrases)
    def get_bigrams(tokens: list[str]) -> list[str]:
        return [f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens)-1)]
    
    # Count document frequency for IDF
    doc_freq = Counter()
    all_doc_tokens = []
    
    for text in texts:
        tokens = tokenize(text)
        bigrams = get_bigrams(tokens)
        all_terms = tokens + bigrams
        all_doc_tokens.append(all_terms)
        doc_freq.update(set(all_terms))  # unique terms per doc for IDF
    
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
    return [{"term": t, "score": round(s, 2), 
             "frequency": total_tf[t], 
             "doc_count": doc_freq[t]} for t, s in top_terms]


async def run_aggregator() -> dict[str, Any]:
    """
    Main entry point: runs all aggregation tasks.
    """
    result = {
        "trending_issues_updated": 0,
        "fake_closure_ministries_updated": 0,
        "state_stats_updated": 0,
        "errors": [],
    }
    
    # Try real user complaints first
    week_ago = (datetime.now() - timedelta(days=7)).isoformat()
    complaints_result = await db.query(
        "SELECT raw_text FROM complaints WHERE created_at > ? AND (is_demo = 0 OR is_demo IS NULL) LIMIT 200",
        [week_ago]
    )
    texts = [r["raw_text"] for r in complaints_result if r.get("raw_text")]
    corpus_source = "user_complaints"
    
    # Fallback 1: supplement with RSS signals if < 10 complaints
    if len(texts) < 10:
        signals_result = await db.query(
            "SELECT source_title as content FROM social_signals WHERE captured_at > ? LIMIT 100",
            [week_ago]
        )
        rss_texts = [r["content"] for r in signals_result if r.get("content")]
        texts = texts + rss_texts
        corpus_source = "rss_supplement"
    
    # Fallback 2: use last 30 days of RSS if still < 5
    if len(texts) < 5:
        month_ago = (datetime.now() - timedelta(days=30)).isoformat()
        signals_result = await db.query(
            "SELECT source_title as content FROM social_signals WHERE captured_at > ? LIMIT 100",
            [month_ago]
        )
        rss_texts = [r["content"] for r in signals_result if r.get("content")]
        texts = [r["content"] for r in signals_result if r.get("content")]
        corpus_source = "rss_30day_fallback"
    
    # Never skip — always run with whatever we have
    if len(texts) == 0:
        await log_pipeline_run("aggregator", "failed", 0, error="No text corpus available")
        result["errors"].append("No text corpus available")
        return result
    
    # Run TF-IDF
    top_terms = simple_tfidf(texts, top_n=8)
    
    # Update trending_issues
    updated = 0
    now = datetime.now(timezone.utc)
    week_start = now.strftime("%Y-%m-%d")
    
    for i, term_data in enumerate(top_terms):
        try:
            cluster_id = f"TI-{now.year}-{now.isocalendar()[1]:02d}-{i + 1}"
            topic_name = str(term_data["term"]).title()
            severity = "critical" if term_data["score"] >= 8 else "high" if term_data["score"] >= 4 else "medium"
            
            existing = await db.query(
                "SELECT id FROM trending_issues WHERE topic_name LIKE ? LIMIT 1",
                [f"%{term_data['term'][:20]}%"]
            )
            
            if existing:
                await db.execute(
                    """UPDATE trending_issues SET
                        complaint_count = ?, previous_week_count = 0,
                        spike_factor = ?, is_flagged = ?,
                        severity = ?, week_start = ?, updated_at = datetime('now')
                    WHERE id = ?""",
                    [
                        term_data["frequency"],
                        round(term_data["score"], 2),
                        1 if term_data["score"] > 5 else 0,
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
                    VALUES (?, ?, ?, ?, ?, 0, ?, '[]', '[]', ?, ?, ?)""",
                    [
                        cluster_id, topic_name,
                        json.dumps([term_data["term"]]),
                        f"Detected spike in '{term_data['term']}' mentions: {term_data['frequency']} occurrences.",
                        term_data["frequency"],
                        round(term_data["score"], 2),
                        1 if term_data["score"] > 5 else 0,
                        severity, week_start
                    ]
                )
            updated += 1
        except Exception as e:
            logger.error(f"Failed to upsert trending topic '{term_data['term']}': {e}")
            result["errors"].append(str(e))
            
    result["trending_issues_updated"] = updated

    # Part D: Fake Closure Aggregation
    try:
        fc_count = await _compute_fake_closures()
        result["fake_closure_ministries_updated"] = fc_count
    except Exception as e:
        result["errors"].append(f"Fake closure error: {str(e)}")
        logger.exception("Fake closure computation failed")

    # Part E: State Stats from Platform Complaints
    try:
        state_count = await _compute_state_stats()
        result["state_stats_updated"] = state_count
    except Exception as e:
        result["errors"].append(f"State stats error: {str(e)}")
        logger.exception("State stats computation failed")

    await log_pipeline_run("aggregator", "success", updated,
        extra={"corpus_size": len(texts), "corpus_source": corpus_source})
    
    return result


async def _compute_fake_closures() -> int:
    """
    Part D: Compute fake closure rates from complaint feedback
    and update ministry_stats.
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
        sat_rate = round((satisfaction or 3) * 20, 1)  # Scale 1-5 to 20-100

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


async def _compute_state_stats() -> int:
    """
    Part E: Compute state-level stats from real platform complaints.
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
