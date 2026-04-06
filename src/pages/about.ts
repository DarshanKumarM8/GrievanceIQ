import { layout } from './layout'

export function aboutPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-800 to-navy-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3">About GrievanceIQ</h1>
      <p class="text-gray-300 max-w-2xl mx-auto">The intelligence layer between citizens and India's grievance system.</p>
    </div>
  </section>

  <section class="py-12 sm:py-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Mission -->
      <div class="mb-16" data-animate>
        <span class="inline-flex items-center gap-1.5 bg-saffron-50 text-saffron-700 rounded-full px-4 py-1.5 text-xs font-semibold mb-4"><i class="fas fa-bullseye"></i> OUR MISSION</span>
        <h2 class="text-2xl font-bold text-navy-800 mb-4">Making Government Accountability Accessible</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          India's CPGRAMS processes over <strong>70 lakh complaints</strong> connecting citizens to 92 central ministries. 
          But the system wasn't designed for citizens — it was designed for bureaucratic workflow management.
        </p>
        <p class="text-gray-600 leading-relaxed mb-4">
          GrievanceIQ flips this. We build the <strong>citizen-facing intelligence layer</strong> that nobody else has built — 
          not the government, not IIT Kanpur, not any existing civic tech platform.
        </p>
        <blockquote class="border-l-4 border-saffron-500 pl-6 py-2 bg-saffron-50/50 rounded-r-xl italic text-gray-700 text-lg">
          "The government built a complaint inbox. GrievanceIQ builds the intelligence layer between citizens and that inbox — so filing a complaint actually means something."
        </blockquote>
      </div>

      <!-- What We Do / Don't Do -->
      <div class="grid md:grid-cols-2 gap-6 mb-16">
        <div class="bg-ashoka-50 rounded-2xl p-6 border border-ashoka-200" data-animate>
          <h3 class="font-bold text-ashoka-800 mb-4"><i class="fas fa-check-circle mr-2"></i>What We Do</h3>
          <ul class="space-y-2 text-sm text-gray-700">
            <li><i class="fas fa-check text-ashoka-600 mr-2"></i>Help citizens write stronger complaints</li>
            <li><i class="fas fa-check text-ashoka-600 mr-2"></i>Route to the correct department using AI</li>
            <li><i class="fas fa-check text-ashoka-600 mr-2"></i>Track complaint progress with reminders</li>
            <li><i class="fas fa-check text-ashoka-600 mr-2"></i>Generate RTI applications for escalation</li>
            <li><i class="fas fa-check text-ashoka-600 mr-2"></i>Expose fake closures through citizen feedback</li>
            <li><i class="fas fa-check text-ashoka-600 mr-2"></i>Provide public accountability data</li>
          </ul>
        </div>
        <div class="bg-red-50 rounded-2xl p-6 border border-red-200" data-animate>
          <h3 class="font-bold text-red-800 mb-4"><i class="fas fa-times-circle mr-2"></i>What We Don't Do</h3>
          <ul class="space-y-2 text-sm text-gray-700">
            <li><i class="fas fa-xmark text-red-500 mr-2"></i>We don't file complaints on your behalf</li>
            <li><i class="fas fa-xmark text-red-500 mr-2"></i>We don't log into CPGRAMS for you</li>
            <li><i class="fas fa-xmark text-red-500 mr-2"></i>We don't give legal advice</li>
            <li><i class="fas fa-xmark text-red-500 mr-2"></i>We don't replace CPGRAMS</li>
            <li><i class="fas fa-xmark text-red-500 mr-2"></i>We don't store your data without consent</li>
            <li><i class="fas fa-xmark text-red-500 mr-2"></i>We don't guarantee any outcomes</li>
          </ul>
        </div>
      </div>

      <!-- Competitive Landscape -->
      <div class="mb-16" data-animate>
        <h2 class="text-2xl font-bold text-navy-800 mb-6"><i class="fas fa-chart-bar text-navy-600 mr-2"></i>Why GrievanceIQ is Different</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <thead class="bg-navy-50">
              <tr>
                <th class="px-4 py-3 text-left font-semibold text-navy-700">Solution</th>
                <th class="px-4 py-3 text-center font-semibold text-navy-700">Citizen-Facing</th>
                <th class="px-4 py-3 text-center font-semibold text-navy-700">Public Dashboard</th>
                <th class="px-4 py-3 text-center font-semibold text-navy-700">AI Builder</th>
                <th class="px-4 py-3 text-center font-semibold text-navy-700">Fake Closure</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr><td class="px-4 py-3 font-medium">CPGRAMS Portal</td><td class="px-4 py-3 text-center text-xs text-gray-400">Basic</td><td class="px-4 py-3 text-center"><i class="fas fa-xmark text-red-400"></i></td><td class="px-4 py-3 text-center"><i class="fas fa-xmark text-red-400"></i></td><td class="px-4 py-3 text-center"><i class="fas fa-xmark text-red-400"></i></td></tr>
              <tr><td class="px-4 py-3 font-medium">NextGen CPGRAMS</td><td class="px-4 py-3 text-center text-xs text-gray-400">WhatsApp only</td><td class="px-4 py-3 text-center"><i class="fas fa-xmark text-red-400"></i></td><td class="px-4 py-3 text-center"><i class="fas fa-xmark text-red-400"></i></td><td class="px-4 py-3 text-center"><i class="fas fa-xmark text-red-400"></i></td></tr>
              <tr><td class="px-4 py-3 font-medium">IIT Kanpur IGMS</td><td class="px-4 py-3 text-center"><i class="fas fa-xmark text-red-400"></i></td><td class="px-4 py-3 text-center"><i class="fas fa-xmark text-red-400"></i></td><td class="px-4 py-3 text-center"><i class="fas fa-xmark text-red-400"></i></td><td class="px-4 py-3 text-center"><i class="fas fa-xmark text-red-400"></i></td></tr>
              <tr class="bg-saffron-50"><td class="px-4 py-3 font-bold text-saffron-700">GrievanceIQ</td><td class="px-4 py-3 text-center"><i class="fas fa-check text-ashoka-500 text-lg"></i></td><td class="px-4 py-3 text-center"><i class="fas fa-check text-ashoka-500 text-lg"></i></td><td class="px-4 py-3 text-center"><i class="fas fa-check text-ashoka-500 text-lg"></i></td><td class="px-4 py-3 text-center"><i class="fas fa-check text-ashoka-500 text-lg"></i></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tech Stack -->
      <div class="mb-16" data-animate>
        <h2 class="text-2xl font-bold text-navy-800 mb-6"><i class="fas fa-microchip text-navy-600 mr-2"></i>Technology</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-white rounded-xl p-4 text-center border border-gray-200"><div class="text-2xl mb-1">⚡</div><p class="text-xs font-semibold text-gray-700">Hono</p><p class="text-[10px] text-gray-400">Edge Runtime</p></div>
          <div class="bg-white rounded-xl p-4 text-center border border-gray-200"><div class="text-2xl mb-1">🗄️</div><p class="text-xs font-semibold text-gray-700">D1 Database</p><p class="text-[10px] text-gray-400">SQLite at Edge</p></div>
          <div class="bg-white rounded-xl p-4 text-center border border-gray-200"><div class="text-2xl mb-1">🤖</div><p class="text-xs font-semibold text-gray-700">AI Analysis</p><p class="text-[10px] text-gray-400">Smart Routing</p></div>
          <div class="bg-white rounded-xl p-4 text-center border border-gray-200"><div class="text-2xl mb-1">🗺️</div><p class="text-xs font-semibold text-gray-700">Leaflet.js</p><p class="text-[10px] text-gray-400">Interactive Maps</p></div>
          <div class="bg-white rounded-xl p-4 text-center border border-gray-200"><div class="text-2xl mb-1">📊</div><p class="text-xs font-semibold text-gray-700">Chart.js</p><p class="text-[10px] text-gray-400">Data Visualization</p></div>
          <div class="bg-white rounded-xl p-4 text-center border border-gray-200"><div class="text-2xl mb-1">🎨</div><p class="text-xs font-semibold text-gray-700">Tailwind CSS</p><p class="text-[10px] text-gray-400">Responsive Design</p></div>
          <div class="bg-white rounded-xl p-4 text-center border border-gray-200"><div class="text-2xl mb-1">📄</div><p class="text-xs font-semibold text-gray-700">jsPDF</p><p class="text-[10px] text-gray-400">RTI PDF Export</p></div>
          <div class="bg-white rounded-xl p-4 text-center border border-gray-200"><div class="text-2xl mb-1">☁️</div><p class="text-xs font-semibold text-gray-700">Cloudflare</p><p class="text-[10px] text-gray-400">Global Edge</p></div>
        </div>
      </div>

      <!-- Disclaimer -->
      <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200" data-animate>
        <h3 class="font-bold text-gray-800 mb-3"><i class="fas fa-shield-halved mr-2 text-gray-600"></i>Disclaimer</h3>
        <p class="text-sm text-gray-600 leading-relaxed">
          GrievanceIQ is an educational and civic technology tool. All AI-generated outputs — including department suggestions, complaint rewrites, quality scores, and RTI drafts — are <strong>comprehension and writing assistance tools only</strong>. They do not constitute legal advice. Users are responsible for reviewing all content before filing. GrievanceIQ does not guarantee any specific outcome from government departments. Data shown on the dashboard is derived from publicly available CPGRAMS statistics and citizen-reported feedback.
        </p>
      </div>
    </div>
  </section>
  `
  return layout('About', content, 'about', {
    description: 'GrievanceIQ is an open-source civic tech platform that uses AI to empower Indian citizens in the grievance redressal process.',
    keywords: 'GrievanceIQ about, civic tech, open source, citizen empowerment, India governance'
  })
}
