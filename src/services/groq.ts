// ============================================
// GrievanceIQ — Groq AI Service
// Groq API (Llama 3) for all AI features
// ============================================

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODELS = ['mixtral-8x7b-32768', 'llama-3.1-70b-versatile']

// ============================================
// CORE API CALL WITH RETRY & MODEL FALLBACK
// ============================================

interface GroqOptions {
  json?: boolean
  maxTokens?: number
  temperature?: number
  retries?: number
}

async function callGroq(
  apiKey: string,
  prompt: string | any[],
  options: GroqOptions = {}
): Promise<{ text: string; model: string } | null> {
  const { json = true, maxTokens = 4096, temperature = 0.3, retries = 2 } = options

  for (const model of MODELS) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const messages = typeof prompt === 'string' ? [{ role: 'user', content: prompt }] : prompt;
        const body: any = {
          model: model,
          messages: messages,
          temperature: temperature,
          max_tokens: maxTokens,
          top_p: 0.95
        }
        if (json) {
          body.response_format = { type: 'json_object' }
        }

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 30000) // 30s timeout

        const res = await fetch(GROQ_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(body),
          signal: controller.signal
        })
        clearTimeout(timeout)

        const data: any = await res.json()

        if (!res.ok) {
          // Rate limit
          if (res.status === 429) {
            console.warn(`[Groq] Rate limited on ${model}, attempt ${attempt + 1}`)
            if (attempt < retries) {
              const waitMs = Math.min(1000 * Math.pow(2, attempt), 8000)
              await new Promise(r => setTimeout(r, waitMs))
              continue
            }
          }
          console.error(`[Groq] API error on ${model}:`, data.error?.message || res.statusText)
          break
        }

        // Extract text
        const text = data.choices?.[0]?.message?.content
        if (text) {
          console.log(`[Groq] Success with ${model} (attempt ${attempt + 1})`)
          return { text, model }
        }

        console.warn(`[Groq] Empty response from ${model}`)
        break
      } catch (e: any) {
        if (e.name === 'AbortError') {
          console.warn(`[Groq] Timeout on ${model} (attempt ${attempt + 1})`)
        } else {
          console.error(`[Groq] Network error on ${model}:`, e.message)
        }
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
          continue
        }
        break
      }
    }
  }
  return null
}

// ============================================
// 92 MINISTRY LIST (Complete CPGRAMS List)
// ============================================

const MINISTRIES = `1. Ministry of Agriculture and Farmers Welfare
2. Ministry of Ayush
3. Ministry of Chemicals and Fertilizers
4. Ministry of Civil Aviation
5. Ministry of Coal
6. Ministry of Commerce and Industry
7. Department of Posts
8. Department of Telecommunications
9. Ministry of Consumer Affairs, Food and Public Distribution
10. Ministry of Cooperation
11. Ministry of Corporate Affairs
12. Ministry of Culture
13. Ministry of Defence
14. Ministry of Development of North Eastern Region
15. Ministry of Earth Sciences
16. Ministry of Education (Higher Education)
17. Ministry of Education (School Education)
18. Ministry of Electronics and Information Technology
19. Ministry of Environment, Forest and Climate Change
20. Ministry of External Affairs
21. Department of Economic Affairs
22. Department of Expenditure
23. Department of Financial Services
24. Department of Revenue
25. Department of Investment and Public Asset Management
26. Ministry of Fisheries, Animal Husbandry and Dairying
27. Ministry of Food Processing Industries
28. Ministry of Health and Family Welfare
29. Ministry of Heavy Industries
30. Ministry of Home Affairs
31. Ministry of Housing and Urban Affairs
32. Ministry of Information and Broadcasting
33. Department of Water Resources
34. Department of Drinking Water and Sanitation
35. Ministry of Labour and Employment
36. Ministry of Law and Justice
37. Ministry of MSME
38. Ministry of Mines
39. Ministry of Minority Affairs
40. Ministry of New and Renewable Energy
41. Ministry of Panchayati Raj
42. Ministry of Parliamentary Affairs
43. Department of Administrative Reforms
44. Department of Pensions and Pensioners Welfare
45. Department of Personnel and Training
46. Ministry of Petroleum and Natural Gas
47. Ministry of Planning
48. Ministry of Ports, Shipping and Waterways
49. Ministry of Power
50. Ministry of Railways
51. Ministry of Road Transport and Highways
52. Ministry of Rural Development
53. Department of Biotechnology
54. Department of Science and Technology
55. Department of Scientific and Industrial Research
56. Ministry of Skill Development and Entrepreneurship
57. Ministry of Social Justice and Empowerment
58. Ministry of Statistics and Programme Implementation
59. Ministry of Steel
60. Ministry of Textiles
61. Ministry of Tourism
62. Ministry of Tribal Affairs
63. Ministry of Women and Child Development
64. Ministry of Youth Affairs and Sports
65. Cabinet Secretariat
66. Central Vigilance Commission
67. NITI Aayog
68. Prime Minister's Office
69. Staff Selection Commission
70. Union Public Service Commission
71. Central Board of Direct Taxes
72. Central Board of Indirect Taxes and Customs
73. EPFO
74. ESIC
75. National Commission for Backward Classes
76. National Commission for Minorities
77. National Commission for Scheduled Castes
78. National Commission for Scheduled Tribes
79. National Commission for Women
80. National Human Rights Commission
81. Railway Board
82. Reserve Bank of India
83. SEBI
84. TRAI
85. University Grants Commission
86. CBI
87. Enforcement Directorate
88. National Investigation Agency
89. Directorate General of Foreign Trade
90. Comptroller and Auditor General
91. Election Commission of India
92. President's Secretariat`

