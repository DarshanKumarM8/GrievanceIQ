import { layout } from './layout'

export function howItWorksPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-800 to-navy-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3">How GrievanceIQ Works</h1>
      <p class="text-gray-300 max-w-2xl mx-auto">A complete guide to using the platform — from filing your first complaint to escalating with RTI.</p>
    </div>
  </section>

  <section class="py-12 sm:py-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Citizen Flow -->
      <h2 class="text-2xl font-bold text-navy-800 mb-8"><i class="fas fa-user text-saffron-500 mr-2"></i>For Citizens</h2>
      
      <div class="space-y-8 mb-16">
        <div class="flex gap-5" data-animate>
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">1</div>
            <div class="w-0.5 flex-1 bg-gray-200 mt-2"></div>
          </div>
          <div class="pb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Type Your Problem in Plain Language</h3>
            <p class="text-gray-600 text-sm leading-relaxed mb-3">Go to the <a href="/complaint" class="text-saffron-600 underline font-medium">Complaint Builder</a> and type your problem exactly as you'd describe it to a friend. Hindi, English, Tamil, Telugu, Bengali — any language works. No government jargon needed.</p>
            <div class="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 italic border">"My PM-KISAN payment has not come for 3 months. I completed eKYC but portal still shows payment failed."</div>
          </div>
        </div>

        <div class="flex gap-5" data-animate>
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-navy-600 to-navy-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">2</div>
            <div class="w-0.5 flex-1 bg-gray-200 mt-2"></div>
          </div>
          <div class="pb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-2">AI Routes & Scores Your Complaint</h3>
            <p class="text-gray-600 text-sm leading-relaxed">Our AI reads your complaint and instantly:</p>
            <ul class="mt-2 space-y-1 text-sm text-gray-600">
              <li><i class="fas fa-check text-ashoka-500 mr-2"></i>Identifies the <strong>correct department</strong> from 92 ministries (with confidence %)</li>
              <li><i class="fas fa-check text-ashoka-500 mr-2"></i>Gives a <strong>quality score</strong> from 1-10</li>
              <li><i class="fas fa-check text-ashoka-500 mr-2"></i>Lists <strong>exactly what's missing</strong> (dates, reference numbers, etc.)</li>
            </ul>
          </div>
        </div>

        <div class="flex gap-5" data-animate>
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-ashoka-500 to-ashoka-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">3</div>
            <div class="w-0.5 flex-1 bg-gray-200 mt-2"></div>
          </div>
          <div class="pb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Review the AI-Improved Complaint</h3>
            <p class="text-gray-600 text-sm leading-relaxed">A side-by-side editor shows your original text on the left and the AI-improved version on the right. The improved version adds all the details officers need to act. You can edit it before copying.</p>
          </div>
        </div>

        <div class="flex gap-5" data-animate>
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">4</div>
            <div class="w-0.5 flex-1 bg-gray-200 mt-2"></div>
          </div>
          <div class="pb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-2">File on CPGRAMS & Track</h3>
            <p class="text-gray-600 text-sm leading-relaxed">Copy your improved complaint and file it at <a href="https://pgportal.gov.in" target="_blank" class="text-saffron-600 underline">pgportal.gov.in</a>. Then come back, enter your CPGRAMS ID in our <a href="/tracker" class="text-saffron-600 underline">Tracker</a>, and we'll remind you on Day 15 and Day 25.</p>
          </div>
        </div>

        <div class="flex gap-5" data-animate>
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">5</div>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Escalate with RTI if Ignored</h3>
            <p class="text-gray-600 text-sm leading-relaxed">If your complaint is unresolved past 30 days, our <a href="/rti" class="text-saffron-600 underline">RTI Auto-Drafter</a> generates a pre-filled, legally formatted RTI application. Download as PDF and file at <a href="https://rtionline.gov.in" target="_blank" class="text-saffron-600 underline">rtionline.gov.in</a>.</p>
          </div>
        </div>
      </div>

      <!-- Journalist Flow -->
      <h2 class="text-2xl font-bold text-navy-800 mb-8"><i class="fas fa-newspaper text-navy-600 mr-2"></i>For Journalists & Researchers</h2>
      
      <div class="grid sm:grid-cols-2 gap-6 mb-12">
        <div class="bg-white rounded-2xl p-6 border border-gray-200 card-hover" data-animate>
          <div class="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center mb-3"><i class="fas fa-map text-navy-600"></i></div>
          <h3 class="font-bold text-gray-900 mb-2">Explore the India Map</h3>
          <p class="text-sm text-gray-600">Click any state to see grievance density, top issues, and department performance. Filter by metric.</p>
        </div>
        <div class="bg-white rounded-2xl p-6 border border-gray-200 card-hover" data-animate>
          <div class="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center mb-3"><i class="fas fa-ranking-star text-navy-600"></i></div>
          <h3 class="font-bold text-gray-900 mb-2">Check Department Scorecards</h3>
          <p class="text-sm text-gray-600">Compare official resolution rates vs. citizen-reported rates. Spot fake closure anomalies instantly.</p>
        </div>
        <div class="bg-white rounded-2xl p-6 border border-gray-200 card-hover" data-animate>
          <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-3"><i class="fas fa-fire text-red-600"></i></div>
          <h3 class="font-bold text-gray-900 mb-2">Monitor Trending Issues</h3>
          <p class="text-sm text-gray-600">Discover complaint spikes 3-4 weeks before official data. Perfect for investigative leads.</p>
        </div>
        <div class="bg-white rounded-2xl p-6 border border-gray-200 card-hover" data-animate>
          <div class="w-10 h-10 bg-saffron-100 rounded-xl flex items-center justify-center mb-3"><i class="fas fa-file-pdf text-saffron-600"></i></div>
          <h3 class="font-bold text-gray-900 mb-2">Download Reports</h3>
          <p class="text-sm text-gray-600">Export state-level and ministry-level data for your stories and research papers.</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center bg-navy-50 rounded-2xl p-8 border border-navy-200" data-animate>
        <h3 class="text-xl font-bold text-navy-800 mb-3">Ready to Get Started?</h3>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="/complaint" class="bg-saffron-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-saffron-600"><i class="fas fa-pen-to-square mr-2"></i>File a Complaint</a>
          <a href="/dashboard" class="bg-navy-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy-700"><i class="fas fa-chart-line mr-2"></i>View Dashboard</a>
        </div>
      </div>
    </div>
  </section>
  `
  return layout('How It Works', content, 'how-it-works', {
    description: 'Learn how GrievanceIQ uses AI to analyze complaints, route to departments, track progress, and generate RTI applications for Indian citizens.',
    keywords: 'how GrievanceIQ works, complaint analysis, AI routing, complaint tracking, RTI generation'
  })
}
