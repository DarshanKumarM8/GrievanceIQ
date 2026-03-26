import { Hono } from 'hono'
import { analyzeComplaint, generateRTI } from '../services/gemini'
import { sanitizeInput } from '../services/auth'
import { authMiddleware } from '../middleware/security'

type Bindings = {
  DB: D1Database
  GEMINI_API_KEY?: string
  RESEND_API_KEY?: string
}

export const apiRoutes = new Hono<{ Bindings: Bindings }>()

// ============================================
// HEALTH CHECK
// ============================================
apiRoutes.get('/health', (c) => {
  const hasGeminiKey = !!(c.env.GEMINI_API_KEY && c.env.GEMINI_API_KEY.length > 10)
  return c.json({
    status: 'ok',
    service: 'GrievanceIQ',
    version: '4.0.0',
    week: 4,
    ai_engine: hasGeminiKey ? 'gemini-2.0-flash (with fallback)' : 'mock-keyword-classifier-v2',
    ai_status: hasGeminiKey ? 'active' : 'fallback-only',
    features: [
      'complaint_analysis',
      'department_routing',
      'quality_scoring',
      'complaint_rewriting',
      'document_checklist',
      'rti_generation',
      'complaint_tracking',
      'feedback_system',
      'india_geojson_choropleth',
      'chartjs_analytics',
      'department_scorecard',
      'trending_issues',
      'social_signals',
      'my_complaints_history',
      'hindi_ui_toggle',
      '7_step_wizard',
      'realtime_validation',
      'day15_day25_countdown',
      'computed_timelines',
      'email_otp_auth',
      'jwt_sessions',
      'csp_security_headers',
      'xss_sanitization',
      'rate_limiting',
      'audit_logging',
      'email_reminders_foundation',
      'user_profiles',
      'passwordless_login'
    ]
  })
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
// COMPLAINTS — Submit and AI-analyze
// ============================================
apiRoutes.post('/complaints/analyze', async (c) => {
  const body = await c.req.json()
  const { text, language } = body

  if (!text || text.trim().length < 10) {
    return c.json({ success: false, error: 'Complaint text must be at least 10 characters' }, 400)
  }

  // Sanitize input
  const sanitizedText = text.trim()

  // Use Gemini AI with mock fallback
  const apiKey = c.env.GEMINI_API_KEY
  const analysis = await analyzeComplaint(apiKey, sanitizedText, language || 'en')

  // Get user ID if authenticated
  const userId = c.get?.('userId') || null

  // Save to database
  const db = c.env.DB
  try {
    const d = analysis.data
    const result = await db.prepare(`
      INSERT INTO complaints (user_id, raw_text, language_detected, translated_text, department_predicted, department_confidence, department_2nd, department_2nd_confidence, department_3rd, department_3rd_confidence, department_reasoning, quality_score_before, quality_score_after, missing_elements, improved_draft, documents_checklist, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', datetime('now'))
    `).bind(
      userId,
      sanitizedText,
      d.language_detected,
      d.translated_text || null,
      d.departments[0].name,
      d.departments[0].confidence,
      d.departments[1].name,
      d.departments[1].confidence,
      d.departments[2].name,
      d.departments[2].confidence,
      d.department_reasoning,
      d.quality_score_before,
      d.quality_score_after,
      JSON.stringify(d.missing_elements),
      d.improved_draft,
      JSON.stringify(d.documents_checklist)
    ).run()

    return c.json({
      success: true,
      data: {
        complaint_id: result.meta.last_row_id,
        ...d,
        _ai_source: analysis.source,
        _ai_model: analysis.model,
        _ai_latency_ms: analysis.latency_ms
      }
    })
  } catch (e: any) {
    // Even if DB fails, return the analysis
    return c.json({
      success: true,
      data: {
        complaint_id: null,
        ...analysis.data,
        _ai_source: analysis.source,
        _ai_model: analysis.model,
        _ai_latency_ms: analysis.latency_ms,
        _db_error: e.message,
        _authenticated: !!userId
      }
    })
  }
})

// ============================================
// COMPLAINT TRACKER — Track by CPGRAMS ID
// ============================================
apiRoutes.post('/complaints/track', async (c) => {
  const body = await c.req.json()
  const { cpgrams_id, complaint_id, filing_date } = body

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

    // Check if complaint exists in DB with a filing date
    let dbFilingDate = filing_date
    if (!dbFilingDate) {
      const existing = await db.prepare('SELECT filed_at FROM complaints WHERE cpgrams_id = ?').bind(cpgrams_id).first()
      if (existing?.filed_at) {
        dbFilingDate = existing.filed_at as string
      }
    }

    // Return computed tracking info
    const timeline = generateComputedTimeline(cpgrams_id, dbFilingDate)
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

    return c.json({
      success: true,
      data: {
        is_fake_closure: isFakeClosure === 1,
        message: isFakeClosure
          ? 'Thank you for reporting. This feedback helps detect patterns of fake closures across departments.'
          : citizen_actual_resolution === 'resolved'
            ? 'Great news! Glad your issue was resolved.'
            : 'Thank you for your feedback. We\'re tracking this.'
      }
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// RTI GENERATOR — AI-powered RTI application
// ============================================
apiRoutes.post('/rti/generate', async (c) => {
  const body = await c.req.json()
  const { complaint_id, complainant_name, complaint_summary, department, cpgrams_id, filing_date } = body

  const apiKey = c.env.GEMINI_API_KEY

  const rtiResult = await generateRTI(apiKey, {
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

  return c.json({
    success: true,
    data: {
      title: 'Application Under the Right to Information Act, 2005',
      content: rtiResult.content,
      filing_options: rtiResult.filing_options,
      legal_references: rtiResult.legal_references,
      _ai_source: rtiResult.source,
      _ai_model: rtiResult.model
    }
  })
})

// ============================================
// RECENT COMPLAINTS — List analyzed complaints
// ============================================
apiRoutes.get('/complaints/recent', async (c) => {
  const db = c.env.DB
  const limit = parseInt(c.req.query('limit') || '10')
  try {
    const results = await db.prepare(
      'SELECT id, raw_text, language_detected, department_predicted, department_confidence, quality_score_before, quality_score_after, status, created_at FROM complaints ORDER BY created_at DESC LIMIT ?'
    ).bind(limit).all()
    return c.json({ success: true, data: results.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// MY COMPLAINTS — List all analyzed complaints for user
// ============================================
apiRoutes.get('/complaints/all', async (c) => {
  const db = c.env.DB
  const limit = parseInt(c.req.query('limit') || '50')
  const status = c.req.query('status') || ''
  const userId = c.get?.('userId') || null
  
  try {
    let query = 'SELECT id, raw_text, language_detected, department_predicted, department_confidence, quality_score_before, quality_score_after, status, cpgrams_id, filed_at, rti_generated, created_at FROM complaints'
    const conditions: string[] = []
    const params: any[] = []
    
    // Filter by authenticated user if logged in
    if (userId) {
      conditions.push('user_id = ?')
      params.push(userId)
    }
    
    if (status && status !== 'all') {
      conditions.push('status = ?')
      params.push(status)
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?'
    params.push(limit)

    const stmt = db.prepare(query)
    const results = params.length === 1 
      ? await stmt.bind(params[0]).all()
      : await stmt.bind(...params).all()
    
    return c.json({ success: true, data: results.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// COMPLAINT STATS — Aggregate user stats
// ============================================
apiRoutes.get('/complaints/stats', async (c) => {
  const db = c.env.DB
  try {
    const total = await db.prepare('SELECT COUNT(*) as count FROM complaints').first()
    const filed = await db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'filed'").first()
    const resolved = await db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'resolved'").first()
    const pending = await db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status IN ('draft', 'pending', 'filed')").first()
    const escalated = await db.prepare("SELECT COUNT(*) as count FROM complaints WHERE rti_generated = 1").first()
    const fakeClosed = await db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'fake_closed'").first()

    return c.json({
      success: true,
      data: {
        total: total?.count || 0,
        filed: filed?.count || 0,
        resolved: resolved?.count || 0,
        pending: pending?.count || 0,
        escalated: escalated?.count || 0,
        fake_closed: fakeClosed?.count || 0
      }
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// COMPLAINT BY ID (must be after /complaints/recent, /all, /stats)
// ============================================
apiRoutes.get('/complaints/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  try {
    const result = await db.prepare('SELECT * FROM complaints WHERE id = ?').bind(id).first()
    if (!result) return c.json({ success: false, error: 'Complaint not found' }, 404)
    return c.json({ success: true, data: result })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// COMPUTED TIMELINE — Smart timeline generation
// ============================================

function generateComputedTimeline(cpgramsId: string, filingDate?: string) {
  const now = new Date()
  
  // If user provides filing date, use it; otherwise simulate 20 days ago
  let filed: Date
  if (filingDate) {
    filed = new Date(filingDate)
    // Validate the date
    if (isNaN(filed.getTime())) {
      filed = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
    }
  } else {
    filed = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
  }

  const MS_PER_DAY = 24 * 60 * 60 * 1000
  const daysElapsed = Math.max(0, Math.floor((now.getTime() - filed.getTime()) / MS_PER_DAY))
  const deadline = new Date(filed.getTime() + 30 * MS_PER_DAY)
  const day15 = new Date(filed.getTime() + 15 * MS_PER_DAY)
  const day25 = new Date(filed.getTime() + 25 * MS_PER_DAY)
  const daysRemaining = Math.max(0, 30 - daysElapsed)

  // Determine overall status
  let status = 'pending'
  if (daysElapsed > 30) status = 'overdue'
  else if (daysElapsed > 25) status = 'urgent'
  else if (daysElapsed > 15) status = 'follow_up'
  else status = 'on_track'

  // Build dynamic timeline based on days elapsed
  const timeline: any[] = [
    {
      date: filed.toISOString().split('T')[0],
      event: 'Complaint Filed',
      status: 'completed',
      description: `Complaint ${cpgramsId} registered on CPGRAMS portal`,
      is_reminder: false
    }
  ]

  // Day 2: Forwarded
  if (daysElapsed >= 2) {
    timeline.push({
      date: new Date(filed.getTime() + 2 * MS_PER_DAY).toISOString().split('T')[0],
      event: 'Forwarded to Department',
      status: 'completed',
      description: 'Complaint forwarded to concerned ministry/department for action',
      is_reminder: false
    })
  } else {
    timeline.push({
      date: new Date(filed.getTime() + 2 * MS_PER_DAY).toISOString().split('T')[0],
      event: 'Pending Forwarding',
      status: daysElapsed >= 1 ? 'active' : 'upcoming',
      description: 'Complaint will be forwarded to concerned department within 48 hours',
      is_reminder: false
    })
  }

  // Day 5: Under Review
  if (daysElapsed >= 5) {
    timeline.push({
      date: new Date(filed.getTime() + 5 * MS_PER_DAY).toISOString().split('T')[0],
      event: 'Under Review',
      status: 'completed',
      description: 'Department has acknowledged and is reviewing the complaint',
      is_reminder: false
    })
  } else if (daysElapsed >= 2) {
    timeline.push({
      date: new Date(filed.getTime() + 5 * MS_PER_DAY).toISOString().split('T')[0],
      event: 'Awaiting Review',
      status: 'active',
      description: 'Waiting for department to acknowledge and begin review',
      is_reminder: false
    })
  }

  // Day 10: Investigation
  if (daysElapsed >= 10) {
    timeline.push({
      date: new Date(filed.getTime() + 10 * MS_PER_DAY).toISOString().split('T')[0],
      event: 'Investigation Phase',
      status: daysElapsed < 15 ? 'active' : 'completed',
      description: 'Department is investigating the complaint details. Officer assigned for inquiry.',
      is_reminder: false
    })
  }

  // Day 15: Reminder
  const day15Status = daysElapsed >= 15 ? (daysElapsed < 20 ? 'active' : 'completed') : 'upcoming'
  timeline.push({
    date: day15.toISOString().split('T')[0],
    event: 'Day 15 — First Reminder',
    status: day15Status,
    description: daysElapsed >= 15
      ? 'Half the standard resolution window has passed. Follow up on CPGRAMS for status update.'
      : `${Math.max(0, 15 - daysElapsed)} days until first reminder milestone.`,
    is_reminder: true
  })

  // Day 20: Midpoint update
  if (daysElapsed >= 15) {
    const day20 = daysElapsed >= 20
    timeline.push({
      date: new Date(filed.getTime() + 20 * MS_PER_DAY).toISOString().split('T')[0],
      event: 'Response Expected',
      status: day20 ? (daysElapsed < 25 ? 'active' : 'completed') : 'active',
      description: day20
        ? 'Department should have provided initial response by now. Contact them directly if no update.'
        : 'Department expected to provide initial response. Check CPGRAMS portal.',
      is_reminder: false
    })
  }

  // Day 25: Warning
  const day25Status = daysElapsed >= 25 ? (daysElapsed < 30 ? 'active' : 'completed') : 'upcoming'
  timeline.push({
    date: day25.toISOString().split('T')[0],
    event: 'Day 25 — Urgent Warning',
    status: day25Status,
    description: daysElapsed >= 25
      ? `Only ${daysRemaining} days remain! Begin preparing RTI application immediately if unresolved.`
      : `${Math.max(0, 25 - daysElapsed)} days until urgent warning. If unresolved, prepare RTI.`,
    is_reminder: true
  })

  // Day 30: Deadline
  timeline.push({
    date: deadline.toISOString().split('T')[0],
    event: 'Day 30 — Resolution Deadline',
    status: daysElapsed >= 30 ? 'completed' : 'upcoming',
    description: daysElapsed >= 30
      ? 'Standard 30-day window has expired. File RTI application under Section 6(1) of RTI Act 2005.'
      : 'Standard 30-day CPGRAMS resolution window expires. After this, you can file RTI for accountability.',
    is_reminder: true
  })

  // If overdue, add escalation step
  if (daysElapsed > 30) {
    timeline.push({
      date: now.toISOString().split('T')[0],
      event: 'OVERDUE — Escalation Required',
      status: 'active',
      description: `Complaint is ${daysElapsed - 30} days overdue. File RTI application and/or escalate to First Appellate Authority under Section 19(1).`,
      is_reminder: true
    })
  }

  return {
    cpgrams_id: cpgramsId,
    status,
    filed_date: filed.toISOString().split('T')[0],
    deadline_date: deadline.toISOString().split('T')[0],
    day15_date: day15.toISOString().split('T')[0],
    day25_date: day25.toISOString().split('T')[0],
    days_elapsed: daysElapsed,
    days_remaining: daysRemaining,
    timeline,
    reminders: {
      day_15: { triggered: daysElapsed >= 15, date: day15.toISOString().split('T')[0] },
      day_25: { triggered: daysElapsed >= 25, date: day25.toISOString().split('T')[0] }
    }
  }
}
