-- GrievanceIQ Seed Data
-- Based on real CPGRAMS ministry/department structure and publicly available statistics
-- Data patterns reflect actual Indian grievance landscape

-- ============================================
-- MINISTRY STATS — Top 30 Most Active Ministries
-- Based on DARPG Annual Reports 2023-24
-- ============================================

INSERT OR IGNORE INTO ministry_stats (ministry_name, ministry_code, month, year, complaints_received, complaints_disposed, complaints_pending, avg_resolution_days, official_resolution_rate, citizen_satisfaction_rate, fake_closure_rate, fake_closure_flag) VALUES

-- High Volume Ministries
('Department of Posts', 'DOP', 1, 2026, 42350, 38100, 4250, 18, 90.0, 62.0, 28.0, 0),
('Ministry of Railways', 'MOR', 1, 2026, 38200, 30560, 7640, 35, 80.0, 45.0, 35.0, 1),
('Department of Financial Services', 'DFS', 1, 2026, 35600, 31000, 4600, 28, 87.1, 51.0, 36.1, 1),
('Ministry of Labour and Employment', 'MOLE', 1, 2026, 28400, 24140, 4260, 42, 85.0, 48.0, 37.0, 1),
('Ministry of Health and Family Welfare', 'MOHFW', 1, 2026, 25100, 21335, 3765, 30, 85.0, 55.0, 30.0, 0),
('Ministry of Home Affairs', 'MHA', 1, 2026, 22800, 18240, 4560, 45, 80.0, 40.0, 40.0, 1),
('Department of Land Resources', 'DOLR', 1, 2026, 21500, 17200, 4300, 55, 80.0, 35.0, 45.0, 1),
('Ministry of Housing and Urban Affairs', 'MOHUA', 1, 2026, 19800, 16830, 2970, 38, 85.0, 52.0, 33.0, 1),
('Department of Pensions and Pensioners Welfare', 'DPPW', 1, 2026, 18600, 16740, 1860, 22, 90.0, 65.0, 25.0, 0),
('Ministry of Education', 'MOE', 1, 2026, 17200, 14620, 2580, 33, 85.0, 50.0, 35.0, 1),
('Ministry of Agriculture and Farmers Welfare', 'MOAFW', 1, 2026, 16800, 13440, 3360, 40, 80.0, 42.0, 38.0, 1),
('Ministry of Consumer Affairs, Food and Public Distribution', 'MOCAFPD', 1, 2026, 15500, 13175, 2325, 25, 85.0, 58.0, 27.0, 0),
('Ministry of Electronics and Information Technology', 'MEITY', 1, 2026, 14200, 12780, 1420, 15, 90.0, 70.0, 20.0, 0),
('Ministry of Road Transport and Highways', 'MORTH', 1, 2026, 13800, 10350, 3450, 50, 75.0, 38.0, 37.0, 1),
('Department of Revenue', 'DOR', 1, 2026, 13200, 11220, 1980, 35, 85.0, 48.0, 37.0, 1),
('Ministry of Power', 'MOP', 1, 2026, 12500, 10625, 1875, 28, 85.0, 55.0, 30.0, 0),
('Ministry of Women and Child Development', 'MWCD', 1, 2026, 11800, 9440, 2360, 40, 80.0, 45.0, 35.0, 1),
('Department of Telecommunications', 'DOT', 1, 2026, 11200, 10080, 1120, 18, 90.0, 60.0, 30.0, 0),
('Ministry of Rural Development', 'MORD', 1, 2026, 10500, 8400, 2100, 45, 80.0, 40.0, 40.0, 1),
('Ministry of Social Justice and Empowerment', 'MOSJE', 1, 2026, 9800, 7840, 1960, 42, 80.0, 43.0, 37.0, 1),
('Ministry of Environment, Forest and Climate Change', 'MOEFCC', 1, 2026, 8500, 7225, 1275, 35, 85.0, 50.0, 35.0, 1),
('Ministry of Commerce and Industry', 'MOCI', 1, 2026, 7800, 7020, 780, 20, 90.0, 65.0, 25.0, 0),
('Ministry of Jal Shakti', 'MOJS', 1, 2026, 7200, 5760, 1440, 48, 80.0, 38.0, 42.0, 1),
('Ministry of Petroleum and Natural Gas', 'MOPNG', 1, 2026, 6800, 6120, 680, 22, 90.0, 62.0, 28.0, 0),
('Ministry of External Affairs', 'MEA', 1, 2026, 5500, 4675, 825, 30, 85.0, 55.0, 30.0, 0),
('Ministry of Defence', 'MOD', 1, 2026, 5200, 4160, 1040, 50, 80.0, 42.0, 38.0, 1),
('Ministry of Tribal Affairs', 'MOTA', 1, 2026, 4800, 3840, 960, 45, 80.0, 40.0, 40.0, 1),
('Ministry of Minority Affairs', 'MOMA', 1, 2026, 4200, 3570, 630, 35, 85.0, 48.0, 37.0, 1),
('Ministry of Skill Development and Entrepreneurship', 'MSDE', 1, 2026, 3800, 3420, 380, 25, 90.0, 58.0, 32.0, 1),
('Department of Science and Technology', 'DST', 1, 2026, 2200, 1980, 220, 20, 90.0, 72.0, 18.0, 0);


