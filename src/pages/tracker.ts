import { layout } from './layout'

export function trackerPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-800 to-navy-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2"><i class="fas fa-calendar-check text-saffron-400 mr-2"></i>Complaint Journal & Escalation Timer</h1>
      <p class="text-gray-300 text-sm">Log your CPGRAMS complaint, track your 45-day legal deadline, and escalate automatically with a pre-filled RTI if ignored.</p>
    </div>
  </section>

  <section class="py-8 sm:py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Log Input -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
          <h2 class="font-semibold text-gray-700 dark:text-white text-sm"><i class="fas fa-pen-to-square mr-2 text-saffron-500"></i>Log Your Complaint</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input type="text" id="cpgramsInput" placeholder="e.g., PMOPG/E/2026/0012345" class="px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100">
            <input type="date" id="filingDate" class="px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:outline-none focus:border-saffron-400">
          </div>
          <input type="text" id="deptInput" placeholder="Department/Ministry (optional)" class="w-full mb-3 px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:outline-none focus:border-saffron-400">
          <button onclick="startTracking()" id="trackBtn" class="w-full bg-saffron-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-saffron-600 transition-colors flex items-center justify-center gap-2">
            <i class="fas fa-clock"></i> Start Escalation Timer
          </button>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-3"><i class="fas fa-info-circle mr-1"></i>We cannot check CPGRAMS automatically — but we track your 45-day legal deadline and tell you exactly when and how to escalate.</p>
        </div>
      </div>

      <!-- Results Container (hidden initially) -->
      <div id="trackerResults" class="hidden space-y-6">

        <!-- SECTION A: Timeline Bar -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-saffron-500 to-saffron-600">
            <h2 class="font-bold text-white text-sm"><i class="fas fa-stopwatch mr-2"></i>45-Day Legal Escalation Timeline</h2>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Day 0</span>
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Day 15</span>
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Day 25</span>
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Day 45</span>
            </div>
            <div class="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
              <div id="timelineBar" class="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 via-saffron-500 to-red-500 rounded-full transition-all duration-700" style="width:0%"></div>
            </div>
            <div class="flex justify-between">
              <div id="ms-day0" class="flex flex-col items-center"><div class="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 mt-1"></div><span class="text-[10px] text-gray-400 mt-0.5">Filed</span></div>
              <div id="ms-day15" class="flex flex-col items-center"><div class="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 mt-1"></div><span class="text-[10px] text-gray-400 mt-0.5">1st Check</span></div>
              <div id="ms-day25" class="flex flex-col items-center"><div class="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 mt-1"></div><span class="text-[10px] text-gray-400 mt-0.5">2nd Check</span></div>
              <div id="ms-day45" class="flex flex-col items-center"><div class="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 mt-1"></div><span class="text-[10px] text-gray-400 mt-0.5">Deadline</span></div>
            </div>
            <div class="mt-4 text-center">
              <span class="text-3xl font-black text-navy-700 dark:text-white" id="daysElapsed">0</span>
              <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">days elapsed</span>
              <span class="mx-2 text-gray-300">|</span>
              <span class="text-3xl font-black text-red-600 dark:text-red-400" id="daysRemaining">45</span>
              <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">days remaining</span>
            </div>
          </div>
        </div>

        <!-- SECTION B: What To Do Today -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-navy-600 to-navy-700">
            <h2 class="font-bold text-white text-sm"><i class="fas fa-clipboard-list mr-2"></i>What To Do Today</h2>
          </div>
          <div class="p-6" id="whatToDoContent">
            <!-- Populated by JS -->
          </div>
        </div>

        <!-- SECTION C: Status Update (Self-Report) -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700">
            <h2 class="font-bold text-white text-sm"><i class="fas fa-bullhorn mr-2"></i>Report Your Status</h2>
          </div>
          <div class="p-6">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">After checking CPGRAMS, tell us what you found. Your report powers our national fake closure detector.</p>
            <div class="grid grid-cols-1 gap-3" id="reportButtons">
              <button onclick="submitFeedback('resolved_real')" class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors text-left">
                <span class="text-2xl">✅</span>
                <div><div class="font-semibold text-sm text-green-800 dark:text-green-300">Resolved — My problem is actually fixed</div><div class="text-xs text-green-600 dark:text-green-400">The issue was genuinely addressed</div></div>
              </button>
              <button onclick="submitFeedback('fake_closed')" class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-left">
                <span class="text-2xl">⚠️</span>
                <div><div class="font-semibold text-sm text-red-800 dark:text-red-300">Marked Resolved but problem NOT fixed</div><div class="text-xs text-red-600 dark:text-red-400">This is a fake closure — your report matters</div></div>
              </button>
              <button onclick="submitFeedback('pending')" class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left">
                <span class="text-2xl">🕐</span>
                <div><div class="font-semibold text-sm text-gray-800 dark:text-gray-200">Still Pending — No update yet</div><div class="text-xs text-gray-500 dark:text-gray-400">We'll remind you at the next milestone</div></div>
              </button>
            </div>
            <!-- Fake Closure Follow-up (hidden) -->
            <div id="fakeClosureForm" class="hidden mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <label class="text-sm font-semibold text-red-800 dark:text-red-300 block mb-2">What was the issue?</label>
              <select id="fakeCategory" class="w-full px-3 py-2 border border-red-300 dark:border-red-700 dark:bg-gray-700 dark:text-white rounded-lg text-sm mb-3">
                <option value="no_action">No action was taken at all</option>
                <option value="partial">Only partially addressed</option>
                <option value="wrong_response">Response was irrelevant to my complaint</option>
                <option value="templated">Got a generic templated response</option>
                <option value="redirected">Redirected without resolution</option>
              </select>
              <button onclick="confirmFakeClosure()" class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors w-full">Submit Fake Closure Report</button>
            </div>
            <!-- Feedback message -->
            <div id="feedbackMsg" class="hidden mt-4 p-4 rounded-xl text-sm font-medium text-center"></div>
            <!-- Update History -->
            <div id="updateHistory" class="hidden mt-4">
              <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Your Report History</h4>
              <div id="historyList" class="space-y-2"></div>
            </div>
          </div>
        </div>

        <!-- SECTION D: Complaint Details -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700">
            <h2 class="font-bold text-white text-sm"><i class="fas fa-file-lines mr-2"></i>Complaint Details</h2>
          </div>
          <div class="p-6" id="complaintDetails">
            <!-- Populated by JS -->
          </div>
        </div>

      </div><!-- /trackerResults -->
    </div>
  </section>

  <script>
    let trackedData = null;

    function getSessionId() {
      let sid = localStorage.getItem('grievanceiq_session');
      if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('grievanceiq_session', sid); }
      return sid;
    }

    async function startTracking() {
      const cpgrams = document.getElementById('cpgramsInput').value.trim();
      const filingDate = document.getElementById('filingDate').value || new Date().toISOString().split('T')[0];
      const dept = document.getElementById('deptInput').value.trim();
      if (!cpgrams) { alert('Please enter your CPGRAMS ID'); return; }

      const btn = document.getElementById('trackBtn');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/tracker/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cpgrams_id: cpgrams, filing_date: filingDate, department: dept, session_id: getSessionId() })
        });
        const json = await res.json();
        if (json.success) {
          trackedData = json.data;
          renderTracker();
        } else {
          alert('Error: ' + (json.error || 'Unknown'));
        }
      } catch (e) { alert('Network error'); }
      btn.innerHTML = '<i class="fas fa-clock"></i> Start Escalation Timer';
      btn.disabled = false;
    }

    function renderTracker() {
      if (!trackedData) return;
      document.getElementById('trackerResults').classList.remove('hidden');

      const filed = new Date(trackedData.filing_date);
      const now = new Date();
      const days = Math.max(0, Math.floor((now - filed) / 86400000));
      const remaining = Math.max(0, 45 - days);
      const pct = Math.min(100, (days / 45) * 100);

      document.getElementById('daysElapsed').textContent = days;
      document.getElementById('daysRemaining').textContent = remaining;
      document.getElementById('timelineBar').style.width = pct + '%';

      // Milestone dots
      const milestones = [['ms-day0', 0], ['ms-day15', 15], ['ms-day25', 25], ['ms-day45', 45]];
      milestones.forEach(([id, d]) => {
        const dot = document.getElementById(id).querySelector('div');
        if (days >= d) { dot.className = 'w-5 h-5 rounded-full bg-saffron-500 border-2 border-white dark:border-gray-800 mt-1 ring-2 ring-saffron-300'; }
        if (days >= d && d === Math.max(...milestones.filter(m => days >= m[1]).map(m => m[1]))) {
          dot.className = 'w-5 h-5 rounded-full bg-saffron-500 border-2 border-white dark:border-gray-800 mt-1 ring-4 ring-saffron-300 animate-pulse';
        }
      });

      // Section B: What To Do Today
      const wtd = document.getElementById('whatToDoContent');
      if (days < 15) {
        wtd.innerHTML = '<div class="flex items-start gap-3"><div class="text-3xl">🟢</div><div><h3 class="font-bold text-gray-800 dark:text-white text-sm mb-1">Normal Processing Window</h3><p class="text-sm text-gray-600 dark:text-gray-300">Your complaint is within the normal processing window. No action needed yet. We\\'ll remind you on Day 15.</p></div></div>';
      } else if (days < 25) {
        wtd.innerHTML = '<div class="flex items-start gap-3"><div class="text-3xl">⏰</div><div><h3 class="font-bold text-saffron-700 dark:text-saffron-400 text-sm mb-1">Day 15 Check Due</h3><p class="text-sm text-gray-600 dark:text-gray-300 mb-3">Visit pgportal.gov.in now and check your complaint status. Come back and report what you found.</p><a href="https://pgportal.gov.in" target="_blank" class="inline-flex items-center gap-2 bg-saffron-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-saffron-600 transition-colors"><i class="fas fa-external-link-alt"></i>Check CPGRAMS Now →</a></div></div>';
      } else if (days < 30) {
        wtd.innerHTML = '<div class="flex items-start gap-3"><div class="text-3xl">⚠️</div><div><h3 class="font-bold text-orange-700 dark:text-orange-400 text-sm mb-1">Day 25 Alert</h3><p class="text-sm text-gray-600 dark:text-gray-300 mb-3">Your complaint should be resolved by now. If status is still pending, prepare to escalate.</p><a href="https://pgportal.gov.in" target="_blank" class="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"><i class="fas fa-external-link-alt"></i>Check CPGRAMS Now →</a></div></div>';
      } else if (days < 45) {
        wtd.innerHTML = '<div class="flex items-start gap-3"><div class="text-3xl">🔴</div><div><h3 class="font-bold text-red-700 dark:text-red-400 text-sm mb-1">Approaching Deadline</h3><p class="text-sm text-gray-600 dark:text-gray-300 mb-3">The 45-day legal resolution window closes in <strong>' + remaining + ' days</strong>. If unresolved, your RTI application is ready.</p><a href="/rti" class="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"><i class="fas fa-file-alt"></i>Generate RTI Application</a></div></div>';
      } else {
        wtd.innerHTML = '<div class="flex items-start gap-3"><div class="text-3xl">❌</div><div><h3 class="font-bold text-red-700 dark:text-red-400 text-sm mb-1">Deadline Passed</h3><p class="text-sm text-gray-600 dark:text-gray-300 mb-3">Your complaint was not resolved within the legal 45-day window. File your RTI application now.</p><a href="/rti" class="inline-flex items-center gap-2 bg-red-700 text-white px-5 py-3 rounded-lg text-sm font-bold hover:bg-red-800 transition-colors animate-pulse"><i class="fas fa-file-alt"></i>Generate RTI Application Now</a></div></div>';
      }

      // Section D: Complaint Details
      const det = document.getElementById('complaintDetails');
      det.innerHTML = '<div class="grid grid-cols-2 gap-4">' +
        '<div><div class="text-xs text-gray-500 dark:text-gray-400 mb-1">CPGRAMS ID</div><div class="flex items-center gap-2"><span class="font-mono font-bold text-sm text-navy-700 dark:text-white">' + trackedData.cpgrams_id + '</span><button onclick="navigator.clipboard.writeText(\\'' + trackedData.cpgrams_id + '\\');this.innerHTML=\\'<i class=\\\\\\'fas fa-check text-green-500\\\\\\'></i>\\'" class="text-gray-400 hover:text-saffron-500"><i class="fas fa-copy text-xs"></i></button></div></div>' +
        '<div><div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Filed Date</div><div class="font-semibold text-sm text-gray-800 dark:text-white">' + trackedData.filing_date + '</div></div>' +
        '<div><div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Days Elapsed / Remaining</div><div class="font-semibold text-sm text-gray-800 dark:text-white">' + days + 'd / ' + remaining + 'd</div></div>' +
        '<div><div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Department</div><div class="font-semibold text-sm text-gray-800 dark:text-white">' + (trackedData.department || 'Not specified') + '</div></div>' +
        '</div>' +
        (trackedData.linked_analysis ? '<a href="/complaint-detail?id=' + trackedData.linked_analysis.id + '" class="mt-4 inline-flex items-center gap-2 text-sm text-saffron-600 dark:text-saffron-400 hover:underline font-semibold"><i class="fas fa-arrow-right"></i>View full complaint analysis →</a>' : '');

      // Render update history if exists
      if (trackedData.update_history && trackedData.update_history.length > 0) {
        document.getElementById('updateHistory').classList.remove('hidden');
        const list = document.getElementById('historyList');
        list.innerHTML = trackedData.update_history.map(u => {
          const icon = u.citizen_report === 'resolved_real' ? '✅' : u.citizen_report === 'fake_closed' ? '⚠️' : '🕐';
          const label = u.citizen_report === 'resolved_real' ? 'Resolved' : u.citizen_report === 'fake_closed' ? 'Fake Closure' : 'Pending';
          const color = u.citizen_report === 'resolved_real' ? 'green' : u.citizen_report === 'fake_closed' ? 'red' : 'gray';
          return '<div class="flex items-center gap-3 p-2 bg-' + color + '-50 dark:bg-' + color + '-900/20 rounded-lg border border-' + color + '-200 dark:border-' + color + '-800"><span>' + icon + '</span><div class="flex-1"><span class="text-xs font-semibold text-' + color + '-800 dark:text-' + color + '-300">' + label + '</span><span class="text-xs text-gray-400 ml-2">Day ' + u.day_number + '</span></div><span class="text-[10px] text-gray-400">' + new Date(u.created_at).toLocaleDateString() + '</span></div>';
        }).join('');
      }

      document.getElementById('trackerResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function submitFeedback(report) {
      if (report === 'fake_closed') {
        document.getElementById('fakeClosureForm').classList.remove('hidden');
        return;
      }
      await sendFeedback(report);
    }

    async function confirmFakeClosure() {
      const cat = document.getElementById('fakeCategory').value;
      await sendFeedback('fake_closed', cat);
    }

    async function sendFeedback(report, category) {
      const body = { cpgrams_id: trackedData.cpgrams_id, citizen_report: report };
      if (category) body.fake_closure_category = category;
      if (category) body.notes = document.getElementById('fakeCategory').selectedOptions[0].text;

      try {
        const res = await fetch('/api/tracker/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const json = await res.json();
        const msg = document.getElementById('feedbackMsg');
        msg.classList.remove('hidden');
        document.getElementById('fakeClosureForm').classList.add('hidden');

        if (report === 'resolved_real') {
          msg.className = 'mt-4 p-4 rounded-xl text-sm font-medium text-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800';
          msg.innerHTML = '🎉 ' + json.message;
        } else if (report === 'fake_closed') {
          msg.className = 'mt-4 p-4 rounded-xl text-sm font-medium text-center bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800';
          msg.innerHTML = '🚨 ' + json.message + '<br><a href="/rti" class="underline font-bold mt-1 inline-block">Generate RTI Application →</a>';
        } else {
          msg.className = 'mt-4 p-4 rounded-xl text-sm font-medium text-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600';
          msg.innerHTML = '📝 ' + json.message;
        }

        // Refresh data
        const refreshRes = await fetch('/api/tracker/' + encodeURIComponent(trackedData.cpgrams_id));
        const refreshJson = await refreshRes.json();
        if (refreshJson.success) { trackedData = refreshJson.data; renderTracker(); }
      } catch (e) { alert('Network error submitting feedback'); }
    }

    // Auto-load if returning user has a saved complaint
    document.addEventListener('DOMContentLoaded', () => {
      const lastId = localStorage.getItem('grievanceiq_last_cpgrams');
      if (lastId) {
        document.getElementById('cpgramsInput').value = lastId;
        fetch('/api/tracker/' + encodeURIComponent(lastId))
          .then(r => r.json())
          .then(json => { if (json.success) { trackedData = json.data; renderTracker(); } })
          .catch(() => {});
      }
    });

    // Save CPGRAMS ID on track
    const origStart = startTracking;
    const _startTracking = startTracking;
    startTracking = async function() {
      await _startTracking();
      const cpgrams = document.getElementById('cpgramsInput').value.trim();
      if (cpgrams) localStorage.setItem('grievanceiq_last_cpgrams', cpgrams);
    };
  </script>
  `
  return layout('Complaint Journal & Escalation Timer | GrievanceIQ', content)
}
