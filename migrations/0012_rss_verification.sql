-- GrievanceIQ Migration 0012: RSS Verification Columns
-- Adds relevance_score and data_source to social_signals for the RSS verification panel.

-- Add relevance_score column (HIGH / MEDIUM)
ALTER TABLE social_signals ADD COLUMN relevance_score TEXT DEFAULT 'MEDIUM';

-- Add data_source column to distinguish RSS-inserted rows from manual/seed data
ALTER TABLE social_signals ADD COLUMN data_source TEXT DEFAULT 'manual';

-- Unique index on source_url to prevent duplicate article inserts
CREATE UNIQUE INDEX IF NOT EXISTS idx_social_signals_url ON social_signals(source_url);
