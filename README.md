# GrievanceIQ

> The government built a complaint inbox. GrievanceIQ builds the intelligence layer between citizens and that inbox — so filing a complaint actually means something.

## Project Overview
- **Name**: GrievanceIQ
- **Goal**: AI-powered citizen grievance intelligence platform for India's CPGRAMS system
- **Target Users**: Indian citizens filing complaints + journalists/researchers using public dashboard
- **Tech Stack**: Hono (TypeScript) + Tailwind CSS + Cloudflare D1 + Google Gemini API
- **Status**: Week 2 complete — AI Intelligence Core active

## URLs
- **Live Preview**: https://3000-ijj8l21qjw9nnoh5yjcir-2b54fc91.sandbox.novita.ai
- **GitHub**: https://github.com/DarshanKumarM8/GrievanceIQ

## Features (Implemented)

### Citizen Complaint Intelligence Tool
- **Smart Department Router** — AI identifies correct ministry from 92 CPGRAMS options
- **Quality Scorer** — Rates complaint 1-10 with specific improvement suggestions
- **AI Complaint Builder** — Side-by-side editor showing original vs improved draft
- **Document Checklist** — Department-specific documents needed for filing
- **Multilingual Intake** — Hindi, Tamil, Telugu, Bengali, English support
- **Complaint Tracker** — Enter CPGRAMS ID, get timeline with Day 15/25 reminders
- **RTI Auto-Drafter** — One-click legally formatted RTI application with PDF download
- **Outcome Feedback** — Report if complaint was truly resolved or fake-closed

### Public Accountability Dashboard
- **India Grievance Map** — Interactive map with 36 states, switchable metrics
- **Department Scorecard** — 30 ministries ranked by resolution rate, fake closure rate
- **Systemic Issue Radar** — 8 trending complaint patterns with spike detection
- **Social Monitoring Feed** — Simulated Twitter/news signal tracking

### AI Architecture
- **Primary**: Google Gemini 2.0 Flash API (structured JSON output)
- **Fallback**: Gemini 2.0 Flash Lite → Mock Keyword Classifier v2 (17 categories)
- **Transparency**: Every response shows whether Gemini or Mock was used

## Pages (7)
| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero with complaint input, stats, trending preview |
| Complaint Builder | `/complaint` | AI analysis with department routing + rewriting |
| Tracker | `/tracker` | CPGRAMS ID tracking with timeline |
| RTI Drafter | `/rti` | Auto-generate RTI application |
| Dashboard | `/dashboard` | India map, scorecard, trending, social |
| How It Works | `/how-it-works` | 4-step process explanation |
| About | `/about` | Mission, team, scope |

## API Endpoints (14)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | System health with AI status |
| GET | `/api/stats` | Dashboard aggregate statistics |
| GET | `/api/ministries` | Department scorecards (sortable) |
| GET | `/api/ministries/:code` | Single ministry detail |
| GET | `/api/states` | All 36 state grievance stats |
| GET | `/api/states/:code` | Single state detail |
| GET | `/api/trending` | Systemic issues (flagged filter) |
| GET | `/api/social` | Social monitoring signals |
| POST | `/api/complaints/analyze` | **AI-powered** complaint analysis |
| POST | `/api/complaints/track` | Track CPGRAMS complaint |
| GET | `/api/complaints/recent` | List recent complaints |
| GET | `/api/complaints/:id` | Get complaint by ID |
| POST | `/api/feedback` | Submit outcome feedback |
| POST | `/api/rti/generate` | **AI-powered** RTI generation |

## Database Schema (7 tables)
- `users` — Citizen profiles (consent-based)
- `complaints` — Analyzed complaints with AI routing and scoring
- `complaint_feedback` — Citizen outcome reports (fake closure detection)
- `ministry_stats` — 30 ministries with resolution/fake closure metrics
- `state_grievance_stats` — 36 states with complaint volumes
- `trending_issues` — Systemic complaint patterns
- `social_signals` — Twitter/news monitoring data

## Development

```bash
# Install dependencies
npm install

# Set up local database
npm run db:migrate:local && npm run db:seed

# Start development server
npm run build && npm run preview

# Or with PM2
pm2 start ecosystem.config.cjs
```

## Environment Variables
```
GEMINI_API_KEY=your_gemini_api_key  # In .dev.vars (local) or wrangler secret (production)
```

## Weekly Progress
- **Week 1**: Foundation — 7 pages, 12 APIs, 7 DB tables, 36 states, 30 ministries
- **Week 2**: AI Intelligence Core — Gemini integration, 17-category mock, AI transparency
- **Week 3**: (Planned) Complaint Builder wizard, tracking system, Hindi UI
- **Week 4**: (Planned) Enhanced dashboard, GeoJSON choropleth map
- **Week 5**: (Planned) Data pipeline, real CPGRAMS statistics
- **Week 6**: (Planned) Performance, accessibility, mobile optimization
- **Week 7**: (Planned) Final testing, deployment, documentation

## License
Open source civic technology project.

---
*Last Updated: March 13, 2026 — Week 2*
