import { layout } from './layout'

export function trackerPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-800 to-navy-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2"><i class="fas fa-magnifying-glass text-saffron-400 mr-2"></i><span data-i18n="tracker_title">Complaint Tracker</span></h1>
      <p class="text-gray-300 text-sm" data-i18n="tracker_subtitle">Enter your CPGRAMS complaint ID to track progress, get Day 15/25 countdown reminders, and report outcomes.</p>
    </div>
  </section>

  <section class="py-8 sm:py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
          
          <!-- Custom Filing Date -->
          <div class="mt-3 flex items-center gap-3">
            <label class="text-xs text-gray-500 font-medium whitespace-nowrap">Filing Date (optional):</label>
            <input type="date" id="filingDate" class="text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-saffron-400">
            <span class="text-[10px] text-gray-400">For accurate countdown timer</span>
          </div>
        </div>
      </div>

      <!-- Timeline Results -->
      <div id="trackerResults" class="hidden">
        <!-- Countdown Timer -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6" id="countdownSection">
          <div class="px-6 py-4 bg-gradient-to-r from-saffron-500 to-saffron-600">
            <h2 class="font-bold text-white"><i class="fas fa-stopwatch mr-2"></i>Resolution Countdown</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-4 gap-4 text-center mb-6" id="countdownGrid">
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="text-3xl font-black text-navy-700" id="cd-days">—</div>
                <div class="text-xs text-gray-500 mt-1">Days Left</div>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="text-3xl font-black text-navy-700" id="cd-hours">—</div>
                <div class="text-xs text-gray-500 mt-1">Hours</div>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="text-3xl font-black text-navy-700" id="cd-mins">—</div>
                <div class="text-xs text-gray-500 mt-1">Minutes</div>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="text-3xl font-black text-navy-700" id="cd-secs">—</div>
                <div class="text-xs text-gray-500 mt-1">Seconds</div>
              </div>
            </div>
            
            <!-- Day 15/25 Milestones -->
            <div class="grid grid-cols-3 gap-3">
              <div class="relative" id="milestone-filed">
                <div class="bg-ashoka-50 rounded-xl p-3 text-center border-2 border-ashoka-200">
                  <i class="fas fa-paper-plane text-ashoka-500 text-lg mb-1"></i>
                  <div class="text-xs font-bold text-ashoka-700">Filed</div>
                  <div class="text-[10px] text-ashoka-600" id="m-filed-date">—</div>
                </div>
              </div>
              <div class="relative" id="milestone-day15">
                <div class="bg-saffron-50 rounded-xl p-3 text-center border-2 border-saffron-200">
                  <i class="fas fa-bell text-saffron-500 text-lg mb-1"></i>
                  <div class="text-xs font-bold text-saffron-700">Day 15 Reminder</div>
                  <div class="text-[10px] text-saffron-600" id="m-day15-date">—</div>
                  <div class="text-[9px] font-semibold mt-0.5" id="m-day15-status"></div>
                </div>
              </div>
              <div class="relative" id="milestone-day25">
                <div class="bg-red-50 rounded-xl p-3 text-center border-2 border-red-200">
                  <i class="fas fa-exclamation-triangle text-red-500 text-lg mb-1"></i>
                  <div class="text-xs font-bold text-red-700">Day 25 Warning</div>
                  <div class="text-[10px] text-red-600" id="m-day25-date">—</div>
                  <div class="text-[9px] font-semibold mt-0.5" id="m-day25-status"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Summary -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6" id="statusSummary"></div>
        
        <!-- Visual Timeline -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div class="px-6 py-4 bg-gradient-to-r from-navy-600 to-navy-700">
            <h2 class="font-bold text-white"><i class="fas fa-timeline mr-2"></i>Complaint Journey</h2>
          </div>
          <div class="p-6" id="timelineContent"></div>
        </div>

        <!-- Action Recommendations -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6" id="actionPanel">
          <div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700">
            <h2 class="font-bold text-white"><i class="fas fa-clipboard-list mr-2"></i>Recommended Actions</h2>
          </div>
          <div class="p-6" id="actionContent"></div>
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
        <div class="bg-gradient-to-r from-red-50 to-saffron-50 rounded-2xl border border-red-200 p-6 mb-6" id="rtiEscalation">
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
    let countdownInterval = null;

    async function trackComplaint() {
      const id = document.getElementById('cpgramsInput').value.trim();
      if (!id) { showToast('Please enter a CPGRAMS ID', 'warning'); return; }

      const filingDateInput = document.getElementById('filingDate').value;
      document.getElementById('trackBtn').innerHTML = '<span class="spinner" style="width:16px;height:16px;"></span> Tracking...';

      try {
        const body = { cpgrams_id: id };
        if (filingDateInput) body.filing_date = filingDateInput;

        const res = await fetch('/api/complaints/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) renderTimeline(json.data);
        else showToast(json.error || 'Tracking failed', 'error');
      } catch(e) { showToast('Network error', 'error'); }

      document.getElementById('trackBtn').innerHTML = '<i class="fas fa-search"></i> Track';
    }

    function renderTimeline(data) {
      document.getElementById('trackerResults').classList.remove('hidden');

      // Countdown timer
      startCountdown(data.filed_date, data.deadline_date);

      // Milestone dates
      document.getElementById('m-filed-date').textContent = formatDate(data.filed_date);
      document.getElementById('m-day15-date').textContent = formatDate(data.day15_date);
      document.getElementById('m-day25-date').textContent = formatDate(data.day25_date);

      // Milestone statuses
      const now = new Date();
      const day15 = new Date(data.day15_date);
      const day25 = new Date(data.day25_date);

      if (now >= day15) {
        document.getElementById('m-day15-status').innerHTML = '<span class="text-red-600"><i class="fas fa-bell"></i> PASSED</span>';
      } else {
        const daysTo15 = Math.ceil((day15 - now) / (1000 * 60 * 60 * 24));
        document.getElementById('m-day15-status').innerHTML = '<span class="text-saffron-600">' + daysTo15 + ' days away</span>';
      }

      if (now >= day25) {
        document.getElementById('m-day25-status').innerHTML = '<span class="text-red-600"><i class="fas fa-exclamation-circle"></i> PASSED</span>';
      } else {
        const daysTo25 = Math.ceil((day25 - now) / (1000 * 60 * 60 * 24));
        document.getElementById('m-day25-status').innerHTML = '<span class="text-red-600">' + daysTo25 + ' days away</span>';
      }

      // Status summary
      const progressPercent = Math.min((data.days_elapsed / 30) * 100, 100);
      const progressColor = data.days_elapsed > 25 ? 'bg-red-500' : data.days_elapsed > 15 ? 'bg-saffron-500' : 'bg-ashoka-500';
      const urgencyLabel = data.days_elapsed > 30 ? '<span class="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">OVERDUE</span>' :
                           data.days_elapsed > 25 ? '<span class="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">URGENT</span>' :
                           data.days_elapsed > 15 ? '<span class="bg-saffron-100 text-saffron-700 text-xs px-2 py-0.5 rounded-full font-bold">FOLLOW UP</span>' :
                           '<span class="bg-ashoka-100 text-ashoka-700 text-xs px-2 py-0.5 rounded-full font-bold">ON TRACK</span>';

      document.getElementById('statusSummary').innerHTML = \`
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs text-gray-500 font-medium">COMPLAINT STATUS</span>
          \${urgencyLabel}
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div><span class="text-xs text-gray-500">CPGRAMS ID</span><br><span class="font-bold text-sm text-navy-700">\${data.cpgrams_id}</span></div>
          <div><span class="text-xs text-gray-500">Status</span><br><span class="font-bold text-sm text-saffron-600 capitalize">\${data.status}</span></div>
          <div><span class="text-xs text-gray-500">Days Elapsed</span><br><span class="font-bold text-sm \${data.days_elapsed > 25 ? 'text-red-600' : 'text-navy-700'}">\${data.days_elapsed} / 30</span></div>
          <div><span class="text-xs text-gray-500">Deadline</span><br><span class="font-bold text-sm text-navy-700">\${formatDate(data.deadline_date)}</span></div>
        </div>
        <div>
          <div class="w-full bg-gray-200 rounded-full h-3 relative">
            <div class="h-3 rounded-full \${progressColor} transition-all duration-500" style="width:\${progressPercent}%"></div>
            <div class="absolute top-0 left-[50%] w-px h-3 bg-saffron-500 opacity-70" title="Day 15"></div>
            <div class="absolute top-0 left-[83.3%] w-px h-3 bg-red-500 opacity-70" title="Day 25"></div>
          </div>
          <div class="flex justify-between mt-1.5">
            <span class="text-[10px] text-gray-400">Filed</span>
            <span class="text-[10px] text-saffron-500 font-medium">Day 15</span>
            <span class="text-[10px] text-red-500 font-medium">Day 25</span>
            <span class="text-[10px] text-gray-400">Day 30</span>
          </div>
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
              <div class="w-4 h-4 rounded-full \${dotColor} flex-shrink-0"></div>
              \${i < data.timeline.length - 1 ? '<div class="w-0.5 flex-1 ' + lineColor + ' mt-1"></div>' : ''}
            </div>
            <div class="\${isActive ? 'bg-saffron-50 -m-2 p-2 rounded-lg border border-saffron-200' : ''}">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">\${t.date}</span>
                \${isActive ? '<span class="text-[10px] bg-saffron-200 text-saffron-800 px-1.5 py-0.5 rounded font-semibold">CURRENT</span>' : ''}
                \${t.is_reminder ? '<span class="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold"><i class="fas fa-bell mr-0.5"></i>REMINDER</span>' : ''}
              </div>
              <h4 class="font-semibold text-sm \${isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'}">\${t.event}</h4>
              <p class="text-xs \${isCompleted || isActive ? 'text-gray-600' : 'text-gray-400'}">\${t.description}</p>
            </div>
          </div>
        \`;
      }).join('');

      // Action Recommendations
      renderActions(data);

      document.getElementById('trackerResults').scrollIntoView({ behavior: 'smooth' });
    }

    function renderActions(data) {
      let actions = [];

      if (data.days_elapsed <= 15) {
        actions = [
          { icon: 'fa-clock', color: 'ashoka', title: 'Wait for Response', desc: 'Your complaint is still within the initial review period. Departments typically begin processing within 7-15 days.' },
          { icon: 'fa-right-to-bracket', color: 'navy', title: 'Log into CPGRAMS', desc: 'Check pgportal.gov.in for any status updates or queries from the department.', link: 'https://pgportal.gov.in' },
          { icon: 'fa-folder-open', color: 'purple', title: 'Prepare Documents', desc: 'Gather all supporting documents listed in your complaint analysis. Scanned copies are best.' }
        ];
      } else if (data.days_elapsed <= 25) {
        actions = [
          { icon: 'fa-bell', color: 'saffron', title: 'Send Reminder', desc: 'Day 15 has passed. Login to CPGRAMS and submit a follow-up reminder requesting status update.', link: 'https://pgportal.gov.in' },
          { icon: 'fa-phone', color: 'navy', title: 'Call the Department', desc: 'Contact the concerned department directly. Ask for the file number and assigned officer name.' },
          { icon: 'fa-file-lines', color: 'purple', title: 'Start RTI Preparation', desc: 'Begin preparing your RTI application as a contingency if the complaint is not resolved by Day 30.' }
        ];
      } else if (data.days_elapsed <= 30) {
        actions = [
          { icon: 'fa-exclamation-triangle', color: 'red', title: 'Urgent: Final Reminder', desc: 'Only ' + (30 - data.days_elapsed) + ' days remain. Submit an urgent follow-up on CPGRAMS.', link: 'https://pgportal.gov.in' },
          { icon: 'fa-gavel', color: 'red', title: 'Draft RTI Application', desc: 'Prepare your RTI application now so you can file it immediately after Day 30.', link: '/rti' },
          { icon: 'fa-user-tie', color: 'navy', title: 'Escalate to Senior Officer', desc: 'Request escalation to the Joint Secretary or Additional Secretary level in the department.' }
        ];
      } else {
        actions = [
          { icon: 'fa-gavel', color: 'red', title: 'File RTI Immediately', desc: 'The 30-day window has expired. File an RTI application under Section 6(1) of RTI Act 2005.', link: '/rti' },
          { icon: 'fa-flag', color: 'red', title: 'Report Fake Closure', desc: 'If marked "Disposed" but not resolved, report this as a fake closure using the feedback form below.' },
          { icon: 'fa-landmark', color: 'navy', title: 'First Appellate Authority', desc: 'If RTI is not answered in 30 days, file first appeal under Section 19(1) of RTI Act.' },
          { icon: 'fa-scale-balanced', color: 'purple', title: 'Central Information Commission', desc: 'If first appeal fails, escalate to CIC under Section 19(3). Penalty: Rs. 250/day up to Rs. 25,000.' }
        ];
      }

      document.getElementById('actionContent').innerHTML = actions.map(a => \`
        <\${a.link ? 'a href="' + a.link + '"' + (a.link.startsWith('http') ? ' target="_blank"' : '') : 'div'} class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors mb-2 \${a.link ? 'cursor-pointer' : ''}">
          <div class="w-8 h-8 bg-\${a.color}-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <i class="fas \${a.icon} text-\${a.color}-600 text-xs"></i>
          </div>
          <div>
            <h4 class="font-semibold text-sm text-gray-900">\${a.title} \${a.link ? '<i class="fas fa-arrow-right text-[10px] text-gray-400 ml-1"></i>' : ''}</h4>
            <p class="text-xs text-gray-500 mt-0.5">\${a.desc}</p>
          </div>
        </\${a.link ? 'a' : 'div'}>
      \`).join('');
    }

    function startCountdown(filedDate, deadlineDate) {
      if (countdownInterval) clearInterval(countdownInterval);
      
      const deadline = new Date(deadlineDate).getTime();
      
      function update() {
        const now = new Date().getTime();
        const diff = deadline - now;
        
        if (diff <= 0) {
          document.getElementById('cd-days').textContent = '0';
          document.getElementById('cd-hours').textContent = '0';
          document.getElementById('cd-mins').textContent = '0';
          document.getElementById('cd-secs').textContent = '0';
          document.getElementById('cd-days').classList.add('text-red-600');
          return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('cd-days').textContent = days;
        document.getElementById('cd-hours').textContent = hours;
        document.getElementById('cd-mins').textContent = mins;
        document.getElementById('cd-secs').textContent = secs;
        
        if (days <= 5) {
          document.getElementById('cd-days').classList.add('text-red-600');
        } else if (days <= 10) {
          document.getElementById('cd-days').classList.add('text-saffron-600');
        }
      }
      
      update();
      countdownInterval = setInterval(update, 1000);
    }

    function formatDate(dateStr) {
      if (!dateStr) return '—';
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
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
  return layout('Complaint Tracker', content, 'tracker', {
    description: 'Track your CPGRAMS complaint progress with Day 15/25 countdown reminders, status timeline, and RTI escalation tools.',
    keywords: 'CPGRAMS tracker, complaint tracking, Day 15 reminder, Day 25 warning, RTI escalation'
  })
}
