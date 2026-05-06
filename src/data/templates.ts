export const COMPLAINT_TEMPLATES = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN Payment Not Received',
    category: 'Agriculture & Welfare',
    icon: '🌾',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    template: `Subject: Non-Receipt of PM-KISAN Installment — Beneficiary ID [YOUR_BENEFICIARY_ID]

Respected Sir/Madam,

I am writing to urgently bring to your notice that I have not received the latest installment under the Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) scheme. My Aadhaar-linked bank account has not been credited with the entitled amount of ₹2,000 for the current installment cycle, despite my name appearing on the verified beneficiary list.

I have completed all required eKYC verification and my land records are duly updated in the state portal. My previous installments were received without issue, and I am unable to identify any disqualification or error that would explain this delay.

I humbly request the concerned authority to investigate the payment hold on my beneficiary account, rectify any system errors, and release the pending installment at the earliest. Should this matter remain unresolved within 30 days, I shall be compelled to seek information under the Right to Information Act, 2005.

Yours faithfully,
[Your Name]
[Your Phone Number]
[Your Village/District/State]
Aadhaar Number: [Your Aadhaar]
Beneficiary ID: [YOUR_BENEFICIARY_ID]`,
    documents: ['Aadhaar Card (front & back)', 'PM-KISAN beneficiary ID screenshot', 'Bank passbook (last 6 months)', 'Land ownership record / Khasra-Khatauni', 'eKYC completion receipt']
  },
  {
    id: 'epf-withdrawal',
    title: 'EPF/PF Withdrawal Delayed',
    category: 'Labour & Employment',
    icon: '💼',
    ministry: 'Ministry of Labour and Employment',
    template: `Subject: Inordinate Delay in EPF Withdrawal Claim — UAN [YOUR_UAN]

Respected Sir/Madam,

I am writing to bring to your immediate attention an unacceptable delay in the processing of my Employee Provident Fund (EPF) withdrawal claim submitted via the EPFO Unified Member Portal. Despite completing all formalities including Aadhaar-UAN linking, KYC verification, and submitting Form 19/10C online, my claim has been pending for over [NUMBER] days without any status update or communication.

The delay has caused considerable financial hardship as the PF corpus represents my primary post-employment financial security. I have attempted to follow up through the EPFO helpline (1800-118-005) and the regional PF office at [YOUR_CITY], but have received no satisfactory response.

I respectfully request the Regional PF Commissioner to expedite the settlement of my withdrawal claim and credit the full entitled amount to my Aadhaar-linked bank account within the statutory 20-day processing timeline.

Yours faithfully,
[Your Name]
UAN: [YOUR_UAN]
PF Account Number: [YOUR_PF_NUMBER]
[Your Phone Number]`,
    documents: ['UAN card / screenshot', 'Previous employer relieving letter', 'Bank passbook linked to UAN', 'KYC documents (Aadhaar, PAN)', 'Claim submission acknowledgment', 'Screenshot of EPFO portal showing pending status']
  },
  {
    id: 'ration-card',
    title: 'Ration Card Not Issued / Delayed',
    category: 'Food & Public Distribution',
    icon: '🍚',
    ministry: 'Ministry of Consumer Affairs, Food and Public Distribution',
    template: `Subject: Non-Issuance of Ration Card Despite Completed Application — Application No. [YOUR_APPLICATION_NUMBER]

Respected Sir/Madam,

I respectfully submit this complaint regarding the non-issuance of my ration card under the National Food Security Act (NFSA), 2013. I submitted my complete application along with all required documents at [YOUR_FPS_OFFICE / DISTRICT_OFFICE] on [DATE], and received acknowledgment bearing Application Number [YOUR_APPLICATION_NUMBER].

Despite the prescribed processing period having elapsed, I have neither received my ration card nor any communication regarding the status of my application. As a result, my family of [NUMBER] members has been deprived of subsidized food grains and essential commodities to which we are entitled under the NFSA.

I request the competent authority to immediately process my pending application, issue the appropriate category ration card (AAY/PHH), and ensure my family's inclusion in the beneficiary list at our designated Fair Price Shop.

Yours faithfully,
[Your Name]
[Your Address]
[Your Phone Number]`,
    documents: ['Application acknowledgment receipt', 'Aadhaar Cards of all family members', 'Address proof', 'Income certificate', 'Passport-size photographs', 'Previous ration card (if renewal)']
  },
  {
    id: 'passport-delay',
    title: 'Passport Application Delayed',
    category: 'External Affairs',
    icon: '🛂',
    ministry: 'Ministry of External Affairs',
    template: `Subject: Excessive Delay in Passport Processing — File No. [YOUR_FILE_NUMBER]

Respected Sir/Madam,

I am writing to formally complain about an unreasonable delay in the processing of my passport application submitted at the Passport Seva Kendra, [YOUR_CITY] on [DATE]. My application file number is [YOUR_FILE_NUMBER] and I applied under the [Normal/Tatkaal] category.

Police verification was completed on [DATE], and yet my passport has not been dispatched. The Passport Seva portal shows the status as [CURRENT_STATUS] for the past [NUMBER] weeks without any progress.

I kindly request the Regional Passport Officer to review my file and expedite the printing and dispatch of my passport at the earliest.

Yours faithfully,
[Your Name]
File Number: [YOUR_FILE_NUMBER]
[Your Phone Number]`,
    documents: ['Passport application receipt', 'Police verification report (if available)', 'Aadhaar Card', 'Address proof', 'Screenshot of passport status page']
  },
  {
    id: 'pension-delay',
    title: 'Government Pension Not Received',
    category: 'Pension & Retirement',
    icon: '👴',
    ministry: 'Ministry of Personnel, Public Grievances and Pensions',
    template: `Subject: Non-Disbursement of Pension for [NUMBER] Consecutive Months — PPO No. [YOUR_PPO_NUMBER]

Respected Sir/Madam,

I am writing to urgently bring to your notice a severe and unexplained disruption in the disbursement of my government pension. For the past [NUMBER] consecutive months, my pension credits have not been reflected in my designated bank account maintained at [BANK_NAME], [BRANCH], despite no change in my eligibility status or life certificate submission.

I am a retired [YOUR_DESIGNATION] from [YOUR_DEPARTMENT], drawing pension under PPO Number [YOUR_PPO_NUMBER]. My pension was being regularly disbursed until [LAST_MONTH_RECEIVED], after which all payments ceased without any prior notice or communication from the Pay & Accounts Office.

I respectfully request an immediate investigation into the cause of this stoppage, clearance of all pending arrears, and restoration of the regular monthly pension cycle.

Yours faithfully,
[Your Name]
PPO Number: [YOUR_PPO_NUMBER]
[Your Phone Number]
[Your Bank Account Details]`,
    documents: ['PPO (Pension Payment Order)', 'Bank passbook showing last pension credit', 'Life certificate (Jeevan Praman)', 'Aadhaar Card', 'Retirement order copy']
  },
  {
    id: 'electricity-billing',
    title: 'Excessive / Wrong Electricity Bill',
    category: 'Power & Energy',
    icon: '⚡',
    ministry: 'Ministry of Power',
    template: `Subject: Grossly Inflated Electricity Bill — Consumer No. [YOUR_CONSUMER_NUMBER]

Respected Sir/Madam,

I am writing to formally dispute an excessively inflated electricity bill received for the billing period [MONTH/YEAR]. The billed amount of ₹[AMOUNT] is approximately [X] times higher than my average monthly consumption, which typically ranges between ₹[NORMAL_AMOUNT] to ₹[NORMAL_AMOUNT].

I suspect the bill has been generated based on estimated readings rather than actual meter readings, or there is a defect in the electricity meter installed at my premises. I have not added any new electrical appliances or made changes that would justify such a dramatic increase in consumption.

I request the concerned electricity distribution company to conduct an immediate physical meter inspection, provide a corrected bill based on actual consumption, and refund any excess amount already collected.

Yours faithfully,
[Your Name]
Consumer Number: [YOUR_CONSUMER_NUMBER]
[Your Address]
[Your Phone Number]`,
    documents: ['Disputed electricity bill copy', 'Previous 6 months bills for comparison', 'Meter reading photograph', 'Payment receipts', 'Consumer ID proof']
  },
  {
    id: 'railway-refund',
    title: 'Railway Ticket Refund Not Received',
    category: 'Railways',
    icon: '🚂',
    ministry: 'Ministry of Railways',
    template: `Subject: Non-Receipt of Railway Ticket Refund — PNR [YOUR_PNR_NUMBER]

Respected Sir/Madam,

I am writing to complain about the non-receipt of a legitimate refund for my cancelled/waitlisted railway ticket. My ticket with PNR number [YOUR_PNR_NUMBER] for train [TRAIN_NUMBER] on [DATE] from [ORIGIN] to [DESTINATION] was cancelled/auto-cancelled, but the refund amount of ₹[AMOUNT] has not been credited to my payment source despite the standard processing period having elapsed.

The ticket was booked through [IRCTC Website/Counter] and payment was made via [UPI/Card/Net Banking]. The cancellation was processed on [DATE] but no refund has been reflected in over [NUMBER] days.

I request the IRCTC/Railway administration to immediately process and credit my pending refund.

Yours faithfully,
[Your Name]
PNR: [YOUR_PNR_NUMBER]
[Your Phone Number]`,
    documents: ['Ticket booking confirmation / e-ticket', 'Cancellation receipt', 'Bank/UPI statement showing debit', 'IRCTC account screenshot', 'Payment transaction ID']
  },
  {
    id: 'income-tax-refund',
    title: 'Income Tax Refund Delayed',
    category: 'Finance & Taxation',
    icon: '💰',
    ministry: 'Ministry of Finance',
    template: `Subject: Delay in Income Tax Refund — PAN [YOUR_PAN] / AY [ASSESSMENT_YEAR]

Respected Sir/Madam,

I am writing regarding the inordinate delay in the processing and disbursement of my income tax refund for Assessment Year [ASSESSMENT_YEAR]. As per the intimation under Section 143(1) of the Income Tax Act, 1961, a refund of ₹[AMOUNT] was determined in my favour. However, despite the processing being completed over [NUMBER] months ago, the refund has not been credited to my pre-validated bank account.

My PAN is [YOUR_PAN] and the ITR was filed on [DATE] with acknowledgment number [YOUR_ACK_NUMBER]. The refund status on the Income Tax e-filing portal shows [CURRENT_STATUS].

I request the Centralized Processing Centre (CPC), Bengaluru, to expedite the refund and ensure credit to my bank account at the earliest.

Yours faithfully,
[Your Name]
PAN: [YOUR_PAN]
[Your Phone Number]`,
    documents: ['ITR acknowledgment', 'Section 143(1) intimation', 'PAN Card', 'Bank account pre-validation proof', 'Screenshot of refund status from IT portal']
  }
]
