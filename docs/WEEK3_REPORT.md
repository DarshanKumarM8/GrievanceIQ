# GrievanceIQ — Week 3 Development Report

**Date**: March 22, 2026
**Version**: 3.0.0
**Repository**: https://github.com/DarshanKumarM8/GrievanceIQ
**Live Preview**: https://3000-ijj8l21qjw9nnoh5yjcir-2b54fc91.sandbox.novita.ai

---

## Executive Summary

Week 3 focused on **UX enhancement and citizen journey completeness**. The core complaint filing flow now spans 7 guided steps with real-time validation. Complaint tracking gained computed timelines with live countdown timers and context-aware action recommendations. A dedicated "My Complaints" history page was added, and the first phase of Hindi UI localization was implemented.

---

## New Features Delivered

### 1. 7-Step Complaint Wizard (Enhanced from 4 Steps)
**Files**: `src/pages/complaint.ts` (40,816 chars, complete rewrite)

Steps:
1. **Write** — Describe problem in any language with 8 quick templates
2. **Validate** — Real-time validation checks (6 quality indicators) as user types
3. **Analyze** — AI processing with animated step-by-step progress
4. **Route** — Department routing with confidence bars (top 3 from 92 ministries)
5. **Improve** — Side-by-side editor: original vs AI-improved complaint
6. **Docs** — Interactive document checklist with checkboxes
7. **File** — Action cards (copy, file on CPGRAMS, track, escalate) + save link

**Real-time Validation Checks** (Step 2):
- Minimum 30 words
- Contains dates
- Has reference/application numbers
- Includes location details
- Financial amounts mentioned
- Government scheme/law referenced
- Visual progress bar with score (0/6 to 6/6)

**New Templates Added**: EPFO/PF withdrawal, Banking complaints (total: 8)

### 2. Computed Timelines with Day 15/25 Countdown
**Files**: `src/routes/api.ts` (replaced mock timeline), `src/pages/tracker.ts` (23,452 chars, complete rewrite)

- **Live countdown timer**: Days, hours, minutes, seconds to Day 30 deadline
- **Milestone tracker**: Filed → Day 15 Reminder → Day 25 Warning → Deadline
- **Smart status detection**: on_track / follow_up / urgent / overdue
- **Dynamic timeline generation**: Events appear based on days elapsed
- **Context-aware actions**: Different recommendations for each phase:
  - Days 1-15: Wait, check CPGRAMS, prepare documents
  - Days 15-25: Send reminder, call department, prepare RTI
  - Days 25-30: Urgent final reminder, draft RTI, escalate
  - Days 30+: File RTI, report fake closure, first appeal, CIC
- **Custom filing date**: Users can enter actual filing date for accurate countdown
- **Database-aware**: Checks D1 for existing complaint filing dates

### 3. My Complaints History Page
**Files**: `src/pages/my-complaints.ts` (13,016 chars, new file)

- **Stats overview**: Total / Drafts / Filed / Resolved / RTI Filed / Fake Closed
- **Filter bar**: All / Drafts / Filed / Pending / Resolved / Escalated / Fake Closed
- **Complaint cards**: Status badge, department, confidence, quality score change, CPGRAMS ID
- **Quick actions**: Track (for filed), RTI (for unresolved), New complaint
- **Empty state**: Friendly prompt to file first complaint
- **API endpoints**: `GET /api/complaints/all?status=X`, `GET /api/complaints/stats`

### 4. Hindi UI Toggle (i18n Foundation)
**Files**: `src/pages/layout.ts` (updated with i18n system)

- **Language toggle button** in navigation bar (Hindi/English)
- **`data-i18n` attribute system**: Elements tagged for translation
- **localStorage persistence**: Language preference saved across sessions
- **i18n dictionary**: 15+ key strings translated to Hindi
  - Navigation: Home, File Complaint, Track, My Complaints, Dashboard, etc.
  - Page titles and subtitles
  - CTA buttons
- **Foundation for expansion**: Easy to add Tamil, Telugu, Bengali, Marathi

### 5. GeoJSON Choropleth Map (Dashboard)
**Files**: `src/pages/dashboard.ts`

- **CDN-loaded GeoJSON**: `geojson-india/india.json` (216 KB, 37 features)
- **State name → code mapping**: 37 states/UTs mapped to D1 state codes
- **4 metric views**: Total Complaints, Resolution Rate, Fake Closure Rate, Avg Resolution Days
- **Interactive tooltips**: State name, complaints, resolution %, fake closure %
- **Click-to-expand**: State info panel with top issues and departments
- **Hover effects**: Weight increase, opacity change, bring to front
- **Dynamic legend**: Color scale adjusts per metric (warm/cool scales)
- **Loading overlay**: Spinner while GeoJSON loads
- **Error fallback**: User-friendly retry message

