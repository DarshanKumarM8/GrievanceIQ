-- Migration 0011_report_month.sql
ALTER TABLE ministry_stats ADD COLUMN report_month TEXT;
ALTER TABLE state_grievance_stats ADD COLUMN report_month TEXT;