// ============================================
// COMPLAINT ANALYSIS PROMPT (Enhanced v4 — Definitive Fix)
// ============================================

const GROQ_SYSTEM_PROMPT = `
You are a senior government complaint officer in India with 20 years of experience.
Your ONLY job is to take a citizen's informal complaint and COMPLETELY REWRITE it 
as a formal government grievance application.

HARD RULES — violating any of these is a failure:

RULE 1: NEVER copy any sentence from the input verbatim. Every sentence must be new.
RULE 2: The output MUST start with: "I wish to bring to your kind attention"
RULE 3: The output MUST end with: "I therefore request your urgent intervention 
         and resolution within the stipulated 30-day period as mandated under 
         the Centralized Public Grievance Redress and Monitoring System guidelines."
RULE 4: The output must be minimum 150 words regardless of input length.
RULE 5: Reference the specific scheme/department/act by its FULL official name.
RULE 6: Convert vague time phrases to specific: "for months" → "since approximately [month] [year]"
RULE 7: Always write in formal English, even if input is in Hindi or mixed language.
RULE 8: Add "despite multiple attempts to seek resolution through local offices" 
         if the complaint mentions prior follow-ups.
RULE 9: Include a specific section: "Impact: This delay/issue has caused [describe hardship]"
RULE 10: The improved_draft field must be DIFFERENT from the input in EVERY sentence.

QUALITY SCORING — Score the ORIGINAL input (before rewrite) on these criteria:
+2 points: Has specific dates mentioned
+2 points: Has reference numbers (PPO, UAN, Aadhaar, application number)
+1 point: Mentions previous complaint or office visit
+1 point: Mentions specific monetary amount
+1 point: Correctly identifies the ministry/department
+1 point: Text is longer than 50 words
+2 points: Lists specific documents as evidence
Base: 0, Max: 10

OUTPUT FORMAT — Return ONLY valid JSON, no markdown, no explanation:
{
  "department": "Full official ministry name (e.g., Department of Pension and Pensioners Welfare, Ministry of Finance)",
  "department_confidence": 0.0 to 1.0,
  "quality_score_before": integer 1-10 based on scoring above,
  "quality_score_after": 9,
  "improved_draft": "COMPLETELY REWRITTEN formal complaint — minimum 150 words — starting with I wish to bring",
  "what_was_added": ["Legal reference added", "Formal salutation", "Specific timeline", "Impact statement"],
  "missing_from_original": ["No reference number provided", "No dates mentioned"],
  "documents_needed": ["Document 1", "Document 2", "Document 3"],
  "resolution_probability": integer between 45 and 92,
  "plain_explanation": "One sentence: what this complaint is about in plain terms"
}
`

const GROQ_USER_PROMPT = (text: string, lang: string) => `
TASK: Rewrite the following citizen complaint into a formal government grievance application.
CRITICAL: Do NOT summarise. Do NOT copy. REWRITE every sentence completely.
The improved_draft MUST start with "I wish to bring to your kind attention"

Citizen's original complaint (language hint: ${lang}):
${text}

Remember: Output ONLY the JSON object. Nothing before or after it.
`

// ============================================
// RTI GENERATION PROMPT (Enhanced v2)
// ============================================

