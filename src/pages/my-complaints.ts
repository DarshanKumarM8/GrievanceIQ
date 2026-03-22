import { layout } from './layout'

export function myComplaintsPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-800 to-navy-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
            <i class="fas fa-folder-open text-saffron-400 mr-2"></i><span data-i18n="my_complaints_title">My Complaints</span>
          </h1>
          <p class="text-gray-300 text-sm" data-i18n="my_complaints_subtitle">Track all your analyzed complaints, their status, and filing progress in one place.</p>
        </div>
        <a href="/complaint" class="bg-saffron-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-saffron-600 transition-colors shadow-lg">
          <i class="fas fa-plus mr-2"></i>New Complaint
        </a>
      </div>
    </div>
  </section>

  <!-- Stats Overview -->
  <section class="py-6 bg-gray-50 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" id="complaintStats">
        <div class="bg-white rounded-xl p-3 shadow-sm text-center">
          <div class="text-xl font-black text-navy-700" id="mc-total">—</div>
          <div class="text-[10px] text-gray-500 font-medium">Total</div>
        </div>
        <div class="bg-white rounded-xl p-3 shadow-sm text-center">
          <div class="text-xl font-black text-blue-600" id="mc-draft">—</div>
          <div class="text-[10px] text-gray-500 font-medium">Drafts</div>
        </div>
        <div class="bg-white rounded-xl p-3 shadow-sm text-center">
          <div class="text-xl font-black text-saffron-600" id="mc-filed">—</div>
          <div class="text-[10px] text-gray-500 font-medium">Filed</div>
        </div>
        <div class="bg-white rounded-xl p-3 shadow-sm text-center">
          <div class="text-xl font-black text-ashoka-600" id="mc-resolved">—</div>
          <div class="text-[10px] text-gray-500 font-medium">Resolved</div>
        </div>
        <div class="bg-white rounded-xl p-3 shadow-sm text-center">
          <div class="text-xl font-black text-purple-600" id="mc-escalated">—</div>
          <div class="text-[10px] text-gray-500 font-medium">RTI Filed</div>
        </div>
        <div class="bg-white rounded-xl p-3 shadow-sm text-center">
          <div class="text-xl font-black text-red-600" id="mc-fake">—</div>
          <div class="text-[10px] text-gray-500 font-medium">Fake Closed</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Filter Bar -->
  <section class="py-4 bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 flex-wrap">
        <span class="text-xs text-gray-500 font-medium">Filter:</span>
        <button onclick="filterComplaints('all')" class="filter-btn active text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="all">All</button>
        <button onclick="filterComplaints('draft')" class="filter-btn text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="draft">Drafts</button>
        <button onclick="filterComplaints('filed')" class="filter-btn text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="filed">Filed</button>
        <button onclick="filterComplaints('pending')" class="filter-btn text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="pending">Pending</button>
        <button onclick="filterComplaints('resolved')" class="filter-btn text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="resolved">Resolved</button>
        <button onclick="filterComplaints('escalated')" class="filter-btn text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="escalated">Escalated</button>
        <button onclick="filterComplaints('fake_closed')" class="filter-btn text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="fake_closed">Fake Closed</button>
      </div>
    </div>
  </section>

  <!-- Complaints List -->
  <section class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div id="complaintsLoading" class="text-center py-12">
        <div class="spinner mx-auto mb-3" style="width:32px;height:32px;border-width:3px;"></div>
        <p class="text-sm text-gray-500">Loading your complaints...</p>
      </div>
      
      <div id="complaintsEmpty" class="hidden text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-inbox text-gray-300 text-3xl"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-700 mb-2">No complaints yet</h3>
        <p class="text-sm text-gray-500 mb-6">Start by filing your first complaint using our AI-powered builder.</p>
        <a href="/complaint" class="bg-saffron-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-saffron-600 transition-colors">
          <i class="fas fa-pen-to-square mr-2"></i>File First Complaint
        </a>
      </div>
      
      <div id="complaintsList" class="hidden space-y-4"></div>
    </div>
  </section>

  <script>
    let currentFilter = 'all';

    async function loadComplaints(filter) {
      currentFilter = filter || 'all';
      
      document.getElementById('complaintsLoading').classList.remove('hidden');
      document.getElementById('complaintsList').classList.add('hidden');
      document.getElementById('complaintsEmpty').classList.add('hidden');

      try {
        // Load stats
        const statsRes = await fetch('/api/complaints/stats');
        const statsJson = await statsRes.json();
        if (statsJson.success) {
          const s = statsJson.data;
          document.getElementById('mc-total').textContent = s.total;
          document.getElementById('mc-draft').textContent = s.total - s.filed - s.resolved - s.fake_closed;
          document.getElementById('mc-filed').textContent = s.filed;
          document.getElementById('mc-resolved').textContent = s.resolved;
          document.getElementById('mc-escalated').textContent = s.escalated;
          document.getElementById('mc-fake').textContent = s.fake_closed;
        }

        // Load complaints
        const url = '/api/complaints/all' + (filter && filter !== 'all' ? '?status=' + filter : '');
        const res = await fetch(url);
        const json = await res.json();

        document.getElementById('complaintsLoading').classList.add('hidden');
        
        if (json.success && json.data.length > 0) {
          document.getElementById('complaintsList').classList.remove('hidden');
          renderComplaints(json.data);
        } else {
          document.getElementById('complaintsEmpty').classList.remove('hidden');
        }
      } catch(e) {
        document.getElementById('complaintsLoading').classList.add('hidden');
        document.getElementById('complaintsEmpty').classList.remove('hidden');
      }
    }

    function renderComplaints(complaints) {
      const statusConfig = {
        draft: { color: 'blue', icon: 'fa-file-pen', label: 'Draft' },
        filed: { color: 'saffron', icon: 'fa-paper-plane', label: 'Filed' },
        pending: { color: 'amber', icon: 'fa-clock', label: 'Pending' },
        resolved: { color: 'ashoka', icon: 'fa-check-circle', label: 'Resolved' },
        escalated: { color: 'purple', icon: 'fa-gavel', label: 'RTI Filed' },
        fake_closed: { color: 'red', icon: 'fa-times-circle', label: 'Fake Closed' }
      };

      document.getElementById('complaintsList').innerHTML = complaints.map(c => {
        const cfg = statusConfig[c.status] || statusConfig.draft;
        const date = new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const excerpt = (c.raw_text || '').slice(0, 120) + (c.raw_text.length > 120 ? '...' : '');
        const qualityDiff = (c.quality_score_after || 0) - (c.quality_score_before || 0);
        
        return \`
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div class="p-5">
              <div class="flex items-start justify-between gap-4 mb-3">
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-\${cfg.color}-100 text-\${cfg.color}-700">
                    <i class="fas \${cfg.icon}"></i> \${cfg.label}
                  </span>
                  <span class="text-xs text-gray-400">#\${c.id}</span>
                  \${c.rti_generated ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700"><i class="fas fa-gavel"></i> RTI</span>' : ''}
                </div>
                <span class="text-xs text-gray-400 whitespace-nowrap">\${date}</span>
              </div>
              
              <p class="text-sm text-gray-700 mb-3 leading-relaxed">\${excerpt}</p>
              
              <div class="flex items-center gap-4 flex-wrap">
                <div class="flex items-center gap-1.5">
                  <i class="fas fa-building-columns text-[10px] text-navy-500"></i>
                  <span class="text-xs text-gray-600 font-medium">\${(c.department_predicted || 'Not classified').replace('Ministry of ', '').replace('Department of ', '').slice(0, 35)}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <i class="fas fa-signal text-[10px] text-saffron-500"></i>
                  <span class="text-xs text-gray-600">\${c.department_confidence || '—'}% confidence</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <i class="fas fa-star text-[10px] text-amber-500"></i>
                  <span class="text-xs text-gray-600">\${c.quality_score_before || '—'} → \${c.quality_score_after || '—'} \${qualityDiff > 0 ? '<span class="text-ashoka-600 font-bold">+' + qualityDiff + '</span>' : ''}</span>
                </div>
                \${c.cpgrams_id ? '<div class="flex items-center gap-1.5"><i class="fas fa-hashtag text-[10px] text-purple-500"></i><span class="text-xs text-purple-600 font-medium">' + c.cpgrams_id + '</span></div>' : ''}
              </div>
            </div>
            
            <div class="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
              <div class="flex items-center gap-1">
                <i class="fas fa-language text-gray-400 text-xs"></i>
                <span class="text-[10px] text-gray-500">\${(c.language_detected || 'en').toUpperCase()}</span>
              </div>
              <div class="flex items-center gap-2">
                \${c.cpgrams_id ? '<a href="/tracker?id=' + encodeURIComponent(c.cpgrams_id) + '" class="text-xs text-saffron-600 hover:text-saffron-700 font-medium"><i class="fas fa-clock mr-1"></i>Track</a>' : ''}
                \${!c.rti_generated && c.status !== 'resolved' ? '<a href="/rti" class="text-xs text-red-600 hover:text-red-700 font-medium"><i class="fas fa-gavel mr-1"></i>RTI</a>' : ''}
                <a href="/complaint" class="text-xs text-navy-600 hover:text-navy-700 font-medium"><i class="fas fa-pen mr-1"></i>New</a>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function filterComplaints(filter) {
      // Update active filter button
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-saffron-50', 'border-saffron-400', 'text-saffron-700');
        b.classList.add('border-gray-200');
      });
      const activeBtn = document.querySelector('[data-filter="' + filter + '"]');
      if (activeBtn) {
        activeBtn.classList.add('bg-saffron-50', 'border-saffron-400', 'text-saffron-700');
        activeBtn.classList.remove('border-gray-200');
      }
      
      loadComplaints(filter);
    }

    // Init
    filterComplaints('all');
  </script>

  <style>
    .filter-btn.active {
      background-color: rgb(255 248 240);
      border-color: rgb(255 153 51);
      color: rgb(194 94 0);
    }
  </style>
  `
  return layout('My Complaints', content, 'my-complaints')
}
