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

export default app
