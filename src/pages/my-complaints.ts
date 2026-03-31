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
          <div class="text-xl font-black text-navy-700" id="mc-total">&mdash;</div>
          <div class="text-[10px] text-gray-500 font-medium">Total</div>
        </div>
        <div class="bg-white rounded-xl p-3 shadow-sm text-center">
          <div class="text-xl font-black text-blue-600" id="mc-draft">&mdash;</div>
          <div class="text-[10px] text-gray-500 font-medium">Drafts</div>
        </div>
        <div class="bg-white rounded-xl p-3 shadow-sm text-center">
          <div class="text-xl font-black text-saffron-600" id="mc-filed">&mdash;</div>
          <div class="text-[10px] text-gray-500 font-medium">Filed</div>
        </div>
        <div class="bg-white rounded-xl p-3 shadow-sm text-center">
          <div class="text-xl font-black text-ashoka-600" id="mc-resolved">&mdash;</div>
          <div class="text-[10px] text-gray-500 font-medium">Resolved</div>
        </div>
        <div class="bg-white rounded-xl p-3 shadow-sm text-center">
          <div class="text-xl font-black text-purple-600" id="mc-escalated">&mdash;</div>
          <div class="text-[10px] text-gray-500 font-medium">RTI Filed</div>
        </div>
        <div class="bg-white rounded-xl p-3 shadow-sm text-center">
          <div class="text-xl font-black text-red-600" id="mc-fake">&mdash;</div>
          <div class="text-[10px] text-gray-500 font-medium">Fake Closed</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Advanced Filter Bar -->
  <section class="py-4 bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Status Filters -->
      <div class="flex items-center gap-3 flex-wrap mb-3">
        <span class="text-xs text-gray-500 font-medium">Status:</span>
        <button onclick="setStatusFilter('all')" class="filter-btn active text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="all">All</button>
        <button onclick="setStatusFilter('draft')" class="filter-btn text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="draft">Drafts</button>
        <button onclick="setStatusFilter('filed')" class="filter-btn text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="filed">Filed</button>
        <button onclick="setStatusFilter('pending')" class="filter-btn text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="pending">Pending</button>
        <button onclick="setStatusFilter('resolved')" class="filter-btn text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="resolved">Resolved</button>
        <button onclick="setStatusFilter('escalated')" class="filter-btn text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="escalated">Escalated</button>
        <button onclick="setStatusFilter('fake_closed')" class="filter-btn text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300 transition-colors font-medium" data-filter="fake_closed">Fake Closed</button>
      </div>

      <!-- Advanced Filters Row -->
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Search -->
        <div class="relative flex-1 min-w-[200px] max-w-[400px]">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input type="text" id="searchInput" placeholder="Search complaints, departments, CPGRAMS ID..." 
            class="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-200" 
            oninput="debounceSearch()">
        </div>

        <!-- Department Filter -->
        <select id="deptFilter" onchange="applyFilters()" class="text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-saffron-400">
          <option value="">All Departments</option>
        </select>

        <!-- Date Range -->
        <div class="flex items-center gap-1.5">
          <input type="date" id="dateFrom" class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-saffron-400" onchange="applyFilters()">
          <span class="text-xs text-gray-400">to</span>
          <input type="date" id="dateTo" class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-saffron-400" onchange="applyFilters()">
        </div>

        <!-- Quality Score -->
        <div class="flex items-center gap-1.5">
          <span class="text-xs text-gray-500">Score:</span>
          <select id="scoreFilter" onchange="applyFilters()" class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-saffron-400">
            <option value="">Any</option>
            <option value="8-10">8-10 (Strong)</option>
            <option value="6-7">6-7 (Good)</option>
            <option value="4-5">4-5 (Fair)</option>
            <option value="1-3">1-3 (Weak)</option>
          </select>
        </div>

        <!-- Sort -->
        <select id="sortFilter" onchange="applyFilters()" class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-saffron-400">
          <option value="created_at">Newest First</option>
          <option value="quality_score">By Quality Score</option>
          <option value="confidence">By AI Confidence</option>
          <option value="department">By Department</option>
        </select>

        <!-- Clear -->
        <button onclick="clearFilters()" class="text-xs text-gray-500 hover:text-saffron-600 font-medium px-2 py-1.5">
          <i class="fas fa-times mr-1"></i>Clear
        </button>
      </div>
    </div>
  </section>

  <!-- Complaints List -->
  <section class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Results count -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs text-gray-500" id="resultsCount"></span>
        <span class="text-xs text-gray-400" id="pageInfo"></span>
      </div>

      <div id="complaintsLoading" class="text-center py-12">
        <div class="spinner mx-auto mb-3" style="width:32px;height:32px;border-width:3px;"></div>
        <p class="text-sm text-gray-500">Loading your complaints...</p>
      </div>
      
      <div id="complaintsEmpty" class="hidden text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-inbox text-gray-300 text-3xl"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-700 mb-2">No complaints found</h3>
        <p class="text-sm text-gray-500 mb-6">Try adjusting your filters or file a new complaint.</p>
        <a href="/complaint" class="bg-saffron-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-saffron-600 transition-colors">
          <i class="fas fa-pen-to-square mr-2"></i>File Complaint
        </a>
      </div>
      
      <div id="complaintsList" class="hidden space-y-4"></div>

      <!-- Pagination -->
      <div id="paginationBar" class="hidden flex items-center justify-center gap-2 mt-8">
        <button onclick="goPage(-1)" id="prevBtn" class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-saffron-50 transition-colors disabled:opacity-40" disabled>
          <i class="fas fa-chevron-left mr-1"></i>Previous
        </button>
        <span class="text-xs text-gray-500" id="pageNum">Page 1</span>
        <button onclick="goPage(1)" id="nextBtn" class="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-saffron-50 transition-colors disabled:opacity-40" disabled>
          Next<i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  </section>

  <script>
    let currentPage = 1;
    let currentStatus = 'all';
    let searchTimeout = null;

    function debounceSearch() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => applyFilters(), 400);
    }

    function setStatusFilter(status) {
      currentStatus = status;
      currentPage = 1;
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-saffron-50','border-saffron-400','text-saffron-700');
        b.classList.add('border-gray-200');
      });
      const btn = document.querySelector('[data-filter="'+status+'"]');
      if (btn) { btn.classList.add('bg-saffron-50','border-saffron-400','text-saffron-700'); btn.classList.remove('border-gray-200'); }
      applyFilters();
    }

    function clearFilters() {
      document.getElementById('searchInput').value = '';
      document.getElementById('deptFilter').value = '';
      document.getElementById('dateFrom').value = '';
      document.getElementById('dateTo').value = '';
      document.getElementById('scoreFilter').value = '';
      document.getElementById('sortFilter').value = 'created_at';
      currentStatus = 'all';
      currentPage = 1;
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-saffron-50','border-saffron-400','text-saffron-700');
        b.classList.add('border-gray-200');
      });
      document.querySelector('[data-filter="all"]').classList.add('bg-saffron-50','border-saffron-400','text-saffron-700');
      document.querySelector('[data-filter="all"]').classList.remove('border-gray-200');
      applyFilters();
    }

    function goPage(delta) {
      currentPage += delta;
      if (currentPage < 1) currentPage = 1;
      applyFilters();
    }

    async function applyFilters() {
      document.getElementById('complaintsLoading').classList.remove('hidden');
      document.getElementById('complaintsList').classList.add('hidden');
      document.getElementById('complaintsEmpty').classList.add('hidden');
      document.getElementById('paginationBar').classList.add('hidden');

      const params = new URLSearchParams();
      const search = document.getElementById('searchInput').value.trim();
      const dept = document.getElementById('deptFilter').value;
      const dateFrom = document.getElementById('dateFrom').value;
      const dateTo = document.getElementById('dateTo').value;
      const score = document.getElementById('scoreFilter').value;
      const sort = document.getElementById('sortFilter').value;

      if (search) params.set('q', search);
      if (currentStatus && currentStatus !== 'all') params.set('status', currentStatus);
      if (dept) params.set('department', dept);
      if (dateFrom) params.set('date_from', dateFrom);
      if (dateTo) params.set('date_to', dateTo);
      if (score) {
        const [min, max] = score.split('-');
        params.set('score_min', min);
        params.set('score_max', max);
      }
      params.set('sort', sort);
      params.set('order', sort === 'created_at' ? 'desc' : 'desc');
      params.set('page', currentPage);
      params.set('limit', '20');

      // Add auth token
      const token = localStorage.getItem('giq_token');
      const headers = token ? { 'Authorization': 'Bearer ' + token } : {};

      try {
        // Load stats
        const statsRes = await fetch('/api/complaints/stats', { headers });
        const statsJson = await statsRes.json();
        if (statsJson.success) {
          const s = statsJson.data;
          document.getElementById('mc-total').textContent = s.total;
          document.getElementById('mc-draft').textContent = Math.max(0, s.total - s.filed - s.resolved - s.fake_closed);
          document.getElementById('mc-filed').textContent = s.filed;
          document.getElementById('mc-resolved').textContent = s.resolved;
          document.getElementById('mc-escalated').textContent = s.escalated;
          document.getElementById('mc-fake').textContent = s.fake_closed;
        }

        // Load with search API
        const res = await fetch('/api/complaints/search?' + params.toString(), { headers });
        const json = await res.json();

        document.getElementById('complaintsLoading').classList.add('hidden');

        if (json.success && json.data.length > 0) {
          document.getElementById('complaintsList').classList.remove('hidden');
          renderComplaints(json.data);

          // Pagination
          const p = json.pagination;
          document.getElementById('resultsCount').textContent = p.total + ' complaint' + (p.total!==1?'s':'') + ' found';
          document.getElementById('pageInfo').textContent = 'Page ' + p.page + ' of ' + p.total_pages;
          document.getElementById('pageNum').textContent = 'Page ' + p.page + ' of ' + p.total_pages;
          
          if (p.total_pages > 1) {
            document.getElementById('paginationBar').classList.remove('hidden');
            document.getElementById('prevBtn').disabled = !p.has_prev;
            document.getElementById('nextBtn').disabled = !p.has_next;
          }

          // Populate department filter
          if (json.filters && json.filters.departments) {
            const deptSelect = document.getElementById('deptFilter');
            const currentVal = deptSelect.value;
            deptSelect.innerHTML = '<option value="">All Departments</option>';
            json.filters.departments.forEach(d => {
              if (d.department_predicted) {
                const opt = document.createElement('option');
                opt.value = d.department_predicted;
                opt.textContent = d.department_predicted.replace('Ministry of ','').replace('Department of ','').slice(0,35) + ' (' + d.count + ')';
                deptSelect.appendChild(opt);
              }
            });
            deptSelect.value = currentVal;
          }
        } else {
          document.getElementById('complaintsEmpty').classList.remove('hidden');
          document.getElementById('resultsCount').textContent = '0 complaints found';
          document.getElementById('pageInfo').textContent = '';
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
        const excerpt = (c.raw_text || '').slice(0, 120) + (c.raw_text && c.raw_text.length > 120 ? '...' : '');
        const qualityDiff = (c.quality_score_after || 0) - (c.quality_score_before || 0);
        
        return '<a href="/complaint-detail?id=' + c.id + '" class="block bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-saffron-200 transition-all overflow-hidden">' +
          '<div class="p-5">' +
            '<div class="flex items-start justify-between gap-4 mb-3">' +
              '<div class="flex items-center gap-2">' +
                '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-' + cfg.color + '-100 text-' + cfg.color + '-700"><i class="fas ' + cfg.icon + '"></i> ' + cfg.label + '</span>' +
                '<span class="text-xs text-gray-400">#' + c.id + '</span>' +
                (c.rti_generated ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700"><i class="fas fa-gavel"></i> RTI</span>' : '') +
              '</div>' +
              '<span class="text-xs text-gray-400 whitespace-nowrap">' + date + '</span>' +
            '</div>' +
            '<p class="text-sm text-gray-700 mb-3 leading-relaxed">' + excerpt + '</p>' +
            '<div class="flex items-center gap-4 flex-wrap">' +
              '<div class="flex items-center gap-1.5"><i class="fas fa-building-columns text-[10px] text-navy-500"></i><span class="text-xs text-gray-600 font-medium">' + ((c.department_predicted || 'Not classified').replace('Ministry of ','').replace('Department of ','').slice(0,35)) + '</span></div>' +
              '<div class="flex items-center gap-1.5"><i class="fas fa-signal text-[10px] text-saffron-500"></i><span class="text-xs text-gray-600">' + (c.department_confidence || '—') + '% confidence</span></div>' +
              '<div class="flex items-center gap-1.5"><i class="fas fa-star text-[10px] text-amber-500"></i><span class="text-xs text-gray-600">' + (c.quality_score_before || '—') + ' &rarr; ' + (c.quality_score_after || '—') + (qualityDiff > 0 ? ' <span class="text-ashoka-600 font-bold">+' + qualityDiff + '</span>' : '') + '</span></div>' +
              (c.cpgrams_id ? '<div class="flex items-center gap-1.5"><i class="fas fa-hashtag text-[10px] text-purple-500"></i><span class="text-xs text-purple-600 font-medium">' + c.cpgrams_id + '</span></div>' : '') +
            '</div>' +
          '</div>' +
          '<div class="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">' +
            '<div class="flex items-center gap-1"><i class="fas fa-language text-gray-400 text-xs"></i><span class="text-[10px] text-gray-500">' + ((c.language_detected || 'en').toUpperCase()) + '</span></div>' +
            '<div class="flex items-center gap-3">' +
              '<span class="text-xs text-saffron-600 font-medium"><i class="fas fa-eye mr-1"></i>View Details</span>' +
            '</div>' +
          '</div>' +
        '</a>';
      }).join('');
    }

    // Init
    applyFilters();
  </script>

  <style>
    .filter-btn.active { background-color: rgb(255 248 240); border-color: rgb(255 153 51); color: rgb(194 94 0); }
  </style>
  `
  return layout('My Complaints', content, 'my-complaints')
}
