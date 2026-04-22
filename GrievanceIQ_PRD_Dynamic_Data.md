# GrievanceIQ — Product Requirements Document
## Dynamic Data Integration: From Static Seed to Live Intelligence
**Version:** 8.0.0 — Dynamic Data Layer  
**Date:** April 2026  
**Status:** Ready for Development  
**Scope:** Week 8 — Making everything real, live, and useful post-deployment

---

## 1. CONTEXT — WHERE WE ARE RIGHT NOW

The platform is fully built. 65 features, 41 API endpoints, 12 pages, 13 database tables — all working. The problem is everything the user sees on the dashboard is fake. Specifically:

- 30 ministry stats are hardcoded numbers in `seed.sql`
- 36 state/UT stats are hardcoded numbers in `seed.sql`
- 8 trending issues are manually written in `seed.sql`
- 10+ social signals are copy-pasted strings in `seed.sql`
- 3 demo complaints are fake users in `seed.sql`

This means the "India Grievance Intelligence Map" shows the same numbers forever. The "Trending Issues Radar" never changes. The "Department Scorecard" never updates. A journalist who opens this dashboard in November will see the same data as someone who opened it in March.

The goal of this PRD is to replace every single hardcoded data point with a real, automated, free, and sustainable data source — while keeping the existing UI and API structure completely intact.

---

## 2. DESIGN PRINCIPLE FOR THIS PRD

**Do not change the UI. Do not change the API contracts. Do not change the database schema.**

Every endpoint already exists. Every table already exists. The only thing changing is what populates those tables and how often. The frontend sees the same JSON it always saw. The database has the same columns it always had. We are only replacing the source of the data — from `seed.sql` (manual, static, fake) to automated pipeline scripts (scheduled, real, live).

This is important because it means zero risk of breaking existing features.

---

## 3. WHAT "DYNAMIC" MEANS FOR EACH DATA TYPE

### 3.1 Ministry Stats (`ministry_stats` table)

**Current state:** 30 rows hardcoded in seed.sql with made-up numbers.

**Target state:** Real data from DARPG's monthly PDF reports, updated automatically every month.

**Source:** DARPG publishes two sets of monthly reports:
- Central Ministries: `https://darpg.gov.in/node/6003/`
- States/UTs: `https://darpg.gov.in/node/6004/`

Each report is a PDF containing tables with ministry-wise complaints received, disposed, pending, average resolution time, and GRAI scores. These are published on the 1st week of every month for the previous month.

**What gets updated:** Every column in `ministry_stats` — complaints_received, complaints_disposed, complaints_pending, avg_resolution_days, official_resolution_rate, citizen_satisfaction_rate (from feedback call centre data in the same PDF), GRAI rank.

**Fake closure rate:** This stays as a computed column. Formula: when official_resolution_rate is high but citizen_satisfaction_rate is low, the gap is flagged. This logic already exists in the codebase — it just needs real numbers feeding it.

---

### 3.2 State Grievance Stats (`state_grievance_stats` table)

**Current state:** 36 rows hardcoded in seed.sql.

**Target state:** Real state-wise data from the same DARPG State/UT monthly reports.

**Source:** Same DARPG PDFs — the State/UT report contains state-by-state breakdown of complaints received, disposed, pending, and average closing time.

**What gets updated:** total_complaints, resolved, pending, fake_closed (computed), resolution_rate, avg_resolution_days.

**Top topics and top ministries (JSON columns):** These stay as intelligent guesses derived from the category-wise breakdown tables in the same PDF. Example: if the state report shows UP has high complaints under "PM-KISAN" and "Labour & Employment" that month, those become the top topics for UP.

---

### 3.3 Trending Issues (`trending_issues` table)

**Current state:** 8 rows manually written describing issues that may or may not be current.

**Target state:** Automatically detected from complaint text submitted by real users of the platform + keyword frequency from news RSS feeds.

**Source 1 — Platform users:** As real citizens use the complaint builder, their complaint text (with consent, stripped of PII) feeds a TF-IDF keyword frequency counter. Words and phrases that appear significantly more this week compared to last week get flagged as trending. This runs as a nightly job.

**Source 2 — News RSS feeds:** Five RSS feeds monitored daily using Node's built-in fetch:
- PIB: `https://pib.gov.in/RssMain.aspx`
- The Hindu National: `https://www.thehindu.com/news/national/feeder/default.rss`
- Indian Express: `https://indianexpress.com/feed/`
- Hindustan Times: `https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml`
- NDTV India: `https://feeds.feedburner.com/ndtvnews-india-news`

