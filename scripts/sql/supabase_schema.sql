-- GrievanceIQ — Supabase Schema Migration
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- This creates all tables needed by the Python pipeline

-- ============================================
-- TABLE 1: USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT,
  name TEXT,
  language_preference TEXT DEFAULT 'en',
  complaints_filed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 2: COMPLAINTS
-- ============================================
CREATE TABLE IF NOT EXISTS complaints (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  raw_text TEXT NOT NULL,
  language_detected TEXT DEFAULT 'en',
  translated_text TEXT,
  department_predicted TEXT,
  department_confidence REAL,
  department_2nd TEXT,
  department_2nd_confidence REAL,
  department_3rd TEXT,
  department_3rd_confidence REAL,
  department_reasoning TEXT,
  quality_score_before INTEGER,
  quality_score_after INTEGER,
  missing_elements TEXT,
  improved_draft TEXT,
  documents_checklist TEXT,
  cpgrams_id TEXT,
  status TEXT DEFAULT 'draft',
  state_name TEXT,
  rti_generated INTEGER DEFAULT 0,
  rti_generated_at TIMESTAMPTZ,
  filed_at TIMESTAMPTZ,
  reminder_15_sent INTEGER DEFAULT 0,
  reminder_25_sent INTEGER DEFAULT 0,
  expected_resolution_date TIMESTAMPTZ,
  is_demo INTEGER DEFAULT 0,
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department_predicted);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON complaints(created_at);

-- ============================================
-- TABLE 3: COMPLAINT_FEEDBACK
-- ============================================
CREATE TABLE IF NOT EXISTS complaint_feedback (
  id BIGSERIAL PRIMARY KEY,
  complaint_id BIGINT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  official_status TEXT,
  citizen_actual_resolution TEXT,
  satisfaction_score INTEGER,
  feedback_text TEXT,
  is_fake_closure INTEGER DEFAULT 0,
  feedback_given_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 4: MINISTRY_STATS
-- ============================================
CREATE TABLE IF NOT EXISTS ministry_stats (
  id BIGSERIAL PRIMARY KEY,
  ministry_name TEXT NOT NULL,
  ministry_code TEXT,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  complaints_received INTEGER DEFAULT 0,
  complaints_disposed INTEGER DEFAULT 0,
  complaints_pending INTEGER DEFAULT 0,
  avg_resolution_days REAL,
  official_resolution_rate REAL,
  citizen_satisfaction_rate REAL,
  fake_closure_rate REAL,
  fake_closure_flag INTEGER DEFAULT 0,
  state_breakdown TEXT,
  data_source TEXT,
  last_synced_at TIMESTAMPTZ,
  report_month TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ministry_name, month, year)
);

-- ============================================
-- TABLE 5: TRENDING_ISSUES
-- ============================================
CREATE TABLE IF NOT EXISTS trending_issues (
  id BIGSERIAL PRIMARY KEY,
  cluster_id TEXT UNIQUE,
  topic_name TEXT NOT NULL,
  topic_keywords TEXT NOT NULL,
  description TEXT,
  complaint_count INTEGER DEFAULT 0,
  previous_week_count INTEGER DEFAULT 0,
  spike_factor REAL,
  states_affected TEXT,
  ministries_affected TEXT,
  is_flagged INTEGER DEFAULT 0,
  severity TEXT DEFAULT 'low',
  week_start DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 6: SOCIAL_SIGNALS
-- ============================================
CREATE TABLE IF NOT EXISTS social_signals (
  id BIGSERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  keyword_matched TEXT NOT NULL,
  source_url TEXT,
  source_title TEXT,
  post_count_24h INTEGER DEFAULT 0,
  post_count_7d INTEGER DEFAULT 0,
  trending_direction TEXT,
  spike_detected INTEGER DEFAULT 0,
  relevance_score TEXT DEFAULT 'MEDIUM',
  data_source TEXT DEFAULT 'manual',
  captured_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_social_signals_url ON social_signals(source_url);

-- ============================================
-- TABLE 7: STATE_GRIEVANCE_STATS
-- ============================================
CREATE TABLE IF NOT EXISTS state_grievance_stats (
  id BIGSERIAL PRIMARY KEY,
  state_name TEXT NOT NULL,
  state_code TEXT NOT NULL,
  total_complaints INTEGER DEFAULT 0,
  complaints_resolved INTEGER DEFAULT 0,
  complaints_pending INTEGER DEFAULT 0,
  complaints_fake_closed INTEGER DEFAULT 0,
  resolution_rate REAL,
  fake_closure_rate REAL,
  avg_resolution_days REAL,
  citizen_satisfaction_rate REAL,
  top_issues TEXT,
  top_departments TEXT,
  month INTEGER,
  year INTEGER,
  data_source TEXT,
  last_synced_at TIMESTAMPTZ,
  report_month TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(state_code, month, year)
);

-- ============================================
-- TABLE 8: AUDIT_LOG
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_detail TEXT,
  user_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 9: PIPELINE_RUNS
-- ============================================
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id BIGSERIAL PRIMARY KEY,
  job_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_seconds REAL,
  rows_affected INTEGER DEFAULT 0,
  error_message TEXT,
  details JSONB,
  triggered_by TEXT DEFAULT 'cron',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_job ON pipeline_runs(job_name);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_created ON pipeline_runs(created_at);

-- ============================================
-- TABLE 10: MONTHLY_HISTORY (time-series for charts)
-- ============================================
CREATE TABLE IF NOT EXISTS monthly_history (
  id BIGSERIAL PRIMARY KEY,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  total_received INTEGER,
  total_disposed INTEGER,
  total_pending INTEGER,
  avg_resolution_days REAL,
  data_source TEXT DEFAULT 'datagov_api',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(month, year)
);

-- ============================================
-- ROW LEVEL SECURITY — Enable for all tables
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministry_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_grievance_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_history ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (used by Python pipeline)
CREATE POLICY "service_role_all" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON complaints FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON complaint_feedback FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON ministry_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON trending_issues FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON social_signals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON state_grievance_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON audit_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON pipeline_runs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON monthly_history FOR ALL USING (true) WITH CHECK (true);

-- Allow anon key read access (used by Cloudflare Worker)
CREATE POLICY "anon_read" ON ministry_stats FOR SELECT USING (true);
CREATE POLICY "anon_read" ON trending_issues FOR SELECT USING (true);
CREATE POLICY "anon_read" ON social_signals FOR SELECT USING (true);
CREATE POLICY "anon_read" ON state_grievance_stats FOR SELECT USING (true);
CREATE POLICY "anon_read" ON monthly_history FOR SELECT USING (true);
CREATE POLICY "anon_read" ON pipeline_runs FOR SELECT USING (true);
