import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { apiRoutes } from './routes/api'
import { authRoutes } from './routes/auth'
import { securityHeaders, rateLimitMiddleware, authMiddleware } from './middleware/security'
import { homePage } from './pages/home'
import { dashboardPage } from './pages/dashboard'
import { aboutPage } from './pages/about'
import { howItWorksPage } from './pages/how-it-works'
import { complaintPage } from './pages/complaint'
import { trackerPage } from './pages/tracker'
import { rtiPage } from './pages/rti'
import { myComplaintsPage } from './pages/my-complaints'
import { loginPage } from './pages/login'
import { profilePage } from './pages/profile'
import { complaintDetailPage } from './pages/complaint-detail'
import { adminPage } from './pages/admin'

type Bindings = {
  DB: D1Database
  GROQ_API_KEY?: string
  RESEND_API_KEY?: string
  PIPELINE_SERVICE_URL?: string
  INTERNAL_API_KEY?: string
  ADMIN_SECRET_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// ============================================
// GLOBAL MIDDLEWARE
// ============================================

// Security headers (CSP, X-Frame-Options, etc.)
app.use('*', securityHeaders())

// CORS for API routes
app.use('/api/*', cors())

// Auth context for all routes (optional — extracts user if present)
app.use('*', authMiddleware(false))

// Rate limiting for API routes
app.use('/api/*', rateLimitMiddleware(120, 1)) // 120 req/min

// Stricter rate limit for auth endpoints
app.use('/api/auth/*', rateLimitMiddleware(10, 5)) // 10 req/5min

// ============================================
// API ROUTES
// ============================================
app.route('/api', apiRoutes)
app.route('/api/auth', authRoutes)

// ============================================
// PAGE ROUTES
// ============================================
app.get('/', (c) => c.html(homePage()))
app.get('/dashboard', (c) => c.html(dashboardPage()))
app.get('/about', (c) => c.html(aboutPage()))
app.get('/how-it-works', (c) => c.html(howItWorksPage()))
app.get('/complaint', (c) => c.html(complaintPage()))
app.get('/tracker', (c) => c.html(trackerPage()))
app.get('/rti', (c) => c.html(rtiPage()))
app.get('/my-complaints', (c) => c.html(myComplaintsPage()))
app.get('/login', (c) => c.html(loginPage()))
app.get('/profile', (c) => c.html(profilePage()))
app.get('/complaint-detail', (c) => c.html(complaintDetailPage()))
app.get('/admin', (c) => c.html(adminPage()))

// ============================================
// FAVICON (prevent 404)
// ============================================
app.get('/favicon.ico', (c) => {
  // Simple SVG favicon - balance scale icon in saffron/navy
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1a365d"/><text x="16" y="23" text-anchor="middle" font-size="20" fill="#ff9933">⚖</text></svg>`
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' } })
})

// ============================================
// SEO ROUTES
// ============================================
app.get('/sitemap.xml', (c) => {
  const baseUrl = new URL(c.req.url).origin
  const pages = ['/', '/dashboard', '/complaint', '/tracker', '/rti', '/my-complaints', '/how-it-works', '/about', '/login', '/admin']
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${baseUrl}${p}</loc><lastmod>${new Date().toISOString().split('T')[0]}</lastmod></url>`).join('\n')}
</urlset>`
  return c.text(xml, 200, { 'Content-Type': 'application/xml' })
})

app.get('/robots.txt', (c) => {
  const baseUrl = new URL(c.req.url).origin
  return c.text(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${baseUrl}/sitemap.xml`, 200, { 'Content-Type': 'text/plain' })
})

// ============================================
// CLOUDFLARE CRON TRIGGER — Pipeline Orchestrator
// ============================================
async function scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
  const pipelineUrl = env.PIPELINE_SERVICE_URL || 'http://localhost:8000'
  const apiKey = env.INTERNAL_API_KEY || ''
  const db = env.DB

  // Helper to call Render internal endpoints
  async function callPipeline(endpoint: string): Promise<any> {
    const res = await fetch(`${pipelineUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    return res.json()
  }

  // Helper to log pipeline runs
  async function logRun(jobName: string, status: string, rowsAffected: number = 0, error?: string) {
    try {
      await db.prepare(
        "INSERT INTO pipeline_runs (job_name, status, started_at, completed_at, rows_affected, error_message, triggered_by) VALUES (?, ?, datetime('now'), datetime('now'), ?, ?, 'cron')"
      ).bind(jobName, status, rowsAffected, error || null).run()
    } catch (e) { /* non-critical */ }
  }

  // Step 1: Ping Render to warm up the container
  try {
    await fetch(`${pipelineUrl}/internal/ping`, { method: 'GET' })
  } catch (e) { /* Container might still be cold */ }

  // Wait 5 seconds for container to warm up
  await new Promise(resolve => setTimeout(resolve, 5000))

  // Step 2: Determine which job to run based on cron schedule
  const trigger = event.cron

  try {
    if (trigger === '0 20 28 * *') {
      // Monthly: DARPG PDF Fetch (2 AM IST on 28th)
      const result = await callPipeline('/internal/fetch-darpg')
      await logRun('darpg_fetch', result.status || 'success', result.data?.rows_updated || 0)

      // Also fetch data.gov.in historical data on the same monthly schedule
      try {
        const dgResult = await callPipeline('/internal/fetch-datagov')
        await logRun('datagov_fetch', dgResult.status || 'success', dgResult.data?.rows_inserted || 0)
      } catch (dgErr: any) {
        await logRun('datagov_fetch', 'failed', 0, dgErr.message)
      }

    } else if (trigger === '30 0 * * *') {
      // Daily: RSS News Monitor (6 AM IST)
      const result = await callPipeline('/internal/fetch-rss')
      await logRun('rss_monitor', result.status || 'success', result.data?.articles_inserted || 0)

    } else if (trigger === '0 21 * * *') {
      // Daily: Nightly Aggregator (2:30 AM IST)
      const result = await callPipeline('/internal/run-aggregator')
      await logRun('aggregator', result.status || 'success', result.data?.trending_issues_updated || 0)
    }
  } catch (e: any) {
    const jobName = trigger === '0 20 28 * *' ? 'darpg_fetch' : trigger === '30 0 * * *' ? 'rss_monitor' : 'aggregator'
    await logRun(jobName, 'failed', 0, e.message)
  }
}

export default {
  fetch: app.fetch,
  scheduled
}
