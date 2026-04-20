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
  GEMINI_API_KEY?: string
  RESEND_API_KEY?: string
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

export default app
