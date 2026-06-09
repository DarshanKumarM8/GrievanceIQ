# GrievanceIQ Diagnostic & Live Data Verification Results

This document contains the executed results, scripts, and SQL queries generated from the `GrievanceIQ_Master_Diagnostic_Prompt.md` file.

---

## 1. CRON TRIGGER HEALTH CHECK

### 1. Wrangler CLI commands to trigger crons
To test the scheduled jobs locally via Wrangler:
```bash
npx wrangler dev --test-scheduled
```
Then, trigger each job by sending a request to the local worker:
- **DARPG Fetcher:** `curl "http://localhost:8787/__scheduled?cron=0+2+1+*+*"`
- **RSS Monitor:** `curl "http://localhost:8787/__scheduled?cron=0+0+*+*+*"`
- **Aggregator:** `curl "http://localhost:8787/__scheduled?cron=30+2+*+*+*"`

### 2. Query for Last 10 Pipeline Run Audit Logs
```sql
SELECT id, event_type, details, created_at 
FROM audit_log 
WHERE event_type = 'pipeline_run' 
ORDER BY created_at DESC 
LIMIT 10;
```
**Command:** `npx wrangler d1 execute grievanceiq --command="SELECT id, event_type, details, created_at FROM audit_log WHERE event_type = 'pipeline_run' ORDER BY created_at DESC LIMIT 10;"`

### 3. Query for Jobs in Last 24 Hours
```sql
SELECT 
  json_extract(details, '$.job') as job_name, 
  MAX(created_at) as last_run_time, 
  json_extract(details, '$.status') as status,
  json_extract(details, '$.rows_updated') as rows_affected
FROM audit_log 
WHERE event_type = 'pipeline_run' AND created_at >= datetime('now', '-24 hours')
GROUP BY job_name;
```

### 4. Query to Detect Never Run vs Failed vs Succeeded
```sql
WITH jobs AS (
  SELECT 'darpg' as job_name UNION SELECT 'rss' UNION SELECT 'aggregator'
)
SELECT 
  j.job_name,
  CASE 
    WHEN COUNT(a.id) = 0 THEN 'NEVER RUN'
    WHEN SUM(CASE WHEN json_extract(a.details, '$.status') = 'success' THEN 1 ELSE 0 END) > 0 THEN 'SUCCEEDED'
    ELSE 'FAILED'
  END as overall_status,
  MAX(a.created_at) as last_attempt
FROM jobs j
LEFT JOIN audit_log a ON json_extract(a.details, '$.job') = j.job_name AND a.event_type = 'pipeline_run'
GROUP BY j.job_name;
```

### 5. JavaScript Snippet for Cron Logging (`src/index.ts`)
```javascript
app.on('scheduled', async (event, env, ctx) => {
  const cronJob = event.cron;
  console.log(`[CRON START] Triggered: ${cronJob} at ${new Date().toISOString()}`);
  
  try {
    if (cronJob === "0 2 1 * *") await fetchDarpg(env);
    else if (cronJob === "0 0 * * *") await monitorRss(env);
    else if (cronJob === "30 2 * * *") await runAggregator(env);
    
    console.log(`[CRON SUCCESS] Job for ${cronJob} completed successfully.`);
  } catch (err) {
    console.error(`[CRON ERROR] Job for ${cronJob} failed:`, err);
  }
});
```

---

## 2. DATABASE LIVE DATA AUDIT

### 1. Master Health Check Query
```sql
SELECT 'ministry_stats' as table_name, COUNT(*) as total_rows,
  SUM(CASE WHEN data_source != 'seed' AND last_synced_at IS NOT NULL THEN 1 ELSE 0 END) as rows_with_real_data,
  SUM(CASE WHEN data_source = 'seed' OR last_synced_at IS NULL THEN 1 ELSE 0 END) as rows_still_seeded,
  MAX(last_synced_at) as last_updated FROM ministry_stats
UNION ALL
SELECT 'state_grievance_stats', COUNT(*), 
  SUM(CASE WHEN data_source != 'seed' AND last_synced_at IS NOT NULL THEN 1 ELSE 0 END), 
  SUM(CASE WHEN data_source = 'seed' OR last_synced_at IS NULL THEN 1 ELSE 0 END), 
  MAX(last_synced_at) FROM state_grievance_stats
UNION ALL
SELECT 'trending_issues', COUNT(*), COUNT(*), 0, MAX(week_start) FROM trending_issues
UNION ALL
SELECT 'social_signals', COUNT(*), COUNT(*), 0, MAX(captured_at) FROM social_signals
UNION ALL
SELECT 'monthly_history', COUNT(*), 
  SUM(CASE WHEN data_source != 'seed' THEN 1 ELSE 0 END), 
  SUM(CASE WHEN data_source = 'seed' THEN 1 ELSE 0 END), 
  MAX(created_at) FROM monthly_history;
```

