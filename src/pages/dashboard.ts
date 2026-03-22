import { layout } from './layout'

export function dashboardPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-800 to-navy-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
            <i class="fas fa-chart-line text-saffron-400 mr-2"></i>Public Accountability Dashboard
          </h1>
          <p class="text-gray-300 text-sm">Real-time grievance intelligence for journalists, NGOs, and researchers. No login required.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-ashoka-400 pulse-dot"></span>
          <span class="text-xs text-gray-400 font-medium">Live data • Updated March 2026</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats Overview -->
  <section class="py-6 bg-gray-50 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3" id="dashStats">
        <div class="bg-white rounded-xl p-4 shadow-sm text-center"><div class="text-xl font-black text-navy-700" id="ds-total">—</div><div class="text-xs text-gray-500">Total Complaints</div></div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center"><div class="text-xl font-black text-ashoka-600" id="ds-resolved">—</div><div class="text-xs text-gray-500">Resolved</div></div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center"><div class="text-xl font-black text-saffron-600" id="ds-pending">—</div><div class="text-xs text-gray-500">Pending</div></div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center"><div class="text-xl font-black text-red-600" id="ds-fake">—</div><div class="text-xs text-gray-500">Fake Closure Rate</div></div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center col-span-2 lg:col-span-1"><div class="text-xl font-black text-purple-600" id="ds-alerts">—</div><div class="text-xs text-gray-500">Active Alerts</div></div>
      </div>
    </div>
  </section>

  <!-- India Choropleth Map -->
  <section class="py-8 sm:py-12" id="map-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-navy-600 to-navy-700 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <i class="fas fa-map-location-dot text-white"></i>
            <h2 class="font-bold text-white">India Grievance Intelligence Map</h2>
            <span class="text-[10px] bg-ashoka-500/30 text-ashoka-200 px-2 py-0.5 rounded-full font-medium hidden sm:inline">GeoJSON Choropleth</span>
          </div>
          <select id="mapMetric" onchange="updateMapColors()" class="text-xs bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 text-white focus:outline-none">
            <option value="total_complaints">Total Complaints</option>
            <option value="resolution_rate">Resolution Rate</option>
            <option value="fake_closure_rate">Fake Closure Rate</option>
            <option value="avg_resolution_days">Avg Resolution Days</option>
          </select>
        </div>
        <div class="relative">
          <div id="indiaMap" style="height:580px;background:#f0f4ff;"></div>
          <!-- Loading overlay -->
          <div id="mapLoading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-[1000]">
            <div class="text-center">
              <div class="spinner mx-auto mb-2" style="width:32px;height:32px;border-width:3px;"></div>
              <p class="text-xs text-gray-500">Loading India GeoJSON boundaries...</p>
            </div>
          </div>
          <!-- Legend -->
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
        <!-- State info panel -->
        <div id="stateInfo" class="hidden px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
          <div id="stateInfoContent"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Charts Section -->
  <section class="py-8 sm:py-12 bg-gray-50" id="charts">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl sm:text-2xl font-bold text-navy-800 mb-6"><i class="fas fa-chart-bar text-saffron-500 mr-2"></i>Analytics Overview</h2>
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Bar Chart: Ministry Performance -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-between">
            <h3 class="font-bold text-white text-sm"><i class="fas fa-building-columns mr-1.5"></i>Top 10 Ministries — Complaint Volume</h3>
          </div>
          <div class="p-4" style="height:340px;">
            <canvas id="ministryBarChart"></canvas>
          </div>
        </div>
        
        <!-- Doughnut Chart: Complaint Status Distribution -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 flex items-center justify-between">
            <h3 class="font-bold text-white text-sm"><i class="fas fa-chart-pie mr-1.5"></i>Resolution Status Distribution</h3>
          </div>
          <div class="p-4 flex items-center justify-center" style="height:340px;">
            <canvas id="statusDoughnutChart"></canvas>
          </div>
        </div>
        
        <!-- Horizontal Bar: Fake Closure Rates -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-between">
            <h3 class="font-bold text-white text-sm"><i class="fas fa-mask mr-1.5"></i>Fake Closure Rate — Top Offenders</h3>
          </div>
          <div class="p-4" style="height:340px;">
            <canvas id="fakeClosureChart"></canvas>
          </div>
        </div>
        
        <!-- Bar Chart: Resolution Speed -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-5 py-3 bg-gradient-to-r from-navy-600 to-navy-700 flex items-center justify-between">
            <h3 class="font-bold text-white text-sm"><i class="fas fa-clock mr-1.5"></i>Average Resolution Days — Comparison</h3>
          </div>
          <div class="p-4" style="height:340px;">
            <canvas id="resolutionDaysChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Department Scorecard -->
  <section class="py-8 sm:py-12" id="scorecard">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fas fa-ranking-star text-white"></i>
            <h2 class="font-bold text-white">Department Accountability Scorecard</h2>
          </div>
          <select id="scorecardSort" onchange="loadScorecard()" class="text-xs bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 text-white focus:outline-none">
            <option value="complaints_received">By Volume</option>
            <option value="fake_closure_rate">By Fake Closure Rate</option>
            <option value="citizen_satisfaction_rate">By Citizen Satisfaction</option>
            <option value="avg_resolution_days">By Resolution Time</option>
          </select>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ministry</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Received</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Official Rate</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Citizen Rate</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Fake Closure</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Avg Days</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Flag</th>
              </tr>
            </thead>
            <tbody id="scorecardBody" class="divide-y divide-gray-100"></tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <!-- Trending Issues -->
  <section class="py-8 sm:py-12 bg-gray-50" id="trending">
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
  <section class="py-8 sm:py-12">
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
    let map;
    let geoLayer;
    const GEOJSON_URL = 'https://cdn.jsdelivr.net/npm/geojson-india/india.json';

    // GeoJSON state name → our DB state_code mapping
    const stateNameToCode = {
      'Andaman and Nicobar Islands': 'AN', 'Andhra Pradesh': 'AP', 'Arunachal Pradesh': 'AR',
      'Assam': 'AS', 'Bihar': 'BR', 'Chandigarh': 'CH', 'Chhattisgarh': 'CG',
      'Dadra and Nagar Haveli': 'DN', 'Daman and Diu': 'DN', 'Delhi': 'DL',
      'Goa': 'GA', 'Gujarat': 'GJ', 'Haryana': 'HR', 'Himachal Pradesh': 'HP',
      'Jammu and Kashmir': 'JK', 'Jharkhand': 'JH', 'Karnataka': 'KA', 'Kerala': 'KL',
      'Ladakh': 'LA', 'Lakshadweep': 'LD', 'Madhya Pradesh': 'MP', 'Maharashtra': 'MH',
      'Manipur': 'MN', 'Meghalaya': 'ML', 'Mizoram': 'MZ', 'Nagaland': 'NL',
      'Odisha': 'OD', 'Puducherry': 'PY', 'Punjab': 'PB', 'Rajasthan': 'RJ',
      'Sikkim': 'SK', 'Tamil Nadu': 'TN', 'Telangana': 'TG', 'Tripura': 'TR',
      'Uttar Pradesh': 'UP', 'Uttarakhand': 'UK', 'West Bengal': 'WB'
    };

    // ============================================
    // LOAD DASHBOARD DATA
    // ============================================
    async function loadDashboard() {
      // Stats
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

      // States (for map)
      try {
        const res = await fetch('/api/states');
        const json = await res.json();
        if (json.success) { stateData = json.data; initMap(); }
      } catch(e) { console.error('State data failed:', e); }

      // Ministries (for charts and scorecard)
      try {
        const res = await fetch('/api/ministries?limit=30');
        const json = await res.json();
        if (json.success) { ministryData = json.data; initCharts(); }
      } catch(e) {}

      loadScorecard();
      loadTrendingDash();
      loadSocial();
    }

    // ============================================
    // INDIA MAP — GeoJSON CHOROPLETH
    // ============================================
    async function initMap() {
      map = L.map('indiaMap', {
        center: [22.5, 82],
        zoom: 5,
        minZoom: 4,
        maxZoom: 7,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Load GeoJSON boundaries
      try {
        const res = await fetch(GEOJSON_URL);
        const geojson = await res.json();
        
        geoLayer = L.geoJSON(geojson, {
          style: (feature) => getStateStyle(feature),
          onEachFeature: (feature, layer) => {
            const code = stateNameToCode[feature.properties.name];
            const state = stateData.find(s => s.state_code === code);
            
            // Tooltip
            const tooltipContent = state 
              ? '<strong>' + feature.properties.name + '</strong><br>' + 
                Number(state.total_complaints).toLocaleString() + ' complaints<br>' +
                'Resolution: ' + state.resolution_rate + '%<br>' +
                'Fake Closure: ' + state.fake_closure_rate + '%'
              : '<strong>' + feature.properties.name + '</strong><br>No data';
            
            layer.bindTooltip(tooltipContent, {
              direction: 'auto',
              className: 'leaflet-tooltip-custom',
              sticky: true
            });

            // Click handler
            layer.on('click', () => {
              if (state) showStateInfo(state);
            });

            // Hover effects
            layer.on('mouseover', (e) => {
              e.target.setStyle({ weight: 3, color: '#1a365d', fillOpacity: 0.9 });
              e.target.bringToFront();
            });
            layer.on('mouseout', (e) => {
              geoLayer.resetStyle(e.target);
            });

            // Store state data on layer
            layer.stateCode = code;
            layer.stateDataRef = state;
          }
        }).addTo(map);

        // Hide loading
        document.getElementById('mapLoading').style.display = 'none';
      } catch(e) {
        console.error('GeoJSON load failed:', e);
        document.getElementById('mapLoading').innerHTML = '<div class="text-center"><i class="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i><p class="text-xs text-red-500">Map data unavailable. Refresh to retry.</p></div>';
      }
    }

    function getStateStyle(feature) {
      const code = stateNameToCode[feature.properties.name];
      const state = stateData.find(s => s.state_code === code);
      const metric = document.getElementById('mapMetric').value;
      const val = state ? (state[metric] || 0) : 0;
      
      return {
        fillColor: getChoroplethColor(val, metric),
        weight: 1.5,
        opacity: 1,
        color: '#94a3b8',
        fillOpacity: 0.75
      };
    }

    function getChoroplethColor(val, metric) {
      if (metric === 'total_complaints') {
        return val > 50000 ? '#7f1d1d' : val > 35000 ? '#dc2626' : val > 20000 ? '#ef4444' :
               val > 10000 ? '#f97316' : val > 5000 ? '#fcd34d' : '#fef3c7';
      } else if (metric === 'fake_closure_rate') {
        return val > 20 ? '#7f1d1d' : val > 16 ? '#dc2626' : val > 12 ? '#ef4444' :
               val > 8 ? '#f97316' : val > 4 ? '#fcd34d' : '#fef3c7';
      } else if (metric === 'resolution_rate') {
        return val > 82 ? '#14532d' : val > 78 ? '#22c55e' : val > 74 ? '#86efac' :
               val > 70 ? '#fcd34d' : val > 65 ? '#f97316' : '#dc2626';
      } else { // avg_resolution_days
        return val > 45 ? '#7f1d1d' : val > 38 ? '#dc2626' : val > 32 ? '#ef4444' :
               val > 26 ? '#f97316' : val > 20 ? '#fcd34d' : '#fef3c7';
      }
    }

    function updateMapColors() {
      if (!geoLayer) return;
      const metric = document.getElementById('mapMetric').value;
      const labels = {
        total_complaints: 'Complaints Volume',
        resolution_rate: 'Resolution Rate',
        fake_closure_rate: 'Fake Closure Rate',
        avg_resolution_days: 'Avg Days to Resolve'
      };
      document.getElementById('legendTitle').textContent = labels[metric];

      // Update legend colors for resolution_rate (green scale)
      const legendBar = document.getElementById('legendBar');
      if (metric === 'resolution_rate') {
        legendBar.innerHTML = '<span class="w-5 h-3 rounded-sm" style="background:#dc2626"></span><span class="w-5 h-3 rounded-sm" style="background:#f97316"></span><span class="w-5 h-3 rounded-sm" style="background:#fcd34d"></span><span class="w-5 h-3 rounded-sm" style="background:#86efac"></span><span class="w-5 h-3 rounded-sm" style="background:#22c55e"></span><span class="w-5 h-3 rounded-sm" style="background:#14532d"></span>';
      } else {
        legendBar.innerHTML = '<span class="w-5 h-3 rounded-sm" style="background:#fef3c7"></span><span class="w-5 h-3 rounded-sm" style="background:#fcd34d"></span><span class="w-5 h-3 rounded-sm" style="background:#f97316"></span><span class="w-5 h-3 rounded-sm" style="background:#ef4444"></span><span class="w-5 h-3 rounded-sm" style="background:#dc2626"></span><span class="w-5 h-3 rounded-sm" style="background:#7f1d1d"></span>';
      }

      geoLayer.eachLayer(layer => {
        if (layer.feature) {
          layer.setStyle(getStateStyle(layer.feature));
        }
      });
    }

    function showStateInfo(state) {
      const panel = document.getElementById('stateInfo');
      const topIssues = JSON.parse(state.top_issues || '[]');
      const topDepts = JSON.parse(state.top_departments || '[]');
      
      document.getElementById('stateInfoContent').innerHTML = \`
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h3 class="font-bold text-lg text-navy-700 mb-1"><i class="fas fa-map-pin text-saffron-500 mr-1.5"></i>\${state.state_name}</h3>
            <p class="text-sm text-gray-500">Code: \${state.state_code} | Rank by volume</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div><span class="text-lg font-bold text-navy-700">\${Number(state.total_complaints).toLocaleString()}</span><br><span class="text-xs text-gray-500">Total</span></div>
            <div><span class="text-lg font-bold text-ashoka-600">\${state.resolution_rate}%</span><br><span class="text-xs text-gray-500">Resolution</span></div>
            <div><span class="text-lg font-bold text-red-600">\${state.fake_closure_rate}%</span><br><span class="text-xs text-gray-500">Fake Closure</span></div>
            <div><span class="text-lg font-bold text-saffron-600">\${state.avg_resolution_days}d</span><br><span class="text-xs text-gray-500">Avg Days</span></div>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500 mb-1.5">TOP ISSUES</p>
            \${topIssues.slice(0, 3).map(i => '<span class="inline-block text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded mr-1 mb-1">' + i + '</span>').join('')}
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500 mb-1.5">TOP DEPARTMENTS</p>
            \${topDepts.slice(0, 3).map(d => '<span class="inline-block text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded mr-1 mb-1">' + d + '</span>').join('')}
          </div>
        </div>
      \`;
      panel.classList.remove('hidden');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ============================================
    // CHART.JS VISUALIZATIONS
    // ============================================
    function initCharts() {
      if (!ministryData.length) return;

      // Shared Chart.js defaults
      Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
      Chart.defaults.font.size = 11;

      // 1. Ministry Bar Chart — Top 10 by complaint volume
      const top10 = ministryData.slice(0, 10);
      new Chart(document.getElementById('ministryBarChart'), {
        type: 'bar',
        data: {
          labels: top10.map(m => m.ministry_name.replace('Ministry of ', '').replace('Department of ', '').slice(0, 25)),
          datasets: [{
            label: 'Complaints Received',
            data: top10.map(m => m.complaints_received),
            backgroundColor: top10.map((m, i) => {
              const colors = ['#1a365d', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff', '#f8fafc'];
              return colors[i] || '#e2e8f0';
            }),
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => Number(ctx.raw).toLocaleString('en-IN') + ' complaints'
              }
            }
          },
          scales: {
            y: { beginAtZero: true, ticks: { callback: v => (v/1000) + 'K' }, grid: { color: '#f1f5f9' } },
            x: { ticks: { maxRotation: 45, minRotation: 30, font: { size: 9 } }, grid: { display: false } }
          }
        }
      });

      // 2. Status Doughnut Chart
      const totalResolved = ministryData.reduce((s, m) => s + m.complaints_disposed, 0);
      const totalPending = ministryData.reduce((s, m) => s + m.complaints_pending, 0);
      const totalReceived = ministryData.reduce((s, m) => s + m.complaints_received, 0);
      const estFakeClosed = Math.round(totalResolved * 0.31); // avg fake closure rate
      const actualResolved = totalResolved - estFakeClosed;

      new Chart(document.getElementById('statusDoughnutChart'), {
        type: 'doughnut',
        data: {
          labels: ['Actually Resolved', 'Fake Closed', 'Pending'],
          datasets: [{
            data: [actualResolved, estFakeClosed, totalPending],
            backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
            borderWidth: 3,
            borderColor: '#fff',
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyleWidth: 12, font: { size: 11 } } },
            tooltip: {
              callbacks: {
                label: (ctx) => ctx.label + ': ' + Number(ctx.raw).toLocaleString('en-IN') + ' (' + Math.round(ctx.raw / totalReceived * 100) + '%)'
              }
            }
          }
        }
      });

      // 3. Fake Closure Horizontal Bar — Top 8 worst
      const sortedByFake = [...ministryData].sort((a, b) => b.fake_closure_rate - a.fake_closure_rate).slice(0, 8);
      new Chart(document.getElementById('fakeClosureChart'), {
        type: 'bar',
        data: {
          labels: sortedByFake.map(m => m.ministry_name.replace('Ministry of ', '').replace('Department of ', '').slice(0, 30)),
          datasets: [{
            label: 'Fake Closure Rate (%)',
            data: sortedByFake.map(m => m.fake_closure_rate),
            backgroundColor: sortedByFake.map(m => m.fake_closure_rate >= 35 ? '#dc2626' : m.fake_closure_rate >= 25 ? '#f97316' : '#fbbf24'),
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => ctx.raw + '% fake closure rate' } }
          },
          scales: {
            x: { beginAtZero: true, max: 50, ticks: { callback: v => v + '%' }, grid: { color: '#f1f5f9' } },
            y: { ticks: { font: { size: 10 } }, grid: { display: false } }
          }
        }
      });

      // 4. Resolution Days Comparison
      const top10Days = [...ministryData].sort((a, b) => b.avg_resolution_days - a.avg_resolution_days).slice(0, 10);
      new Chart(document.getElementById('resolutionDaysChart'), {
        type: 'bar',
        data: {
          labels: top10Days.map(m => m.ministry_name.replace('Ministry of ', '').replace('Department of ', '').slice(0, 22)),
          datasets: [{
            label: 'Avg Days',
            data: top10Days.map(m => m.avg_resolution_days),
            backgroundColor: top10Days.map(m => m.avg_resolution_days > 40 ? '#dc2626' : m.avg_resolution_days > 30 ? '#f97316' : '#22c55e'),
            borderRadius: 6,
            borderSkipped: false
          }, {
            label: '30-Day Target',
            data: top10Days.map(() => 30),
            type: 'line',
            borderColor: '#1a365d',
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, font: { size: 10 } } },
            tooltip: { callbacks: { label: (ctx) => ctx.dataset.label + ': ' + ctx.raw + ' days' } }
          },
          scales: {
            y: { beginAtZero: true, ticks: { callback: v => v + 'd' }, grid: { color: '#f1f5f9' } },
            x: { ticks: { maxRotation: 45, minRotation: 30, font: { size: 9 } }, grid: { display: false } }
          }
        }
      });
    }

    // ============================================
    // DEPARTMENT SCORECARD
    // ============================================
    async function loadScorecard() {
      const sort = document.getElementById('scorecardSort').value;
      try {
        const res = await fetch('/api/ministries?sort=' + sort + '&order=' + (sort === 'citizen_satisfaction_rate' ? 'asc' : 'desc'));
        const json = await res.json();
        if (json.success) {
          document.getElementById('scorecardBody').innerHTML = json.data.map((m, i) => \`
            <tr class="hover:bg-gray-50 \${m.fake_closure_flag ? 'bg-red-50/50' : ''}">
              <td class="px-4 py-3 text-xs text-gray-400">\${i + 1}</td>
              <td class="px-4 py-3">
                <div class="font-medium text-sm text-gray-900">\${m.ministry_name}</div>
                <span class="text-xs text-gray-400">\${m.ministry_code}</span>
              </td>
              <td class="px-4 py-3 text-center text-sm font-medium">\${Number(m.complaints_received).toLocaleString()}</td>
              <td class="px-4 py-3 text-center">
                <span class="text-sm font-semibold \${m.official_resolution_rate >= 85 ? 'text-ashoka-600' : 'text-gray-700'}">\${m.official_resolution_rate}%</span>
              </td>
              <td class="px-4 py-3 text-center">
                <span class="text-sm font-semibold \${m.citizen_satisfaction_rate >= 55 ? 'text-ashoka-600' : m.citizen_satisfaction_rate >= 45 ? 'text-saffron-600' : 'text-red-600'}">\${m.citizen_satisfaction_rate}%</span>
              </td>
              <td class="px-4 py-3 text-center">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold \${m.fake_closure_rate >= 35 ? 'bg-red-100 text-red-700' : m.fake_closure_rate >= 25 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}">\${m.fake_closure_rate}%</span>
              </td>
              <td class="px-4 py-3 text-center text-sm \${m.avg_resolution_days > 40 ? 'text-red-600 font-semibold' : 'text-gray-600'}">\${m.avg_resolution_days}d</td>
              <td class="px-4 py-3 text-center">
                \${m.fake_closure_flag ? '<span class="inline-flex items-center gap-1 text-red-600 text-xs font-bold"><i class="fas fa-flag"></i> FLAGGED</span>' : '<span class="text-ashoka-500 text-xs"><i class="fas fa-check"></i></span>'}
              </td>
            </tr>
          \`).join('');
        }
      } catch(e) {}
    }

    // ============================================
    // TRENDING ISSUES
    // ============================================
    async function loadTrendingDash() {
      try {
        const res = await fetch('/api/trending');
        const json = await res.json();
        if (json.success) {
          document.getElementById('trendingGrid').innerHTML = json.data.map(issue => {
            const colors = { critical: 'badge-critical', high: 'badge-high', medium: 'badge-medium', low: 'badge-low' };
            const states = JSON.parse(issue.states_affected || '[]');
            const keywords = JSON.parse(issue.topic_keywords || '[]');
            const ministries = JSON.parse(issue.ministries_affected || '[]');
            return \`
              <div class="card-hover bg-white rounded-2xl border \${issue.is_flagged ? 'border-red-200' : 'border-gray-200'} p-6">
                <div class="flex items-start justify-between mb-3">
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold \${colors[issue.severity]}">\${issue.severity.toUpperCase()}</span>
                  <span class="text-xs text-gray-400"><i class="fas fa-arrow-trend-up \${issue.spike_factor > 2 ? 'text-red-500' : 'text-saffron-500'} mr-1"></i>\${issue.spike_factor}x</span>
                </div>
                <h3 class="font-bold text-gray-900 mb-2">\${issue.topic_name}</h3>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">\${issue.description}</p>
                <div class="flex flex-wrap gap-1 mb-3">
                  \${keywords.slice(0, 4).map(k => '<span class="text-[10px] bg-navy-50 text-navy-600 px-1.5 py-0.5 rounded">' + k + '</span>').join('')}
                </div>
                <div class="flex flex-wrap gap-1 mb-3">
                  \${states.map(s => '<span class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">' + s + '</span>').join('')}
                </div>
                <div class="text-xs text-gray-400 pt-3 border-t border-gray-100">
                  <i class="fas fa-building-columns mr-1"></i>\${ministries[0] || 'Multiple ministries'}
                  <span class="float-right"><i class="fas fa-ticket mr-1"></i>\${issue.complaint_count.toLocaleString()}</span>
                </div>
              </div>
            \`;
          }).join('');
        }
      } catch(e) {}
    }

    // ============================================
    // SOCIAL SIGNALS
    // ============================================
    async function loadSocial() {
      try {
        const res = await fetch('/api/social');
        const json = await res.json();
        if (json.success) {
          document.getElementById('socialGrid').innerHTML = json.data.map(s => {
            const platformIcon = s.platform === 'twitter' ? 'fa-brands fa-x-twitter' : 'fa-solid fa-newspaper';
            const platformColor = s.platform === 'twitter' ? 'bg-gray-900' : 'bg-blue-600';
            const dirColors = { rising: 'text-red-500', stable: 'text-gray-500', falling: 'text-ashoka-500' };
            const dirIcons = { rising: 'fa-arrow-trend-up', stable: 'fa-minus', falling: 'fa-arrow-trend-down' };
            return \`
              <div class="bg-white rounded-xl border border-gray-200 p-4 card-hover">
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-6 h-6 \${platformColor} rounded-md flex items-center justify-center"><i class="\${platformIcon} text-white text-xs"></i></span>
                  <span class="text-xs font-semibold text-gray-700 truncate">\${s.keyword_matched}</span>
                  \${s.spike_detected ? '<span class="ml-auto w-2 h-2 bg-red-500 rounded-full pulse-dot"></span>' : ''}
                </div>
                <p class="text-xs text-gray-500 mb-2 truncate" title="\${s.source_title}">\${s.source_title}</p>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-400"><strong>\${s.post_count_24h}</strong> /24h</span>
                  <span class="\${dirColors[s.trending_direction]}"><i class="fas \${dirIcons[s.trending_direction]} mr-1"></i>\${s.trending_direction}</span>
                </div>
              </div>
            \`;
          }).join('');
        }
      } catch(e) {}
    }

    // Init
    loadDashboard();
  </script>

  <style>
    .leaflet-tooltip-custom {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px 12px;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      box-shadow: 0 4px 12px -2px rgb(0 0 0 / 0.12);
      line-height: 1.5;
    }
    .leaflet-tooltip-custom::before { display: none; }
  </style>
  `
  return layout('Public Dashboard', content, 'dashboard')
}
