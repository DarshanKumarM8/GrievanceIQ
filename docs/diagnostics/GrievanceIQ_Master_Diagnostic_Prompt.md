# GrievanceIQ — Master Diagnostic & Live Data Verification Prompt

## HOW TO USE THIS
Copy the entire section under each heading and send it to your AI assistant (Claude/Gemini/GPT)
as a single message. Each section is a standalone diagnostic task.
Run them in order: 1 → 2 → 3 → 4 → 5.

---

---

## PROMPT 1 — CRON TRIGGER HEALTH CHECK
*Verifies all three scheduled jobs are registered, firing, and logging correctly*

```
You are a senior Cloudflare Workers engineer auditing GrievanceIQ v8.0.0.

The project uses Cloudflare Cron Triggers to run three scheduled jobs:
- darpg-fetcher.ts → runs "0 2 1 * *" (1st of every month, 2:00 AM)
- rss-monitor.ts → runs "0 0 * * *" (midnight daily)
- aggregator.ts → runs "30 2 * * *" (daily 2:30 AM)

All cron events are handled in the Worker's `scheduled` event handler.
Every successful and failed run writes a row to the `audit_log` D1 table with:
  - event_type: 'pipeline_run'
  - details: JSON with {job, status, rows_updated/signals_inserted/complaints_analysed}
  - created_at: ISO timestamp

TASK — Write me the following diagnostic tools:

1. A wrangler CLI command to manually trigger each cron job locally for testing
   (use `wrangler dev --test-scheduled` pattern, one command per job)

2. A SQL query I can run via `npx wrangler d1 execute grievanceiq --command="..."` 
   that shows the last 10 audit_log entries for pipeline runs, sorted newest first,
   showing: id, event_type, details, created_at

3. A SQL query that shows whether each of the 3 jobs ran successfully in the last 
   24 hours — return: job_name, last_run_time, status, rows_affected

4. A SQL query that detects if a job has NEVER run (audit_log has zero entries for it)
   versus if it ran but failed versus if it ran and succeeded

5. A JavaScript snippet I can add to my wrangler.jsonc `scheduled` handler to log 
   every cron execution attempt (both before and after the fetch call) so I can 
   distinguish "cron fired but Worker crashed" from "cron never fired at all"

My D1 database binding is `DB`, database name is `grievanceiq`.
My Worker entry file is `src/index.ts` using Hono v4 framework.
The scheduled handler currently looks like:
  app.on('scheduled', async (event, env, ctx) => { ... })

Return each item clearly labelled with the number above.
Do not change my existing architecture — only add diagnostic logging.
```

---

---

## PROMPT 2 — DATABASE LIVE DATA AUDIT
*Checks whether D1 tables contain real data or seed/static data*

```
You are auditing GrievanceIQ v8.0.0's Cloudflare D1 database for data freshness.

The database has 13 tables. The critical ones for live data are:
- ministry_stats (30 rows — should be updated monthly from DARPG PDFs)
- state_grievance_stats (36 rows — should be updated monthly from DARPG PDFs)
- trending_issues (should be updated weekly from TF-IDF aggregator)
- social_signals (should grow daily from RSS monitor)
- monthly_history (15 rows — should be updated monthly from data.gov.in API)
- complaints (should grow as real users file complaints)
- complaint_feedback (should grow as users submit outcomes)
- audit_log (should have pipeline run entries)

Two columns indicate whether data is real or seeded:
- data_source: values are 'seed', 'darpg_pdf', 'datagov_api', 'platform_computed', 'rss'
- last_synced_at: null means never synced from a live source

TASK — Write me a complete set of diagnostic SQL queries I can run via wrangler CLI:

1. A SINGLE master health check query that returns one row per table showing:
   table_name | total_rows | rows_with_real_data | rows_still_seeded | last_updated

   Define "real data" as: data_source != 'seed' AND last_synced_at IS NOT NULL
   Define "still seeded" as: data_source = 'seed' OR last_synced_at IS NULL

2. A query specifically for ministry_stats showing:
   ministry_name | complaints_received | data_source | last_synced_at | is_live
   where is_live = 1 if data_source = 'darpg_pdf' and last_synced_at is within 35 days

3. A query for trending_issues showing:
   topic_keywords | complaint_count | spike_factor | week_start | is_stale
   where is_stale = 1 if week_start is older than 14 days

4. A query for social_signals showing:
   COUNT of signals per day for the last 7 days
   (to verify daily RSS monitor is actually inserting new rows, not zero)

5. A query that detects FAKE DATA red flags — specifically:
   - ministry_stats rows where complaints_received is a suspiciously round number (divisible by 1000)
   - trending_issues rows where topic_keywords contains placeholder text like 'placeholder', 'test', 'demo'
   - social_signals where platform = 'seed' or content contains 'fake' or 'test'
   - complaints where user_id IN (1,2,3) AND is_demo IS NULL (unflagged demo data)

6. A final summary query that returns a single YES/NO verdict:
   IS_DATA_LIVE: YES if at least 20 ministry rows have data_source='darpg_pdf'
                 AND social_signals has at least 5 rows from last 24 hours
                 AND trending_issues has at least 3 rows with week_start in last 7 days
   IS_DATA_LIVE: NO otherwise, with a reason string explaining which condition failed

My D1 binding is `DB`. Run each query with:
npx wrangler d1 execute grievanceiq --command="YOUR_SQL_HERE"
```

