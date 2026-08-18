# GrievanceIQ

**AI-Augmented Civic Intelligence and Grievance Redressal System for India's CPGRAMS Ecosystem**

[![Edge Runtime](https://img.shields.io/badge/Runtime-Cloudflare%20Workers-orange?logo=cloudflare)](https://workers.cloudflare.com/)
[![Framework](https://img.shields.io/badge/Framework-Hono%20v4%20(TypeScript)-blue)](https://hono.dev/)
[![Database](https://img.shields.io/badge/Database-Cloudflare%20D1%20(SQLite)-lightgrey?logo=sqlite)](https://developers.cloudflare.com/d1/)
[![Compute Engine](https://img.shields.io/badge/Pipeline-FastAPI%20%7C%20Python%203.11-teal?logo=fastapi)](https://fastapi.tiangolo.com/)
[![AI Engine](https://img.shields.io/badge/Inference-Groq%20LLaMA%203.1%2070B-darkgreen)](https://groq.com/)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## Overview

**GrievanceIQ** is an open-source civic intelligence platform designed to augment India's **Centralized Public Grievance Redress and Monitoring System (CPGRAMS)**. 

While millions of citizen complaints are lodged annually through DARPG (Department of Administrative Reforms and Public Grievances) portals, a substantial proportion face rejection, inter-departmental transfers, delays beyond statutory limits, or arbitrary administrative closures ("fake closures"). GrievanceIQ provides the citizen-facing tools and public analytics required to resolve these systemic bottlenecks:

1. **Precision Complaint Drafting**: Structured AI-guided intake that enforces jurisdictional routing across 92 central ministries and departments, identifies statutory backing, generates document checklists, and performs word-level draft enhancements.
2. **Statutory 45-Day Lifecycle Tracking**: Automated milestone tracking enforcing the Department of Administrative Reforms' 45-day disposal guidelines, equipped with Day 15/25 escalation alerts and automated Section 6(1) Right to Information (RTI) draft generation upon overdue status.
3. **Accountability & Fake Closure Detection**: Continuous reconciliation of government-reported disposal statistics against crowdsourced citizen satisfaction ratings to calculate an empirical *Fake Closure Index*.
4. **Autonomous Ingestion Pipeline**: Asynchronous background pipeline running on Cloudflare Cron Triggers and Python compute workers that ingests monthly DARPG PDF bulletins, national news RSS feeds, and Data.gov.in datasets.
5. **Civic Intelligence Dashboards**: Real-time geospatial choropleth maps across 36 States/UTs, 45 Lok Sabha constituency scorecards, 15-month time-series forecasting, and inter-ministerial transfer network graphs.

---

## System Architecture

The platform uses a split edge-and-compute architecture. The user-facing application runs on **Cloudflare Workers (Edge)** via **Hono SSR**, delivering sub-50ms TTFB globally, while asynchronous data parsing, document processing, and TF-IDF trend detection run inside a containerized **Python FastAPI** compute service.

```
                                  [ Citizen / Browser Client ]
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     │                                                     │
               HTTPS / HTML                                          Web Speech API
                     │                                            (7 Indic Languages)
                     ▼                                                     │
     ┌─────────────────────────────────────────────────────────┐           │
     │      Cloudflare Edge Infrastructure (Hono v4 / TS)      │◄──────────┘
     │  - Server-Side Rendered (SSR) JSX / UI Components       │
     │  - Session Auth (HMAC-SHA256 JWT + Email OTP)           │
     │  - Rate Limiting Middleware (120 req/min sliding-window)│
     │  - Security Headers (Strict CSP, HSTS, CORS)            │
     └──────────┬──────────────────────┬───────────────────────┘
                │                      │
       LLM API Calls            Edge SQL Queries
                │                      │
                ▼                      ▼
     ┌─────────────────────┐  ┌─────────────────────────────────┐
     │   Groq AI Engine    │  │     Cloudflare D1 (SQLite)      │
     │  LLaMA 3.1 70B /    │  │  - 15 Relational Tables         │
     │  Mixtral-8x7b       │  │  - Migrations 0001 - 0014       │
     │  (With Mock Fallback│  │  - User data, metrics, logs     │
     └─────────────────────┘  └────────────────┬────────────────┘
                                               │
                         Cron Trigger Webhooks │ Data Ingestion
                         (Daily / Monthly)     ▼
     ┌─────────────────────────────────────────────────────────────────┐
     │           Autonomous Python Compute Pipeline (FastAPI)          │
     │  - DARPG PDF Bulletin Parser (pdfplumber)                       │
     │  - Multi-Source RSS News Monitor (Tiered Keyword Filtering)     │
     │  - NLP & TF-IDF Spike Analysis (scikit-learn)                   │
     │  - Data.gov.in Historical Grievance Time-Series Ingestion       │
     └─────────────────────────────────────────────────────────────────┘
```

---

## Core Capabilities

### 1. Citizen Grievance Engine
* **7-Step Interactive Wizard**: Step-by-step complaint compilation capturing incident chronology, affected parties, financial loss, prior correspondence, and desired relief.
* **Intelligent Ministry Routing**: Rule-based and LLM-assisted matching against 92 Central Government ministries, statutory boards, and public sector undertakings.
* **Word-Level Improvement Diff**: Side-by-side Myers diff showing original vs. AI-enhanced legal phrasing, removing emotional ambiguity while preserving critical facts.
* **Document Checklist Synthesizer**: Generates a tailored list of required evidentiary records (e.g., UAN statements, PPO numbers, bank passbooks, eKYC receipts).
* **Multi-Indic Voice Input**: Integrated Web Speech API enabling real-time voice-to-text dictation across 7 regional languages.
* **Pre-Drafted Template Library**: 8 production-grade templates addressing high-frequency grievances (PM-KISAN installment delays, EPFO claims, delayed passport dispatch, pension disruptions, faulty utility billing, IRCTC refunds, and IT return processing).

### 2. Statutory Tracking & Accountability
* **45-Day Statutory Lifecycle Tracker**:
  * **Day 0–14**: Initial intake and nodal grievance officer acknowledgement verification.
  * **Day 15**: First statutory progress review; automated escalation prompt if unassigned.
  * **Day 25**: Secondary supervisory escalation flag.
  * **Day 45**: Formal statutory deadline breach alert.
* **Automated Section 6(1) RTI Drafter**: Instantly drafts a legally compliant Right to Information (RTI) application referencing the original CPGRAMS registration number, demanding officer enquiry records and file movement notes.
* **Fake Closure Auditing**: Cross-references DARPG disposal records against crowdsourced citizen verification (*"Was your grievance actually resolved?"*), flagging departments with systemic discrepancy rates.

### 3. Public Analytics & Civic Intelligence
* **India GeoJSON Choropleth Map**: 36 States/UTs visualization switchable across 4 core metrics (Grievance Volume, Resolution Rate, Avg Disposal Time, Fake Closure Rate) with 10-district drill-down tables.
* **Constituency Grievance Scorecards**: Aggregates grievance resolution performance across 45 Lok Sabha parliamentary constituencies, providing downloadable PDF scorecards.
* **Resolution Pipeline Funnel**: 7-stage complaint flow tracker (Received $\rightarrow$ Registered $\rightarrow$ Under Enquiry $\rightarrow$ Disposed $\rightarrow$ Confirmed Resolved vs. Fake Closed).
* **Inter-Departmental Transfer Network**: Force-directed canvas graph mapping grievance transfers between ministries to expose ping-pong deflection patterns.
* **15-Month Historical Trends & Radar**: Multi-metric comparative radar charts and 6-month state sparkline grids.

### 4. Security & Compliance
* **Passwordless OTP Authentication**: 6-digit cryptographic email OTP with 10-minute expiry and 5-attempt rate-limited lockout.
* **Stateless JWT Sessions**: HMAC-SHA256 tokens stored in HTTP-only, SameSite cookies.
* **Sliding Rate Limiter**: D1-backed sliding window limiter (120 req/min for general API, 10 req/5min for authentication).
* **Accessibility (WCAG 2.1 AA)**: Keyboard-navigable, screen-reader optimized landmarks, persistent dark mode toggle, and `prefers-reduced-motion` compliance.

---

## Data Pipeline & Ingestion Architecture

The autonomous pipeline located in `/python-pipeline` handles batch ingestion and continuous signal processing:

```
python-pipeline/
├── config.py                 # Central configuration, RSS feeds, ministry mappings
├── main.py                   # FastAPI service exposing secure internal webhook endpoints
├── requirements.txt          # Production dependencies
├── run_pipeline.py           # Standalone CLI runner with step timeouts
└── services/
    ├── darpg_fetcher.py      # Scrapes & parses monthly DARPG central/state grievance PDFs
    ├── rss_monitor.py        # Polls 5 national news feeds with tiered keyword filters
    ├── aggregator.py         # TF-IDF anomaly detection & fake-closure rate calculations
    ├── datagov_fetcher.py    # Pulls 15-month historical data from data.gov.in API
    ├── db_client.py          # Unified database interface (Supabase / D1 REST / Local SQLite)
    └── d1_client.py          # Cloudflare D1 direct client
```

### Cron Trigger Schedules

| Trigger | Schedule | Worker Endpoint | Function |
|---|---|---|---|
| **Keep-Alive Ping** | `*/14 * * * *` | `GET /health` | Prevents cold-starts on compute instance |
| **Monthly DARPG PDF** | `0 20 28 * *` | `POST /internal/fetch-darpg` | Downloads and parses DARPG monthly PDF bulletins |
| **Historical Data.gov** | `0 20 28 * *` | `POST /internal/fetch-datagov` | Synchronizes 15-month historical trend database |
| **Daily RSS Monitor** | `30 0 * * *` | `POST /internal/fetch-rss` | Ingests news signals across 5 national publications |
| **Nightly Aggregator**| `0 21 * * *` | `POST /internal/run-aggregator`| Computes TF-IDF spikes & updates ministry scores |

---

## Database Schema

The database runs on Cloudflare D1 (SQLite) with 15 normalized tables:

| Table Name | Primary Role |
|---|---|
| `users` | Citizen profiles, preferred UI language, notification settings |
| `complaints` | Drafted and submitted grievances, quality scores, AI outputs |
| `tracked_complaints` | 45-day statutory tracking records, milestones, CPGRAMS IDs |
| `tracker_updates` | Stage-by-stage lifecycle history and officer remarks |
| `complaint_feedback` | Citizen satisfaction ratings, resolution authenticity reports |
| `ministry_stats` | 30 central ministries: volume, disposal velocity, fake closure % |
| `state_grievance_stats` | 36 States/UTs: regional grievance performance and rankings |
| `district_stats` | District-level grievance breakdown and drill-down metrics |
| `trending_issues` | TF-IDF identified systemic grievance spikes and clusters |
| `social_signals` | Parsed RSS articles and external media grievance indicators |
| `monthly_history` | 15-month historical national time-series data |
| `notifications` | In-app user alerts, milestone reminders, system updates |
| `pipeline_runs` | Diagnostic audit logs of background cron executions |
| `audit_log` | Security audit trail for auth, role changes, and admin actions |
| `rate_limits` | Sliding-window IP and user rate limiting counters |

---

## API Reference

The Cloudflare Worker exposes 46+ RESTful endpoints structured across functional domains:

### Core Citizen Endpoints
* `POST /api/complaints/analyze` — Analyzes raw input, performs ministry classification, generates improved text, and builds document checklists.
* `POST /api/complaints/track` — Queries complaint status by CPGRAMS registration number.
* `POST /api/tracker/log` — Enrolls a grievance into the 45-day statutory monitoring lifecycle.
* `POST /api/tracker/feedback` — Submits citizen outcome verification (Resolved vs. Fake Closed).
* `POST /api/rti/generate` — Compiles a formal Section 6(1) RTI application based on grievance parameters.
* `GET  /api/complaints/search` — Filtered and paginated search across user grievances.
* `GET  /api/complaints/:id/detail` — Detailed complaint dossier including word diffs and timeline.

### Analytics & Intelligence
* `GET  /api/stats` — High-level platform metrics (total complaints, resolution %, impact score).
* `GET  /api/ministries` — Sorted ministry scorecards with fake closure flags.
* `GET  /api/ministries/:code` — Ministry dossier with 6-month historical trajectory.
* `GET  /api/states` — State-level grievance distribution.
* `GET  /api/states/:code/districts` — District drill-down table for selected state.
* `GET  /api/reports/constituency/:name` — Lok Sabha constituency performance dossier.
* `GET  /api/analytics/timeseries` — 15-month national grievance volume and satisfaction dataset.
* `GET  /api/analytics/funnel` — 7-stage resolution drop-off pipeline metrics.
* `GET  /api/analytics/heatmap` — 12-month daily activity contribution matrix.
* `GET  /api/analytics/network` — Inter-departmental complaint transfer graph.
* `GET  /api/trending` — Active systemic issue clusters identified by TF-IDF.
* `GET  /api/social` — Ingested news signals with department and severity tags.

### Authentication & Profile
* `POST /api/auth/request-otp` — Dispatches 6-digit verification code to user email.
* `POST /api/auth/verify-otp` — Validates OTP and returns HMAC-SHA256 JWT session cookie.
* `GET  /api/auth/me` — Retrieves authenticated citizen profile and active preferences.
* `PUT  /api/auth/profile` — Updates user name, district, state, or language preference.
* `POST /api/auth/logout` — Revokes active JWT session token.

### Notifications & Administration
* `GET  /api/notifications` — Fetches user alerts with unread counter.
* `POST /api/notifications/read` — Marks notification items as acknowledged.
* `GET  /api/admin/system-health` — Real-time diagnostic report covering D1, Groq, and pipeline status.
* `GET  /api/admin/audit-logs` — Queryable administrative security logs.

---

## Regional Language Support

The platform is fully localized across 7 Indian languages:

| Language | Code | Script | Coverage |
|---|---|---|---|
| **English** | `en` | Latin | 100% (Default) |
| **Hindi (हिन्दी)** | `hi` | Devanagari | 100% |
| **Tamil (தமிழ்)** | `ta` | Tamil | Core UI & Wizard |
| **Telugu (తెలుగు)** | `te` | Telugu | Core UI & Wizard |
| **Bengali (বাংলা)** | `bn` | Bengali | Core UI & Wizard |
| **Marathi (मराठी)** | `mr` | Devanagari | Core UI & Wizard |
| **Kannada (ಕನ್ನಡ)** | `kn` | Kannada | Core UI & Wizard |

---

## Local Development Setup

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **Python**: `v3.10` or higher
* **Cloudflare Wrangler CLI**: `npm install -g wrangler`

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/DarshanKumarM8/GrievanceIQ.git
cd GrievanceIQ
```

### 2. Web Application Setup (Cloudflare Worker)
```bash
# Install Node dependencies
npm install

# Configure local development environment variables
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your credentials:
```ini
GROQ_API_KEY=gsk_your_groq_api_key_here
INTERNAL_API_KEY=dev-internal-secret-key
ADMIN_SECRET_KEY=dev-admin-secret-key
DATAGOV_API_KEY=your_datagov_api_key_optional
PIPELINE_SERVICE_URL=http://localhost:8000
```

Initialize local D1 SQLite database:
```bash
# Apply migrations to local D1 instance
npm run db:migrate:local

# Seed initial ministries, states, templates, and baseline statistics
npm run db:seed
```

Start the web application in local development mode:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### 3. Python Compute Pipeline Setup (Optional for Ingestion)
```bash
cd python-pipeline

# Create and activate virtual environment
python -m venv venv
# Linux/macOS:
source venv/bin/activate
# Windows:
.\venv\Scripts\activate

# Install pipeline dependencies
pip install -r requirements.txt

# Configure pipeline environment
cp .env.example .env
```

Start the FastAPI pipeline server:
```bash
uvicorn main:app --reload --port 8000
```

To run a single full pipeline execution manually:
```bash
python run_pipeline.py
```

---

## Deployment Topology

### 1. Edge Web Application (Cloudflare Pages)
The web application builds via Vite and deploys to Cloudflare Pages with Native D1 bindings:
```bash
# Build production bundle
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

### 2. Compute Pipeline (Render / Any Container Host)
The FastAPI ingestion pipeline runs as a web service on Render or any Docker host:
* **Build Command**: `pip install -r requirements.txt`
* **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
* **Required Environment Variables**: `INTERNAL_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `DATAGOV_API_KEY`.

---

## Project Structure

```
GrievanceIQ/
├── .dev.vars                 # Local environment secrets for Wrangler
├── migrations/               # 14 SQL migration scripts for Cloudflare D1
│   ├── 0001_initial_schema.sql
│   ├── 0008_tracker_tables.sql
│   └── 0014_district_stats.sql
├── package.json              # Node dependencies & npm scripts
├── python-pipeline/          # Asynchronous data ingestion compute engine
│   ├── config.py
│   ├── main.py
│   ├── requirements.txt
│   ├── run_pipeline.py
│   └── services/
│       ├── aggregator.py
│       ├── darpg_fetcher.py
│       ├── datagov_fetcher.py
│       └── rss_monitor.py
├── scripts/
│   ├── init-live-db.js       # Production database initialization
│   └── sql/seed.sql          # Seed dataset (ministries, states, seed metrics)
├── src/
│   ├── data/                 # Static templates & Lok Sabha constituency datasets
│   │   ├── constituencies.ts
│   │   └── templates.ts
│   ├── i18n/                 # Multi-language translation dictionaries
│   │   ├── en.json
│   │   └── hi.json
│   ├── index.tsx             # Hono app entry point, routing & cron scheduled handler
│   ├── middleware/           # Security headers, auth, and rate limiting
│   │   └── security.ts
│   ├── pages/                # Server-rendered JSX UI pages
│   │   ├── admin.ts
│   │   ├── complaint.ts
│   │   ├── dashboard.ts
│   │   ├── home.ts
│   │   ├── rti.ts
│   │   └── tracker.ts
│   ├── routes/               # REST API & authentication endpoints
│   │   ├── api.ts
│   │   └── auth.ts
│   └── services/             # Groq LLM client and auth cryptographic utilities
│       ├── auth.ts
│       └── groq.ts
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite bundler configuration
└── wrangler.jsonc            # Cloudflare Pages & D1 database bindings configuration
```

---

## License

This project is distributed under the **MIT License**. See the [LICENSE](LICENSE) file for full details.

---

## Acknowledgements & Data Sources

* **CPGRAMS / DARPG**: Government of India Department of Administrative Reforms & Public Grievances for monthly redressal reports.
* **Open Government Data (OGD) Platform India**: `data.gov.in` for public grievance time-series archives.
* **Right to Information Act, 2005**: Framework enabling structured citizen escalation mechanisms.
* **Cloudflare Workers & D1**: Serverless edge compute and relational storage infrastructure.
