"""
GrievanceIQ Pipeline — Nightly Aggregator
Computes trending issues via TF-IDF, fake closure rates, and state stats.
Runs on Render to avoid Cloudflare's 10ms CPU limit for NLP work.
"""

import json
import logging
import re
from datetime import datetime, timezone
from collections import Counter
from typing import Any

from services.d1_client import d1

logger = logging.getLogger(__name__)

# --- Stop words for TF-IDF preprocessing ---
STOP_WORDS = {
    "the", "is", "are", "was", "were", "be", "been", "being", "have", "has",
    "had", "do", "does", "did", "will", "would", "could", "should", "shall",
    "may", "might", "can", "must", "a", "an", "and", "or", "but", "in", "on",
    "at", "to", "for", "of", "with", "by", "from", "up", "about", "into",
    "through", "during", "before", "after", "above", "below", "between",
    "out", "off", "over", "under", "again", "further", "then", "once",
    "here", "there", "when", "where", "why", "how", "all", "each", "every",
    "both", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "so", "than", "too", "very", "just",
    "because", "as", "until", "while", "this", "that", "these", "those",
    "it", "its", "i", "me", "my", "we", "our", "you", "your", "he", "him",
    "his", "she", "her", "they", "them", "their", "what", "which", "who",
    "whom", "sir", "madam", "please", "kindly", "respected", "dear",
    # Hindi transliterated stop words
    "mera", "meri", "mere", "hai", "hain", "ka", "ki", "ke", "se", "ko",
    "ne", "par", "ya", "aur", "nahi", "nahin", "kya", "yeh", "woh",
}


async def run_aggregator() -> dict[str, Any]:
    """
    Main entry point: runs all aggregation tasks.
    Returns summary of what was computed and updated.
    """
    result = {
        "trending_issues_updated": 0,
        "fake_closure_ministries_updated": 0,
        "state_stats_updated": 0,
        "errors": [],
    }

    # Part A + B: Trending Issues from complaints + RSS
    try:
        trending_count = await _compute_trending_issues()
        result["trending_issues_updated"] = trending_count
    except Exception as e:
        result["errors"].append(f"Trending issues error: {str(e)}")
        logger.exception("Trending issues computation failed")

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

    # Log to audit
    now = datetime.now(timezone.utc).isoformat()
    try:
        await d1.execute(
            "INSERT INTO audit_log (event_type, event_detail, created_at) VALUES (?, ?, ?)",
            [
                "pipeline_run",
                json.dumps({
                    "job": "aggregator",
                    "status": "success",
                    "trending": result["trending_issues_updated"],
                    "fake_closures": result["fake_closure_ministries_updated"],
                    "states": result["state_stats_updated"],
                }),
                now,
            ],
        )
    except Exception:
        pass

    return result


