import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

export const apiRoutes = new Hono<{ Bindings: Bindings }>()

// ============================================
// HEALTH CHECK
// ============================================
apiRoutes.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'GrievanceIQ', version: '1.0.0' })
})

// ============================================
// DASHBOARD STATS — Aggregate overview
// ============================================
apiRoutes.get('/stats', async (c) => {
  const db = c.env.DB
  try {
    const ministryStats = await db.prepare(
      'SELECT SUM(complaints_received) as total_complaints, SUM(complaints_disposed) as total_resolved, SUM(complaints_pending) as total_pending, AVG(official_resolution_rate) as avg_resolution_rate, AVG(citizen_satisfaction_rate) as avg_satisfaction_rate, AVG(fake_closure_rate) as avg_fake_closure_rate FROM ministry_stats'
    ).first()

    const stateCount = await db.prepare('SELECT COUNT(*) as count FROM state_grievance_stats').first()
    const trendingCount = await db.prepare('SELECT COUNT(*) as count FROM trending_issues WHERE is_flagged = 1').first()
    const complaintCount = await db.prepare('SELECT COUNT(*) as count FROM complaints').first()

    return c.json({
      success: true,
      data: {
        total_complaints: ministryStats?.total_complaints || 0,
        total_resolved: ministryStats?.total_resolved || 0,
        total_pending: ministryStats?.total_pending || 0,
        avg_resolution_rate: Number((ministryStats?.avg_resolution_rate as number || 0).toFixed(1)),
        avg_satisfaction_rate: Number((ministryStats?.avg_satisfaction_rate as number || 0).toFixed(1)),
        avg_fake_closure_rate: Number((ministryStats?.avg_fake_closure_rate as number || 0).toFixed(1)),
        states_tracked: stateCount?.count || 0,
        active_alerts: trendingCount?.count || 0,
        complaints_analyzed: complaintCount?.count || 0,
        ministries_monitored: 92
      }
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// MINISTRY STATS — Department scorecards
// ============================================
apiRoutes.get('/ministries', async (c) => {
  const db = c.env.DB
  const sort = c.req.query('sort') || 'complaints_received'
  const order = c.req.query('order') || 'desc'
  const limit = parseInt(c.req.query('limit') || '30')

  try {
    const validSorts = ['complaints_received', 'official_resolution_rate', 'citizen_satisfaction_rate', 'fake_closure_rate', 'avg_resolution_days']
    const sortCol = validSorts.includes(sort) ? sort : 'complaints_received'
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC'

    const results = await db.prepare(
      `SELECT * FROM ministry_stats ORDER BY ${sortCol} ${sortOrder} LIMIT ?`
    ).bind(limit).all()

    return c.json({ success: true, data: results.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

apiRoutes.get('/ministries/:code', async (c) => {
  const code = c.req.param('code')
  const db = c.env.DB
  try {
    const result = await db.prepare('SELECT * FROM ministry_stats WHERE ministry_code = ?').bind(code).first()
    if (!result) return c.json({ success: false, error: 'Ministry not found' }, 404)
    return c.json({ success: true, data: result })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// STATE STATS — For India Map
// ============================================
apiRoutes.get('/states', async (c) => {
  const db = c.env.DB
  try {
    const results = await db.prepare('SELECT * FROM state_grievance_stats ORDER BY total_complaints DESC').all()
    return c.json({ success: true, data: results.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

apiRoutes.get('/states/:code', async (c) => {
  const code = c.req.param('code')
  const db = c.env.DB
  try {
    const result = await db.prepare('SELECT * FROM state_grievance_stats WHERE state_code = ?').bind(code).first()
    if (!result) return c.json({ success: false, error: 'State not found' }, 404)
    return c.json({ success: true, data: result })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// TRENDING ISSUES — Systemic Issue Radar
// ============================================
apiRoutes.get('/trending', async (c) => {
  const db = c.env.DB
  const flaggedOnly = c.req.query('flagged') === 'true'
  try {
    const query = flaggedOnly
      ? 'SELECT * FROM trending_issues WHERE is_flagged = 1 ORDER BY spike_factor DESC'
      : 'SELECT * FROM trending_issues ORDER BY spike_factor DESC'
    const results = await db.prepare(query).all()
    return c.json({ success: true, data: results.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// SOCIAL SIGNALS — Twitter/News monitoring
// ============================================
apiRoutes.get('/social', async (c) => {
  const db = c.env.DB
  try {
    const results = await db.prepare('SELECT * FROM social_signals ORDER BY captured_at DESC').all()
    return c.json({ success: true, data: results.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// COMPLAINTS — Submit and analyze
// ============================================
apiRoutes.post('/complaints/analyze', async (c) => {
  const body = await c.req.json()
  const { text, language } = body

  if (!text || text.trim().length < 10) {
    return c.json({ success: false, error: 'Complaint text must be at least 10 characters' }, 400)
  }

  // Mock AI Analysis — will be replaced with real Gemini/Claude API
  const analysis = generateMockAnalysis(text, language || 'en')

  // Save to database
  const db = c.env.DB
  try {
    const result = await db.prepare(`
      INSERT INTO complaints (raw_text, language_detected, translated_text, department_predicted, department_confidence, department_2nd, department_2nd_confidence, department_3rd, department_3rd_confidence, department_reasoning, quality_score_before, quality_score_after, missing_elements, improved_draft, documents_checklist, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', datetime('now'))
    `).bind(
      text,
      analysis.language_detected,
      analysis.translated_text,
      analysis.departments[0].name,
      analysis.departments[0].confidence,
      analysis.departments[1].name,
      analysis.departments[1].confidence,
      analysis.departments[2].name,
      analysis.departments[2].confidence,
      analysis.department_reasoning,
      analysis.quality_score_before,
      analysis.quality_score_after,
      JSON.stringify(analysis.missing_elements),
      analysis.improved_draft,
      JSON.stringify(analysis.documents_checklist)
    ).run()

    return c.json({
      success: true,
      data: {
        complaint_id: result.meta.last_row_id,
        ...analysis
      }
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// COMPLAINT TRACKER — Track by CPGRAMS ID
// ============================================
apiRoutes.post('/complaints/track', async (c) => {
  const body = await c.req.json()
  const { cpgrams_id, complaint_id } = body

  if (!cpgrams_id) {
    return c.json({ success: false, error: 'CPGRAMS ID is required' }, 400)
  }

  const db = c.env.DB
  try {
    if (complaint_id) {
      await db.prepare('UPDATE complaints SET cpgrams_id = ?, status = ?, filed_at = datetime(?) WHERE id = ?')
        .bind(cpgrams_id, 'filed', new Date().toISOString(), complaint_id)
        .run()
    }

    // Return tracking info (mock timeline for now)
    const timeline = generateMockTimeline(cpgrams_id)
    return c.json({ success: true, data: timeline })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// FEEDBACK — Citizen outcome reporting
// ============================================
apiRoutes.post('/feedback', async (c) => {
  const body = await c.req.json()
  const { complaint_id, official_status, citizen_actual_resolution, satisfaction_score, feedback_text } = body

  const db = c.env.DB
  try {
    const isFakeClosure = (official_status === 'Disposed' && citizen_actual_resolution !== 'resolved') ? 1 : 0

    await db.prepare(`
      INSERT INTO complaint_feedback (complaint_id, official_status, citizen_actual_resolution, satisfaction_score, feedback_text, is_fake_closure)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(complaint_id, official_status, citizen_actual_resolution, satisfaction_score, feedback_text || '', isFakeClosure).run()

    // Update complaint status
    const newStatus = isFakeClosure ? 'fake_closed' : (citizen_actual_resolution === 'resolved' ? 'resolved' : 'pending')
    await db.prepare('UPDATE complaints SET status = ? WHERE id = ?').bind(newStatus, complaint_id).run()

    return c.json({ success: true, data: { is_fake_closure: isFakeClosure === 1 } })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// RTI GENERATOR — Generate RTI application
// ============================================
apiRoutes.post('/rti/generate', async (c) => {
  const body = await c.req.json()
  const { complaint_id, complainant_name, complaint_summary, department, cpgrams_id, filing_date } = body

  const rtiDraft = generateRTIDraft({
    complainant_name: complainant_name || '[Your Name]',
    complaint_summary: complaint_summary || 'Details of complaint',
    department: department || 'Concerned Department',
    cpgrams_id: cpgrams_id || '[CPGRAMS ID]',
    filing_date: filing_date || '[Filing Date]'
  })

  // Mark complaint as escalated if we have an ID
  if (complaint_id) {
    const db = c.env.DB
    try {
      await db.prepare('UPDATE complaints SET rti_generated = 1, rti_generated_at = datetime(?), status = ? WHERE id = ?')
        .bind(new Date().toISOString(), 'escalated', complaint_id)
        .run()
    } catch (e) { /* non-critical */ }
  }

  return c.json({ success: true, data: rtiDraft })
})


// ============================================
// MOCK AI FUNCTIONS — Replace with real API later
// ============================================

function generateMockAnalysis(text: string, language: string) {
  const lowerText = text.toLowerCase()

  // Simple keyword-based department routing
  const departmentMap: Record<string, { name: string; confidence: number; reason: string }[]> = {
    'pension|ppO|retired|retirement': [
      { name: 'Department of Pensions and Pensioners Welfare', confidence: 91.2, reason: 'Complaint mentions pension-related keywords' },
      { name: 'Department of Financial Services', confidence: 68.5, reason: 'Banking/financial aspect of pension disbursement' },
      { name: 'Ministry of Education', confidence: 35.0, reason: 'If retired from education sector' }
    ],
    'pm.kisan|kisan|farmer|agriculture|crop|mandi|msp': [
      { name: 'Ministry of Agriculture and Farmers Welfare', confidence: 94.5, reason: 'Agricultural scheme/farmer welfare complaint' },
      { name: 'Department of Financial Services', confidence: 62.0, reason: 'Payment/banking related issue' },
      { name: 'Ministry of Rural Development', confidence: 45.0, reason: 'Rural welfare aspect' }
    ],
    'railway|train|irctc|ticket|platform|coach': [
      { name: 'Ministry of Railways', confidence: 96.0, reason: 'Railway service complaint' },
      { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 40.0, reason: 'Consumer rights aspect' },
      { name: 'Ministry of Commerce and Industry', confidence: 25.0, reason: 'Service quality regulation' }
    ],
    'passport|visa|embassy|consulate': [
      { name: 'Ministry of External Affairs', confidence: 95.0, reason: 'Passport/visa services complaint' },
      { name: 'Ministry of Home Affairs', confidence: 55.0, reason: 'Immigration/police verification' },
      { name: 'Ministry of Electronics and Information Technology', confidence: 30.0, reason: 'Online portal issues' }
    ],
    'road|highway|pothole|bridge|transport': [
      { name: 'Ministry of Road Transport and Highways', confidence: 90.0, reason: 'Road infrastructure complaint' },
      { name: 'Ministry of Housing and Urban Affairs', confidence: 75.0, reason: 'Urban road maintenance' },
      { name: 'Ministry of Home Affairs', confidence: 30.0, reason: 'Safety/accident aspect' }
    ],
    'electricity|power|bill|meter|discom': [
      { name: 'Ministry of Power', confidence: 92.0, reason: 'Electricity/power supply complaint' },
      { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 55.0, reason: 'Consumer billing dispute' },
      { name: 'Ministry of Electronics and Information Technology', confidence: 30.0, reason: 'Smart meter/digital billing' }
    ],
    'ration|pds|fair price|food|hunger': [
      { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 93.0, reason: 'Public distribution system complaint' },
      { name: 'Ministry of Agriculture and Farmers Welfare', confidence: 45.0, reason: 'Food security/agriculture link' },
      { name: 'Ministry of Rural Development', confidence: 40.0, reason: 'Rural food security' }
    ],
    'epfo|pf|provident fund|esi|labour': [
      { name: 'Ministry of Labour and Employment', confidence: 94.0, reason: 'Labour/employment benefit complaint' },
      { name: 'Department of Financial Services', confidence: 60.0, reason: 'Fund disbursement issue' },
      { name: 'Ministry of Commerce and Industry', confidence: 30.0, reason: 'Employer compliance' }
    ],
    'hospital|doctor|medicine|health|ayushman': [
      { name: 'Ministry of Health and Family Welfare', confidence: 92.0, reason: 'Healthcare service complaint' },
      { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 45.0, reason: 'Drug pricing/consumer rights' },
      { name: 'Ministry of Social Justice and Empowerment', confidence: 35.0, reason: 'Healthcare access equity' }
    ],
    'school|college|university|education|exam|teacher': [
      { name: 'Ministry of Education', confidence: 93.0, reason: 'Education system complaint' },
      { name: 'Ministry of Skill Development and Entrepreneurship', confidence: 50.0, reason: 'Skill/vocational training' },
      { name: 'Ministry of Social Justice and Empowerment', confidence: 35.0, reason: 'Educational equity' }
    ]
  }

  // Find best match
  let departments = [
    { name: 'Ministry of Home Affairs', confidence: 65.0, reason: 'General administrative complaint — review department suggestion' },
    { name: 'Department of Administrative Reforms', confidence: 55.0, reason: 'Government service delivery issue' },
    { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 40.0, reason: 'Consumer rights aspect' }
  ]

  for (const [pattern, depts] of Object.entries(departmentMap)) {
    const regex = new RegExp(pattern, 'i')
    if (regex.test(lowerText)) {
      departments = depts
      break
    }
  }

  // Quality scoring
  const hasSpecificDate = /\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d+ (month|day|week|year)/.test(text)
  const hasReferenceNumber = /[A-Z]{2,}[\/-]\w+[\/-]\d+|\d{6,}/.test(text)
  const hasLocation = /(district|city|state|village|block|pin|ward)/i.test(text)
  const hasAmount = /(rs\.?|₹|rupee|lakh|crore|\d+,\d+)/i.test(text)
  const wordCount = text.split(/\s+/).length

  let qualityBefore = 3
  if (hasSpecificDate) qualityBefore += 1
  if (hasReferenceNumber) qualityBefore += 2
  if (hasLocation) qualityBefore += 1
  if (hasAmount) qualityBefore += 1
  if (wordCount > 30) qualityBefore += 1
  if (wordCount > 60) qualityBefore += 1
  qualityBefore = Math.min(qualityBefore, 8)

  const missingElements: string[] = []
  if (!hasSpecificDate) missingElements.push('Specific dates (when the problem started)')
  if (!hasReferenceNumber) missingElements.push('Reference/application numbers')
  if (!hasLocation) missingElements.push('Location details (state, district, pin code)')
  if (!hasAmount) missingElements.push('Financial amounts involved')
  if (wordCount < 30) missingElements.push('More detailed description of the issue')
  if (!/previous.*complaint|earlier.*filed/i.test(text)) missingElements.push('Previous complaint references (if any)')

  // Generate improved draft
  const improvedDraft = `Subject: Formal Grievance Regarding ${departments[0].name.replace('Ministry of ', '').replace('Department of ', '')} — Urgent Action Required

Respected Sir/Madam,

I am writing to formally register my grievance regarding the following matter that requires your immediate attention.

**Issue Summary:**
${text}

**Additional Details Required for Processing:**
- Applicant Name: [Your Full Name]
- Contact: [Phone Number / Email]
- Address: [Full Address with Pin Code]
- State/District: [Your State and District]
${!hasReferenceNumber ? '- Reference/Application Number: [If applicable]\n' : ''}${!hasSpecificDate ? '- Date of Issue: [When the problem started]\n' : ''}${!hasAmount ? '- Amount Involved: [If applicable, in Rupees]\n' : ''}- Previous Complaints Filed: [CPGRAMS ID / Other reference, if any]

**Expected Resolution:**
I request that this matter be investigated promptly and resolved within the stipulated time frame of 30 days as per CPGRAMS guidelines. I am prepared to provide any additional documentation required.

**Note:** If this complaint is not addressed within 30 days, I reserve the right to file an RTI application under the Right to Information Act, 2005, seeking details of the action taken on this grievance.

Yours sincerely,
[Your Name]
[Date]`

  // Document checklist based on department
  const baseDocuments = [
    'Government-issued photo ID (Aadhaar Card / Voter ID / PAN)',
    'Address proof',
    'Written complaint copy for your records'
  ]

  const deptDocuments: Record<string, string[]> = {
    'Pension': ['PPO (Pension Payment Order) copy', 'Last pension slip', 'Bank statement showing pension credits', 'Retirement order copy'],
    'Agriculture': ['PM-KISAN registration details', 'Aadhaar-linked bank passbook', 'Land ownership documents (Khasra/Khatauni)', 'eKYC completion screenshot'],
    'Railway': ['Ticket/PNR number', 'IRCTC account details', 'Payment receipt/transaction ID', 'Screenshot of booking/refund status'],
    'Health': ['Ayushman Bharat card', 'Hospital treatment records', 'Medical bills/receipts', 'Doctor referral letter'],
    'Labour': ['UAN (Universal Account Number)', 'EPF passbook', 'Employer details', 'KYC document copies submitted to EPFO'],
    'Power': ['Electricity bill copies (last 3 months)', 'Consumer number / meter number', 'Smart meter installation receipt', 'Reading photographs'],
    'Food': ['Ration card copy', 'Aadhaar card', 'Fair price shop details', 'Previous month ration receipts']
  }

  let specificDocs = baseDocuments
  for (const [key, docs] of Object.entries(deptDocuments)) {
    if (departments[0].name.toLowerCase().includes(key.toLowerCase()) || text.toLowerCase().includes(key.toLowerCase())) {
      specificDocs = [...baseDocuments, ...docs]
      break
    }
  }

  return {
    language_detected: language || 'en',
    translated_text: language !== 'en' ? text : null,
    departments: departments.map(d => ({
      name: d.name,
      confidence: d.confidence,
      reason: d.reason
    })),
    department_reasoning: `Based on keyword analysis of your complaint, the primary department identified is ${departments[0].name} with ${departments[0].confidence}% confidence. ${departments[0].reason}.`,
    quality_score_before: qualityBefore,
    quality_score_after: Math.min(qualityBefore + 3, 10),
    missing_elements: missingElements,
    improved_draft: improvedDraft,
    documents_checklist: specificDocs
  }
}

function generateMockTimeline(cpgramsId: string) {
  const now = new Date()
  const filed = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000) // 20 days ago

  return {
    cpgrams_id: cpgramsId,
    status: 'pending',
    expected_resolution_date: new Date(filed.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    days_elapsed: 20,
    days_remaining: 10,
    timeline: [
      { date: filed.toISOString().split('T')[0], event: 'Complaint Filed', status: 'completed', description: `Complaint ${cpgramsId} registered on CPGRAMS portal` },
      { date: new Date(filed.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], event: 'Forwarded to Department', status: 'completed', description: 'Complaint forwarded to concerned ministry/department' },
      { date: new Date(filed.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], event: 'Under Review', status: 'completed', description: 'Department has acknowledged and is reviewing the complaint' },
      { date: new Date(filed.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], event: 'Day 15 Reminder', status: 'active', description: 'Half of the standard 30-day resolution window has passed. Check status on CPGRAMS.' },
      { date: new Date(filed.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], event: 'Day 25 Reminder', status: 'upcoming', description: 'Only 5 days remaining. If unresolved, prepare RTI application.' },
      { date: new Date(filed.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], event: 'Resolution Deadline', status: 'upcoming', description: 'Standard 30-day window expires. RTI escalation option available.' }
    ],
    reminders: {
      day_15: { sent: true, date: new Date(filed.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      day_25: { sent: false, date: new Date(filed.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    }
  }
}

function generateRTIDraft(params: {
  complainant_name: string
  complaint_summary: string
  department: string
  cpgrams_id: string
  filing_date: string
}) {
  return {
    title: 'Application Under the Right to Information Act, 2005',
    content: `
APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005

To,
The Central Public Information Officer (CPIO),
${params.department},
Government of India,
New Delhi

Subject: Request for Information Regarding Status and Action Taken on CPGRAMS Complaint

Sir/Madam,

I, ${params.complainant_name}, am filing this application under Section 6(1) of the Right to Information Act, 2005, to seek the following information:

1. COMPLAINT REFERENCE:
   - CPGRAMS Registration Number: ${params.cpgrams_id}
   - Date of Filing: ${params.filing_date}
   - Department Concerned: ${params.department}

2. INFORMATION SOUGHT:

   (a) A complete copy of the file noting and correspondence pertaining to the above-mentioned CPGRAMS complaint from the date of receipt to the present date.

   (b) Details of the officer(s) to whom this complaint was assigned for investigation and the dates of assignment.

   (c) Whether any inquiry or investigation was conducted in response to this complaint. If yes, provide a copy of the inquiry report.

   (d) If the complaint has been marked as "Disposed/Resolved" — provide the specific action taken to address the grievance, including copies of any orders or instructions issued.

   (e) If the complaint has been transferred to another department/ministry — provide the details of the transfer including the date and the receiving department.

   (f) The reasons for delay in resolution if the complaint has exceeded the standard 30-day resolution timeline.

   (g) The total number of complaints received by this department/ministry in the same category during the current financial year, and the percentage resolved within 30 days.

3. COMPLAINT SUMMARY:
   ${params.complaint_summary}

4. FEE:
   I am enclosing a fee of ₹10 (Rupees Ten only) via [Indian Postal Order / Demand Draft / Court Fee Stamp], payable to the Accounts Officer of ${params.department}, as prescribed under Section 6(1) of the RTI Act, 2005.

5. DECLARATION:
   I declare that the information sought does not infringe upon any exemption under Section 8 or Section 9 of the RTI Act, 2005. The information is being sought for legitimate civic purposes.

6. MODE OF INFORMATION:
   I request the information to be provided in [hard copy by post / soft copy by email] at the address mentioned below.

APPLICANT DETAILS:
Name: ${params.complainant_name}
Address: [Your Complete Postal Address]
Pin Code: [Your Pin Code]
Email: [Your Email]
Phone: [Your Phone Number]
Date: ${new Date().toLocaleDateString('en-IN')}

Yours faithfully,

${params.complainant_name}

---
Note: This RTI application was generated by GrievanceIQ as a template. 
Please review all details before filing. 
File online at: https://rtionline.gov.in/
Or send by registered post to the concerned CPIO.
RTI application fee: ₹10 (BPL applicants are exempt)
    `.trim(),
    filing_options: [
      { method: 'Online', url: 'https://rtionline.gov.in/', fee: '₹10 (pay online)' },
      { method: 'By Post', instructions: 'Send by registered post with ₹10 postal order to the CPIO address', fee: '₹10 (postal order/DD)' }
    ],
    legal_references: [
      'Section 6(1) — Right to file RTI application',
      'Section 7(1) — 30-day response deadline for CPIO',
      'Section 19(1) — Right to first appeal if no response in 30 days',
      'Section 19(3) — Right to second appeal to Information Commission'
    ]
  }
}
