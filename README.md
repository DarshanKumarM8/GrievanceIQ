# GrievanceIQ

**File Smarter. Get Heard. Hold Them Accountable.**

AI-powered citizen grievance intelligence platform for India's CPGRAMS system. Helps citizens file smarter complaints, track progress with Day 15/25 countdown reminders, detect fake closures, and auto-draft RTI applications. Available in 7 Indian languages with dark mode, voice input, and advanced analytics.

## Live URLs

| Resource | URL |
|---|---|
| **Live Preview** | https://3000-ijj8l21qjw9nnoh5yjcir-5c13a017.sandbox.novita.ai |
| **GitHub** | https://github.com/DarshanKumarM8/GrievanceIQ |

## Current Version: 7.0.0 (Week 7 — UX Excellence & Advanced Visualizations)

### Feature Summary (65 features)

#### Citizen Tools
- **AI Complaint Builder** — 7-step wizard with real-time validation, language detection, department routing (92 ministries), quality scoring (before/after), improved draft, document checklist
- **Voice Input** (NEW) — Web Speech API for voice-to-text in 7 languages
- **Success Probability Score** (NEW) — AI-predicted resolution probability with actionable tips
- **Complaint Comparison Diff** (NEW) — Word-level diff between original and AI-improved text
- **Similar Complaints** (NEW) — AI-suggested similar complaints from database
- **Complaint Tracker** — CPGRAMS ID tracking with Day 15/25 countdown timer, computed timelines
- **RTI Auto-Drafter** — AI-generated Right to Information applications with legal references
- **My Complaints** — Full complaint history with advanced filters, pagination, and detail view
- **Complaint Detail View** — Full-page analysis display with gauges, side-by-side drafts, timeline

#### Public Dashboard
- **India Choropleth Map** — GeoJSON heatmap of 36 states/UTs with 4 switchable metrics
- **District Drill-Down** — Click any state to see 10-district breakdown table
- **Resolution Funnel** (NEW) — 7-stage complaint pipeline visualization with dropoff metrics
- **Complaint Heatmap Calendar** (NEW) — 12-month daily activity GitHub-style heatmap
- **Department Network Graph** (NEW) — Canvas-based inter-ministry transfer network (15 nodes)
- **15-Month Time-Series Charts** — National complaint trend, satisfaction vs fake closure
- **Department Comparison Radar** — Multi-metric radar comparing 6 ministries
- **State Sparklines** — 15-state grid with 6-month mini-trend charts
- **Analytics Charts** — Bar, doughnut, horizontal bar (8 total charts)
- **Department Scorecard** — Sortable table of 30 ministries with fake closure flags
- **Systemic Issue Radar** — 8 trending complaint clusters with spike factors
- **Social Monitoring Feed** — Twitter/news signals with trend direction
- **PDF Export** — One-click dashboard report generation

#### UX & Performance (NEW - Week 7)
- **Dark Mode** — System preference detection + manual toggle, persistent preference
- **Notifications Center** — Bell icon, unread count badge, real-time polling (60s)
- **Lazy Loading** — IntersectionObserver for dashboard visualizations
- **Scroll Animations** — Fade-in on scroll for [data-animate] elements
- **DNS Prefetch** — Pre-resolve CDN domains for faster loading
- **Link Prefetching** — Hover-triggered prefetch for internal navigation
- **Resource Hints** — Critical API prefetching

#### Authentication & Security
- **Passwordless Login** — Email OTP (6-digit, 10-min expiry, 5-attempt lockout)
- **JWT Sessions** — HMAC-SHA256, 7-day expiry, stored in D1
- **Security Headers** — CSP, HSTS, X-Frame-Options, Referrer-Policy
- **Rate Limiting** — D1-based (120 req/min API, 10 req/5min auth)
- **XSS Sanitization** — Input validation and HTML entity encoding
- **Audit Logging** — Auth events tracked in audit_log table

#### Regional Language Support
- **7 Languages**: English, Hindi, Tamil, Telugu, Bengali, Marathi, Kannada
- **50+ translation keys** per language covering all UI elements
- **Language picker dropdown** in navigation bar with persistent selection
- **Profile language preference** saved to database

#### CPGRAMS Data Integration
- **CPGRAMS Lookup** — Official complaint status, department, officer, overdue detection
- **Bulk Sync** — Sync user complaints with CPGRAMS for discrepancy detection
- **Alerts System** — Critical/warning alerts for overdue and fake-closed complaints
- **Statistics** — Aggregate CPGRAMS tracking metrics

#### Accessibility (WCAG 2.1 AA)
- Skip-to-content, ARIA landmarks, keyboard navigation, focus-visible styles
- prefers-reduced-motion, prefers-contrast: high, screen reader support