const RTI_PROMPT = (p: any) => `You are GrievanceIQ's RTI (Right to Information) application drafter.

Generate a COMPLETE, professionally formatted RTI application under the Right to Information Act, 2005.

CITIZEN DETAILS:
- Applicant Name: ${p.complainant_name}
- CPGRAMS Registration Number: ${p.cpgrams_id}
- Original Filing Date: ${p.filing_date}
- Department/Ministry: ${p.department}
- Complaint Summary: ${p.complaint_summary}

REQUIREMENTS:
1. Address it "To, The Central Public Information Officer (CPIO)" of the specific department
2. Subject line referencing CPGRAMS complaint number
3. Open with "I, [name], am filing this application under Section 6(1) of the Right to Information Act, 2005"
4. Include 7-8 SPECIFIC information requests:
   (a) Complete file noting and correspondence from date of receipt to present
   (b) Officer(s) assigned — name, designation, dates of assignment
   (c) Whether inquiry/investigation was conducted — if yes, provide copy of report
   (d) If marked "Disposed/Resolved" — exact action taken, copies of orders
   (e) If transferred — full transfer details including dates and receiving department
   (f) Reasons for delay if beyond 30-day CPGRAMS timeline
   (g) Total complaints in same category this financial year, and % resolved in 30 days
   (h) 1-2 questions SPECIFIC to this complaint type (e.g., if PM-KISAN: "Details of eKYC verification status and payment disbursement records")
5. Fee declaration: "I enclose Rs. 10 via [IPO/DD/Court Fee Stamp/Online]"
6. Declaration: "Information sought does not infringe Section 8 or Section 9 exemptions"
7. Applicant details block with [brackets] for fields to fill
8. Filing instructions at bottom: rtionline.gov.in for online, registered post for offline
9. Legal reference: Section 7(1) — 30-day response, Section 19(1) — first appeal, Section 19(3) — second appeal to CIC

Write in FORMAL LEGAL ENGLISH. Be professionally assertive but respectful.
Reference exact RTI Act 2005 sections where applicable.
The output should be plain text (not JSON), ready to be printed and filed.`

// ============================================
// TRANSLATE PROMPT
// ============================================

const TRANSLATE_PROMPT = (text: string, targetLang: string) => `Translate the following text to ${targetLang}. Maintain the formal tone and all technical terms. Output ONLY the translation, nothing else.

Text:
${text}`

// ============================================
// GROQ-POWERED COMPLAINT ANALYSIS
// ============================================

export async function analyzeWithGroq(
  apiKey: string,
  text: string,
  lang: string
): Promise<any | null> {
  // Retry loop for copy-check validation
  let result;
  let p;
  
  for (let attempt = 0; attempt < 3; attempt++) {
    const messages = [
      { role: 'system', content: GROQ_SYSTEM_PROMPT },
      { role: 'user', content: GROQ_USER_PROMPT(text, lang) }
    ];

    result = await callGroq(apiKey, messages, {
      json: true,
      maxTokens: 2000,
      temperature: 0.3
    });

    if (!result) return null;

    try {
      // Clean possible markdown wrapper
      const raw = result.text.replace(/```json|```/g, '').trim();
      p = JSON.parse(raw);
      
      const originalLower = text.toLowerCase();
      const improvedLower = (p.improved_draft || '').toLowerCase();
      
      // Validation: Ensure the model didn't just copy the first 50 chars
      const firstChunk = originalLower.length > 50 ? originalLower.substring(0, 50) : originalLower;
      if (firstChunk.length > 10 && improvedLower.includes(firstChunk)) {
        console.warn(`[Groq] Attempt ${attempt+1}: Model copied original text. Retrying...`);
        continue; // Retry
      }
      
      // Check minimum length (target is 150, but we enforce at least 100 for safety)
      if (improvedLower.split(/\s+/).length < 100) {
        console.warn(`[Groq] Attempt ${attempt+1}: Improved draft too short. Retrying...`);
        continue; // Retry
      }

      break; // Success! Passed validations.
    } catch (e) {
      console.error('[Groq] JSON parse failed on attempt', attempt + 1, e);
      if (attempt === 2) return null;
    }
  }

  if (!p) return null;

  try {
    // Map new JSON format to expected application format
    
    // Validate & sanitize response
    let departments = [];
    if (p.department) {
      departments.push({
        name: p.department,
        confidence: (p.department_confidence || 0.9) * 100,
        reason: 'Identified by AI based on complaint context'
      });
    }
    
    // Ensure exactly 3 departments
    while (departments.length < 3) {
      departments.push({
        name: 'Department of Administrative Reforms',
        confidence: 20.0,
        reason: 'General administrative fallback'
      });
    }

    // Attach model info to the result
    return {
      language_detected: lang || 'en',
      translated_text: null,
      departments: departments,
      department_reasoning: p.plain_explanation || 'Identified by AI model.',
      quality_score_before: Math.min(10, Math.max(1, Number(p.quality_score_before) || 4)),
      quality_score_after: Math.min(10, Math.max(Number(p.quality_score_before) + 1, Number(p.quality_score_after) || 8)),
      missing_elements: Array.isArray(p.missing_from_original) ? p.missing_from_original : [],
      improved_draft: p.improved_draft,
      documents_checklist: Array.isArray(p.documents_needed) ? p.documents_needed : ['Government photo ID (Aadhaar / Voter ID)', 'Address proof'],
      resolution_probability: p.resolution_probability || 75,
      _ai_model: result?.model,
      _ai_source: 'groq'
    };
  } catch (e) {
    console.error('[Groq] Mapping failed:', e);
    return null;
  }
}

