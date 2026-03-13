# GrievanceIQ — Week 2 Report: AI Intelligence Core

**Date:** March 13, 2026
**Developer:** Darshan Kumar
**Repository:** https://github.com/DarshanKumarM8/GrievanceIQ
**Live Preview:** https://3000-ijj8l21qjw9nnoh5yjcir-2b54fc91.sandbox.novita.ai

---

## 1. Executive Summary

Week 2 focused on building the **AI Intelligence Core** — integrating Google Gemini API as the primary AI engine for complaint analysis, department classification, quality scoring, complaint rewriting, and RTI generation. The system is designed with a **smart dual-layer architecture**: Gemini AI as primary with an intelligent keyword-based fallback that activates instantly if the API is unavailable or rate-limited.

---

## 2. What Was Built This Week

### 2.1 Gemini AI Service Module (`src/services/gemini.ts`)

**Architecture: Dual-layer with automatic failover**

```
User Complaint → Gemini 2.0 Flash → (if fails) → Gemini 2.0 Flash Lite → (if fails) → Mock Keyword Classifier v2
```

| Feature | Implementation |
|---------|---------------|
| **Model Fallback Chain** | `gemini-2.0-flash` → `gemini-2.0-flash-lite` → `mock-keyword-v2` |
| **Retry Logic** | Exponential backoff (1s, 2s, 4s) with configurable retries per model |
| **Rate Limit Handling** | Detects HTTP 429, waits and retries, then falls back to next model |
| **Request Timeout** | 30-second AbortController timeout per API call |
| **Response Validation** | JSON schema validation with sanitization (departments array, score ranges) |
| **Error Logging** | Console logging with `[Gemini]` prefix for debugging |
| **Source Tracking** | Every response includes `_ai_source` (gemini/mock) and `_ai_model` fields |

### 2.2 AI Prompts (Production-Grade)

**Complaint Analysis Prompt:**
- Full 92-ministry CPGRAMS list embedded in prompt
- Structured JSON output with schema enforcement
- Scoring guide (1-10) with clear criteria
- Document checklist generation with complaint-type specificity
- Multilingual instruction: "Write improved_draft in SAME LANGUAGE as input"
- Safety: "NEVER provide legal advice. NEVER guarantee outcomes."

**RTI Generation Prompt:**
- Formal legal format with Section 6(1) RTI Act 2005 citation
- 7-8 SPECIFIC information requests (file notings, officer details, inquiry reports)
- Complaint-type-specific additional questions
- Fee and exemption declarations
- Filing instructions (rtionline.gov.in and postal)
- Legal references (Sections 7, 19, 20 for penalties)

### 2.3 Enhanced Mock Fallback (17 Categories)

When Gemini is unavailable, the mock classifier covers **17 complaint categories** with specific department mappings:

1. Pension & Retirement
2. Agriculture & PM-KISAN
3. Railways & IRCTC
4. Passport & Visa
5. Roads & Highways
6. Electricity & Power
7. Ration & PDS
8. Labour & EPFO
9. Health & Ayushman
10. Education & UGC
11. Water & Sanitation
12. Gas & LPG
13. Banking & Finance
14. Police & Crime
15. Tax & Income Tax
16. Telecom & Mobile
17. Housing & Property

Each category maps to 3 ranked departments with confidence scores, reasons, and relevant document checklists (12 specialized checklist sets).

### 2.4 API Upgrades

| Endpoint | Week 1 | Week 2 |
|----------|--------|--------|
| `POST /api/complaints/analyze` | Mock only | Gemini AI + mock fallback |
| `POST /api/rti/generate` | Static template | Gemini AI + enhanced template |
| `GET /api/health` | Basic | Shows AI engine status, model, features list |
| `GET /api/complaints/recent` | — | **NEW** List recent analyzed complaints |
| `GET /api/complaints/:id` | — | **NEW** Get full complaint by ID |
| Feedback response | Basic | Enhanced with contextual messages |

**Total API Endpoints: 14** (12 from Week 1 + 2 new)

### 2.5 UI Improvements