-- ============================================
-- STATE GRIEVANCE STATS — All 36 States & UTs
-- Based on CPGRAMS state-wise data patterns
-- ============================================

INSERT OR IGNORE INTO state_grievance_stats (state_name, state_code, total_complaints, complaints_resolved, complaints_pending, complaints_fake_closed, resolution_rate, fake_closure_rate, avg_resolution_days, citizen_satisfaction_rate, top_issues, top_departments, month, year) VALUES

('Uttar Pradesh', 'UP', 85200, 59640, 17040, 8520, 70.0, 14.3, 45, 42.0, '["PM-KISAN payments", "Land records", "Pension delays", "Police complaints", "Ration card issues"]', '["Agriculture", "Revenue", "Home Affairs", "Posts", "Food Distribution"]', 1, 2026),
('Maharashtra', 'MH', 52800, 39600, 7920, 5280, 75.0, 13.3, 35, 48.0, '["Property tax", "Water supply", "Road conditions", "Employment", "Bank complaints"]', '["Housing & Urban", "Jal Shakti", "Transport", "Labour", "Financial Services"]', 1, 2026),
('Bihar', 'BR', 41600, 24960, 10400, 6240, 60.0, 25.0, 55, 35.0, '["PM-KISAN", "MGNREGA wages", "Caste certificates", "Teacher recruitment", "Flood relief"]', '["Agriculture", "Rural Development", "Social Justice", "Education", "Home Affairs"]', 1, 2026),
('Rajasthan', 'RJ', 38500, 27720, 5775, 5005, 72.0, 18.1, 40, 44.0, '["Pension delays", "Land disputes", "Water scarcity", "Mining complaints", "Electricity bills"]', '["Pensions", "Revenue", "Jal Shakti", "Mines", "Power"]', 1, 2026),
('Tamil Nadu', 'TN', 34200, 27360, 3420, 3420, 80.0, 12.5, 28, 55.0, '["Property registration", "Water supply", "Health services", "Education", "Transport"]', '["Housing & Urban", "Jal Shakti", "Health", "Education", "Transport"]', 1, 2026),
('Madhya Pradesh', 'MP', 33800, 23660, 6760, 3380, 70.0, 14.3, 42, 43.0, '["Land records", "Ration cards", "PM Awas Yojana", "Forest rights", "Pension"]', '["Revenue", "Food Distribution", "Housing & Urban", "Environment", "Pensions"]', 1, 2026),
('Karnataka', 'KA', 31500, 25200, 3150, 3150, 80.0, 12.5, 30, 52.0, '["IT grievances", "Property tax", "Water supply", "Employment", "Road conditions"]', '["Electronics & IT", "Housing & Urban", "Jal Shakti", "Labour", "Transport"]', 1, 2026),
('West Bengal', 'WB', 29800, 19370, 7450, 2980, 65.0, 15.4, 48, 40.0, '["Ration card", "PM-KISAN", "Employment", "Flood relief", "Health services"]', '["Food Distribution", "Agriculture", "Labour", "Home Affairs", "Health"]', 1, 2026),
('Gujarat', 'GJ', 28200, 22560, 2820, 2820, 80.0, 12.5, 30, 53.0, '["Property disputes", "Industrial complaints", "Water supply", "Road transport", "Power supply"]', '["Revenue", "Commerce", "Jal Shakti", "Transport", "Power"]', 1, 2026),
('Andhra Pradesh', 'AP', 26500, 19875, 3975, 2650, 75.0, 13.3, 35, 48.0, '["Pension delays", "Land records", "Health services", "Agriculture", "Housing"]', '["Pensions", "Revenue", "Health", "Agriculture", "Housing & Urban"]', 1, 2026),
('Telangana', 'TG', 24800, 19840, 2480, 2480, 80.0, 12.5, 28, 55.0, '["IT grievances", "Land records", "Municipal services", "Employment", "Education"]', '["Electronics & IT", "Revenue", "Housing & Urban", "Labour", "Education"]', 1, 2026),
('Kerala', 'KL', 18500, 15725, 1850, 925, 85.0, 5.9, 22, 65.0, '["Pension", "Health services", "Education", "Consumer complaints", "Banking"]', '["Pensions", "Health", "Education", "Consumer Affairs", "Financial Services"]', 1, 2026),
('Delhi', 'DL', 35800, 25060, 7160, 3580, 70.0, 14.3, 38, 45.0, '["Pollution", "Water supply", "Property tax", "Police complaints", "Transport"]', '["Environment", "Jal Shakti", "Housing & Urban", "Home Affairs", "Transport"]', 1, 2026),
('Odisha', 'OD', 16200, 11340, 3240, 1620, 70.0, 14.3, 42, 43.0, '["Cyclone relief", "Land records", "Tribal welfare", "Education", "Health"]', '["Home Affairs", "Revenue", "Tribal Affairs", "Education", "Health"]', 1, 2026),
('Punjab', 'PB', 15800, 12640, 1580, 1580, 80.0, 12.5, 32, 50.0, '["Agriculture", "Drug menace", "Employment", "Power supply", "Health"]', '["Agriculture", "Home Affairs", "Labour", "Power", "Health"]', 1, 2026),
('Haryana', 'HR', 15200, 10640, 3040, 1520, 70.0, 14.3, 38, 45.0, '["Land disputes", "Employment", "Property", "Police complaints", "Education"]', '["Revenue", "Labour", "Housing & Urban", "Home Affairs", "Education"]', 1, 2026),
('Jharkhand', 'JH', 13500, 8100, 3375, 2025, 60.0, 25.0, 52, 35.0, '["Mining issues", "Tribal rights", "Land records", "Education", "Health"]', '["Mines", "Tribal Affairs", "Revenue", "Education", "Health"]', 1, 2026),
('Chhattisgarh', 'CG', 12800, 8960, 2560, 1280, 70.0, 14.3, 42, 43.0, '["Tribal welfare", "Mining", "Land records", "Health", "Education"]', '["Tribal Affairs", "Mines", "Revenue", "Health", "Education"]', 1, 2026),
('Assam', 'AS', 11200, 7840, 2240, 1120, 70.0, 14.3, 45, 42.0, '["Flood relief", "NRC issues", "Land records", "Tea garden labour", "Health"]', '["Home Affairs", "Revenue", "Labour", "Health", "Agriculture"]', 1, 2026),
('Uttarakhand', 'UK', 8500, 6800, 1275, 425, 80.0, 6.3, 30, 55.0, '["Disaster relief", "Land disputes", "Tourism issues", "Forest rights", "Pension"]', '["Home Affairs", "Revenue", "Tourism", "Environment", "Pensions"]', 1, 2026),
('Himachal Pradesh', 'HP', 7200, 5760, 1080, 360, 80.0, 6.3, 28, 58.0, '["Pension delays", "Road conditions", "Apple farming", "Tourism", "Education"]', '["Pensions", "Transport", "Agriculture", "Tourism", "Education"]', 1, 2026),
('Jammu and Kashmir', 'JK', 9800, 6860, 2450, 490, 70.0, 7.1, 45, 45.0, '["Security issues", "Employment", "Land disputes", "Health", "Tourism"]', '["Home Affairs", "Labour", "Revenue", "Health", "Tourism"]', 1, 2026),
('Goa', 'GA', 3200, 2720, 320, 160, 85.0, 5.9, 22, 62.0, '["Mining ban", "Tourism issues", "Property disputes", "Environment", "Transport"]', '["Mines", "Tourism", "Revenue", "Environment", "Transport"]', 1, 2026),
('Tripura', 'TR', 3800, 2660, 760, 380, 70.0, 14.3, 40, 43.0, '["Border issues", "Tribal welfare", "Employment", "Health", "Education"]', '["Home Affairs", "Tribal Affairs", "Labour", "Health", "Education"]', 1, 2026),
('Meghalaya', 'ML', 2800, 1960, 560, 280, 70.0, 14.3, 42, 42.0, '["Mining issues", "Road conditions", "Tribal rights", "Health", "Education"]', '["Mines", "Transport", "Tribal Affairs", "Health", "Education"]', 1, 2026),
('Manipur', 'MN', 3500, 2100, 1050, 350, 60.0, 16.7, 50, 38.0, '["Security issues", "AFSPA complaints", "Employment", "Health", "Infrastructure"]', '["Home Affairs", "Defence", "Labour", "Health", "Transport"]', 1, 2026),
('Nagaland', 'NL', 2200, 1540, 440, 220, 70.0, 14.3, 42, 42.0, '["Employment", "Security", "Infrastructure", "Education", "Health"]', '["Labour", "Home Affairs", "Transport", "Education", "Health"]', 1, 2026),
('Arunachal Pradesh', 'AR', 1800, 1260, 360, 180, 70.0, 14.3, 45, 40.0, '["Border infrastructure", "Tribal welfare", "Road conditions", "Health", "Education"]', '["Home Affairs", "Tribal Affairs", "Transport", "Health", "Education"]', 1, 2026),
('Mizoram', 'MZ', 1500, 1200, 225, 75, 80.0, 6.3, 30, 58.0, '["Infrastructure", "Employment", "Health", "Education", "Border trade"]', '["Transport", "Labour", "Health", "Education", "Commerce"]', 1, 2026),
('Sikkim', 'SK', 1200, 960, 180, 60, 80.0, 6.3, 28, 60.0, '["Tourism", "Infrastructure", "Employment", "Health", "Education"]', '["Tourism", "Transport", "Labour", "Health", "Education"]', 1, 2026),
('Puducherry', 'PY', 2500, 2000, 375, 125, 80.0, 6.3, 28, 58.0, '["Municipal services", "Health", "Education", "Tourism", "Employment"]', '["Housing & Urban", "Health", "Education", "Tourism", "Labour"]', 1, 2026),
('Chandigarh', 'CH', 3500, 2975, 350, 175, 85.0, 5.9, 22, 62.0, '["Property tax", "Municipal services", "Employment", "Health", "Education"]', '["Housing & Urban", "Labour", "Health", "Education", "Revenue"]', 1, 2026),
('Andaman and Nicobar', 'AN', 800, 640, 120, 40, 80.0, 6.3, 30, 58.0, '["Infrastructure", "Shipping", "Tourism", "Health", "Education"]', '["Transport", "Shipping", "Tourism", "Health", "Education"]', 1, 2026),
('Ladakh', 'LA', 600, 420, 150, 30, 70.0, 7.1, 45, 45.0, '["Infrastructure", "Border roads", "Health", "Education", "Tourism"]', '["Transport", "Defence", "Health", "Education", "Tourism"]', 1, 2026),
('Lakshadweep', 'LD', 350, 280, 52, 18, 80.0, 6.4, 30, 58.0, '["Shipping", "Infrastructure", "Health", "Education", "Fisheries"]', '["Shipping", "Transport", "Health", "Education", "Agriculture"]', 1, 2026),
('Dadra Nagar Haveli and Daman Diu', 'DN', 1200, 960, 180, 60, 80.0, 6.3, 30, 55.0, '["Industrial issues", "Infrastructure", "Health", "Education", "Employment"]', '["Commerce", "Transport", "Health", "Education", "Labour"]', 1, 2026);


