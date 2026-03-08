-- GrievanceIQ Database Schema
-- Migration 0001: Initial Schema
-- All 6 core tables for the platform

-- ============================================
-- TABLE 1: USERS
-- Stores citizen profiles
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  phone TEXT,
  name TEXT,
  language_preference TEXT DEFAULT 'en' CHECK(language_preference IN ('en', 'hi', 'ta', 'te', 'bn')),
  complaints_filed_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- ============================================
-- TABLE 2: COMPLAINTS
-- Core complaint records with AI analysis
-- ============================================
CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  
  -- Original input
  raw_text TEXT NOT NULL,
  language_detected TEXT DEFAULT 'en',
  translated_text TEXT,
  
  -- AI Department Classification
  department_predicted TEXT,
  department_confidence REAL,
  department_2nd TEXT,
  department_2nd_confidence REAL,
  department_3rd TEXT,
  department_3rd_confidence REAL,
  department_reasoning TEXT,
  
  -- AI Quality Analysis
  quality_score_before INTEGER CHECK(quality_score_before BETWEEN 1 AND 10),
  quality_score_after INTEGER CHECK(quality_score_after BETWEEN 1 AND 10),
  missing_elements TEXT, -- JSON array of missing items
  
  -- AI Improved Draft
  improved_draft TEXT,
  
  -- Document Checklist
  documents_checklist TEXT, -- JSON array of required documents
  
  -- CPGRAMS Tracking
  cpgrams_id TEXT,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'filed', 'pending', 'resolved', 'fake_closed', 'escalated')),
  
  -- RTI Escalation
  rti_generated INTEGER DEFAULT 0,
  rti_generated_at DATETIME,
  
  -- Timestamps
  filed_at DATETIME,
  reminder_15_sent INTEGER DEFAULT 0,
  reminder_25_sent INTEGER DEFAULT 0,
  expected_resolution_date DATETIME,
  last_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_cpgrams_id ON complaints(cpgrams_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department_predicted);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON complaints(created_at);

-- ============================================
-- TABLE 3: COMPLAINT_FEEDBACK
-- Citizen-reported outcomes (powers fake closure detection)
-- ============================================
CREATE TABLE IF NOT EXISTS complaint_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  complaint_id INTEGER NOT NULL,
  user_id INTEGER,
  
  -- Official vs Citizen Reality
  official_status TEXT, -- What CPGRAMS says
  citizen_actual_resolution TEXT CHECK(citizen_actual_resolution IN ('resolved', 'partially_resolved', 'not_resolved', 'fake_closed')),
  satisfaction_score INTEGER CHECK(satisfaction_score BETWEEN 1 AND 5),
  feedback_text TEXT,
  
  -- Computed Flag
  is_fake_closure INTEGER DEFAULT 0, -- 1 if officially resolved but citizen says no
  
  feedback_given_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_feedback_complaint ON complaint_feedback(complaint_id);
CREATE INDEX IF NOT EXISTS idx_feedback_fake_closure ON complaint_feedback(is_fake_closure);

-- ============================================
-- TABLE 4: MINISTRY_STATS
-- Monthly performance data per ministry (seeded from CPGRAMS data)
-- ============================================
CREATE TABLE IF NOT EXISTS ministry_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ministry_name TEXT NOT NULL,
  ministry_code TEXT,
  
  -- Time Period
  month INTEGER NOT NULL CHECK(month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  
  -- Official Stats
  complaints_received INTEGER DEFAULT 0,
  complaints_disposed INTEGER DEFAULT 0,
  complaints_pending INTEGER DEFAULT 0,
  avg_resolution_days REAL,
  official_resolution_rate REAL, -- percentage
  
  -- Citizen-Reported Stats (computed from our feedback data)
  citizen_satisfaction_rate REAL, -- percentage
  fake_closure_rate REAL, -- percentage
  fake_closure_flag INTEGER DEFAULT 0, -- 1 if gap > 30%
  
  -- State breakdown (JSON for geographic mapping)
  state_breakdown TEXT, -- JSON: {"UP": 1200, "MH": 800, ...}
  
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(ministry_name, month, year)
);

CREATE INDEX IF NOT EXISTS idx_ministry_stats_name ON ministry_stats(ministry_name);
CREATE INDEX IF NOT EXISTS idx_ministry_stats_period ON ministry_stats(year, month);

-- ============================================
-- TABLE 5: TRENDING_ISSUES
-- Weekly complaint clusters detected by pattern analysis
-- ============================================
CREATE TABLE IF NOT EXISTS trending_issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cluster_id TEXT UNIQUE,
  
  -- Topic Info
  topic_name TEXT NOT NULL,
  topic_keywords TEXT NOT NULL, -- JSON array of keywords
  description TEXT,
  
  -- Volume
  complaint_count INTEGER DEFAULT 0,
  previous_week_count INTEGER DEFAULT 0,
  spike_factor REAL, -- current / previous ratio
  
  -- Geographic Spread
  states_affected TEXT, -- JSON array: ["UP", "Bihar", "Rajasthan"]
  ministries_affected TEXT, -- JSON array
  
  -- Status
  is_flagged INTEGER DEFAULT 0, -- 1 if spike_factor > 2.0
  severity TEXT DEFAULT 'low' CHECK(severity IN ('low', 'medium', 'high', 'critical')),
  
  week_start DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trending_flagged ON trending_issues(is_flagged);
CREATE INDEX IF NOT EXISTS idx_trending_severity ON trending_issues(severity);
CREATE INDEX IF NOT EXISTS idx_trending_week ON trending_issues(week_start);

-- ============================================
-- TABLE 6: SOCIAL_SIGNALS
-- Twitter/news monitoring for early warning
-- ============================================
CREATE TABLE IF NOT EXISTS social_signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL CHECK(platform IN ('twitter', 'news', 'reddit')),
  
  keyword_matched TEXT NOT NULL,
  source_url TEXT,
  source_title TEXT,
  
  -- Volume
  post_count_24h INTEGER DEFAULT 0,
  post_count_7d INTEGER DEFAULT 0,
  
  -- Trend
  trending_direction TEXT CHECK(trending_direction IN ('rising', 'stable', 'falling')),
  spike_detected INTEGER DEFAULT 0,
  
  captured_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_social_platform ON social_signals(platform);
CREATE INDEX IF NOT EXISTS idx_social_keyword ON social_signals(keyword_matched);
CREATE INDEX IF NOT EXISTS idx_social_captured ON social_signals(captured_at);

-- ============================================
-- TABLE 7: STATE_GRIEVANCE_STATS
-- State-level aggregated data for the India map
-- ============================================
CREATE TABLE IF NOT EXISTS state_grievance_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  state_name TEXT NOT NULL,
  state_code TEXT NOT NULL,
  
  -- Grievance Volumes
  total_complaints INTEGER DEFAULT 0,
  complaints_resolved INTEGER DEFAULT 0,
  complaints_pending INTEGER DEFAULT 0,
  complaints_fake_closed INTEGER DEFAULT 0,
  
  -- Rates
  resolution_rate REAL,
  fake_closure_rate REAL,
  avg_resolution_days REAL,
  citizen_satisfaction_rate REAL,
  
  -- Top Issues
  top_issues TEXT, -- JSON array of top 5 issues
  top_departments TEXT, -- JSON array of most complained-about departments
  
  -- Period
  month INTEGER,
  year INTEGER,
  
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(state_code, month, year)
);

CREATE INDEX IF NOT EXISTS idx_state_stats_code ON state_grievance_stats(state_code);
CREATE INDEX IF NOT EXISTS idx_state_stats_period ON state_grievance_stats(year, month);