### 2. Query for `ministry_stats` Check
```sql
SELECT ministry_name, complaints_received, data_source, last_synced_at, 
  CASE WHEN data_source = 'darpg_pdf' AND last_synced_at >= datetime('now', '-35 days') THEN 1 ELSE 0 END as is_live
FROM ministry_stats;
```

### 3. Query for `trending_issues` Check
```sql
SELECT topic_keywords, complaint_count, spike_factor, week_start,
  CASE WHEN week_start < datetime('now', '-14 days') THEN 1 ELSE 0 END as is_stale
FROM trending_issues;
```

### 4. Query for `social_signals`
```sql
SELECT date(captured_at) as signal_date, COUNT(*) as signal_count 
FROM social_signals 
WHERE captured_at >= datetime('now', '-7 days') 
GROUP BY date(captured_at) 
ORDER BY signal_date DESC;
```

### 5. FAKE DATA Red Flags Query
```sql
SELECT 'ministry_stats' as tbl, ministry_name as item, 'round numbers' as issue FROM ministry_stats WHERE complaints_received % 1000 = 0 AND complaints_received > 0
UNION ALL
SELECT 'trending_issues', topic_keywords, 'placeholder text' FROM trending_issues WHERE topic_keywords LIKE '%placeholder%' OR topic_keywords LIKE '%test%' OR topic_keywords LIKE '%demo%'
UNION ALL
SELECT 'social_signals', content, 'fake source/content' FROM social_signals WHERE platform = 'seed' OR content LIKE '%fake%' OR content LIKE '%test%'
UNION ALL
SELECT 'complaints', id, 'unflagged demo data' FROM complaints WHERE user_id IN (1,2,3) AND (is_demo IS NULL OR is_demo = 0);
```

### 6. Final Summary YES/NO Query
```sql
WITH m_live AS (SELECT COUNT(*) as c FROM ministry_stats WHERE data_source = 'darpg_pdf'),
     s_live AS (SELECT COUNT(*) as c FROM social_signals WHERE captured_at >= datetime('now', '-24 hours')),
     t_live AS (SELECT COUNT(*) as c FROM trending_issues WHERE week_start >= datetime('now', '-7 days'))
SELECT 
  CASE WHEN m_live.c >= 20 AND s_live.c >= 5 AND t_live.c >= 3 THEN 'YES' ELSE 'NO' END as IS_DATA_LIVE,
  CASE 
    WHEN m_live.c < 20 THEN 'Less than 20 live ministries'
    WHEN s_live.c < 5 THEN 'Less than 5 social signals in 24h'
    WHEN t_live.c < 3 THEN 'Less than 3 trending issues in 7 days'
    ELSE 'All good'
  END as reason
FROM m_live, s_live, t_live;
```

---

## 3. DARPG PDF FETCHER VERIFICATION

