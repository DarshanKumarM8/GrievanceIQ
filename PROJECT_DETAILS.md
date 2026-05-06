# GrievanceIQ: End-to-End Project Details

**Tagline:** File Smarter. Get Heard. Hold Them Accountable.

## 1. What is GrievanceIQ?

GrievanceIQ is an AI-powered citizen grievance intelligence platform designed to augment India's CPGRAMS (Centralized Public Grievance Redress and Monitoring System). It empowers citizens to file high-quality, smarter complaints, track their progress with built-in accountability features (like Day 15/25 countdown reminders), detect fake closures, and automatically draft RTI (Right to Information) applications. 

The platform is designed with accessibility and inclusivity in mind, offering full support for 7 Indian regional languages, voice input, and a fully featured dark mode. It also serves as an intelligence dashboard for policymakers, journalists, and the public, providing advanced analytics, geo-spatial maps, and real-time trending issues.

---

## 2. Tech Stack & Architecture

- **Runtime:** Cloudflare Workers (Edge-optimized)
- **Framework:** Hono v4 (TypeScript)
- **Database:** Cloudflare D1 (Serverless SQLite with 13 tables)
- **AI Engine:** Google Gemini 2.0 Flash (with a 17-category mock fallback)
- **Frontend / Styling:** Vanilla JS/TS, Tailwind CSS (CDN)
- **Visualizations:** Chart.js 4.4.0, Leaflet 1.9.4 + GeoJSON India (Maps)
- **Build / Tooling:** Vite 6 + Cloudflare Wrangler
- **Deployment:** Cloudflare Pages

---

## 3. Features Implemented (65+ Core Features)

The platform is currently at Version 8.0.0, containing over 65 features distributed across various functional areas:

### 3.1 Citizen Tools
- **AI Complaint Builder:** A 7-step wizard featuring real-time validation, language detection, automatic department routing (across 92 ministries), quality scoring, improved AI-drafted text, and a required document checklist.
- **Voice Input:** Web Speech API integration allowing voice-to-text dictation in 7 languages.
- **Success Probability Score:** AI-predicted gauge of resolution likelihood based on department track records and complaint quality, providing actionable tips.
- **Complaint Comparison Diff:** A word-level visual diff between the user's original text and the AI-improved text.
- **Similar Complaints AI:** Detects and suggests similar historical complaints based on department routing to set citizen expectations.
- **Complaint Tracker:** CPGRAMS ID tracking paired with a Day 15/25 countdown timer and computed timelines.
- **RTI Auto-Drafter:** AI-powered generation of Right to Information applications pre-filled with legal references.
- **My Complaints & Detail View:** Full complaint history with advanced filters, pagination, and a full-page analysis display containing gauges, timeline, and side-by-side drafts.

### 3.2 Public Dashboard & Analytics
- **India Choropleth Map & District Drill-Down:** GeoJSON heatmap of 36 states/UTs with 4 switchable metrics, and a click-through to view 10-district breakdowns.
- **Advanced Visualizations:** 
  - *Resolution Funnel:* A 7-stage pipeline showing complaint drop-off rates.
  - *Complaint Heatmap Calendar:* A 12-month GitHub-style daily contribution grid.
  - *Department Network Graph:* A canvas-based force graph of inter-ministry complaint transfers.
- **Time-Series & Radars:** 15-month national complaint trend charts, Department Comparison Radars, and State Sparklines (6-month trends).
- **Scorecards & Radars:** A 30-ministry scorecard with fake closure flags and a Systemic Issue Radar detecting trending complaint clusters.

### 3.3 UX, Performance & Accessibility
- **Dark Mode:** System preference detection and manual toggling, persistently saved.
- **Notifications Center:** Real-time polling (60s) for system updates, AI analysis results, and tracking alerts.
- **Performance:** DNS prefetching, hover-triggered link prefetching, IntersectionObserver-based lazy loading for heavy dashboard charts, and scroll fade-in animations.
- **Accessibility:** WCAG 2.1 AA compliant, screen reader support, keyboard navigation, and `prefers-reduced-motion` integration.

