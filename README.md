# GrievanceIQ

**File Smarter. Get Heard. Hold Them Accountable.**

AI-powered citizen grievance intelligence platform for India's CPGRAMS system. Helps citizens file stronger complaints, track resolution progress, and escalate with RTI applications when ignored.

## Project Overview
- **Name**: GrievanceIQ
- **Goal**: Intelligence layer between citizens and India's grievance system
- **Target Users**: Citizens, journalists, NGOs, researchers
- **Tech Stack**: Hono (TypeScript), Tailwind CSS (CDN), Cloudflare D1 SQLite, Google Gemini AI
- **Status**: Week 4 completed, Auth & Security active

## URLs
- **Live Preview**: https://3000-ijj8l21qjw9nnoh5yjcir-2b54fc91.sandbox.novita.ai
- **GitHub**: https://github.com/DarshanKumarM8/GrievanceIQ

## Features

### Citizen Tools
- **7-Step Smart Complaint Builder** — Write, validate, analyze, route, improve, docs, file
- **Real-Time Validation** — 6 quality checks as you type (dates, refs, location, amounts, scheme, word count)
- **AI Department Router** — Identifies correct ministry from 92 options with confidence scores
- **Quality Scorer** — Rates complaint 1-10, shows before/after improvement
- **AI Complaint Rewriter** — Side-by-side editor with professionally improved draft
- **Document Checklist** — Interactive checklist of required documents per complaint type
- **Complaint Tracker** — Computed timeline with live countdown timer (Day 15/25/30)
- **Action Recommendations** — Context-aware next steps based on complaint phase
- **RTI Auto-Drafter** — One-click legally formatted RTI application with PDF download
- **My Complaints** — History page with stats, filtering, and quick actions (user-filtered when logged in)
- **Hindi UI Toggle** — English/Hindi navigation with localStorage persistence
- **8 Quick Templates** — Pension, PM-KISAN, Railway, Passport, Ration, Electricity, EPFO, Banking

### Authentication & Security (NEW — Week 4)
- **Passwordless Login** — Email OTP authentication (no passwords to steal)
- **JWT Sessions** — HMAC-SHA256 signed tokens, 7-day expiry, Web Crypto API
- **OTP Flow** — 6-digit code, 10-minute expiry, max 5 attempts, auto-registration
- **User Profiles** — Name, language preference, complaint history tracking
- **CSP Headers** — Full Content Security Policy with whitelisted CDN sources
- **Rate Limiting** — D1-based per-IP limiter (120/min API, 10/5min auth)
- **XSS Sanitization** — HTML entity encoding for all user inputs
- **HSTS + X-Frame-Options + X-XSS-Protection** — Full security header suite
- **Audit Logging** — All auth events logged (OTP requests, logins, logouts)
- **Email Reminders Foundation** — Resend API integration + Day 15/25 reminder queue

### Public Dashboard
- **India GeoJSON Choropleth Map** — Interactive state boundaries with 4 metric views
- **Chart.js Analytics** — 4 charts: ministry volume, status distribution, fake closure rates, resolution speed
- **Department Scorecard** — 30 ministries ranked with sortable columns
- **Systemic Issue Radar** — Trending complaint clusters with severity, spike factor, affected states
- **Social Monitoring Feed** — Twitter/news signal tracking with spike detection

### AI Engine
- **Primary**: Google Gemini 2.0 Flash (with flash-lite fallback)
- **Fallback**: Mock keyword classifier (17 categories, 92 ministries)
- **Features**: Exponential backoff, 30s timeout, rate limit handling, JSON schema validation
- **Transparency**: AI source badges showing model used and latency

## API Endpoints (22 total)