-- ============================================
-- TRENDING ISSUES — Current Week
-- Simulated but based on real complaint patterns
-- ============================================

INSERT OR IGNORE INTO trending_issues (cluster_id, topic_name, topic_keywords, description, complaint_count, previous_week_count, spike_factor, states_affected, ministries_affected, is_flagged, severity, week_start) VALUES

('TI-2026-01', 'PM-KISAN Payment Failure', '["PM-KISAN", "payment", "eKYC", "Aadhaar", "beneficiary", "installment"]', 'Mass failure in PM-KISAN 16th installment disbursement linked to eKYC verification server downtime. Over 12,000 complaints in one week across northern states.', 12450, 3200, 3.89, '["Uttar Pradesh", "Bihar", "Madhya Pradesh", "Rajasthan"]', '["Ministry of Agriculture and Farmers Welfare"]', 1, 'critical', '2026-01-06'),

('TI-2026-02', 'Railway Ticket Refund Delays', '["railway", "refund", "IRCTC", "ticket", "cancellation", "tatkal"]', 'Systematic refund processing delays for cancelled tatkal tickets. Average refund time exceeded 45 days against policy of 5-7 days.', 8200, 4100, 2.0, '["Delhi", "Maharashtra", "Tamil Nadu", "West Bengal", "Karnataka"]', '["Ministry of Railways"]', 1, 'high', '2026-01-06'),

