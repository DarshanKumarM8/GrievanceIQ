// ============================================
// GrievanceIQ — Security Middleware v1.0
// CSP headers, rate limiting, auth middleware
// ============================================

import { Hono } from 'hono'
import { AuthService, RateLimiter, sanitizeInput, verifyJWT } from '../services/auth'

type Bindings = {
  DB: D1Database
  GEMINI_API_KEY?: string
  RESEND_API_KEY?: string
}

type Variables = {
  user?: any
  userId?: number
  isAuthenticated: boolean
}

// ============================================
// CSP + SECURITY HEADERS MIDDLEWARE
// ============================================

export function securityHeaders() {
  return async (c: any, next: () => Promise<void>) => {
    await next()

    // Content Security Policy
    c.header('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com https://unpkg.com",
      "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://unpkg.com",
      "connect-src 'self' https://cdn.jsdelivr.net https://generativelanguage.googleapis.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '))

    // Other security headers
    c.header('X-Content-Type-Options', 'nosniff')
    c.header('X-Frame-Options', 'DENY')
    c.header('X-XSS-Protection', '1; mode=block')
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
}

// ============================================
// RATE LIMITING MIDDLEWARE
// ============================================

export function rateLimitMiddleware(maxRequests: number = 60, windowMinutes: number = 1) {
  return async (c: any, next: () => Promise<void>) => {
    const db = c.env.DB
    if (!db) {
      await next()
      return
    }

    const limiter = new RateLimiter(db)
    const identifier = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'anonymous'
    const endpoint = c.req.path

    const result = await limiter.checkLimit(identifier, endpoint, maxRequests, windowMinutes)

    c.header('X-RateLimit-Limit', String(maxRequests))
    c.header('X-RateLimit-Remaining', String(result.remaining))

    if (!result.allowed) {
      c.header('Retry-After', String(result.retryAfterSeconds || 60))
      return c.json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        retry_after_seconds: result.retryAfterSeconds
      }, 429)
    }

    await next()
  }
}

// ============================================
// AUTH MIDDLEWARE (optional — extracts user if token present)
// ============================================

export function authMiddleware(required: boolean = false) {
  return async (c: any, next: () => Promise<void>) => {
    c.set('isAuthenticated', false)

    // Extract token from Authorization header or cookie
    let token = ''
    const authHeader = c.req.header('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }

    // Also check cookie
    if (!token) {
      const cookies = c.req.header('Cookie') || ''
      const match = cookies.match(/giq_token=([^;]+)/)
      if (match) token = match[1]
    }

    if (token) {
      try {
        const payload = await verifyJWT(token)
        if (payload) {
          const db = c.env.DB
          const user = await db.prepare(
            'SELECT id, email, name, language_preference, complaints_filed_count, is_verified, is_active FROM users WHERE id = ? AND is_active = 1'
          ).bind(payload.sub).first()

          if (user) {
            c.set('user', user)
            c.set('userId', user.id)
            c.set('isAuthenticated', true)
          }
        }
      } catch (e) {
        // Invalid token — continue without auth
      }
    }

    if (required && !c.get('isAuthenticated')) {
      return c.json({ success: false, error: 'Authentication required. Please log in.' }, 401)
    }

    await next()
  }
}

// ============================================
// INPUT SANITIZATION MIDDLEWARE
// ============================================

export function sanitizeMiddleware() {
  return async (c: any, next: () => Promise<void>) => {
    // Only sanitize POST/PUT/PATCH body
    if (['POST', 'PUT', 'PATCH'].includes(c.req.method)) {
      try {
        const contentType = c.req.header('Content-Type') || ''
        if (contentType.includes('application/json')) {
          // Body will be sanitized at the route level using sanitizeInput()
          // This middleware just adds a flag
          c.set('sanitize', true)
        }
      } catch (e) {
        // Skip if body parsing fails
      }
    }
    await next()
  }
}

export { sanitizeInput }
