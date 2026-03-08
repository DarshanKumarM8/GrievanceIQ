import { layout } from './layout'

export function trackerPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-800 to-navy-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2"><i class="fas fa-magnifying-glass text-saffron-400 mr-2"></i>Complaint Tracker</h1>
      <p class="text-gray-300 text-sm">Enter your CPGRAMS complaint ID to track progress, get reminders, and report outcomes.</p>
    </div>
  </section>

  <section class="py-8 sm:py-12">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Track Input -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h2 class="font-semibold text-gray-700 text-sm"><i class="fas fa-search mr-2 text-saffron-500"></i>Enter Your CPGRAMS ID</h2>
        </div>
        <div class="p-6">
          <div class="flex gap-3">
            <input type="text" id="cpgramsInput" placeholder="e.g., PMOPG/E/2026/0012345" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100">
            <button onclick="trackComplaint()" id="trackBtn" class="bg-saffron-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-saffron-600 transition-colors flex items-center gap-2">
              <i class="fas fa-search"></i> Track
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-2"><i class="fas fa-info-circle mr-1"></i>Find your CPGRAMS ID in the acknowledgment email or SMS from pgportal.gov.in</p>
        </div>
      </div>

      <!-- Timeline Results -->
      <div id="trackerResults" class="hidden">
        <!-- Status Summary -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6" id="statusSummary"></div>
        
        <!-- Visual Timeline -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div class="px-6 py-4 bg-gradient-to-r from-navy-600 to-navy-700">
            <h2 class="font-bold text-white"><i class="fas fa-timeline mr-2"></i>Complaint Journey</h2>
          </div>
          <div class="p-6" id="timelineContent"></div>
        </div>

        <!-- Feedback Form -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div class="px-6 py-4 bg-gradient-to-r from-saffron-500 to-saffron-600">
            <h2 class="font-bold text-white"><i class="fas fa-comment-dots mr-2"></i>Report Outcome</h2>
          </div>
          <div class="p-6">
            <p class="text-sm text-gray-600 mb-4">Was your problem actually resolved? Your feedback powers our fake closure detection system.</p>
            <div class="grid grid-cols-3 gap-3 mb-4">
              <button onclick="selectOutcome('resolved')" class="outcome-btn p-4 rounded-xl border-2 border-gray-200 hover:border-ashoka-400 transition-colors text-center">
                <i class="fas fa-check-circle text-2xl text-ashoka-500 mb-2"></i>
                <p class="text-xs font-semibold">Yes, Resolved</p>
              </button>
              <button onclick="selectOutcome('partially_resolved')" class="outcome-btn p-4 rounded-xl border-2 border-gray-200 hover:border-saffron-400 transition-colors text-center">
                <i class="fas fa-circle-half-stroke text-2xl text-saffron-500 mb-2"></i>
                <p class="text-xs font-semibold">Partially</p>
              </button>
              <button onclick="selectOutcome('fake_closed')" class="outcome-btn p-4 rounded-xl border-2 border-gray-200 hover:border-red-400 transition-colors text-center">
                <i class="fas fa-times-circle text-2xl text-red-500 mb-2"></i>
                <p class="text-xs font-semibold">Fake Closed</p>
              </button>
            </div>
            <div id="feedbackExtra" class="hidden">
              <textarea id="feedbackText" rows="3" placeholder="Tell us more about your experience (optional)" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-saffron-400 mb-3"></textarea>
              <button onclick="submitFeedback()" class="bg-navy-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-700">Submit Feedback</button>
            </div>
          </div>
        </div>

        <!-- RTI Escalation -->
        <div class="bg-gradient-to-r from-red-50 to-saffron-50 rounded-2xl border border-red-200 p-6 mb-6">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i class="fas fa-gavel text-red-600"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Complaint Ignored Past 30 Days?</h3>
              <p class="text-sm text-gray-600 mb-3">Generate a pre-filled RTI application to demand accountability.</p>
              <a href="/rti" class="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
                <i class="fas fa-file-lines"></i> Generate RTI Application
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <script>
    let selectedOutcome = null;

    async function trackComplaint() {
      const id = document.getElementById('cpgramsInput').value.trim();
      if (!id) { showToast('Please enter a CPGRAMS ID', 'warning'); return; }

      document.getElementById('trackBtn').innerHTML = '<span class="spinner" style="width:16px;height:16px;"></span> Tracking...';

      try {
        const res = await fetch('/api/complaints/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cpgrams_id: id })
        });
        const json = await res.json();
        if (json.success) renderTimeline(json.data);
        else showToast(json.error || 'Tracking failed', 'error');
      } catch(e) { showToast('Network error', 'error'); }

      document.getElementById('trackBtn').innerHTML = '<i class="fas fa-search"></i> Track';
    }

    function renderTimeline(data) {
      document.getElementById('trackerResults').classList.remove('hidden');

      // Status summary
      const statusColors = { pending: 'saffron', resolved: 'ashoka', escalated: 'red' };
      document.getElementById('statusSummary').innerHTML = \`
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><span class="text-xs text-gray-500">CPGRAMS ID</span><br><span class="font-bold text-sm text-navy-700">\${data.cpgrams_id}</span></div>
          <div><span class="text-xs text-gray-500">Status</span><br><span class="font-bold text-sm text-saffron-600 capitalize">\${data.status}</span></div>
          <div><span class="text-xs text-gray-500">Days Elapsed</span><br><span class="font-bold text-sm \${data.days_elapsed > 25 ? 'text-red-600' : 'text-navy-700'}">\${data.days_elapsed} / 30</span></div>
          <div><span class="text-xs text-gray-500">Expected By</span><br><span class="font-bold text-sm text-navy-700">\${data.expected_resolution_date}</span></div>
        </div>
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="h-2 rounded-full \${data.days_elapsed > 25 ? 'bg-red-500' : data.days_elapsed > 15 ? 'bg-saffron-500' : 'bg-ashoka-500'}" style="width:\${Math.min((data.days_elapsed/30)*100, 100)}%"></div>
          </div>
          <div class="flex justify-between mt-1"><span class="text-[10px] text-gray-400">Filed</span><span class="text-[10px] text-gray-400">Day 15</span><span class="text-[10px] text-gray-400">Day 25</span><span class="text-[10px] text-gray-400">Day 30</span></div>
        </div>
      \`;

      // Timeline
      document.getElementById('timelineContent').innerHTML = data.timeline.map((t, i) => {
        const isCompleted = t.status === 'completed';
        const isActive = t.status === 'active';
        const dotColor = isCompleted ? 'bg-ashoka-500' : isActive ? 'bg-saffron-500 pulse-dot' : 'bg-gray-300';
        const lineColor = isCompleted ? 'bg-ashoka-300' : 'bg-gray-200';
        return \`
          <div class="flex gap-4 \${i < data.timeline.length - 1 ? 'pb-6' : ''}">
            <div class="flex flex-col items-center">
              <div class="w-4 h-4 rounded-full \${dotColor} flex-shrink-0 \${isActive ? '' : ''}"></div>
              \${i < data.timeline.length - 1 ? '<div class="w-0.5 flex-1 ' + lineColor + ' mt-1"></div>' : ''}
            </div>
            <div class="\${isActive ? 'bg-saffron-50 -m-2 p-2 rounded-lg border border-saffron-200' : ''}">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">\${t.date}</span>
                \${isActive ? '<span class="text-[10px] bg-saffron-200 text-saffron-800 px-1.5 py-0.5 rounded font-semibold">CURRENT</span>' : ''}
              </div>
              <h4 class="font-semibold text-sm \${isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'}">\${t.event}</h4>
              <p class="text-xs \${isCompleted || isActive ? 'text-gray-600' : 'text-gray-400'}">\${t.description}</p>
            </div>
          </div>
        \`;
      }).join('');

      document.getElementById('trackerResults').scrollIntoView({ behavior: 'smooth' });
    }

    function selectOutcome(outcome) {
      selectedOutcome = outcome;
      document.querySelectorAll('.outcome-btn').forEach(b => b.classList.remove('border-ashoka-400', 'border-saffron-400', 'border-red-400', 'bg-ashoka-50', 'bg-saffron-50', 'bg-red-50'));
      const colors = { resolved: ['border-ashoka-400', 'bg-ashoka-50'], partially_resolved: ['border-saffron-400', 'bg-saffron-50'], fake_closed: ['border-red-400', 'bg-red-50'] };
      event.currentTarget.classList.add(...colors[outcome]);
      document.getElementById('feedbackExtra').classList.remove('hidden');
    }

    async function submitFeedback() {
      if (!selectedOutcome) return;
      try {
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            complaint_id: 1,
            official_status: 'Under Process',
            citizen_actual_resolution: selectedOutcome,
            satisfaction_score: selectedOutcome === 'resolved' ? 5 : selectedOutcome === 'partially_resolved' ? 3 : 1,
            feedback_text: document.getElementById('feedbackText').value
          })
        });
        showToast('Thank you for your feedback! This powers our accountability data.', 'success');
      } catch(e) { showToast('Error submitting feedback', 'error'); }
    }
  </script>
  `
  return layout('Complaint Tracker', content, 'tracker')
}