('TI-2026-03', 'Passport Processing Backlog', '["passport", "Seva", "appointment", "police verification", "renewal", "tatkal"]', 'Severe passport processing delays at regional passport offices. Police verification stage creating 30-45 day bottleneck.', 5600, 3500, 1.6, '["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu"]', '["Ministry of External Affairs"]', 0, 'medium', '2026-01-06'),

('TI-2026-04', 'EPFO Withdrawal Stuck', '["EPFO", "PF", "withdrawal", "claim", "settlement", "KYC"]', 'EPF withdrawal claims stuck in processing for 60+ days. UAN-Aadhaar linking issues causing automatic rejections.', 9800, 5200, 1.88, '["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat"]', '["Ministry of Labour and Employment"]', 1, 'high', '2026-01-06'),

('TI-2026-05', 'Ayushman Bharat Card Rejection', '["Ayushman", "PMJAY", "health card", "hospital", "insurance", "treatment"]', 'Hospital-level rejections of valid Ayushman Bharat cards. Patients denied cashless treatment despite valid PMJAY eligibility.', 4200, 2800, 1.5, '["Uttar Pradesh", "Bihar", "Jharkhand", "Odisha"]', '["Ministry of Health and Family Welfare"]', 0, 'medium', '2026-01-06'),

('TI-2026-06', 'Ration Card Digitization Errors', '["ration", "PDS", "Aadhaar", "seeding", "fair price", "digitization"]', 'Aadhaar seeding errors in PDS database causing legitimate beneficiaries to lose ration entitlements. Disproportionately affecting rural elderly.', 6800, 2200, 3.09, '["Bihar", "Jharkhand", "West Bengal", "Odisha", "Chhattisgarh"]', '["Ministry of Consumer Affairs, Food and Public Distribution"]', 1, 'critical', '2026-01-06'),