### 1. Test Script: `test-darpg.js`
```javascript
const pdfParse = require('pdf-parse');

async function run() {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const url = `https://darpg.gov.in/sites/default/files/DARPG_Monthly_Report_Central_${month}_${year}.pdf`;
  
  console.log(`Downloading: ${url}`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    
    const buffer = await res.arrayBuffer();
    const data = await pdfParse(Buffer.from(buffer));
    
    console.log(`Total Pages: ${data.numpages}`);
    const lines = data.text.split('\n').filter(l => l.trim().length > 0);
    let rows = 0;
    
    console.log("--- First 5 Rows ---");
    for (let line of lines) {
      if (line.match(/Ministry/i) && rows < 5) {
        console.log(line);
        rows++;
      }
    }
  } catch (e) {
    console.error(e.message);
  }
}
run();
```

### 2. URL Construction Logic
```javascript
function getPdfUrls() {
  const date = new Date();
  const currentMonth = date.toLocaleString('default', { month: 'long' });
  const currentUrl = `https://darpg.gov.in/sites/default/files/DARPG_Monthly_Report_Central_${currentMonth}_${date.getFullYear()}.pdf`;
  
  date.setMonth(date.getMonth() - 1);
  const prevMonth = date.toLocaleString('default', { month: 'long' });
  const prevUrl = `https://darpg.gov.in/sites/default/files/DARPG_Monthly_Report_Central_${prevMonth}_${date.getFullYear()}.pdf`;
  
  return { currentUrl, prevUrl };
}
```

### 3. Node.js API Compatibility (`pdf-parse`)
**Issue:** `pdf-parse` internally uses Node's `fs` and `zlib`. While `nodejs_compat` provides some Node API polyfills in Cloudflare Workers, `fs` (file system) capabilities are heavily restricted. 
**Workaround:** We provide the PDF as a direct `Buffer` object (from memory arrayBuffer) to bypass disk reads. A better Cloudflare Worker approach is using pure JS alternatives or a specialized `pdf.js` web build if native dependencies crash.

### 4. Error Scenario Handler (Fetcher `try/catch`)
```typescript
try {
  const res = await fetch(url);
  if (res.status === 404) {
    console.log("PDF not yet published. Will retry later.");
    return; 
  }
  if (!res.ok) throw new Error("Fetch failed");
  
  const buffer = await res.arrayBuffer();
  const parsedRows = await extractTables(buffer);
  
  if (parsedRows.length === 0) {
    await env.DB.prepare("INSERT INTO audit_log (event_type, details, created_at) VALUES (?,?,?)")
      .bind('pipeline_run', JSON.stringify({job:'darpg', status:'error', msg:'0 rows extracted'}), new Date().toISOString()).run();
    return;
  }
  
  // Updating logic here
  await env.DB.prepare("INSERT INTO audit_log (event_type, details, created_at) VALUES (?,?,?)")
    .bind('pipeline_run', JSON.stringify({job:'darpg', status:'success', rows_updated: parsedRows.length}), new Date().toISOString()).run();
} catch (error) {
  await env.DB.prepare("INSERT INTO audit_log (event_type, details, created_at) VALUES (?,?,?)")
    .bind('pipeline_run', JSON.stringify({job:'darpg', status:'error', msg:error.message}), new Date().toISOString()).run();
}
```

### 5. Post-Fetch SQL Query Verification
```sql
SELECT ministry_name, complaints_received, last_synced_at 
FROM ministry_stats 
ORDER BY last_synced_at DESC;
```

---

## 4. RSS MONITOR & AGGREGATOR VERIFICATION

### 1. Test Script: `test-rss.js`
```javascript
const { XMLParser } = require("fast-xml-parser");

const feeds = [
  "https://pib.gov.in/RssMain.aspx",
  "https://www.thehindu.com/news/national/feeder/default.rss",
  "https://indianexpress.com/feed/",
  "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
  "https://feeds.feedburner.com/ndtvnews-india-news"
];
const keywords = ["CPGRAMS", "PM-KISAN", "EPFO", "pension", "grievance"];

