// ============================================
// GrievanceIQ — Auth Service v1.0
// JWT sessions, OTP generation, email auth
// Works in Cloudflare Workers (no Node.js crypto)
// ============================================

// ============================================
// JWT IMPLEMENTATION (Web Crypto API — CF Workers compatible)
// ============================================

const JWT_SECRET_KEY = 'grievanceiq-jwt-secret-2026-w4'
const JWT_EXPIRY_HOURS = 24 * 7 // 7 days

function base64UrlEncode(data: string): string {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return atob(str)
}

async function createHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

async function signJWT(payload: Record<string, any>): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + JWT_EXPIRY_HOURS * 3600
  }

  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(fullPayload))
  const data = `${headerB64}.${payloadB64}`

  const key = await createHmacKey(JWT_SECRET_KEY)
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  const sigB64 = base64UrlEncode(String.fromCharCode(...new Uint8Array(sig)))

  return `${data}.${sigB64}`
}

async function verifyJWT(token: string): Promise<Record<string, any> | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [headerB64, payloadB64, sigB64] = parts
    const data = `${headerB64}.${payloadB64}`

    const key = await createHmacKey(JWT_SECRET_KEY)
    const sigBytes = Uint8Array.from(base64UrlDecode(sigB64), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data))

    if (!valid) return null

    const payload = JSON.parse(base64UrlDecode(payloadB64))

    // Check expiry
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

// ============================================
// OTP GENERATION (6-digit, 10-minute expiry)
// ============================================

function generateOTP(): string {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return String(array[0] % 1000000).padStart(6, '0')
}

function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

// ============================================
// XSS SANITIZATION
// ============================================

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return ''
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return ''
  return email.toLowerCase().trim().slice(0, 254)
}

export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email) && email.length <= 254
}

export function validateName(name: string): boolean {
  return typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 100
}

// ============================================
// AUTH SERVICE CLASS
// ============================================

export class AuthService {
  private db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  // --- Request OTP ---
  async requestOTP(email: string, name?: string): Promise<{
    success: boolean
    message: string
    otp?: string // Only returned for demo/dev mode
    is_new_user?: boolean
  }> {
    email = sanitizeEmail(email)
    if (!validateEmail(email)) {
      return { success: false, message: 'Invalid email address' }
    }

    // Check if user exists
    const existingUser = await this.db.prepare('SELECT id, name, is_active FROM users WHERE email = ?').bind(email).first()

    const isNewUser = !existingUser
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

    // Clear old unused OTPs for this email
    await this.db.prepare("DELETE FROM auth_otp WHERE email = ? AND is_used = 0").bind(email).run()

    // Insert new OTP
    await this.db.prepare(
      'INSERT INTO auth_otp (email, otp_code, purpose, expires_at) VALUES (?, ?, ?, ?)'
    ).bind(email, otp, isNewUser ? 'register' : 'login', expiresAt).run()

    // If new user and name provided, create user record
    if (isNewUser && name) {
      const safeName = sanitizeInput(name).slice(0, 100)
      await this.db.prepare(
        'INSERT INTO users (email, name, is_verified, is_active) VALUES (?, ?, 0, 1)'
      ).bind(email, safeName).run()
    } else if (isNewUser) {
      await this.db.prepare(
        'INSERT INTO users (email, name, is_verified, is_active) VALUES (?, ?, 0, 1)'
      ).bind(email, email.split('@')[0]).run()
    }

    // Queue email (OTP would be sent via email in production)
    try {
      await this.db.prepare(
        "INSERT INTO email_queue (to_email, subject, body_html, body_text, email_type, status) VALUES (?, ?, ?, ?, 'otp', 'queued')"
      ).bind(
        email,
        `GrievanceIQ — Your OTP is ${otp}`,
        `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:20px;">
          <h2 style="color:#1a365d;">GrievanceIQ</h2>
          <p>Your one-time password for ${isNewUser ? 'registration' : 'login'}:</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#ff9933;padding:16px;background:#f8f9fa;border-radius:8px;text-align:center;margin:16px 0;">${otp}</div>
          <p style="color:#666;font-size:13px;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
          <p style="color:#999;font-size:11px;">If you did not request this, please ignore this email.</p>
        </div>`,
        `GrievanceIQ OTP: ${otp} (expires in 10 minutes)`,
      ).run()
    } catch (e) { /* non-critical */ }

    // Audit log
    try {
      await this.db.prepare(
        "INSERT INTO audit_log (event_type, event_detail) VALUES ('otp_requested', ?)"
      ).bind(`OTP requested for ${email}`).run()
    } catch (e) { /* non-critical */ }

    return {
      success: true,
      message: isNewUser
        ? 'OTP sent to your email. Complete registration to get started.'
        : 'OTP sent to your email. Verify to log in.',
      otp, // DEV/DEMO: Return OTP directly since we have no email provider yet
      is_new_user: isNewUser
    }
  }

