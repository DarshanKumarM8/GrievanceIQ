import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { apiRoutes } from './routes/api'
import { homePage } from './pages/home'
import { dashboardPage } from './pages/dashboard'
import { aboutPage } from './pages/about'
import { howItWorksPage } from './pages/how-it-works'
import { complaintPage } from './pages/complaint'
import { trackerPage } from './pages/tracker'
import { rtiPage } from './pages/rti'
import { myComplaintsPage } from './pages/my-complaints'

type Bindings = {
  DB: D1Database
  GEMINI_API_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS for API routes
app.use('/api/*', cors())

// ============================================
// API ROUTES
// ============================================
app.route('/api', apiRoutes)

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

export default app