('TI-2026-07', 'Pension Disbursement Delay', '["pension", "PPO", "disbursement", "bank", "retired", "CPAO"]', 'Central government pension disbursement delays after retirement. New retirees waiting 3-6 months for first pension credit.', 3800, 2500, 1.52, '["Delhi", "Rajasthan", "Uttar Pradesh", "Maharashtra"]', '["Department of Pensions and Pensioners Welfare"]', 0, 'medium', '2026-01-06'),

('TI-2026-08', 'Electricity Smart Meter Overbilling', '["smart meter", "electricity", "bill", "overbilling", "DISCOM", "prepaid"]', 'Smart prepaid meter installations showing 200-400% higher readings than actual consumption. Multiple DISCOMs affected.', 7500, 1800, 4.17, '["Bihar", "Uttar Pradesh", "Assam", "Jharkhand"]', '["Ministry of Power"]', 1, 'critical', '2026-01-06');


-- ============================================
-- SOCIAL SIGNALS — Current monitoring data
-- ============================================

INSERT OR IGNORE INTO social_signals (platform, keyword_matched, source_url, source_title, post_count_24h, post_count_7d, trending_direction, spike_detected) VALUES

('twitter', 'PM-KISAN payment failed', 'https://twitter.com/search?q=PM-KISAN', '#PMKISAN trending with payment complaints', 2800, 15600, 'rising', 1),
('twitter', 'IRCTC refund delay', 'https://twitter.com/search?q=IRCTC+refund', 'IRCTC refund delay complaints surging', 1200, 7800, 'rising', 1),
('news', 'EPFO withdrawal stuck', 'https://economictimes.com/epfo-claims', 'ET: EPFO claims processing hits 60-day backlog', 45, 280, 'rising', 1),
('twitter', 'smart meter overbilling', 'https://twitter.com/search?q=smart+meter+bill', 'Smart meter billing complaints spike in Bihar', 800, 4200, 'rising', 1),
('news', 'Ayushman Bharat rejection', 'https://thehindu.com/ayushman-bharat', 'The Hindu: Hospital rejections of PMJAY cards increasing', 32, 180, 'stable', 0),
('twitter', 'ration card Aadhaar', 'https://twitter.com/search?q=ration+card+Aadhaar', 'Aadhaar-ration linking errors trending', 1500, 9200, 'rising', 1),
('news', 'passport delay india', 'https://hindustantimes.com/passport', 'HT: Passport processing delays worsen across India', 28, 150, 'rising', 0),
('twitter', 'pension delay retired', 'https://twitter.com/search?q=pension+delay', 'Retired employees complaining about pension delays', 650, 3800, 'stable', 0);


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
