// ============================================
// GrievanceIQ — Auth API Routes v1.0
// Email OTP login, JWT sessions, profile management
// ============================================

import { Hono } from 'hono'
import { AuthService, EmailService, sanitizeInput, validateEmail } from '../services/auth'
import { authMiddleware, rateLimitMiddleware } from '../middleware/security'

type Bindings = {
  DB: D1Database
  GEMINI_API_KEY?: string
  RESEND_API_KEY?: string
}

export const authRoutes = new Hono<{ Bindings: Bindings }>()

// ============================================
// POST /auth/request-otp — Send OTP to email
// ============================================
authRoutes.post('/request-otp', rateLimitMiddleware(5, 5), async (c) => {
  const body = await c.req.json()
  const { email, name } = body

  if (!email || !validateEmail(email)) {
    return c.json({ success: false, error: 'Please provide a valid email address' }, 400)
  }

  const auth = new AuthService(c.env.DB)
  const result = await auth.requestOTP(email, name ? sanitizeInput(name) : undefined)

  return c.json(result)
})

// ============================================
// POST /auth/verify-otp — Verify OTP & get JWT
// ============================================
authRoutes.post('/verify-otp', rateLimitMiddleware(10, 5), async (c) => {
  const body = await c.req.json()
  const { email, otp } = body

  if (!email || !validateEmail(email)) {
    return c.json({ success: false, error: 'Invalid email address' }, 400)
  }
  if (!otp || typeof otp !== 'string' || otp.length !== 6) {
    return c.json({ success: false, error: 'OTP must be exactly 6 digits' }, 400)
  }

  const auth = new AuthService(c.env.DB)
  const result = await auth.verifyOTP(email, otp)

  if (result.success && result.token) {
    // Set cookie for browser sessions
    c.header('Set-Cookie', `giq_token=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`)
  }

  return c.json(result)
})

// ============================================
// POST /auth/logout — End session
// ============================================
authRoutes.post('/logout', authMiddleware(false), async (c) => {
  const userId = c.get('userId')
  if (userId) {
    const auth = new AuthService(c.env.DB)
    await auth.logout(userId)
  }

  // Clear cookie
  c.header('Set-Cookie', 'giq_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0')

  return c.json({ success: true, message: 'Logged out successfully' })
})

// ============================================
// GET /auth/me — Get current user profile
// ============================================
authRoutes.get('/me', authMiddleware(false), async (c) => {
  const isAuth = c.get('isAuthenticated')
  if (!isAuth) {
    return c.json({ success: false, authenticated: false })
  }

  const user = c.get('user')
  return c.json({ success: true, authenticated: true, data: user })
})

// ============================================
// PUT /auth/profile — Update user profile
// ============================================
authRoutes.put('/profile', authMiddleware(true), async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()

  const auth = new AuthService(c.env.DB)
  const result = await auth.updateProfile(userId, {
    name: body.name,
    language_preference: body.language_preference
  })

  return c.json(result)
})

// ============================================
// GET /auth/sessions — List active sessions
// ============================================
authRoutes.get('/sessions', authMiddleware(true), async (c) => {
  const userId = c.get('userId')
  const db = c.env.DB

  try {
    const sessions = await db.prepare(
      "SELECT id, ip_address, user_agent, last_active_at, created_at FROM user_sessions WHERE user_id = ? AND is_active = 1 AND expires_at > datetime('now') ORDER BY last_active_at DESC"
    ).bind(userId).all()

    return c.json({ success: true, data: sessions.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// DELETE /auth/sessions — Logout all sessions
// ============================================
authRoutes.delete('/sessions', authMiddleware(true), async (c) => {
  const userId = c.get('userId')
  const db = c.env.DB

  try {
    await db.prepare('UPDATE user_sessions SET is_active = 0 WHERE user_id = ?').bind(userId).run()
    c.header('Set-Cookie', 'giq_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0')
    return c.json({ success: true, message: 'All sessions terminated' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ============================================
// POST /auth/send-reminder — Trigger email reminder (admin/cron)
// ============================================
authRoutes.post('/send-reminder', async (c) => {
  const db = c.env.DB
  const emailService = new EmailService(db, c.env.RESEND_API_KEY)

  try {
    // Find complaints needing Day 15 reminder
    const day15 = await db.prepare(
      "SELECT c.*, u.email, u.name as user_name FROM complaints c JOIN users u ON c.user_id = u.id WHERE c.status = 'filed' AND c.reminder_15_sent = 0 AND c.filed_at IS NOT NULL AND julianday('now') - julianday(c.filed_at) >= 15 AND julianday('now') - julianday(c.filed_at) < 25"
    ).all()

    // Find complaints needing Day 25 reminder
    const day25 = await db.prepare(
      "SELECT c.*, u.email, u.name as user_name FROM complaints c JOIN users u ON c.user_id = u.id WHERE c.status = 'filed' AND c.reminder_25_sent = 0 AND c.filed_at IS NOT NULL AND julianday('now') - julianday(c.filed_at) >= 25"
    ).all()

    let sentCount = 0

    for (const complaint of day15.results) {
      await emailService.sendReminder(complaint, 'day15')
      await db.prepare('UPDATE complaints SET reminder_15_sent = 1 WHERE id = ?').bind(complaint.id).run()
      sentCount++
    }

    for (const complaint of day25.results) {
      await emailService.sendReminder(complaint, 'day25')
      await db.prepare('UPDATE complaints SET reminder_25_sent = 1 WHERE id = ?').bind(complaint.id).run()
      sentCount++
    }

    return c.json({
      success: true,
      data: {
        day15_sent: day15.results.length,
        day25_sent: day25.results.length,
        total_sent: sentCount
      }
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})