// ============================================
// GROQ-POWERED RTI GENERATION
// ============================================

export async function generateRTIWithGroq(
  apiKey: string,
  params: any
): Promise<{ content: string; model: string } | null> {
  const result = await callGroq(apiKey, RTI_PROMPT(params), {
    json: false,
    maxTokens: 4096,
    temperature: 0.4
  })

  if (!result || result.text.length < 200) return null
  return { content: result.text, model: result.model }
}

// ============================================
// ENHANCED MOCK FALLBACK — 17 CATEGORIES
// ============================================

export function mockAnalysis(text: string, language: string) {
  const lower = text.toLowerCase()

  // Expanded keyword → department mapping (17 categories)
  const categoryMap: Record<string, { name: string; confidence: number; reason: string }[]> = {
    'pension|ppo|retired|retirement|superannuation|family.pension|dearness.relief': [
      { name: 'Department of Pensions and Pensioners Welfare', confidence: 91.2, reason: 'Complaint mentions pension or retirement-related terms' },
      { name: 'Department of Financial Services', confidence: 68.5, reason: 'Banking aspect of pension disbursement' },
      { name: 'Ministry of Education (Higher Education)', confidence: 35.0, reason: 'If retired from education sector' }
    ],
    'pm.kisan|kisan|farmer|agriculture|crop|mandi|msp|fasal|kheti|dhan|gehu': [
      { name: 'Ministry of Agriculture and Farmers Welfare', confidence: 94.5, reason: 'Agricultural scheme or farmer welfare complaint' },
      { name: 'Department of Financial Services', confidence: 62.0, reason: 'Payment/banking aspect of agricultural scheme' },
      { name: 'Ministry of Rural Development', confidence: 45.0, reason: 'Rural welfare dimension' }
    ],
    'railway|train|irctc|ticket|platform|coach|berth|tte|station|rail|tatkal': [
      { name: 'Ministry of Railways', confidence: 96.0, reason: 'Railway service-related complaint' },
      { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 40.0, reason: 'Consumer rights dimension' },
      { name: 'Ministry of Commerce and Industry', confidence: 25.0, reason: 'Service quality regulation' }
    ],
    'passport|visa|embassy|consulate|abroad|immigration|emigration|oci': [
      { name: 'Ministry of External Affairs', confidence: 95.0, reason: 'Passport, visa, or consular services complaint' },
      { name: 'Ministry of Home Affairs', confidence: 55.0, reason: 'Police verification or immigration aspect' },
      { name: 'Ministry of Electronics and Information Technology', confidence: 30.0, reason: 'Online portal/technical issues' }
    ],
    'road|highway|pothole|bridge|transport|nhai|toll|expressway|flyover': [
      { name: 'Ministry of Road Transport and Highways', confidence: 90.0, reason: 'Road infrastructure or transport complaint' },
      { name: 'Ministry of Housing and Urban Affairs', confidence: 75.0, reason: 'Urban road or municipal area' },
      { name: 'Ministry of Home Affairs', confidence: 30.0, reason: 'Road safety / accident aspect' }
    ],
    'electricity|power|bill|meter|discom|bijli|transformer|load.shedding|smart.meter': [
      { name: 'Ministry of Power', confidence: 92.0, reason: 'Electricity or power supply complaint' },
      { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 55.0, reason: 'Consumer billing dispute' },
      { name: 'Ministry of New and Renewable Energy', confidence: 30.0, reason: 'If solar/renewable energy related' }
    ],
    'ration|pds|fair.price|food|hunger|bpl|apl|antyodaya|ration.card': [
      { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 93.0, reason: 'Public Distribution System complaint' },
      { name: 'Ministry of Agriculture and Farmers Welfare', confidence: 45.0, reason: 'Food security linkage' },
      { name: 'Ministry of Rural Development', confidence: 40.0, reason: 'Rural food security' }
    ],
    'epfo|pf|provident.fund|esi|labour|uan|employer|gratuity|bonus|wages|minimum.wage': [
      { name: 'Ministry of Labour and Employment', confidence: 94.0, reason: 'Labour, employment, or provident fund complaint' },
      { name: 'EPFO', confidence: 85.0, reason: 'Direct EPFO jurisdiction for PF matters' },
      { name: 'Department of Financial Services', confidence: 50.0, reason: 'Fund disbursement aspect' }
    ],
    'hospital|doctor|medicine|health|ayushman|pmjay|ambulance|medical|disease|treatment': [
      { name: 'Ministry of Health and Family Welfare', confidence: 92.0, reason: 'Healthcare or medical service complaint' },
      { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 45.0, reason: 'Drug pricing or consumer health rights' },
      { name: 'Ministry of Social Justice and Empowerment', confidence: 35.0, reason: 'Healthcare access equity' }
    ],
    'school|college|university|education|exam|teacher|ugc|scholarship|neet|jee|board': [
      { name: 'Ministry of Education (Higher Education)', confidence: 93.0, reason: 'Education system complaint' },
      { name: 'University Grants Commission', confidence: 70.0, reason: 'University regulation or accreditation' },
      { name: 'Ministry of Skill Development and Entrepreneurship', confidence: 40.0, reason: 'Vocational or skill training' }
    ],
    'water|nala|drain|sewage|sanitation|tap|jal|jeevan|pipeline|borewell': [
      { name: 'Department of Drinking Water and Sanitation', confidence: 92.0, reason: 'Water supply or sanitation complaint' },
      { name: 'Ministry of Housing and Urban Affairs', confidence: 65.0, reason: 'Urban water/sewage infrastructure' },
      { name: 'Ministry of Health and Family Welfare', confidence: 35.0, reason: 'Public health from water quality' }
    ],
    'gas|lpg|cylinder|subsidy|petroleum|petrol|diesel|cng|png|oil': [
      { name: 'Ministry of Petroleum and Natural Gas', confidence: 93.0, reason: 'LPG, petroleum, or fuel complaint' },
      { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 55.0, reason: 'Consumer pricing dispute' },
      { name: 'Department of Revenue', confidence: 30.0, reason: 'Tax or subsidy aspect' }
    ],
    'bank|loan|account|atm|credit|debit|upi|neft|rbi|imps|cheque|deposit|interest': [
      { name: 'Department of Financial Services', confidence: 94.0, reason: 'Banking or financial service complaint' },
      { name: 'Reserve Bank of India', confidence: 75.0, reason: 'Banking regulation and consumer grievance' },
      { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 35.0, reason: 'Consumer financial rights' }
    ],
    'police|fir|crime|theft|assault|harassment|cyber|rape|murder|kidnap|dowry': [
      { name: 'Ministry of Home Affairs', confidence: 95.0, reason: 'Law enforcement or crime-related complaint' },
      { name: 'National Human Rights Commission', confidence: 55.0, reason: 'Human rights violation aspect' },
      { name: 'Ministry of Women and Child Development', confidence: 45.0, reason: 'If gender-based violence' }
    ],
    'income.tax|gst|tax|return|refund|tds|pan|itr|assessment|notice': [
      { name: 'Department of Revenue', confidence: 94.0, reason: 'Tax-related complaint' },
      { name: 'Central Board of Direct Taxes', confidence: 82.0, reason: 'Direct tax administration' },
      { name: 'Central Board of Indirect Taxes and Customs', confidence: 55.0, reason: 'If GST or customs related' }
    ],
    'telecom|mobile|broadband|internet|jio|airtel|bsnl|tower|sim|otp|network': [
      { name: 'Department of Telecommunications', confidence: 93.0, reason: 'Telecom service complaint' },
      { name: 'TRAI', confidence: 80.0, reason: 'Telecom regulation and consumer protection' },
      { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 40.0, reason: 'Consumer rights' }
    ],
    'housing|flat|builder|pmay|pradhan.mantri.awas|property|rent|colony|plot|encroachment': [
      { name: 'Ministry of Housing and Urban Affairs', confidence: 92.0, reason: 'Housing or property complaint' },
      { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 50.0, reason: 'Builder/consumer dispute' },
      { name: 'Ministry of Rural Development', confidence: 40.0, reason: 'If rural housing (PMAY-G)' }
    ]
  }

  // Match complaint to department
  let departments = [
    { name: 'Ministry of Home Affairs', confidence: 65.0, reason: 'General administrative complaint — please review department suggestion' },
    { name: 'Department of Administrative Reforms', confidence: 55.0, reason: 'Government service delivery issue' },
    { name: 'Ministry of Consumer Affairs, Food and Public Distribution', confidence: 40.0, reason: 'Consumer rights aspect' }
  ]

  for (const [pattern, depts] of Object.entries(categoryMap)) {
    const regex = new RegExp(pattern.replace(/\./g, '[-\\s.]?'), 'i')
    if (regex.test(lower)) {
      departments = depts
      break
    }
  }

  // Quality scoring with detailed detection
  const hasDate = /\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d+\s*(month|day|week|year|mahine|din|saal|maheena)/i.test(text)
  const hasRef = /[A-Z]{2,}[\/-]\w+[\/-]\d+|\d{6,}|#\d+/.test(text)
  const hasLocation = /(district|city|state|village|block|pin|ward|jila|gaon|nagar|taluk|mandal|tehsil)/i.test(text)
  const hasAmount = /(rs\.?|₹|rupee|lakh|crore|\d+,\d{3})/i.test(text)
  const hasSchemeRef = /(pm.kisan|ayushman|pmay|ujjwala|mudra|jan.dhan|swachh|kisan.samman|atal|pradhan.mantri)/i.test(text)
  const hasOfficialRef = /(cpgrams|pgportal|complaint.id|reference.number|application.number|registration)/i.test(text)
  const wordCount = text.split(/\s+/).length

  let scoreBefore = 3
  if (hasDate) scoreBefore += 1
  if (hasRef) scoreBefore += 1.5
  if (hasLocation) scoreBefore += 1
  if (hasAmount) scoreBefore += 1
  if (hasSchemeRef) scoreBefore += 0.5
  if (hasOfficialRef) scoreBefore += 0.5
  if (wordCount > 30) scoreBefore += 0.5
  if (wordCount > 60) scoreBefore += 0.5
  if (wordCount > 100) scoreBefore += 0.5
  scoreBefore = Math.min(Math.round(scoreBefore), 8)

  const missingElements: string[] = []
  if (!hasDate) missingElements.push('Specific dates (when the problem started or payments were missed)')
  if (!hasRef) missingElements.push('Reference/application/registration numbers')
  if (!hasLocation) missingElements.push('Location details (state, district, pin code)')
  if (!hasAmount) missingElements.push('Financial amounts involved (if applicable)')
  if (wordCount < 30) missingElements.push('More detailed description of the issue and its impact')
  if (!hasOfficialRef && !hasRef) missingElements.push('Previous complaint references (CPGRAMS ID, if any)')
  if (!hasSchemeRef) missingElements.push('Government scheme or act name (if applicable)')

  // Generate improved draft — REWRITE the complaint into formal language
  const deptShort = departments[0].name.replace('Ministry of ', '').replace('Department of ', '')

  // Extract key facts from original text for structured rewrite
  const sentences = text.replace(/([.!?])\s+/g, '$1|').split('|').filter(s => s.trim().length > 5)
  const coreIssue = sentences.slice(0, 3).join(' ').trim()
  const details = sentences.slice(3).join(' ').trim()
  const dateMatch = text.match(/\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/)
  const refMatch = text.match(/[A-Z]{2,}[\/-]\w+[\/-]\d+|\d{6,}/)
  const amountMatch = text.match(/(?:rs\.?|₹)\s*[\d,]+(?:\.\d{2})?|\d+\s*(?:lakh|crore)/i)

  const improved = `Subject: Formal Grievance Regarding ${deptShort} — Request for Urgent Redressal

Respected Sir/Madam,

I wish to bring to your kind attention a matter of serious concern that falls under the jurisdiction of the ${departments[0].name}, and respectfully request your immediate intervention.

NATURE OF GRIEVANCE:
I am facing a significant issue pertaining to ${deptShort.toLowerCase()} services. Specifically, ${coreIssue || 'the concerned department/office has failed to address my legitimate request despite repeated follow-ups'}.${details ? ` Furthermore, ${details}` : ''}

RELEVANT DETAILS:
- Department Concerned: ${departments[0].name}
${dateMatch ? `- Date of Occurrence: ${dateMatch[0]}\n` : '- Date of Occurrence: [Please specify the date when this issue first arose]\n'}\
${refMatch ? `- Reference Number: ${refMatch[0]}\n` : '- Reference/Application Number: [Please provide any reference numbers]\n'}\
${amountMatch ? `- Amount Involved: ${amountMatch[0]}\n` : hasAmount ? '' : '- Financial Impact: [Specify amount in Rupees, if applicable]\n'}\
- Applicant Name: [Your Full Name]
- Contact Number: [Your Phone Number]
- Complete Address with Pin Code: [Your Address]

PREVIOUS EFFORTS:
I have made reasonable efforts to resolve this matter through the appropriate channels, but have not received a satisfactory response. This formal grievance is being filed to seek proper redressal as guaranteed under the citizen's right to public service delivery.

RELIEF SOUGHT:
I respectfully request that this grievance be investigated thoroughly and resolved within the stipulated time frame of 30 days as prescribed under CPGRAMS guidelines. I am prepared to furnish any additional documentation or evidence that may be required to facilitate the resolution.

STATUTORY NOTICE:
Please note that if this complaint is not addressed within the prescribed period, I reserve the right to:
(a) File an application under the Right to Information Act, 2005 (Section 6) seeking details of action taken;
(b) Escalate this matter to the Department of Administrative Reforms and Public Grievances (DARPG);
(c) Approach the appropriate legal forums for further recourse.

I trust that this matter will receive your prompt attention.

Yours faithfully,
[Your Name]
[Date]`

  // Document checklist
  const baseDocs = [
    'Government photo ID (Aadhaar Card / Voter ID / PAN Card)',
    'Address proof (Aadhaar / utility bill / bank statement)',
    'Written copy of this complaint for your personal records'
  ]

  const deptDocs: Record<string, string[]> = {
    'Pension': ['PPO (Pension Payment Order) copy', 'Last 6 months pension slip or bank statement', 'Retirement order with date and designation', 'Form 14 / other pension forms submitted'],
    'Agriculture': ['PM-KISAN registration confirmation or screenshot', 'Aadhaar-linked bank passbook (first page + last 3 months)', 'Land ownership documents (Khasra/Khatauni/Patta)', 'eKYC completion screenshot from PM-KISAN portal'],
    'Railway': ['Ticket/PNR number screenshot', 'IRCTC booking confirmation email/SMS', 'Payment receipt or UPI transaction ID', 'Photos of issue (if cleanliness/safety related)'],
    'Health': ['Ayushman Bharat / PMJAY card copy', 'Hospital treatment records and discharge summary', 'Medical bills and pharmacy receipts', 'Doctor referral letter (if applicable)'],
    'Labour': ['UAN (Universal Account Number) slip', 'EPF passbook or last 6 months statement', 'Employer name, address, and establishment code', 'KYC documents submitted to EPFO'],
    'Power': ['Electricity bills for last 3-6 months', 'Consumer number and meter number', 'Smart meter installation acknowledgement', 'Photos of meter reading (current vs billed)'],
    'Food': ['Ration card front and back copy', 'Aadhaar card (linked to ration card)', 'Fair price shop name, number, and location', 'Previous month ration receipt (if available)'],
    'Financial': ['Bank account statement (last 3-6 months)', 'Loan sanction letter or account number', 'All correspondence with bank (emails, letters)', 'RBI complaint reference number (if filed)'],
    'Road': ['Photos/videos of road damage or issue', 'Exact location with Google Maps pin or landmark', 'Accident/injury report (if applicable)', 'Previous complaint to municipal/NHAI office (if any)'],
    'External': ['Passport copy (first and last page)', 'Appointment confirmation from passport office', 'Police verification status page screenshot', 'Application reference number from portal'],
    'Telecom': ['Mobile/broadband account number', 'Bills showing disputed charges', 'Complaint reference from service provider', 'Screenshot of service outage or issue'],
    'Tax': ['PAN card copy', 'ITR acknowledgement for relevant year', 'Assessment order or notice received', 'Proof of tax payment (challan/receipt)']
  }

  let specificDocs = [...baseDocs]
  for (const [key, docs] of Object.entries(deptDocs)) {
    if (
      departments[0].name.toLowerCase().includes(key.toLowerCase()) ||
      lower.includes(key.toLowerCase())
    ) {
      specificDocs = [...baseDocs, ...docs]
      break
    }
  }

  return {
    language_detected: language || 'en',
    translated_text: language !== 'en' ? text : null,
    departments: departments.map(d => ({
      name: d.name,
      confidence: d.confidence,
      reason: d.reason
    })),
    department_reasoning: `Based on keyword analysis of your complaint, the primary department identified is ${departments[0].name} with ${departments[0].confidence}% confidence. ${departments[0].reason}. ${departments.length > 1 ? `Alternative: ${departments[1].name} (${departments[1].confidence}%) — ${departments[1].reason}.` : ''}`,
    quality_score_before: scoreBefore,
    quality_score_after: Math.min(scoreBefore + 3, 10),
    missing_elements: missingElements,
    improved_draft: improved,
    documents_checklist: specificDocs,
    _ai_model: 'mock-keyword-v2',
    _ai_source: 'mock'
  }
}

