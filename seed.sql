-- GrievanceIQ Seed Data
-- Based on real CPGRAMS ministry/department structure and publicly available statistics
-- Data patterns reflect actual Indian grievance landscape

-- ============================================
-- SAMPLE COMPLAINTS — Demo data
-- ============================================

INSERT OR IGNORE INTO users (id, email, name, language_preference, complaints_filed_count, is_verified, is_active, login_count) VALUES
(1, 'demo@grievanceiq.in', 'Demo Citizen', 'en', 3, 1, 1, 5),
(2, 'ram.kumar@example.com', 'Ram Kumar', 'hi', 2, 1, 1, 3),
(3, 'priya.nair@example.com', 'Priya Nair', 'en', 1, 1, 1, 1);

INSERT OR IGNORE INTO complaints (id, user_id, raw_text, language_detected, department_predicted, department_confidence, department_2nd, department_2nd_confidence, department_3rd, department_3rd_confidence, quality_score_before, quality_score_after, improved_draft, status, cpgrams_id, created_at) VALUES

(1, 1, 'My PM-KISAN money has not come for 3 months. I have done eKYC also but still showing payment failed. Please help.', 'en', 'Ministry of Agriculture and Farmers Welfare', 94.5, 'Department of Financial Services', 68.2, 'Ministry of Rural Development', 45.0, 5, 9, 'Subject: Non-receipt of PM-KISAN 16th Installment Despite Completed eKYC Verification\n\nRespected Sir/Madam,\n\nI am writing to bring to your urgent attention the non-disbursement of PM-KISAN benefits for the last three consecutive installments (October 2025, December 2025, February 2026).\n\nDetails:\n- Beneficiary Name: [Your Name]\n- Aadhaar Number: [Last 4 digits]\n- Bank Account: [Bank Name, Last 4 digits]\n- State/District: [Your Location]\n- eKYC Status: Completed on [Date]\n- PM-KISAN Portal Status: Payment Failed\n\nDespite completing the mandatory eKYC verification, the PM-KISAN portal continues to display "Payment Failed" status. The total outstanding amount is Rs. 6,000 (three installments of Rs. 2,000 each).\n\nI request immediate investigation into why my verified account is not receiving the entitled benefits and restoration of all pending installments.\n\nRegards,\n[Your Name]', 'filed', 'PMOPG/E/2026/0012345', '2026-01-10 10:30:00'),

(2, 2, 'Main ek retired teacher hoon. Meri pension 4 mahine se nahi aayi hai. PPO number hai lekin bank mein koi paisa nahi aaya. Bahut pareshan hoon.', 'hi', 'Department of Pensions and Pensioners Welfare', 91.2, 'Department of Financial Services', 72.5, 'Ministry of Education', 38.0, 4, 8, 'Subject: Non-disbursement of Pension for 4 Months — Retired Teacher\n\nRespected Sir/Madam,\n\nI am a retired school teacher and my pension has not been credited to my bank account for the past 4 months despite having a valid Pension Payment Order (PPO).\n\nDetails:\n- PPO Number: [Your PPO Number]\n- Retirement Date: [Date]\n- Last Pension Received: [Month/Year]\n- Bank: [Bank Name]\n- Account Number: [Last 4 digits]\n- Pensioner Category: Central Government / State Government Teacher\n\nThis delay is causing severe financial hardship. I request immediate release of all pending pension amounts and regularization of future payments.\n\nRegards,\n[Your Name]', 'pending', 'DOPPW/E/2026/0008721', '2026-01-12 14:15:00'),

(3, 1, 'The road near my house has been dug up for drainage work 6 months ago and never repaired. It is dangerous for pedestrians and vehicles. Multiple accidents have happened.', 'en', 'Ministry of Housing and Urban Affairs', 88.0, 'Ministry of Road Transport and Highways', 78.5, 'Ministry of Home Affairs', 25.0, 6, 9, NULL, 'draft', NULL, '2026-01-15 09:00:00');


-- ============================================
-- COMPLAINT FEEDBACK — Powers fake closure detection
-- ============================================

INSERT OR IGNORE INTO complaint_feedback (complaint_id, user_id, official_status, citizen_actual_resolution, satisfaction_score, feedback_text, is_fake_closure) VALUES

(1, 1, 'Disposed', 'not_resolved', 1, 'They just sent a generic SMS saying complaint is resolved but I still have not received any PM-KISAN payment. Nothing has changed.', 1),
(2, 2, 'Under Process', 'not_resolved', 2, 'At least they acknowledged it, but still no pension in my account after filing complaint 3 weeks ago.', 0);


-- ============================================
-- FLAG DEMO DATA — Isolate from live analytics
-- ============================================

UPDATE complaints SET is_demo = 1 WHERE id IN (1, 2, 3);
