-- GrievanceIQ Migration 0007: Pipeline Run Tracking
-- Week 8: Tables for pipeline execution history and monthly historical data

-- ============================================
-- TABLE: PIPELINE_RUNS — Tracks each pipeline execution
-- ============================================
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_name TEXT NOT NULL CHECK(job_name IN ('darpg_fetch', 'rss_monitor', 'aggregator', 'datagov_api', 'ping')),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'success', 'failed')),
  started_at TEXT,
  completed_at TEXT,
  rows_affected INTEGER DEFAULT 0,
  error_message TEXT,
  triggered_by TEXT DEFAULT 'cron' CHECK(triggered_by IN ('cron', 'manual', 'system')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_job ON pipeline_runs(job_name);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_created ON pipeline_runs(created_at);

-- ============================================
-- TABLE: MONTHLY_HISTORY — Historical time-series from data.gov.in
-- ============================================
CREATE TABLE IF NOT EXISTS monthly_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  total_received INTEGER,
  total_disposed INTEGER,
  total_pending INTEGER,
  avg_resolution_days REAL,
  data_source TEXT DEFAULT 'datagov_api',
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(month, year)
);

CREATE INDEX IF NOT EXISTS idx_monthly_history_period ON monthly_history(year, month);