  // --- Verify OTP & Create Session ---
  async verifyOTP(email: string, otp: string): Promise<{
    success: boolean
    message: string
    token?: string
    user?: any
  }> {
    email = sanitizeEmail(email)
    if (!validateEmail(email)) {
      return { success: false, message: 'Invalid email address' }
    }

    const otpRecord = await this.db.prepare(
      "SELECT * FROM auth_otp WHERE email = ? AND otp_code = ? AND is_used = 0 AND expires_at > datetime('now') ORDER BY created_at DESC LIMIT 1"
    ).bind(email, otp).first()

    if (!otpRecord) {
      // Check if OTP exists but expired
      const expired = await this.db.prepare(
        "SELECT id FROM auth_otp WHERE email = ? AND otp_code = ? AND is_used = 0 AND expires_at <= datetime('now') LIMIT 1"
      ).bind(email, otp).first()

      if (expired) {
        return { success: false, message: 'OTP has expired. Please request a new one.' }
      }

      // Increment attempts
      await this.db.prepare(
        "UPDATE auth_otp SET attempts = attempts + 1 WHERE email = ? AND is_used = 0"
      ).bind(email).run()

      // Check max attempts
      const recent = await this.db.prepare(
        "SELECT attempts FROM auth_otp WHERE email = ? AND is_used = 0 ORDER BY created_at DESC LIMIT 1"
      ).bind(email).first()

      if (recent && (recent.attempts as number) >= 5) {
        await this.db.prepare("UPDATE auth_otp SET is_used = 1 WHERE email = ? AND is_used = 0").bind(email).run()
        return { success: false, message: 'Too many failed attempts. Please request a new OTP.' }
      }

      return { success: false, message: 'Invalid OTP. Please check and try again.' }
    }

    // Mark OTP as used
    await this.db.prepare('UPDATE auth_otp SET is_used = 1 WHERE id = ?').bind(otpRecord.id).run()

    // Get or update user
    const user = await this.db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
    if (!user) {
      return { success: false, message: 'User not found. Please register first.' }
    }

    // Mark user as verified, update login
    await this.db.prepare(
      "UPDATE users SET is_verified = 1, last_login_at = datetime('now'), login_count = login_count + 1 WHERE id = ?"
    ).bind(user.id).run()

    // Create JWT token
    const token = await signJWT({
      sub: user.id,
      email: user.email,
      name: user.name
    })

    // Create session record
    const sessionToken = generateSessionToken()
    const sessionExpiry = new Date(Date.now() + JWT_EXPIRY_HOURS * 3600 * 1000).toISOString()
    try {
      await this.db.prepare(
        'INSERT INTO user_sessions (user_id, session_token, is_active, expires_at) VALUES (?, ?, 1, ?)'
      ).bind(user.id, sessionToken, sessionExpiry).run()
    } catch (e) { /* non-critical */ }

    // Audit log
    try {
      await this.db.prepare(
        "INSERT INTO audit_log (user_id, event_type, event_detail) VALUES (?, 'login_success', ?)"
      ).bind(user.id, `User logged in via OTP`).run()
    } catch (e) { /* non-critical */ }

    return {
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        language_preference: user.language_preference,
        complaints_filed_count: user.complaints_filed_count,
        is_verified: 1
      }
    }
  }

  // --- Verify JWT Token ---
  async verifyToken(token: string): Promise<{
    valid: boolean
    user?: any
  }> {
    const payload = await verifyJWT(token)
    if (!payload) return { valid: false }

    try {
      const user = await this.db.prepare(
        'SELECT id, email, name, language_preference, complaints_filed_count, is_verified, is_active FROM users WHERE id = ? AND is_active = 1'
      ).bind(payload.sub).first()

      if (!user) return { valid: false }

      return { valid: true, user }
    } catch {
      return { valid: false }
    }
  }

  // --- Logout ---
  async logout(userId: number): Promise<void> {
    try {
      await this.db.prepare(
        'UPDATE user_sessions SET is_active = 0 WHERE user_id = ?'
      ).bind(userId).run()

      await this.db.prepare(
        "INSERT INTO audit_log (user_id, event_type, event_detail) VALUES (?, 'logout', 'User logged out')"
      ).bind(userId).run()
    } catch (e) { /* non-critical */ }
  }

  // --- Update Profile ---
  async updateProfile(userId: number, updates: { name?: string; language_preference?: string }): Promise<{
    success: boolean
    message: string
  }> {
    const fields: string[] = []
    const values: any[] = []

    if (updates.name) {
      if (!validateName(updates.name)) return { success: false, message: 'Invalid name (2-100 chars)' }
      fields.push('name = ?')
      values.push(sanitizeInput(updates.name))
    }
    if (updates.language_preference) {
      const validLangs = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'kn']
      if (!validLangs.includes(updates.language_preference)) {
        return { success: false, message: 'Invalid language preference' }
      }
      fields.push('language_preference = ?')
      values.push(updates.language_preference)
    }

    if (fields.length === 0) return { success: false, message: 'Nothing to update' }

    fields.push("updated_at = datetime('now')")
    values.push(userId)

    await this.db.prepare(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run()

    return { success: true, message: 'Profile updated successfully' }
  }
}

