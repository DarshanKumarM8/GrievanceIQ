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
      await Promise.all([loadHealth(), loadAlerts(), loadAuditLogs(), loadEmailQueue(), loadDeptChart(), loadCPGRAMSStats()]);
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
          const iconMap = { login: 'fas fa-sign-in-alt text-ashoka-500', logout: 'fas fa-sign-out-alt text-gray-400', otp_request: 'fas fa-key text-saffron-500', profile_update: 'fas fa-user-edit text-blue-500', complaint_filed: 'fas fa-file-alt text-purple-500' };
          const icon = iconMap[log.action] || 'fas fa-circle text-gray-400';
          return '<div class="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 border-b border-gray-50">' +
            '<i class="' + icon + ' text-sm w-5 text-center flex-shrink-0"></i>' +
            '<div class="flex-1 min-w-0"><span class="text-xs font-semibold text-gray-700">' + (log.action || '').replace(/_/g, ' ') + '</span>' +
            (log.details ? ' <span class="text-[10px] text-gray-400">— ' + log.details + '</span>' : '') + '</div>' +
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

    refreshAdmin();
  </script>
  `
  return layout('Admin Analytics', content, 'admin', {
    description: 'GrievanceIQ admin dashboard: system health monitoring, audit logs, email queue management, CPGRAMS integration stats, and department performance analytics.',
    keywords: 'admin, analytics, system health, audit log, email queue, CPGRAMS statistics'
  })
}
