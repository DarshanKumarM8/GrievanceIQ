-- GrievanceIQ Database Schema
-- Migration 0008: Tracker & Escalation Timer Tables
-- Supports the Complaint Journal & Escalation Timer feature

-- ============================================
-- TABLE: TRACKED_COMPLAINTS
-- Citizens manually log their CPGRAMS IDs here
-- ============================================
CREATE TABLE IF NOT EXISTS tracked_complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cpgrams_id TEXT NOT NULL,
  filing_date DATE NOT NULL,
  department TEXT,
  user_id INTEGER,
  linked_complaint_id INTEGER,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (linked_complaint_id) REFERENCES complaints(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tracked_cpgrams ON tracked_complaints(cpgrams_id);
CREATE INDEX IF NOT EXISTS idx_tracked_user ON tracked_complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_filing ON tracked_complaints(filing_date);

-- ============================================
-- TABLE: TRACKER_FEEDBACK
-- Citizen self-reported status updates
-- Separate from complaint_feedback to keep clean separation
-- ============================================
CREATE TABLE IF NOT EXISTS tracker_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tracked_complaint_id INTEGER NOT NULL,
  cpgrams_id TEXT NOT NULL,

  -- What the citizen found on CPGRAMS
  official_status TEXT CHECK(official_status IN ('pending', 'resolved', 'disposed', 'unknown')),

  -- What actually happened
  citizen_actual_resolution TEXT NOT NULL CHECK(citizen_actual_resolution IN ('resolved', 'fake_closed', 'pending')),

  -- Details for fake closure
  fake_closure_category TEXT,
  feedback_text TEXT,

  -- Scoring
  satisfaction_score INTEGER CHECK(satisfaction_score BETWEEN 1 AND 5),

  -- Computed
  is_fake_closure INTEGER DEFAULT 0,

  feedback_given_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tracked_complaint_id) REFERENCES tracked_complaints(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tracker_fb_complaint ON tracker_feedback(tracked_complaint_id);
CREATE INDEX IF NOT EXISTS idx_tracker_fb_cpgrams ON tracker_feedback(cpgrams_id);
CREATE INDEX IF NOT EXISTS idx_tracker_fb_fake ON tracker_feedback(is_fake_closure);
