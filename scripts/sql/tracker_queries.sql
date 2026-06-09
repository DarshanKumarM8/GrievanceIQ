-- ============================================
-- GrievanceIQ v8.0.0 — Tracker SQL Queries
-- Reference file for all tracker-related queries
-- ============================================

-- ============================================
-- 1. UPSERT: Log or update a tracked complaint
-- ============================================
INSERT INTO tracked_complaints (cpgrams_id, filing_date, department, user_id, session_id, days_elapsed, current_milestone)
VALUES (?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(cpgrams_id) DO UPDATE SET
  days_elapsed = excluded.days_elapsed,
  current_milestone = excluded.current_milestone,
  updated_at = datetime('now');


-- ============================================
-- 2. FAKE CLOSURE DETECTION — by department
-- Reads from real citizen self-reports
-- ============================================
SELECT
  t.department,
  COUNT(*) as total_reports,
  SUM(CASE WHEN tu.citizen_report = 'fake_closed' THEN 1 ELSE 0 END) as fake_closures,
  SUM(CASE WHEN tu.citizen_report = 'resolved_real' THEN 1 ELSE 0 END) as real_resolutions,
  ROUND(
    SUM(CASE WHEN tu.citizen_report = 'fake_closed' THEN 1.0 ELSE 0 END) / COUNT(*) * 100,
    1
  ) as fake_closure_rate
FROM tracked_complaints t
JOIN tracker_updates tu ON t.id = tu.tracked_complaint_id
WHERE t.department IS NOT NULL
GROUP BY t.department
HAVING COUNT(*) >= 3
ORDER BY fake_closure_rate DESC;


-- ============================================
-- 3. NIGHTLY AGGREGATOR — update ministry_stats
-- from real tracker self-report data
-- ============================================
UPDATE ministry_stats
SET fake_closure_rate = (
  SELECT ROUND(
    SUM(CASE WHEN tu.citizen_report = 'fake_closed' THEN 1.0 ELSE 0 END) / COUNT(*) * 100,
    1
  )
  FROM tracked_complaints t
  JOIN tracker_updates tu ON t.id = tu.tracked_complaint_id
  WHERE t.department = ministry_stats.ministry_name
    AND tu.created_at >= date('now', '-90 days')
  GROUP BY t.department
  HAVING COUNT(*) >= 3
),
updated_at = datetime('now')
WHERE ministry_name IN (
  SELECT DISTINCT t.department
  FROM tracked_complaints t
  JOIN tracker_updates tu ON t.id = tu.tracked_complaint_id
  WHERE t.department IS NOT NULL
    AND tu.created_at >= date('now', '-90 days')
  GROUP BY t.department
  HAVING COUNT(*) >= 3
);


-- ============================================
-- 4. ADMIN DASHBOARD — tracker usage overview
-- ============================================
SELECT
  current_milestone,
  COUNT(*) as complaints_at_this_stage,
  SUM(CASE WHEN last_status_report = 'fake_closed' THEN 1 ELSE 0 END) as fake_closures_reported,
  SUM(CASE WHEN rti_generated = 1 THEN 1 ELSE 0 END) as rtis_generated
FROM tracked_complaints
GROUP BY current_milestone;


-- ============================================
-- 5. LOOKUP — fetch by CPGRAMS ID with updates
-- ============================================
SELECT tc.*, 
  json_group_array(json_object(
    'day', tu.day_number,
    'report', tu.citizen_report,
    'notes', tu.notes,
    'date', tu.created_at
  )) as update_history
FROM tracked_complaints tc
LEFT JOIN tracker_updates tu ON tc.id = tu.tracked_complaint_id
WHERE tc.cpgrams_id = ?
GROUP BY tc.id;
