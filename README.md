# GrievanceIQ

> **File Smarter. Get Heard. Hold Them Accountable.**

India's citizen-facing grievance intelligence platform. Built as a civic tech web application that helps citizens navigate CPGRAMS more effectively, and gives journalists/NGOs a public accountability dashboard.

## Live URLs

- **Production**: *(deployment pending)*
- **Sandbox Preview**: Active during development

## Project Overview

- **Name**: GrievanceIQ
- **Type**: Responsive Web Application
- **Target**: India — Citizens, Journalists, NGOs, Researchers
- **Stage**: College Mini Project (7-week build)

## Completed Features (Week 1)

### Citizen Complaint Intelligence Tool
| Feature | Status | Description |
|---------|--------|-------------|
| Multilingual Complaint Intake | Done | Single text box, 5 languages (EN, HI, TA, TE, BN), auto language detection |
| Smart Department Router | Done | AI identifies correct ministry from 92 options with confidence % |
| Complaint Quality Scorer | Done | Scores 1-10 with visual gauge, shows before/after improvement |
| AI Complaint Builder | Done | Side-by-side editor: original vs AI-improved, fully editable |
| Document Checklist Generator | Done | Context-aware list of documents to attach based on complaint type |
| Complaint Tracker | Done | Enter CPGRAMS ID, visual timeline, day 15/25 reminders |
| RTI Auto-Drafter | Done | One-click legally formatted RTI application, PDF download via jsPDF |
| Outcome Feedback | Done | 3-tap feedback (resolved/partial/fake closed) powering fake closure data |

### Public Accountability Dashboard
| Feature | Status | Description |
|---------|--------|-------------|
| India Grievance Map | Done | Interactive Leaflet.js map, all 36 states/UTs, 4 metrics toggle |
| Department Scorecard | Done | 30 ministries ranked, official vs citizen rate, fake closure flags |
| Systemic Issue Radar | Done | 8 trending issues with spike detection, severity, affected states |
| Social Signals Feed | Done | Twitter/News monitoring cards with trending direction |
| Dashboard Stats | Done | Aggregate overview: total complaints, pending, fake closure %, alerts |

### Pages Built
| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero + complaint intake + stats + trending preview + CTA |
| Complaint Builder | `/complaint` | Full AI analysis flow with department routing, scoring, rewriting |
| Tracker | `/tracker` | CPGRAMS tracking, timeline, feedback, RTI escalation |
| RTI Drafter | `/rti` | RTI form, live preview, PDF download, filing instructions |
| Dashboard | `/dashboard` | Map + scorecard + trending + social signals |
| How It Works | `/how-it-works` | Step-by-step guide for citizens and journalists |
| About | `/about` | Mission, competitive landscape, tech stack, disclaimer |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/stats` | Aggregate dashboard statistics |
| GET | `/api/ministries` | Department scorecards (sortable) |
| GET | `/api/ministries/:code` | Single ministry details |
| GET | `/api/states` | State-level grievance data (for map) |
| GET | `/api/states/:code` | Single state details |
| GET | `/api/trending` | Trending issues (?flagged=true for critical) |
| GET | `/api/social` | Social monitoring signals |
| POST | `/api/complaints/analyze` | Submit complaint for AI analysis |
| POST | `/api/complaints/track` | Track by CPGRAMS ID |
| POST | `/api/feedback` | Submit citizen outcome feedback |
| POST | `/api/rti/generate` | Generate RTI application |

## Database Schema (7 tables)

- **users** — Citizen profiles
- **complaints** — Core complaint records with AI analysis
- **complaint_feedback** — Citizen-reported outcomes (powers fake closure detection)
- **ministry_stats** — Monthly performance data per ministry (30 seeded)
- **trending_issues** — Weekly complaint clusters (8 seeded)
- **social_signals** — Twitter/news monitoring (8 seeded)
- **state_grievance_stats** — State-level data for India map (36 states/UTs seeded)

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend | Hono (TypeScript) | Edge-first web framework |
| Database | Cloudflare D1 (SQLite) | Structured data with SQL |
| Frontend | Tailwind CSS (CDN) | Utility-first responsive styling |
| Maps | Leaflet.js | Interactive India choropleth |
| Charts | Chart.js | Data visualization |
| Icons | Font Awesome 6 | UI icons |
| Fonts | Inter (Google Fonts) | Clean professional typography |
| PDF | jsPDF | Client-side RTI PDF generation |
| Deployment | Cloudflare Pages | Global edge deployment |
| Dev Server | Wrangler | Local development with D1 |

## Seed Data

- **30 ministries** with realistic CPGRAMS statistics (complaints, resolution rates, fake closure rates)
- **36 states & UTs** with grievance volumes, top issues, department rankings
- **8 trending issues** based on real Indian complaint patterns (PM-KISAN, IRCTC, EPFO, etc.)
- **8 social signals** from Twitter/News sources
- **3 sample complaints** with AI analysis results
- **2 feedback entries** demonstrating fake closure detection

## Features Not Yet Implemented

- [ ] Real AI API integration (Gemini/Claude) — currently using smart keyword-based mock
- [ ] District-level drill-down on India map
- [ ] GeoJSON state boundaries (currently using circle markers)
- [ ] User authentication / login system
- [ ] Email reminder system (Day 15/25 notifications)
- [ ] Weekly automated email reports for journalists
- [ ] PDF export for dashboard data
- [ ] Hindi/regional language UI (i18n)
- [ ] Real-time data pipelines (Twitter API, CPGRAMS scraping)
- [ ] BERTopic / TF-IDF clustering pipeline
- [ ] Rate limiting and input sanitization

## Recommended Next Steps (Week 2+)

1. **Week 2**: Integrate Gemini API for real AI analysis (department routing, scoring, rewriting)
2. **Week 3**: Add India GeoJSON boundaries for proper choropleth map
3. **Week 4**: Complaint tracker with real status polling, email reminders
4. **Week 5**: Dashboard enhancements — Chart.js charts, PDF export, district drill-down
5. **Week 6**: Data seeding from real CPGRAMS CSVs, performance optimization
6. **Week 7**: Final testing, deployment, documentation

## Development

```bash
# Install dependencies
npm install

# Apply database migrations
npm run db:migrate:local

# Seed database
npm run db:seed

# Build
npm run build

# Start dev server
npm run preview

# Reset database
npm run db:reset
```

## Project Structure

```
webapp/
├── src/
│   ├── index.tsx          # Main Hono app with all routes
│   ├── routes/
│   │   └── api.ts         # All API endpoints + mock AI functions
│   └── pages/
│       ├── layout.ts      # Shared HTML layout (nav, footer, styles)
│       ├── home.ts        # Homepage
│       ├── complaint.ts   # Smart Complaint Builder
│       ├── tracker.ts     # Complaint Tracker
│       ├── rti.ts         # RTI Auto-Drafter
│       ├── dashboard.ts   # Public Accountability Dashboard
│       ├── how-it-works.ts # How It Works guide
│       └── about.ts       # About page
├── migrations/
│   └── 0001_initial_schema.sql  # Full database schema (7 tables)
├── seed.sql               # Realistic CPGRAMS data
├── ecosystem.config.cjs   # PM2 configuration
├── wrangler.jsonc         # Cloudflare D1 configuration
├── vite.config.ts         # Vite build configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Disclaimer

GrievanceIQ is an educational and civic technology tool. All AI-generated outputs are comprehension and writing assistance tools only. They do not constitute legal advice. GrievanceIQ does not file complaints on behalf of users, does not access CPGRAMS accounts, and does not guarantee any specific outcome.

---

Built with care for India's citizens.
