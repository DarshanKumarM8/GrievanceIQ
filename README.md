# GrievanceIQ

**File Smarter. Get Heard. Hold Them Accountable.**

AI-powered citizen grievance intelligence platform for India's CPGRAMS system. Helps citizens file smarter complaints, track progress with Day 15/25 countdown reminders, detect fake closures, and auto-draft RTI applications.

## Live URLs

| Resource | URL |
|---|---|
| **Live Preview** | https://3000-ijj8l21qjw9nnoh5yjcir-5c13a017.sandbox.novita.ai |
| **GitHub** | https://github.com/DarshanKumarM8/GrievanceIQ |

## Current Version: 5.0.0 (Week 5)

### Feature Summary (37 features)

#### Citizen Tools
- **AI Complaint Builder** — 7-step wizard with real-time validation, language detection, department routing (92 ministries), quality scoring (before/after), improved draft, document checklist
- **Complaint Tracker** — CPGRAMS ID tracking with Day 15/25 countdown timer, computed timelines, recommended actions
- **RTI Auto-Drafter** — AI-generated Right to Information applications with legal references and filing options
- **My Complaints** — Full complaint history with **advanced filters** (search, status, department, date range, quality score), **pagination**, and clickable detail view
- **Complaint Detail View** — Full-page AI analysis display with department routing, quality gauges, side-by-side drafts, document checklist, timeline, feedback history, and PDF export

#### Public Dashboard
- **India Choropleth Map** — GeoJSON heatmap of 36 states/UTs with 4 switchable metrics
- **District Drill-Down** — Click any state to see 10-district breakdown table with complaints, resolution, fake closure, satisfaction
- **15-Month Time-Series Charts** — National complaint trend, satisfaction vs fake closure, top 5 ministry comparison
- **Department Comparison Radar** — Multi-metric radar comparing 6 ministries across 6 dimensions
- **State Sparklines** — 15-state grid with inline 6-month mini-trend charts
- **Analytics Charts** — Bar, doughnut, horizontal bar (4 original + 4 new = 8 total charts)
- **Department Scorecard** — Sortable table of 30 ministries with fake closure flags
- **Systemic Issue Radar** — 8 trending complaint clusters with spike factors
- **Social Monitoring Feed** — Twitter/news signals with trend direction
- **PDF Export** — One-click dashboard report generation with jsPDF

#### Authentication & Security
- **Passwordless Login** — Email OTP (6-digit, 10-min expiry, 5-attempt lockout, demo mode)
- **JWT Sessions** — HMAC-SHA256, 7-day expiry, stored in D1
- **Security Headers** — CSP, HSTS, X-Frame-Options, Referrer-Policy
- **Rate Limiting** — D1-based (120 req/min API, 10 req/5min auth)
- **XSS Sanitization** — Input validation and HTML entity encoding
- **Audit Logging** — Auth events tracked in audit_log table

#### Language Support
- **Hindi/English Toggle** — Full UI translation (navigation, labels, form text)
- **Multi-Language Input** — Complaint analysis in English, Hindi, Tamil, Telugu, Bengali

## API Endpoints (28 total)

### Core APIs (16)
| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Service status, version, features |
| GET | `/api/stats` | Aggregate dashboard statistics |
| GET | `/api/ministries` | Ministry scorecard (sort, limit) |
| GET | `/api/ministries/:code` | Single ministry detail |
| GET | `/api/states` | All state grievance data |
| GET | `/api/states/:code` | Single state detail |
| GET | `/api/states/:code/districts` | District drill-down data |
| GET | `/api/trending` | Trending issue clusters |
| GET | `/api/social` | Social monitoring signals |
| POST | `/api/complaints/analyze` | AI complaint analysis |
| POST | `/api/complaints/track` | Track by CPGRAMS ID |
| POST | `/api/feedback` | Citizen outcome report |
| POST | `/api/rti/generate` | Generate RTI application |
| GET | `/api/complaints/search` | Advanced search/filter with pagination |
| GET | `/api/complaints/:id/detail` | Full complaint view |
| GET | `/api/complaints/recent` | Recent complaints list |

### Analytics APIs (4)
| Method | Path | Description |
|---|---|---|
| GET | `/api/analytics/timeseries` | 15-month national trend data |
| GET | `/api/analytics/comparison` | Radar chart metrics |
| GET | `/api/analytics/sparklines` | State 6-month trends |
| GET | `/api/complaints/stats` | Complaint statistics |

### Auth APIs (8)
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/request-otp` | Request email OTP |
| POST | `/api/auth/verify-otp` | Verify OTP & get JWT |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/auth/logout` | End session |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/send-reminder` | Trigger email reminders |

## Pages (11)

| Page | Path | Description |
|---|---|---|
| Home | `/` | Landing page with CTAs |
| File Complaint | `/complaint` | 7-step AI complaint wizard |
| Track Complaint | `/tracker` | CPGRAMS tracker with countdown |
| My Complaints | `/my-complaints` | Filtered complaint history |
| Complaint Detail | `/complaint-detail?id=X` | Full AI analysis view |
| Dashboard | `/dashboard` | Public analytics dashboard |
| RTI Drafter | `/rti` | AI RTI application generator |
| How It Works | `/how-it-works` | Platform guide |
| About | `/about` | About page |
| Login | `/login` | Email OTP login |
| Profile | `/profile` | User settings & security |

## Data Architecture

### Database: Cloudflare D1 (SQLite)
- **12 tables**: users, complaints, complaint_feedback, ministry_stats, trending_issues, social_signals, state_grievance_stats, auth_otp, user_sessions, rate_limits, audit_log, email_queue
- **Seed data**: 30 ministries, 36 states/UTs, 8 trending issues, 10+ social signals, 3 demo complaints

### Storage
- **D1 SQLite** — All application data
- **JWT** — Session tokens (client-side storage with server validation)
- **LocalStorage** — Auth state, language preference

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Cloudflare Workers (Edge) |
| Framework | Hono v4 (TypeScript) |
| Database | Cloudflare D1 (SQLite) |
| AI Engine | Google Gemini 2.0 Flash (with 17-category mock fallback) |
| CSS | Tailwind CSS (CDN) |
| Charts | Chart.js 4.4.0 |
| Maps | Leaflet 1.9.4 + GeoJSON India |
| PDF | jsPDF 2.5.1 |
| Icons | Font Awesome 6.5.0 |
| Build | Vite 6 + wrangler |
| Process | PM2 |

## Development Milestones

| Week | Focus | Features Added |
|---|---|---|
| 1 | Foundation | 7 SSR pages, 14 REST endpoints, D1 schema, seed data |
| 2 | AI Core | Gemini integration, 17-category fallback, AI transparency |
| 3 | Visualization | Chart.js, GeoJSON choropleth, 7-step wizard, Hindi UI |
| 4 | Security | Email OTP auth, JWT, CSP, rate limiting, XSS, audit log |
| 5 | Analytics | Time-series, radar, sparklines, district drill-down, PDF, filters, detail view |

## Quick Start

```bash
# Install
npm install

# Database setup
npm run db:migrate:local
npm run db:seed

# Development
npm run build
npm run preview

# Deploy to Cloudflare
npm run deploy
```

## Deployment

- **Platform**: Cloudflare Pages
- **Status**: Active (Development)
- **Bundle**: 364 KB
- **Tech**: Hono + TypeScript + Tailwind CSS + Chart.js + Leaflet
- **Last Updated**: March 31, 2026
