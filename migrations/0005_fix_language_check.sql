-- GrievanceIQ Migration 0005: Fix language_preference CHECK constraint
-- Add Marathi (mr) and Kannada (kn) support
-- SQLite does not support ALTER TABLE ... ALTER COLUMN to change CHECK constraints
-- So we recreate the users table with the updated constraint

-- Step 1: Create new table with updated CHECK constraint
CREATE TABLE IF NOT EXISTS users_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  phone TEXT,
  name TEXT,
  language_preference TEXT DEFAULT 'en' CHECK(language_preference IN ('en', 'hi', 'ta', 'te', 'bn', 'mr', 'kn')),
  complaints_filed_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  password_hash TEXT,
  is_verified INTEGER DEFAULT 0,
  last_login_at DATETIME,
  login_count INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1
);

-- Step 2: Copy existing data
INSERT OR IGNORE INTO users_new (id, email, phone, name, language_preference, complaints_filed_count, created_at, updated_at, password_hash, is_verified, last_login_at, login_count, is_active)
SELECT id, email, phone, name,
  CASE WHEN language_preference IN ('en', 'hi', 'ta', 'te', 'bn', 'mr', 'kn') THEN language_preference ELSE 'en' END,
  complaints_filed_count, created_at, updated_at, password_hash, is_verified, last_login_at, login_count, is_active
FROM users;

-- Step 3: Drop old table and rename new table
DROP TABLE IF EXISTS users;
ALTER TABLE users_new RENAME TO users;

-- Step 4: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_language ON users(language_preference);