### Core APIs (16)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Service status, version, 28 features list |
| GET | `/api/stats` | Dashboard aggregate statistics |
| GET | `/api/ministries` | Ministry scorecards (sortable, filterable) |
| GET | `/api/ministries/:code` | Single ministry detail |
| GET | `/api/states` | State grievance stats (for map) |
| GET | `/api/states/:code` | Single state detail |
| GET | `/api/trending` | Systemic issue radar data |
| GET | `/api/social` | Social monitoring signals |
| POST | `/api/complaints/analyze` | AI complaint analysis (links to user if authenticated) |
| POST | `/api/complaints/track` | Computed timeline with countdown |
| GET | `/api/complaints/recent` | Recent analyzed complaints |
| GET | `/api/complaints/all` | All complaints (filtered by user when auth'd) |
| GET | `/api/complaints/stats` | Complaint count statistics |
| GET | `/api/complaints/:id` | Single complaint detail |
| POST | `/api/feedback` | Citizen outcome reporting |
| POST | `/api/rti/generate` | AI RTI application generation |

### Auth APIs (6 — NEW Week 4)
| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|-----------|-------------|
| POST | `/api/auth/request-otp` | No | 5/5min | Send OTP to email |
| POST | `/api/auth/verify-otp` | No | 10/5min | Verify OTP, get JWT |
| POST | `/api/auth/logout` | Optional | 120/min | End session |
| GET | `/api/auth/me` | Optional | 120/min | Get current user |
| PUT | `/api/auth/profile` | Required | 120/min | Update profile |
| POST | `/api/auth/send-reminder` | No | 120/min | Trigger Day 15/25 reminders |

## Data Architecture

### Database Tables (12)
**Original (7):**
- **users** — Email, name, language preference, auth fields (is_verified, last_login, login_count)
- **complaints** — Full complaint lifecycle with user_id linkage
- **complaint_feedback** — Citizen outcome reports, fake closure detection
- **ministry_stats** — 30 ministries with performance metrics
- **state_grievance_stats** — 36 states/UTs with complaint data
- **trending_issues** — 8 systemic issue clusters
- **social_signals** — 8 Twitter/news monitoring entries

**New (5 — Week 4):**
- **auth_otp** — OTP codes with expiry, attempts, purpose
- **user_sessions** — JWT session tracking with IP/user-agent
- **rate_limits** — Per-IP/endpoint request counting
- **audit_log** — Security event history
- **email_queue** — Notification queue (OTP, reminders, welcome)

### Seed Data
- 96+ rows across 12 tables
- 30 ministries, 36 states, 8 trending issues, 8 social signals, 3+ users, 3+ sample complaints

## Development

```bash
# Install dependencies
npm install

# Setup database
npm run db:migrate:local && npm run db:seed

# Build and preview
npm run build
npm run preview   # or: pm2 start ecosystem.config.cjs

# Environment variables (.dev.vars file)
# GEMINI_API_KEY=your_key_here
# RESEND_API_KEY=your_resend_key_here  (optional - for email delivery)
```

## Pages (10)
1. `/` — Home with hero, stats, problem/solution, trending preview
2. `/complaint` — 7-step AI complaint wizard
3. `/tracker` — Countdown timer, timeline, action recommendations
4. `/my-complaints` — History with stats and filtering (user-filtered when logged in)
5. `/dashboard` — GeoJSON map, charts, scorecard, trending, social
6. `/rti` — RTI auto-drafter with PDF download
7. `/how-it-works` — 5-step citizen flow + researcher flow
8. `/about` — Project info and team
9. `/login` — Email OTP sign-in (3-step flow) — **NEW**
10. `/profile` — Account settings and security — **NEW**

## Weekly Progress
- **Week 1** ✅ Foundation: 7 pages, 12 APIs, 7 DB tables, 36 states, 30 ministries, mock AI
- **Week 2** ✅ AI Core: Gemini integration, 17 categories, transparency badges, 14 APIs
- **Week 3** ✅ UX & Completeness: 7-step wizard, computed timelines, My Complaints, Hindi UI, GeoJSON, Chart.js
- **Week 4** ✅ Auth & Security: Email OTP login, JWT sessions, CSP headers, rate limiting, XSS sanitization, audit logging, email reminders, user profiles
- **Week 5** 📋 Analytics: District drill-down, PDF export, advanced charts
- **Week 6** 📋 Regional & Data: Tamil/Telugu/Bengali UI, CPGRAMS scraping, Twitter API
- **Week 7** 📋 Final: 2G testing, Lighthouse optimization, deployment, documentation

## Codebase
- **Source Files**: 15 TypeScript files
- **Total Lines**: ~6,200
- **Bundle Size**: 310 KB
- **DB Tables**: 12
- **API Endpoints**: 22
- **Features**: 28
- **Dependencies**: Hono ^4.12.5
- **CDN Libraries**: Tailwind CSS, Leaflet 1.9.4, Chart.js 4.4.0, jsPDF 2.5.1, Font Awesome 6.5.0

## License
Open source civic tech. Built for India's citizens.

**Last Updated**: March 26, 2026 (Week 4)
