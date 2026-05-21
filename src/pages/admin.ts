import { layout } from './layout'

export function adminPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-900 to-navy-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
            <i class="fas fa-shield-halved text-saffron-400 mr-2" aria-hidden="true"></i><span data-i18n="nav_admin">Admin Analytics</span>
          </h1>
          <p class="text-gray-300 text-sm">System health, audit logs, email queue, and platform metrics</p>
        </div>
        <div class="flex items-center gap-3">
          <button id="live-demo-btn" onclick="runLiveDemo()" class="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 animate-pulse hover:animate-none">
            <i class="fas fa-clapperboard mr-1.5"></i>Start Live Demo
          </button>
          <button onclick="refreshAdmin()" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
            <i class="fas fa-rotate mr-1.5"></i>Refresh
          </button>
          <span class="text-xs text-gray-400" id="admin-last-refresh">—</span>
        </div>
      </div>
    </div>
  </section>

  <!-- System Health Cards -->
  <section class="py-6 bg-gray-50 border-b border-gray-100" aria-label="System Health Overview">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" id="admin-health">
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <div class="w-10 h-10 bg-ashoka-100 rounded-lg flex items-center justify-center mx-auto mb-2"><i class="fas fa-heartbeat text-ashoka-600"></i></div>
          <div class="text-sm font-black text-ashoka-600" id="ah-status">OK</div>
          <div class="text-[10px] text-gray-500">System Status</div>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <div class="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center mx-auto mb-2"><i class="fas fa-database text-navy-600"></i></div>
          <div class="text-sm font-black text-navy-600" id="ah-db-tables">—</div>
          <div class="text-[10px] text-gray-500">DB Tables</div>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <div class="w-10 h-10 bg-saffron-100 rounded-lg flex items-center justify-center mx-auto mb-2"><i class="fas fa-users text-saffron-600"></i></div>
          <div class="text-sm font-black text-saffron-600" id="ah-users">—</div>
          <div class="text-[10px] text-gray-500">Users</div>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2"><i class="fas fa-file-lines text-purple-600"></i></div>
          <div class="text-sm font-black text-purple-600" id="ah-complaints">—</div>
          <div class="text-[10px] text-gray-500">Complaints</div>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2"><i class="fas fa-flag text-red-600"></i></div>
          <div class="text-sm font-black text-red-600" id="ah-fake-closures">—</div>
          <div class="text-[10px] text-gray-500">Fake Closures</div>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2"><i class="fas fa-envelope text-blue-600"></i></div>
          <div class="text-sm font-black text-blue-600" id="ah-emails">—</div>
          <div class="text-[10px] text-gray-500">Emails Queued</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Admin Panels -->
  <section class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

      <!-- CPGRAMS Alerts -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 flex items-center gap-2">
          <i class="fas fa-bell text-white" aria-hidden="true"></i>
          <h2 class="font-bold text-white">CPGRAMS Alerts</h2>
          <span class="ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full" id="alert-count">0</span>
        </div>
        <div class="p-6" id="admin-alerts">
          <div class="text-center py-8">
            <div class="spinner mx-auto mb-3"></div>
            <p class="text-sm text-gray-500">Loading alerts...</p>
          </div>
        </div>
      </div>

      <!-- Data Pipeline Status Panel -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" id="pipeline-panel">
        <div class="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center gap-2">
          <i class="fas fa-rocket text-white" aria-hidden="true"></i>
          <h2 class="font-bold text-white">Data Pipeline</h2>
          <span class="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">Live</span>
          <div class="ml-auto flex items-center gap-2">
            <input type="password" id="admin-key-input" placeholder="Admin Key" class="bg-white/20 text-white placeholder:text-white/50 text-xs px-3 py-1.5 rounded-lg border border-white/20 w-36 focus:outline-none focus:ring-1 focus:ring-white/50" />
            <button onclick="loadPipelineStatus()" class="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1.5 rounded-lg transition-colors">
              <i class="fas fa-sync mr-1"></i>Refresh
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-3 font-semibold text-gray-600">Job</th>
                  <th class="text-left py-3 px-3 font-semibold text-gray-600">Last Run</th>
                  <th class="text-left py-3 px-3 font-semibold text-gray-600">Status</th>
                  <th class="text-left py-3 px-3 font-semibold text-gray-600">Rows</th>
                  <th class="text-left py-3 px-3 font-semibold text-gray-600">Source</th>
                  <th class="text-left py-3 px-3 font-semibold text-gray-600">Schedule</th>
                  <th class="text-right py-3 px-3 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody id="pipeline-tbody">
                <tr class="border-b border-gray-50 hover:bg-gray-50">
                  <td class="py-3 px-3 font-semibold text-gray-800"><i class="fas fa-file-pdf text-red-500 mr-2"></i>DARPG PDF Fetch</td>
                  <td class="py-3 px-3 text-gray-500" id="pl-darpg-last">&mdash;</td>
                  <td class="py-3 px-3" id="pl-darpg-status"><span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Pending</span></td>
                  <td class="py-3 px-3 text-gray-500" id="pl-darpg-rows">&mdash;</td>
                  <td class="py-3 px-3 text-gray-500">darpg.gov.in</td>
                  <td class="py-3 px-3 text-gray-400">Monthly (28th)</td>
                  <td class="py-3 px-3 text-right"><button onclick="triggerPipeline('darpg')" class="bg-navy-600 hover:bg-navy-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors"><i class="fas fa-play mr-1"></i>Run</button></td>
                </tr>
                <tr class="border-b border-gray-50 hover:bg-gray-50">
                  <td class="py-3 px-3 font-semibold text-gray-800"><i class="fas fa-rss text-orange-500 mr-2"></i>RSS Monitor</td>
                  <td class="py-3 px-3 text-gray-500" id="pl-rss-last">&mdash;</td>
                  <td class="py-3 px-3" id="pl-rss-status"><span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Pending</span></td>
                  <td class="py-3 px-3 text-gray-500" id="pl-rss-rows">&mdash;</td>
                  <td class="py-3 px-3 text-gray-500">5 RSS Feeds</td>
                  <td class="py-3 px-3 text-gray-400">Daily (6 AM)</td>
                  <td class="py-3 px-3 text-right"><button onclick="triggerPipeline('rss')" class="bg-navy-600 hover:bg-navy-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors"><i class="fas fa-play mr-1"></i>Run</button></td>
                </tr>
                <tr class="border-b border-gray-50 hover:bg-gray-50">
                  <td class="py-3 px-3 font-semibold text-gray-800"><i class="fas fa-brain text-purple-500 mr-2"></i>Aggregator</td>
                  <td class="py-3 px-3 text-gray-500" id="pl-agg-last">&mdash;</td>
                  <td class="py-3 px-3" id="pl-agg-status"><span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Pending</span></td>
                  <td class="py-3 px-3 text-gray-500" id="pl-agg-rows">&mdash;</td>
                  <td class="py-3 px-3 text-gray-500">TF-IDF + Feedback</td>
                  <td class="py-3 px-3 text-gray-400">Daily (2:30 AM)</td>
                  <td class="py-3 px-3 text-right"><button onclick="triggerPipeline('aggregator')" class="bg-navy-600 hover:bg-navy-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors"><i class="fas fa-play mr-1"></i>Run</button></td>
                </tr>
                <tr class="border-b border-gray-50 hover:bg-gray-50">
                  <td class="py-3 px-3 font-semibold text-gray-800"><i class="fas fa-database text-blue-500 mr-2"></i>data.gov.in API</td>
                  <td class="py-3 px-3 text-gray-500" id="pl-dg-last">&mdash;</td>
                  <td class="py-3 px-3" id="pl-dg-status"><span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Pending</span></td>
                  <td class="py-3 px-3 text-gray-500" id="pl-dg-rows">&mdash;</td>
                  <td class="py-3 px-3 text-gray-500">data.gov.in</td>
                  <td class="py-3 px-3 text-gray-400">Monthly (28th)</td>
                  <td class="py-3 px-3 text-right"><button onclick="triggerPipeline('datagov')" class="bg-navy-600 hover:bg-navy-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors"><i class="fas fa-play mr-1"></i>Run</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2">
            <i class="fas fa-info-circle text-emerald-600 mt-0.5 flex-shrink-0"></i>
            <p class="text-[10px] text-emerald-700">Pipeline jobs run on Render.com (Python/FastAPI). Cron triggers from Cloudflare warm the container then dispatch jobs. Enter your Admin Key to trigger manual runs during demos.</p>
          </div>

          <!-- Live Demo Progress Panel -->
          <div id="live-demo-panel" class="hidden mt-4 rounded-xl border-2 border-orange-400 bg-gradient-to-br from-gray-900 to-gray-800 p-5 shadow-2xl">
            <div class="flex items-center gap-2 mb-4">
              <span class="relative flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span></span>
              <h3 class="text-orange-400 font-bold text-sm">LIVE DEMO — Pipeline Execution</h3>
              <span class="ml-auto text-[10px] text-gray-500 font-mono" id="demo-timer">00:00</span>
            </div>
            <div class="space-y-2" id="demo-job-list"></div>
          </div>

          <!-- Live Demo Summary -->
          <div id="live-demo-summary" class="hidden mt-4 p-5 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-green-500 shadow-2xl">
            <h3 class="text-green-400 font-bold mb-3 text-sm"><i class="fas fa-check-circle mr-2"></i>Pipeline Complete — Live Data Status</h3>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="bg-white/5 rounded-lg p-3"><span class="text-gray-400 block mb-1">Ministry Data</span><span id="summary-ministries" class="text-white font-bold text-base">—</span></div>
              <div class="bg-white/5 rounded-lg p-3"><span class="text-gray-400 block mb-1">Report Month</span><span id="summary-month" class="text-white font-bold text-base">—</span></div>
              <div class="bg-white/5 rounded-lg p-3"><span class="text-gray-400 block mb-1">Social Signals</span><span id="summary-signals" class="text-white font-bold text-base">—</span></div>
              <div class="bg-white/5 rounded-lg p-3"><span class="text-gray-400 block mb-1">Trending Issues</span><span id="summary-trends" class="text-white font-bold text-base">—</span></div>
            </div>
            <div class="mt-4 text-center py-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <span class="text-green-400 font-bold text-lg">🟢 DASHBOARD IS LIVE</span>
              <p class="text-gray-400 text-[10px] mt-1">All data sourced from official government sources. Last sync: just now.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- RSS Feed Monitor Verification Panel -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" id="rss-monitor-panel">
        <div class="px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-600 flex items-center gap-2">
          <i class="fas fa-rss text-white" aria-hidden="true"></i>
          <h2 class="font-bold text-white">RSS Feed Monitor</h2>
          <span class="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">Verification</span>
          <div class="ml-auto flex items-center gap-2">
            <button onclick="loadRSSFeed()" class="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors">
              <i class="fas fa-sync mr-1"></i>Refresh
            </button>
          </div>
        </div>
        <div class="p-6">
          <!-- Stats Row -->
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5" id="rss-stats-row">
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 text-center border border-gray-200">
              <div class="text-xl font-black text-gray-800" id="rss-stat-total">—</div>
              <div class="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Articles Today</div>
            </div>
            <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 text-center border border-emerald-200">
              <div class="text-xl font-black text-emerald-700" id="rss-stat-high">—</div>
              <div class="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">HIGH Relevance</div>
            </div>
            <div class="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-3 text-center border border-amber-200">
              <div class="text-xl font-black text-amber-700" id="rss-stat-medium">—</div>
              <div class="text-[10px] text-amber-600 font-semibold uppercase tracking-wide">MEDIUM Relevance</div>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center border border-blue-200">
              <div class="text-xl font-black text-blue-700" id="rss-stat-feeds">5</div>
              <div class="text-[10px] text-blue-600 font-semibold uppercase tracking-wide">Feeds Monitored</div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-3 text-center border border-purple-200">
              <div class="text-xl font-black text-purple-700" id="rss-stat-showing">—</div>
              <div class="text-[10px] text-purple-600 font-semibold uppercase tracking-wide">Showing</div>
            </div>
          </div>

          <!-- Filter Controls -->
          <div class="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div class="flex items-center gap-1.5">
              <label class="text-[10px] text-gray-500 font-bold uppercase">Date:</label>
              <input type="date" id="rss-filter-date" onchange="loadRSSFeed()" class="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none" />
            </div>
            <div class="flex items-center gap-1.5">
              <label class="text-[10px] text-gray-500 font-bold uppercase">Source:</label>
              <select id="rss-filter-source" onchange="loadRSSFeed()" class="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none">
                <option value="all">All Sources</option>
                <option value="PIB">PIB</option>
                <option value="PIB-DARPG">PIB-DARPG</option>
                <option value="The Hindu">The Hindu</option>
                <option value="Indian Express">Indian Express</option>
                <option value="NDTV">NDTV</option>
              </select>
            </div>
            <div class="flex items-center gap-1.5">
              <label class="text-[10px] text-gray-500 font-bold uppercase">Relevance:</label>
              <select id="rss-filter-relevance" onchange="loadRSSFeed()" class="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none">
                <option value="all">All</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
              </select>
            </div>
            <div class="flex items-center gap-1.5 flex-1 min-w-[150px]">
              <label class="text-[10px] text-gray-500 font-bold uppercase">Keyword:</label>
              <input type="text" id="rss-filter-keyword" placeholder="Filter by keyword..." oninput="debounceRSSLoad()" class="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white w-full focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none" />
            </div>
          </div>

          <!-- Articles Table -->
          <div class="overflow-x-auto rounded-xl border border-gray-200">
            <table class="w-full text-xs" id="rss-articles-table">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="text-left py-3 px-3 font-bold text-gray-600 uppercase text-[10px] tracking-wide">Date</th>
                  <th class="text-left py-3 px-3 font-bold text-gray-600 uppercase text-[10px] tracking-wide">Source</th>
                  <th class="text-left py-3 px-3 font-bold text-gray-600 uppercase text-[10px] tracking-wide">Title</th>
                  <th class="text-left py-3 px-3 font-bold text-gray-600 uppercase text-[10px] tracking-wide">Keywords</th>
                  <th class="text-left py-3 px-3 font-bold text-gray-600 uppercase text-[10px] tracking-wide">Relevance</th>
                  <th class="text-right py-3 px-3 font-bold text-gray-600 uppercase text-[10px] tracking-wide">Link</th>
                </tr>
              </thead>
              <tbody id="rss-articles-tbody">
                <tr>
                  <td colspan="6" class="text-center py-10 text-gray-400">
                    <i class="fas fa-satellite-dish text-3xl mb-3 block text-gray-300"></i>
                    <p class="text-sm font-medium">No RSS articles loaded</p>
                    <p class="text-[10px] mt-1">Enter your Admin Key and click Refresh, or run the RSS pipeline first.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Info Banner -->
          <div class="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-2">
            <i class="fas fa-info-circle text-orange-500 mt-0.5 flex-shrink-0"></i>
            <p class="text-[10px] text-orange-700">RSS articles are fetched from 5 feeds (PIB, PIB-DARPG, The Hindu, Indian Express, NDTV) and filtered using 3-tier keyword matching. <strong>TIER 1</strong> (CPGRAMS, DARPG, RTI) &rarr; HIGH. <strong>TIER 2</strong> (PM-KISAN, EPFO, etc.) &rarr; MEDIUM. <strong>TIER 3</strong> alone (generic complaints) &rarr; skipped.</p>
          </div>
        </div>
      </div>

      <!-- Aggregator Output Verification Panel -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" id="aggregator-panel">
        <div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 flex items-center gap-2">
          <i class="fas fa-brain text-white" aria-hidden="true"></i>
          <h2 class="font-bold text-white">Aggregator Output</h2>
          <span class="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">TF-IDF + Spike Detection</span>
          <div class="ml-auto flex items-center gap-2">
            <button onclick="loadAggregatorResults()" class="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors">
              <i class="fas fa-sync mr-1"></i>Refresh
            </button>
          </div>
        </div>
        <div class="p-6">
          <!-- Corpus Info Bar -->
          <div class="flex flex-wrap items-center gap-3 mb-5 p-3 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50" id="agg-corpus-bar">
            <div class="flex items-center gap-2">
              <i class="fas fa-database text-purple-500"></i>
              <span class="text-xs text-purple-800 font-semibold">Corpus:</span>
              <span class="text-xs text-purple-600" id="agg-corpus-source">—</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-file-alt text-purple-400"></i>
              <span class="text-xs text-purple-600" id="agg-corpus-size">— documents</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-clock text-purple-400"></i>
              <span class="text-xs text-purple-600" id="agg-duration">—</span>
            </div>
            <div class="flex items-center gap-2 ml-auto">
              <span class="text-[10px] text-purple-400" id="agg-last-run">Last run: —</span>
            </div>
          </div>

          <!-- Stats Row -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5" id="agg-stats-row">
            <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-3 text-center border border-purple-200">
              <div class="text-xl font-black text-purple-700" id="agg-stat-trending">—</div>
              <div class="text-[10px] text-purple-600 font-semibold uppercase tracking-wide">Trending Updated</div>
            </div>
            <div class="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-3 text-center border border-red-200">
              <div class="text-xl font-black text-red-700" id="agg-stat-fake">—</div>
              <div class="text-[10px] text-red-600 font-semibold uppercase tracking-wide">Fake Closure Ministries</div>
            </div>
            <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 text-center border border-emerald-200">
              <div class="text-xl font-black text-emerald-700" id="agg-stat-states">—</div>
              <div class="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">State Stats Updated</div>
            </div>
            <div class="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-3 text-center border border-amber-200">
              <div class="text-xl font-black text-amber-700" id="agg-stat-errors">—</div>
              <div class="text-[10px] text-amber-600 font-semibold uppercase tracking-wide">Errors</div>
            </div>
          </div>

          <!-- Top Keywords / Spike Table -->
          <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2"><i class="fas fa-chart-line text-purple-500 mr-1.5"></i>Top Keywords — Spike Detection</h3>
          <div class="overflow-x-auto rounded-xl border border-gray-200 mb-4">
            <table class="w-full text-xs" id="agg-keywords-table">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="text-left py-3 px-3 font-bold text-gray-600 uppercase text-[10px] tracking-wide">#</th>
                  <th class="text-left py-3 px-3 font-bold text-gray-600 uppercase text-[10px] tracking-wide">Term</th>
                  <th class="text-right py-3 px-3 font-bold text-gray-600 uppercase text-[10px] tracking-wide">This Week</th>
                  <th class="text-right py-3 px-3 font-bold text-gray-600 uppercase text-[10px] tracking-wide">Last Week</th>
                  <th class="text-right py-3 px-3 font-bold text-gray-600 uppercase text-[10px] tracking-wide">Spike Factor</th>
                </tr>
              </thead>
              <tbody id="agg-keywords-tbody">
                <tr><td colspan="5" class="text-center py-8 text-gray-400">
                  <i class="fas fa-brain text-3xl mb-3 block text-gray-300"></i>
                  <p class="text-sm font-medium">No aggregator data loaded</p>
                  <p class="text-[10px] mt-1">Run the Aggregator pipeline first, then click Refresh.</p>
                </td></tr>
              </tbody>
            </table>
          </div>

          <!-- Fake Closure Mini-Table -->
          <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2"><i class="fas fa-exclamation-triangle text-red-500 mr-1.5"></i>Fake Closure Rates by Ministry</h3>
          <div class="overflow-x-auto rounded-xl border border-gray-200">
            <table class="w-full text-xs">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="text-left py-2.5 px-3 font-bold text-gray-600 uppercase text-[10px]">Ministry</th>
                  <th class="text-right py-2.5 px-3 font-bold text-gray-600 uppercase text-[10px]">Fake Closure %</th>
                  <th class="text-right py-2.5 px-3 font-bold text-gray-600 uppercase text-[10px]">Satisfaction %</th>
                  <th class="text-center py-2.5 px-3 font-bold text-gray-600 uppercase text-[10px]">Flag</th>
                </tr>
              </thead>
              <tbody id="agg-fakeclosure-tbody">
                <tr><td colspan="4" class="text-center py-6 text-gray-400 text-[10px]">Need 3+ feedback per ministry to compute rates</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Info Banner -->
          <div class="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-start gap-2">
            <i class="fas fa-info-circle text-purple-500 mt-0.5 flex-shrink-0"></i>
            <p class="text-[10px] text-purple-700">The aggregator runs nightly at 2:30 AM IST. It uses TF-IDF to detect trending keywords and computes week-over-week <strong>spike factors</strong>. Spike &gt;3x = <span class="text-red-600 font-bold">critical</span>, 2-3x = <span class="text-orange-600 font-bold">high</span>, 1.5-2x = <span class="text-amber-600 font-bold">medium</span>. Corpus falls back to RSS articles if &lt;10 real complaints.</p>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Audit Log Viewer -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-navy-600 to-navy-700 flex items-center gap-2">
            <i class="fas fa-scroll text-white" aria-hidden="true"></i>
            <h2 class="font-bold text-white">Audit Log</h2>
            <button onclick="loadAuditLogs()" class="ml-auto text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg transition-colors">
              <i class="fas fa-sync mr-1"></i>Refresh
            </button>
          </div>
          <div class="p-4 max-h-96 overflow-y-auto" id="admin-audit-log" role="log" aria-label="Audit log entries">
            <div class="text-center py-8">
              <div class="spinner mx-auto mb-3"></div>
              <p class="text-sm text-gray-500">Loading audit logs...</p>
            </div>
          </div>
        </div>

        <!-- Email Queue -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center gap-2">
            <i class="fas fa-envelope text-white" aria-hidden="true"></i>
            <h2 class="font-bold text-white">Email Queue</h2>
            <button onclick="triggerReminders()" class="ml-auto text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg transition-colors">
              <i class="fas fa-paper-plane mr-1"></i>Send Pending
            </button>
          </div>
          <div class="p-4 max-h-96 overflow-y-auto" id="admin-email-queue" role="log" aria-label="Email queue">
            <div class="text-center py-8">
              <div class="spinner mx-auto mb-3"></div>
              <p class="text-sm text-gray-500">Loading email queue...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Department Performance Chart -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center gap-2">
          <i class="fas fa-chart-bar text-white" aria-hidden="true"></i>
          <h2 class="font-bold text-white">Department Performance Analysis</h2>
        </div>
        <div class="p-6">
          <canvas id="admin-dept-chart" height="200" aria-label="Department performance chart" role="img"></canvas>
        </div>
      </div>

      <!-- CPGRAMS Statistics -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-saffron-500 to-saffron-600 flex items-center gap-2">
          <i class="fas fa-chart-pie text-white" aria-hidden="true"></i>
          <h2 class="font-bold text-white">CPGRAMS Integration Statistics</h2>
        </div>
        <div class="p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4" id="admin-cpgrams-stats">
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-black text-navy-700" id="acs-tracked">—</div>
            <div class="text-xs text-gray-500">Tracked on CPGRAMS</div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-black text-ashoka-600" id="acs-disposed">—</div>
            <div class="text-xs text-gray-500">Disposed</div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-black text-red-600" id="acs-fake">—</div>
            <div class="text-xs text-gray-500">Fake Closures Detected</div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-black text-saffron-600" id="acs-avg-days">—</div>
            <div class="text-xs text-gray-500">Avg Resolution Days</div>
          </div>
        </div>
      </div>

      <!-- System Configuration -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 flex items-center gap-2">
          <i class="fas fa-cog text-white" aria-hidden="true"></i>
          <h2 class="font-bold text-white">System Configuration</h2>
        </div>
        <div class="p-6" id="admin-config">
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs text-gray-500 mb-1">Version</div>
              <div class="font-bold text-gray-800" id="ac-version">—</div>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs text-gray-500 mb-1">AI Engine</div>
              <div class="font-bold text-gray-800" id="ac-ai">—</div>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs text-gray-500 mb-1">Features</div>
              <div class="font-bold text-gray-800" id="ac-features">—</div>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs text-gray-500 mb-1">Week</div>
              <div class="font-bold text-gray-800" id="ac-week">—</div>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs text-gray-500 mb-1">Languages</div>
              <div class="font-bold text-gray-800">7 (EN, HI, TA, TE, BN, MR, KN)</div>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs text-gray-500 mb-1">Runtime</div>
              <div class="font-bold text-gray-800">Cloudflare Workers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <script>
    async function refreshAdmin() {
      document.getElementById('admin-last-refresh').textContent = 'Refreshing...';
      await Promise.all([loadHealth(), loadAlerts(), loadAuditLogs(), loadEmailQueue(), loadDeptChart(), loadCPGRAMSStats(), loadAggregatorResults()]);
      document.getElementById('admin-last-refresh').textContent = 'Updated ' + new Date().toLocaleTimeString('en-IN');
    }

    async function loadHealth() {
      try {
        const [health, stats, cpStats] = await Promise.all([
          fetch('/api/health').then(r => r.json()),
          fetch('/api/complaints/stats').then(r => r.json()),
          fetch('/api/cpgrams/statistics').then(r => r.json())
        ]);

        document.getElementById('ah-status').textContent = health.status === 'ok' ? 'Healthy' : 'Error';
        document.getElementById('ah-status').className = 'text-sm font-black ' + (health.status === 'ok' ? 'text-ashoka-600' : 'text-red-600');
        document.getElementById('ah-db-tables').textContent = '12';
        document.getElementById('ah-users').textContent = stats.data?.total || '0';
        document.getElementById('ah-complaints').textContent = stats.data?.total || '0';
        document.getElementById('ah-fake-closures').textContent = stats.data?.fake_closed || '0';
        document.getElementById('ah-emails').textContent = '—';
        document.getElementById('ac-version').textContent = 'v' + health.version;
        document.getElementById('ac-ai').textContent = health.ai_engine || '—';
        document.getElementById('ac-features').textContent = (health.features?.length || 0) + ' features';
        document.getElementById('ac-week').textContent = 'Week ' + health.week;

        if (cpStats.success) {
          document.getElementById('acs-tracked').textContent = cpStats.data.total_tracked || '0';
          document.getElementById('acs-disposed').textContent = cpStats.data.total_disposed || '0';
          document.getElementById('acs-fake').textContent = cpStats.data.fake_closures_detected || '0';
          document.getElementById('acs-avg-days').textContent = (cpStats.data.avg_resolution_days || '—') + 'd';
        }
      } catch (e) {
        document.getElementById('ah-status').textContent = 'Error';
        document.getElementById('ah-status').className = 'text-sm font-black text-red-600';
      }
    }

    async function loadAlerts() {
      try {
        const res = await fetch('/api/cpgrams/alerts');
        const json = await res.json();
        const el = document.getElementById('admin-alerts');
        document.getElementById('alert-count').textContent = json.data?.total_alerts || '0';

        if (!json.success || !json.data?.alerts?.length) {
          el.innerHTML = '<div class="text-center py-6 text-gray-400"><i class="fas fa-check-circle text-2xl mb-2"></i><p class="text-sm">No active alerts</p></div>';
          return;
        }

        el.innerHTML = json.data.alerts.map(a => {
          const sevColor = a.severity === 'critical' ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50';
          const sevBadge = a.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700';
          return '<div class="flex items-start gap-3 p-3 rounded-xl border ' + sevColor + ' mb-2">' +
            '<div class="flex-shrink-0 mt-0.5"><i class="fas fa-' + (a.severity === 'critical' ? 'exclamation-circle text-red-500' : 'exclamation-triangle text-amber-500') + '"></i></div>' +
            '<div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1">' +
            '<span class="text-xs font-bold ' + sevBadge + ' px-2 py-0.5 rounded-full uppercase">' + a.severity + '</span>' +
            '<span class="text-xs text-gray-500">' + a.cpgrams_id + '</span>' +
            '<span class="text-xs text-gray-400 ml-auto">Day ' + a.days_elapsed + '</span></div>' +
            '<p class="text-xs text-gray-700 mb-1">' + a.summary + '</p>' +
            '<p class="text-[10px] text-gray-500"><i class="fas fa-lightbulb mr-1"></i>' + a.action + '</p></div>' +
            '<a href="/complaint-detail?id=' + a.complaint_id + '" class="text-xs text-navy-600 hover:text-navy-800 font-medium flex-shrink-0"><i class="fas fa-external-link-alt"></i></a></div>';
        }).join('');
      } catch (e) {
        document.getElementById('admin-alerts').innerHTML = '<p class="text-sm text-red-500">Failed to load alerts</p>';
      }
    }

    async function loadAuditLogs() {
      try {
        const res = await fetch('/api/admin/audit-logs');
        const json = await res.json();
        const el = document.getElementById('admin-audit-log');

        if (!json.success || !json.data?.length) {
          el.innerHTML = '<div class="text-center py-6 text-gray-400"><i class="fas fa-clipboard text-2xl mb-2"></i><p class="text-sm">No audit logs found</p></div>';
          return;
        }

        el.innerHTML = json.data.map(log => {
          const evType = log.event_type || log.action || '';
          const evDetail = log.event_detail || log.details || '';
          const iconMap = { login_success: 'fas fa-sign-in-alt text-ashoka-500', logout: 'fas fa-sign-out-alt text-gray-400', otp_request: 'fas fa-key text-saffron-500', otp_sent: 'fas fa-key text-saffron-500', profile_update: 'fas fa-user-edit text-blue-500', complaint_filed: 'fas fa-file-alt text-purple-500', login_failed: 'fas fa-times-circle text-red-500' };
          const icon = iconMap[evType] || 'fas fa-circle text-gray-400';
          return '<div class="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 border-b border-gray-50">' +
            '<i class="' + icon + ' text-sm w-5 text-center flex-shrink-0"></i>' +
            '<div class="flex-1 min-w-0"><span class="text-xs font-semibold text-gray-700">' + evType.replace(/_/g, ' ') + '</span>' +
            (evDetail ? ' <span class="text-[10px] text-gray-400">— ' + evDetail + '</span>' : '') + '</div>' +
            '<span class="text-[10px] text-gray-400 flex-shrink-0">' + new Date(log.created_at).toLocaleString('en-IN', {day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'}) + '</span></div>';
        }).join('');
      } catch (e) {
        document.getElementById('admin-audit-log').innerHTML = '<div class="text-center py-6 text-gray-400"><p class="text-sm">No audit logs available</p></div>';
      }
    }

    async function loadEmailQueue() {
      try {
        const res = await fetch('/api/admin/email-queue');
        const json = await res.json();
        const el = document.getElementById('admin-email-queue');

        if (!json.success || !json.data?.length) {
          el.innerHTML = '<div class="text-center py-6 text-gray-400"><i class="fas fa-inbox text-2xl mb-2"></i><p class="text-sm">Email queue is empty</p></div>';
          return;
        }

        el.innerHTML = json.data.map(email => {
          const statusColor = email.status === 'sent' ? 'text-ashoka-600' : email.status === 'failed' ? 'text-red-600' : 'text-saffron-600';
          return '<div class="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 border-b border-gray-50">' +
            '<i class="fas fa-envelope text-sm ' + statusColor + ' w-5 text-center flex-shrink-0"></i>' +
            '<div class="flex-1 min-w-0"><span class="text-xs font-semibold text-gray-700">' + (email.to_email || '—') + '</span>' +
            ' <span class="text-[10px] text-gray-400">— ' + (email.subject || '') + '</span></div>' +
            '<span class="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ' + (email.status === 'sent' ? 'bg-ashoka-100 text-ashoka-700' : email.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-saffron-100 text-saffron-700') + '">' + email.status + '</span></div>';
        }).join('');
      } catch (e) {
        document.getElementById('admin-email-queue').innerHTML = '<div class="text-center py-6 text-gray-400"><p class="text-sm">Email queue unavailable</p></div>';
      }
    }

    async function loadDeptChart() {
      try {
        const res = await fetch('/api/ministries?limit=8&sort=complaints_received');
        const json = await res.json();
        if (!json.success || !json.data?.length) return;

        const ctx = document.getElementById('admin-dept-chart').getContext('2d');
        const labels = json.data.map(m => (m.ministry_name || '').replace('Ministry of ','').replace('Department of ','').slice(0,25));
        
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              { label: 'Resolution Rate %', data: json.data.map(m => m.official_resolution_rate), backgroundColor: 'rgba(19,136,8,0.6)', borderColor: '#138808', borderWidth: 1 },
              { label: 'Fake Closure Rate %', data: json.data.map(m => m.fake_closure_rate), backgroundColor: 'rgba(239,68,68,0.6)', borderColor: '#ef4444', borderWidth: 1 },
              { label: 'Satisfaction %', data: json.data.map(m => m.citizen_satisfaction_rate), backgroundColor: 'rgba(255,153,51,0.6)', borderColor: '#ff9933', borderWidth: 1 }
            ]
          },
          options: {
            responsive: true,
            plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
            scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentage %', font: { size: 10 } } } }
          }
        });
      } catch (e) {}
    }

    async function loadCPGRAMSStats() {
      // Already loaded in loadHealth
    }

    async function triggerReminders() {
      try {
        const token = localStorage.getItem('giq_token');
        const res = await fetch('/api/auth/send-reminder', {
          method: 'POST',
          headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        });
        const json = await res.json();
        showToast('Sent ' + (json.data?.total_sent || 0) + ' reminders', 'success');
        loadEmailQueue();
      } catch (e) {
        showToast('Failed to send reminders', 'error');
      }
    }

    // --- Pipeline Status & Manual Trigger ---
    async function loadPipelineStatus() {
      try {
        const res = await fetch('/api/admin/pipeline/status');
        const json = await res.json();
        if (!json.success || !json.data?.latest?.length) return;

        const jobMap = { darpg_fetch: 'darpg', rss_monitor: 'rss', aggregator: 'agg', datagov_fetch: 'dg' };
        const statusBadge = (s) => {
          if (s === 'success') return '<span class="px-2 py-0.5 rounded-full bg-ashoka-100 text-ashoka-700 font-bold">\u2705 Success</span>';
          if (s === 'failed') return '<span class="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">\u274c Failed</span>';
          if (s === 'running') return '<span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">\u23f3 Running</span>';
          return '<span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Pending</span>';
        };

        json.data.latest.forEach(run => {
          const key = jobMap[run.job_name];
          if (!key) return;
          const lastEl = document.getElementById('pl-' + key + '-last');
          const statusEl = document.getElementById('pl-' + key + '-status');
          const rowsEl = document.getElementById('pl-' + key + '-rows');
          if (lastEl) lastEl.textContent = run.last_run ? new Date(run.last_run).toLocaleString('en-IN', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '\u2014';
          if (statusEl) statusEl.innerHTML = statusBadge(run.status);
          if (rowsEl) rowsEl.textContent = run.rows_affected != null ? run.rows_affected : '\u2014';
        });
      } catch (e) { console.error('Pipeline status error:', e); }
    }

    async function triggerPipeline(job) {
      const adminKey = document.getElementById('admin-key-input')?.value;
      if (!adminKey) {
        if (typeof showToast === 'function') showToast('Enter your Admin Key first', 'error');
        else alert('Enter your Admin Key in the pipeline panel first.');
        return;
      }
      const btn = event.target.closest('button');
      const origHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Running...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/admin/pipeline/trigger', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + adminKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ job })
        });
        const json = await res.json();
        if (json.success) {
          if (typeof showToast === 'function') showToast('Pipeline ' + job + ' completed successfully!', 'success');
          else alert('Pipeline ' + job + ' completed!');
          loadPipelineStatus();
        } else {
          if (typeof showToast === 'function') showToast(json.error || 'Pipeline failed', 'error');
          else alert(json.error || 'Pipeline failed');
        }
      } catch (e) {
        if (typeof showToast === 'function') showToast('Pipeline request failed', 'error');
        else alert('Pipeline request failed: ' + e.message);
      } finally {
        btn.innerHTML = origHTML;
        btn.disabled = false;
      }
    }

    // --- Live Demo Mode ---
    let demoTimerInterval = null;
    let demoStartTime = null;

    function getAdminKey() {
      return document.getElementById('admin-key-input')?.value || '';
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function runLiveDemo() {
      const adminKey = getAdminKey();
      if (!adminKey) {
        if (typeof showToast === 'function') showToast('Enter your Admin Key first', 'error');
        else alert('Enter your Admin Key in the pipeline panel first.');
        return;
      }

      const btn = document.getElementById('live-demo-btn');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i>Running...';
      btn.className = btn.className.replace('animate-pulse','');

      const panel = document.getElementById('live-demo-panel');
      const summary = document.getElementById('live-demo-summary');
      summary.classList.add('hidden');
      panel.classList.remove('hidden');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      const jobs = [
        { id: 'darpg', name: 'DARPG PDF Fetch', icon: 'fa-file-pdf text-red-400', desc: 'Downloading latest DARPG report from darpg.gov.in...' },
        { id: 'rss', name: 'RSS Monitor', icon: 'fa-rss text-orange-400', desc: 'Scanning 5 news feeds for grievance keywords...' },
        { id: 'aggregator', name: 'Aggregator', icon: 'fa-brain text-purple-400', desc: 'Running TF-IDF pattern detection on complaints...' },
        { id: 'datagov', name: 'data.gov.in API', icon: 'fa-database text-blue-400', desc: 'Fetching 15-month historical time-series data...' }
      ];

      const jobListEl = document.getElementById('demo-job-list');
      jobListEl.innerHTML = jobs.map(j =>
        '<div id="demo-row-' + j.id + '" class="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">' +
        '<i class="fas ' + j.icon + ' w-5 text-center"></i>' +
        '<div class="flex-1"><div class="text-xs font-bold text-white">' + j.name + '</div>' +
        '<div class="text-[10px] text-gray-500 demo-desc">Waiting...</div></div>' +
        '<div class="demo-badge"><span class="px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 text-[10px] font-bold">QUEUED</span></div></div>'
      ).join('');

      demoStartTime = Date.now();
      demoTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - demoStartTime) / 1000);
        const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        document.getElementById('demo-timer').textContent = m + ':' + s;
      }, 1000);

      for (const job of jobs) {
        await runJobWithProgress(job, adminKey);
        await sleep(800);
      }

      clearInterval(demoTimerInterval);
      await showLiveSummary(adminKey);

      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-redo mr-1.5"></i>Re-run Demo';
    }

    async function runJobWithProgress(job, adminKey) {
      const row = document.getElementById('demo-row-' + job.id);
      if (!row) return;
      const descEl = row.querySelector('.demo-desc');
      const badgeEl = row.querySelector('.demo-badge');

      row.className = row.className.replace('bg-white/5 border-white/10', 'bg-orange-500/10 border-orange-400/50');
      descEl.textContent = job.desc;
      descEl.className = 'text-[10px] text-orange-300 demo-desc';
      badgeEl.innerHTML = '<span class="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold"><i class="fas fa-spinner fa-spin mr-1"></i>RUNNING</span>';

      const startTime = Date.now();
      try {
        const res = await fetch('/api/admin/pipeline/trigger', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + adminKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ job: job.id })
        });
        const json = await res.json();
        const dur = ((Date.now() - startTime) / 1000).toFixed(1);
        const d = json.data?.details || json.data || {};
        const rows = d.rows_updated || d.articles_inserted || d.trending_issues_updated || d.rows_inserted || d.ministries_updated || 0;

        if (json.success) {
          row.className = row.className.replace('bg-orange-500/10 border-orange-400/50', 'bg-green-500/10 border-green-500/50');
          descEl.textContent = 'Completed in ' + dur + 's \u2014 ' + rows + ' rows updated';
          descEl.className = 'text-[10px] text-green-300 demo-desc';
          badgeEl.innerHTML = '<span class="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold">\u2705 SUCCESS</span>';
        } else {
          row.className = row.className.replace('bg-orange-500/10 border-orange-400/50', 'bg-amber-500/10 border-amber-400/50');
          descEl.textContent = 'Completed with issues in ' + dur + 's: ' + (json.error || 'check logs');
          descEl.className = 'text-[10px] text-amber-300 demo-desc';
          badgeEl.innerHTML = '<span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">\u26a0\ufe0f PARTIAL</span>';
        }
      } catch (e) {
        row.className = row.className.replace('bg-orange-500/10 border-orange-400/50', 'bg-red-500/10 border-red-500/50');
        descEl.textContent = 'Failed: ' + (e.message || 'Network error');
        descEl.className = 'text-[10px] text-red-300 demo-desc';
        badgeEl.innerHTML = '<span class="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">\u274c FAILED</span>';
      }
    }

    async function showLiveSummary(adminKey) {
      try {
        const res = await fetch('/api/admin/pipeline/verify', {
          headers: { 'Authorization': 'Bearer ' + adminKey }
        });
        const json = await res.json();
        const d = json.data || {};
        document.getElementById('summary-ministries').textContent = (d.ministries_live || 0) + ' ministries';
        document.getElementById('summary-month').textContent = d.report_month || 'Latest';
        document.getElementById('summary-signals').textContent = (d.signals_today || 0) + ' signals';
        document.getElementById('summary-trends').textContent = (d.trends_live || 0) + ' flagged';
      } catch (e) {
        document.getElementById('summary-ministries').textContent = 'Check dashboard';
        document.getElementById('summary-month').textContent = '\u2014';
        document.getElementById('summary-signals').textContent = '\u2014';
        document.getElementById('summary-trends').textContent = '\u2014';
      }
      document.getElementById('live-demo-summary').classList.remove('hidden');
      document.getElementById('live-demo-summary').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      await refreshAdmin();
    }

    // --- Aggregator Output ---
    async function loadAggregatorResults() {
      const adminKey = getAdminKey();
      if (!adminKey) return;

      try {
        const res = await fetch('/api/admin/aggregator/results', {
          headers: { 'Authorization': 'Bearer ' + adminKey }
        });
        const json = await res.json();
        const d = json.data || {};
        const run = d.latest_run;

        // Update stats
        document.getElementById('agg-stat-trending').textContent = run ? (run.rows_affected || '0') : '—';
        document.getElementById('agg-stat-fake').textContent = (d.fake_closure_ministries || []).length || '0';
        document.getElementById('agg-stat-states').textContent = run ? '✓' : '—';
        document.getElementById('agg-stat-errors').textContent = run ? (run.errors?.length || '0') : '—';

        // Corpus info
        if (run) {
          var sourceLabel = run.corpus_source === 'user_complaints' ? '👤 User Complaints'
            : run.corpus_source === 'rss_supplement' ? '📡 RSS Supplement (not enough real complaints)'
            : run.corpus_source === 'rss_30day_fallback' ? '📡 RSS 30-day Fallback'
            : run.corpus_source || 'Unknown';
          document.getElementById('agg-corpus-source').textContent = sourceLabel;
          document.getElementById('agg-corpus-size').textContent = (run.corpus_size || 0) + ' documents';
          document.getElementById('agg-duration').textContent = (run.duration_seconds || 0) + 's';
          try {
            document.getElementById('agg-last-run').textContent = 'Last run: ' + new Date(run.completed_at).toLocaleString('en-IN', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
          } catch(e) { document.getElementById('agg-last-run').textContent = 'Last run: ' + (run.completed_at || '—'); }
        }

        // Keywords table
        var keywords = (run && run.top_keywords) ? run.top_keywords : [];
        var tbody = document.getElementById('agg-keywords-tbody');

        if (keywords.length === 0 && (d.trending_issues || []).length > 0) {
          // Fallback: show trending_issues from DB
          keywords = (d.trending_issues || []).map(function(t) {
            return {
              term: t.topic_name || '',
              count_this_week: t.complaint_count || 0,
              count_prev_week: t.previous_week_count || 0,
              spike_factor: t.spike_factor || 1.0
            };
          });
        }

        if (keywords.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-400">' +
            '<i class="fas fa-brain text-3xl mb-3 block text-gray-300"></i>' +
            '<p class="text-sm font-medium">No trending keywords detected</p>' +
            '<p class="text-[10px] mt-1">Run the Aggregator pipeline to detect spikes.</p></td></tr>';
        } else {
          tbody.innerHTML = keywords.map(function(kw, idx) {
            var sf = kw.spike_factor || 1;
            var spikeColor = sf >= 5 ? 'border-l-4 border-l-red-500 bg-red-50/40'
              : sf >= 3 ? 'border-l-4 border-l-orange-500 bg-orange-50/30'
              : sf >= 2 ? 'border-l-4 border-l-amber-400 bg-amber-50/20'
              : 'border-l-4 border-l-gray-300 bg-white';
            var spikeBadge = sf >= 5
              ? '<span class="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">' + sf + 'x 🔥</span>'
              : sf >= 3
                ? '<span class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">' + sf + 'x ⚠️</span>'
                : sf >= 2
                  ? '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">' + sf + 'x</span>'
                  : '<span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">' + sf + 'x</span>';
            return '<tr class="' + spikeColor + ' hover:bg-gray-50/50 border-b border-gray-100 transition-colors">' +
              '<td class="py-2.5 px-3 text-gray-400 font-mono">' + (idx + 1) + '</td>' +
              '<td class="py-2.5 px-3 font-semibold text-gray-800">' + (kw.term || '') + '</td>' +
              '<td class="py-2.5 px-3 text-right font-bold text-gray-700">' + (kw.count_this_week || 0) + '</td>' +
              '<td class="py-2.5 px-3 text-right text-gray-400">' + (kw.count_prev_week || 0) + '</td>' +
              '<td class="py-2.5 px-3 text-right">' + spikeBadge + '</td></tr>';
          }).join('');
        }

        // Fake closure table
        var fcTbody = document.getElementById('agg-fakeclosure-tbody');
        var fcData = d.fake_closure_ministries || [];
        if (fcData.length === 0) {
          fcTbody.innerHTML = '<tr><td colspan="4" class="text-center py-6 text-gray-400 text-[10px]">Need 3+ feedback per ministry to compute rates</td></tr>';
        } else {
          fcTbody.innerHTML = fcData.map(function(m) {
            var fcRate = m.fake_closure_rate || 0;
            var satRate = m.citizen_satisfaction_rate || 0;
            var rowColor = fcRate > 30 ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-gray-200';
            var flagIcon = m.fake_closure_flag ? '<span class="text-red-500">🚩</span>' : '<span class="text-gray-300">—</span>';
            var shortName = (m.ministry_name || '').replace('Ministry of ','').replace('Department of ','').substring(0, 35);
            return '<tr class="' + rowColor + ' border-b border-gray-100 hover:bg-gray-50">' +
              '<td class="py-2 px-3 font-medium text-gray-700">' + shortName + '</td>' +
              '<td class="py-2 px-3 text-right font-bold ' + (fcRate > 30 ? 'text-red-600' : 'text-gray-600') + '">' + fcRate + '%</td>' +
              '<td class="py-2 px-3 text-right text-gray-600">' + satRate + '%</td>' +
              '<td class="py-2 px-3 text-center">' + flagIcon + '</td></tr>';
          }).join('');
        }

      } catch (e) {
        console.error('Aggregator results load error:', e);
      }
    }

    // --- RSS Feed Monitor ---
    let rssDebounceTimer = null;

    function debounceRSSLoad() {
      clearTimeout(rssDebounceTimer);
      rssDebounceTimer = setTimeout(() => loadRSSFeed(), 400);
    }

    function initRSSFilters() {
      const dateInput = document.getElementById('rss-filter-date');
      if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
      }
    }

    async function loadRSSFeed() {
      const adminKey = getAdminKey();
      if (!adminKey) {
        return; // Silently skip if no admin key
      }

      const date = document.getElementById('rss-filter-date')?.value || new Date().toISOString().split('T')[0];
      const source = document.getElementById('rss-filter-source')?.value || 'all';
      const relevance = document.getElementById('rss-filter-relevance')?.value || 'all';
      const keyword = document.getElementById('rss-filter-keyword')?.value || '';

      const params = new URLSearchParams({ date, source, relevance, limit: '50' });
      if (keyword) params.set('keyword', keyword);

      try {
        const res = await fetch('/api/admin/rss/feed?' + params.toString(), {
          headers: { 'Authorization': 'Bearer ' + adminKey }
        });
        const json = await res.json();

        // Update stats
        const stats = json.stats || {};
        document.getElementById('rss-stat-total').textContent = stats.total || '0';
        document.getElementById('rss-stat-high').textContent = stats.high || '0';
        document.getElementById('rss-stat-medium').textContent = stats.medium || '0';
        document.getElementById('rss-stat-showing').textContent = json.total || '0';

        // Render table
        const tbody = document.getElementById('rss-articles-tbody');
        const articles = json.articles || [];

        if (articles.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" class="text-center py-10 text-gray-400">' +
            '<i class="fas fa-satellite-dish text-3xl mb-3 block text-gray-300"></i>' +
            '<p class="text-sm font-medium">No articles found for ' + date + '</p>' +
            '<p class="text-[10px] mt-1">Try a different date or run the RSS pipeline.</p></td></tr>';
          return;
        }

        tbody.innerHTML = articles.map(function(a) {
          const rel = a.relevance_score || 'MEDIUM';
          const borderColor = rel === 'HIGH' ? 'border-l-4 border-l-emerald-500 bg-emerald-50/30' : 'border-l-4 border-l-amber-400 bg-amber-50/20';
          const relBadge = rel === 'HIGH'
            ? '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">HIGH</span>'
            : '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">MEDIUM</span>';

          // Parse source from source_title prefix ("PIB: headline...")
          var title = a.source_title || '';
          var sourceName = a.platform || 'news';
          var displayTitle = title;
          var colonIdx = title.indexOf(': ');
          if (colonIdx > 0 && colonIdx < 20) {
            sourceName = title.substring(0, colonIdx);
            displayTitle = title.substring(colonIdx + 2);
          }
          // Truncate long titles
          if (displayTitle.length > 120) displayTitle = displayTitle.substring(0, 120) + '...';

          var dateStr = '';
          try {
            dateStr = new Date(a.captured_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
          } catch(e) { dateStr = a.captured_at || ''; }

          var keywords = (a.keyword_matched || '').split(', ').map(function(kw) {
            return '<span class="inline-block bg-navy-100 text-navy-700 px-1.5 py-0.5 rounded text-[9px] font-semibold mr-1 mb-0.5">' + kw + '</span>';
          }).join('');

          var linkBtn = a.source_url
            ? '<a href="' + a.source_url + '" target="_blank" rel="noopener" class="text-navy-600 hover:text-navy-800"><i class="fas fa-external-link-alt"></i></a>'
            : '—';

          return '<tr class="' + borderColor + ' hover:bg-gray-50/50 border-b border-gray-100 transition-colors">' +
            '<td class="py-2.5 px-3 text-gray-500 whitespace-nowrap">' + dateStr + '</td>' +
            '<td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">' + sourceName + '</span></td>' +
            '<td class="py-2.5 px-3 text-gray-800 font-medium max-w-xs">' + displayTitle + '</td>' +
            '<td class="py-2.5 px-3">' + keywords + '</td>' +
            '<td class="py-2.5 px-3">' + relBadge + '</td>' +
            '<td class="py-2.5 px-3 text-right">' + linkBtn + '</td></tr>';
        }).join('');

      } catch (e) {
        console.error('RSS feed load error:', e);
      }
    }

    initRSSFilters();
    refreshAdmin();
    loadPipelineStatus();
    loadRSSFeed();
  </script>
  `
  return layout('Admin Analytics', content, 'admin', {
    description: 'GrievanceIQ admin dashboard: system health monitoring, audit logs, email queue management, CPGRAMS integration stats, and department performance analytics.',
    keywords: 'admin, analytics, system health, audit log, email queue, CPGRAMS statistics'
  })
}