---

---

## PROMPT 3 — DARPG PDF FETCHER VERIFICATION
*Tests whether the PDF fetch and parse pipeline is working end to end*

```
You are debugging the DARPG PDF fetcher for GrievanceIQ v8.0.0.

The fetcher lives in `src/workers/darpg-fetcher.ts`.
It runs on Cloudflare Workers with nodejs_compat flag enabled.
It uses `pdf-parse` npm package to extract tables from the DARPG monthly PDF.
After parsing, it writes to D1 via the DB binding.

The target PDF URL pattern is:
https://darpg.gov.in/sites/default/files/DARPG_Monthly_Report_Central_{Month}_{Year}.pdf
Example: DARPG_Monthly_Report_Central_April_2026.pdf

TASK — Write me the following test tools:

1. A standalone Node.js test script (`test-darpg.js`) I can run locally with
   `node test-darpg.js` that:
   a. Downloads the latest DARPG PDF from the real URL
   b. Parses it with pdfplumber-equivalent logic using pdf-parse
   c. Prints the first 5 extracted ministry rows to console
   d. Reports: total pages, total tables found, total rows with valid data
   e. Does NOT write to D1 — read only test

2. A test for the URL construction logic — given today's date, generate 
   the correct PDF URL. Then also generate the PREVIOUS month's URL as fallback
   (in case the current month PDF isn't published yet on the 1st).
   Return both URLs so I can manually verify they resolve before the cron runs.

3. A Cloudflare Worker compatibility check — list every Node.js API that 
   pdf-parse uses and confirm which ones are available under nodejs_compat flag.
   Flag any that are NOT available and suggest the workaround.

4. An error scenario handler — write the try/catch logic for the fetcher that 
   handles these specific failure modes:
   a. PDF not yet published (404 response) → retry after 7 days, do not fail job
   b. PDF downloaded but 0 ministry rows extracted → alert via audit_log, keep old data
   c. Ministry name in PDF doesn't match DB → log the unmatched name, skip that row
   d. D1 write fails → rollback all writes for that run, log full error

5. A SQL query I can run after a successful fetch to verify the data landed:
   Show ministry_name, complaints_received, last_synced_at for all 30 ministries
   sorted by last_synced_at DESC — so I can see which ones updated and which didn't

The Worker's DB binding is named `DB`.
The audit_log insert pattern is:
  await env.DB.prepare("INSERT INTO audit_log (event_type, details, created_at) VALUES (?,?,?)")
    .bind('pipeline_run', JSON.stringify({job:'darpg', ...}), new Date().toISOString())
    .run();
```

---

---

## PROMPT 4 — RSS MONITOR & AGGREGATOR VERIFICATION
*Tests whether daily news fetching and TF-IDF trending detection is working*