// ============================================
// MOCK RTI (Enhanced v2)
// ============================================

export function mockRTI(p: any): string {
  return `APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005

To,
The Central Public Information Officer (CPIO),
${p.department},
Government of India,
New Delhi — 110001

Subject: Request for Information Regarding Status and Action Taken on CPGRAMS Complaint No. ${p.cpgrams_id}

Sir/Madam,

I, ${p.complainant_name}, am filing this application under Section 6(1) of the Right to Information Act, 2005, to seek the following information:

1. COMPLAINT REFERENCE:
   - CPGRAMS Registration Number: ${p.cpgrams_id}
   - Date of Filing: ${p.filing_date}
   - Department/Ministry Concerned: ${p.department}

2. INFORMATION SOUGHT:

   (a) A complete copy of the file noting and all correspondence pertaining to the above-mentioned CPGRAMS complaint from the date of receipt to the present date.

   (b) Name, designation, and contact details of the officer(s) to whom this complaint was assigned for investigation, along with the dates of assignment.

   (c) Whether any inquiry or investigation was conducted in response to this complaint. If yes, please provide a copy of the inquiry report and its findings.

   (d) If the complaint has been marked as "Disposed" or "Resolved" — please provide details of the specific action taken to address the grievance, including copies of any orders, instructions, or notifications issued.

   (e) If the complaint has been transferred to another department, ministry, or state government — please provide the complete details of the transfer including the date of transfer and the name of the receiving department/authority.

   (f) The specific reasons for any delay in resolution, particularly if the complaint has exceeded the standard 30-day resolution timeline prescribed under CPGRAMS guidelines.

   (g) The total number of complaints received by this department/ministry under the same category during the current financial year (2025-26), the number resolved within 30 days, and the percentage of complaints pending beyond 60 days.

3. COMPLAINT SUMMARY:
   ${p.complaint_summary}

4. FEE:
   I am enclosing a fee of Rs. 10 (Rupees Ten only) via [Indian Postal Order / Demand Draft / Court Fee Stamp / Online Payment], payable to the Accounts Officer of ${p.department}, as prescribed under Section 6(1) of the RTI Act, 2005.

5. DECLARATION:
   I declare that the information sought does not infringe upon any exemption under Section 8 or Section 9 of the Right to Information Act, 2005. The information is being sought for legitimate civic purposes.

6. MODE OF INFORMATION:
   I request the information to be provided in [hard copy by registered post / soft copy by email] at the address mentioned below.

APPLICANT DETAILS:
Name: ${p.complainant_name}
Address: [Your Complete Postal Address]
Pin Code: [Your Pin Code]
State: [Your State]
Email: [Your Email Address]
Phone: [Your Phone Number]
Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Yours faithfully,

${p.complainant_name}

---
FILING OPTIONS:
- Online: https://rtionline.gov.in/ (Fee: Rs. 10 via online payment)
- By Post: Send by registered post to CPIO address with Rs. 10 IPO/DD
- Note: BPL (Below Poverty Line) applicants are exempt from fee

YOUR LEGAL RIGHTS:
- CPIO must respond within 30 days (Section 7(1), RTI Act 2005)
- If no response in 30 days → First Appeal under Section 19(1)
- If first appeal fails → Second Appeal to Central Information Commission under Section 19(3)
- Penalty for non-compliance: Rs. 250/day up to Rs. 25,000 (Section 20)

DISCLAIMER: This RTI application was generated by GrievanceIQ as a template.
Please review ALL details carefully before filing.
This tool provides comprehension assistance only — not legal advice.`
}

