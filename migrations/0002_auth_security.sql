-- GrievanceIQ Migration 0002: Authentication & Security
-- Week 4: Magic-link OTP auth, JWT sessions, rate limiting

-- ============================================
-- TABLE 8: AUTH_OTP — OTP codes for email verification
-- ============================================
CREATE TABLE IF NOT EXISTS auth_otp (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  purpose TEXT DEFAULT 'login' CHECK(purpose IN ('login', 'register', 'reset')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  is_used INTEGER DEFAULT 0,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auth_otp_email ON auth_otp(email);
CREATE INDEX IF NOT EXISTS idx_auth_otp_expires ON auth_otp(expires_at);

-- ============================================
-- TABLE 9: USER_SESSIONS — JWT session tracking
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  is_active INTEGER DEFAULT 1,
  last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON user_sessions(is_active);

-- ============================================
-- TABLE 10: RATE_LIMITS — API rate limiting per IP/user
-- ============================================
CREATE TABLE IF NOT EXISTS rate_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(identifier, endpoint, window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_id ON rate_limits(identifier, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- ============================================
-- TABLE 11: AUDIT_LOG — Security event logging
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  event_type TEXT NOT NULL,
  event_detail TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_type ON audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);

-- ============================================
-- ALTER USERS TABLE — Add auth fields
-- ============================================
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN last_login_at DATETIME;
ALTER TABLE users ADD COLUMN login_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1;

-- ============================================
-- TABLE 12: EMAIL_QUEUE — For email reminders
-- ============================================
CREATE TABLE IF NOT EXISTS email_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  email_type TEXT DEFAULT 'reminder' CHECK(email_type IN ('otp', 'reminder', 'day15', 'day25', 'escalation', 'welcome', 'notification')),
  related_complaint_id INTEGER,
  status TEXT DEFAULT 'queued' CHECK(status IN ('queued', 'sent', 'failed', 'skipped')),
  attempts INTEGER DEFAULT 0,
  sent_at DATETIME,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (related_complaint_id) REFERENCES complaints(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_type ON email_queue(email_type);