**Complaint Builder Page (`/complaint`):**
- **AI Source Badge**: Shows whether response came from Gemini or Mock, model name, latency
- **Translation Section**: Auto-shows detected language and English translation
- **Quality Score Labels**: Added "Weak/Fair/Good/Strong/Perfect" labels
- **Better Loading UX**: Step-by-step progress with animated checkmarks
- **4-Step Next Actions**: Added RTI escalation as 4th step
- **Score Badges**: Show before/after scores in side-by-side editor

**RTI Drafter Page (`/rti`):**
- **AI Source Badge**: Shows Gemini vs Template source
- **Enhanced PDF**: Title header and footer with GrievanceIQ branding
- **3 Filing Options**: Online (recommended), By Post, In Person
- **6 Legal References**: Sections 6, 7, 19(1), 19(3), 20 with penalty details
- **Disclaimer Banner**: Clear "not legal advice" warning

---

## 3. Data Classification: What's Real vs. Mock

| Category | Source | Details |
|----------|--------|---------|
| **92 Ministry Names** | 100% REAL | Official CPGRAMS ministry/department list |
| **Department Routing Logic** | AI-POWERED (when Gemini active) | Gemini 2.0 Flash analyzes text context, not just keywords |
| **Department Routing Fallback** | INTELLIGENT MOCK | 17-category keyword classifier with ranked confidence scores |
| **Quality Scoring** | AI-POWERED / RULES-BASED | Gemini generates scores when active; mock uses presence of dates, refs, locations, amounts |
| **Complaint Rewriting** | AI-POWERED / TEMPLATE | Gemini rewrites with context; mock adds professional formatting |
| **RTI Application** | AI-POWERED / TEMPLATE | Gemini generates department-specific RTI; mock uses comprehensive template |
| **Document Checklist** | AI-POWERED / RULES-BASED | Gemini generates specific docs; mock maps 12 department-specific checklists |
| **Ministry Statistics** | APPROXIMATED REAL | Based on publicly available CPGRAMS data |
| **State Grievance Data** | APPROXIMATED REAL | Population-proportional estimates for 36 states |
| **Trending Issues** | FABRICATED (realistic) | Based on real-world complaint patterns |
| **Social Signals** | FABRICATED (realistic) | Simulated Twitter/news monitoring data |
| **Complaint Tracking Timeline** | MOCK | Simulated 30-day timeline with milestone reminders |

### Key Week 2 Data Change:
- **Week 1**: ALL AI outputs were mock (keyword-only)
- **Week 2**: AI outputs use Gemini when available, with seamless fallback to enhanced mock
- **UI shows which engine was used** for every analysis — full transparency

---

## 4. Technical Architecture

### 4.1 File Changes This Week

| File | Action | Lines | Description |
|------|--------|-------|-------------|
| `src/services/gemini.ts` | REWRITTEN | 550+ | Complete Gemini service with dual-model fallback, retry logic, 17-category mock |
| `src/routes/api.ts` | REWRITTEN | 300+ | All routes now use async Gemini service, 2 new endpoints |
| `src/pages/complaint.ts` | REWRITTEN | 250+ | AI source badges, translation section, improved UX |
| `src/pages/rti.ts` | REWRITTEN | 180+ | AI source badge, better PDF, enhanced filing info |
| `.dev.vars` | UPDATED | 1 | Gemini API key stored securely |

### 4.2 Gemini API Configuration

```
Model: gemini-2.0-flash (primary), gemini-2.0-flash-lite (fallback)
Temperature: 0.2 (for consistent structured output)
Max Tokens: 4096 (complaint analysis), 4096 (RTI generation)
Response Format: JSON (analysis), Plain Text (RTI)
Rate Limits: 15 RPM / 1M tokens per day (free tier)
```

### 4.3 Security

- API key stored in `.dev.vars` (local) — NOT in source code
- `.dev.vars` is in `.gitignore` — never committed to GitHub
- For production: use `wrangler pages secret put GEMINI_API_KEY`
- System prompt explicitly prevents legal advice or guaranteed outcomes

---

## 5. Current Feature Status (After Week 2)