```
You are debugging the RSS monitor and nightly aggregator for GrievanceIQ v8.0.0.

RSS Monitor (`src/workers/rss-monitor.ts`):
- Runs daily at midnight
- Fetches 5 feeds: PIB, The Hindu, Indian Express, Hindustan Times, NDTV
- Parses XML using fast-xml-parser with processEntities:false, htmlEntities:false
- Filters articles by keyword list (CPGRAMS, PM-KISAN, EPFO, pension, grievance, etc.)
- Inserts matching articles into social_signals table
- Skips duplicates by checking if content LIKE '%{title[:50]}%' already exists

Aggregator (`src/workers/aggregator.ts`):
- Runs daily at 2:30 AM
- Queries last 7 days of complaints WHERE is_demo = 0
- Runs TF-IDF keyword frequency on raw_text
- Compares against previous 7 days (days 8-14)
- Flags terms with spike_factor > 2 as trending
- Updates trending_issues table
- Computes fake_closure_rate from complaint_feedback joins

TASK — Write me the following diagnostic tools:

1. A test script (`test-rss.js`) that runs locally and:
   a. Fetches all 5 RSS feeds right now
   b. Reports: feed_name, articles_fetched, articles_matching_keywords, articles_to_insert
   c. Prints the 3 most relevant matching headlines with their matched keyword
   d. Does NOT write to D1 — dry run only
   e. Reports if any feed URL returned an error or empty response

2. A fast-xml-parser safety check — show me the exact parser configuration 
   with processEntities:false and htmlEntities:false, and explain why each 
   option matters for security. Include the full import and instantiation.

3. A deduplication logic test — write a function that given a list of 10 article 
   titles, correctly identifies which ones are duplicates of each other using 
   the LIKE %title[:50]% pattern. Show edge cases: very short titles, titles 
   with special characters, Unicode Hindi/Tamil titles.

4. A TF-IDF diagnostic — given this sample input of 20 complaint texts, 
   show me what the top 10 keywords would be after TF-IDF processing.
   Use this sample: ["pension not received for 3 months", "PM-KISAN payment failed",
   "ration card not linked to Aadhaar", "pension delay again this month",
   "EPFO claim rejected without reason", "PM-KISAN amount not credited",
   "ration shop closed for 2 weeks", "pension portal not working",
   "PM-KISAN eKYC verification failing", "EPFO UAN not activated"]
   Show: keyword, tf_idf_score, frequency_this_week, frequency_last_week, spike_factor

5. Three SQL queries:
   a. Show social_signals grouped by day for last 7 days with count per day
      (to verify RSS monitor ran and inserted data each day)
   b. Show trending_issues ordered by spike_factor DESC with week_start
      (to verify aggregator ran and detected real trends, not stale seed data)
   c. Show the fake closure computation for top 5 ministries:
      ministry_name | official_rate | citizen_satisfaction | fake_closure_rate | gap

6. A complete end-to-end dry run script (`test-pipeline-full.js`) that:
   a. Checks RSS feeds are reachable (HEAD request to each)
   b. Checks DARPG PDF URL is reachable for current and previous month
   c. Checks data.gov.in API responds to a test request
   d. Queries D1 audit_log for last pipeline run times
   e. Prints a PASS/FAIL report for each check with timestamp
   This script should be runnable with: node test-pipeline-full.js
```

---

---

## PROMPT 5 — ADMIN DASHBOARD & MANUAL TRIGGER VERIFICATION
*Tests the admin pipeline panel and the protected manual trigger endpoint*