async def _compute_trending_issues() -> int:
    """
    Part A + B: Compute trending issues from complaint text (TF-IDF)
    and merge with RSS signal counts.
    """
    # Get complaints from last 7 days (excluding demo)
    current_complaints = await d1.query(
        """SELECT raw_text, translated_text, department_predicted, state_name
        FROM complaints
        WHERE created_at > datetime('now', '-7 days')
        AND (is_demo = 0 OR is_demo IS NULL)""",
    )

    # Get complaints from 8-14 days ago (baseline)
    baseline_complaints = await d1.query(
        """SELECT raw_text, translated_text
        FROM complaints
        WHERE created_at > datetime('now', '-14 days')
        AND created_at <= datetime('now', '-7 days')
        AND (is_demo = 0 OR is_demo IS NULL)""",
    )

    # Get RSS signals from last 7 days
    rss_signals = await d1.query(
        """SELECT keyword_matched, source_title
        FROM social_signals
        WHERE captured_at > datetime('now', '-7 days')""",
    )

    # Tokenize and count current week
    current_counts = _count_keywords(current_complaints)
    baseline_counts = _count_keywords(baseline_complaints)

    # Merge with RSS keyword counts
    for signal in rss_signals:
        keywords = (signal.get("keyword_matched") or "").split(", ")
        for kw in keywords:
            kw = kw.strip().lower()
            if kw:
                current_counts[kw] = current_counts.get(kw, 0) + 1

    # Try TF-IDF clustering if we have enough data
    tfidf_terms = []
    if len(current_complaints) >= 5:
        try:
            tfidf_terms = _run_tfidf(current_complaints)
        except Exception as e:
            logger.warning(f"TF-IDF failed (not critical): {e}")

    # Compute spike factors
    trending_topics = []
    all_terms = set(list(current_counts.keys()) + tfidf_terms)

    for term in all_terms:
        current = current_counts.get(term, 0)
        baseline = baseline_counts.get(term, 0)

        if current < 3:  # Minimum threshold
            continue

        spike = current / max(baseline, 1)

        if spike >= 1.5 or current >= 10:
            # Find affected states and ministries
            states = _find_affected_states(term, current_complaints)
            ministries = _find_affected_ministries(term, current_complaints)

            trending_topics.append({
                "term": term,
                "count": current,
                "baseline": baseline,
                "spike": round(spike, 2),
                "states": states,
                "ministries": ministries,
            })

    # Sort by spike factor
    trending_topics.sort(key=lambda t: t["spike"], reverse=True)

    # Update trending_issues table (top 10)
    updated = 0
    now = datetime.now(timezone.utc)
    week_start = now.strftime("%Y-%m-%d")

    for topic in trending_topics[:10]:
        cluster_id = f"TI-{now.year}-{now.isocalendar()[1]:02d}-{updated + 1}"
        topic_name = topic["term"].title()
        severity = "critical" if topic["spike"] >= 4 else "high" if topic["spike"] >= 2 else "medium"

        try:
            # Try to update existing topic with overlapping keywords
            existing = await d1.query(
                "SELECT id, cluster_id FROM trending_issues WHERE topic_name LIKE ? LIMIT 1",
                [f"%{topic['term'][:20]}%"],
            )

            if existing:
                await d1.execute(
                    """UPDATE trending_issues SET
                        complaint_count = ?, previous_week_count = ?,
                        spike_factor = ?, states_affected = ?,
                        ministries_affected = ?, is_flagged = ?,
                        severity = ?, week_start = ?, updated_at = datetime('now')
                    WHERE id = ?""",
                    [
                        topic["count"], topic["baseline"],
                        topic["spike"], json.dumps(topic["states"]),
                        json.dumps(topic["ministries"]),
                        1 if topic["spike"] >= 2 else 0,
                        severity, week_start, existing[0]["id"],
                    ],
                )
            else:
                await d1.execute(
                    """INSERT INTO trending_issues
                        (cluster_id, topic_name, topic_keywords, description,
                         complaint_count, previous_week_count, spike_factor,
                         states_affected, ministries_affected, is_flagged,
                         severity, week_start)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    [
                        cluster_id, topic_name,
                        json.dumps([topic["term"]]),
                        f"Detected spike in '{topic['term']}' mentions: {topic['count']} this week vs {topic['baseline']} last week ({topic['spike']}x increase).",
                        topic["count"], topic["baseline"], topic["spike"],
                        json.dumps(topic["states"]),
                        json.dumps(topic["ministries"]),
                        1 if topic["spike"] >= 2 else 0,
                        severity, week_start,
                    ],
                )
            updated += 1
        except Exception as e:
            logger.error(f"Failed to upsert trending topic '{topic['term']}': {e}")

    return updated


def _count_keywords(complaints: list[dict]) -> dict[str, int]:
    """Tokenize complaint texts and count significant words/bigrams."""
    counts: Counter = Counter()

    for complaint in complaints:
        text = f"{complaint.get('raw_text', '')} {complaint.get('translated_text', '')}"
        tokens = _tokenize(text)

        # Unigrams
        for token in tokens:
            if len(token) >= 3 and token not in STOP_WORDS:
                counts[token] += 1

        # Bigrams
        for i in range(len(tokens) - 1):
            if tokens[i] not in STOP_WORDS and tokens[i + 1] not in STOP_WORDS:
                bigram = f"{tokens[i]} {tokens[i + 1]}"
                if len(bigram) >= 7:
                    counts[bigram] += 1

    return dict(counts)


def _tokenize(text: str) -> list[str]:
    """Simple tokenizer: lowercase, remove punctuation, split."""
    if not text:
        return []
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return [t for t in text.split() if len(t) >= 2]


def _run_tfidf(complaints: list[dict]) -> list[str]:
    """Run TF-IDF vectorization and extract top terms."""
    from sklearn.feature_extraction.text import TfidfVectorizer

    documents = []
    for c in complaints:
        text = f"{c.get('raw_text', '')} {c.get('translated_text', '')}"
        text = re.sub(r"[^\w\s]", " ", text.lower())
        documents.append(text)

    if len(documents) < 2:
        return []

    vectorizer = TfidfVectorizer(
        max_features=50,
        stop_words=list(STOP_WORDS),
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.8,
    )

    try:
        tfidf_matrix = vectorizer.fit_transform(documents)
        feature_names = vectorizer.get_feature_names_out()

        # Get terms with highest average TF-IDF score
        avg_scores = tfidf_matrix.mean(axis=0).A1
        top_indices = avg_scores.argsort()[-20:][::-1]

        return [feature_names[i] for i in top_indices if avg_scores[i] > 0.05]
    except Exception as e:
        logger.warning(f"TF-IDF extraction error: {e}")
        return []


def _find_affected_states(term: str, complaints: list[dict]) -> list[str]:
    """Find which states are affected by a trending term."""
    states = set()
    term_lower = term.lower()
    for c in complaints:
        text = f"{c.get('raw_text', '')} {c.get('translated_text', '')}".lower()
        if term_lower in text:
            state = c.get("state_name")
            if state:
                states.add(state)
    return list(states)[:5]


def _find_affected_ministries(term: str, complaints: list[dict]) -> list[str]:
    """Find which ministries are affected by a trending term."""
    ministries = set()
    term_lower = term.lower()
    for c in complaints:
        text = f"{c.get('raw_text', '')} {c.get('translated_text', '')}".lower()
        if term_lower in text:
            dept = c.get("department_predicted")
            if dept:
                ministries.add(dept)
    return list(ministries)[:3]


async def _compute_fake_closures() -> int:
    """
    Part D: Compute fake closure rates from complaint feedback
    and update ministry_stats.
    """
    rows = await d1.query(
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
            await d1.execute(
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
    rows = await d1.query(
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
            await d1.execute(
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
