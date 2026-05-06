-- GrievanceIQ Migration 0009: Tracker Redesign
-- Replaces 0008 tracker tables with the v8.0.0 Complaint Journal schema

-- ============================================
-- DROP old tracker tables from 0008
-- ============================================
DROP TABLE IF EXISTS tracker_feedback;
DROP TABLE IF EXISTS tracked_complaints;

-- ============================================
-- TABLE: tracked_complaints
-- Citizens manually log CPGRAMS IDs + filing dates
-- ============================================
CREATE TABLE IF NOT EXISTS tracked_complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cpgrams_id TEXT NOT NULL UNIQUE,
  filing_date TEXT NOT NULL,
  department TEXT,
  user_id INTEGER,
  session_id TEXT,
  days_elapsed INTEGER DEFAULT 0,
  current_milestone TEXT DEFAULT 'day0' CHECK(current_milestone IN ('day0','day15','day25','day30','day45')),
  last_status_report TEXT CHECK(last_status_report IN ('pending','resolved_real','fake_closed')),
  rti_generated INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tracked_complaints_cpgrams ON tracked_complaints(cpgrams_id);
CREATE INDEX IF NOT EXISTS idx_tracked_complaints_session ON tracked_complaints(session_id);
CREATE INDEX IF NOT EXISTS idx_tracked_complaints_user ON tracked_complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_complaints_milestone ON tracked_complaints(current_milestone);

-- ============================================
-- TABLE: tracker_updates
-- Each citizen self-report at Day 15/25/30/45
-- ============================================
CREATE TABLE IF NOT EXISTS tracker_updates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tracked_complaint_id INTEGER NOT NULL,
  day_number INTEGER NOT NULL,
  citizen_report TEXT NOT NULL CHECK(citizen_report IN ('pending','resolved_real','fake_closed')),
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tracked_complaint_id) REFERENCES tracked_complaints(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tracker_updates_complaint ON tracker_updates(tracked_complaint_id);
CREATE INDEX IF NOT EXISTS idx_tracker_updates_report ON tracker_updates(citizen_report);

-- ============================================
-- ALTER complaint_feedback — add cpgrams linkage
-- ============================================
ALTER TABLE complaint_feedback ADD COLUMN cpgrams_id TEXT;
ALTER TABLE complaint_feedback ADD COLUMN source TEXT DEFAULT 'complaint_builder';

CREATE INDEX IF NOT EXISTS idx_feedback_cpgrams ON complaint_feedback(cpgrams_id);
