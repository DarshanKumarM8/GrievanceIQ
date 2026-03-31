import { layout } from './layout'

export function complaintDetailPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-800 to-navy-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 mb-4">
        <a href="/my-complaints" class="text-gray-400 hover:text-white transition-colors"><i class="fas fa-arrow-left mr-1"></i> Back</a>
        <span class="text-gray-500">|</span>
        <span class="text-gray-300 text-sm" id="cd-breadcrumb">Loading...</span>
      </div>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-1">
            <i class="fas fa-file-alt text-saffron-400 mr-2"></i>Complaint <span id="cd-id">#—</span>
          </h1>
          <p class="text-gray-300 text-sm" id="cd-date">Filed —</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1.5 rounded-full text-xs font-bold" id="cd-status-badge">—</span>
          <button onclick="exportComplaintPDF()" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
            <i class="fas fa-file-pdf mr-1"></i>Export PDF
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Loading -->
  <div id="cd-loading" class="py-20 text-center">
    <div class="spinner mx-auto mb-3" style="width:32px;height:32px;border-width:3px;"></div>
    <p class="text-sm text-gray-500">Loading complaint details...</p>
  </div>

  <!-- Content -->
  <div id="cd-content" class="hidden">
    <!-- AI Analysis Overview -->
    <section class="py-6 bg-gray-50 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div class="bg-white rounded-xl p-3 shadow-sm text-center">
            <div class="text-lg font-black text-navy-700" id="cd-dept">—</div>
            <div class="text-[10px] text-gray-500">Department</div>
          </div>
          <div class="bg-white rounded-xl p-3 shadow-sm text-center">
            <div class="text-lg font-black text-saffron-600" id="cd-confidence">—%</div>
            <div class="text-[10px] text-gray-500">AI Confidence</div>
          </div>
          <div class="bg-white rounded-xl p-3 shadow-sm text-center">
            <div class="text-lg font-black text-red-600" id="cd-score-before">—</div>
            <div class="text-[10px] text-gray-500">Score Before</div>
          </div>
          <div class="bg-white rounded-xl p-3 shadow-sm text-center">
            <div class="text-lg font-black text-ashoka-600" id="cd-score-after">—</div>
            <div class="text-[10px] text-gray-500">Score After</div>
          </div>
          <div class="bg-white rounded-xl p-3 shadow-sm text-center">
            <div class="text-lg font-black text-purple-600" id="cd-lang">—</div>
            <div class="text-[10px] text-gray-500">Language</div>
          </div>
          <div class="bg-white rounded-xl p-3 shadow-sm text-center">
            <div class="text-lg font-black text-blue-600" id="cd-rti">—</div>
            <div class="text-[10px] text-gray-500">RTI Status</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Panels -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        <!-- Department Routing -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-navy-600 to-navy-700 flex items-center gap-2">
            <i class="fas fa-building-columns text-white"></i>
            <h2 class="font-bold text-white">AI Department Routing</h2>
          </div>
          <div class="p-6" id="cd-departments"></div>
        </div>

        <!-- Side-by-Side: Original vs Improved -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-ashoka-600 to-ashoka-700 flex items-center gap-2">
            <i class="fas fa-wand-magic-sparkles text-white"></i>
            <h2 class="font-bold text-white">Original vs AI-Improved</h2>
            <button onclick="copyCdImproved()" class="ml-auto text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-colors">
              <i class="fas fa-copy mr-1"></i>Copy Improved
            </button>
          </div>
          <div class="grid md:grid-cols-2 divide-x divide-gray-200">
            <div class="p-5">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-3 h-3 rounded-full bg-red-400"></span>
                <span class="text-sm font-semibold text-gray-500">YOUR ORIGINAL</span>
                <span class="ml-auto text-xs text-gray-400" id="cd-orig-score"></span>
              </div>
              <div id="cd-original-text" class="text-sm text-gray-700 bg-red-50/50 rounded-lg p-4 min-h-[180px] whitespace-pre-wrap leading-relaxed"></div>
            </div>
            <div class="p-5">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-3 h-3 rounded-full bg-ashoka-500"></span>
                <span class="text-sm font-semibold text-gray-500">AI IMPROVED</span>
                <span class="ml-auto text-xs text-ashoka-600" id="cd-imp-score"></span>
              </div>
              <div id="cd-improved-text" class="text-sm text-gray-700 bg-ashoka-50/50 rounded-lg p-4 min-h-[180px] whitespace-pre-wrap leading-relaxed"></div>
            </div>
          </div>
        </div>

        <!-- Quality Score + Missing Elements -->
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center gap-2">
              <i class="fas fa-star text-white"></i>
              <h2 class="font-bold text-white">Quality Analysis</h2>
            </div>
            <div class="p-6" id="cd-quality"></div>
          </div>
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 flex items-center gap-2">
              <i class="fas fa-triangle-exclamation text-white"></i>
              <h2 class="font-bold text-white">Missing Elements</h2>
            </div>
            <div class="p-6" id="cd-missing"></div>
          </div>
        </div>

        <!-- Document Checklist -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center gap-2">
            <i class="fas fa-clipboard-check text-white"></i>
            <h2 class="font-bold text-white">Document Checklist</h2>
          </div>
          <div class="p-6" id="cd-checklist"></div>
        </div>

        <!-- Translation (hidden if not needed) -->
        <div class="hidden bg-blue-50 border border-blue-200 rounded-2xl p-5" id="cd-translation-section">
          <div class="flex items-center gap-2 mb-2">
            <i class="fas fa-language text-blue-600"></i>
            <h3 class="font-semibold text-blue-800 text-sm">Translation</h3>
            <span class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full" id="cd-trans-lang"></span>
          </div>
          <p class="text-sm text-blue-700" id="cd-trans-text"></p>
        </div>

        <!-- Timeline (if CPGRAMS ID exists) -->
        <div class="hidden bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" id="cd-timeline-section">
          <div class="px-6 py-4 bg-gradient-to-r from-saffron-500 to-saffron-600 flex items-center gap-2">
            <i class="fas fa-timeline text-white"></i>
            <h2 class="font-bold text-white">Complaint Journey</h2>
            <span class="ml-auto text-xs text-saffron-200" id="cd-cpgrams-id"></span>
          </div>
          <div class="p-6" id="cd-timeline"></div>
        </div>

        <!-- Feedback History -->
        <div class="hidden bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" id="cd-feedback-section">
          <div class="px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 flex items-center gap-2">
            <i class="fas fa-comment-dots text-white"></i>
            <h2 class="font-bold text-white">Citizen Feedback History</h2>
          </div>
          <div class="p-6" id="cd-feedback"></div>
        </div>

        <!-- Actions -->
        <div class="bg-gradient-to-r from-saffron-50 to-ashoka-50 rounded-2xl border border-saffron-200 p-6">
          <h3 class="font-bold text-gray-900 mb-4"><i class="fas fa-arrow-right-from-bracket text-saffron-600 mr-2"></i>Quick Actions</h3>
          <div class="flex flex-wrap gap-3" id="cd-actions"></div>
        </div>
      </div>
    </section>
  </div>

  <!-- Error -->
  <div id="cd-error" class="hidden py-20 text-center">
    <div class="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <i class="fas fa-exclamation-triangle text-red-400 text-3xl"></i>
    </div>
    <h3 class="text-lg font-bold text-gray-700 mb-2">Complaint Not Found</h3>
    <p class="text-sm text-gray-500 mb-6">This complaint may not exist or you don't have access to it.</p>
    <a href="/my-complaints" class="bg-saffron-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-saffron-600 transition-colors">
      <i class="fas fa-arrow-left mr-2"></i>Back to My Complaints
    </a>
  </div>

  <script>
    let complaintData = null;

    async function loadComplaintDetail() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (!id) { showError(); return; }

      try {
        const token = localStorage.getItem('giq_token');
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
        const res = await fetch('/api/complaints/' + id + '/detail', { headers });
        const json = await res.json();

        if (!json.success) { showError(); return; }

        complaintData = json.data;
        renderDetail(json.data);
      } catch(e) {
        showError();
      }
    }

    function showError() {
      document.getElementById('cd-loading').classList.add('hidden');
      document.getElementById('cd-error').classList.remove('hidden');
    }

    function renderDetail(d) {
      document.getElementById('cd-loading').classList.add('hidden');
      document.getElementById('cd-content').classList.remove('hidden');

      // Header
      document.getElementById('cd-id').textContent = '#' + d.id;
      document.getElementById('cd-breadcrumb').textContent = 'Complaint #' + d.id + ' — ' + (d.department_predicted || 'Unclassified');
      document.getElementById('cd-date').textContent = 'Filed: ' + new Date(d.created_at).toLocaleDateString('en-IN', {day:'2-digit', month:'long', year:'numeric'});

      const statusConfig = {
        draft: { bg: 'bg-blue-100 text-blue-700', label: 'Draft' },
        filed: { bg: 'bg-saffron-100 text-saffron-700', label: 'Filed' },
        pending: { bg: 'bg-amber-100 text-amber-700', label: 'Pending' },
        resolved: { bg: 'bg-ashoka-100 text-ashoka-700', label: 'Resolved' },
        fake_closed: { bg: 'bg-red-100 text-red-700', label: 'Fake Closed' },
        escalated: { bg: 'bg-purple-100 text-purple-700', label: 'Escalated' }
      };
      const sc = statusConfig[d.status] || statusConfig.draft;
      const badge = document.getElementById('cd-status-badge');
      badge.textContent = sc.label;
      badge.className = 'px-3 py-1.5 rounded-full text-xs font-bold ' + sc.bg;

      // Stat cards
      document.getElementById('cd-dept').textContent = (d.department_predicted || '—').replace('Ministry of ','').replace('Department of ','').slice(0,20);
      document.getElementById('cd-confidence').textContent = (d.department_confidence || '—') + '%';
      document.getElementById('cd-score-before').textContent = (d.quality_score_before || '—') + '/10';
      document.getElementById('cd-score-after').textContent = (d.quality_score_after || '—') + '/10';
      document.getElementById('cd-lang').textContent = (d.language_detected || 'en').toUpperCase();
      document.getElementById('cd-rti').textContent = d.rti_generated ? 'Generated' : 'N/A';

      // Departments
      const depts = [
        {name: d.department_predicted, confidence: d.department_confidence, reason: 'Primary match'},
        {name: d.department_2nd, confidence: d.department_2nd_confidence, reason: 'Second match'},
        {name: d.department_3rd, confidence: d.department_3rd_confidence, reason: 'Third match'}
      ].filter(x => x.name);
      
      document.getElementById('cd-departments').innerHTML = depts.map((dept, i) => {
        const barColor = i === 0 ? 'bg-ashoka-500' : (i === 1 ? 'bg-saffron-500' : 'bg-gray-400');
        return '<div class="flex items-center gap-4 p-3 rounded-xl ' + (i === 0 ? 'bg-ashoka-50 border border-ashoka-200' : 'hover:bg-gray-50') + ' mb-2">' +
          '<div class="w-10 h-10 ' + (i === 0 ? 'bg-ashoka-500' : i === 1 ? 'bg-saffron-500' : 'bg-gray-300') + ' rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">' + (i+1) + '</div>' +
          '<div class="flex-1 min-w-0"><h4 class="font-semibold text-sm text-gray-900">' + dept.name + '</h4>' +
          (i === 0 ? '<span class="bg-ashoka-100 text-ashoka-700 text-xs px-2 py-0.5 rounded-full font-semibold">BEST MATCH</span>' : '') + '</div>' +
          '<div class="text-right"><div class="text-lg font-bold ' + (i === 0 ? 'text-ashoka-600' : 'text-gray-500') + '">' + dept.confidence + '%</div>' +
          '<div class="w-20 h-1.5 bg-gray-200 rounded-full mt-1"><div class="' + barColor + ' h-full rounded-full" style="width:' + dept.confidence + '%"></div></div></div></div>';
      }).join('') + (d.department_reasoning ? '<p class="text-xs text-gray-400 mt-3 italic"><i class="fas fa-info-circle mr-1"></i>' + d.department_reasoning + '</p>' : '');

      // Original vs Improved
      document.getElementById('cd-original-text').textContent = d.raw_text || '';
      document.getElementById('cd-improved-text').textContent = d.improved_draft || '';
      document.getElementById('cd-orig-score').textContent = 'Score: ' + (d.quality_score_before || '—') + '/10';
      document.getElementById('cd-imp-score').textContent = 'Score: ' + (d.quality_score_after || '—') + '/10';

      // Quality
      const gaugeColor = (s) => s<=3?'#ef4444':s<=5?'#f59e0b':s<=7?'#3b82f6':'#22c55e';
      const scoreLabel = (s) => s<=3?'Weak':s<=5?'Fair':s<=7?'Good':s<=9?'Strong':'Perfect';
      const sb = d.quality_score_before || 0;
      const sa = d.quality_score_after || 0;
      document.getElementById('cd-quality').innerHTML = 
        '<div class="flex items-center justify-center gap-8">' +
          '<div class="text-center"><div class="quality-gauge mx-auto mb-2" style="--gauge-color:'+gaugeColor(sb)+';--gauge-percent:'+sb*10+'%"><div class="quality-gauge-inner"><span class="text-2xl font-black" style="color:'+gaugeColor(sb)+'">'+sb+'</span><span class="text-xs text-gray-400">/10</span></div></div><span class="text-xs font-semibold text-gray-500">BEFORE</span><br><span class="text-[10px] text-gray-400">'+scoreLabel(sb)+'</span></div>' +
          '<div class="text-3xl text-gray-300"><i class="fas fa-arrow-right"></i></div>' +
          '<div class="text-center"><div class="quality-gauge mx-auto mb-2" style="--gauge-color:'+gaugeColor(sa)+';--gauge-percent:'+sa*10+'%"><div class="quality-gauge-inner"><span class="text-2xl font-black" style="color:'+gaugeColor(sa)+'">'+sa+'</span><span class="text-xs text-gray-400">/10</span></div></div><span class="text-xs font-semibold text-ashoka-600">AFTER AI</span><br><span class="text-[10px] text-ashoka-500">'+scoreLabel(sa)+'</span></div>' +
        '</div><p class="text-center text-xs text-gray-500 mt-3">Improvement: <strong class="text-ashoka-600">+' + (sa-sb) + ' points</strong></p>';

      // Missing Elements
      const missing = d.missing_elements || [];
      document.getElementById('cd-missing').innerHTML = missing.length > 0
        ? missing.map(m => '<div class="flex items-start gap-2 mb-2"><i class="fas fa-xmark text-red-500 mt-0.5"></i><span class="text-sm text-gray-700">'+m+'</span></div>').join('')
        : '<p class="text-sm text-ashoka-600 flex items-center gap-2"><i class="fas fa-check-circle"></i> All essential elements present!</p>';

      // Document Checklist
      const docs = d.documents_checklist || [];
      document.getElementById('cd-checklist').innerHTML = docs.map(doc =>
        '<label class="flex items-center gap-3 mb-2 cursor-pointer group"><input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"><span class="text-sm text-gray-700 group-hover:text-purple-700">' + doc + '</span></label>'
      ).join('') || '<p class="text-sm text-gray-500">No documents listed.</p>';

      // Translation
      if (d.translated_text && d.language_detected !== 'en') {
        const langNames = {hi:'Hindi', ta:'Tamil', te:'Telugu', bn:'Bengali', mr:'Marathi', gu:'Gujarati', kn:'Kannada'};
        document.getElementById('cd-translation-section').classList.remove('hidden');
        document.getElementById('cd-trans-lang').textContent = 'Detected: ' + (langNames[d.language_detected] || d.language_detected);
        document.getElementById('cd-trans-text').textContent = d.translated_text;
      }

      // Timeline
      if (d.timeline && d.cpgrams_id) {
        document.getElementById('cd-timeline-section').classList.remove('hidden');
        document.getElementById('cd-cpgrams-id').textContent = d.cpgrams_id;
        
        const tl = d.timeline.timeline || [];
        document.getElementById('cd-timeline').innerHTML = tl.map((t, i) => {
          const isCompleted = t.status === 'completed';
          const isActive = t.status === 'active';
          const dotColor = isCompleted ? 'bg-ashoka-500' : isActive ? 'bg-saffron-500 pulse-dot' : 'bg-gray-300';
          const lineColor = isCompleted ? 'bg-ashoka-300' : 'bg-gray-200';
          return '<div class="flex gap-4 ' + (i < tl.length-1 ? 'pb-6' : '') + '">' +
            '<div class="flex flex-col items-center"><div class="w-4 h-4 rounded-full '+dotColor+' flex-shrink-0"></div>' +
            (i < tl.length-1 ? '<div class="w-0.5 flex-1 '+lineColor+' mt-1"></div>' : '') + '</div>' +
            '<div class="' + (isActive ? 'bg-saffron-50 -m-2 p-2 rounded-lg border border-saffron-200' : '') + '">' +
            '<span class="text-xs text-gray-400">'+t.date+'</span>' +
            (isActive ? ' <span class="text-[10px] bg-saffron-200 text-saffron-800 px-1.5 py-0.5 rounded font-semibold">CURRENT</span>' : '') +
            '<h4 class="font-semibold text-sm '+(isCompleted||isActive?'text-gray-900':'text-gray-400')+'">'+t.event+'</h4>' +
            '<p class="text-xs '+(isCompleted||isActive?'text-gray-600':'text-gray-400')+'">'+t.description+'</p></div></div>';
        }).join('');
      }

      // Feedback
      if (d.feedback && d.feedback.length > 0) {
        document.getElementById('cd-feedback-section').classList.remove('hidden');
        document.getElementById('cd-feedback').innerHTML = d.feedback.map(f => 
          '<div class="p-3 rounded-xl border ' + (f.is_fake_closure ? 'border-red-200 bg-red-50' : 'border-gray-200') + ' mb-2">' +
          '<div class="flex items-center gap-2 mb-1">' +
          '<span class="text-xs font-bold ' + (f.is_fake_closure ? 'text-red-700' : 'text-gray-700') + '">' + (f.citizen_actual_resolution || 'unknown').replace('_', ' ') + '</span>' +
          (f.is_fake_closure ? ' <span class="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-bold"><i class="fas fa-flag mr-0.5"></i>FAKE CLOSURE</span>' : '') +
          '<span class="ml-auto text-[10px] text-gray-400">' + new Date(f.feedback_given_at).toLocaleDateString('en-IN') + '</span></div>' +
          (f.feedback_text ? '<p class="text-xs text-gray-600">' + f.feedback_text + '</p>' : '') +
          '<div class="mt-1 flex items-center gap-1">' + Array.from({length:5}, (_, i) => '<i class="fas fa-star text-xs ' + (i < f.satisfaction_score ? 'text-amber-400' : 'text-gray-200') + '"></i>').join('') + '</div></div>'
        ).join('');
      }

      // Actions
      let actions = [];
      if (!d.cpgrams_id) actions.push('<a href="/tracker" class="bg-saffron-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-saffron-600"><i class="fas fa-search mr-1"></i>Track Complaint</a>');
      if (d.cpgrams_id) actions.push('<a href="/tracker?id=' + d.cpgrams_id + '" class="bg-saffron-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-saffron-600"><i class="fas fa-clock mr-1"></i>Track ' + d.cpgrams_id + '</a>');
      if (!d.rti_generated) actions.push('<a href="/rti" class="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-700"><i class="fas fa-gavel mr-1"></i>Generate RTI</a>');
      actions.push('<a href="/complaint" class="bg-navy-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-navy-700"><i class="fas fa-pen mr-1"></i>New Complaint</a>');
      actions.push('<button onclick="copyCdImproved()" class="bg-ashoka-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-ashoka-600"><i class="fas fa-copy mr-1"></i>Copy Improved Draft</button>');
      document.getElementById('cd-actions').innerHTML = actions.join('');
    }

    function copyCdImproved() {
      if (!complaintData) return;
      navigator.clipboard.writeText(complaintData.improved_draft || '').then(() => showToast('Improved complaint copied!', 'success'));
    }

    function exportComplaintPDF() {
      if (!complaintData) return;
      const d = complaintData;
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.setTextColor(26, 54, 93);
      doc.text('GrievanceIQ — Complaint Report', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Complaint #' + d.id + ' | Status: ' + (d.status || 'draft') + ' | ' + new Date(d.created_at).toLocaleDateString('en-IN'), 14, 28);

      doc.setDrawColor(255, 153, 51);
      doc.line(14, 32, 196, 32);

      let y = 40;
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Department: ' + (d.department_predicted || 'N/A'), 14, y); y += 7;
      doc.text('Confidence: ' + (d.department_confidence || '—') + '%', 14, y); y += 7;
      doc.text('Quality: ' + (d.quality_score_before || '—') + '/10 -> ' + (d.quality_score_after || '—') + '/10', 14, y); y += 10;

      doc.setFontSize(11);
      doc.setTextColor(26, 54, 93);
      doc.text('Original Complaint:', 14, y); y += 6;
      doc.setFontSize(9);
      doc.setTextColor(60);
      const origLines = doc.splitTextToSize(d.raw_text || '', 170);
      doc.text(origLines, 14, y); y += origLines.length * 4 + 8;

      if (y > 250) { doc.addPage(); y = 20; }

      doc.setFontSize(11);
      doc.setTextColor(19, 136, 8);
      doc.text('AI-Improved Draft:', 14, y); y += 6;
      doc.setFontSize(9);
      doc.setTextColor(60);
      const impLines = doc.splitTextToSize(d.improved_draft || '', 170);
      doc.text(impLines, 14, y); y += impLines.length * 4 + 8;

      if (y > 240) { doc.addPage(); y = 20; }

      const checklist = d.documents_checklist || [];
      if (checklist.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(100, 50, 150);
        doc.text('Document Checklist:', 14, y); y += 6;
        doc.setFontSize(9);
        doc.setTextColor(60);
        checklist.forEach(item => {
          doc.text('[ ] ' + item, 18, y); y += 5;
          if (y > 280) { doc.addPage(); y = 20; }
        });
      }

      doc.save('GrievanceIQ_Complaint_' + d.id + '.pdf');
      showToast('PDF exported!', 'success');
    }

    loadComplaintDetail();
  </script>
  `
  return layout('Complaint Detail', content, 'my-complaints')
}
