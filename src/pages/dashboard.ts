import { layout } from './layout'

export function dashboardPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-800 to-navy-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
            <i class="fas fa-chart-line text-saffron-400 mr-2" aria-hidden="true"></i><span data-i18n="dashboard_title">Public Accountability Dashboard</span>
          </h1>
          <p class="text-gray-300 text-sm" data-i18n="dashboard_subtitle">Real-time grievance intelligence for journalists, NGOs, and researchers. No login required.</p>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="exportDashboardPDF()" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
            <i class="fas fa-file-pdf mr-1.5"></i>Export PDF
          </button>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-ashoka-400 pulse-dot"></span>
            <span class="text-xs text-gray-400 font-medium">Live data &bull; Updated March 2026</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats Overview -->
  <section class="py-6 bg-gray-50 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3" id="dashStats">
        <div class="bg-white rounded-xl p-4 shadow-sm text-center"><div class="text-xl font-black text-navy-700" id="ds-total">&mdash;</div><div class="text-xs text-gray-500">Total Complaints</div></div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center"><div class="text-xl font-black text-ashoka-600" id="ds-resolved">&mdash;</div><div class="text-xs text-gray-500">Resolved</div></div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center"><div class="text-xl font-black text-saffron-600" id="ds-pending">&mdash;</div><div class="text-xs text-gray-500">Pending</div></div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center"><div class="text-xl font-black text-red-600" id="ds-fake">&mdash;</div><div class="text-xs text-gray-500">Fake Closure Rate</div></div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center col-span-2 lg:col-span-1"><div class="text-xl font-black text-purple-600" id="ds-alerts">&mdash;</div><div class="text-xs text-gray-500">Active Alerts</div></div>
      </div>
    </div>
  </section>

  <!-- India Choropleth Map with District Drill-Down -->
  <section class="py-8 sm:py-12" id="map-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-navy-600 to-navy-700 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <i class="fas fa-map-location-dot text-white"></i>
            <h2 class="font-bold text-white">India Grievance Intelligence Map</h2>
            <span class="text-[10px] bg-ashoka-500/30 text-ashoka-200 px-2 py-0.5 rounded-full font-medium hidden sm:inline">GeoJSON + District Drill-Down</span>
          </div>
          <div class="flex items-center gap-2">
            <button id="backToIndiaBtn" onclick="backToIndiaMap()" class="hidden text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors">
              <i class="fas fa-arrow-left mr-1"></i>Back to India
            </button>
            <select id="mapMetric" onchange="updateMapColors()" class="text-xs bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 text-white focus:outline-none">
              <option value="total_complaints">Total Complaints</option>
              <option value="resolution_rate">Resolution Rate</option>
              <option value="fake_closure_rate">Fake Closure Rate</option>
              <option value="avg_resolution_days">Avg Resolution Days</option>
            </select>
          </div>
        </div>
        <div class="relative">
          <div id="indiaMap" style="height:580px;background:#f0f4ff;"></div>
          <div id="mapLoading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-[1000]">
            <div class="text-center">
              <div class="spinner mx-auto mb-2" style="width:32px;height:32px;border-width:3px;"></div>
              <p class="text-xs text-gray-500">Loading India GeoJSON boundaries...</p>
            </div>
          </div>
          <div class="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 z-[999]">
            <p class="text-xs font-semibold text-gray-600 mb-2" id="legendTitle">Complaints Volume</p>
            <div class="flex items-center gap-0.5" id="legendBar">
              <span class="w-5 h-3 rounded-sm" style="background:#fef3c7"></span>
              <span class="w-5 h-3 rounded-sm" style="background:#fcd34d"></span>
              <span class="w-5 h-3 rounded-sm" style="background:#f97316"></span>
              <span class="w-5 h-3 rounded-sm" style="background:#ef4444"></span>
              <span class="w-5 h-3 rounded-sm" style="background:#dc2626"></span>
              <span class="w-5 h-3 rounded-sm" style="background:#7f1d1d"></span>
            </div>
            <div class="flex justify-between mt-1"><span class="text-[10px] text-gray-400">Low</span><span class="text-[10px] text-gray-400">High</span></div>
          </div>
        </div>
        <!-- State/District info panel -->
        <div id="stateInfo" class="hidden px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
          <div id="stateInfoContent"></div>
        </div>
        <!-- District drill-down table -->
        <div id="districtPanel" class="hidden border-t border-gray-200">
          <div class="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center gap-2">
            <i class="fas fa-sitemap text-purple-600"></i>
            <h3 class="font-bold text-purple-800 text-sm" id="districtTitle">District Breakdown</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50"><tr>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500">#</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500">District</th>
                <th class="px-4 py-2 text-center text-xs font-semibold text-gray-500">Complaints</th>
                <th class="px-4 py-2 text-center text-xs font-semibold text-gray-500">Resolution</th>
                <th class="px-4 py-2 text-center text-xs font-semibold text-gray-500">Fake Closure</th>
                <th class="px-4 py-2 text-center text-xs font-semibold text-gray-500">Satisfaction</th>
                <th class="px-4 py-2 text-center text-xs font-semibold text-gray-500">Avg Days</th>
                <th class="px-4 py-2 text-center text-xs font-semibold text-gray-500">Trend</th>
              </tr></thead>
              <tbody id="districtBody" class="divide-y divide-gray-100"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- NEW: Time-Series Analysis -->
  <section class="py-8 sm:py-12 bg-gray-50" id="timeseries">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl sm:text-2xl font-bold text-navy-800 mb-6"><i class="fas fa-chart-area text-saffron-500 mr-2"></i>Monthly Trends &mdash; 15-Month Analysis</h2>
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- National complaints time-series -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-3 bg-gradient-to-r from-navy-600 to-navy-700">
            <h3 class="font-bold text-white text-sm"><i class="fas fa-chart-line mr-1.5"></i>National Complaints &mdash; Monthly Trend</h3>
          </div>
          <div class="p-4" style="height:340px;"><canvas id="tsNationalChart"></canvas></div>
        </div>
        <!-- Satisfaction & Fake Closure Trend -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-3 bg-gradient-to-r from-ashoka-600 to-ashoka-700">
            <h3 class="font-bold text-white text-sm"><i class="fas fa-face-smile mr-1.5"></i>Satisfaction vs Fake Closure Trend</h3>
          </div>
          <div class="p-4" style="height:340px;"><canvas id="tsSatFakeChart"></canvas></div>
        </div>
        <!-- Top Ministry Comparison over time -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden lg:col-span-2">
          <div class="px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-700">
            <h3 class="font-bold text-white text-sm"><i class="fas fa-ranking-star mr-1.5"></i>Top 5 Ministries &mdash; Complaint Volume Over Time</h3>
          </div>
          <div class="p-4" style="height:360px;"><canvas id="tsMinistryChart"></canvas></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Charts Section (original 4 charts) -->
  <section class="py-8 sm:py-12" id="charts">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl sm:text-2xl font-bold text-navy-800 mb-6"><i class="fas fa-chart-bar text-saffron-500 mr-2"></i>Analytics Overview</h2>
      <div class="grid lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-700"><h3 class="font-bold text-white text-sm"><i class="fas fa-building-columns mr-1.5"></i>Top 10 Ministries &mdash; Complaint Volume</h3></div>
          <div class="p-4" style="height:340px;"><canvas id="ministryBarChart"></canvas></div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600"><h3 class="font-bold text-white text-sm"><i class="fas fa-chart-pie mr-1.5"></i>Resolution Status Distribution</h3></div>
          <div class="p-4 flex items-center justify-center" style="height:340px;"><canvas id="statusDoughnutChart"></canvas></div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-3 bg-gradient-to-r from-red-600 to-red-700"><h3 class="font-bold text-white text-sm"><i class="fas fa-mask mr-1.5"></i>Fake Closure Rate &mdash; Top Offenders</h3></div>
          <div class="p-4" style="height:340px;"><canvas id="fakeClosureChart"></canvas></div>
        </div>
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-3 bg-gradient-to-r from-navy-600 to-navy-700"><h3 class="font-bold text-white text-sm"><i class="fas fa-clock mr-1.5"></i>Average Resolution Days</h3></div>
          <div class="p-4" style="height:340px;"><canvas id="resolutionDaysChart"></canvas></div>
        </div>
      </div>
    </div>
  </section>

  <!-- NEW: Department Comparison Radar -->
  <section class="py-8 sm:py-12 bg-gray-50" id="radar">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl sm:text-2xl font-bold text-navy-800 mb-6"><i class="fas fa-crosshairs text-saffron-500 mr-2"></i>Department Comparison Radar</h2>
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center justify-between">
          <h3 class="font-bold text-white text-sm"><i class="fas fa-radar mr-1.5"></i>Multi-Metric Comparison &mdash; Top 6 Ministries</h3>
        </div>
        <div class="p-6 flex justify-center" style="height:420px;"><canvas id="radarChart" style="max-width:600px;"></canvas></div>
      </div>
    </div>
  </section>

  <!-- NEW: State Sparklines -->
  <section class="py-8 sm:py-12" id="sparklines">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl sm:text-2xl font-bold text-navy-800 mb-6"><i class="fas fa-wave-square text-saffron-500 mr-2"></i>State Sparklines &mdash; 6-Month Mini Trends</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" id="sparklineGrid"></div>
    </div>
  </section>

  <!-- NEW: Resolution Funnel (Week 7) -->
  <section class="py-8 sm:py-12" id="funnel" data-lazy>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl sm:text-2xl font-bold text-navy-800 mb-6"><i class="fas fa-filter text-saffron-500 mr-2"></i>Resolution Funnel &mdash; National Pipeline</h2>
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-700">
          <h3 class="font-bold text-white text-sm"><i class="fas fa-chart-waterfall mr-1.5"></i>Complaint Journey: Filing to Resolution</h3>
        </div>
        <div class="p-6" id="funnelContainer">
          <div class="text-center py-10"><div class="spinner mx-auto mb-2" style="width:24px;height:24px;"></div><p class="text-xs text-gray-400">Loading funnel data...</p></div>
        </div>
      </div>
    </div>
  </section>

  <!-- NEW: Complaint Heatmap Calendar (Week 7) -->
  <section class="py-8 sm:py-12 bg-gray-50" id="heatmap" data-lazy>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl sm:text-2xl font-bold text-navy-800 mb-6"><i class="fas fa-calendar-days text-saffron-500 mr-2"></i>Complaint Activity Heatmap &mdash; 12 Months</h2>
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-between">
          <h3 class="font-bold text-white text-sm"><i class="fas fa-fire mr-1.5"></i>Daily Complaint Volume Heatmap</h3>
          <div class="flex items-center gap-1.5" id="heatLegend">
            <span class="text-[10px] text-white/70">Less</span>
            <span class="w-3 h-3 rounded-sm" style="background:#ecfdf5"></span>
            <span class="w-3 h-3 rounded-sm" style="background:#6ee7b7"></span>
            <span class="w-3 h-3 rounded-sm" style="background:#10b981"></span>
            <span class="w-3 h-3 rounded-sm" style="background:#047857"></span>
            <span class="w-3 h-3 rounded-sm" style="background:#064e3b"></span>
            <span class="text-[10px] text-white/70">More</span>
          </div>
        </div>
        <div class="p-6 overflow-x-auto" id="heatmapContainer">
          <div class="text-center py-10"><div class="spinner mx-auto mb-2" style="width:24px;height:24px;"></div><p class="text-xs text-gray-400">Loading heatmap data...</p></div>
        </div>
      </div>
    </div>
  </section>

  <!-- NEW: Department Network Graph (Week 7) -->
  <section class="py-8 sm:py-12" id="network" data-lazy>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl sm:text-2xl font-bold text-navy-800 mb-6"><i class="fas fa-diagram-project text-saffron-500 mr-2"></i>Department Interaction Network</h2>
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-5 py-3 bg-gradient-to-r from-rose-600 to-pink-700">
          <h3 class="font-bold text-white text-sm"><i class="fas fa-share-nodes mr-1.5"></i>Inter-Ministry Complaint Transfer Network &mdash; Top 15</h3>
        </div>
        <div class="p-4" id="networkContainer" style="height:500px; position:relative;">
          <div class="text-center py-10"><div class="spinner mx-auto mb-2" style="width:24px;height:24px;"></div><p class="text-xs text-gray-400">Loading network data...</p></div>
          <canvas id="networkCanvas" style="position:absolute;inset:0;width:100%;height:100%;"></canvas>
        </div>
        <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-3 text-[10px] text-gray-500">
          <span><span class="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>Good satisfaction</span>
          <span><span class="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>Average</span>
          <span><span class="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>Flagged</span>
          <span><span class="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>High fake closure</span>
          <span class="ml-auto">Line thickness = transfer volume</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Department Scorecard -->
  <section class="py-8 sm:py-12 bg-gray-50" id="scorecard">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-between">
          <div class="flex items-center gap-2"><i class="fas fa-ranking-star text-white"></i><h2 class="font-bold text-white">Department Accountability Scorecard</h2></div>
          <select id="scorecardSort" onchange="loadScorecard()" class="text-xs bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 text-white focus:outline-none">
            <option value="complaints_received">By Volume</option>
            <option value="fake_closure_rate">By Fake Closure Rate</option>
            <option value="citizen_satisfaction_rate">By Citizen Satisfaction</option>
            <option value="avg_resolution_days">By Resolution Time</option>
          </select>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50"><tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ministry</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Received</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Official Rate</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Citizen Rate</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Fake Closure</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Avg Days</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Flag</th>
            </tr></thead>
            <tbody id="scorecardBody" class="divide-y divide-gray-100"></tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <!-- Trending Issues -->
  <section class="py-8 sm:py-12" id="trending">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <span class="w-3 h-3 rounded-full bg-red-500 pulse-dot"></span>
          <h2 class="text-xl sm:text-2xl font-bold text-navy-800">Systemic Issue Radar</h2>
        </div>
        <span class="text-xs text-gray-400">Week of March 2026</span>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" id="trendingGrid"></div>
    </div>
  </section>

  <!-- Social Signals -->
  <section class="py-8 sm:py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl font-bold text-navy-800 mb-6"><i class="fas fa-signal mr-2 text-saffron-500"></i>Social Monitoring Feed</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" id="socialGrid"></div>
    </div>
  </section>

  <script>
    // ============================================
    // DATA STORAGE
    // ============================================
    let stateData = [];
    let ministryData = [];
    let timeseriesData = null;
    let radarData = null;
    let sparklineData = null;
    let map;
    let geoLayer;
    let isDistrictView = false;
    const GEOJSON_URL = 'https://cdn.jsdelivr.net/npm/geojson-india/india.json';

    const stateNameToCode = {
      'Andaman and Nicobar Islands':'AN','Andhra Pradesh':'AP','Arunachal Pradesh':'AR',
      'Assam':'AS','Bihar':'BR','Chandigarh':'CH','Chhattisgarh':'CG',
      'Dadra and Nagar Haveli':'DN','Daman and Diu':'DN','Delhi':'DL',
      'Goa':'GA','Gujarat':'GJ','Haryana':'HR','Himachal Pradesh':'HP',
      'Jammu and Kashmir':'JK','Jharkhand':'JH','Karnataka':'KA','Kerala':'KL',
      'Ladakh':'LA','Lakshadweep':'LD','Madhya Pradesh':'MP','Maharashtra':'MH',
      'Manipur':'MN','Meghalaya':'ML','Mizoram':'MZ','Nagaland':'NL',
      'Odisha':'OD','Puducherry':'PY','Punjab':'PB','Rajasthan':'RJ',
      'Sikkim':'SK','Tamil Nadu':'TN','Telangana':'TG','Tripura':'TR',
      'Uttar Pradesh':'UP','Uttarakhand':'UK','West Bengal':'WB'
    };

    // ============================================
    // LOAD DASHBOARD DATA
    // ============================================
    async function loadDashboard() {
      try {
        const res = await fetch('/api/stats');
        const json = await res.json();
        if (json.success) {
          const d = json.data;
          document.getElementById('ds-total').textContent = Number(d.total_complaints).toLocaleString('en-IN');
          document.getElementById('ds-resolved').textContent = Number(d.total_resolved).toLocaleString('en-IN');
          document.getElementById('ds-pending').textContent = Number(d.total_pending).toLocaleString('en-IN');
          document.getElementById('ds-fake').textContent = d.avg_fake_closure_rate + '%';
          document.getElementById('ds-alerts').textContent = d.active_alerts;
        }
      } catch(e) {}

      try {
        const res = await fetch('/api/states');
        const json = await res.json();
        if (json.success) { stateData = json.data; initMap(); }
      } catch(e) {}

      try {
        const res = await fetch('/api/ministries?limit=30');
        const json = await res.json();
        if (json.success) { ministryData = json.data; initCharts(); }
      } catch(e) {}

      loadScorecard();
      loadTrendingDash();
      loadSocial();
      loadTimeSeries();
      loadRadarChart();
      loadSparklines();
    }

    // ============================================
    // INDIA MAP — GeoJSON CHOROPLETH + DISTRICT DRILL-DOWN
    // ============================================
    async function initMap() {
      map = L.map('indiaMap', { center:[22.5,82], zoom:5, minZoom:4, maxZoom:7, zoomControl:true, attributionControl:false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {maxZoom:19}).addTo(map);

      try {
        const res = await fetch(GEOJSON_URL);
        const geojson = await res.json();
        
        geoLayer = L.geoJSON(geojson, {
          style: (feature) => getStateStyle(feature),
          onEachFeature: (feature, layer) => {
            const code = stateNameToCode[feature.properties.name];
            const state = stateData.find(s => s.state_code === code);
            const tooltipContent = state 
              ? '<strong>' + feature.properties.name + '</strong><br>' + Number(state.total_complaints).toLocaleString() + ' complaints<br>Resolution: ' + state.resolution_rate + '%<br>Fake Closure: ' + state.fake_closure_rate + '%'
              : '<strong>' + feature.properties.name + '</strong><br>No data';
            layer.bindTooltip(tooltipContent, {direction:'auto', className:'leaflet-tooltip-custom', sticky:true});
            layer.on('click', () => { if (state) { showStateInfo(state); loadDistrictData(state.state_code); } });
            layer.on('mouseover', (e) => { e.target.setStyle({weight:3, color:'#1a365d', fillOpacity:0.9}); e.target.bringToFront(); });
            layer.on('mouseout', (e) => { geoLayer.resetStyle(e.target); });
            layer.stateCode = code;
            layer.stateDataRef = state;
          }
        }).addTo(map);
        document.getElementById('mapLoading').style.display = 'none';
      } catch(e) {
        document.getElementById('mapLoading').innerHTML = '<div class="text-center"><i class="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i><p class="text-xs text-red-500">Map data unavailable.</p></div>';
      }
    }

    function getStateStyle(feature) {
      const code = stateNameToCode[feature.properties.name];
      const state = stateData.find(s => s.state_code === code);
      const metric = document.getElementById('mapMetric').value;
      return { fillColor: getChoroplethColor(state ? (state[metric]||0) : 0, metric), weight:1.5, opacity:1, color:'#94a3b8', fillOpacity:0.75 };
    }

    function getChoroplethColor(val, metric) {
      if (metric==='total_complaints') return val>50000?'#7f1d1d':val>35000?'#dc2626':val>20000?'#ef4444':val>10000?'#f97316':val>5000?'#fcd34d':'#fef3c7';
      if (metric==='fake_closure_rate') return val>20?'#7f1d1d':val>16?'#dc2626':val>12?'#ef4444':val>8?'#f97316':val>4?'#fcd34d':'#fef3c7';
      if (metric==='resolution_rate') return val>82?'#14532d':val>78?'#22c55e':val>74?'#86efac':val>70?'#fcd34d':val>65?'#f97316':'#dc2626';
      return val>45?'#7f1d1d':val>38?'#dc2626':val>32?'#ef4444':val>26?'#f97316':val>20?'#fcd34d':'#fef3c7';
    }

    function updateMapColors() {
      if (!geoLayer) return;
      const metric = document.getElementById('mapMetric').value;
      const labels = { total_complaints:'Complaints Volume', resolution_rate:'Resolution Rate', fake_closure_rate:'Fake Closure Rate', avg_resolution_days:'Avg Days to Resolve' };
      document.getElementById('legendTitle').textContent = labels[metric];
      const legendBar = document.getElementById('legendBar');
      if (metric==='resolution_rate') legendBar.innerHTML = '<span class="w-5 h-3 rounded-sm" style="background:#dc2626"></span><span class="w-5 h-3 rounded-sm" style="background:#f97316"></span><span class="w-5 h-3 rounded-sm" style="background:#fcd34d"></span><span class="w-5 h-3 rounded-sm" style="background:#86efac"></span><span class="w-5 h-3 rounded-sm" style="background:#22c55e"></span><span class="w-5 h-3 rounded-sm" style="background:#14532d"></span>';
      else legendBar.innerHTML = '<span class="w-5 h-3 rounded-sm" style="background:#fef3c7"></span><span class="w-5 h-3 rounded-sm" style="background:#fcd34d"></span><span class="w-5 h-3 rounded-sm" style="background:#f97316"></span><span class="w-5 h-3 rounded-sm" style="background:#ef4444"></span><span class="w-5 h-3 rounded-sm" style="background:#dc2626"></span><span class="w-5 h-3 rounded-sm" style="background:#7f1d1d"></span>';
      geoLayer.eachLayer(layer => { if (layer.feature) layer.setStyle(getStateStyle(layer.feature)); });
    }

    function showStateInfo(state) {
      const panel = document.getElementById('stateInfo');
      const topIssues = JSON.parse(state.top_issues||'[]');
      const topDepts = JSON.parse(state.top_departments||'[]');
      document.getElementById('stateInfoContent').innerHTML = '<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"><div><h3 class="font-bold text-lg text-navy-700 mb-1"><i class="fas fa-map-pin text-saffron-500 mr-1.5"></i>'+state.state_name+'</h3><p class="text-sm text-gray-500">Code: '+state.state_code+' &bull; Click for district data</p></div><div class="grid grid-cols-2 gap-3"><div><span class="text-lg font-bold text-navy-700">'+Number(state.total_complaints).toLocaleString()+'</span><br><span class="text-xs text-gray-500">Total</span></div><div><span class="text-lg font-bold text-ashoka-600">'+state.resolution_rate+'%</span><br><span class="text-xs text-gray-500">Resolution</span></div><div><span class="text-lg font-bold text-red-600">'+state.fake_closure_rate+'%</span><br><span class="text-xs text-gray-500">Fake Closure</span></div><div><span class="text-lg font-bold text-saffron-600">'+state.avg_resolution_days+'d</span><br><span class="text-xs text-gray-500">Avg Days</span></div></div><div><p class="text-xs font-semibold text-gray-500 mb-1.5">TOP ISSUES</p>'+topIssues.slice(0,3).map(i=>'<span class="inline-block text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded mr-1 mb-1">'+i+'</span>').join('')+'</div><div><p class="text-xs font-semibold text-gray-500 mb-1.5">TOP DEPARTMENTS</p>'+topDepts.slice(0,3).map(d=>'<span class="inline-block text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded mr-1 mb-1">'+d+'</span>').join('')+'</div></div>';
      panel.classList.remove('hidden');
    }

    // ============================================
    // DISTRICT DRILL-DOWN
    // ============================================
    async function loadDistrictData(stateCode) {
      try {
        const res = await fetch('/api/states/' + stateCode + '/districts');
        const json = await res.json();
        if (json.success) {
          document.getElementById('districtPanel').classList.remove('hidden');
          document.getElementById('backToIndiaBtn').classList.remove('hidden');
          document.getElementById('districtTitle').textContent = json.data.state_name + ' — District Breakdown (' + json.data.districts.length + ' districts)';
          isDistrictView = true;
          document.getElementById('districtBody').innerHTML = json.data.districts.map((d, i) => 
            '<tr class="hover:bg-gray-50">' +
            '<td class="px-4 py-2 text-xs text-gray-400">' + (i+1) + '</td>' +
            '<td class="px-4 py-2 font-medium text-sm text-gray-900">' + d.name + '</td>' +
            '<td class="px-4 py-2 text-center text-sm font-medium">' + d.total_complaints.toLocaleString() + '</td>' +
            '<td class="px-4 py-2 text-center"><span class="text-sm font-semibold ' + (d.resolution_rate>=75?'text-ashoka-600':d.resolution_rate>=60?'text-saffron-600':'text-red-600') + '">' + d.resolution_rate + '%</span></td>' +
            '<td class="px-4 py-2 text-center"><span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ' + (d.fake_closure_rate>=15?'bg-red-100 text-red-700':d.fake_closure_rate>=10?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700') + '">' + d.fake_closure_rate + '%</span></td>' +
            '<td class="px-4 py-2 text-center text-sm ' + (d.citizen_satisfaction_rate>=50?'text-ashoka-600':'text-red-600') + '">' + d.citizen_satisfaction_rate + '%</td>' +
            '<td class="px-4 py-2 text-center text-sm ' + (d.avg_resolution_days>40?'text-red-600 font-semibold':'text-gray-600') + '">' + d.avg_resolution_days + 'd</td>' +
            '<td class="px-4 py-2 text-center"><span class="text-xs ' + (d.trend==='rising'?'text-red-500':'text-ashoka-500') + '"><i class="fas ' + (d.trend==='rising'?'fa-arrow-up':'fa-arrow-down') + '"></i></span></td></tr>'
          ).join('');
          document.getElementById('districtPanel').scrollIntoView({behavior:'smooth', block:'nearest'});
        }
      } catch(e) {}
    }

    function backToIndiaMap() {
      document.getElementById('districtPanel').classList.add('hidden');
      document.getElementById('backToIndiaBtn').classList.add('hidden');
      isDistrictView = false;
    }

    // ============================================
    // TIME-SERIES CHARTS (Week 5)
    // ============================================
    async function loadTimeSeries() {
      try {
        const res = await fetch('/api/analytics/timeseries');
        const json = await res.json();
        if (!json.success) return;
        timeseriesData = json.data;
        Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
        Chart.defaults.font.size = 11;

        // National trend line chart
        new Chart(document.getElementById('tsNationalChart'), {
          type: 'line',
          data: {
            labels: json.data.labels,
            datasets: [
              { label: 'Total Filed', data: json.data.national.total, borderColor: '#1a365d', backgroundColor: 'rgba(26,54,93,0.1)', borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 6 },
              { label: 'Resolved', data: json.data.national.resolved, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.05)', borderWidth: 2, fill: false, tension: 0.4, pointRadius: 2 },
              { label: 'Fake Closed', data: json.data.national.fake_closed, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.05)', borderWidth: 2, borderDash: [5,3], fill: false, tension: 0.4, pointRadius: 2 }
            ]
          },
          options: { responsive:true, maintainAspectRatio:false, plugins: { legend: {position:'bottom', labels:{padding:12, usePointStyle:true, font:{size:10}}}, tooltip: {mode:'index', intersect:false, callbacks:{label:(ctx)=>ctx.dataset.label+': '+Number(ctx.raw).toLocaleString('en-IN')}} }, scales: { y:{beginAtZero:false, ticks:{callback:v=>(v/1000)+'K'}, grid:{color:'#f1f5f9'}}, x:{grid:{display:false}, ticks:{font:{size:9}}} }, interaction:{mode:'nearest',axis:'x',intersect:false} }
        });

        // Satisfaction vs Fake Closure dual-axis
        new Chart(document.getElementById('tsSatFakeChart'), {
          type: 'line',
          data: {
            labels: json.data.labels,
            datasets: [
              { label: 'Citizen Satisfaction %', data: json.data.satisfaction_trend, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 2.5, fill: true, tension: 0.4, yAxisID: 'y', pointRadius: 3 },
              { label: 'Fake Closure Rate %', data: json.data.fake_closure_trend, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 2.5, fill: true, tension: 0.4, yAxisID: 'y1', pointRadius: 3 }
            ]
          },
          options: { responsive:true, maintainAspectRatio:false, plugins: {legend:{position:'bottom',labels:{padding:12,usePointStyle:true}}}, scales: { y:{type:'linear',display:true,position:'left',beginAtZero:false,title:{display:true,text:'Satisfaction %',font:{size:10}},grid:{color:'#f1f5f9'}}, y1:{type:'linear',display:true,position:'right',beginAtZero:false,title:{display:true,text:'Fake Closure %',font:{size:10}},grid:{drawOnChartArea:false}}, x:{grid:{display:false},ticks:{font:{size:9}}} }, interaction:{mode:'nearest',axis:'x',intersect:false} }
        });

        // Top 5 ministries stacked area
        const ministryColors = ['#1a365d','#ff9933','#22c55e','#8b5cf6','#ef4444'];
        new Chart(document.getElementById('tsMinistryChart'), {
          type: 'line',
          data: {
            labels: json.data.labels,
            datasets: json.data.top_ministries.map((m, i) => ({
              label: m.name.slice(0, 20),
              data: m.data,
              borderColor: ministryColors[i],
              backgroundColor: ministryColors[i] + '15',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 2
            }))
          },
          options: { responsive:true, maintainAspectRatio:false, plugins: {legend:{position:'bottom',labels:{padding:10,usePointStyle:true,font:{size:9}}}}, scales: {y:{beginAtZero:false,stacked:false,ticks:{callback:v=>(v/1000)+'K'},grid:{color:'#f1f5f9'}},x:{grid:{display:false},ticks:{font:{size:9}}}}, interaction:{mode:'nearest',axis:'x',intersect:false} }
        });
      } catch(e) { console.error('Timeseries error:', e); }
    }

    // ============================================
    // RADAR CHART (Week 5)
    // ============================================
    async function loadRadarChart() {
      try {
        const res = await fetch('/api/analytics/comparison');
        const json = await res.json();
        if (!json.success) return;
        radarData = json.data;
        const colors = ['rgba(26,54,93,0.6)','rgba(255,153,51,0.6)','rgba(34,197,94,0.6)','rgba(139,92,246,0.6)','rgba(239,68,68,0.6)','rgba(59,130,246,0.6)'];
        const bgColors = ['rgba(26,54,93,0.15)','rgba(255,153,51,0.15)','rgba(34,197,94,0.15)','rgba(139,92,246,0.15)','rgba(239,68,68,0.15)','rgba(59,130,246,0.15)'];

        new Chart(document.getElementById('radarChart'), {
          type: 'radar',
          data: {
            labels: ['Volume', 'Resolution Rate', 'Satisfaction', 'Speed', 'Pending Ratio', 'Fake Closure'],
            datasets: json.data.map((d, i) => ({
              label: d.label,
              data: [d.metrics.volume, d.metrics.resolution_rate, d.metrics.satisfaction, d.metrics.speed, d.metrics.pending_ratio, 100 - d.metrics.fake_closure],
              borderColor: colors[i], backgroundColor: bgColors[i], borderWidth: 2, pointBackgroundColor: colors[i]
            }))
          },
          options: { responsive:true, maintainAspectRatio:false, plugins: {legend:{position:'bottom',labels:{padding:12,usePointStyle:true,font:{size:10}}}}, scales: {r:{beginAtZero:true,max:100,ticks:{display:false},grid:{color:'#e2e8f0'},angleLines:{color:'#e2e8f0'},pointLabels:{font:{size:10,weight:'600'}}}}}
        });
      } catch(e) {}
    }

    // ============================================
    // SPARKLINES (Week 5)
    // ============================================
    async function loadSparklines() {
      try {
        const res = await fetch('/api/analytics/sparklines');
        const json = await res.json();
        if (!json.success) return;
        sparklineData = json.data;

        document.getElementById('sparklineGrid').innerHTML = json.data.map((s, idx) => 
          '<div class="bg-white rounded-xl border border-gray-200 p-4 card-hover">' +
            '<div class="flex items-center justify-between mb-2">' +
              '<h4 class="font-bold text-sm text-navy-700">' + s.state_name + '</h4>' +
              '<span class="text-[10px] text-gray-400">' + s.state_code + '</span>' +
            '</div>' +
            '<div class="grid grid-cols-2 gap-2 mb-3">' +
              '<div><span class="text-[10px] text-gray-500">Complaints</span><br><span class="text-sm font-bold text-navy-700">' + Number(s.current.total).toLocaleString('en-IN') + '</span></div>' +
              '<div><span class="text-[10px] text-gray-500">Resolution</span><br><span class="text-sm font-bold ' + (s.current.resolution_rate>=75?'text-ashoka-600':'text-saffron-600') + '">' + s.current.resolution_rate + '%</span></div>' +
              '<div><span class="text-[10px] text-gray-500">Fake Closure</span><br><span class="text-sm font-bold ' + (s.current.fake_closure>=15?'text-red-600':'text-gray-600') + '">' + s.current.fake_closure + '%</span></div>' +
              '<div><span class="text-[10px] text-gray-500">Satisfaction</span><br><span class="text-sm font-bold text-blue-600">' + s.current.satisfaction + '%</span></div>' +
            '</div>' +
            '<div style="height:40px;"><canvas id="spark-' + idx + '"></canvas></div>' +
          '</div>'
        ).join('');

        // Render sparkline canvases
        setTimeout(() => {
          json.data.forEach((s, idx) => {
            const canvas = document.getElementById('spark-' + idx);
            if (!canvas) return;
            new Chart(canvas, {
              type: 'line',
              data: {
                labels: ['Oct','Nov','Dec','Jan','Feb','Mar'],
                datasets: [{
                  data: s.complaint_trend,
                  borderColor: '#ff9933',
                  borderWidth: 1.5,
                  pointRadius: 0,
                  tension: 0.4,
                  fill: { target: 'origin', above: 'rgba(255,153,51,0.08)' }
                }]
              },
              options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false},tooltip:{enabled:false}}, scales:{x:{display:false},y:{display:false}} }
            });
          });
        }, 100);
      } catch(e) {}
    }

    // ============================================
    // CHART.JS VISUALIZATIONS (Original)
    // ============================================
    function initCharts() {
      if (!ministryData.length) return;
      Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
      Chart.defaults.font.size = 11;

      const top10 = ministryData.slice(0,10);
      new Chart(document.getElementById('ministryBarChart'), {
        type:'bar', data:{labels:top10.map(m=>m.ministry_name.replace('Ministry of ','').replace('Department of ','').slice(0,25)),datasets:[{label:'Complaints Received',data:top10.map(m=>m.complaints_received),backgroundColor:['#1a365d','#1e40af','#2563eb','#3b82f6','#60a5fa','#93c5fd','#bfdbfe','#dbeafe','#eff6ff','#f8fafc'],borderRadius:6,borderSkipped:false}]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:(ctx)=>Number(ctx.raw).toLocaleString('en-IN')+' complaints'}}},scales:{y:{beginAtZero:true,ticks:{callback:v=>(v/1000)+'K'},grid:{color:'#f1f5f9'}},x:{ticks:{maxRotation:45,minRotation:30,font:{size:9}},grid:{display:false}}}}
      });

      const totalResolved=ministryData.reduce((s,m)=>s+m.complaints_disposed,0);
      const totalPending=ministryData.reduce((s,m)=>s+m.complaints_pending,0);
      const totalReceived=ministryData.reduce((s,m)=>s+m.complaints_received,0);
      const estFakeClosed=Math.round(totalResolved*0.31);
      const actualResolved=totalResolved-estFakeClosed;

      new Chart(document.getElementById('statusDoughnutChart'), {
        type:'doughnut', data:{labels:['Actually Resolved','Fake Closed','Pending'],datasets:[{data:[actualResolved,estFakeClosed,totalPending],backgroundColor:['#22c55e','#ef4444','#f59e0b'],borderWidth:3,borderColor:'#fff',hoverOffset:8}]},
        options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{position:'bottom',labels:{padding:16,usePointStyle:true}},tooltip:{callbacks:{label:(ctx)=>ctx.label+': '+Number(ctx.raw).toLocaleString('en-IN')+' ('+Math.round(ctx.raw/totalReceived*100)+'%)'}}}}
      });

      const sortedByFake=[...ministryData].sort((a,b)=>b.fake_closure_rate-a.fake_closure_rate).slice(0,8);
      new Chart(document.getElementById('fakeClosureChart'), {
        type:'bar', data:{labels:sortedByFake.map(m=>m.ministry_name.replace('Ministry of ','').replace('Department of ','').slice(0,30)),datasets:[{label:'Fake Closure Rate (%)',data:sortedByFake.map(m=>m.fake_closure_rate),backgroundColor:sortedByFake.map(m=>m.fake_closure_rate>=35?'#dc2626':m.fake_closure_rate>=25?'#f97316':'#fbbf24'),borderRadius:6,borderSkipped:false}]},
        options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:(ctx)=>ctx.raw+'% fake closure rate'}}},scales:{x:{beginAtZero:true,max:50,ticks:{callback:v=>v+'%'},grid:{color:'#f1f5f9'}},y:{ticks:{font:{size:10}},grid:{display:false}}}}
      });

      const top10Days=[...ministryData].sort((a,b)=>b.avg_resolution_days-a.avg_resolution_days).slice(0,10);
      new Chart(document.getElementById('resolutionDaysChart'), {
        type:'bar', data:{labels:top10Days.map(m=>m.ministry_name.replace('Ministry of ','').replace('Department of ','').slice(0,22)),datasets:[{label:'Avg Days',data:top10Days.map(m=>m.avg_resolution_days),backgroundColor:top10Days.map(m=>m.avg_resolution_days>40?'#dc2626':m.avg_resolution_days>30?'#f97316':'#22c55e'),borderRadius:6,borderSkipped:false},{label:'30-Day Target',data:top10Days.map(()=>30),type:'line',borderColor:'#1a365d',borderWidth:2,borderDash:[6,4],pointRadius:0,fill:false}]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{padding:12,usePointStyle:true,font:{size:10}}}},scales:{y:{beginAtZero:true,ticks:{callback:v=>v+'d'},grid:{color:'#f1f5f9'}},x:{ticks:{maxRotation:45,minRotation:30,font:{size:9}},grid:{display:false}}}}
      });
    }

    // ============================================
    // DEPARTMENT SCORECARD
    // ============================================
    async function loadScorecard() {
      const sort = document.getElementById('scorecardSort').value;
      try {
        const res = await fetch('/api/ministries?sort=' + sort + '&order=' + (sort==='citizen_satisfaction_rate'?'asc':'desc'));
        const json = await res.json();
        if (json.success) {
          document.getElementById('scorecardBody').innerHTML = json.data.map((m, i) => 
            '<tr class="hover:bg-gray-50 '+(m.fake_closure_flag?'bg-red-50/50':'')+'"><td class="px-4 py-3 text-xs text-gray-400">'+(i+1)+'</td><td class="px-4 py-3"><div class="font-medium text-sm text-gray-900">'+m.ministry_name+'</div><span class="text-xs text-gray-400">'+m.ministry_code+'</span></td><td class="px-4 py-3 text-center text-sm font-medium">'+Number(m.complaints_received).toLocaleString()+'</td><td class="px-4 py-3 text-center"><span class="text-sm font-semibold '+(m.official_resolution_rate>=85?'text-ashoka-600':'text-gray-700')+'">'+m.official_resolution_rate+'%</span></td><td class="px-4 py-3 text-center"><span class="text-sm font-semibold '+(m.citizen_satisfaction_rate>=55?'text-ashoka-600':m.citizen_satisfaction_rate>=45?'text-saffron-600':'text-red-600')+'">'+m.citizen_satisfaction_rate+'%</span></td><td class="px-4 py-3 text-center"><span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold '+(m.fake_closure_rate>=35?'bg-red-100 text-red-700':m.fake_closure_rate>=25?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700')+'">'+m.fake_closure_rate+'%</span></td><td class="px-4 py-3 text-center text-sm '+(m.avg_resolution_days>40?'text-red-600 font-semibold':'text-gray-600')+'">'+m.avg_resolution_days+'d</td><td class="px-4 py-3 text-center">'+(m.fake_closure_flag?'<span class="text-red-600 text-xs font-bold"><i class="fas fa-flag"></i> FLAGGED</span>':'<span class="text-ashoka-500 text-xs"><i class="fas fa-check"></i></span>')+'</td></tr>'
          ).join('');
        }
      } catch(e) {}
    }

    // ============================================
    // TRENDING & SOCIAL (same as before)
    // ============================================
    async function loadTrendingDash() {
      try {
        const res = await fetch('/api/trending');
        const json = await res.json();
        if (json.success) {
          document.getElementById('trendingGrid').innerHTML = json.data.map(issue => {
            const colors = {critical:'badge-critical',high:'badge-high',medium:'badge-medium',low:'badge-low'};
            const states=JSON.parse(issue.states_affected||'[]'), keywords=JSON.parse(issue.topic_keywords||'[]'), ministries=JSON.parse(issue.ministries_affected||'[]');
            return '<div class="card-hover bg-white rounded-2xl border '+(issue.is_flagged?'border-red-200':'border-gray-200')+' p-6"><div class="flex items-start justify-between mb-3"><span class="px-2.5 py-1 rounded-full text-xs font-semibold '+colors[issue.severity]+'">'+issue.severity.toUpperCase()+'</span><span class="text-xs text-gray-400"><i class="fas fa-arrow-trend-up '+(issue.spike_factor>2?'text-red-500':'text-saffron-500')+' mr-1"></i>'+issue.spike_factor+'x</span></div><h3 class="font-bold text-gray-900 mb-2">'+issue.topic_name+'</h3><p class="text-sm text-gray-600 mb-3 line-clamp-2">'+issue.description+'</p><div class="flex flex-wrap gap-1 mb-3">'+keywords.slice(0,4).map(k=>'<span class="text-[10px] bg-navy-50 text-navy-600 px-1.5 py-0.5 rounded">'+k+'</span>').join('')+'</div><div class="flex flex-wrap gap-1 mb-3">'+states.map(s=>'<span class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">'+s+'</span>').join('')+'</div><div class="text-xs text-gray-400 pt-3 border-t border-gray-100"><i class="fas fa-building-columns mr-1"></i>'+(ministries[0]||'Multiple')+' <span class="float-right"><i class="fas fa-ticket mr-1"></i>'+issue.complaint_count.toLocaleString()+'</span></div></div>';
          }).join('');
        }
      } catch(e) {}
    }

    async function loadSocial() {
      try {
        const res = await fetch('/api/social');
        const json = await res.json();
        if (json.success) {
          document.getElementById('socialGrid').innerHTML = json.data.map(s => {
            const pi=s.platform==='twitter'?'fa-brands fa-x-twitter':'fa-solid fa-newspaper';
            const pc=s.platform==='twitter'?'bg-gray-900':'bg-blue-600';
            const dc={rising:'text-red-500',stable:'text-gray-500',falling:'text-ashoka-500'};
            const di={rising:'fa-arrow-trend-up',stable:'fa-minus',falling:'fa-arrow-trend-down'};
            return '<div class="bg-white rounded-xl border border-gray-200 p-4 card-hover"><div class="flex items-center gap-2 mb-2"><span class="w-6 h-6 '+pc+' rounded-md flex items-center justify-center"><i class="'+pi+' text-white text-xs"></i></span><span class="text-xs font-semibold text-gray-700 truncate">'+s.keyword_matched+'</span>'+(s.spike_detected?'<span class="ml-auto w-2 h-2 bg-red-500 rounded-full pulse-dot"></span>':'')+'</div><p class="text-xs text-gray-500 mb-2 truncate">'+s.source_title+'</p><div class="flex items-center justify-between text-xs"><span class="text-gray-400"><strong>'+s.post_count_24h+'</strong> /24h</span><span class="'+dc[s.trending_direction]+'"><i class="fas '+di[s.trending_direction]+' mr-1"></i>'+s.trending_direction+'</span></div></div>';
          }).join('');
        }
      } catch(e) {}
    }

    // ============================================
    // PDF EXPORT (Week 5)
    // ============================================
    function exportDashboardPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setTextColor(26, 54, 93);
      doc.text('GrievanceIQ — Public Dashboard Report', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Generated: ' + new Date().toLocaleDateString('en-IN', {day:'2-digit',month:'long',year:'numeric'}), 14, 28);

      doc.setDrawColor(255, 153, 51);
      doc.line(14, 32, 196, 32);

      let y = 40;
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Overview Statistics', 14, y); y += 8;

      doc.setFontSize(10);
      const stats = ['Total Complaints: ' + (document.getElementById('ds-total').textContent || '—'), 'Resolved: ' + (document.getElementById('ds-resolved').textContent || '—'), 'Pending: ' + (document.getElementById('ds-pending').textContent || '—'), 'Fake Closure Rate: ' + (document.getElementById('ds-fake').textContent || '—'), 'Active Alerts: ' + (document.getElementById('ds-alerts').textContent || '—')];
      stats.forEach(s => { doc.text('• ' + s, 20, y); y += 6; });

      y += 6;
      doc.setFontSize(14);
      doc.text('Top Ministries by Complaint Volume', 14, y); y += 8;
      doc.setFontSize(9);
      (ministryData||[]).slice(0, 10).forEach((m, i) => {
        doc.text((i+1)+'. '+m.ministry_name+' — '+Number(m.complaints_received).toLocaleString()+' (Fake: '+m.fake_closure_rate+'%, Satisfaction: '+m.citizen_satisfaction_rate+'%)', 20, y);
        y += 5;
        if (y > 270) { doc.addPage(); y = 20; }
      });

      y += 6;
      doc.setFontSize(14);
      doc.text('Top States by Complaint Volume', 14, y); y += 8;
      doc.setFontSize(9);
      (stateData||[]).slice(0, 10).forEach((s, i) => {
        doc.text((i+1)+'. '+s.state_name+' — '+Number(s.total_complaints).toLocaleString()+' (Res: '+s.resolution_rate+'%, Fake: '+s.fake_closure_rate+'%)', 20, y);
        y += 5;
        if (y > 270) { doc.addPage(); y = 20; }
      });

      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('This report is auto-generated by GrievanceIQ. Data as of March 2026.', 14, 285);

      doc.save('GrievanceIQ_Dashboard_' + new Date().toISOString().split('T')[0] + '.pdf');
      showToast('Dashboard PDF exported!', 'success');
    }

    // ============================================
    // RESOLUTION FUNNEL (Week 7)
    // ============================================
    async function loadFunnel() {
      try {
        const res = await fetch('/api/analytics/funnel');
        const json = await res.json();
        if (!json.success) return;
        const stages = json.data.stages;
        const maxWidth = 100;

        document.getElementById('funnelContainer').innerHTML = 
          '<div class="max-w-2xl mx-auto space-y-1">' +
          stages.map((s, i) => {
            const width = Math.max(25, s.percent);
            const isDropoff = s.label === 'Fake Closed';
            return '<div class="relative group">' +
              '<div class="flex items-center gap-3">' +
                '<div class="w-28 text-right"><span class="text-xs font-semibold text-gray-600">' + s.label + '</span></div>' +
                '<div class="flex-1">' +
                  '<div class="relative h-10 rounded-lg overflow-hidden bg-gray-100 transition-all" style="width:' + width + '%;margin:0 auto 0 0;">' +
                    '<div class="absolute inset-0 rounded-lg transition-all duration-700" style="background:' + s.color + ';opacity:' + (isDropoff ? '0.8' : '0.9') + '"></div>' +
                    '<div class="absolute inset-0 flex items-center justify-center">' +
                      '<span class="text-xs font-bold text-white drop-shadow">' + Number(s.count).toLocaleString('en-IN') + ' (' + s.percent + '%)</span>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              (i < stages.length - 1 && !isDropoff ? '<div class="ml-32 pl-8 text-[10px] text-gray-400 py-0.5"><i class="fas fa-arrow-down mr-1"></i>-' + (stages[i].percent - stages[i+1]?.percent || 0) + '% dropoff</div>' : '') +
            '</div>';
          }).join('') +
          '</div>' +
          '<div class="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">' +
          Object.entries(json.data.dropoff).map(([k, v]) => {
            const label = k.replace(/_/g, ' → ').replace('to', '→');
            return '<div class="text-center bg-gray-50 rounded-lg p-2"><div class="text-lg font-bold text-red-500">-' + v + '%</div><div class="text-[9px] text-gray-500">' + label + '</div></div>';
          }).join('') +
          '</div>';
      } catch(e) { console.error('Funnel error:', e); }
    }

    // ============================================
    // HEATMAP CALENDAR (Week 7)
    // ============================================
    async function loadHeatmap() {
      try {
        const res = await fetch('/api/analytics/heatmap');
        const json = await res.json();
        if (!json.success) return;
        const data = json.data.heatmap;
        const summary = json.data.summary;

        // Group by month
        const months = {};
        data.forEach(d => {
          const m = d.date.slice(0, 7); // YYYY-MM
          if (!months[m]) months[m] = [];
          months[m].push(d);
        });

        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const dayNames = ['S','M','T','W','T','F','S'];
        const maxCount = summary.max_daily;
        const getColor = (count) => {
          const ratio = count / maxCount;
          if (ratio < 0.2) return '#ecfdf5';
          if (ratio < 0.4) return '#6ee7b7';
          if (ratio < 0.6) return '#10b981';
          if (ratio < 0.8) return '#047857';
          return '#064e3b';
        };

        let html = '<div class="flex gap-4 overflow-x-auto pb-2">';
        // Day labels
        html += '<div class="flex flex-col gap-0.5 mt-5">' + dayNames.map(d => '<div class="w-4 h-4 text-[8px] text-gray-400 flex items-center justify-center">' + d + '</div>').join('') + '</div>';

        Object.entries(months).forEach(([monthKey, days]) => {
          const monthNum = parseInt(monthKey.split('-')[1]);
          html += '<div class="flex flex-col items-center"><div class="text-[9px] font-semibold text-gray-500 mb-1">' + monthNames[monthNum - 1] + '</div>';
          // Group days into weeks
          const firstDow = days[0].day_of_week;
          const grid = Array(42).fill(null);
          days.forEach((d, i) => { grid[firstDow + i] = d; });
          
          html += '<div class="grid grid-cols-7 gap-0.5">';
          for (let w = 0; w < 6; w++) {
            for (let d = 0; d < 7; d++) {
              const cell = grid[w * 7 + d];
              if (cell) {
                html += '<div class="w-4 h-4 rounded-sm cursor-pointer transition-transform hover:scale-125" style="background:' + getColor(cell.count) + '" title="' + cell.date + ': ' + Number(cell.count).toLocaleString() + ' complaints"></div>';
              } else {
                html += '<div class="w-4 h-4"></div>';
              }
            }
          }
          html += '</div></div>';
        });
        html += '</div>';

        // Summary stats
        html += '<div class="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">' +
          '<span><strong class="text-navy-700">' + summary.total_days + '</strong> days tracked</span>' +
          '<span>Avg: <strong class="text-navy-700">' + Number(summary.avg_daily).toLocaleString() + '</strong>/day</span>' +
          '<span>Peak: <strong class="text-red-600">' + Number(summary.max_daily).toLocaleString() + '</strong>/day</span>' +
          '<span>Low: <strong class="text-ashoka-600">' + Number(summary.min_daily).toLocaleString() + '</strong>/day</span>' +
          '</div>';

        document.getElementById('heatmapContainer').innerHTML = html;
      } catch(e) { console.error('Heatmap error:', e); }
    }

    // ============================================
    // DEPARTMENT NETWORK GRAPH (Week 7)
    // ============================================
    async function loadNetworkGraph() {
      try {
        const res = await fetch('/api/analytics/network');
        const json = await res.json();
        if (!json.success) return;
        const { nodes, edges } = json.data;
        const container = document.getElementById('networkContainer');
        const canvas = document.getElementById('networkCanvas');
        if (!canvas || !container) return;

        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;

        // Scale node positions
        const scale = Math.min(W / 800, H / 600);
        nodes.forEach(n => { n.sx = n.x * scale; n.sy = n.y * scale; n.sr = Math.max(12, n.size * scale * 0.5); });

        // Draw edges
        ctx.clearRect(0, 0, W, H);
        edges.forEach(e => {
          const src = nodes.find(n => n.id === e.source);
          const tgt = nodes.find(n => n.id === e.target);
          if (!src || !tgt) return;
          ctx.beginPath();
          ctx.moveTo(src.sx, src.sy);
          ctx.lineTo(tgt.sx, tgt.sy);
          ctx.strokeStyle = 'rgba(148,163,184,0.3)';
          ctx.lineWidth = Math.max(1, Math.min(4, e.weight / 150));
          ctx.stroke();
        });

        // Draw nodes
        nodes.forEach(n => {
          // Glow
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, n.sr + 4, 0, Math.PI * 2);
          ctx.fillStyle = n.color + '20';
          ctx.fill();
          // Circle
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, n.sr, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();
          // Label
          ctx.fillStyle = '#1e293b';
          ctx.font = Math.max(8, 10 * scale) + 'px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(n.label.slice(0, 15), n.sx, n.sy + n.sr + 14);
          // Complaint count inside node
          ctx.fillStyle = '#fff';
          ctx.font = 'bold ' + Math.max(7, 9 * scale) + 'px Inter, sans-serif';
          ctx.fillText(Math.round(n.complaints / 1000) + 'K', n.sx, n.sy + 3);
        });

        // Add tooltip on hover
        let tooltip = document.createElement('div');
        tooltip.className = 'absolute hidden bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-dark-600 p-3 text-xs z-50 pointer-events-none';
        container.appendChild(tooltip);

        canvas.addEventListener('mousemove', (ev) => {
          const r = canvas.getBoundingClientRect();
          const mx = ev.clientX - r.left, my = ev.clientY - r.top;
          const hovered = nodes.find(n => Math.hypot(mx - n.sx, my - n.sy) <= n.sr);
          if (hovered) {
            tooltip.classList.remove('hidden');
            tooltip.style.left = Math.min(mx + 12, W - 180) + 'px';
            tooltip.style.top = (my - 10) + 'px';
            tooltip.innerHTML = '<div class="font-bold text-gray-800 dark:text-gray-200 mb-1">' + hovered.full_name + '</div>' +
              '<div class="text-gray-500">Complaints: <strong>' + Number(hovered.complaints).toLocaleString() + '</strong></div>' +
              '<div class="text-gray-500">Resolution: <strong>' + hovered.resolution_rate + '%</strong></div>' +
              '<div class="text-gray-500">Fake Closure: <strong class="text-red-500">' + hovered.fake_closure + '%</strong></div>' +
              '<div class="text-gray-500">Satisfaction: <strong>' + hovered.satisfaction + '%</strong></div>';
            canvas.style.cursor = 'pointer';
          } else {
            tooltip.classList.add('hidden');
            canvas.style.cursor = 'default';
          }
        });
      } catch(e) { console.error('Network graph error:', e); }
    }

    // ============================================
    // LAZY LOADING — IntersectionObserver (Week 7)
    // ============================================
    const lazyLoaded = new Set();
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !lazyLoaded.has(entry.target.id)) {
          lazyLoaded.add(entry.target.id);
          if (entry.target.id === 'funnel') loadFunnel();
          if (entry.target.id === 'heatmap') loadHeatmap();
          if (entry.target.id === 'network') loadNetworkGraph();
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('[data-lazy]').forEach(el => lazyObserver.observe(el));

    loadDashboard();
  </script>

  <style>
    .leaflet-tooltip-custom { background:white; border:1px solid #e2e8f0; border-radius:10px; padding:8px 12px; font-family:'Inter',sans-serif; font-size:12px; box-shadow:0 4px 12px -2px rgb(0 0 0/0.12); line-height:1.5; }
    .leaflet-tooltip-custom::before { display:none; }
  </style>
  `
  return layout('Public Dashboard', content, 'dashboard', {
    description: 'Real-time grievance analytics across India. Track ministry performance, fake closure rates, and citizen satisfaction powered by AI and CPGRAMS data.',
    keywords: 'grievance dashboard, CPGRAMS, India, ministry performance, fake closure, citizen satisfaction, AI analytics',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'GrievanceIQ Dashboard',
      applicationCategory: 'GovernmentApplication',
      operatingSystem: 'Web',
      description: 'Public accountability dashboard for India\'s grievance redressal system'
    }
  })
}