// ============================================
// UNIFIED EXPORTS WITH SMART FALLBACK
// ============================================

export interface AnalysisResult {
  data: any
  source: 'groq' | 'mock'
  model: string
  latency_ms: number
}

export async function analyzeComplaint(
  apiKey: string | undefined,
  text: string,
  lang: string
): Promise<AnalysisResult> {
  const start = Date.now()

  // Try Groq first
  if (apiKey && apiKey.length > 10) {
    try {
      const result = await analyzeWithGroq(apiKey, text, lang)
      if (result) {
        return {
          data: result,
          source: 'groq',
          model: result._ai_model || 'llama3-70b-8192',
          latency_ms: Date.now() - start
        }
      }
    } catch (e) {
      console.error('[AI] Groq analysis failed, falling back to mock:', e)
    }
  }

  // Fallback to mock
  const mockResult = mockAnalysis(text, lang)
  return {
    data: mockResult,
    source: 'mock',
    model: 'mock-keyword-v2',
    latency_ms: Date.now() - start
  }
}

export interface RTIResult {
  content: string
  source: 'groq' | 'mock'
  model: string
  filing_options: { method: string; url?: string; instructions?: string; fee: string }[]
  legal_references: string[]
}

export async function generateRTI(
  apiKey: string | undefined,
  params: any
): Promise<RTIResult> {
  const filingOptions = [
    { method: 'Online (Recommended)', url: 'https://rtionline.gov.in/', fee: 'Rs. 10 (pay online)' },
    { method: 'By Registered Post', instructions: 'Send by registered post to the CPIO address with Rs. 10 postal order/DD', fee: 'Rs. 10 (IPO/DD)' },
    { method: 'In Person', instructions: 'Visit the CPIO office during working hours with Rs. 10 court fee stamp', fee: 'Rs. 10 (court fee stamp)' }
  ]
  const legalRefs = [
    'Section 6(1) — Right of every citizen to file RTI application to any public authority',
    'Section 7(1) — CPIO must respond within 30 days of receiving the application',
    'Section 7(3) — If information relates to life/liberty, response within 48 hours',
    'Section 19(1) — First Appeal to Appellate Authority if no response in 30 days',
    'Section 19(3) — Second Appeal to Central Information Commission (CIC)',
    'Section 20 — Penalty of Rs. 250/day (max Rs. 25,000) for non-compliance by CPIO'
  ]

  // Try Groq
  if (apiKey && apiKey.length > 10) {
    try {
      const result = await generateRTIWithGroq(apiKey, params)
      if (result) {
        return {
          content: result.content,
          source: 'groq',
          model: result.model,
          filing_options: filingOptions,
          legal_references: legalRefs
        }
      }
    } catch (e) {
      console.error('[AI] Gemini RTI failed, falling back to mock:', e)
    }
  }

  // Fallback to mock
  return {
    content: mockRTI(params),
    source: 'mock',
    model: 'mock-template-v2',
    filing_options: filingOptions,
    legal_references: legalRefs
  }
}
