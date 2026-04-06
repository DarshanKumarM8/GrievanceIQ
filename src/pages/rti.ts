import { layout } from './layout'

export function rtiPage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-red-800 to-red-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2"><i class="fas fa-gavel text-red-300 mr-2"></i>RTI Auto-Drafter</h1>
      <p class="text-red-200 text-sm">Generate a legally formatted Right to Information application in one click. You review, you file.</p>
    </div>
  </section>

  <section class="py-8 sm:py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Info Banner -->
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <i class="fas fa-info-circle text-amber-600 mt-0.5 flex-shrink-0"></i>
        <div class="text-sm text-amber-800">
          <strong>What is RTI?</strong> The Right to Information Act 2005 gives every Indian citizen the right to demand information from public authorities. If your CPGRAMS complaint has been ignored for 30+ days, an RTI forces the department to explain what action they took — and they face penalties (Rs. 250/day) for not responding.
        </div>
      </div>

      <!-- RTI Form -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
        <div class="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700">
          <h2 class="font-bold text-white"><i class="fas fa-file-lines mr-2"></i>RTI Application Details</h2>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Your Full Name <span class="text-red-500">*</span></label>
            <input type="text" id="rtiName" placeholder="Enter your full name as per government records" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">CPGRAMS Complaint ID <span class="text-red-500">*</span></label>
            <input type="text" id="rtiCpgrams" placeholder="e.g., PMOPG/E/2026/0012345" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date Complaint Was Filed</label>
            <input type="date" id="rtiDate" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Department/Ministry Name</label>
            <input type="text" id="rtiDept" placeholder="e.g., Ministry of Agriculture and Farmers Welfare" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Brief Summary of Your Complaint</label>
            <textarea id="rtiSummary" rows="3" placeholder="Summarize the issue you originally complained about" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none"></textarea>
          </div>
          <button onclick="generateRTI()" id="generateBtn" class="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 shadow-lg">
            <i class="fas fa-wand-magic-sparkles"></i> Generate RTI Application
          </button>
        </div>
      </div>

      <!-- RTI Preview -->
      <div id="rtiPreview" class="hidden">
        <!-- AI Source Badge -->
        <div class="mb-4" id="rtiAiSourceBadge"></div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <h2 class="font-semibold text-gray-700 text-sm"><i class="fas fa-eye mr-2"></i>RTI Application Preview</h2>
            <div class="flex gap-2">
              <button onclick="copyRTI()" class="text-xs text-saffron-600 hover:text-saffron-700 font-medium px-3 py-1.5 rounded-lg hover:bg-saffron-50"><i class="fas fa-copy mr-1"></i>Copy Text</button>
              <button onclick="downloadRTIPDF()" class="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 font-medium"><i class="fas fa-download mr-1"></i>Download PDF</button>
            </div>
          </div>
          <div class="p-6">
            <pre id="rtiContent" class="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans"></pre>
          </div>
        </div>

        <!-- Filing Options -->
        <div class="bg-ashoka-50 border border-ashoka-200 rounded-xl p-5 mb-6" id="filingOptions"></div>

        <!-- Legal References -->
        <div class="bg-navy-50 border border-navy-200 rounded-xl p-5 mb-6" id="legalRefs"></div>

        <!-- Important Note -->
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <i class="fas fa-exclamation-triangle text-amber-600 mt-0.5 flex-shrink-0"></i>
          <div class="text-xs text-amber-800">
            <strong>Disclaimer:</strong> This RTI application is generated by GrievanceIQ as a comprehension and document-preparation tool only. It is NOT legal advice. Please review all details carefully before filing. Ensure all personal information is accurate. You are responsible for the accuracy of the information provided.
          </div>
        </div>
      </div>
    </div>
  </section>

  <script>
    async function generateRTI() {
      const name = document.getElementById('rtiName').value.trim();
      if (!name) { showToast('Please enter your name', 'warning'); return; }

      document.getElementById('generateBtn').innerHTML = '<span class="spinner" style="width:16px;height:16px;"></span> Generating RTI application...';
      document.getElementById('generateBtn').disabled = true;

      try {
        const res = await fetch('/api/rti/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            complainant_name: name,
            cpgrams_id: document.getElementById('rtiCpgrams').value || '[CPGRAMS ID]',
            filing_date: document.getElementById('rtiDate').value || '[Filing Date]',
            department: document.getElementById('rtiDept').value || '[Department Name]',
            complaint_summary: document.getElementById('rtiSummary').value || '[Complaint Summary]'
          })
        });
        const json = await res.json();
        if (json.success) {
          const data = json.data;
          document.getElementById('rtiContent').textContent = data.content;
          
          // AI Source Badge
          const isGemini = data._ai_source === 'gemini';
          document.getElementById('rtiAiSourceBadge').innerHTML = \`
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold \${isGemini ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}">
              <span class="w-2 h-2 rounded-full \${isGemini ? 'bg-blue-500' : 'bg-gray-400'}"></span>
              \${isGemini ? '<i class="fas fa-microchip mr-0.5"></i> RTI generated by Gemini AI' : '<i class="fas fa-file-lines mr-0.5"></i> RTI generated from template'}
            </span>
            <span class="text-xs text-gray-400 ml-2">\${data._ai_model || ''}</span>
          \`;
          
          // Filing options
          document.getElementById('filingOptions').innerHTML = '<h3 class="font-bold text-sm text-ashoka-800 mb-3"><i class="fas fa-paper-plane mr-2"></i>How to File This RTI</h3>' +
            data.filing_options.map(o => '<div class="flex items-start gap-2 mb-2"><i class="fas fa-chevron-right text-ashoka-600 mt-0.5 text-xs"></i><div><strong class="text-sm">' + o.method + '</strong><span class="text-sm text-gray-600"> — ' + (o.url ? '<a href="' + o.url + '" target="_blank" class="text-ashoka-600 underline">' + o.url + '</a>' : o.instructions) + '</span><span class="text-xs text-gray-400 ml-2">Fee: ' + o.fee + '</span></div></div>').join('');
          
          // Legal refs
          document.getElementById('legalRefs').innerHTML = '<h3 class="font-bold text-sm text-navy-700 mb-3"><i class="fas fa-scale-balanced mr-2"></i>Your Legal Rights Under RTI Act 2005</h3>' +
            data.legal_references.map(r => '<div class="flex items-start gap-2 mb-1.5"><i class="fas fa-check text-navy-500 text-xs mt-1"></i><span class="text-sm text-gray-700">' + r + '</span></div>').join('');
          
          document.getElementById('rtiPreview').classList.remove('hidden');
          document.getElementById('rtiPreview').scrollIntoView({ behavior: 'smooth' });
          showToast('RTI application generated successfully!', 'success');
        }
      } catch(e) { showToast('Generation failed. Please try again.', 'error'); }

      document.getElementById('generateBtn').innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate RTI Application';
      document.getElementById('generateBtn').disabled = false;
    }

    function copyRTI() {
      navigator.clipboard.writeText(document.getElementById('rtiContent').textContent);
      showToast('RTI text copied to clipboard!', 'success');
    }

    function downloadRTIPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const text = document.getElementById('rtiContent').textContent;
      const lines = doc.splitTextToSize(text, 170);
      doc.setFont('helvetica');
      doc.setFontSize(10);
      let y = 20;
      // Title
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('RTI APPLICATION — RIGHT TO INFORMATION ACT, 2005', 20, y);
      y += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      lines.forEach(line => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, 20, y);
        y += 5;
      });
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Generated by GrievanceIQ — Review before filing — https://grievanceiq.pages.dev', 20, 285);
      doc.save('RTI_Application_GrievanceIQ.pdf');
      showToast('PDF downloaded!', 'success');
    }
  </script>
  `
  return layout('RTI Auto-Drafter', content, 'rti', {
    description: 'Auto-generate legally accurate Right to Information (RTI) applications under Section 6(1) of RTI Act 2005 for unresolved CPGRAMS complaints.',
    keywords: 'RTI application, Right to Information, RTI Act 2005, CPGRAMS RTI, government accountability'
  })
}