When articles mentioning "CPGRAMS", "complaint", "grievance", "PM-KISAN", "pension delay", "EPFO", or similar keywords appear, they're parsed for the specific scheme or ministry mentioned and fed into the trending cluster.

**Spike detection:** Simple rolling average. If keyword X appeared 50 times last week and 300 times this week — spike factor is 6x. Anything above 2x gets flagged.

**Update frequency:** Nightly at 2 AM IST.

---

### 3.4 Social Signals (`social_signals` table)

**Current state:** Hardcoded strings like "Twitter: #PMKISAN trending with 2,800 posts".

**Target state:** Real data from news RSS feeds (Twitter API is paid — we do not use it).

**Honest replacement:** RSS feeds from PIB, The Hindu, Indian Express give us real news signals. Each article that matches a grievance keyword gets stored as a social signal with the headline, source, and timestamp. The frontend already renders these as a feed — the format doesn't change, the source does.

**What a signal entry looks like after this change:**
```
Platform: "news"
Content: "PIB: DARPG records 1.5 lakh grievances in March 2026"
Source: "Press Information Bureau"
URL: "https://pib.gov.in/..."
Captured at: "2026-03-28T09:00:00Z"
Post count 24h: null (not applicable for news)
Post count 7d: null
```

**Update frequency:** Daily at 6 AM IST.

---

### 3.5 Platform User Complaints (The Real Dynamic Layer)

**Current state:** 3 fake demo users with fabricated complaints in seed.sql.

**Target state:** Real complaints filed by real users through the platform.

This one requires zero additional work — it already works. When a real citizen uses the complaint builder and submits a complaint, it goes into the `complaints` table. The `similar complaints` feature already queries this table. The analytics already query this table.

The only change needed: **remove the 3 fake demo users from the seed** so they don't pollute real analytics. Replace with a single clearly-labelled demo complaint that shows the UI correctly but is excluded from analytics queries via a `is_demo = true` flag.

---

### 3.6 Citizen Feedback → Fake Closure Detection

**Current state:** Hardcoded fake_closure_rate numbers in seed.sql.

**Target state:** Computed from real user feedback.

The `complaint_feedback` table already exists with `citizen_actual_resolution` and `official_status` columns. The logic is: when `official_status = 'resolved'` but `citizen_actual_resolution = 'no'` — that's a fake closure.

A nightly aggregation job computes this per ministry and updates `ministry_stats.fake_closure_rate`. This is already how it was designed. It just needs the aggregation job to run.

---

## 4. IMPLEMENTATION PLAN

### 4.1 What Gets Built

Three things only:

1. **A PDF Parser Script** (`scripts/fetch-darpg.ts`) — Downloads the latest DARPG monthly PDF, extracts the tables, updates D1 database.

2. **An RSS Monitor Script** (`scripts/fetch-rss.ts`) — Fetches 5 RSS feeds, filters for grievance-related articles, inserts into `social_signals` and contributes to `trending_issues`.

3. **A Nightly Aggregation Script** (`scripts/aggregate.ts`) — Computes trending issues from complaint text, updates fake closure rates, computes spike factors.

All three run as **Cloudflare Cron Triggers** — free, serverless, no external server needed. D1 is already there.

---

### 4.2 Cloudflare Cron Triggers (Free, No Extra Infrastructure)

Cloudflare Workers already supports scheduled triggers via `wrangler.jsonc`. No extra cost. No external cron server. Just add:

```jsonc
// wrangler.jsonc — add this section
"triggers": {
  "crons": [
    "0 2 1 * *",    // 2 AM on 1st of every month — DARPG PDF fetch
    "0 0 * * *",    // Midnight daily — RSS news monitor
    "30 2 * * *"    // 2:30 AM daily — Aggregation + trending
  ]
}
```

The Worker's `scheduled` event handler catches these and runs the appropriate script.

**Cost:** Zero. Cloudflare Workers free tier includes 3 Cron Triggers.

---

### 4.3 Script 1 — DARPG PDF Fetcher

**File:** `src/workers/darpg-fetcher.ts`

