-- GrievanceIQ Migration 0010: Impact Score
-- Adds amount_recovered to tracker_updates for the Grievance Impact Score

ALTER TABLE tracker_updates ADD COLUMN amount_recovered INTEGER DEFAULT 0;
