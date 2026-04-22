import { layout } from './layout'

export function homePage(): string {
  const content = `
  <!-- ============================================ -->
  <!-- HERO SECTION -->
  <!-- ============================================ -->
  <section class="hero-gradient relative overflow-hidden">
    <!-- Animated background pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-20 left-10 w-72 h-72 bg-saffron-500 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-ashoka-500 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
      <div class="text-center max-w-4xl mx-auto">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
          <span class="w-2 h-2 rounded-full bg-ashoka-400 pulse-dot"></span>
          <span class="text-white/80 text-xs font-medium tracking-wide">INDIA'S CITIZEN GRIEVANCE INTELLIGENCE PLATFORM</span>
        </div>
        
        <!-- Headline -->
        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 animate-fade-in">
          File <span class="text-saffron-400">Smarter.</span><br>
          Get <span class="text-white">Heard.</span><br>
          Hold Them <span class="text-ashoka-400">Accountable.</span>
        </h1>
        
        <!-- Subtitle -->
        <p class="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
          Type your problem in plain language. Our AI identifies the right department, 
          strengthens your complaint, and gives you the tools to follow up — including auto-drafted RTI applications.
        </p>
        
        <!-- COMPLAINT INPUT BOX — The core product -->
        <div class="max-w-2xl mx-auto mb-8 animate-fade-in">
          <form id="heroComplaintForm" class="relative">
            <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <!-- Language selector -->
              <div class="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <i class="fas fa-language text-saffron-500"></i>
                  <span>Type in any language</span>
                </div>
                <select id="languageSelect" class="text-xs bg-transparent border border-gray-200 rounded-md px-2 py-1 text-gray-600 focus:outline-none focus:border-saffron-400">
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                </select>
              </div>
              
              <!-- Text input -->
              <textarea 
                id="complaintText" 
                rows="4" 
                placeholder="Describe your problem here... e.g., 'My PM-KISAN payment has not come for 3 months despite completing eKYC verification'"
                class="w-full px-5 py-4 text-gray-800 text-base placeholder-gray-400 resize-none focus:outline-none leading-relaxed"
              ></textarea>
              
              <!-- Actions -->
              <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div class="flex items-center gap-3">
                  <span class="text-xs text-gray-400" id="charCount">0 characters</span>
                  <span class="text-xs text-gray-300">|</span>
                  <span class="text-xs text-gray-400"><i class="fas fa-shield-halved mr-1"></i> Private & secure</span>
                </div>
                <button type="submit" id="analyzeBtn" class="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-saffron-600 hover:to-saffron-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  <i class="fas fa-bolt"></i>
                  Analyze My Complaint
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Trust indicators -->
        <div class="flex flex-wrap justify-center gap-6 text-white/60 text-xs animate-fade-in">
          <span><i class="fas fa-check-circle text-ashoka-400 mr-1"></i> 92 ministries covered</span>
          <span><i class="fas fa-check-circle text-ashoka-400 mr-1"></i> 5 languages supported</span>
          <span><i class="fas fa-check-circle text-ashoka-400 mr-1"></i> Free to use</span>
          <span><i class="fas fa-check-circle text-ashoka-400 mr-1"></i> No login required</span>
        </div>
      </div>
    </div>
    
    <!-- Wave divider -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 40C1248 36.7 1344 33.3 1392 31.7L1440 30V60H0Z" fill="#f9fafb"/>
      </svg>
    </div>
  </section>

  <!-- ============================================ -->
  <!-- LIVE STATS BAR -->
  <!-- ============================================ -->
  <section class="bg-gray-50 py-8 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="statsBar">
        <div class="text-center p-4 stat-glow rounded-xl bg-white shadow-sm" data-animate>
          <div class="text-2xl sm:text-3xl font-black text-navy-700" data-count-target="475000" id="stat-complaints">0</div>
          <div class="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">Complaints Tracked</div>
        </div>
        <div class="text-center p-4 stat-glow rounded-xl bg-white shadow-sm" data-animate>
          <div class="text-2xl sm:text-3xl font-black text-saffron-600" id="stat-ministries">92</div>
          <div class="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">Ministries Monitored</div>
        </div>
        <div class="text-center p-4 stat-glow rounded-xl bg-white shadow-sm" data-animate>
          <div class="text-2xl sm:text-3xl font-black text-red-600" id="stat-fake-closure">31%</div>
          <div class="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">Avg Fake Closure Rate</div>
        </div>
        <div class="text-center p-4 stat-glow rounded-xl bg-white shadow-sm" data-animate>
          <div class="text-2xl sm:text-3xl font-black text-ashoka-600" data-count-target="36" id="stat-states">0</div>
          <div class="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">States & UTs Covered</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================ -->
  <!-- THE PROBLEM — Why this exists -->
  <!-- ============================================ -->
  <section class="py-16 sm:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16" data-animate>
        <span class="inline-flex items-center gap-1.5 bg-red-50 text-red-700 rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
          <i class="fas fa-triangle-exclamation"></i> THE PROBLEM
        </span>
        <h2 class="text-3xl sm:text-4xl font-bold text-navy-800">India's Grievance System is Broken</h2>
        <p class="text-gray-500 mt-3 max-w-2xl mx-auto">CPGRAMS connects 92 ministries and has processed 70+ lakh complaints. On paper it works. In reality, three things are broken.</p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
        <!-- Problem 1 -->
        <div class="card-hover bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border border-red-100" data-animate>
          <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-5">
            <i class="fas fa-shuffle text-red-600 text-xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-3">Misrouting</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Citizens must choose from <strong>92 ministry dropdowns</strong> with zero guidance. 
            Most pick wrong. The complaint bounces between departments for weeks and eventually dies without resolution.
          </p>
          <div class="mt-4 p-3 bg-red-50/50 rounded-lg">
            <span class="text-xs font-bold text-red-800">Impact:</span>
            <span class="text-xs text-red-700"> ~40% of complaints misrouted on first attempt</span>
          </div>
        </div>
        
        <!-- Problem 2 -->
        <div class="card-hover bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 border border-amber-100" data-animate>
          <div class="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-5">
            <i class="fas fa-mask text-amber-600 text-xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-3">Fake Closures</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Officers mark complaints <strong>"resolved"</strong> to hit performance targets. 
            The citizen's actual problem remains unsolved. No system cross-checks whether the problem was actually fixed.
          </p>
          <div class="mt-4 p-3 bg-amber-50/50 rounded-lg">
            <span class="text-xs font-bold text-amber-800">Impact:</span>
            <span class="text-xs text-amber-700"> Up to 45% fake closure rate in some departments</span>
          </div>
        </div>
        
        <!-- Problem 3 -->
        <div class="card-hover bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100" data-animate>
          <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-5">
            <i class="fas fa-eye-slash text-purple-600 text-xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-3">No Pattern Intelligence</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            When <strong>50,000 citizens</strong> complain about the same PM-KISAN failure, 
            the system handles each as a separate ticket. No alarm goes off. No systemic flag is raised.
          </p>
          <div class="mt-4 p-3 bg-purple-50/50 rounded-lg">
            <span class="text-xs font-bold text-purple-800">Impact:</span>
            <span class="text-xs text-purple-700"> Root causes go unfixed for months</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================ -->
  <!-- THE SOLUTION — What we do -->
  <!-- ============================================ -->
  <section class="py-16 sm:py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16" data-animate>
        <span class="inline-flex items-center gap-1.5 bg-ashoka-50 text-ashoka-700 rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
          <i class="fas fa-lightbulb"></i> THE SOLUTION
        </span>
        <h2 class="text-3xl sm:text-4xl font-bold text-navy-800">Two Products. One Mission.</h2>
        <p class="text-gray-500 mt-3 max-w-2xl mx-auto">GrievanceIQ builds the intelligence layer between citizens and the government's complaint inbox.</p>
      </div>
      
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Product 1: Citizen Tool -->
        <div class="card-hover bg-white rounded-2xl border border-gray-200 overflow-hidden" data-animate>
          <div class="bg-gradient-to-r from-saffron-500 to-saffron-600 px-8 py-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <i class="fas fa-user-shield text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">Citizen Complaint Intelligence</h3>
                <p class="text-saffron-100 text-sm">For every Indian citizen</p>
              </div>
            </div>
          </div>
          <div class="p-8">
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-saffron-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fas fa-brain text-saffron-600 text-xs"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-sm text-gray-900">Smart Department Router</h4>
                  <p class="text-xs text-gray-500">AI identifies the correct ministry from 92 options with confidence scores</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-saffron-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fas fa-chart-simple text-saffron-600 text-xs"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-sm text-gray-900">Complaint Quality Scorer</h4>
                  <p class="text-xs text-gray-500">Scores your complaint 1-10 and tells you exactly what's missing</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-saffron-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fas fa-wand-magic-sparkles text-saffron-600 text-xs"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-sm text-gray-900">AI Complaint Builder</h4>
                  <p class="text-xs text-gray-500">Side-by-side editor rewrites your complaint with all required details</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-saffron-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fas fa-file-lines text-saffron-600 text-xs"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-sm text-gray-900">RTI Auto-Drafter</h4>
                  <p class="text-xs text-gray-500">One-click legally formatted RTI if your complaint is ignored past 30 days</p>
                </div>
              </div>
            </div>
            <a href="/complaint" class="mt-6 inline-flex items-center gap-2 bg-saffron-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-saffron-600 transition-colors">
              Start Filing <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
        
        <!-- Product 2: Dashboard -->
        <div class="card-hover bg-white rounded-2xl border border-gray-200 overflow-hidden" data-animate>
          <div class="bg-gradient-to-r from-navy-600 to-navy-800 px-8 py-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <i class="fas fa-chart-line text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">Public Accountability Dashboard</h3>
                <p class="text-navy-200 text-sm">For journalists, NGOs, researchers</p>
              </div>
            </div>
          </div>
          <div class="p-8">
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fas fa-map-location-dot text-navy-600 text-xs"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-sm text-gray-900">India Grievance Map</h4>
                  <p class="text-xs text-gray-500">Interactive choropleth map showing grievance density across all states</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fas fa-ranking-star text-navy-600 text-xs"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-sm text-gray-900">Department Scorecard</h4>
                  <p class="text-xs text-gray-500">Ministries ranked by resolution rate, speed, and fake closure rate</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fas fa-radar text-navy-600 text-xs"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-sm text-gray-900">Systemic Issue Radar</h4>
                  <p class="text-xs text-gray-500">Surfaces complaint clusters spiking before official data reflects them</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i class="fas fa-bolt text-navy-600 text-xs"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-sm text-gray-900">Fake Closure Detector</h4>
                  <p class="text-xs text-gray-500">Flags departments where official "resolved" doesn't match citizen reality</p>
                </div>
              </div>
            </div>
            <a href="/dashboard" class="mt-6 inline-flex items-center gap-2 bg-navy-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-700 transition-colors">
              View Dashboard <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- ============================================ -->
  <!-- AI CIVIC INFRASTRUCTURE — Technical Pitch -->
  <!-- ============================================ -->
  <section class="py-16 sm:py-24 bg-navy-900 relative overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div data-animate>
          <span class="inline-flex items-center gap-1.5 bg-saffron-500/20 text-saffron-400 rounded-full px-4 py-1.5 text-xs font-semibold mb-4 border border-saffron-500/30">
            <i class="fas fa-microchip"></i> TECHNICAL ARCHITECTURE
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">Built as AI Civic Infrastructure</h2>
          <p class="text-gray-300 text-lg leading-relaxed mb-8">
            "Our platform is <strong>AI Civic Infrastructure</strong> because it uses machine learning at every step of the pipeline. 
            We use NLP (MuRIL/Gemini) to route the complaint to the right department, an LLM (Gemini) to structure the legal text, 
            and unsupervised ML clustering (TF-IDF) to detect systemic failures across thousands of tickets."
          </p>
          <p class="text-ashoka-400 font-medium text-lg italic">
            "We aren't replacing the government; we are using AI to translate citizen frustration into data the government can actually process."
          </p>
        </div>
        
        <div class="grid sm:grid-cols-2 gap-4" data-animate>
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div class="text-saffron-400 text-2xl mb-3"><i class="fas fa-diagram-project"></i></div>
            <h4 class="text-white font-bold mb-2">Multilingual NLP</h4>
            <p class="text-xs text-gray-400">Processing Hindi, Tamil, Telugu, and more using state-of-the-art cross-lingual embeddings for 92-department routing.</p>
          </div>
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div class="text-ashoka-400 text-2xl mb-3"><i class="fas fa-gavel"></i></div>
            <h4 class="text-white font-bold mb-2">Legal LLMs</h4>
            <p class="text-xs text-gray-400">Context-aware drafting of RTI applications and complaint improvements following Indian legal frameworks.</p>
          </div>
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div class="text-blue-400 text-2xl mb-3"><i class="fas fa-objects-column"></i></div>
            <h4 class="text-white font-bold mb-2">ML Clustering</h4>
            <p class="text-xs text-gray-400">TF-IDF based vectorization to identify emerging complaint clusters and systemic service failures in real-time.</p>
          </div>
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div class="text-purple-400 text-2xl mb-3"><i class="fas fa-database"></i></div>
            <h4 class="text-white font-bold mb-2">Pipeline Integrity</h4>
            <p class="text-xs text-gray-400">Hybrid architecture combining D1 Edge Database with nightly NLP aggregation on Render.</p>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- ============================================ -->
  <!-- HOW IT WORKS — Quick flow -->
  <!-- ============================================ -->
  <section class="py-16 sm:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16" data-animate>
        <span class="inline-flex items-center gap-1.5 bg-navy-50 text-navy-700 rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
          <i class="fas fa-route"></i> HOW IT WORKS
        </span>
        <h2 class="text-3xl sm:text-4xl font-bold text-navy-800">From Problem to Resolution in 4 Steps</h2>
      </div>
      
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="text-center p-6" data-animate>
          <div class="w-16 h-16 bg-gradient-to-br from-saffron-400 to-saffron-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i class="fas fa-keyboard text-white text-xl"></i>
          </div>
          <div class="w-8 h-8 bg-saffron-100 rounded-full flex items-center justify-center mx-auto -mt-6 mb-3 text-sm font-bold text-saffron-700 border-2 border-white shadow">1</div>
          <h4 class="font-bold text-gray-900 mb-2">Type Your Problem</h4>
          <p class="text-sm text-gray-500">Write in plain language in Hindi, English, Tamil, Telugu, or Bengali. No forms, no jargon.</p>
        </div>
        
        <div class="text-center p-6" data-animate>
          <div class="w-16 h-16 bg-gradient-to-br from-navy-500 to-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i class="fas fa-brain text-white text-xl"></i>
          </div>
          <div class="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center mx-auto -mt-6 mb-3 text-sm font-bold text-navy-700 border-2 border-white shadow">2</div>
          <h4 class="font-bold text-gray-900 mb-2">AI Analyzes</h4>
          <p class="text-sm text-gray-500">Routes to the correct department, scores quality, identifies missing details, and rewrites your complaint.</p>
        </div>
        
        <div class="text-center p-6" data-animate>
          <div class="w-16 h-16 bg-gradient-to-br from-ashoka-500 to-ashoka-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i class="fas fa-paper-plane text-white text-xl"></i>
          </div>
          <div class="w-8 h-8 bg-ashoka-100 rounded-full flex items-center justify-center mx-auto -mt-6 mb-3 text-sm font-bold text-ashoka-700 border-2 border-white shadow">3</div>
          <h4 class="font-bold text-gray-900 mb-2">File on CPGRAMS</h4>
          <p class="text-sm text-gray-500">Copy your improved complaint and file it on the government portal. We give you the document checklist too.</p>
        </div>
        
        <div class="text-center p-6" data-animate>
          <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i class="fas fa-bell text-white text-xl"></i>
          </div>
          <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto -mt-6 mb-3 text-sm font-bold text-purple-700 border-2 border-white shadow">4</div>
          <h4 class="font-bold text-gray-900 mb-2">Track & Escalate</h4>
          <p class="text-sm text-gray-500">Get reminders, report outcomes, and auto-generate RTI applications if your complaint is ignored.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================ -->
  <!-- TRENDING ISSUES PREVIEW -->
  <!-- ============================================ -->
  <section class="py-16 sm:py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4" data-animate>
        <div>
          <span class="inline-flex items-center gap-1.5 bg-red-50 text-red-700 rounded-full px-3 py-1 text-xs font-semibold mb-2">
            <span class="w-2 h-2 rounded-full bg-red-500 pulse-dot"></span> LIVE ALERTS
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold text-navy-800">Systemic Issues This Week</h2>
        </div>
        <a href="/dashboard#trending" class="text-sm text-saffron-600 font-semibold hover:text-saffron-700">
          View all on Dashboard <i class="fas fa-arrow-right ml-1"></i>
        </a>
      </div>
      
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" id="trendingPreview">
        <!-- Populated by JS -->
      </div>
    </div>
  </section>

  <!-- ============================================ -->
  <!-- CTA SECTION -->
  <!-- ============================================ -->
  <section class="py-16 sm:py-24 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="hero-gradient rounded-3xl p-10 sm:p-16 relative overflow-hidden" data-animate>
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-10 right-10 w-40 h-40 bg-saffron-500 rounded-full blur-3xl"></div>
          <div class="absolute bottom-10 left-10 w-56 h-56 bg-ashoka-500 rounded-full blur-3xl"></div>
        </div>
        <div class="relative z-10">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to File a Smarter Complaint?</h2>
          <p class="text-gray-300 mb-8 max-w-lg mx-auto">
            Join thousands of citizens who are using GrievanceIQ to navigate India's grievance system effectively.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/complaint" class="bg-saffron-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-saffron-600 transition-colors shadow-lg text-lg">
              <i class="fas fa-pen-to-square mr-2"></i>File a Complaint
            </a>
            <a href="/dashboard" class="bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-colors text-lg">
              <i class="fas fa-chart-line mr-2"></i>View Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <script>
    // Character counter
    const textarea = document.getElementById('complaintText');
    const charCount = document.getElementById('charCount');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = len + ' characters';
      analyzeBtn.disabled = len < 10;
    });
    
    // Hero form submission
    document.getElementById('heroComplaintForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const text = textarea.value.trim();
      if (text.length < 10) return;
      // Redirect to complaint page with text
      const lang = document.getElementById('languageSelect').value;
      window.location.href = '/complaint?text=' + encodeURIComponent(text) + '&lang=' + lang;
    });
    
    // Load trending issues
    async function loadTrending() {
      try {
        const res = await fetch('/api/trending?flagged=true');
        const json = await res.json();
        if (!json.success) return;
        
        const container = document.getElementById('trendingPreview');
        const issues = json.data.slice(0, 3);
        
        container.innerHTML = issues.map(issue => {
          const severityColors = {
            critical: 'badge-critical',
            high: 'badge-high',
            medium: 'badge-medium',
            low: 'badge-low'
          };
          const severityIcons = {
            critical: 'fa-circle-exclamation',
            high: 'fa-triangle-exclamation',
            medium: 'fa-circle-info',
            low: 'fa-circle-check'
          };
          const states = JSON.parse(issue.states_affected || '[]');
          const keywords = JSON.parse(issue.topic_keywords || '[]');
          
          return \`
            <div class="card-hover bg-white rounded-2xl border border-gray-200 p-6">
              <div class="flex items-start justify-between mb-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold \${severityColors[issue.severity]}">
                  <i class="fas \${severityIcons[issue.severity]} mr-1"></i>
                  \${issue.severity.toUpperCase()}
                </span>
                <span class="text-xs text-gray-400 font-medium">
                  <i class="fas fa-arrow-trend-up text-red-500 mr-1"></i>\${issue.spike_factor}x spike
                </span>
              </div>
              <h3 class="font-bold text-gray-900 mb-2">\${issue.topic_name}</h3>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">\${issue.description}</p>
              <div class="flex items-center gap-2 flex-wrap mb-3">
                \${states.slice(0, 3).map(s => \`<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">\${s}</span>\`).join('')}
                \${states.length > 3 ? \`<span class="text-xs text-gray-400">+\${states.length - 3} more</span>\` : ''}
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <span class="text-xs text-gray-500">
                  <i class="fas fa-ticket mr-1"></i>\${issue.complaint_count.toLocaleString()} complaints
                </span>
                <span class="text-xs text-gray-400">\${issue.week_start}</span>
              </div>
            </div>
          \`;
        }).join('');
      } catch (e) {
        console.error('Failed to load trending:', e);
      }
    }
    
    // Load stats from API
    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        const json = await res.json();
        if (json.success) {
          const d = json.data;
          document.getElementById('stat-fake-closure').textContent = d.avg_fake_closure_rate + '%';
        }
      } catch (e) { console.error('Stats error:', e); }
    }
    
    // Init
    loadTrending();
    loadStats();
  </script>
  `
  return layout('Home', content, 'home', {
    description: 'File Smarter. Get Heard. Hold Them Accountable. GrievanceIQ uses AI to help Indian citizens file effective CPGRAMS complaints, track progress, and generate RTI applications.',
    keywords: 'GrievanceIQ, CPGRAMS, India grievance, AI complaint, RTI generator, citizen rights, government accountability',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'GrievanceIQ',
      applicationCategory: 'GovernmentApplication',
      operatingSystem: 'Web',
      description: 'AI-powered citizen grievance intelligence platform for India',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }
    }
  })
}