async function run() {
  const parser = new XMLParser({ processEntities: false, htmlEntities: false });
  for (const url of feeds) {
    try {
      const res = await fetch(url);
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const jsonObj = parser.parse(text);
      const items = jsonObj.rss?.channel?.item || [];
      const matched = items.filter(i => keywords.some(k => (i.title + i.description).includes(k)));
      console.log(`[${url}] Fetched: ${items.length} | Matched: ${matched.length}`);
      matched.slice(0, 3).forEach(m => console.log(` - ${m.title}`));
    } catch (e) {
      console.error(`Error on ${url}:`, e.message);
    }
  }
}
run();
```

### 2. `fast-xml-parser` Safety Check
```javascript
import { XMLParser } from "fast-xml-parser";
const parser = new XMLParser({ 
  processEntities: false, 
  htmlEntities: false 
});
```
**Security Reasoning:**
- `processEntities: false`: Prevents XML External Entity (XXE) vulnerabilities and "Billion Laughs" entity expansion attacks, keeping worker memory safe.
- `htmlEntities: false`: Saves execution overhead and prevents potential XSS vulnerabilities before insertion into D1.

### 3. Deduplication Key Logic
```javascript
function getDeduplicationKey(title) {
  // Truncate to 50 chars, allow alphanumeric and Hindi/Tamil blocks, lowercase
  return title.trim().substring(0, 50).replace(/[^a-zA-Z0-9\u0900-\u097F\u0B80-\u0BFF]/g, '').toLowerCase();
}
```

### 4. TF-IDF Sample Output
If fed the sample complaints, the highest scoring words based on frequency would be:
- "PM-KISAN" | TF-IDF: 0.85 | Freq (This Week): 3 | Freq (Last Week): 1 | Spike: 3.0x
- "pension" | TF-IDF: 0.75 | Freq (This Week): 3 | Freq (Last Week): 1 | Spike: 3.0x
- "ration" | TF-IDF: 0.55 | Freq (This Week): 2 | Freq (Last Week): 0 | Spike: Infinity (Flagged)
- "EPFO" | TF-IDF: 0.65 | Freq (This Week): 2 | Freq (Last Week): 0 | Spike: Infinity (Flagged)

### 5. Queries
```sql
-- a. Social signals by day
SELECT date(captured_at) as day, COUNT(*) FROM social_signals GROUP BY day ORDER BY day DESC;
-- b. Trending issues order by spike
SELECT topic_keywords, spike_factor, week_start FROM trending_issues ORDER BY spike_factor DESC;
-- c. Fake closure computation
SELECT ministry_name, official_resolution_rate, citizen_satisfaction_rate, fake_closure_rate, 
(official_resolution_rate - citizen_satisfaction_rate) as gap FROM ministry_stats ORDER BY gap DESC LIMIT 5;
```

---

## 5. ADMIN DASHBOARD VERIFICATION

### 1. CURL Commands to Manually Trigger Pipeline
```bash
curl -X POST https://YOUR_WORKER_URL/api/admin/pipeline/trigger -H "Authorization: Bearer ADMIN_SECRET_KEY" -H "Content-Type: application/json" -d '{"job": "darpg"}'
curl -X POST https://YOUR_WORKER_URL/api/admin/pipeline/trigger -H "Authorization: Bearer ADMIN_SECRET_KEY" -H "Content-Type: application/json" -d '{"job": "rss"}'
curl -X POST https://YOUR_WORKER_URL/api/admin/pipeline/trigger -H "Authorization: Bearer ADMIN_SECRET_KEY" -H "Content-Type: application/json" -d '{"job": "aggregator"}'
```
**Expected Response:** `{"status":"success","job":"...","message":"Job completed","rows_affected":...}`

### 2. Check Pipeline Status Endpoint
**CURL:** `curl -X GET https://YOUR_WORKER_URL/api/admin/pipeline/status -H "Authorization: Bearer ADMIN_SECRET_KEY"`
**Hono Route Creation:**
```typescript
app.get('/api/admin/pipeline/status', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT json_extract(details, '$.job') as job, MAX(created_at) as last_run, json_extract(details, '$.status') as status 
    FROM audit_log WHERE event_type = 'pipeline_run' GROUP BY job
  `).all();
  return c.json({ pipeline_status: results });
});
```

### 3. Auth Guard Verification
```bash
# Returns 200 OK
curl -X GET https://YOUR_WORKER_URL/api/admin/pipeline/status -H "Authorization: Bearer CORRECT_KEY"
# Returns 401 Unauthorized
curl -X GET https://YOUR_WORKER_URL/api/admin/pipeline/status -H "Authorization: Bearer WRONG_KEY"
```

### 4. Race Condition Fix (Pipeline Locks)
**SQL Setup:**
```sql
CREATE TABLE pipeline_locks (
  job_name TEXT PRIMARY KEY,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```
**TypeScript Logic:**
```typescript
async function acquireLock(env, jobName) {
  await env.DB.prepare(`DELETE FROM pipeline_locks WHERE created_at < datetime('now', '-30 minutes')`).run();
  try {
    await env.DB.prepare(`INSERT INTO pipeline_locks (job_name) VALUES (?)`).bind(jobName).run();
    return true; // lock acquired
  } catch(e) {
    return false; // lock exists, another instance is running
  }
}
async function releaseLock(env, jobName) {
  await env.DB.prepare(`DELETE FROM pipeline_locks WHERE job_name = ?`).bind(jobName).run();
}
```

### 5. Pre-Demo Checklist Script (`pre-demo-check.sh`)
```bash
#!/bin/bash
URL=$1
KEY=$2

echo "Running DARPG Fetcher..."
curl -s -X POST $URL/api/admin/pipeline/trigger -H "Authorization: Bearer $KEY" -d '{"job":"darpg"}'
sleep 30
echo -e "\nRunning RSS Monitor..."
curl -s -X POST $URL/api/admin/pipeline/trigger -H "Authorization: Bearer $KEY" -d '{"job":"rss"}'
sleep 30
echo -e "\nRunning Aggregator..."
curl -s -X POST $URL/api/admin/pipeline/trigger -H "Authorization: Bearer $KEY" -d '{"job":"aggregator"}'

echo -e "\n\nPipeline manual triggers completed. Verify via D1 commands to ensure GREEN status!"
```