#### SEO
- Open Graph tags, Twitter Cards, JSON-LD, per-page meta, sitemap.xml, robots.txt

#### Admin Dashboard
- System Health Monitor, CPGRAMS Alerts, Audit Log Viewer, Email Queue, Department Performance Chart

## API Endpoints (41+ total)

### Core APIs (18)
| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Service status, version, 65 features |
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
| GET | `/api/complaints/similar` | Similar complaints by department (NEW) |
| GET | `/api/complaints/:id/detail` | Full complaint view |
| GET | `/api/complaints/recent` | Recent complaints list |
| GET | `/api/complaints/stats` | Complaint statistics |

### Analytics APIs (8)
| Method | Path | Description |
|---|---|---|
| GET | `/api/analytics/timeseries` | 15-month national trend data |
| GET | `/api/analytics/comparison` | Radar chart metrics |
| GET | `/api/analytics/sparklines` | State 6-month trends |
| GET | `/api/analytics/heatmap` | 12-month daily heatmap calendar (NEW) |
| GET | `/api/analytics/funnel` | Resolution pipeline funnel (NEW) |
| GET | `/api/analytics/network` | Department interaction graph (NEW) |
| GET | `/api/analytics/success-probability` | AI success prediction (NEW) |

### CPGRAMS Integration APIs (4)
| Method | Path | Description |
|---|---|---|
| GET | `/api/cpgrams/lookup/:id` | Official CPGRAMS status lookup |
| POST | `/api/cpgrams/sync` | Bulk sync with discrepancy detection |
| GET | `/api/cpgrams/alerts` | Active alerts (overdue/fake closure) |
| GET | `/api/cpgrams/statistics` | Aggregate CPGRAMS stats |

### Admin APIs (3)
| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/audit-logs` | Last 50 audit entries |
| GET | `/api/admin/email-queue` | Last 30 queued emails |
| GET | `/api/admin/system-health` | Full system health check |

### Notification APIs (3) — NEW
| Method | Path | Description |
|---|---|---|
| GET | `/api/notifications` | User notifications with unread count |
| POST | `/api/notifications/read` | Mark notifications as read |
| DELETE | `/api/notifications/:id` | Delete a notification |

### Auth APIs (6)
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/request-otp` | Request email OTP |
| POST | `/api/auth/verify-otp` | Verify OTP & get JWT |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/auth/logout` | End session |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/send-reminder` | Trigger email reminders |

### SEO Routes (2)
| Method | Path | Description |
|---|---|---|
| GET | `/sitemap.xml` | Auto-generated XML sitemap |
| GET | `/robots.txt` | Crawler directives |

## Pages (12)

| Page | Path | Description |
|---|---|---|
| Home | `/` | Landing page with CTAs |
| File Complaint | `/complaint` | 7-step AI wizard + voice input + diff + success score |
| Track Complaint | `/tracker` | CPGRAMS tracker with countdown |
| My Complaints | `/my-complaints` | Filtered complaint history |
| Complaint Detail | `/complaint-detail?id=X` | Full AI analysis view |
| Dashboard | `/dashboard` | Public analytics + funnel + heatmap + network |
| RTI Drafter | `/rti` | AI RTI application generator |
| How It Works | `/how-it-works` | Platform guide |
| About | `/about` | About page |
| Login | `/login` | Email OTP login |
| Profile | `/profile` | User settings & security |
| Admin | `/admin` | System health & analytics |

## Data Architecture

### Database: Cloudflare D1 (SQLite)
- **13 tables**: users, complaints, complaint_feedback, ministry_stats, trending_issues, social_signals, state_grievance_stats, auth_otp, user_sessions, rate_limits, audit_log, email_queue, notifications
- **Seed data**: 30 ministries, 36 states/UTs, 8 trending issues, 10+ social signals, 3 demo complaints

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
| 5 | Analytics | Time-series, radar, sparklines, district drill-down, PDF, filters |
| 6 | Platform | 7 regional languages, CPGRAMS, A11y, SEO, admin dashboard |
| 7 | UX Excellence | Dark mode, notifications, funnel/heatmap/network, voice input, diff, success score, performance |

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

## Project Statistics

| Metric | Value |
|---|---|
| Version | 7.0.0 |
| Features | 65 |
| API Endpoints | 41+ |
| Pages | 12 |
| Source Files | 19 TypeScript files |
| Lines of Code | ~10,500 |
| Bundle Size | 482 KB |
| DB Tables | 13 |
| DB Migrations | 4 |
| Languages | 7 (EN, HI, TA, TE, BN, MR, KN) |

## Deployment

- **Platform**: Cloudflare Pages
- **Status**: Active (Development)
- **Bundle**: 482 KB
- **Tech**: Hono + TypeScript + Tailwind CSS + Chart.js + Leaflet
- **Last Updated**: April 15, 2026