**What it does:**
1. Fetches DARPG monthly report index page for Central Ministries
2. Finds the latest PDF link (consistent URL pattern: `darpg.gov.in/sites/default/files/DARPG_Monthly_Report_Central_{MONTH}_{YEAR}.pdf`)
3. Downloads the PDF as ArrayBuffer
4. Parses tables using a pure-JS PDF text extraction approach (no native dependencies — use `pdf-parse` npm package which works in Workers with the `nodejs_compat` flag)
5. Maps extracted table rows to ministry names using a lookup table (the 30 ministry names in your DB match DARPG's naming convention)
6. Runs `UPDATE ministry_stats SET ... WHERE ministry_name = ?` for each matched row
7. Logs the sync in `audit_log`

**Error handling:**
- If PDF not yet published (checked on 1st, published on ~7th), retry logic waits 7 days
- If a ministry name doesn't match, log it and skip — don't fail the whole job
- Keep previous month's data if fetch fails

**Extracted fields per ministry:**
- Complaints received (current month)
- Complaints disposed
- Complaints pending
- Average disposal time (days)
- GRAI score and rank

**Fields computed from extracted data:**
- `official_resolution_rate` = disposed / received × 100
- `flagged` = true if GRAI rank is in bottom 20%

**Fields NOT from DARPG PDF (computed separately):**
- `citizen_satisfaction_rate` — from platform user feedback (Aggregation script)
- `fake_closure_rate` — computed from feedback gap

**Packages needed:**
```json
"pdf-parse": "^1.1.1"
```

**Workers compatibility:** Enable `nodejs_compat` flag in wrangler.jsonc — this is free and already supported.

---

### 4.4 Script 2 — RSS News Monitor

**File:** `src/workers/rss-monitor.ts`

**What it does:**
1. Fetches 5 RSS feeds using `fetch()` (native in Workers)
2. Parses XML using `fast-xml-parser` (lightweight, no native deps)
3. For each article published in last 24 hours, checks for grievance keywords
4. If match found: inserts into `social_signals` with headline, source, URL, date
5. Extracts mentioned schemes/ministries from article title and description
6. Passes extracted entities to trending issue detection (increments keyword frequency counter in a temporary D1 table)

**Keyword matching list (exact strings to check):**
```
CPGRAMS, grievance, complaint portal, PM-KISAN, EPFO, pension delay,
ration card, Ayushman Bharat, passport delay, railway refund, 
smart meter, DARPG, e-Shram, labour complaint, RTI
```

**RSS feeds:**
```
PIB: https://pib.gov.in/RssMain.aspx
The Hindu: https://www.thehindu.com/news/national/feeder/default.rss  
Indian Express: https://indianexpress.com/feed/
Hindustan Times: https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml
NDTV: https://feeds.feedburner.com/ndtvnews-india-news
```

**Packages needed:**
```json
"fast-xml-parser": "^4.3.6"
```

**D1 table changes needed — none.** `social_signals` already has platform, content, keyword_matched, captured_at columns. Just populate them with real data instead of seed data.

**Deduplication:** Before insert, check if `source_url` already exists in `social_signals` for today. Skip if duplicate.

---

### 4.5 Script 3 — Nightly Aggregation

**File:** `src/workers/aggregator.ts`

**What it does — Part A: Trending Issues from Platform Complaints**

1. Query `complaints` table for all complaints filed in last 7 days (excluding demo complaints)
2. For each complaint, tokenize `raw_text` and `translated_text` fields
3. Remove stop words (the, is, and, etc.) using a simple hardcoded list
4. Count frequency of remaining significant words and bigrams
5. Compare against frequency from 8–14 days ago (previous week baseline)
6. Any term with frequency increase > 2x AND appearing in at least 10 complaints = trending

**What it does — Part B: Trending Issues from RSS Signals**

1. Query `social_signals` inserted in last 7 days
2. Count mentions of each known scheme/ministry
3. Compare against previous 7 days
4. Merge with Part A results

**What it does — Part C: Update `trending_issues` table**

For each detected trending topic:
- `UPDATE` existing row if topic_keywords overlap with existing cluster
- `INSERT` new row if genuinely new topic
- Set `spike_factor`, `complaint_count`, `week_start`, `is_flagged` (if spike > 2x)
- Set `states_affected` by querying which states the trending complaints came from
- Set `ministries_affected` from the department_predicted field

**What it does — Part D: Fake Closure Aggregation**

```sql
-- Run this query and update ministry_stats
SELECT 
  department_predicted as ministry,
  COUNT(*) as total_with_feedback,
  SUM(CASE WHEN official_status = 'resolved' 
           AND citizen_actual_resolution = 'no' 
           THEN 1 ELSE 0 END) as fake_closures,
  AVG(satisfaction_score) as avg_satisfaction
FROM complaints c
JOIN complaint_feedback f ON c.id = f.complaint_id
WHERE f.feedback_given_at > datetime('now', '-30 days')
GROUP BY department_predicted
```

Update `ministry_stats.fake_closure_rate` and `citizen_satisfaction_rate` for each ministry that has feedback data.

**What it does — Part E: State Stats from Platform Complaints**

```sql
-- Count complaints by state (from user location if provided, or inferred from complaint text)
SELECT 
  state_name,
  COUNT(*) as total_complaints,
  SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
  SUM(CASE WHEN is_fake_closure = 1 THEN 1 ELSE 0 END) as fake_closed
FROM complaints
WHERE created_at > datetime('now', '-30 days')
GROUP BY state_name
```

Update `state_grievance_stats` for states where we have real user data. For states with no user data yet, keep the DARPG PDF data.

---

### 4.6 Adding State Collection to Complaint Form

Currently the complaint form doesn't ask for the user's state. This needs to be added as an optional field — not mandatory, because it's additional friction — but collected when provided.

**Change required in complaint form (Step 1 — basic info):**
Add a dropdown: "Which state are you filing from? (Optional)"
- All 36 states/UTs as options
- Stored in `complaints.state_name` column

**Migration needed:**
```sql
-- Migration 5
ALTER TABLE complaints ADD COLUMN state_name TEXT;
```

This is additive — no existing data breaks.

---

### 4.7 data.gov.in Official API Integration (Monthly Supplement)

DARPG PDFs give detailed ministry data. data.gov.in gives aggregate historical data going back further. Use both — PDFs for current month, API for historical trend lines.

**Endpoint:** `https://api.data.gov.in/resource/{resource_id}?api-key={key}&format=json&limit=100`

**API key:** Free from data.gov.in — register with email, get key instantly. Store in Cloudflare Workers environment variable — never in code.

**Resource IDs for CPGRAMS datasets** (these are stable, publicly documented):
- Ministry-wise grievances: search "CPGRAMS" on data.gov.in to find current resource IDs

**What this supplements:**
- Historical data for the 15-month time-series chart (`analytics/timeseries` endpoint)
- Currently this shows fabricated data for months before the app existed
- After this: real historical numbers from data.gov.in going back 15 months

**Update frequency:** Monthly, runs same day as DARPG PDF fetch (1st of month).

**Environment variable setup in wrangler.jsonc:**
```jsonc
"vars": {
  "DATAGOV_API_KEY": "your-free-api-key-here",
  "GEMINI_API_KEY": "existing-key"
}
```

---

## 5. DATABASE CHANGES

Only two changes to schema. Everything else stays identical.

### Migration 5 — Add state_name to complaints
```sql
ALTER TABLE complaints ADD COLUMN state_name TEXT;
ALTER TABLE complaints ADD COLUMN is_demo INTEGER DEFAULT 0;
```

### Migration 6 — Add data_source tracking to ministry_stats and state_grievance_stats
```sql
ALTER TABLE ministry_stats ADD COLUMN last_synced_at TEXT;
ALTER TABLE ministry_stats ADD COLUMN data_source TEXT DEFAULT 'seed';
-- data_source values: 'seed', 'darpg_pdf', 'datagov_api', 'platform_computed'

ALTER TABLE state_grievance_stats ADD COLUMN last_synced_at TEXT;
ALTER TABLE state_grievance_stats ADD COLUMN data_source TEXT DEFAULT 'seed';
```

This lets the admin dashboard show "Data last updated: March 2026 from DARPG PDF" instead of nothing.

### No other schema changes.

---

## 6. CHANGES TO EXISTING API ENDPOINTS

No breaking changes. Only additions.

### `/api/stats` — Add data freshness metadata
```json
// Add to response:
{
  "data_freshness": {
    "ministry_stats": "2026-03-07T00:00:00Z",
    "state_stats": "2026-03-07T00:00:00Z", 
    "trending_issues": "2026-04-18T02:30:00Z",
    "social_signals": "2026-04-19T06:00:00Z"
  }
}
```

The frontend can use this to show a "Last updated: 2 days ago" badge on the dashboard — which signals to judges and users that the data is live.

### `/api/ministries` — No change to response format
Internal query changes from reading seed data to reading real data — same JSON shape.

### `/api/analytics/timeseries` — Replace fabricated historical data
Currently returns hardcoded arrays for 15 months. After this change: queries real historical data from data.gov.in stored in a new `monthly_history` table.

**New table for this:**
```sql
CREATE TABLE monthly_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL,           -- "2025-01"
  year INTEGER NOT NULL,
  total_received INTEGER,
  total_disposed INTEGER,
  total_pending INTEGER,
  avg_resolution_days REAL,
  data_source TEXT DEFAULT 'datagov_api',
  created_at TEXT DEFAULT (datetime('now'))
);
```

---

## 7. ADMIN DASHBOARD ADDITIONS

The `/admin` page already exists. Add a new "Data Pipeline" section showing:

**Pipeline Status Panel:**
```
DARPG PDF Fetch    Last run: 2026-03-01  Status: ✅ Success  Next: 2026-04-01
RSS Monitor        Last run: 2026-04-18  Status: ✅ Success  Next: 2026-04-19
Aggregator         Last run: 2026-04-18  Status: ✅ Success  Next: 2026-04-19
data.gov.in API    Last run: 2026-03-01  Status: ✅ Success  Next: 2026-04-01
```

**Manual Trigger Buttons:**
```
[Run DARPG Fetch Now]  [Run RSS Monitor Now]  [Run Aggregator Now]
```

These call a new endpoint:
```
POST /api/admin/pipeline/trigger
Body: { "job": "darpg" | "rss" | "aggregator" | "datagov" }
```

This lets you manually trigger a data refresh during your college demo without waiting for the cron schedule — critical for the review presentation.

**Store pipeline run logs in audit_log:**
```sql
-- audit_log already exists — just add pipeline events
INSERT INTO audit_log (event_type, details, created_at)
VALUES ('pipeline_run', '{"job":"darpg","status":"success","rows_updated":30}', datetime('now'));
```

---

## 8. HANDLING THE TRANSITION PERIOD

This is a practical problem: when you first deploy with real data pipelines, there are no real user complaints yet. The platform is new. Nobody has filed anything.

**Solution: Graceful Fallback Logic**

In every API that queries platform user data, add:

```typescript
// In api.ts for trending issues
const platformTrends = await getUserComplaintTrends(db); // real user data

if (platformTrends.length < 3) {
  // Not enough real data yet — supplement with RSS-detected trends
  const rssTrends = await getRssDetectedTrends(db);
  return mergeTrends(platformTrends, rssTrends);
}

return platformTrends;
```

For ministry stats — DARPG PDF data is available from day one regardless of user count. For fake closure rates — default to null until at least 20 feedbacks exist for that ministry.

The dashboard will show a banner when using supplementary data:
```
"Ministry rankings based on official DARPG data. 
 Citizen satisfaction scores will appear as users report outcomes."
```

This is honest, transparent, and judges will respect it more than fabricated numbers.

---

## 9. REMOVING THE SEED DATA

Once the pipelines are working, the following seed.sql sections become unnecessary and should be removed or replaced:

**Remove from seed.sql:**
- All 30 ministry rows (replaced by DARPG PDF fetch)
- All 36 state rows (replaced by DARPG State PDF fetch)
- All 8 trending issue rows (replaced by aggregator)
- All 10+ social signal rows (replaced by RSS monitor)
- The 3 fake user complaints (replaced by real user data)

**Keep in seed.sql:**
- The 30 ministry name/code mappings (needed as lookup table for PDF parsing)
- A single clearly-labelled demo complaint with `is_demo = 1`
- Initial empty rows for all 30 ministries (with null stats) so the dashboard doesn't show empty on first deploy

**In other words:** seed.sql goes from "here is all the fake data" to "here is the structure so the pipeline has something to update into."

---

## 10. WEEK 8 DELIVERY CHECKLIST

Everything below is required for the review presentation.

### Must Have (Core Dynamic Data)
- [ ] DARPG PDF fetcher script working and tested locally
- [ ] RSS monitor script fetching real articles
- [ ] Nightly aggregator computing trending issues from real complaints
- [ ] Cloudflare Cron Triggers configured in wrangler.jsonc
- [ ] Manual trigger endpoint for admin demo
- [ ] data.gov.in API key obtained and configured
- [ ] Historical time-series data populated from data.gov.in
- [ ] Migration 5 and 6 applied
- [ ] `is_demo` flag added to seed complaint
- [ ] `data_source` and `last_synced_at` showing in API responses
- [ ] Admin pipeline status panel showing last run times
- [ ] Dashboard "Last updated" badge working

### Nice to Have (If Time Permits)
- [ ] State collection dropdown in complaint form
- [ ] State-level stats computed from real platform user data
- [ ] Email notification when pipeline fails
- [ ] Automatic retry logic for DARPG PDF (if not yet published on 1st)

### Do Not Build (Out of Scope for Review)
- Twitter/X API integration (paid, not worth it)
- Real-time websocket updates (overkill for current scale)
- ML-based trend prediction (TF-IDF is sufficient)
- Any change to the UI components (they already look great)
- Any change to existing API response formats

---

## 11. PACKAGES TO ADD

All free, all open source, all compatible with Cloudflare Workers:

```json
"pdf-parse": "^1.1.1",        // PDF text extraction — MIT license
"fast-xml-parser": "^4.3.6"   // RSS XML parsing — MIT license
```

That's it. Two packages. Everything else uses native Workers APIs.

**Enable in wrangler.jsonc:**
```jsonc
"compatibility_flags": ["nodejs_compat"]
```

This unlocks Node.js APIs in Cloudflare Workers — needed for pdf-parse. Already a standard Cloudflare feature, no extra cost.

---

## 12. TESTING PLAN

### Test 1 — DARPG Fetcher
1. Run `npm run test:darpg` locally against a downloaded sample PDF
2. Verify 30 ministry rows are updated in local D1
3. Verify audit_log shows the sync event
4. Verify `data_source = 'darpg_pdf'` and `last_synced_at` is set

### Test 2 — RSS Monitor
1. Run `npm run test:rss` locally
2. Verify at least 3–5 articles are inserted into `social_signals`
3. Verify deduplication works (run twice, count stays same)
4. Verify keyword matching catches "CPGRAMS" and "grievance" articles

### Test 3 — Aggregator
1. Insert 20 test complaints with keyword "pension" appearing 15 times and "railway" appearing 5 times
2. Run aggregator
3. Verify "pension" appears as trending with spike_factor > 1
4. Verify ministry_stats.citizen_satisfaction_rate updates when feedback exists

### Test 4 — Admin Manual Trigger
1. Open `/admin` page
2. Click "Run RSS Monitor Now"
3. Verify pipeline status updates to "Running" then "Success"
4. Verify new social_signals rows appear

### Test 5 — Graceful Fallback
1. Empty the trending_issues table
2. Load dashboard
3. Verify RSS-based fallback trends appear
4. Verify banner shows "Based on news monitoring"

---

## 13. HOW TO PRESENT THIS AT THE REVIEW

When judges see the dashboard, you can now truthfully say:

**"The ministry data you see here is pulled from DARPG's official monthly reports. This pipeline runs automatically on the 1st of every month and updates all 30 ministry stats directly from the government's own published PDFs."**

**"The trending issues on the left are computed in two ways — articles from PIB and major newspapers are scanned daily for grievance-related keywords, and complaints filed by real users on our platform are clustered weekly using TF-IDF frequency analysis. You can see the last pipeline run was [timestamp] on the admin panel."**

**"The fake closure detector works by comparing DARPG's official resolution rate against actual citizen-reported outcomes from our feedback system. When a ministry shows 90% official resolution but 40% citizen satisfaction, we flag it."**

**"The social signals feed shows real news articles from today. Click any one — it opens the actual article."**

These statements are completely true. That is the entire goal of this PRD.

---

## 14. SUMMARY TABLE — STATIC vs DYNAMIC

| Data | Currently | After Week 8 | Source | Frequency |
|------|-----------|--------------|--------|-----------|
| Ministry stats (30) | seed.sql hardcoded | DARPG PDF extraction | darpg.gov.in | Monthly |
| State stats (36) | seed.sql hardcoded | DARPG State PDF | darpg.gov.in | Monthly |
| Trending issues (8) | seed.sql hardcoded | TF-IDF + RSS | Platform + news | Weekly |
| Social signals (10+) | seed.sql fake strings | Real RSS articles | 5 news feeds | Daily |
| Time-series history | Fabricated arrays | data.gov.in API | data.gov.in | Monthly |
| Fake closure rates | seed.sql hardcoded | Computed from feedback | Platform users | Nightly |
| Citizen satisfaction | seed.sql hardcoded | Computed from feedback | Platform users | Nightly |
| Demo complaints (3) | Fake users | Single `is_demo=1` row | Seed | Static (intentional) |
| Real user complaints | N/A | Real users filing | Platform users | Real-time |

---

*This document describes only what is needed, what is realistic, and what is buildable using free and open-source tools within a one-week sprint. No paid APIs. No external servers. No changes to existing UI or API contracts.*
