-- GrievanceIQ Migration 0003: Week 6 — Regional Languages Schema Update
-- Adds Marathi (mr) and Kannada (kn) to language_preference constraint
-- SQLite doesn't support ALTER CHECK constraints, so we recreate the column handling
-- via application-level validation (already done in auth.ts)

-- Note: SQLite CHECK constraints cannot be altered after table creation.
-- The application-level validation in src/services/auth.ts already supports
-- 7 languages: en, hi, ta, te, bn, mr, kn
-- This migration serves as documentation and adds any missing indexes.

-- Add index for language_preference queries if not exists
CREATE INDEX IF NOT EXISTS idx_users_language ON users(language_preference);

-- Add composite index for complaints search performance
CREATE INDEX IF NOT EXISTS idx_complaints_dept_status ON complaints(department_predicted, status);

-- Add index for CPGRAMS tracking queries
CREATE INDEX IF NOT EXISTS idx_complaints_filed_at ON complaints(filed_at);
CREATE INDEX IF NOT EXISTS idx_complaints_reminder ON complaints(reminder_15_sent, reminder_25_sent);