### 3.4 Authentication & Security
- **Passwordless Login:** Email OTP (6-digit, 10-minute expiry) with 5-attempt lockout logic.
- **JWT Sessions:** HMAC-SHA256 encrypted, 7-day expiry stored securely in D1.
- **Robust Security:** D1-based Rate Limiting (120 req/min API), XSS Sanitization, HTTP Security Headers (CSP, HSTS), and an Audit Logging system.

### 3.5 Regional Language Support
- Full localization in **7 Languages:** English, Hindi, Tamil, Telugu, Bengali, Marathi, and Kannada, powered by a language picker and profile preferences.

---

## 4. End-to-End Dynamic Data Parsing Pipeline

A critical component of GrievanceIQ is its **Dynamic Data Layer (v8.0.0)**, which completely automates the ingestion of live grievance data without human intervention. The platform uses zero external servers, relying entirely on Cloudflare Cron Triggers to run edge scripts.

### 4.1 Ministry & State Stats from DARPG (Monthly)
- **Source:** Official DARPG (Department of Administrative Reforms and Public Grievances) monthly PDF reports (Central Ministries & States/UTs).
- **Execution:** A Cloudflare Cron Trigger runs `darpg-fetcher.ts` on the 1st of every month at 2:00 AM.
- **How it works:** 
  1. The script fetches the latest DARPG monthly report index.
  2. Downloads the PDF as an ArrayBuffer and extracts text/tables using `pdf-parse` (enabled via Workers `nodejs_compat` flag).
  3. Maps extracted rows to the 30 ministries and 36 states/UTs in the database.
  4. Automatically updates `ministry_stats` and `state_grievance_stats` tables with real data: complaints received, disposed, pending, avg resolution days, and GRAI (Grievance Redressal Assessment and Index) rankings.

### 4.2 Trending Issues & Social Signals (Daily)
- **Source:** 5 major news RSS feeds (PIB, The Hindu, Indian Express, Hindustan Times, NDTV) and internal platform user complaints.
- **Execution:** `rss-monitor.ts` runs at midnight, and `aggregator.ts` runs at 2:30 AM daily.
- **How it works:**
  1. **RSS Monitor:** Fetches the RSS XMLs, parses them using `fast-xml-parser`, and searches for grievance-related keywords (e.g., "CPGRAMS", "PM-KISAN", "EPFO"). Matching articles are inserted into the `social_signals` feed.
  2. **Platform Trends:** The aggregator tokenizes the raw text of complaints filed by citizens on the platform over the last 7 days.
  3. **Spike Detection:** It uses TF-IDF word frequency analysis to compare current keyword frequencies against the previous week. Terms with >2x spike factor are flagged as trending.
  4. The results update the `trending_issues` table, which powers the Systemic Issue Radar.

### 4.3 Fake Closure Detection (Nightly)
- **Source:** GrievanceIQ citizen feedback system.
- **Execution:** Aggregated nightly by `aggregator.ts`.
- **How it works:** The system compares the *official* resolution rate published by DARPG against the *actual* citizen satisfaction rate reported by platform users. If a ministry reports a status of "Resolved" but the citizen reports "Not Satisfied", it is flagged. An aggregation query computes this gap and updates the `fake_closure_rate` in `ministry_stats`.

### 4.4 Historical Time-Series Integration (Monthly)
- **Source:** Official `data.gov.in` API.
- **Execution:** Triggered monthly alongside the DARPG PDF fetch.
- **How it works:** Supplements the PDF data by fetching historical complaint data across a 15-month timeline, storing it in the `monthly_history` table to accurately render the long-term national trend charts.

---

## 5. Summary

GrievanceIQ v8.0.0 represents a production-ready, fully automated grievance intelligence system. By shifting from static seed data to live automated pipelines pulling from DARPG PDFs, National RSS feeds, data.gov.in, and crowdsourced citizen feedback, the platform achieves a self-sustaining loop of real-time transparency and accountability. All integrations are entirely serverless, running on Cloudflare's Edge infrastructure with zero external hosting costs.
