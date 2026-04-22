-- GrievanceIQ Migration 0006: Dynamic Data Pipeline Columns
-- Week 8: Add pipeline tracking, state collection, demo isolation

-- Add state_name to complaints (optional field for geographic analytics)
ALTER TABLE complaints ADD COLUMN state_name TEXT;

-- Add is_demo flag to isolate seed complaints from live TF-IDF analytics
ALTER TABLE complaints ADD COLUMN is_demo INTEGER DEFAULT 0;

-- Add pipeline tracking to ministry_stats
ALTER TABLE ministry_stats ADD COLUMN last_synced_at TEXT;
ALTER TABLE ministry_stats ADD COLUMN data_source TEXT DEFAULT 'seed';
-- data_source values: 'seed', 'darpg_pdf', 'datagov_api', 'platform_computed'

-- Add pipeline tracking to state_grievance_stats
ALTER TABLE state_grievance_stats ADD COLUMN last_synced_at TEXT;
ALTER TABLE state_grievance_stats ADD COLUMN data_source TEXT DEFAULT 'seed';

-- Index for state-based complaint queries
CREATE INDEX IF NOT EXISTS idx_complaints_state ON complaints(state_name);
CREATE INDEX IF NOT EXISTS idx_complaints_demo ON complaints(is_demo);
