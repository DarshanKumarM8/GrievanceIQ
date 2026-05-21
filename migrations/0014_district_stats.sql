CREATE TABLE district_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  state_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  complaint_count INTEGER DEFAULT 0,
  resolved_count INTEGER DEFAULT 0,
  fake_closure_count INTEGER DEFAULT 0,
  avg_resolution_days REAL,
  top_issues TEXT DEFAULT '[]',
  report_month TEXT,
  data_source TEXT DEFAULT 'darpg_pdf',
  last_synced_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_district_stats_state ON district_stats(state_name);
CREATE INDEX idx_district_stats_district ON district_stats(district_name);
