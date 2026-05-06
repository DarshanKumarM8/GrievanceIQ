-- Query 1: Master Health Check
SELECT 'ministry_stats' as table_name, COUNT(*) as total_rows,
  SUM(CASE WHEN data_source != 'seed' AND last_synced_at IS NOT NULL THEN 1 ELSE 0 END) as rows_with_real_data,
  SUM(CASE WHEN data_source = 'seed' OR last_synced_at IS NULL THEN 1 ELSE 0 END) as rows_still_seeded,
  MAX(last_synced_at) as last_updated FROM ministry_stats
UNION ALL
SELECT 'state_grievance_stats', COUNT(*), 
  SUM(CASE WHEN data_source != 'seed' AND last_synced_at IS NOT NULL THEN 1 ELSE 0 END), 
  SUM(CASE WHEN data_source = 'seed' OR last_synced_at IS NULL THEN 1 ELSE 0 END), 
  MAX(last_synced_at) FROM state_grievance_stats
UNION ALL
SELECT 'trending_issues', COUNT(*), COUNT(*), 0, MAX(week_start) FROM trending_issues
UNION ALL
SELECT 'social_signals', COUNT(*), COUNT(*), 0, MAX(captured_at) FROM social_signals;

-- Query 2: Ministry Stats Live Data Check
SELECT ministry_name, complaints_received, data_source, last_synced_at, 
  CASE WHEN data_source = 'darpg_pdf' AND last_synced_at >= datetime('now', '-35 days') THEN 1 ELSE 0 END as is_live
FROM ministry_stats LIMIT 5;

-- Query 3: FAKE DATA Red Flags
SELECT 'ministry_stats' as tbl, ministry_name as item, 'round numbers' as issue FROM ministry_stats WHERE complaints_received % 1000 = 0 AND complaints_received > 0
UNION ALL
SELECT 'trending_issues', topic_keywords, 'placeholder text' FROM trending_issues WHERE topic_keywords LIKE '%placeholder%' OR topic_keywords LIKE '%test%' OR topic_keywords LIKE '%demo%'
UNION ALL
SELECT 'social_signals', source_title, 'fake source/content' FROM social_signals WHERE platform = 'seed' OR source_title LIKE '%fake%' OR source_title LIKE '%test%'
UNION ALL
SELECT 'complaints', id, 'unflagged demo data' FROM complaints WHERE user_id IN (1,2,3) AND (is_demo IS NULL OR is_demo = 0);

-- Query 4: Audit Logs for Pipeline (fixing details to event_detail)
SELECT id, event_type, event_detail, created_at 
FROM audit_log 
WHERE event_type = 'pipeline_run' 
ORDER BY created_at DESC 
LIMIT 10;
