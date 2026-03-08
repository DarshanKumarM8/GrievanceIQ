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
          <span class="text-xs text-gray-400 font-medium">Live data • Updated Jan 2026</span>
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

  <!-- India Map -->
  <section class="py-8 sm:py-12" id="map-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-navy-600 to-navy-700 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fas fa-map-location-dot text-white"></i>
            <h2 class="font-bold text-white">India Grievance Intelligence Map</h2>
          </div>
          <select id="mapMetric" onchange="updateMapColors()" class="text-xs bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 text-white focus:outline-none">
            <option value="total_complaints">Total Complaints</option>
            <option value="resolution_rate">Resolution Rate</option>
            <option value="fake_closure_rate">Fake Closure Rate</option>
            <option value="avg_resolution_days">Avg Resolution Days</option>
          </select>
        </div>
        <div class="relative">
          <div id="indiaMap" style="height:550px;background:#f8fafc;"></div>
          <!-- Legend -->
          <div class="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 z-[1000]">
            <p class="text-xs font-semibold text-gray-600 mb-2" id="legendTitle">Complaints Volume</p>
            <div class="flex items-center gap-1" id="legendBar">
              <span class="w-6 h-3 rounded" style="background:#fee2e2"></span>
              <span class="w-6 h-3 rounded" style="background:#fca5a5"></span>
              <span class="w-6 h-3 rounded" style="background:#f87171"></span>
              <span class="w-6 h-3 rounded" style="background:#ef4444"></span>
              <span class="w-6 h-3 rounded" style="background:#dc2626"></span>
              <span class="w-6 h-3 rounded" style="background:#991b1b"></span>
            </div>
            <div class="flex justify-between mt-1"><span class="text-[10px] text-gray-400">Low</span><span class="text-[10px] text-gray-400">High</span></div>
          </div>
        </div>
        <!-- State info panel -->
        <div id="stateInfo" class="hidden px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div id="stateInfoContent"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Department Scorecard -->
  <section class="py-8 sm:py-12 bg-gray-50" id="scorecard">
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
  <section class="py-8 sm:py-12" id="trending">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <span class="w-3 h-3 rounded-full bg-red-500 pulse-dot"></span>
          <h2 class="text-xl sm:text-2xl font-bold text-navy-800">Systemic Issue Radar</h2>
        </div>
        <span class="text-xs text-gray-400">Week of Jan 6, 2026</span>
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
    // LOAD DASHBOARD DATA
    // ============================================
    let stateData = [];
    let map;

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

      // States
      try {
        const res = await fetch('/api/states');
        const json = await res.json();
        if (json.success) { stateData = json.data; initMap(); }
      } catch(e) {}

      // Scorecard
      loadScorecard();
      
      // Trending
      loadTrendingDash();
      
      // Social
      loadSocial();
    }

    // ============================================
    // INDIA MAP
    // ============================================
    function initMap() {
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

      // Draw states as circle markers (since GeoJSON boundaries are too heavy for CDN)
      const stateCoords = {
        'UP': [26.85, 80.91], 'MH': [19.75, 75.71], 'BR': [25.09, 85.31], 'RJ': [27.02, 74.21],
        'TN': [11.13, 78.66], 'MP': [22.97, 78.66], 'KA': [15.32, 75.71], 'WB': [22.99, 87.75],
        'GJ': [22.26, 71.19], 'AP': [15.91, 79.74], 'TG': [18.11, 79.02], 'KL': [10.85, 76.27],
        'DL': [28.7, 77.1], 'OD': [20.94, 85.1], 'PB': [31.15, 75.34], 'HR': [29.06, 76.09],
        'JH': [23.61, 85.28], 'CG': [21.27, 81.87], 'AS': [26.2, 92.94], 'UK': [30.07, 79.49],
        'HP': [31.1, 77.17], 'JK': [33.78, 76.58], 'GA': [15.3, 74.08], 'TR': [23.94, 91.99],
        'ML': [25.47, 91.37], 'MN': [24.66, 93.91], 'NL': [26.16, 94.56], 'AR': [28.22, 94.73],
        'MZ': [23.16, 92.94], 'SK': [27.53, 88.51], 'PY': [11.94, 79.83], 'CH': [30.73, 76.77],
        'AN': [11.74, 92.66], 'LA': [34.15, 77.58], 'LD': [10.57, 72.64], 'DN': [20.42, 72.83]
      };

      stateData.forEach(state => {
        const coords = stateCoords[state.state_code];
        if (!coords) return;

        const metric = document.getElementById('mapMetric').value;
        const val = state[metric] || 0;
        const color = getColor(val, metric);
        const radius = Math.max(8, Math.sqrt(state.total_complaints) / 8);

        const circle = L.circleMarker(coords, {
          radius: radius,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85
        }).addTo(map);

        circle.bindTooltip(\`<strong>\${state.state_name}</strong><br>\${Number(state.total_complaints).toLocaleString()} complaints\`, {
          direction: 'top',
          className: 'leaflet-tooltip-custom'
        });

        circle.on('click', () => showStateInfo(state));
        circle.stateData = state;
      });
    }

    function getColor(val, metric) {
      if (metric === 'total_complaints') {
        return val > 50000 ? '#991b1b' : val > 30000 ? '#dc2626' : val > 20000 ? '#ef4444' : val > 10000 ? '#f87171' : val > 5000 ? '#fca5a5' : '#fee2e2';
      } else if (metric === 'fake_closure_rate') {
        return val > 20 ? '#991b1b' : val > 15 ? '#dc2626' : val > 12 ? '#ef4444' : val > 8 ? '#f87171' : val > 5 ? '#fca5a5' : '#fee2e2';
      } else if (metric === 'resolution_rate') {
        return val > 80 ? '#166534' : val > 75 ? '#22c55e' : val > 70 ? '#86efac' : val > 65 ? '#fbbf24' : val > 60 ? '#f87171' : '#991b1b';
      } else {
        return val > 50 ? '#991b1b' : val > 40 ? '#dc2626' : val > 35 ? '#ef4444' : val > 30 ? '#f87171' : val > 25 ? '#fca5a5' : '#fee2e2';
      }
    }

    function updateMapColors() {
      if (!map) return;
      const metric = document.getElementById('mapMetric').value;
      const labels = { total_complaints: 'Complaints Volume', resolution_rate: 'Resolution Rate', fake_closure_rate: 'Fake Closure Rate', avg_resolution_days: 'Avg Days to Resolve' };
      document.getElementById('legendTitle').textContent = labels[metric];
      
      map.eachLayer(layer => {
        if (layer.stateData) {
          const val = layer.stateData[metric] || 0;
          layer.setStyle({ fillColor: getColor(val, metric) });
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
            <h3 class="font-bold text-lg text-navy-700 mb-1">\${state.state_name}</h3>
            <p class="text-sm text-gray-500">State Code: \${state.state_code}</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div><span class="text-lg font-bold text-navy-700">\${Number(state.total_complaints).toLocaleString()}</span><br><span class="text-xs text-gray-500">Total</span></div>
            <div><span class="text-lg font-bold text-ashoka-600">\${state.resolution_rate}%</span><br><span class="text-xs text-gray-500">Resolution</span></div>
            <div><span class="text-lg font-bold text-red-600">\${state.fake_closure_rate}%</span><br><span class="text-xs text-gray-500">Fake Closure</span></div>
            <div><span class="text-lg font-bold text-saffron-600">\${state.avg_resolution_days}d</span><br><span class="text-xs text-gray-500">Avg Days</span></div>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500 mb-1">TOP ISSUES</p>
            \${topIssues.slice(0, 3).map(i => '<span class="inline-block text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded mr-1 mb-1">' + i + '</span>').join('')}
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500 mb-1">TOP DEPARTMENTS</p>
            \${topDepts.slice(0, 3).map(d => '<span class="inline-block text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded mr-1 mb-1">' + d + '</span>').join('')}
          </div>
        </div>
      \`;
      panel.classList.remove('hidden');
    }

    // ============================================
    // DEPARTMENT SCORECARD
    // ============================================
    async function loadScorecard() {
      const sort = document.getElementById('scorecardSort').value;
      const order = sort === 'citizen_satisfaction_rate' ? 'asc' : 'desc';
      try {
        const res = await fetch(\`/api/ministries?sort=\${sort}&order=\${sort === 'citizen_satisfaction_rate' ? 'asc' : 'desc'}\`);
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
      border-radius: 8px;
      padding: 6px 10px;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
  </style>
  `
  return layout('Public Dashboard', content, 'dashboard')
}