### 6. Chart.js Dashboard Visualizations
**Files**: `src/pages/dashboard.ts`

4 interactive charts:
1. **Ministry Bar Chart** — Top 10 by complaint volume (navy gradient)
2. **Status Doughnut** — Actually Resolved / Fake Closed / Pending (with cutout)
3. **Fake Closure Horizontal Bar** — Top 8 worst offenders (color-coded thresholds)
4. **Resolution Days Mixed Chart** — Bar + 30-day target line overlay

---

## API Changes

### New Endpoints (Week 3)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/complaints/all` | List all complaints with optional status filter |
| GET | `/api/complaints/stats` | Aggregate complaint statistics |

### Enhanced Endpoints
| Method | Path | Change |
|--------|------|--------|
| GET | `/api/health` | Version 3.0.0, 19 features listed |
| POST | `/api/complaints/track` | Now accepts `filing_date`, returns computed timeline with day15/day25 dates, milestones, action phases |

### Total API Endpoints: 16
health, stats, ministries (list + detail), states (list + detail), trending, social, complaints/analyze, complaints/track, complaints/recent, complaints/all, complaints/stats, complaints/:id, feedback, rti/generate

---

## File Changes Summary

| File | Action | Lines Changed |
|------|--------|--------------|
| `src/pages/complaint.ts` | Rewritten | +498 lines (7-step wizard) |
| `src/pages/tracker.ts` | Rewritten | +385 lines (countdown, actions) |
| `src/pages/my-complaints.ts` | **New** | +322 lines |
| `src/pages/layout.ts` | Enhanced | +95 lines (i18n, nav, lang toggle) |
| `src/pages/dashboard.ts` | Enhanced | GeoJSON + Chart.js (existing) |
| `src/routes/api.ts` | Enhanced | +180 lines (computed timeline, new endpoints) |
| `src/index.tsx` | Updated | +2 lines (new route) |

**Total**: 7 files changed, 1,388 insertions, 206 deletions
**Codebase**: 12 source files, 4,773 lines, 9 page components

---

## Current Architecture

```
8 Pages: /, /complaint, /tracker, /dashboard, /my-complaints, /rti, /how-it-works, /about
16 API Endpoints: health, stats, ministries, states, trending, social, complaints (6), feedback, rti
7 DB Tables: users, complaints, complaint_feedback, ministry_stats, state_grievance_stats, trending_issues, social_signals
AI: Gemini 2.0 Flash → Flash Lite → Mock (17 categories)
Bundle: 260 KB compiled
```

---

## Known Issues

1. **Gemini API rate limits**: Free tier (15 RPM). Auto-falls back to mock keyword classifier.
2. **No authentication**: All complaints stored without user sessions. My Complaints shows all DB entries.
3. **Hindi translation**: Only navigation and key labels translated. Full page content pending.
4. **No email notifications**: Day 15/25 reminders are visual only (countdown timer), not email-based.
5. **Static seed data**: Dashboard metrics from seed.sql, not live data pipeline.

---

## Week 4 Plan

1. **User Authentication**: Magic-link/email OTP login with JWT sessions
2. **Email Reminders**: SendGrid/Resend integration for Day 15/25 alerts
3. **Input Sanitization**: XSS prevention, SQL injection protection
4. **Rate Limiting**: Per-IP throttling on complaint analysis endpoint
5. **CAPTCHA**: Cloudflare Turnstile for complaint submission
6. **CSRF Protection**: Token-based form protection
7. **CSP Headers**: Content Security Policy for CDN resources
8. **Authenticated Feedback**: Link feedback to verified user accounts

---

## Testing

```bash
# Health check
curl https://3000-ijj8l21qjw9nnoh5yjcir-2b54fc91.sandbox.novita.ai/api/health

# Complaint analysis
curl -X POST https://3000-ijj8l21qjw9nnoh5yjcir-2b54fc91.sandbox.novita.ai/api/complaints/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"My PM-KISAN payment has not come for 3 months","language":"en"}'

# Computed timeline (with filing date)
curl -X POST https://3000-ijj8l21qjw9nnoh5yjcir-2b54fc91.sandbox.novita.ai/api/complaints/track \
  -H "Content-Type: application/json" \
  -d '{"cpgrams_id":"PMOPG/E/2026/0012345","filing_date":"2026-03-05"}'

# My complaints stats
curl https://3000-ijj8l21qjw9nnoh5yjcir-2b54fc91.sandbox.novita.ai/api/complaints/stats

# All complaints
curl https://3000-ijj8l21qjw9nnoh5yjcir-2b54fc91.sandbox.novita.ai/api/complaints/all
```
