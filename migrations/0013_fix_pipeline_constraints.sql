-- GrievanceIQ Migration 0013: Fix Pipeline Constraints
-- Fixes CHECK constraints on pipeline_runs that reject valid values
-- from the Python pipeline (triggered_by='api', job_name='datagov_fetch').
-- Also adds 'rss' as valid job_name for direct RSS tracking.

-- SQLite doesn't support ALTER TABLE to modify CHECK constraints,
-- so we recreate the table with corrected constraints.

-- Step 1: Rename existing table
ALTER TABLE pipeline_runs RENAME TO pipeline_runs_old;

-- Step 2: Create new table with corrected CHECK constraints
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_name TEXT NOT NULL CHECK(job_name IN ('darpg_fetch', 'rss_monitor', 'rss', 'aggregator', 'datagov_api', 'datagov_fetch', 'ping')),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'success', 'failed', 'partial')),
  started_at TEXT,
  completed_at TEXT,
  rows_affected INTEGER DEFAULT 0,
  error_message TEXT,
  details TEXT,
  triggered_by TEXT DEFAULT 'cron' CHECK(triggered_by IN ('cron', 'manual', 'system', 'api')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- Step 3: Copy existing data
INSERT INTO pipeline_runs (id, job_name, status, started_at, completed_at, rows_affected, error_message, triggered_by, created_at)
SELECT id, job_name, status, started_at, completed_at, rows_affected, error_message, triggered_by, created_at
FROM pipeline_runs_old;

-- Step 4: Drop old table
DROP TABLE pipeline_runs_old;

-- Step 5: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_job ON pipeline_runs(job_name);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_created ON pipeline_runs(created_at);
