exports.TEMPLATES = [
  {
    id: 'legal-notice',
    name: 'Legal Notice',
    description: 'Formal notice for breach of contract or recovery of dues.',
    requirements: {
      stampPaper: 'Not required (usually on letterhead)',
      notaryRequired: false,
      witnesses: 0
    },
    fields: [
      { key: 'senderName', label: 'Sender Name', type: 'text' },
      { key: 'senderAddress', label: 'Sender Address', type: 'text' },
      { key: 'recipientName', label: 'Recipient Name', type: 'text' },
      { key: 'recipientAddress', label: 'Recipient Address', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'amount', label: 'Amount Claimed (₹)', type: 'number' },
      { key: 'reason', label: 'Reason for Notice', type: 'textarea' },
      { key: 'date', label: 'Date', type: 'date' }
    ],
    content: `
      LEGAL NOTICE
      
      Date: {{date}}

      To,
      {{recipientName}}
      {{recipientAddress}}

      From,
      {{senderName}}
      {{senderAddress}}

      Subject: {{subject}}

      Dear Sir/Madam,

      Under instruction and authority from my client {{senderName}}, I strictly serve you this legal notice:

      1. That you entered into an agreement/transaction with my client regarding {{reason}}.
      2. That despite repeated reminders, you have failed to pay the outstanding dues of ₹{{amount}}.
      3. That my client is legally entitled to recover the said amount along with interest.

      I hereby call upon you to pay the sum of ₹{{amount}} within 15 days of receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you at your risk and cost.

      Yours faithfully,
      
      Advocate Signature
      (On behalf of {{senderName}})
    `
  },
  {
    id: 'rent-agreement',
    name: 'Rent Agreement',
    description: 'Standard residential rental agreement.',
    requirements: {
      stampPaper: '₹100 - ₹500 (State dependent)',
      notaryRequired: true,
      witnesses: 2
    },
    fields: [
      { key: 'landlordName', label: 'Landlord Name', type: 'text' },
      { key: 'tenantName', label: 'Tenant Name', type: 'text' },
      { key: 'propertyAddress', label: 'Property Address', type: 'textarea' },
      { key: 'monthlyRent', label: 'Monthly Rent (₹)', type: 'number' },
      { key: 'deposit', label: 'Security Deposit (₹)', type: 'number' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'duration', label: 'Duration (Months)', type: 'number' }
    ],
    content: `
      RENTAL AGREEMENT

      This Rent Agreement is made on this day {{startDate}} between:

      LANDLORD: {{landlordName}}, residing at [Landlord Address]
      AND
      TENANT: {{tenantName}}, residing at [Tenant Permanent Address]

      WHEREAS the Landlord is the owner of the property situated at {{propertyAddress}}.

      NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

      1. The Landlord agrees to let out the property to the Tenant for a period of {{duration}} months starting from {{startDate}}.
      2. The Tenant shall pay a monthly rent of ₹{{monthlyRent}} on or before the 5th of every month.
      3. The Tenant has paid a security deposit of ₹{{deposit}}, which is refundable at the time of vacating the premises.
      4. The Tenant shall use the premises for residential purposes only.
      5. Electricity and water charges shall be paid by the Tenant separately.

      IN WITNESS WHEREOF, the parties have signed this agreement on the date mentioned above.

      __________________                   __________________
      (Landlord)                           (Tenant)
    `
  },
  {
    id: 'general-affidavit',
    name: 'General Affidavit',
    description: 'Sworn statement of facts.',
    requirements: {
      stampPaper: '₹10 - ₹100',
      notaryRequired: true,
      witnesses: 0
    },
    fields: [
      { key: 'deponentName', label: 'Deponent Name', type: 'text' },
      { key: 'age', label: 'Age', type: 'number' },
      { key: 'fatherName', label: 'Father\'s Name', type: 'text' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'statement', label: 'Statement of Fact', type: 'textarea' },
      { key: 'purpose', label: 'Purpose', type: 'text' }
    ],
    content: `
      AFFIDAVIT

      I, {{deponentName}}, S/o {{fatherName}}, aged about {{age}} years, residing at {{address}}, do hereby solemnly affirm and declare as under:

      1. That I am a citizen of India and residing at the above-mentioned address.
      2. That {{statement}}.
      3. That this affidavit is required for the purpose of {{purpose}}.
      4. That the contents of this affidavit are true and correct to the best of my knowledge and belief, and nothing has been concealed therein.

      DEPONENT

      VERIFICATION
      Verified at [Place] on this [Date], that the contents of the above affidavit are true and correct.

      DEPONENT
    `
  },
  {
    id: 'rti-application',
    name: 'RTI Application',
    description: 'Application under Right to Information Act, 2005.',
    requirements: {
      stampPaper: 'Not required (₹10 Court Fee Stamp or IPO)',
      notaryRequired: false,
      witnesses: 0
    },
    fields: [
      { key: 'applicantName', label: 'Applicant Name', type: 'text' },
      { key: 'applicantAddress', label: 'Full Address', type: 'textarea' },
      { key: 'department', label: 'Department / Authority', type: 'text' },
      { key: 'informationNeeded', label: 'Information Required', type: 'textarea' },
      { key: 'period', label: 'Time Period', type: 'text' }
    ],
    content: `
      FORM 'A'
      See Rule 3(1)
      Application for Information under Section 6(1) of the Act

      To,
      The Public Information Officer,
      {{department}}

      1. Full Name of Applicant: {{applicantName}}
      2. Address: {{applicantAddress}}
      3. Particulars of Information required:
         a) Subject matter of Information: {{informationNeeded}}
         b) The period to which information relates: {{period}}
         c) Description of Information required: As stated above.
      
      4. I state that the information sought does not fall within the exemptions contained in Section 8 of the Act.
      5. I have deposited the application fee of ₹10 via [Mode of Payment].

      Place: [Place]
      Date: [Date]

      Signature of Applicant
    `
  },
  {
    id: 'consumer-complaint',
    name: 'Consumer Complaint',
    description: 'Complaint for District Consumer Disputes Redressal Forum.',
    requirements: {
      stampPaper: 'Not required (Court Fee applies based on claim value)',
      notaryRequired: true,
      witnesses: 0
    },
    fields: [
      { key: 'complainantName', label: 'Complainant Name', type: 'text' },
      { key: 'oppositeParty', label: 'Opposite Party (Company/Shop)', type: 'text' },
      { key: 'complaintDetails', label: 'Details of Grievance', type: 'textarea' },
      { key: 'claimAmount', label: 'Total Claim Amount (₹)', type: 'number' },
      { key: 'reliefSought', label: 'Relief Sought (Refund/Replacement/Compensation)', type: 'textarea' }
    ],
    content: `
      BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL FORUM AT [CITY]
      
      Complaint No. _______ of 20___
      
      IN THE MATTER OF:
      {{complainantName}}
      ... COMPLAINANT
      
      VERSUS
      
      {{oppositeParty}}
      ... OPPOSITE PARTY
      
      COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019
      
      1. That the complainant purchased/availed services from the Opposite Party regarding {{complaintDetails}}.
      2. That the Opposite Party has committed Deficiency in Service / Unfair Trade Practice.
      3. That the complainant suffered mental agony and financial loss.
      
      PRAYER:
      It is most respectfully prayed that this Hon'ble Forum may be pleased to:
      a) Direct the Opposite Party to pay ₹{{claimAmount}} to the complainant.
      b) Direct the Opposite Party to {{reliefSought}}.
      c) Any other relief that the Forum deems fit.
      
      COMPLAINANT
      
      VERIFICATION:
      Verified at [City] on this [Date], that the contents of the above complaint are true to my knowledge.
      
      COMPLAINANT
    `
  }
];

