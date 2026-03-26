# Week 4 Report — GrievanceIQ

**Period:** Week 4 (March 2026)  
**Version:** 4.0.0  
**Author:** GrievanceIQ Development Team  

---

## Summary

Week 4 focused on **authentication, security hardening, and email notification infrastructure**. We implemented a complete passwordless login system using email OTP with JWT sessions, added comprehensive security middleware (CSP, rate limiting, XSS sanitization, audit logging), and built the foundation for automated email reminders (Day 15/25 countdown notifications).

---

## Completed Tasks

### w4-1: Email OTP Authentication System
- **Passwordless login** using 6-digit OTP sent to email
- OTP generation using Web Crypto API (Cloudflare Workers compatible)
- 10-minute OTP expiry with max 5 attempts
- Auto-registration: new users are created on first OTP request
- Demo mode: OTP displayed in-UI since no email provider is configured yet
- **Files:** `src/services/auth.ts`, `src/routes/auth.ts`

### w4-2: JWT Session Management
- JWT tokens signed with HMAC-SHA256 via Web Crypto API
- 7-day session expiry
- Session tracking in D1 database (`user_sessions` table)
- Token extraction from both `Authorization: Bearer` header and `giq_token` cookie
- Auth middleware: optional (extracts user if present) or required (returns 401)
- **Files:** `src/services/auth.ts`, `src/middleware/security.ts`

### w4-3: Security Hardening
- **Content Security Policy (CSP):** Whitelisted CDN sources for scripts, styles, fonts, images, and API connections; blocked frame-ancestors, restricted form-action and base-uri
- **Security headers:** X-Content-Type-Options: nosniff, X-Frame-Options: DENY, X-XSS-Protection: 1; mode=block, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy (camera/microphone/geolocation disabled), HSTS max-age 31536000
- **Rate limiting:** D1-based per-IP rate limiter. 120 requests/minute for general API, 10 requests/5 minutes for auth endpoints
- **XSS sanitization:** `sanitizeInput()` function escaping &, <, >, ", ', / characters
- **Input validation:** Email regex validation, name length checks, OTP format validation
- **Audit logging:** All auth events (OTP requests, logins, logouts) logged to `audit_log` table
- **Files:** `src/middleware/security.ts`, `src/services/auth.ts`

### w4-4: Email Notification Foundation
- **EmailService class** with Resend API integration (production) and mock queue (demo)
- **Email queue table** (`email_queue`) tracking OTP emails, Day 15/25 reminders, welcome emails
- **Reminder trigger endpoint** (`POST /api/auth/send-reminder`) scans filed complaints and sends Day 15/25 emails
- HTML email templates for OTP delivery and complaint reminders
- **Files:** `src/services/auth.ts`, `src/routes/auth.ts`

### w4-5: Login & Profile UI Pages
- **Login page** (`/login`): 3-step flow (email input → OTP verification → success)
  - 6-digit OTP input with individual boxes, paste support, auto-advance
  - Demo OTP display box for testing
  - 10-minute countdown timer + 30-second resend cooldown
  - Already-logged-in detection
- **Profile page** (`/profile`): Account information, security status, session management
  - Edit name, language preference
  - View complaint count
  - Security indicators (email verified, passwordless login, active sessions)
  - Logout / logout all sessions
- **Navigation auth state**: Dynamic Sign In / Account button based on localStorage token
- **Files:** `src/pages/login.ts`, `src/pages/profile.ts`, `src/pages/layout.ts`

### w4-6: User-Linked Complaints
- Complaints filed by authenticated users now store `user_id` in the database
- `/api/complaints/all` filters by authenticated user when token is present
- My Complaints page shows only the logged-in user's complaints
- Anonymous users can still analyze complaints (no auth required for core features)

---

## Database Changes

### New Tables (Migration 0002)
| Table | Purpose | Columns |
|-------|---------|---------|
| `auth_otp` | OTP codes for email verification | email, otp_code, purpose, attempts, expires_at |
| `user_sessions` | JWT session tracking | user_id, session_token, ip_address, expires_at |
| `rate_limits` | API rate limiting per IP/endpoint | identifier, endpoint, request_count, window_start |
| `audit_log` | Security event logging | user_id, event_type, event_detail, ip_address |
| `email_queue` | Email notification queue | to_email, subject, body_html, email_type, status |

### Modified Tables
| Table | Changes |
|-------|---------|
| `users` | Added: `password_hash`, `is_verified`, `last_login_at`, `login_count`, `is_active` |

**Total tables:** 12 (7 original + 5 new)

---

## API Endpoints

### New Auth Endpoints (6)
| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|-----------|-------------|
| POST | `/api/auth/request-otp` | No | 5/5min | Send OTP to email |
| POST | `/api/auth/verify-otp` | No | 10/5min | Verify OTP, get JWT |
| POST | `/api/auth/logout` | Optional | 120/min | End current session |
| GET | `/api/auth/me` | Optional | 120/min | Get current user profile |
| PUT | `/api/auth/profile` | Required | 120/min | Update profile settings |
| POST | `/api/auth/send-reminder` | No | 120/min | Trigger Day 15/25 reminders |

**Total API endpoints:** 22 (16 existing + 6 new)

---

## New Pages

| Page | Path | Description |
|------|------|-------------|
| Login | `/login` | Email OTP sign-in with 3-step UI |
| Profile | `/profile` | Account settings and security |

**Total pages:** 10 (8 existing + 2 new)

---

## Security Audit

| Security Measure | Status | Details |
|-----------------|--------|---------|
| CSP Headers | Implemented | Full policy with whitelisted CDN sources |
| X-Frame-Options | DENY | Prevents clickjacking |
| X-XSS-Protection | 1; mode=block | Browser XSS filter |
| HSTS | 31536000s | Force HTTPS |
| Rate Limiting | Active | 120/min API, 10/5min auth |
| Input Sanitization | Active | HTML entity encoding for all user input |
| SQL Injection | Mitigated | Parameterized queries throughout |
| JWT Security | HMAC-SHA256 | Web Crypto API, 7-day expiry |
| Audit Trail | Active | All auth events logged |

---

## Build Statistics

- **Source files:** 15 TypeScript files
- **Total LOC:** ~6,200 (up from 4,773)
- **Bundle size:** 310 KB (dist/_worker.js)
- **DB tables:** 12
- **API endpoints:** 22
- **Pages:** 10
- **Features:** 28

---

## Known Limitations

1. **Email delivery:** OTP displayed in-UI (demo mode) since no Resend/SendGrid API key is configured
2. **Session validation:** JWT is verified cryptographically but not cross-checked against `user_sessions` table on every request (performance trade-off)
3. **Rate limiter:** Uses D1 database which adds slight latency; could be replaced with KV for production
4. **No CAPTCHA:** OTP rate limiting is the primary bot protection

---

## Next Steps (Week 5)

1. Chart.js enhancements: time-series charts, comparative analysis
2. District-level drill-down map with Leaflet plugins
3. PDF export of dashboard analytics
4. Advanced complaint filters (date range, department, score)
5. Complaint detail/view page with full analysis