```
You are verifying the admin pipeline control panel for GrievanceIQ v8.0.0.

The admin panel lives at /admin route on the Cloudflare Worker.
It shows a "Data Pipeline" section with:
- Status of last run for each of 3 jobs (darpg, rss, aggregator)
- Last run timestamp per job
- Number of rows updated per job
- Manual "Run Now" buttons for each job

The manual trigger endpoint:
  POST /api/admin/pipeline/trigger
  Headers: Authorization: Bearer {ADMIN_SECRET_KEY}
  Body: { "job": "darpg" | "rss" | "aggregator" }

The ADMIN_SECRET_KEY is set as a Cloudflare environment variable.
The endpoint calls the respective internal worker function directly (not via cron).

TASK — Write me the following verification tools:

1. Three curl commands (one per job) to manually trigger each pipeline job
   right now without waiting for the cron schedule.
   Replace ADMIN_SECRET_KEY and YOUR_WORKER_URL with placeholders.
   Include the expected success response JSON for each.

2. A curl command to check pipeline status without triggering anything:
   GET /api/admin/pipeline/status
   Show what this endpoint should return — the last run time and status for each job
   pulled from audit_log. If this endpoint doesn't exist yet, write the Hono route
   handler code that creates it.

3. An authentication test — write two curl commands:
   a. One with the CORRECT Bearer token → should return 200 with job status
   b. One with a WRONG Bearer token → should return 401 Unauthorized
   This verifies the auth guard is actually working.

4. A race condition check — what happens if someone clicks "Run Now" while 
   the cron is already running the same job? Write the guard logic using a 
   D1 lock table pattern:
   - Before running: INSERT into pipeline_locks WHERE job_name = ? (fails if exists)
   - After running: DELETE from pipeline_locks WHERE job_name = ?
   - Lock expires: add a created_at check so stuck locks clear after 30 minutes
   Include the SQL for creating the pipeline_locks table and the TypeScript guard logic.

5. A complete pre-demo checklist — a shell script (`pre-demo-check.sh`) that 
   I run 30 minutes before my college review presentation that:
   a. Triggers all 3 pipeline jobs manually via the admin API
   b. Waits 30 seconds between each trigger
   c. After all 3, queries D1 to confirm:
      - At least 20 ministry rows have last_synced_at within last 1 hour
      - At least 3 social_signals inserted in last 1 hour
      - At least 1 trending_issue with week_start in last 1 hour
   d. Prints GREEN (ready to demo) or RED (something failed, with details)
   e. Takes 2 arguments: WORKER_URL and ADMIN_SECRET_KEY
   Usage: ./pre-demo-check.sh https://grievanceiq.pages.dev my-secret-key

My Worker URL format: https://grievanceiq.pages.dev
My D1 database name: grievanceiq
My Hono app variable: app (in src/index.ts)
```

---

---

## QUICK REFERENCE — WRANGLER CLI COMMANDS

Run these manually at any time to inspect live state:

```bash
# See last 20 audit log entries
npx wrangler d1 execute grievanceiq --command="SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 20"

# Count rows per table
npx wrangler d1 execute grievanceiq --command="SELECT 'ministry_stats' as tbl, COUNT(*) as rows FROM ministry_stats UNION ALL SELECT 'social_signals', COUNT(*) FROM social_signals UNION ALL SELECT 'trending_issues', COUNT(*) FROM trending_issues UNION ALL SELECT 'complaint_feedback', COUNT(*) FROM complaint_feedback"

# Check data freshness
npx wrangler d1 execute grievanceiq --command="SELECT ministry_name, data_source, last_synced_at FROM ministry_stats ORDER BY last_synced_at DESC LIMIT 5"

# Check for today's RSS signals
npx wrangler d1 execute grievanceiq --command="SELECT platform, COUNT(*) as count FROM social_signals WHERE captured_at > datetime('now', '-24 hours') GROUP BY platform"

# Check trending issues freshness
npx wrangler d1 execute grievanceiq --command="SELECT topic_keywords, spike_factor, week_start FROM trending_issues ORDER BY week_start DESC LIMIT 5"

# Manually trigger cron in local dev
npx wrangler dev --test-scheduled
# Then in browser: http://localhost:8787/__scheduled?cron=0+2+1+*+*

# Check pipeline locks (if implemented)
npx wrangler d1 execute grievanceiq --command="SELECT * FROM pipeline_locks"

# See real vs seeded data ratio
npx wrangler d1 execute grievanceiq --command="SELECT data_source, COUNT(*) as count FROM ministry_stats GROUP BY data_source"
```

---

## WHAT TO LOOK FOR — PASS/FAIL CRITERIA

| Check | PASS | FAIL |
|-------|------|------|
| Cron registered | wrangler shows 3 triggers in dashboard | 0 or wrong crons listed |
| DARPG fetch ran | audit_log has darpg entry this month | No entry or status=error |
| Ministry data live | data_source = 'darpg_pdf' for 20+ rows | data_source = 'seed' for all |
| RSS monitor ran | social_signals has rows from today | Zero rows from last 24h |
| Aggregator ran | trending_issues week_start within 7 days | week_start is weeks old |
| Fake closure live | ministry_stats fake_closure_rate IS NOT NULL | All nulls |
| No demo pollution | complaints WHERE is_demo=1 only has 1 row | Multiple fake user rows |
| Admin auth works | 401 on wrong key, 200 on correct key | 200 on any key (broken auth) |
| No stale seed data | data_source != 'seed' for majority of rows | 'seed' everywhere |
| Pipeline logs exist | audit_log has 5+ pipeline_run entries | Empty audit_log |