| Feature | Status | AI Source |
|---------|--------|-----------|
| Multilingual Complaint Intake | WORKING | 5 languages |
| Smart Department Router | WORKING | Gemini AI / Mock 17-category |
| Quality Scorer (1-10) | WORKING | Gemini AI / Rule-based |
| AI Complaint Builder | WORKING | Gemini AI / Template |
| Document Checklist Generator | WORKING | Gemini AI / 12 department sets |
| Complaint Tracker | WORKING | Mock timeline |
| RTI Auto-Drafter | WORKING | Gemini AI / Legal template |
| Fake Closure Feedback | WORKING | Database-driven |
| India Map (circle markers) | WORKING | 36 states with metrics |
| Department Scorecard | WORKING | 30 ministries with ranking |
| Trending Issues | WORKING | 8 seeded issues |
| Social Monitoring Feed | WORKING | 8 seeded signals |
| AI Source Transparency | **NEW** | Shows Gemini/Mock badge |
| Translation Display | **NEW** | Shows detected language + translation |
| Recent Complaints API | **NEW** | List analyzed complaints |

---

## 6. Gemini API Status

**Current Status:** Rate-limited (free tier quota temporarily exhausted during testing)

**Expected Behavior:**
- Free tier: 15 requests/minute, 1M tokens/day
- When quota resets, Gemini will automatically activate
- No code changes needed — the fallback architecture handles it
- UI clearly shows "Powered by Gemini AI" vs "Smart Keyword Analysis"

**To verify when Gemini is working:**
1. Visit `/api/health` — check `ai_status` field
2. Submit a complaint on `/complaint` — check the blue AI Source badge
3. `_ai_source: "gemini"` in API response means Gemini is active

---

## 7. Known Issues

1. **Gemini Rate Limit**: Free tier quota exhausted during testing. Will auto-recover.
2. **India Map**: Still using circle markers (GeoJSON boundaries planned for Week 5)
3. **Tracking**: Uses mock timeline — real CPGRAMS tracking not implemented
4. **No Email Notifications**: Day 15/25 reminders shown in UI only
5. **No Login System**: Complaints not tied to user accounts yet

---

## 8. Week 3 Plan

**Focus: Complaint Builder UI + Tracking System**

1. **Enhanced complaint flow** — multi-step wizard with real-time validation
2. **Complaint history** — save and retrieve past analyses (with consent)
3. **Track multiple complaints** — dashboard for managing CPGRAMS IDs
4. **Day 15/25 reminder system** — calculate from filing date
5. **RTI auto-trigger** — link tracker → RTI when 30 days pass
6. **Hindi interface** — start i18n with Hindi translation of UI labels
7. **Performance optimization** — lazy loading, code splitting

---

## 9. Decisions Needed for Week 3

1. **Do you want the Hindi UI translation this week or later?**
2. **Should we add a "My Complaints" section (requires local storage or consent-based DB)?**
3. **Any UI/design changes needed based on the current preview?**
4. **Is the Gemini API key quota resetting? (Check at https://ai.dev/rate-limit)**

---

## 10. How to Test

### Live Preview:
- **Homepage**: https://3000-ijj8l21qjw9nnoh5yjcir-2b54fc91.sandbox.novita.ai
- **Complaint Builder**: /complaint — try "My PM-KISAN payment has not come"
- **Tracker**: /tracker — enter any ID like PMOPG/E/2026/0012345
- **RTI Drafter**: /rti — fill name, generate PDF
- **Dashboard**: /dashboard — explore map, scorecard, trending
- **API Health**: /api/health — check AI status

### API Test:
```bash
# Analyze a complaint
curl -X POST /api/complaints/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"My passport application is delayed for 2 months","language":"en"}'

# Generate RTI
curl -X POST /api/rti/generate \
  -H "Content-Type: application/json" \
  -d '{"complainant_name":"Your Name","cpgrams_id":"PMOPG/E/2026/0012345","department":"Ministry of External Affairs","filing_date":"2026-01-15","complaint_summary":"Passport delayed"}'

# Check recent complaints
curl /api/complaints/recent

# Check system health
curl /api/health
```

---

*Report generated for GrievanceIQ Week 2. Next: Week 3 — Complaint Builder UI + Tracking System.*