// ============================================
// RATE LIMITER (D1-based)
// ============================================

export class RateLimiter {
  private db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async checkLimit(identifier: string, endpoint: string, maxRequests: number, windowMinutes: number): Promise<{
    allowed: boolean
    remaining: number
    retryAfterSeconds?: number
  }> {
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString()

    try {
      // Count requests in current window
      const result = await this.db.prepare(
        "SELECT COUNT(*) as count FROM rate_limits WHERE identifier = ? AND endpoint = ? AND window_start > ?"
      ).bind(identifier, endpoint, windowStart).first()

      const count = (result?.count as number) || 0

      if (count >= maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: windowMinutes * 60
        }
      }

      // Record this request
      await this.db.prepare(
        "INSERT INTO rate_limits (identifier, endpoint, window_start) VALUES (?, ?, datetime('now'))"
      ).bind(identifier, endpoint).run()

      return { allowed: true, remaining: maxRequests - count - 1 }
    } catch (e) {
      // If rate limiting fails, allow the request (fail-open)
      return { allowed: true, remaining: maxRequests }
    }
  }

  // Cleanup old entries (call periodically)
  async cleanup(): Promise<void> {
    try {
      await this.db.prepare(
        "DELETE FROM rate_limits WHERE window_start < datetime('now', '-1 hour')"
      ).run()
    } catch (e) { /* non-critical */ }
  }
}

// ============================================
// EMAIL SERVICE (Resend-compatible, with mock fallback)
// ============================================

export class EmailService {
  private apiKey?: string
  private db: D1Database

  constructor(db: D1Database, apiKey?: string) {
    this.db = db
    this.apiKey = apiKey
  }

  async sendEmail(to: string, subject: string, htmlBody: string, textBody?: string): Promise<{
    success: boolean
    message: string
  }> {
    // If we have a Resend API key, use it
    if (this.apiKey && this.apiKey.length > 10) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'GrievanceIQ <noreply@grievanceiq.in>',
            to: [to],
            subject,
            html: htmlBody,
            text: textBody
          })
        })

        if (res.ok) {
          return { success: true, message: 'Email sent via Resend' }
        }

        const err = await res.json()
        return { success: false, message: `Email failed: ${(err as any).message || 'Unknown error'}` }
      } catch (e: any) {
        return { success: false, message: `Email error: ${e.message}` }
      }
    }

    // Mock mode: just queue it
    return { success: true, message: 'Email queued (demo mode — no email provider configured)' }
  }

  // --- Send Day 15/25 Reminders ---
  async sendReminder(complaint: any, type: 'day15' | 'day25'): Promise<void> {
    const user = await this.db.prepare('SELECT email, name FROM users WHERE id = ?').bind(complaint.user_id).first()
    if (!user?.email) return

    const subject = type === 'day15'
      ? `GrievanceIQ — Day 15 Reminder: Follow up on ${complaint.cpgrams_id}`
      : `GrievanceIQ — URGENT Day 25: Prepare RTI for ${complaint.cpgrams_id}`

    const html = `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:20px;">
      <h2 style="color:#1a365d;">GrievanceIQ ${type === 'day25' ? '⚠️ URGENT' : '📋'} Reminder</h2>
      <p>Dear ${user.name || 'Citizen'},</p>
      <p>Your complaint <strong>${complaint.cpgrams_id}</strong> is now at <strong>${type === 'day15' ? 'Day 15' : 'Day 25'}</strong> of the 30-day resolution window.</p>
      ${type === 'day15' ? `
        <p><strong>Action Required:</strong></p>
        <ul>
          <li>Log in to CPGRAMS portal and check status</li>
          <li>If "Under Process" — note the officer name and contact</li>
          <li>If "Disposed" — check if actually resolved</li>
        </ul>
      ` : `
        <p><strong>⚠️ Only 5 days remain!</strong></p>
        <ul>
          <li>If unresolved, <strong>start preparing your RTI application</strong></li>
          <li>Visit GrievanceIQ RTI Auto-Drafter to generate it</li>
          <li>File RTI on rtionline.gov.in before Day 30</li>
        </ul>
      `}
      <a href="/tracker" style="display:inline-block;background:#ff9933;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:12px;">Track Your Complaint</a>
    </div>`

    await this.sendEmail(user.email as string, subject, html)

    // Queue in DB
    try {
      await this.db.prepare(
        "INSERT INTO email_queue (to_email, subject, body_html, email_type, related_complaint_id, status) VALUES (?, ?, ?, ?, ?, 'queued')"
      ).bind(user.email, subject, html, type, complaint.id).run()
    } catch (e) { /* non-critical */ }
  }
}

// ============================================
// EXPORTS
// ============================================

export { signJWT, verifyJWT }
