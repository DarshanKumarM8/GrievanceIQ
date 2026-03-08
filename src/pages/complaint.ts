import { layout } from './layout'

export function complaintPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-800 to-navy-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
        <i class="fas fa-pen-to-square text-saffron-400 mr-2"></i>Smart Complaint Builder
      </h1>
      <p class="text-gray-300 text-sm">Type your problem. AI analyzes, routes, scores, and rewrites it for maximum impact.</p>
    </div>
  </section>

  <section class="py-8 sm:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- INPUT SECTION -->
      <div class="max-w-3xl mx-auto mb-8" id="inputSection">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
            <h2 class="font-semibold text-gray-700 text-sm"><i class="fas fa-keyboard mr-2 text-saffron-500"></i>Describe Your Problem</h2>
            <select id="langSelect" class="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:border-saffron-400">
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>
          <textarea id="complaintInput" rows="6" placeholder="Write your complaint in plain language...&#10;&#10;Example: My PM-KISAN payment has not come for 3 months. I have done eKYC also but still showing payment failed on the portal." class="w-full px-5 py-4 text-gray-800 placeholder-gray-400 resize-none focus:outline-none text-base leading-relaxed"></textarea>
          <div class="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
            <span class="text-xs text-gray-400" id="inputCharCount">0 characters</span>
            <button onclick="analyzeComplaint()" id="analyzeButton" class="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-saffron-600 hover:to-saffron-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50" disabled>
              <i class="fas fa-bolt" id="analyzeBtnIcon"></i>
              <span id="analyzeBtnText">Analyze My Complaint</span>
            </button>
          </div>
        </div>
      </div>

      <!-- LOADING STATE -->
      <div class="max-w-3xl mx-auto hidden" id="loadingSection">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 text-center">
          <div class="spinner mx-auto mb-4" style="width:40px;height:40px;border-width:4px;"></div>
          <h3 class="font-bold text-gray-800 mb-2">Analyzing Your Complaint...</h3>
          <div class="space-y-2 text-sm text-gray-500" id="loadingSteps">
            <p id="step1" class="flex items-center justify-center gap-2"><span class="spinner" style="width:16px;height:16px;"></span> Detecting language...</p>
            <p id="step2" class="flex items-center justify-center gap-2 text-gray-300"><i class="fas fa-clock"></i> Classifying department...</p>
            <p id="step3" class="flex items-center justify-center gap-2 text-gray-300"><i class="fas fa-clock"></i> Scoring complaint quality...</p>
            <p id="step4" class="flex items-center justify-center gap-2 text-gray-300"><i class="fas fa-clock"></i> Generating improved draft...</p>
          </div>
        </div>
      </div>

      <!-- RESULTS SECTION -->
      <div class="hidden" id="resultsSection">
        <!-- Department Routing -->
        <div class="max-w-4xl mx-auto mb-6" data-animate>
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-navy-600 to-navy-700 flex items-center gap-2">
              <i class="fas fa-building-columns text-white"></i>
              <h2 class="font-bold text-white">Department Routing</h2>
              <span class="ml-auto text-xs text-navy-200">AI-powered classification</span>
            </div>
            <div class="p-6" id="departmentResults"></div>
          </div>
        </div>

        <!-- Quality Score -->
        <div class="max-w-4xl mx-auto mb-6 grid md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" data-animate>
            <div class="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center gap-2">
              <i class="fas fa-star text-white"></i>
              <h2 class="font-bold text-white">Quality Score</h2>
            </div>
            <div class="p-6" id="qualityResults"></div>
          </div>
          
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" data-animate>
            <div class="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 flex items-center gap-2">
              <i class="fas fa-triangle-exclamation text-white"></i>
              <h2 class="font-bold text-white">Missing Elements</h2>
            </div>
            <div class="p-6" id="missingResults"></div>
          </div>
        </div>

        <!-- Side-by-Side Editor -->
        <div class="max-w-5xl mx-auto mb-6" data-animate>
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-ashoka-600 to-ashoka-700 flex items-center gap-2">
              <i class="fas fa-wand-magic-sparkles text-white"></i>
              <h2 class="font-bold text-white">AI Complaint Builder — Side by Side</h2>
              <span class="ml-auto text-xs text-ashoka-200">Editable — modify before using</span>
            </div>
            <div class="grid md:grid-cols-2 divide-x divide-gray-200">
              <div class="p-5">
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-3 h-3 rounded-full bg-red-400"></span>
                  <span class="text-sm font-semibold text-gray-500">YOUR ORIGINAL</span>
                </div>
                <div id="originalText" class="text-sm text-gray-700 bg-red-50/50 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap leading-relaxed"></div>
              </div>
              <div class="p-5">
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-3 h-3 rounded-full bg-ashoka-500"></span>
                  <span class="text-sm font-semibold text-gray-500">AI IMPROVED</span>
                  <button onclick="copyImproved()" class="ml-auto text-xs text-saffron-600 hover:text-saffron-700 font-medium"><i class="fas fa-copy mr-1"></i>Copy</button>
                </div>
                <textarea id="improvedText" class="text-sm text-gray-700 bg-ashoka-50/50 rounded-lg p-4 min-h-[200px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-ashoka-300 resize-y leading-relaxed"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Document Checklist -->
        <div class="max-w-4xl mx-auto mb-6" data-animate>
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center gap-2">
              <i class="fas fa-clipboard-check text-white"></i>
              <h2 class="font-bold text-white">Document Checklist</h2>
              <span class="ml-auto text-xs text-purple-200">Attach these when filing</span>
            </div>
            <div class="p-6" id="checklistResults"></div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="max-w-4xl mx-auto mb-6" data-animate>
          <div class="bg-gradient-to-r from-saffron-50 to-ashoka-50 rounded-2xl border border-saffron-200 p-6">
            <h3 class="font-bold text-gray-900 mb-4"><i class="fas fa-arrow-right-from-bracket text-saffron-600 mr-2"></i>Next Steps</h3>
            <div class="grid sm:grid-cols-3 gap-4">
              <div class="bg-white rounded-xl p-4 shadow-sm">
                <div class="w-8 h-8 bg-saffron-100 rounded-lg flex items-center justify-center mb-2">
                  <span class="text-sm font-bold text-saffron-700">1</span>
                </div>
                <h4 class="font-semibold text-sm mb-1">Copy Improved Complaint</h4>
                <p class="text-xs text-gray-500">Review the AI draft, edit if needed, then copy it</p>
              </div>
              <div class="bg-white rounded-xl p-4 shadow-sm">
                <div class="w-8 h-8 bg-saffron-100 rounded-lg flex items-center justify-center mb-2">
                  <span class="text-sm font-bold text-saffron-700">2</span>
                </div>
                <h4 class="font-semibold text-sm mb-1">File on CPGRAMS</h4>
                <p class="text-xs text-gray-500">Go to <a href="https://pgportal.gov.in" target="_blank" class="text-saffron-600 underline">pgportal.gov.in</a> and submit</p>
              </div>
              <div class="bg-white rounded-xl p-4 shadow-sm">
                <div class="w-8 h-8 bg-saffron-100 rounded-lg flex items-center justify-center mb-2">
                  <span class="text-sm font-bold text-saffron-700">3</span>
                </div>
                <h4 class="font-semibold text-sm mb-1">Track With Us</h4>
                <p class="text-xs text-gray-500"><a href="/tracker" class="text-saffron-600 underline">Enter your CPGRAMS ID</a> to track progress</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Start Over -->
        <div class="max-w-4xl mx-auto text-center">
          <button onclick="resetForm()" class="text-sm text-gray-500 hover:text-saffron-600 font-medium">
            <i class="fas fa-rotate-left mr-1"></i> Analyze another complaint
          </button>
        </div>
      </div>
    </div>
  </section>

  <script>
    // Pre-fill from homepage
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('text')) {
      document.getElementById('complaintInput').value = decodeURIComponent(urlParams.get('text'));
      document.getElementById('langSelect').value = urlParams.get('lang') || 'en';
      document.getElementById('inputCharCount').textContent = document.getElementById('complaintInput').value.length + ' characters';
      document.getElementById('analyzeButton').disabled = false;
    }

    document.getElementById('complaintInput').addEventListener('input', (e) => {
      document.getElementById('inputCharCount').textContent = e.target.value.length + ' characters';
      document.getElementById('analyzeButton').disabled = e.target.value.trim().length < 10;
    });

    async function analyzeComplaint() {
      const text = document.getElementById('complaintInput').value.trim();
      const lang = document.getElementById('langSelect').value;
      if (text.length < 10) return;

      // Show loading
      document.getElementById('inputSection').querySelector('.bg-white').classList.add('opacity-50');
      document.getElementById('loadingSection').classList.remove('hidden');
      document.getElementById('resultsSection').classList.add('hidden');
      document.getElementById('analyzeButton').disabled = true;
      document.getElementById('analyzeBtnIcon').className = 'spinner';
      document.getElementById('analyzeBtnText').textContent = 'Analyzing...';

      // Animate loading steps
      const steps = ['step1', 'step2', 'step3', 'step4'];
      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 600));
        document.getElementById(steps[i]).innerHTML = '<i class="fas fa-check-circle text-ashoka-500"></i> ' + document.getElementById(steps[i]).textContent.replace(/^[\\s\\S]*?(Detecting|Classifying|Scoring|Generating)/, '$1');
        document.getElementById(steps[i]).classList.remove('text-gray-300');
        document.getElementById(steps[i]).classList.add('text-ashoka-600');
        if (i + 1 < steps.length) {
          document.getElementById(steps[i + 1]).innerHTML = '<span class="spinner" style="width:16px;height:16px;"></span> ' + document.getElementById(steps[i + 1]).textContent.replace(/^[\\s\\S]*?(Classifying|Scoring|Generating)/, '$1');
          document.getElementById(steps[i + 1]).classList.remove('text-gray-300');
        }
      }

      try {
        const res = await fetch('/api/complaints/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language: lang })
        });
        const json = await res.json();
        
        if (json.success) {
          await new Promise(r => setTimeout(r, 400));
          renderResults(json.data, text);
        } else {
          showToast(json.error || 'Analysis failed', 'error');
        }
      } catch (e) {
        showToast('Network error. Please try again.', 'error');
      }

      document.getElementById('loadingSection').classList.add('hidden');
      document.getElementById('inputSection').querySelector('.bg-white').classList.remove('opacity-50');
      document.getElementById('analyzeBtnIcon').className = 'fas fa-bolt';
      document.getElementById('analyzeBtnText').textContent = 'Analyze My Complaint';
      document.getElementById('analyzeButton').disabled = false;
    }

    function renderResults(data, originalText) {
      document.getElementById('resultsSection').classList.remove('hidden');
      
      // Department routing
      const deptHtml = data.departments.map((d, i) => {
        const barColor = i === 0 ? 'bg-ashoka-500' : (i === 1 ? 'bg-saffron-500' : 'bg-gray-400');
        const badge = i === 0 ? '<span class="bg-ashoka-100 text-ashoka-700 text-xs px-2 py-0.5 rounded-full font-semibold">BEST MATCH</span>' : '';
        return \`
          <div class="flex items-center gap-4 p-3 rounded-xl \${i === 0 ? 'bg-ashoka-50 border border-ashoka-200' : 'hover:bg-gray-50'} mb-2">
            <div class="w-10 h-10 \${i === 0 ? 'bg-ashoka-500' : 'bg-gray-200'} rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
              \${i + 1}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="font-semibold text-sm text-gray-900 truncate">\${d.name}</h4>
                \${badge}
              </div>
              <p class="text-xs text-gray-500 mt-0.5">\${d.reason}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-lg font-bold \${i === 0 ? 'text-ashoka-600' : 'text-gray-600'}">\${d.confidence}%</div>
              <div class="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
                <div class="\${barColor} h-full rounded-full" style="width:\${d.confidence}%"></div>
              </div>
            </div>
          </div>
        \`;
      }).join('');
      document.getElementById('departmentResults').innerHTML = deptHtml + \`<p class="text-xs text-gray-400 mt-3 italic"><i class="fas fa-info-circle mr-1"></i>\${data.department_reasoning}</p>\`;

      // Quality score
      const scoreBefore = data.quality_score_before;
      const scoreAfter = data.quality_score_after;
      const gaugeColor = (score) => score <= 3 ? '#ef4444' : score <= 5 ? '#f59e0b' : score <= 7 ? '#3b82f6' : '#22c55e';
      
      document.getElementById('qualityResults').innerHTML = \`
        <div class="flex items-center justify-center gap-8">
          <div class="text-center">
            <div class="quality-gauge mx-auto mb-2" style="--gauge-color:\${gaugeColor(scoreBefore)};--gauge-percent:\${scoreBefore * 10}%">
              <div class="quality-gauge-inner">
                <span class="text-2xl font-black" style="color:\${gaugeColor(scoreBefore)}">\${scoreBefore}</span>
                <span class="text-xs text-gray-400">/10</span>
              </div>
            </div>
            <span class="text-xs font-semibold text-gray-500">BEFORE</span>
          </div>
          <div class="text-3xl text-gray-300"><i class="fas fa-arrow-right"></i></div>
          <div class="text-center">
            <div class="quality-gauge mx-auto mb-2" style="--gauge-color:\${gaugeColor(scoreAfter)};--gauge-percent:\${scoreAfter * 10}%">
              <div class="quality-gauge-inner">
                <span class="text-2xl font-black" style="color:\${gaugeColor(scoreAfter)}">\${scoreAfter}</span>
                <span class="text-xs text-gray-400">/10</span>
              </div>
            </div>
            <span class="text-xs font-semibold text-ashoka-600">AFTER AI</span>
          </div>
        </div>
        <p class="text-center text-xs text-gray-500 mt-3">Complaint strength improved by <strong class="text-ashoka-600">+\${scoreAfter - scoreBefore} points</strong></p>
      \`;

      // Missing elements
      document.getElementById('missingResults').innerHTML = data.missing_elements.length > 0
        ? data.missing_elements.map(m => \`
          <div class="flex items-start gap-2 mb-2">
            <i class="fas fa-xmark text-red-500 mt-0.5 flex-shrink-0"></i>
            <span class="text-sm text-gray-700">\${m}</span>
          </div>
        \`).join('')
        : '<p class="text-sm text-ashoka-600"><i class="fas fa-check-circle mr-1"></i> All essential elements present!</p>';

      // Side by side
      document.getElementById('originalText').textContent = originalText;
      document.getElementById('improvedText').value = data.improved_draft;

      // Document checklist
      document.getElementById('checklistResults').innerHTML = data.documents_checklist.map((doc, i) => \`
        <label class="flex items-center gap-3 mb-2 cursor-pointer group">
          <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500">
          <span class="text-sm text-gray-700 group-hover:text-purple-700">\${doc}</span>
        </label>
      \`).join('');
      
      // Scroll to results
      document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function copyImproved() {
      const text = document.getElementById('improvedText').value;
      navigator.clipboard.writeText(text).then(() => showToast('Improved complaint copied!', 'success'));
    }

    function resetForm() {
      document.getElementById('resultsSection').classList.add('hidden');
      document.getElementById('complaintInput').value = '';
      document.getElementById('inputCharCount').textContent = '0 characters';
      document.getElementById('analyzeButton').disabled = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset loading steps
      ['step1','step2','step3','step4'].forEach((s,i) => {
        const labels = ['Detecting language...','Classifying department...','Scoring complaint quality...','Generating improved draft...'];
        document.getElementById(s).innerHTML = (i === 0 ? '<span class="spinner" style="width:16px;height:16px;"></span> ' : '<i class="fas fa-clock"></i> ') + labels[i];
        if (i > 0) { document.getElementById(s).classList.add('text-gray-300'); document.getElementById(s).classList.remove('text-ashoka-600'); }
      });
    }
  </script>
  `
  return layout('Smart Complaint Builder', content, 'complaint')
}
