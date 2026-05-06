import { layout } from './layout'

export function complaintPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-800 to-navy-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
        <i class="fas fa-pen-to-square text-saffron-400 mr-2"></i><span data-i18n="complaint_title">Smart Complaint Builder</span>
      </h1>
      <p class="text-gray-300 text-sm" data-i18n="complaint_subtitle">Type your problem in any language. Our AI identifies the right department, scores your complaint, and rewrites it for maximum impact.</p>
    </div>
  </section>

  <section class="py-8 sm:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- WIZARD PROGRESS BAR — 7 Steps -->
      <div class="max-w-4xl mx-auto mb-8">
        <div class="flex items-center justify-between relative" id="wizardProgress">
          <div class="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"><div class="h-full bg-saffron-500 transition-all duration-500" id="progressLine" style="width:0%"></div></div>
          <div class="wizard-step active flex flex-col items-center z-10" data-step="1">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-saffron-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg" id="stepCircle1">1</div>
            <span class="text-[9px] sm:text-[10px] font-semibold text-saffron-600 mt-1" id="stepLabel1">Write</span>
          </div>
          <div class="wizard-step flex flex-col items-center z-10" data-step="2">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-xs sm:text-sm" id="stepCircle2">2</div>
            <span class="text-[9px] sm:text-[10px] font-semibold text-gray-400 mt-1" id="stepLabel2">Validate</span>
          </div>
          <div class="wizard-step flex flex-col items-center z-10" data-step="3">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-xs sm:text-sm" id="stepCircle3">3</div>
            <span class="text-[9px] sm:text-[10px] font-semibold text-gray-400 mt-1" id="stepLabel3">Analyze</span>
          </div>
          <div class="wizard-step flex flex-col items-center z-10" data-step="4">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-xs sm:text-sm" id="stepCircle4">4</div>
            <span class="text-[9px] sm:text-[10px] font-semibold text-gray-400 mt-1" id="stepLabel4">Route</span>
          </div>
          <div class="wizard-step flex flex-col items-center z-10" data-step="5">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-xs sm:text-sm" id="stepCircle5">5</div>
            <span class="text-[9px] sm:text-[10px] font-semibold text-gray-400 mt-1" id="stepLabel5">Improve</span>
          </div>
          <div class="wizard-step flex flex-col items-center z-10" data-step="6">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-xs sm:text-sm" id="stepCircle6">6</div>
            <span class="text-[9px] sm:text-[10px] font-semibold text-gray-400 mt-1" id="stepLabel6">Docs</span>
          </div>
          <div class="wizard-step flex flex-col items-center z-10" data-step="7">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-xs sm:text-sm" id="stepCircle7">7</div>
            <span class="text-[9px] sm:text-[10px] font-semibold text-gray-400 mt-1" id="stepLabel7">File</span>
          </div>
        </div>
      </div>

      <!-- STEP 1: INPUT -->
      <div class="max-w-3xl mx-auto mb-8" id="inputSection">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100 gap-3">
            <h2 class="font-semibold text-gray-700 text-sm"><i class="fas fa-keyboard mr-2 text-saffron-500"></i><span data-i18n="step1_title">Step 1: Describe Your Problem</span></h2>
            <div class="flex items-center gap-2">
              <select id="stateSelect" class="text-sm bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-saffron-400 max-w-[140px] truncate">
                <option value="">Select State (Optional)</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Delhi">Delhi</option>
                <option value="Jammu & Kashmir">Jammu & Kashmir</option>
              </select>
              <select id="langSelect" class="text-sm bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-saffron-400">
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>
          </div>
          <textarea id="complaintInput" rows="6" placeholder="Write your complaint in plain language...&#10;&#10;Example: My PM-KISAN payment has not come for 3 months. I have done eKYC in November 2025 but still showing payment failed on the portal. My Aadhaar is linked to my State Bank account." class="w-full px-5 py-4 text-gray-800 placeholder-gray-400 resize-none focus:outline-none text-base leading-relaxed"></textarea>
          
          <!-- Real-time Validation Panel (Step 2 preview) -->
          <div id="validationPanel" class="hidden px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
            <p class="text-xs font-semibold text-blue-700 mb-2"><i class="fas fa-shield-check mr-1"></i>Real-time Validation — Strengthening your complaint as you type:</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" id="validationChecks">
              <div class="flex items-center gap-1.5" id="v-length"><span class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center text-[8px]" id="v-length-icon">—</span><span class="text-[10px] text-gray-500">Min. 30 words</span></div>
              <div class="flex items-center gap-1.5" id="v-dates"><span class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center text-[8px]" id="v-dates-icon">—</span><span class="text-[10px] text-gray-500">Has dates</span></div>
              <div class="flex items-center gap-1.5" id="v-refs"><span class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center text-[8px]" id="v-refs-icon">—</span><span class="text-[10px] text-gray-500">Reference numbers</span></div>
              <div class="flex items-center gap-1.5" id="v-location"><span class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center text-[8px]" id="v-location-icon">—</span><span class="text-[10px] text-gray-500">Location details</span></div>
              <div class="flex items-center gap-1.5" id="v-amount"><span class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center text-[8px]" id="v-amount-icon">—</span><span class="text-[10px] text-gray-500">Financial amounts</span></div>
              <div class="flex items-center gap-1.5" id="v-scheme"><span class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center text-[8px]" id="v-scheme-icon">—</span><span class="text-[10px] text-gray-500">Scheme/law name</span></div>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <div class="flex-1 bg-gray-200 rounded-full h-1.5"><div class="h-full bg-gradient-to-r from-red-400 via-saffron-400 to-ashoka-500 rounded-full transition-all duration-300" id="validationBar" style="width:0%"></div></div>
              <span class="text-[10px] font-bold text-gray-500" id="validationScore">0/6</span>
            </div>
          </div>

          <!-- Template Library (Feature #1) -->
          <div class="px-5 py-4 bg-gradient-to-r from-saffron-50 to-amber-50 border-t border-saffron-100">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs text-saffron-700 font-bold"><i class="fas fa-book-open mr-1"></i>Template Library — Pick your issue, get a perfect complaint in 90 seconds</p>
              <button onclick="document.getElementById('templateGrid').classList.toggle('hidden')" class="text-[10px] text-saffron-600 hover:underline font-medium">Show/Hide</button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2" id="templateGrid">
              <button onclick="useFullTemplate('pm-kisan')" class="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-saffron-200 hover:border-saffron-400 hover:shadow-md transition-all text-center group">
                <span class="text-2xl group-hover:scale-110 transition-transform">🌾</span>
                <span class="text-[11px] font-semibold text-gray-700 leading-tight">PM-KISAN Payment</span>
                <span class="text-[9px] text-gray-400">Agriculture</span>
              </button>
              <button onclick="useFullTemplate('epf-withdrawal')" class="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-saffron-200 hover:border-saffron-400 hover:shadow-md transition-all text-center group">
                <span class="text-2xl group-hover:scale-110 transition-transform">💼</span>
                <span class="text-[11px] font-semibold text-gray-700 leading-tight">EPF/PF Withdrawal</span>
                <span class="text-[9px] text-gray-400">Labour</span>
              </button>
              <button onclick="useFullTemplate('ration-card')" class="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-saffron-200 hover:border-saffron-400 hover:shadow-md transition-all text-center group">
                <span class="text-2xl group-hover:scale-110 transition-transform">🍚</span>
                <span class="text-[11px] font-semibold text-gray-700 leading-tight">Ration Card</span>
                <span class="text-[9px] text-gray-400">Food & PDS</span>
              </button>
              <button onclick="useFullTemplate('passport-delay')" class="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-saffron-200 hover:border-saffron-400 hover:shadow-md transition-all text-center group">
                <span class="text-2xl group-hover:scale-110 transition-transform">🛂</span>
                <span class="text-[11px] font-semibold text-gray-700 leading-tight">Passport Delay</span>
                <span class="text-[9px] text-gray-400">External Affairs</span>
              </button>
              <button onclick="useFullTemplate('pension-delay')" class="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-saffron-200 hover:border-saffron-400 hover:shadow-md transition-all text-center group">
                <span class="text-2xl group-hover:scale-110 transition-transform">👴</span>
                <span class="text-[11px] font-semibold text-gray-700 leading-tight">Pension Delay</span>
                <span class="text-[9px] text-gray-400">Personnel</span>
              </button>
              <button onclick="useFullTemplate('electricity-billing')" class="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-saffron-200 hover:border-saffron-400 hover:shadow-md transition-all text-center group">
                <span class="text-2xl group-hover:scale-110 transition-transform">⚡</span>
                <span class="text-[11px] font-semibold text-gray-700 leading-tight">Electricity Bill</span>
                <span class="text-[9px] text-gray-400">Power</span>
              </button>
              <button onclick="useFullTemplate('railway-refund')" class="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-saffron-200 hover:border-saffron-400 hover:shadow-md transition-all text-center group">
                <span class="text-2xl group-hover:scale-110 transition-transform">🚂</span>
                <span class="text-[11px] font-semibold text-gray-700 leading-tight">Railway Refund</span>
                <span class="text-[9px] text-gray-400">Railways</span>
              </button>
              <button onclick="useFullTemplate('income-tax-refund')" class="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-saffron-200 hover:border-saffron-400 hover:shadow-md transition-all text-center group">
                <span class="text-2xl group-hover:scale-110 transition-transform">💰</span>
                <span class="text-[11px] font-semibold text-gray-700 leading-tight">IT Refund</span>
                <span class="text-[9px] text-gray-400">Finance</span>
              </button>
            </div>
          </div>

          <!-- Voice Input UI (Week 7) -->
          <div class="px-5 py-3 border-t border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
            <div class="flex items-center gap-3">
              <button onclick="toggleVoiceInput()" id="voiceBtn" class="flex items-center gap-2 text-xs bg-white border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors">
                <i class="fas fa-microphone" id="voiceIcon"></i>
                <span id="voiceLabel">Voice Input</span>
              </button>
              <span class="text-[10px] text-gray-400" id="voiceStatus">Click to speak your complaint</span>
              <div class="hidden flex items-center gap-1 ml-2" id="voiceWave">
                <span class="w-1 h-3 bg-purple-500 rounded-full animate-pulse"></span>
                <span class="w-1 h-4 bg-purple-400 rounded-full animate-pulse" style="animation-delay:0.1s"></span>
                <span class="w-1 h-5 bg-purple-600 rounded-full animate-pulse" style="animation-delay:0.2s"></span>
                <span class="w-1 h-3 bg-purple-400 rounded-full animate-pulse" style="animation-delay:0.3s"></span>
                <span class="w-1 h-4 bg-purple-500 rounded-full animate-pulse" style="animation-delay:0.4s"></span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-400" id="inputCharCount">0 characters</span>
              <span class="text-xs text-gray-300">|</span>
              <span class="text-xs text-gray-400"><i class="fas fa-shield-halved mr-1"></i>Private & secure</span>
            </div>
            <button onclick="analyzeComplaint()" id="analyzeButton" class="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-saffron-600 hover:to-saffron-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50" disabled>
              <i class="fas fa-bolt" id="analyzeBtnIcon"></i>
              <span id="analyzeBtnText" data-i18n="analyze_btn">Analyze My Complaint</span>
            </button>
          </div>
        </div>
      </div>

      <!-- STEP 3: LOADING / ANALYZING -->
      <div class="max-w-3xl mx-auto hidden" id="loadingSection">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 text-center">
          <div class="spinner mx-auto mb-4" style="width:40px;height:40px;border-width:4px;"></div>
          <h3 class="font-bold text-gray-800 mb-2">AI Analyzing Your Complaint...</h3>
          <div class="space-y-2 text-sm text-gray-500" id="loadingSteps">
            <p id="lstep1" class="flex items-center justify-center gap-2"><span class="spinner" style="width:16px;height:16px;"></span> Detecting language...</p>
            <p id="lstep2" class="flex items-center justify-center gap-2 text-gray-300"><i class="fas fa-clock"></i> Classifying department (92 ministries)...</p>
            <p id="lstep3" class="flex items-center justify-center gap-2 text-gray-300"><i class="fas fa-clock"></i> Scoring complaint quality...</p>
            <p id="lstep4" class="flex items-center justify-center gap-2 text-gray-300"><i class="fas fa-clock"></i> Generating improved draft & checklist...</p>
          </div>
        </div>
      </div>

      <!-- STEP 4-7: RESULTS -->
      <div class="hidden" id="resultsSection">
        
        <!-- AI Source Badge -->
        <div class="max-w-4xl mx-auto mb-4" id="aiSourceBadge"></div>

        <!-- Step 4: Department Routing -->
        <div class="max-w-4xl mx-auto mb-6" data-animate>
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-navy-600 to-navy-700 flex items-center gap-2">
              <i class="fas fa-building-columns text-white"></i>
              <h2 class="font-bold text-white">Step 4: Department Routing</h2>
              <span class="ml-auto text-xs text-navy-200" id="routingSubtext">AI-powered classification</span>
            </div>
            <div class="p-6" id="departmentResults"></div>
          </div>
        </div>

        <!-- Quality Score + Missing Elements -->
        <div class="max-w-4xl mx-auto mb-6 grid md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" data-animate>
            <div class="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center gap-2">
              <i class="fas fa-star text-white"></i>
              <h2 class="font-bold text-white">Quality Score</h2>
            </div>
            <div class="p-6" id="qualityResults"></div>
          </div>
          
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" data-animate>
            <div class="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 flex items-center gap-2">
              <i class="fas fa-triangle-exclamation text-white"></i>
              <h2 class="font-bold text-white">Missing Elements</h2>
            </div>
            <div class="p-6" id="missingResults"></div>
          </div>
        </div>

        <!-- Translation -->
        <div class="max-w-4xl mx-auto mb-6 hidden" id="translationSection" data-animate>
          <div class="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <div class="flex items-center gap-2 mb-2">
              <i class="fas fa-language text-blue-600"></i>
              <h3 class="font-semibold text-blue-800 text-sm">Translation</h3>
              <span class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full" id="detectedLang"></span>
            </div>
            <p class="text-sm text-blue-700" id="translatedTextContent"></p>
          </div>
        </div>

        <!-- Step 5: Side-by-Side Editor -->
        <div class="max-w-5xl mx-auto mb-6" data-animate>
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-ashoka-600 to-ashoka-700 flex items-center gap-2">
              <i class="fas fa-wand-magic-sparkles text-white"></i>
              <h2 class="font-bold text-white">Step 5: AI Complaint Builder — Side by Side</h2>
              <span class="ml-auto text-xs text-ashoka-200">Editable — modify before filing</span>
            </div>
            <div class="grid md:grid-cols-2 divide-x divide-gray-200">
              <div class="p-5">
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-3 h-3 rounded-full bg-red-400"></span>
                  <span class="text-sm font-semibold text-gray-500">YOUR ORIGINAL</span>
                  <span class="ml-auto text-xs text-gray-400" id="originalScore"></span>
                </div>
                <div id="originalText" class="text-sm text-gray-700 bg-red-50/50 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap leading-relaxed"></div>
              </div>
              <div class="p-5">
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-3 h-3 rounded-full bg-ashoka-500"></span>
                  <span class="text-sm font-semibold text-gray-500">AI IMPROVED</span>
                  <span class="ml-auto text-xs text-ashoka-600" id="improvedScore"></span>
                  <button onclick="copyImproved()" class="text-xs text-saffron-600 hover:text-saffron-700 font-medium ml-2"><i class="fas fa-copy mr-1"></i>Copy</button>
                </div>
                <textarea id="improvedText" class="text-sm text-gray-700 bg-ashoka-50/50 rounded-lg p-4 min-h-[200px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-ashoka-300 resize-y leading-relaxed"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- NEW: Complaint Comparison Diff (Week 7) -->
        <div class="max-w-5xl mx-auto mb-6 hidden" id="diffSection" data-animate>
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-700 flex items-center gap-2">
              <i class="fas fa-code-compare text-white"></i>
              <h2 class="font-bold text-white">AI Improvement Diff</h2>
              <span class="ml-auto text-xs text-purple-200">Highlighted changes</span>
            </div>
            <div class="p-6" id="diffContent">
              <div class="prose prose-sm max-w-none" id="diffDisplay"></div>
            </div>
          </div>
        </div>

        <!-- NEW: Success Probability (Week 7) -->
        <div class="max-w-4xl mx-auto mb-6 hidden" id="successProbSection" data-animate>
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center gap-2">
              <i class="fas fa-chart-line text-white"></i>
              <h2 class="font-bold text-white">Success Probability</h2>
              <span class="ml-auto text-xs text-emerald-200" id="probRating"></span>
            </div>
            <div class="p-6" id="successProbContent">
              <div class="flex items-center gap-6">
                <div class="flex-shrink-0">
                  <div class="quality-gauge" style="--gauge-color:#22c55e;--gauge-percent:50%" id="probGauge">
                    <div class="quality-gauge-inner"><span class="text-2xl font-black text-emerald-600" id="probPercent">—</span><span class="text-xs text-gray-400">%</span></div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="mb-3 grid grid-cols-3 gap-2" id="probFactors"></div>
                  <div class="space-y-1" id="probTips"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- NEW: Similar Complaints (Week 7) -->
        <div class="max-w-4xl mx-auto mb-6 hidden" id="similarSection" data-animate>
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-sky-600 to-blue-700 flex items-center gap-2">
              <i class="fas fa-clone text-white"></i>
              <h2 class="font-bold text-white">Similar Complaints</h2>
              <span class="ml-auto text-xs text-blue-200">AI-suggested matches</span>
            </div>
            <div class="p-4" id="similarContent">
              <p class="text-xs text-gray-400 text-center">Loading...</p>
            </div>
          </div>
        </div>

        <!-- Step 6: Document Checklist -->
        <div class="max-w-4xl mx-auto mb-6" data-animate>
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center gap-2">
              <i class="fas fa-clipboard-check text-white"></i>
              <h2 class="font-bold text-white">Step 6: Document Checklist</h2>
              <span class="ml-auto text-xs text-purple-200">Attach these when filing on CPGRAMS</span>
            </div>
            <div class="p-6" id="checklistResults"></div>
            <div class="px-6 pb-4">
              <div class="bg-purple-50 rounded-xl p-3 flex items-center gap-2">
                <i class="fas fa-info-circle text-purple-500"></i>
                <p class="text-xs text-purple-700">Check off documents as you gather them. Attach scanned copies when filing on CPGRAMS portal.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 7: Next Steps / File -->
        <div class="max-w-4xl mx-auto mb-6" data-animate>
          <div class="bg-gradient-to-r from-saffron-50 to-ashoka-50 rounded-2xl border border-saffron-200 p-6">
            <h3 class="font-bold text-gray-900 mb-4"><i class="fas fa-arrow-right-from-bracket text-saffron-600 mr-2"></i>Step 7: File Your Complaint</h3>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white rounded-xl p-4 shadow-sm card-hover cursor-pointer" onclick="copyImproved()">
                <div class="w-8 h-8 bg-saffron-100 rounded-lg flex items-center justify-center mb-2">
                  <span class="text-sm font-bold text-saffron-700">1</span>
                </div>
                <h4 class="font-semibold text-sm mb-1">Copy Complaint</h4>
                <p class="text-xs text-gray-500">Review the AI draft, edit if needed, then copy</p>
              </div>
              <a href="https://pgportal.gov.in" target="_blank" class="bg-white rounded-xl p-4 shadow-sm card-hover">
                <div class="w-8 h-8 bg-saffron-100 rounded-lg flex items-center justify-center mb-2">
                  <span class="text-sm font-bold text-saffron-700">2</span>
                </div>
                <h4 class="font-semibold text-sm mb-1">File on CPGRAMS <i class="fas fa-external-link text-[10px] text-gray-400"></i></h4>
                <p class="text-xs text-gray-500">pgportal.gov.in — select the suggested department</p>
              </a>
              <a href="/tracker" class="bg-white rounded-xl p-4 shadow-sm card-hover">
                <div class="w-8 h-8 bg-saffron-100 rounded-lg flex items-center justify-center mb-2">
                  <span class="text-sm font-bold text-saffron-700">3</span>
                </div>
                <h4 class="font-semibold text-sm mb-1">Track Progress</h4>
                <p class="text-xs text-gray-500">Enter CPGRAMS ID to get Day 15/25 reminders</p>
              </a>
              <a href="/rti" class="bg-white rounded-xl p-4 shadow-sm card-hover">
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                  <span class="text-sm font-bold text-red-700">4</span>
                </div>
                <h4 class="font-semibold text-sm mb-1">Escalate if Ignored</h4>
                <p class="text-xs text-gray-500">Auto-draft RTI after 30 days</p>
              </a>
            </div>
            
            <!-- Save to My Complaints -->
            <div class="mt-4 p-4 bg-white rounded-xl border border-ashoka-200">
              <div class="flex items-center gap-3">
                <i class="fas fa-bookmark text-ashoka-500"></i>
                <div class="flex-1">
                  <h4 class="font-semibold text-sm text-gray-900">Save to My Complaints</h4>
                  <p class="text-xs text-gray-500">Track all your complaints in one place</p>
                </div>
                <a href="/my-complaints" class="text-xs bg-ashoka-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-ashoka-600 transition-colors">
                  <i class="fas fa-folder-open mr-1"></i>View All
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Start Over -->
        <div class="max-w-4xl mx-auto text-center">
          <button onclick="resetForm()" class="text-sm text-gray-500 hover:text-saffron-600 font-medium">
            <i class="fas fa-rotate-left mr-1"></i> Analyze another complaint
          </button>
        </div>
      </div>
    </div>
  </section>

  <script>
    // ============================================
    // COMPLAINT TEMPLATES (expanded)
    // ============================================
    const templates = {
      pension: "My pension payment has been delayed for the last 3 months. I retired from [Department] on [Date]. PPO Number: [PPO Number]. My pension was being credited to my [Bank Name] account (Account: XXXXXXXXXX). Since [Month], no pension has been credited despite multiple visits to the bank and treasury office.",
      pmkisan: "My PM-KISAN payment has not come for 3 installments. I completed eKYC verification on [Date] through the PM-KISAN portal. My Aadhaar [XXXX-XXXX-XXXX] is linked to my [Bank Name] account. The portal shows 'payment failed' status. My land records are updated in [State/District]. Previous payments were regular until [Month].",
      railway: "I am facing issues with Indian Railways service. On [Date], I traveled from [Station A] to [Station B] on Train No. [XXXXX]. PNR: [XXXXXXXXXX]. The issue was: [cleanliness/overcharging/delay/safety concern/unreserved despite valid ticket]. I paid Rs. [Amount] for the ticket booked through IRCTC on [Date].",
      passport: "My passport application has been pending for over 60 days. Application Reference Number: [XXXXXXX]. I applied at [Passport Office Name] on [Date]. Police verification was completed on [Date]. The portal shows status as '[Current Status]'. The standard processing time of 30 days has been exceeded.",
      ration: "I am not receiving my full ration entitlement from the fair price shop. My Ration Card Number: [XXXXXXXXXXX], Category: [APL/BPL/AAY]. The shop at [Location, District, State] is: [giving less quantity / charging extra / not opening on time / refusing to give receipt]. This has been happening since [Month].",
      electricity: "My electricity bill for the month of [Month] is excessively high despite normal usage. Consumer Number: [XXXXXXXXXXX]. Meter Number: [XXXXXXX]. The billed amount is Rs. [Amount] while my average monthly bill is Rs. [Average]. I suspect the meter reading is incorrect. My meter is located at [Address, Pin Code].",
      epfo: "My EPF withdrawal claim has been stuck for over 60 days. UAN: [XXXXXXXXXXXX]. I submitted the claim on [Date] through the EPFO portal. Claim ID: [XXXXXXXXX]. My KYC documents are all verified. The employer establishment code is [XXXXXXX]. The claimed amount is Rs. [Amount]. Previous employer: [Company Name], [City].",
      bank: "I have a complaint regarding banking services. My account number: [XXXXXXXXXXX] at [Bank Name], [Branch Name]. The issue is: [unauthorized transaction/loan rejection/ATM malfunction/account freeze/excess charges]. The incident occurred on [Date]. Amount involved: Rs. [Amount]. I have already raised complaint reference [REF] with the bank."
    };

    function useTemplate(type) {
      document.getElementById('complaintInput').value = templates[type];
      updateValidation(templates[type]);
      document.getElementById('inputCharCount').textContent = templates[type].length + ' characters';
      document.getElementById('analyzeButton').disabled = false;
    }

    // Full Template Library (Feature #1)
    const fullTemplates = {
      'pm-kisan': "My PM-KISAN payment has not come for 3 installments. I completed eKYC verification on [Date] through the PM-KISAN portal. My Aadhaar is linked to my bank account. The portal shows payment failed status. My land records are updated. Previous payments were regular until [Month]. Beneficiary ID: [YOUR_BENEFICIARY_ID].",
      'epf-withdrawal': "My EPF withdrawal claim has been stuck for over 60 days. UAN: [YOUR_UAN]. I submitted the claim on [Date] through the EPFO portal. My KYC documents are all verified. The claimed amount is Rs. [Amount]. Previous employer: [Company Name], [City].",
      'ration-card': "I am not receiving my ration card despite completing the application on [Date]. Application Number: [YOUR_APPLICATION_NUMBER]. My family of [Number] members has been deprived of subsidized food grains under NFSA. The fair price shop at [Location, District, State] has no record of my application.",
      'passport-delay': "My passport application has been pending for over 60 days. Application Reference: [YOUR_FILE_NUMBER]. I applied at [Passport Office] on [Date]. Police verification was completed on [Date]. The portal shows status as [Current Status]. The standard processing time has been exceeded.",
      'pension-delay': "My government pension has not been credited for [Number] consecutive months. PPO Number: [YOUR_PPO_NUMBER]. I am a retired [Designation] from [Department]. Pension was regular until [Last Month Received]. My bank account at [Bank Name], [Branch] has not received any credit since then.",
      'electricity-billing': "My electricity bill for [Month/Year] is excessively high at Rs. [Amount] despite normal usage. Consumer Number: [YOUR_CONSUMER_NUMBER]. My average monthly bill is Rs. [Normal Amount]. I suspect the meter reading is incorrect or estimated. Located at [Address, Pin Code].",
      'railway-refund': "I have not received my railway ticket refund for PNR [YOUR_PNR_NUMBER]. Train [Train Number] on [Date] from [Origin] to [Destination] was cancelled. The refund of Rs. [Amount] has not been credited despite [Number] days passing. Payment was via [UPI/Card].",
      'income-tax-refund': "My income tax refund for AY [Assessment Year] has been delayed. PAN: [YOUR_PAN]. As per Section 143(1) intimation, refund of Rs. [Amount] was determined. ITR filed on [Date], Ack No: [YOUR_ACK_NUMBER]. Refund status on portal shows [Current Status] for over [Number] months."
    };

    function useFullTemplate(id) {
      const text = fullTemplates[id];
      if (!text) return;
      document.getElementById('complaintInput').value = text;
      updateValidation(text);
      document.getElementById('inputCharCount').textContent = text.length + ' characters';
      document.getElementById('analyzeButton').disabled = false;
      document.getElementById('complaintInput').focus();
      showToast('Template loaded! Edit the [bracketed] fields with your details, then click Analyze.', 'info');
    }

    // ============================================
    // REAL-TIME VALIDATION (Step 2)
    // ============================================
    function updateValidation(text) {
      const panel = document.getElementById('validationPanel');
      if (text.length < 10) { panel.classList.add('hidden'); return; }
      panel.classList.remove('hidden');

      const checks = {
        length: text.split(/\\s+/).filter(w => w).length >= 30,
        dates: /\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}|\\d+\\s*(month|day|week|year|mahine|din|saal)/i.test(text),
        refs: /[A-Z]{2,}[\\/-]\\w+[\\/-]\\d+|\\d{6,}|#\\d+|UAN|PNR|PPO/i.test(text),
        location: /(district|city|state|village|block|pin|ward|jila|gaon|nagar|taluk|mandal|tehsil|address)/i.test(text),
        amount: /(rs\\.?|₹|rupee|lakh|crore|\\d+,\\d{3})/i.test(text),
        scheme: /(pm[- ]?kisan|ayushman|pmay|ujjwala|mudra|jan[- ]?dhan|swachh|atal|pradhan|epfo|irctc|rti|cpgrams|nrega|mgnrega)/i.test(text)
      };

      const keys = ['length', 'dates', 'refs', 'location', 'amount', 'scheme'];
      let passed = 0;
      keys.forEach(k => {
        const icon = document.getElementById('v-' + k + '-icon');
        if (checks[k]) {
          icon.innerHTML = '<i class="fas fa-check text-[8px]"></i>';
          icon.className = 'w-4 h-4 rounded-full bg-ashoka-500 text-white flex items-center justify-center text-[8px]';
          passed++;
        } else {
          icon.innerHTML = '—';
          icon.className = 'w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center text-[8px] text-gray-400';
        }
      });

      document.getElementById('validationBar').style.width = ((passed / 6) * 100) + '%';
      document.getElementById('validationScore').textContent = passed + '/6';
    }

    // ============================================
    // WIZARD PROGRESS — 7 Steps
    // ============================================
    function updateWizardStep(step) {
      const colors = {
        active: { circle: 'bg-saffron-500 text-white shadow-lg', label: 'text-saffron-600' },
        completed: { circle: 'bg-ashoka-500 text-white shadow-lg', label: 'text-ashoka-600' },
        inactive: { circle: 'bg-gray-200 text-gray-400', label: 'text-gray-400' }
      };

      for (let i = 1; i <= 7; i++) {
        const circle = document.getElementById('stepCircle' + i);
        const label = document.getElementById('stepLabel' + i);
        if (!circle) continue;
        
        circle.className = 'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ';
        
        if (i < step) {
          circle.className += colors.completed.circle;
          circle.innerHTML = '<i class="fas fa-check text-xs"></i>';
          if (label) label.className = 'text-[9px] sm:text-[10px] font-semibold mt-1 ' + colors.completed.label;
        } else if (i === step) {
          circle.className += colors.active.circle;
          circle.textContent = i;
          if (label) label.className = 'text-[9px] sm:text-[10px] font-semibold mt-1 ' + colors.active.label;
        } else {
          circle.className += colors.inactive.circle;
          circle.textContent = i;
          if (label) label.className = 'text-[9px] sm:text-[10px] font-semibold mt-1 ' + colors.inactive.label;
        }
      }

      const percent = Math.max(0, ((step - 1) / 6) * 100);
      document.getElementById('progressLine').style.width = percent + '%';
    }

    // ============================================
    // PRE-FILL & INPUT HANDLING
    // ============================================
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('text')) {
      const prefill = decodeURIComponent(urlParams.get('text'));
      document.getElementById('complaintInput').value = prefill;
      document.getElementById('langSelect').value = urlParams.get('lang') || 'en';
      document.getElementById('inputCharCount').textContent = prefill.length + ' characters';
      document.getElementById('analyzeButton').disabled = false;
      updateValidation(prefill);
    }

    document.getElementById('complaintInput').addEventListener('input', (e) => {
      const text = e.target.value;
      document.getElementById('inputCharCount').textContent = text.length + ' characters';
      document.getElementById('analyzeButton').disabled = text.trim().length < 10;
      updateValidation(text);
    });

    // ============================================
    // ANALYZE COMPLAINT
    // ============================================
    async function analyzeComplaint() {
      const text = document.getElementById('complaintInput').value.trim();
      const lang = document.getElementById('langSelect').value;
      if (text.length < 10) return;

      // Step 2: Validate
      updateWizardStep(2);
      await new Promise(r => setTimeout(r, 400));

      // Step 3: Analyzing
      updateWizardStep(3);

      document.getElementById('inputSection').querySelector('.bg-white').classList.add('opacity-50');
      document.getElementById('loadingSection').classList.remove('hidden');
      document.getElementById('resultsSection').classList.add('hidden');
      document.getElementById('analyzeButton').disabled = true;
      document.getElementById('analyzeBtnIcon').className = 'spinner';
      document.getElementById('analyzeBtnIcon').style.cssText = 'width:16px;height:16px;display:inline-block;';
      document.getElementById('analyzeBtnText').textContent = 'Analyzing...';

      // Animate loading steps
      const steps = ['lstep1', 'lstep2', 'lstep3', 'lstep4'];
      const labels = ['Detecting language...', 'Classifying department (92 ministries)...', 'Scoring complaint quality...', 'Generating improved draft & checklist...'];
      
      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 500));
        document.getElementById(steps[i]).innerHTML = '<i class="fas fa-check-circle text-ashoka-500"></i> ' + labels[i].replace('...', ' — done');
        document.getElementById(steps[i]).classList.remove('text-gray-300');
        document.getElementById(steps[i]).classList.add('text-ashoka-600');
        if (i + 1 < steps.length) {
          document.getElementById(steps[i + 1]).innerHTML = '<span class="spinner" style="width:16px;height:16px;"></span> ' + labels[i + 1];
          document.getElementById(steps[i + 1]).classList.remove('text-gray-300');
        }
      }

      try {
        const res = await fetch('/api/complaints/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language: lang, state_name: document.getElementById('stateSelect').value || null })
        });
        const json = await res.json();
        
        if (json.success) {
          await new Promise(r => setTimeout(r, 300));
          renderResults(json.data, text);
          updateWizardStep(4);
        } else {
          showToast(json.error || 'Analysis failed', 'error');
          updateWizardStep(1);
        }
      } catch (e) {
        showToast('Network error. Please try again.', 'error');
        updateWizardStep(1);
      }

      document.getElementById('loadingSection').classList.add('hidden');
      document.getElementById('inputSection').querySelector('.bg-white').classList.remove('opacity-50');
      document.getElementById('analyzeBtnIcon').className = 'fas fa-bolt';
      document.getElementById('analyzeBtnIcon').style.cssText = '';
      document.getElementById('analyzeBtnText').textContent = 'Re-analyze';
      document.getElementById('analyzeButton').disabled = false;
    }

    // ============================================
    // RENDER RESULTS
    // ============================================
    function renderResults(data, originalText) {
      document.getElementById('resultsSection').classList.remove('hidden');
      
      // AI Source Badge
      const isGemini = data._ai_source === 'gemini';
      const latency = data._ai_latency_ms ? (data._ai_latency_ms / 1000).toFixed(1) + 's' : '';
      document.getElementById('aiSourceBadge').innerHTML = \`
        <div class="flex items-center gap-3 flex-wrap">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold \${isGemini ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}">
            <span class="w-2 h-2 rounded-full \${isGemini ? 'bg-blue-500' : 'bg-gray-400'}"></span>
            \${isGemini ? '<i class="fas fa-microchip mr-0.5"></i> Powered by Gemini AI' : '<i class="fas fa-cog mr-0.5"></i> Smart Keyword Analysis'}
          </span>
          <span class="text-xs text-gray-400">Model: \${data._ai_model || 'unknown'}</span>
          \${latency ? '<span class="text-xs text-gray-400">Latency: ' + latency + '</span>' : ''}
          \${data.complaint_id ? '<span class="text-xs text-gray-400">ID: #' + data.complaint_id + '</span>' : ''}
        </div>
      \`;

      document.getElementById('routingSubtext').textContent = isGemini ? 'Gemini AI classification' : 'Keyword-based classification';

      // Department routing
      const deptHtml = data.departments.map((d, i) => {
        const barColor = i === 0 ? 'bg-ashoka-500' : (i === 1 ? 'bg-saffron-500' : 'bg-gray-400');
        const badge = i === 0 ? '<span class="bg-ashoka-100 text-ashoka-700 text-xs px-2 py-0.5 rounded-full font-semibold">BEST MATCH</span>' : '';
        return \`
          <div class="flex items-center gap-4 p-3 rounded-xl \${i === 0 ? 'bg-ashoka-50 border border-ashoka-200' : 'hover:bg-gray-50'} mb-2 transition-colors">
            <div class="w-10 h-10 \${i === 0 ? 'bg-ashoka-500' : (i === 1 ? 'bg-saffron-500' : 'bg-gray-300')} rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">\${i + 1}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap"><h4 class="font-semibold text-sm text-gray-900">\${d.name}</h4>\${badge}</div>
              <p class="text-xs text-gray-500 mt-0.5">\${d.reason}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-lg font-bold \${i === 0 ? 'text-ashoka-600' : (i === 1 ? 'text-saffron-600' : 'text-gray-500')}">\${d.confidence}%</div>
              <div class="w-20 h-1.5 bg-gray-200 rounded-full mt-1"><div class="\${barColor} h-full rounded-full transition-all" style="width:\${d.confidence}%"></div></div>
            </div>
          </div>
        \`;
      }).join('');
      document.getElementById('departmentResults').innerHTML = deptHtml + '<p class="text-xs text-gray-400 mt-3 italic"><i class="fas fa-info-circle mr-1"></i>' + data.department_reasoning + '</p>';

      // Move to step 5 after a moment
      setTimeout(() => updateWizardStep(5), 800);

      // Quality score
      const scoreBefore = data.quality_score_before;
      const scoreAfter = data.quality_score_after;
      const gaugeColor = (score) => score <= 3 ? '#ef4444' : score <= 5 ? '#f59e0b' : score <= 7 ? '#3b82f6' : '#22c55e';
      const scoreLabel = (score) => score <= 3 ? 'Weak' : score <= 5 ? 'Fair' : score <= 7 ? 'Good' : score <= 9 ? 'Strong' : 'Perfect';
      
      document.getElementById('qualityResults').innerHTML = \`
        <div class="flex items-center justify-center gap-8">
          <div class="text-center">
            <div class="quality-gauge mx-auto mb-2" style="--gauge-color:\${gaugeColor(scoreBefore)};--gauge-percent:\${scoreBefore * 10}%">
              <div class="quality-gauge-inner"><span class="text-2xl font-black" style="color:\${gaugeColor(scoreBefore)}">\${scoreBefore}</span><span class="text-xs text-gray-400">/10</span></div>
            </div>
            <span class="text-xs font-semibold text-gray-500">BEFORE</span><br><span class="text-[10px] text-gray-400">\${scoreLabel(scoreBefore)}</span>
          </div>
          <div class="text-3xl text-gray-300"><i class="fas fa-arrow-right"></i></div>
          <div class="text-center">
            <div class="quality-gauge mx-auto mb-2" style="--gauge-color:\${gaugeColor(scoreAfter)};--gauge-percent:\${scoreAfter * 10}%">
              <div class="quality-gauge-inner"><span class="text-2xl font-black" style="color:\${gaugeColor(scoreAfter)}">\${scoreAfter}</span><span class="text-xs text-gray-400">/10</span></div>
            </div>
            <span class="text-xs font-semibold text-ashoka-600">AFTER AI</span><br><span class="text-[10px] text-ashoka-500">\${scoreLabel(scoreAfter)}</span>
          </div>
        </div>
        <p class="text-center text-xs text-gray-500 mt-3">Complaint strength improved by <strong class="text-ashoka-600">+\${scoreAfter - scoreBefore} points</strong></p>
      \`;

      document.getElementById('originalScore').textContent = 'Score: ' + scoreBefore + '/10';
      document.getElementById('improvedScore').textContent = 'Score: ' + scoreAfter + '/10';

      // Missing elements
      document.getElementById('missingResults').innerHTML = data.missing_elements.length > 0
        ? data.missing_elements.map(m => '<div class="flex items-start gap-2 mb-2"><i class="fas fa-xmark text-red-500 mt-0.5 flex-shrink-0"></i><span class="text-sm text-gray-700">' + m + '</span></div>').join('')
        : '<p class="text-sm text-ashoka-600 flex items-center gap-2"><i class="fas fa-check-circle"></i> All essential elements present!</p>';

      // Translation
      if (data.translated_text && data.language_detected !== 'en') {
        const langNames = { hi: 'Hindi', ta: 'Tamil', te: 'Telugu', bn: 'Bengali', mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi' };
        document.getElementById('translationSection').classList.remove('hidden');
        document.getElementById('detectedLang').textContent = 'Detected: ' + (langNames[data.language_detected] || data.language_detected);
        document.getElementById('translatedTextContent').textContent = data.translated_text;
      } else {
        document.getElementById('translationSection').classList.add('hidden');
      }

      // Side by side
      document.getElementById('originalText').textContent = originalText;
      document.getElementById('improvedText').value = data.improved_draft;

      // Step 6 after scroll
      setTimeout(() => updateWizardStep(6), 1500);

      // Document checklist
      document.getElementById('checklistResults').innerHTML = data.documents_checklist.map((doc, i) => \`
        <label class="flex items-center gap-3 mb-2 cursor-pointer group">
          <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500">
          <span class="text-sm text-gray-700 group-hover:text-purple-700">\${doc}</span>
        </label>
      \`).join('');
      
      // Step 7 after more scroll
      setTimeout(() => updateWizardStep(7), 2500);
      
      document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function copyImproved() {
      const text = document.getElementById('improvedText').value;
      navigator.clipboard.writeText(text).then(() => showToast('Improved complaint copied to clipboard!', 'success'));
    }

    function resetForm() {
      document.getElementById('resultsSection').classList.add('hidden');
      document.getElementById('translationSection').classList.add('hidden');
      document.getElementById('validationPanel').classList.add('hidden');
      document.getElementById('complaintInput').value = '';
      document.getElementById('inputCharCount').textContent = '0 characters';
      document.getElementById('analyzeButton').disabled = true;
      document.getElementById('analyzeBtnText').textContent = 'Analyze My Complaint';
      updateWizardStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset loading steps
      const labels = ['Detecting language...', 'Classifying department (92 ministries)...', 'Scoring complaint quality...', 'Generating improved draft & checklist...'];
      ['lstep1','lstep2','lstep3','lstep4'].forEach((s,i) => {
        document.getElementById(s).innerHTML = (i === 0 ? '<span class="spinner" style="width:16px;height:16px;"></span> ' : '<i class="fas fa-clock"></i> ') + labels[i];
        if (i > 0) { document.getElementById(s).classList.add('text-gray-300'); document.getElementById(s).classList.remove('text-ashoka-600'); }
      });
    }

    // ============================================
    // VOICE INPUT — Web Speech API (Week 7)
    // ============================================
    let voiceRecognition = null;
    let isRecording = false;

    function toggleVoiceInput() {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Speech recognition not supported in this browser. Try Chrome or Edge.', 'error');
        return;
      }

      if (isRecording) {
        stopVoice();
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      voiceRecognition = new SpeechRecognition();
      const lang = document.getElementById('langSelect').value;
      const langMap = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', mr: 'mr-IN', kn: 'kn-IN' };
      voiceRecognition.lang = langMap[lang] || 'en-IN';
      voiceRecognition.continuous = true;
      voiceRecognition.interimResults = true;

      voiceRecognition.onstart = () => {
        isRecording = true;
        document.getElementById('voiceBtn').classList.add('bg-red-50', 'border-red-300', 'text-red-700');
        document.getElementById('voiceBtn').classList.remove('bg-white', 'border-purple-200', 'text-purple-700');
        document.getElementById('voiceIcon').className = 'fas fa-stop';
        document.getElementById('voiceLabel').textContent = 'Stop';
        document.getElementById('voiceStatus').textContent = 'Listening...';
        document.getElementById('voiceWave').classList.remove('hidden');
        document.getElementById('voiceWave').classList.add('flex');
      };

      voiceRecognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        const input = document.getElementById('complaintInput');
        input.value = transcript;
        input.dispatchEvent(new Event('input'));
      };

      voiceRecognition.onerror = (event) => {
        if (event.error !== 'aborted') {
          showToast('Voice error: ' + event.error + '. Try again.', 'error');
        }
        stopVoice();
      };

      voiceRecognition.onend = () => { stopVoice(); };

      voiceRecognition.start();
    }

    function stopVoice() {
      isRecording = false;
      if (voiceRecognition) { try { voiceRecognition.stop(); } catch(e) {} }
      document.getElementById('voiceBtn').classList.remove('bg-red-50', 'border-red-300', 'text-red-700');
      document.getElementById('voiceBtn').classList.add('bg-white', 'border-purple-200', 'text-purple-700');
      document.getElementById('voiceIcon').className = 'fas fa-microphone';
      document.getElementById('voiceLabel').textContent = 'Voice Input';
      document.getElementById('voiceStatus').textContent = 'Click to speak your complaint';
      document.getElementById('voiceWave').classList.add('hidden');
      document.getElementById('voiceWave').classList.remove('flex');
    }

    // ============================================
    // COMPLAINT COMPARISON DIFF (Week 7)
    // ============================================
    function showDiff(original, improved) {
      const diffSection = document.getElementById('diffSection');
      diffSection.classList.remove('hidden');

      // Simple word-level diff
      const origWords = original.split(/\\s+/);
      const impWords = improved.split(/\\s+/);
      const origSet = new Set(origWords.map(w => w.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')));
      const impSet = new Set(impWords.map(w => w.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')));

      const diffHtml = impWords.map(w => {
        const clean = w.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        if (!origSet.has(clean) && clean.length > 2) {
          return '<span class="bg-green-100 text-green-800 px-0.5 rounded font-semibold">' + w + '</span>';
        }
        return w;
      }).join(' ');

      const removedWords = origWords.filter(w => {
        const clean = w.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        return !impSet.has(clean) && clean.length > 2;
      });

      let html = '<div class="mb-3"><span class="text-xs font-semibold text-gray-500">AI IMPROVED VERSION (additions highlighted in green):</span></div>';
      html += '<div class="text-sm text-gray-700 leading-relaxed bg-gray-50 dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-dark-600">' + diffHtml + '</div>';
      if (removedWords.length > 0) {
        html += '<div class="mt-3"><span class="text-xs text-gray-400"><i class="fas fa-minus-circle text-red-400 mr-1"></i>Removed/replaced: <span class="line-through">' + removedWords.slice(0, 10).join(', ') + '</span>' + (removedWords.length > 10 ? ' + ' + (removedWords.length - 10) + ' more' : '') + '</span></div>';
      }
      html += '<div class="mt-2 flex gap-3 text-[10px]"><span class="bg-green-100 text-green-700 px-2 py-0.5 rounded"><i class="fas fa-plus mr-1"></i>' + impWords.filter(w => { const c = w.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''); return !origSet.has(c) && c.length > 2; }).length + ' words added</span>' +
        '<span class="bg-red-100 text-red-700 px-2 py-0.5 rounded"><i class="fas fa-minus mr-1"></i>' + removedWords.length + ' words removed</span>' +
        '<span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded"><i class="fas fa-exchange mr-1"></i>' + Math.abs(impWords.length - origWords.length) + ' net change</span></div>';
      document.getElementById('diffDisplay').innerHTML = html;
    }

    // ============================================
    // SUCCESS PROBABILITY (Week 7)
    // ============================================
    async function loadSuccessProbability(department, qualityAfter) {
      const section = document.getElementById('successProbSection');
      section.classList.remove('hidden');
      try {
        const res = await fetch('/api/analytics/success-probability?department=' + encodeURIComponent(department) + '&quality=' + qualityAfter);
        const json = await res.json();
        if (!json.success) return;
        const d = json.data;

        const color = d.probability >= 70 ? '#22c55e' : d.probability >= 50 ? '#f59e0b' : '#ef4444';
        document.getElementById('probGauge').style.cssText = '--gauge-color:' + color + ';--gauge-percent:' + d.probability + '%';
        document.getElementById('probPercent').textContent = d.probability;
        document.getElementById('probPercent').style.color = color;
        document.getElementById('probRating').textContent = d.rating + ' chance of resolution';

        document.getElementById('probFactors').innerHTML = 
          '<div class="bg-gray-50 dark:bg-dark-700 rounded-lg p-2 text-center"><div class="text-xs font-bold text-navy-700 dark:text-gray-200">' + d.factors.department_track_record + '%</div><div class="text-[9px] text-gray-400">Dept Record</div></div>' +
          '<div class="bg-gray-50 dark:bg-dark-700 rounded-lg p-2 text-center"><div class="text-xs font-bold ' + (d.factors.quality_impact >= 0 ? 'text-ashoka-600' : 'text-red-500') + '">' + (d.factors.quality_impact >= 0 ? '+' : '') + d.factors.quality_impact + '</div><div class="text-[9px] text-gray-400">Quality Boost</div></div>' +
          '<div class="bg-gray-50 dark:bg-dark-700 rounded-lg p-2 text-center"><div class="text-xs font-bold" style="color:' + color + '">' + d.factors.overall + '%</div><div class="text-[9px] text-gray-400">Overall</div></div>';

        document.getElementById('probTips').innerHTML = d.tips.map(t => '<div class="flex items-start gap-2"><i class="fas fa-lightbulb text-saffron-500 mt-0.5 flex-shrink-0 text-[10px]"></i><span class="text-[11px] text-gray-600 dark:text-gray-300">' + t + '</span></div>').join('');
      } catch(e) {}
    }

    // ============================================
    // SIMILAR COMPLAINTS (Week 7)
    // ============================================
    async function loadSimilarComplaints(department) {
      const section = document.getElementById('similarSection');
      section.classList.remove('hidden');
      try {
        const res = await fetch('/api/complaints/similar?department=' + encodeURIComponent(department));
        const json = await res.json();
        if (!json.success || !json.data.length) {
          document.getElementById('similarContent').innerHTML = '<p class="text-xs text-gray-400 text-center py-3"><i class="fas fa-inbox mr-1"></i>No similar complaints found in database</p>';
          return;
        }

        document.getElementById('similarContent').innerHTML = json.data.map(c => 
          '<a href="/complaint-detail?id=' + c.id + '" class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors border-b border-gray-50 dark:border-dark-700 last:border-0">' +
            '<div class="w-8 h-8 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center flex-shrink-0"><span class="text-xs font-bold text-sky-700 dark:text-sky-300">#' + c.id + '</span></div>' +
            '<div class="flex-1 min-w-0">' +
              '<p class="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">' + c.text_preview + '</p>' +
              '<div class="flex items-center gap-2 mt-1">' +
                '<span class="text-[10px] bg-navy-50 dark:bg-navy-900 text-navy-700 dark:text-navy-300 px-1.5 py-0.5 rounded">' + (c.department || 'Unknown').slice(0, 30) + '</span>' +
                '<span class="text-[10px] text-gray-400">Score: ' + (c.quality_before || '?') + ' → ' + (c.quality_after || '?') + '</span>' +
                '<span class="text-[10px] px-1.5 py-0.5 rounded ' + (c.status === 'resolved' ? 'bg-green-100 text-green-700' : c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600') + '">' + (c.status || 'draft') + '</span>' +
              '</div>' +
            '</div>' +
          '</a>'
        ).join('');
      } catch(e) {
        document.getElementById('similarContent').innerHTML = '<p class="text-xs text-gray-400 text-center py-3">Could not load similar complaints</p>';
      }
    }

    // ============================================
    // ENHANCED RENDER RESULTS (Hook new features)
    // ============================================
    const _origRenderResults = renderResults;
    renderResults = function(data, originalText) {
      _origRenderResults(data, originalText);
      
      // Show diff view
      if (data.improved_draft) {
        showDiff(originalText, data.improved_draft);
      }

      // Load success probability
      if (data.departments && data.departments[0]) {
        loadSuccessProbability(data.departments[0].name, data.quality_score_after);
      }

      // Load similar complaints
      if (data.departments && data.departments[0]) {
        loadSimilarComplaints(data.departments[0].name);
      }
    };

    // Init wizard
    updateWizardStep(1);
  </script>
  `
  return layout('Smart Complaint Builder', content, 'complaint', {
    description: 'AI-powered complaint builder for CPGRAMS. Type your problem in any Indian language, get department routing, quality scoring, and an improved draft.',
    keywords: 'CPGRAMS complaint, AI complaint builder, grievance filing, department routing, India'
  })
}
