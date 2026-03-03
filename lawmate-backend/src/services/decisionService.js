/**
 * decisionService.js
 * Comprehensive rule-based engine for immediate legal guidance.
 * Based on Constitution of India, IPC, CrPC, and major Indian Acts.
 */

const RULES = {
  criminal: {
    theft: {
      legalNature: 'Criminal Offense (IPC)',
      severity: 'Medium',
      relevantActs: ['IPC Section 378 (Theft)', 'IPC Section 379 (Punishment for Theft)', 'IPC Section 380 (Theft in dwelling house)'],
      recommendedAction: ['File an FIR at the nearest police station immediately.', 'Obtain a copy of the FIR.', 'Gather evidence (CCTV, witnesses).'],
      estimatedTime: '6 months - 2 years',
      estimatedCost: '₹10,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Recovering stolen property and creating a legal record is critical for insurance and security.', complexity: 'Medium' },
      nextSteps: ['Consult a Criminal Lawyer', 'Apply for Bail (if accused)']
    },
    assault: {
      legalNature: 'Criminal Offense (Bodily Harm)',
      severity: 'High',
      relevantActs: ['IPC Section 323 (Voluntarily causing hurt)', 'IPC Section 324 (Hurt by dangerous weapons)', 'IPC Section 325 (Grievous hurt)'],
      recommendedAction: ['Get a medical examination (MLC) done immediately.', 'File an FIR with the medical report.', 'Take pictures of injuries.'],
      estimatedTime: '1 - 3 years',
      estimatedCost: '₹20,000 - ₹1,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'High severity bodily harm requires legal protection to prevent further escalation.', complexity: 'High' },
      nextSteps: ['Contact a Criminal Defense Lawyer']
    },
    fraud: {
      legalNature: 'Criminal Offense (Cheating & Fraud)',
      severity: 'High',
      relevantActs: ['IPC Section 415 (Cheating)', 'IPC Section 420 (Cheating and dishonestly inducing delivery of property)', 'IPC Section 468 (Forgery)'],
      recommendedAction: ['Collect all documentary evidence of fraud.', 'File an FIR under Section 420 IPC.', 'Inform your bank if financial fraud.'],
      estimatedTime: '1 - 4 years',
      estimatedCost: '₹25,000 - ₹1,50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Fraud cases need immediate reporting to freeze assets and prevent further loss.', complexity: 'High' },
      nextSteps: ['File FIR', 'Consult Criminal Lawyer', 'Approach Economic Offences Wing']
    },
    drug: {
      legalNature: 'Criminal Offense (Narcotic Substances)',
      severity: 'High',
      relevantActs: ['NDPS Act, 1985 (Narcotic Drugs and Psychotropic Substances)', 'IPC Section 328'],
      recommendedAction: ['Do not destroy any evidence.', 'Consult a criminal lawyer immediately.', 'Apply for bail at the earliest if arrested.'],
      estimatedTime: '1 - 5 years',
      estimatedCost: '₹50,000 - ₹3,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'NDPS cases carry severe penalties including imprisonment; immediate legal defense is essential.', complexity: 'Very High' },
      nextSteps: ['Hire Criminal Lawyer', 'Apply for Bail']
    },
    murder: {
      legalNature: 'Criminal Offense (Homicide)',
      severity: 'Critical',
      relevantActs: ['IPC Section 299 (Culpable homicide)', 'IPC Section 300 (Murder)', 'IPC Section 302 (Punishment for murder)', 'IPC Section 304 (Culpable homicide not amounting to murder)'],
      recommendedAction: ['Contact a senior criminal lawyer immediately.', 'Do not make any statements to police without lawyer.', 'Apply for bail if applicable.'],
      estimatedTime: '2 - 10 years',
      estimatedCost: '₹2,00,000 - ₹20,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Life imprisonment or death penalty possible; expert legal defense is mandatory.', complexity: 'Very High' },
      nextSteps: ['Engage Senior Criminal Advocate', 'Bail Application']
    },
    kidnapping: {
      legalNature: 'Criminal Offense (Abduction)',
      severity: 'Critical',
      relevantActs: ['IPC Section 359 (Kidnapping)', 'IPC Section 363 (Punishment for kidnapping)', 'IPC Section 364 (Kidnapping for ransom)'],
      recommendedAction: ['Report to police immediately (call 100).', 'File FIR without delay.', 'Provide photographs and last known location.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹30,000 - ₹2,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Time-sensitive; police intervention is critical for victim safety.', complexity: 'High' },
      nextSteps: ['File FIR', 'Contact Anti-Kidnapping Cell']
    },
    defamation: {
      legalNature: 'Criminal/Civil Offense (Reputation)',
      severity: 'Low',
      relevantActs: ['IPC Section 499 (Defamation)', 'IPC Section 500 (Punishment for defamation)'],
      recommendedAction: ['Collect evidence of defamatory statements.', 'Send a legal notice demanding retraction.', 'File a criminal complaint or civil suit.'],
      estimatedTime: '6 months - 2 years',
      estimatedCost: '₹15,000 - ₹60,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Consider if the defamation caused measurable damage to reputation or livelihood.', complexity: 'Medium' },
      nextSteps: ['Send Legal Notice', 'File Complaint']
    },
    arms: {
      legalNature: 'Criminal Offense (Illegal Arms)',
      severity: 'High',
      relevantActs: ['Arms Act, 1959', 'IPC Section 307 (Attempt to murder with weapon)', 'Explosive Substances Act, 1908'],
      recommendedAction: ['Do not tamper with evidence.', 'Consult criminal lawyer immediately.', 'Apply for bail.'],
      estimatedTime: '1 - 5 years',
      estimatedCost: '₹30,000 - ₹2,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Arms Act offenses are non-bailable in many cases; immediate legal defense is crucial.', complexity: 'High' },
      nextSteps: ['Hire Criminal Lawyer', 'Bail Application']
    },
    rioting: {
      legalNature: 'Criminal Offense (Rioting / Unlawful Assembly)',
      severity: 'High',
      relevantActs: ['IPC Section 141 (Unlawful assembly)', 'IPC Section 147 (Rioting)', 'IPC Section 148 (Rioting with deadly weapon)', 'IPC Section 149 (Common object)'],
      recommendedAction: ['File FIR if victim.', 'If accused, consult lawyer immediately.', 'Gather CCTV/witness evidence.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹20,000 - ₹1,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Section 149 makes all members of unlawful assembly liable; individual defense is important.', complexity: 'High' },
      nextSteps: ['File FIR', 'Criminal Lawyer']
    },
    dowry_death: {
      legalNature: 'Criminal Offense (Dowry Death)',
      severity: 'Critical',
      relevantActs: ['IPC Section 304B (Dowry death)', 'Dowry Prohibition Act, 1961', 'IPC Section 498A (Cruelty by husband)', 'Indian Evidence Act Section 113B'],
      recommendedAction: ['File FIR immediately.', 'Preserve all evidence of dowry demands.', 'Contact Women Helpline 181.'],
      estimatedTime: '2 - 7 years',
      estimatedCost: '₹25,000 - ₹2,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Dowry death carries minimum 7 years imprisonment; burden of proof shifts to accused under Section 113B Evidence Act.', complexity: 'High' },
      nextSteps: ['File FIR', 'Women Commission Complaint']
    },
    sc_st_atrocity: {
      legalNature: 'Criminal Offense (Caste-Based Atrocity)',
      severity: 'High',
      relevantActs: ['SC/ST (Prevention of Atrocities) Act, 1989', 'SC/ST (Prevention of Atrocities) Amendment Act, 2015', 'Article 17 Constitution (Abolition of Untouchability)'],
      recommendedAction: ['File FIR under SC/ST Act at nearest police station.', 'Contact National Commission for SC/ST.', 'FIR must be registered without preliminary inquiry.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹10,000 - ₹50,000 (free legal aid available)',
      worthItAnalysis: { status: 'Yes', rationale: 'SC/ST Act provides special protections, compensation, and fast-track courts.', complexity: 'Medium' },
      nextSteps: ['File FIR under SC/ST Act', 'National Commission Complaint']
    },
    forgery: {
      legalNature: 'Criminal Offense (Forgery & Counterfeiting)',
      severity: 'Medium',
      relevantActs: ['IPC Section 463 (Forgery)', 'IPC Section 465 (Punishment for forgery)', 'IPC Section 467 (Forgery of valuable security)', 'IPC Section 468 (Forgery for cheating)', 'Indian Evidence Act, 1872'],
      recommendedAction: ['Collect original and forged document copies.', 'File FIR with documentary evidence.', 'Get forensic document examination done.'],
      estimatedTime: '1 - 4 years',
      estimatedCost: '₹15,000 - ₹75,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Forgery of valuable security (Sec 467) is non-bailable with up to life imprisonment.', complexity: 'Medium' },
      nextSteps: ['File FIR', 'Forensic Examination']
    },
    default: {
      legalNature: 'General Criminal Matter',
      severity: 'Medium',
      relevantActs: ['Indian Penal Code (IPC)', 'Code of Criminal Procedure (CrPC)'],
      recommendedAction: ['Report to the Police.', 'Consult a Lawyer.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹15,000 - ₹1,00,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Depending on the specific offense, police reporting is usually mandatory.', complexity: 'Medium' },
      nextSteps: ['Legal Consultation']
    }
  },

  civil: {
    contract: {
      legalNature: 'Civil Dispute (Breach of Contract)',
      severity: 'Low',
      relevantActs: ['Indian Contract Act, 1872', 'Specific Relief Act, 1963'],
      recommendedAction: ['Send a Legal Notice for breach of contract.', 'Review the contract terms.', 'Attempt mutual settlement/mediation.'],
      estimatedTime: '1 - 3 years',
      estimatedCost: '₹15,000 - ₹60,000',
      worthItAnalysis: { status: 'Yes', rationale: 'If contract value is significant, legal enforcement is the only way to recover losses.', complexity: 'Medium' },
      nextSteps: ['Draft Legal Notice', 'File Civil Suit']
    },
    tort: {
      legalNature: 'Civil Wrong (Personal Injury / Negligence)',
      severity: 'Medium',
      relevantActs: ['Law of Torts', 'Motor Vehicles Act, 1988 (for accident claims)', 'Consumer Protection Act, 2019'],
      recommendedAction: ['Document injuries with medical reports.', 'Collect evidence of negligence.', 'File a compensation claim.'],
      estimatedTime: '1 - 4 years',
      estimatedCost: '₹20,000 - ₹1,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Compensation for injuries and losses is a legal right; documentation is key.', complexity: 'Medium' },
      nextSteps: ['Medical Documentation', 'File Compensation Claim']
    },
    debt: {
      legalNature: 'Civil Dispute (Debt Recovery)',
      severity: 'Medium',
      relevantActs: ['Recovery of Debts and Bankruptcy Act, 1993', 'Negotiable Instruments Act, 1881 (Section 138 - Cheque Bounce)', 'Indian Contract Act, 1872'],
      recommendedAction: ['Send a legal demand notice.', 'If cheque bounce, file case under Section 138 NI Act.', 'Approach Debt Recovery Tribunal for large amounts.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹10,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Cheque bounce cases have high conviction rates. Debt recovery is enforceable through courts.', complexity: 'Medium' },
      nextSteps: ['Send Legal Notice', 'File Section 138 Case', 'Approach DRT']
    },
    consumer: {
      legalNature: 'Consumer Dispute',
      severity: 'Low',
      relevantActs: ['Consumer Protection Act, 2019', 'Bureau of Indian Standards Act'],
      recommendedAction: ['File complaint on consumerhelpline.gov.in.', 'Gather bills, receipts, and warranty documents.', 'File complaint in Consumer Forum/Commission.'],
      estimatedTime: '3 months - 1.5 years',
      estimatedCost: '₹2,000 - ₹15,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Consumer forums are fast, affordable, and consumer-friendly. No lawyer required for filing.', complexity: 'Low' },
      nextSteps: ['File Consumer Complaint Online', 'Approach District Consumer Forum']
    },
    default: {
      legalNature: 'General Civil Dispute',
      severity: 'Low',
      relevantActs: ['Code of Civil Procedure (CPC)', 'Limitation Act, 1963'],
      recommendedAction: ['Send a Legal Notice.', 'Attempt mediation before litigation.'],
      estimatedTime: '2 - 5 years',
      estimatedCost: '₹20,000 - ₹1,00,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Civil cases can be long; assess if the dispute amount justifies the time.', complexity: 'High' },
      nextSteps: ['Consult Lawyer']
    }
  },

  family: {
    divorce: {
      legalNature: 'Family Law / Matrimonial Dispute',
      severity: 'Medium',
      relevantActs: ['Hindu Marriage Act, 1955', 'Special Marriage Act, 1954', 'Muslim Personal Law (Shariat) Application Act, 1937', 'Indian Divorce Act, 1869'],
      recommendedAction: ['Explore counseling or mediation.', 'Decide on Mutual Consent vs. Contested Divorce.', 'Collect marriage certificate and evidence.'],
      estimatedTime: '6 months (Mutual) - 3+ years (Contested)',
      estimatedCost: '₹25,000 - ₹2,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Legal formalization of separation is necessary for property, alimony, and remarriage.', complexity: 'High' },
      nextSteps: ['File Divorce Petition', 'Consult Family Lawyer']
    },
    custody: {
      legalNature: 'Family Law (Child Custody)',
      severity: 'High',
      relevantActs: ['Hindu Minority and Guardianship Act, 1956', 'Guardians and Wards Act, 1890', 'Juvenile Justice Act, 2015'],
      recommendedAction: ['Document your involvement in child\'s upbringing.', 'File custody petition in Family Court.', 'Ensure child\'s welfare is prioritized.'],
      estimatedTime: '6 months - 2 years',
      estimatedCost: '₹30,000 - ₹1,50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Child\'s best interest is paramount; courts prioritize welfare over parental preference.', complexity: 'High' },
      nextSteps: ['File Custody Petition', 'Family Court Mediation']
    },
    alimony: {
      legalNature: 'Family Law (Maintenance / Alimony)',
      severity: 'Medium',
      relevantActs: ['Section 125 CrPC (Maintenance)', 'Hindu Adoptions and Maintenance Act, 1956', 'Muslim Women (Protection of Rights on Divorce) Act, 1986'],
      recommendedAction: ['Calculate reasonable maintenance amount.', 'File maintenance petition under Section 125 CrPC.', 'Gather income proof of spouse.'],
      estimatedTime: '3 months - 1 year',
      estimatedCost: '₹15,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Maintenance is a legal right; courts can enforce payment through attachment of salary.', complexity: 'Medium' },
      nextSteps: ['File Maintenance Petition', 'Income Documentation']
    },
    dv: {
      legalNature: 'Criminal/Civil (Domestic Violence)',
      severity: 'High',
      relevantActs: ['Protection of Women from Domestic Violence Act, 2005', 'IPC Section 498A (Cruelty by husband)', 'Dowry Prohibition Act, 1961'],
      recommendedAction: ['Ensure personal safety first  -  call Women Helpline 181.', 'File complaint with Protection Officer or Police.', 'Apply for Protection Order from Magistrate.'],
      estimatedTime: '2 months - 1 year',
      estimatedCost: '₹5,000 - ₹30,000 (Legal Aid available)',
      worthItAnalysis: { status: 'Yes', rationale: 'Safety is non-negotiable. Free legal aid is available under NALSA for DV victims.', complexity: 'Medium' },
      nextSteps: ['Call Women Helpline 181', 'File DV Complaint', 'Apply Protection Order']
    },
    default: {
      legalNature: 'Family Matter',
      severity: 'Medium',
      relevantActs: ['Family Courts Act, 1984', 'Hindu Succession Act, 1956'],
      recommendedAction: ['Seek Family Counseling.', 'Explore mediation before litigation.'],
      estimatedTime: '6 months - 2 years',
      estimatedCost: '₹15,000 - ₹75,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Mediation is often more effective than direct litigation in family matters.', complexity: 'Medium' },
      nextSteps: ['Family Court Consultation']
    }
  },

  corporate: {
    incorporation: {
      legalNature: 'Corporate Law (Company Formation)',
      severity: 'Low',
      relevantActs: ['Companies Act, 2013', 'LLP Act, 2008', 'Partnership Act, 1932'],
      recommendedAction: ['Decide company type (Pvt Ltd / LLP / OPC).', 'Obtain DSC and DIN for directors.', 'File incorporation documents on MCA portal.'],
      estimatedTime: '15 - 30 days',
      estimatedCost: '₹5,000 - ₹25,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Legal entity provides limited liability protection and credibility.', complexity: 'Low' },
      nextSteps: ['Obtain DSC/DIN', 'File on MCA Portal']
    },
    compliance: {
      legalNature: 'Corporate Law (Regulatory Compliance)',
      severity: 'Medium',
      relevantActs: ['Companies Act, 2013', 'SEBI Act, 1992', 'RBI Act, 1934', 'FEMA, 1999'],
      recommendedAction: ['Conduct a compliance audit.', 'File annual returns (ROC) on time.', 'Ensure GST, TDS, and other tax compliance.'],
      estimatedTime: 'Ongoing',
      estimatedCost: '₹10,000 - ₹1,00,000 per year',
      worthItAnalysis: { status: 'Yes', rationale: 'Non-compliance leads to heavy penalties, director disqualification, and company strike-off.', complexity: 'Medium' },
      nextSteps: ['Hire Company Secretary', 'Compliance Audit']
    },
    ip: {
      legalNature: 'Intellectual Property Rights',
      severity: 'Medium',
      relevantActs: ['Patents Act, 1970', 'Trade Marks Act, 1999', 'Copyright Act, 1957', 'Designs Act, 2000'],
      recommendedAction: ['Identify type of IP (patent/trademark/copyright).', 'File application with appropriate office.', 'Send cease-and-desist if infringement found.'],
      estimatedTime: '6 months - 3 years (registration)',
      estimatedCost: '₹10,000 - ₹1,50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'IP registration gives legal monopoly and is enforceable in court for infringement damages.', complexity: 'Medium' },
      nextSteps: ['File IP Application', 'IP Lawyer Consultation']
    },
    merger: {
      legalNature: 'Corporate Law (M&A)',
      severity: 'High',
      relevantActs: ['Companies Act, 2013 (Sections 230-240)', 'SEBI Takeover Regulations', 'Competition Act, 2002'],
      recommendedAction: ['Conduct due diligence of target company.', 'Obtain board and shareholder approvals.', 'File application with NCLT.'],
      estimatedTime: '6 months - 2 years',
      estimatedCost: '₹2,00,000 - ₹50,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'M&A requires strict legal compliance; non-compliance can void the transaction.', complexity: 'Very High' },
      nextSteps: ['Due Diligence', 'NCLT Application']
    },
    ibc: {
      legalNature: 'Corporate Law (Insolvency & Bankruptcy)',
      severity: 'High',
      relevantActs: ['Insolvency and Bankruptcy Code, 2016 (IBC)', 'Companies Act, 2013', 'SARFAESI Act, 2002'],
      recommendedAction: ['Determine if eligible under IBC (minimum ₹1 crore default).', 'File application before NCLT.', 'Appoint Insolvency Resolution Professional (IRP).'],
      estimatedTime: '6 months - 2 years',
      estimatedCost: '₹1,00,000 - ₹10,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'IBC provides time-bound resolution (330 days max); creditors can recover dues efficiently.', complexity: 'Very High' },
      nextSteps: ['File Application before NCLT', 'Appoint IRP']
    },
    arbitration: {
      legalNature: 'Dispute Resolution (Arbitration)',
      severity: 'Medium',
      relevantActs: ['Arbitration and Conciliation Act, 1996', 'Indian Contract Act, 1872', 'Specific Relief Act, 1963'],
      recommendedAction: ['Check if arbitration clause exists in contract.', 'Send notice invoking arbitration.', 'Appoint arbitrator as per agreement.'],
      estimatedTime: '6 months - 18 months',
      estimatedCost: '₹50,000 - ₹5,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Arbitration is faster than court litigation; award is enforceable as court decree.', complexity: 'Medium' },
      nextSteps: ['Invoke Arbitration Clause', 'Appoint Arbitrator']
    },
    fema: {
      legalNature: 'Corporate/Financial Law (Foreign Exchange)',
      severity: 'High',
      relevantActs: ['Foreign Exchange Management Act, 1999 (FEMA)', 'RBI Act, 1934', 'Prevention of Money Laundering Act, 2002'],
      recommendedAction: ['Consult FEMA specialist immediately.', 'File compounding application with RBI for violations.', 'Ensure FEMA compliance for all foreign transactions.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹50,000 - ₹5,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'FEMA violations carry heavy penalties (up to 3x the amount involved); early compounding reduces penalties.', complexity: 'High' },
      nextSteps: ['FEMA Specialist', 'RBI Compounding Application']
    },
    default: {
      legalNature: 'General Corporate Matter',
      severity: 'Medium',
      relevantActs: ['Companies Act, 2013', 'Indian Contract Act, 1872'],
      recommendedAction: ['Consult a Corporate Lawyer.', 'Review company documents and agreements.'],
      estimatedTime: '1 - 6 months',
      estimatedCost: '₹15,000 - ₹1,00,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Corporate matters vary widely; early legal advice prevents costly mistakes.', complexity: 'Medium' },
      nextSteps: ['Corporate Lawyer Consultation']
    }
  },

  property: {
    tenant: {
      legalNature: 'Property Law (Tenancy Dispute)',
      severity: 'Medium',
      relevantActs: ['Rent Control Act (State-specific)', 'Transfer of Property Act, 1882', 'Indian Contract Act, 1872'],
      recommendedAction: ['Review the Rent Agreement.', 'Send a formal notice for eviction or rent recovery.', 'File a petition with the Rent Controller.'],
      estimatedTime: '6 months - 2 years',
      estimatedCost: '₹10,000 - ₹40,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Protecting property possession or recovering rent is worth the legal procedure.', complexity: 'Medium' },
      nextSteps: ['Check Rent Agreement', 'Legal Notice']
    },
    ownership: {
      legalNature: 'Civil Dispute (Title/Ownership)',
      severity: 'High',
      relevantActs: ['Transfer of Property Act, 1882', 'Registration Act, 1908', 'Indian Succession Act, 1925'],
      recommendedAction: ['Verify title deeds and mutation records.', 'File a Suit for Declaration or Partition.', 'Obtain an injunction if possession is threatened.'],
      estimatedTime: '3 - 10 years',
      estimatedCost: '₹50,000 - ₹5,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Real estate is high value; legal title is essential for sale or development.', complexity: 'Very High' },
      nextSteps: ['Title Search', 'Hire Civil Lawyer']
    },
    transfer: {
      legalNature: 'Property Law (Sale/Transfer)',
      severity: 'Low',
      relevantActs: ['Transfer of Property Act, 1882', 'Registration Act, 1908', 'Indian Stamp Act, 1899'],
      recommendedAction: ['Verify clear title and encumbrance certificate.', 'Execute sale deed on proper stamp paper.', 'Register the deed at Sub-Registrar office.'],
      estimatedTime: '1 - 3 months',
      estimatedCost: '₹10,000 - ₹50,000 (excluding stamp duty)',
      worthItAnalysis: { status: 'Yes', rationale: 'Proper registration prevents future disputes and ensures legal ownership.', complexity: 'Low' },
      nextSteps: ['Title Verification', 'Draft Sale Deed']
    },
    rera: {
      legalNature: 'Real Estate Regulatory (RERA)',
      severity: 'Medium',
      relevantActs: ['Real Estate (Regulation and Development) Act, 2016 (RERA)', 'Consumer Protection Act, 2019'],
      recommendedAction: ['Check builder RERA registration on state RERA website.', 'File complaint on RERA portal for delays/defects.', 'Claim interest on delayed possession.'],
      estimatedTime: '3 - 12 months',
      estimatedCost: '₹5,000 - ₹25,000',
      worthItAnalysis: { status: 'Yes', rationale: 'RERA is very buyer-friendly; builders face heavy penalties for non-compliance and delays.', complexity: 'Low' },
      nextSteps: ['File RERA Complaint Online', 'Claim Refund/Interest']
    },
    land_acquisition: {
      legalNature: 'Property Law (Government Land Acquisition)',
      severity: 'High',
      relevantActs: ['Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013', 'Article 300A Constitution (Right to Property)', 'Land Acquisition Act, 1894 (old, still referenced)'],
      recommendedAction: ['Verify if proper notification was issued under the Act.', 'Check if compensation is fair (must be at least 2-4x market value).', 'File objection within 60 days of notification.'],
      estimatedTime: '1 - 5 years',
      estimatedCost: '₹25,000 - ₹2,00,000',
      worthItAnalysis: { status: 'Yes', rationale: '2013 Act mandates fair compensation and rehabilitation; challenge if undervalued.', complexity: 'High' },
      nextSteps: ['File Objection', 'Challenge Compensation in Court']
    },
    cooperative_society: {
      legalNature: 'Property/Civil Law (Housing Society Dispute)',
      severity: 'Medium',
      relevantActs: ['Cooperative Societies Act (State-specific)', 'Maharashtra Ownership Flats Act, 1963', 'RERA Act, 2016'],
      recommendedAction: ['File complaint with Registrar of Cooperative Societies.', 'Attend general body meetings and raise issues.', 'Approach Cooperative Court/Tribunal.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹10,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Cooperative courts provide speedy resolution for society disputes.', complexity: 'Medium' },
      nextSteps: ['Registrar Complaint', 'Cooperative Court']
    },
    default: {
      legalNature: 'Property Matter',
      severity: 'Medium',
      relevantActs: ['Transfer of Property Act, 1882', 'Land Revenue Code'],
      recommendedAction: ['Gather all property documents.', 'Consult a Real Estate expert.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹15,000 - ₹1,00,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Depends on the land value and evidence clarity.', complexity: 'High' },
      nextSteps: ['Property Lawyer Consultation']
    }
  },

  cyber: {
    hacking: {
      legalNature: 'Information Technology Act (Unauthorized Access)',
      severity: 'High',
      relevantActs: ['IT Act, 2000 Section 43 (Unauthorized access)', 'IT Act Section 66 (Hacking)', 'IT Act Section 72 (Breach of confidentiality)'],
      recommendedAction: ['Change all passwords immediately.', 'Report on cybercrime.gov.in.', 'Preserve evidence (screenshots, logs).'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹10,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Quick reporting can help trace the hacker and prevent data misuse.', complexity: 'Medium' },
      nextSteps: ['File Cyber Complaint', 'Secure Accounts']
    },
    harassment: {
      legalNature: 'Cyber Crime (Online Harassment / Stalking)',
      severity: 'High',
      relevantActs: ['IT Act Section 66A (struck down, but 67 applicable)', 'IT Act Section 67 (Publishing obscene material)', 'IPC Section 354D (Stalking)', 'IPC Section 509 (Word, gesture to insult modesty)'],
      recommendedAction: ['Screenshot and save all evidence.', 'Block the harasser on all platforms.', 'File complaint on cybercrime.gov.in and local police.'],
      estimatedTime: '3 months - 1.5 years',
      estimatedCost: '₹5,000 - ₹30,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Online harassment can escalate quickly; early reporting creates a legal record.', complexity: 'Medium' },
      nextSteps: ['File Cyber Complaint', 'Approach Women Cell (if applicable)']
    },
    fraud: {
      legalNature: 'Information Technology Act (Cyber Fraud)',
      severity: 'High',
      relevantActs: ['IT Act, 2000 Section 66D (Cheating by personation using computer)', 'IPC Section 420 (Cheating)', 'Payment and Settlement Systems Act, 2007'],
      recommendedAction: ['Report incident on cybercrime.gov.in immediately.', 'Block bank accounts/cards if financial fraud.', 'Save screenshots of fraudulent communication.'],
      estimatedTime: '3 months - 1.5 years',
      estimatedCost: '₹5,000 - ₹30,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Reporting is necessary to stop the fraud chain and attempt recovery via police bank-lien.', complexity: 'Low' },
      nextSteps: ['File Cyber Complaint', 'Notify Bank']
    },
    crypto: {
      legalNature: 'Financial Crime (Cryptocurrency Fraud)',
      severity: 'High',
      relevantActs: ['IT Act, 2000', 'IPC Section 420', 'PMLA (Prevention of Money Laundering Act), 2002'],
      recommendedAction: ['Report to cybercrime.gov.in and local police.', 'Contact the exchange platform\'s support.', 'Preserve all transaction records and wallet addresses.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹20,000 - ₹1,00,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Recovery in crypto fraud is difficult due to anonymity, but reporting helps investigation.', complexity: 'Very High' },
      nextSteps: ['File Cyber Complaint', 'Contact Exchange Support']
    },
    default: {
      legalNature: 'Cyber Law Matter',
      severity: 'Medium',
      relevantActs: ['Information Technology Act, 2000', 'IPC (relevant sections)'],
      recommendedAction: ['Protect your accounts.', 'File a report with Cyber Cell.'],
      estimatedTime: '3 months - 1.5 years',
      estimatedCost: '₹5,000 - ₹30,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Cyber crimes escalate; early reporting protects you from liability.', complexity: 'Medium' },
      nextSteps: ['Cyber Complaint']
    }
  },

  labor: {
    termination: {
      legalNature: 'Labor Law (Wrongful Termination)',
      severity: 'High',
      relevantActs: ['Industrial Disputes Act, 1947', 'Shops and Establishments Act (State-specific)', 'Standing Orders Act, 1946'],
      recommendedAction: ['Obtain termination letter and review grounds.', 'File complaint with Labor Commissioner.', 'Challenge termination in Labor Court if unfair.'],
      estimatedTime: '6 months - 2 years',
      estimatedCost: '₹15,000 - ₹60,000',
      worthItAnalysis: { status: 'Yes', rationale: 'If termination violates procedure, reinstatement with back wages is possible.', complexity: 'Medium' },
      nextSteps: ['File Labor Complaint', 'Approach Labor Court']
    },
    wages: {
      legalNature: 'Labor Law (Wage Dispute)',
      severity: 'Medium',
      relevantActs: ['Payment of Wages Act, 1936', 'Minimum Wages Act, 1948', 'Industrial Disputes Act, 1947'],
      recommendedAction: ['Send a legal notice to the employer.', 'Approach the Labor Commissioner.', 'File a claim in Labor Court.'],
      estimatedTime: '4 months - 1 year',
      estimatedCost: '₹5,000 - ₹20,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Labor courts are relatively faster and worker-friendly.', complexity: 'Low' },
      nextSteps: ['Collect Salary Slips', 'Labor Helpdesk']
    },
    harassment_work: {
      legalNature: 'Labor Law (Workplace Harassment)',
      severity: 'High',
      relevantActs: ['Sexual Harassment of Women at Workplace (POSH) Act, 2013', 'IPC Section 354A (Sexual harassment)', 'Equal Remuneration Act, 1976'],
      recommendedAction: ['Report to Internal Complaints Committee (ICC).', 'File written complaint within 3 months of incident.', 'Approach Local Complaints Committee if no ICC exists.'],
      estimatedTime: '3 months - 1 year',
      estimatedCost: '₹10,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'POSH Act mandates every workplace to have ICC; non-compliance is punishable.', complexity: 'Medium' },
      nextSteps: ['Report to ICC', 'File Written Complaint']
    },
    default: {
      legalNature: 'Employment Matter',
      severity: 'Low',
      relevantActs: ['Shops and Establishments Act', 'Payment of Gratuity Act, 1972', 'Employees Provident Funds Act, 1952'],
      recommendedAction: ['Check your employment contract.', 'Talk to HR/Management.', 'Approach Labor Commissioner if unresolved.'],
      estimatedTime: '3 months - 1 year',
      estimatedCost: '₹5,000 - ₹25,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Try internal resolution before court.', complexity: 'Low' },
      nextSteps: ['Labor Commissioner Consultation']
    }
  },

  traffic: {
    accident: {
      legalNature: 'Motor Vehicle Offense (Road Accident)',
      severity: 'High',
      relevantActs: ['Motor Vehicles Act, 1988 (Section 134 - Duty after accident)', 'IPC Section 279 (Rash driving)', 'IPC Section 304A (Causing death by negligence)'],
      recommendedAction: ['Call ambulance (108) and police immediately.', 'Get medical examination done.', 'File FIR and obtain accident report.', 'Claim compensation from MACT (Motor Accident Claims Tribunal).'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹10,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'MACT provides compensation even without fault; insurance covers most claims.', complexity: 'Medium' },
      nextSteps: ['File FIR', 'MACT Claim', 'Insurance Claim']
    },
    challan: {
      legalNature: 'Traffic Violation (E-Challan)',
      severity: 'Low',
      relevantActs: ['Motor Vehicles (Amendment) Act, 2019', 'Motor Vehicles Act, 1988 (Sections 177-210)'],
      recommendedAction: ['Check challan details on parivahan.gov.in.', 'Pay fine online or contest in court.', 'Ensure documents (license, RC, insurance) are up to date.'],
      estimatedTime: '1 day - 1 month',
      estimatedCost: '₹500 - ₹25,000 (fines)',
      worthItAnalysis: { status: 'Maybe', rationale: 'If fine is unjust, contesting in court is an option but usually not cost-effective for minor fines.', complexity: 'Low' },
      nextSteps: ['Check Challan Online', 'Pay or Contest']
    },
    drunken_driving: {
      legalNature: 'Criminal Traffic Offense',
      severity: 'High',
      relevantActs: ['Motor Vehicles Act Section 185 (Drunken driving)', 'IPC Section 279', 'IPC Section 304A (if death caused)'],
      recommendedAction: ['Cooperate with police breathalyzer test.', 'Consult a lawyer immediately if arrested.', 'Apply for bail through lawyer.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹10,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Repeat offenses lead to license cancellation and imprisonment; legal defense is critical.', complexity: 'Medium' },
      nextSteps: ['Hire Lawyer', 'Bail Application']
    },
    license: {
      legalNature: 'Motor Vehicle Administration',
      severity: 'Low',
      relevantActs: ['Motor Vehicles Act, 1988 (Sections 3-14)', 'Central Motor Vehicle Rules, 1989'],
      recommendedAction: ['Apply online at parivahan.gov.in.', 'Visit RTO with required documents.', 'If license suspended, file appeal with Transport Authority.'],
      estimatedTime: '7 - 30 days (normal), 3-6 months (appeal)',
      estimatedCost: '₹200 - ₹5,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Valid license is mandatory; driving without one is a criminal offense.', complexity: 'Low' },
      nextSteps: ['Apply on Parivahan Portal', 'Visit RTO']
    },
    default: {
      legalNature: 'Traffic / Motor Vehicle Matter',
      severity: 'Low',
      relevantActs: ['Motor Vehicles Act, 1988', 'Motor Vehicles (Amendment) Act, 2019'],
      recommendedAction: ['Check parivahan.gov.in for online services.', 'Consult RTO for specific requirements.'],
      estimatedTime: '1 week - 3 months',
      estimatedCost: '₹500 - ₹10,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Most traffic matters can be resolved administratively without court.', complexity: 'Low' },
      nextSteps: ['Visit RTO', 'Check Online Portal']
    }
  },

  consumer: {
    defective_product: {
      legalNature: 'Consumer Dispute (Defective Product)',
      severity: 'Low',
      relevantActs: ['Consumer Protection Act, 2019', 'Sale of Goods Act, 1930', 'Bureau of Indian Standards Act, 2016'],
      recommendedAction: ['Keep the product, bill, and warranty card.', 'File complaint with seller/manufacturer first.', 'If unresolved, file complaint on consumerhelpline.gov.in.'],
      estimatedTime: '1 - 6 months',
      estimatedCost: '₹500 - ₹5,000 (nominal filing fee)',
      worthItAnalysis: { status: 'Yes', rationale: 'Consumer forums are fast, cheap, and very consumer-friendly. No lawyer needed.', complexity: 'Low' },
      nextSteps: ['File Consumer Complaint Online', 'District Consumer Forum']
    },
    service_deficiency: {
      legalNature: 'Consumer Dispute (Deficiency in Service)',
      severity: 'Low',
      relevantActs: ['Consumer Protection Act, 2019 (Section 2(11))', 'Insurance Regulatory and Development Authority Act (for insurance)', 'TRAI Act (for telecom)'],
      recommendedAction: ['Document the service deficiency with evidence.', 'File complaint with the service provider first.', 'Approach Consumer Forum if unresolved within 30 days.'],
      estimatedTime: '2 - 8 months',
      estimatedCost: '₹500 - ₹10,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Consumer complaints are resolved quickly and compensation can include mental agony damages.', complexity: 'Low' },
      nextSteps: ['Written Complaint to Provider', 'Consumer Forum']
    },
    ecommerce: {
      legalNature: 'Consumer Dispute (E-Commerce)',
      severity: 'Low',
      relevantActs: ['Consumer Protection Act, 2019', 'Consumer Protection (E-Commerce) Rules, 2020', 'IT Act, 2000'],
      recommendedAction: ['File complaint on the e-commerce platform first.', 'Escalate to consumerhelpline.gov.in.', 'File in Consumer Forum if refund/replacement denied.'],
      estimatedTime: '1 - 4 months',
      estimatedCost: '₹500 - ₹5,000',
      worthItAnalysis: { status: 'Yes', rationale: 'E-commerce complaints have high resolution rates with consumer forum intervention.', complexity: 'Low' },
      nextSteps: ['Platform Grievance Portal', 'Consumer Helpline']
    },
    banking: {
      legalNature: 'Consumer/Banking Dispute',
      severity: 'Medium',
      relevantActs: ['Consumer Protection Act, 2019', 'Banking Regulation Act, 1949', 'RBI Ombudsman Scheme, 2021'],
      recommendedAction: ['File complaint with bank\'s grievance cell.', 'If unresolved in 30 days, approach RBI Banking Ombudsman.', 'File consumer complaint for persistent issues.'],
      estimatedTime: '1 - 6 months',
      estimatedCost: '₹0 - ₹5,000 (Ombudsman is free)',
      worthItAnalysis: { status: 'Yes', rationale: 'RBI Ombudsman resolves banking complaints free of cost within 30 days.', complexity: 'Low' },
      nextSteps: ['Bank Grievance Cell', 'RBI Ombudsman']
    },
    default: {
      legalNature: 'Consumer Protection Matter',
      severity: 'Low',
      relevantActs: ['Consumer Protection Act, 2019'],
      recommendedAction: ['File complaint on consumerhelpline.gov.in.', 'Approach nearest Consumer Forum.'],
      estimatedTime: '1 - 6 months',
      estimatedCost: '₹500 - ₹10,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Consumer forums are accessible, affordable, and designed for quick resolution.', complexity: 'Low' },
      nextSteps: ['Consumer Helpline', 'District Consumer Forum']
    }
  },

  constitutional: {
    fundamental_rights: {
      legalNature: 'Constitutional Law (Fundamental Rights Violation)',
      severity: 'High',
      relevantActs: ['Constitution of India - Part III (Articles 14-32)', 'Article 14 (Right to Equality)', 'Article 19 (Freedom of Speech)', 'Article 21 (Right to Life and Liberty)'],
      recommendedAction: ['Document the rights violation with evidence.', 'File a Writ Petition under Article 32 (Supreme Court) or Article 226 (High Court).', 'Contact NHRC (National Human Rights Commission) if applicable.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹25,000 - ₹2,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Fundamental Rights are enforceable through courts; Supreme Court can issue writs for their protection.', complexity: 'High' },
      nextSteps: ['File Writ Petition', 'Contact NHRC']
    },
    rti: {
      legalNature: 'Constitutional Right (Right to Information)',
      severity: 'Low',
      relevantActs: ['Right to Information Act, 2005', 'Article 19(1)(a) Constitution of India'],
      recommendedAction: ['File RTI application with ₹10 fee to relevant PIO.', 'If no response in 30 days, file First Appeal.', 'File Second Appeal with Information Commission if still unresolved.'],
      estimatedTime: '30 days - 6 months',
      estimatedCost: '₹10 - ₹500',
      worthItAnalysis: { status: 'Yes', rationale: 'RTI is one of the most powerful tools for citizens. Almost free and highly effective.', complexity: 'Low' },
      nextSteps: ['File RTI Application', 'First Appeal if needed']
    },
    discrimination: {
      legalNature: 'Constitutional Law (Discrimination / Equality)',
      severity: 'High',
      relevantActs: ['Article 14 (Equality before law)', 'Article 15 (Prohibition of discrimination)', 'Article 16 (Equal opportunity in public employment)', 'SC/ST Prevention of Atrocities Act, 1989'],
      recommendedAction: ['Document discrimination with evidence and witnesses.', 'File complaint with National Commission for SC/ST/Minorities.', 'File FIR if atrocity involved.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹10,000 - ₹75,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Constitutional guarantee of equality is enforceable; special tribunals exist for caste-based discrimination.', complexity: 'Medium' },
      nextSteps: ['File Complaint with Commission', 'Writ Petition']
    },
    pil: {
      legalNature: 'Constitutional Law (Public Interest Litigation)',
      severity: 'Medium',
      relevantActs: ['Article 32 (Supreme Court)', 'Article 226 (High Court)', 'Constitution of India - Part III & IV'],
      recommendedAction: ['Draft PIL petition highlighting public interest issue.', 'File in High Court or Supreme Court.', 'Include evidence of how the issue affects the public at large.'],
      estimatedTime: '6 months - 5 years',
      estimatedCost: '₹5,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'PILs have shaped major government policies; courts take them seriously when genuine.', complexity: 'High' },
      nextSteps: ['Draft PIL', 'File in High Court']
    },
    reservation: {
      legalNature: 'Constitutional Law (Reservation / Affirmative Action)',
      severity: 'Medium',
      relevantActs: ['Article 15(4) & 15(5) (Reservation in education)', 'Article 16(4) (Reservation in employment)', 'Article 46 (Promotion of SC/ST interests)', '103rd Constitutional Amendment (EWS Reservation)'],
      recommendedAction: ['Verify reservation eligibility and obtain caste/income certificate.', 'Challenge denial through appropriate commission.', 'File writ petition if rights violated.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹10,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Reservation is a constitutional right; courts enforce it strictly.', complexity: 'Medium' },
      nextSteps: ['Obtain Certificate', 'File Writ Petition']
    },
    election: {
      legalNature: 'Constitutional Law (Election Dispute)',
      severity: 'Medium',
      relevantActs: ['Representation of the People Act, 1950 & 1951', 'Article 324-329 Constitution (Elections)', 'Election Commission of India Rules'],
      recommendedAction: ['File election petition in High Court within 45 days.', 'Report violations to Election Commission.', 'File FIR for electoral offenses.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹50,000 - ₹5,00,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Election petitions have strict timelines; success depends on strong evidence of malpractice.', complexity: 'Very High' },
      nextSteps: ['Election Commission Complaint', 'Election Petition in HC']
    },
    citizenship: {
      legalNature: 'Constitutional Law (Citizenship)',
      severity: 'Medium',
      relevantActs: ['Citizenship Act, 1955', 'Citizenship (Amendment) Act, 2019', 'Article 5-11 Constitution (Citizenship)', 'Foreigners Act, 1946', 'Passport Act, 1967'],
      recommendedAction: ['Verify citizenship status through documents.', 'Apply for citizenship certificate if dispute exists.', 'Challenge NRC exclusion through tribunal.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹15,000 - ₹1,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Citizenship is a fundamental status; denial can be challenged in courts.', complexity: 'High' },
      nextSteps: ['Citizenship Certificate Application', 'Foreigners Tribunal']
    },
    default: {
      legalNature: 'Constitutional Matter',
      severity: 'Medium',
      relevantActs: ['Constitution of India', 'Relevant Fundamental Rights provisions'],
      recommendedAction: ['Consult a Constitutional Lawyer.', 'Determine if writ jurisdiction applies.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹15,000 - ₹1,00,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Constitutional matters require specialist lawyers; assess if the issue has wider public impact for PIL route.', complexity: 'High' },
      nextSteps: ['Constitutional Lawyer Consultation']
    }
  },

  education: {
    admission: {
      legalNature: 'Education Law (Admission Dispute)',
      severity: 'Medium',
      relevantActs: ['Right of Children to Free and Compulsory Education Act, 2009 (RTE)', 'Article 21A Constitution of India', 'UGC Act, 1956'],
      recommendedAction: ['Verify admission criteria and reservation guidelines.', 'File grievance with institutions grievance cell.', 'Approach Education Tribunal or High Court.'],
      estimatedTime: '1 - 6 months',
      estimatedCost: '₹5,000 - ₹30,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Education is a fundamental right under Article 21A; courts intervene in admission irregularities.', complexity: 'Medium' },
      nextSteps: ['File Grievance', 'Approach Education Tribunal']
    },
    fee_dispute: {
      legalNature: 'Education Law (Fee Dispute)',
      severity: 'Low',
      relevantActs: ['Fee Regulatory Committees (State-specific)', 'Consumer Protection Act, 2019', 'RTE Act, 2009'],
      recommendedAction: ['File complaint with Fee Regulatory Committee.', 'Approach Consumer Forum for refund.', 'File writ petition if fee hike is arbitrary.'],
      estimatedTime: '2 - 8 months',
      estimatedCost: '₹2,000 - ₹15,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Fee regulatory bodies have power to cap fees; consumer forum can order refunds.', complexity: 'Low' },
      nextSteps: ['Complaint to Fee Committee', 'Consumer Forum']
    },
    ragging: {
      legalNature: 'Criminal/Education Law (Anti-Ragging)',
      severity: 'High',
      relevantActs: ['UGC Anti-Ragging Regulations, 2009', 'IPC Section 339 (Wrongful restraint)', 'IPC Section 340 (Wrongful confinement)', 'SC Guidelines in Vishwa Jagriti Mission Case'],
      recommendedAction: ['Report immediately on antiragging.in helpline (1800-180-5522).', 'File complaint with Anti-Ragging Committee.', 'File FIR for serious cases.'],
      estimatedTime: '1 - 3 months',
      estimatedCost: '₹0 (Free complaint)',
      worthItAnalysis: { status: 'Yes', rationale: 'Ragging is a criminal offense; institutions face derecognition for non-action.', complexity: 'Low' },
      nextSteps: ['Call Anti-Ragging Helpline', 'File Written Complaint']
    },
    default: {
      legalNature: 'Education Matter',
      severity: 'Low',
      relevantActs: ['RTE Act, 2009', 'Article 21A Constitution of India'],
      recommendedAction: ['File grievance with institution.', 'Approach Education Department.'],
      estimatedTime: '1 - 6 months',
      estimatedCost: '₹2,000 - ₹20,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Most education disputes can be resolved through institutional grievance mechanisms.', complexity: 'Low' },
      nextSteps: ['Institutional Grievance Cell']
    }
  },

  health: {
    medical_negligence: {
      legalNature: 'Medical Law (Medical Negligence)',
      severity: 'High',
      relevantActs: ['Consumer Protection Act, 2019', 'Indian Medical Council Act, 1956', 'Clinical Establishments Act, 2010', 'IPC Section 304A (Causing death by negligence)'],
      recommendedAction: ['Obtain complete medical records from hospital.', 'Get a second medical opinion documenting negligence.', 'File complaint with State Medical Council.', 'File case in Consumer Forum or Civil Court.'],
      estimatedTime: '1 - 4 years',
      estimatedCost: '₹20,000 - ₹2,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Medical negligence cases have strong precedent; courts award significant compensation.', complexity: 'High' },
      nextSteps: ['Obtain Medical Records', 'File with Medical Council']
    },
    insurance_claim: {
      legalNature: 'Health Insurance Dispute',
      severity: 'Medium',
      relevantActs: ['Insurance Act, 1938', 'IRDAI Regulations', 'Consumer Protection Act, 2019'],
      recommendedAction: ['File claim with insurer within time limit.', 'If claim denied, approach Insurance Ombudsman.', 'File consumer complaint if Ombudsman doesn\'t resolve.'],
      estimatedTime: '1 - 6 months',
      estimatedCost: '₹0 - ₹5,000 (Ombudsman is free)',
      worthItAnalysis: { status: 'Yes', rationale: 'Insurance Ombudsman resolves claims quickly and free of charge up to ₹30 lakhs.', complexity: 'Low' },
      nextSteps: ['Insurance Ombudsman', 'Consumer Forum']
    },
    mental_health: {
      legalNature: 'Health Law (Mental Health Rights)',
      severity: 'Medium',
      relevantActs: ['Mental Healthcare Act, 2017', 'Rights of Persons with Disabilities Act, 2016', 'Article 21 Constitution (Right to Life)'],
      recommendedAction: ['Contact Mental Health Review Board for grievances.', 'Patient has right to make advance directive.', 'Admission requires informed consent (except emergency).'],
      estimatedTime: '1 - 6 months',
      estimatedCost: '₹5,000 - ₹30,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Mental Healthcare Act 2017 guarantees right to mental healthcare; forced treatment is restricted.', complexity: 'Medium' },
      nextSteps: ['Mental Health Review Board', 'Legal Aid']
    },
    food_safety: {
      legalNature: 'Health/Consumer Law (Food Adulteration)',
      severity: 'High',
      relevantActs: ['Food Safety and Standards Act, 2006 (FSSAI)', 'IPC Section 272 (Adulteration of food)', 'IPC Section 273 (Sale of adulterated food)', 'Consumer Protection Act, 2019'],
      recommendedAction: ['Report to FSSAI at fssai.gov.in.', 'File complaint with Food Safety Officer.', 'File FIR for severe adulteration cases.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹2,000 - ₹15,000',
      worthItAnalysis: { status: 'Yes', rationale: 'FSSAI complaints are taken seriously; penalties include fine up to ₹10 lakhs and imprisonment.', complexity: 'Low' },
      nextSteps: ['FSSAI Report', 'Food Safety Officer Complaint']
    },
    epidemic: {
      legalNature: 'Public Health Law (Epidemic/Pandemic)',
      severity: 'High',
      relevantActs: ['Epidemic Diseases Act, 1897', 'Disaster Management Act, 2005', 'Indian Penal Code Section 188 (Disobedience of public order)', 'Public Health Acts (State-specific)'],
      recommendedAction: ['Report violations of health protocols to local authorities.', 'Challenge disproportionate restrictions through courts.', 'Seek compensation for wrongful quarantine.'],
      estimatedTime: '1 - 6 months',
      estimatedCost: '₹5,000 - ₹30,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Government has wide powers during epidemics; courts balance public health vs. individual rights.', complexity: 'Medium' },
      nextSteps: ['Local Authority Complaint', 'High Court Petition']
    },
    default: {
      legalNature: 'Healthcare / Medical Matter',
      severity: 'Medium',
      relevantActs: ['Consumer Protection Act, 2019', 'Clinical Establishments Act, 2010'],
      recommendedAction: ['Document all medical records and bills.', 'File complaint with hospital grievance cell.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹10,000 - ₹75,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Medical disputes require expert opinion; success depends on documented evidence of negligence.', complexity: 'High' },
      nextSteps: ['Medical Records Collection', 'Legal Consultation']
    }
  },

  humanrights: {
    police_excess: {
      legalNature: 'Human Rights Violation (Police Misconduct)',
      severity: 'High',
      relevantActs: ['Article 21 (Right to Life)', 'Article 22 (Protection against Arrest)', 'Protection of Human Rights Act, 1993', 'DK Basu Guidelines (Supreme Court)'],
      recommendedAction: ['File complaint with SP/Commissioner of Police.', 'File complaint with NHRC/SHRC.', 'File writ petition (Habeas Corpus) in High Court if detained.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹10,000 - ₹75,000',
      worthItAnalysis: { status: 'Yes', rationale: 'NHRC has power to recommend compensation; courts take custodial violence very seriously.', complexity: 'Medium' },
      nextSteps: ['NHRC Complaint', 'Habeas Corpus Petition']
    },
    child_rights: {
      legalNature: 'Human Rights (Child Rights Violation)',
      severity: 'High',
      relevantActs: ['Juvenile Justice Act, 2015', 'POCSO Act, 2012', 'Child Labour (Prohibition) Act, 1986', 'RTE Act, 2009', 'Article 24 Constitution (Prohibition of child labour)'],
      recommendedAction: ['Report to Childline (1098) immediately.', 'File FIR for POCSO/child labor violations.', 'Contact Child Welfare Committee (CWC).'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹0 - ₹20,000 (free legal aid available)',
      worthItAnalysis: { status: 'Yes', rationale: 'Child rights violations are treated with utmost seriousness by courts; POCSO has strict timelines.', complexity: 'Medium' },
      nextSteps: ['Call Childline 1098', 'File FIR']
    },
    custodial_death: {
      legalNature: 'Human Rights (Custodial Violence/Death)',
      severity: 'Critical',
      relevantActs: ['Article 21 (Right to Life)', 'IPC Section 302/304 (Murder/Culpable homicide)', 'Protection of Human Rights Act, 1993', 'Evidence Act Section 114B'],
      recommendedAction: ['File complaint with NHRC immediately.', 'File FIR against responsible officers.', 'File Habeas Corpus or writ petition in High Court.'],
      estimatedTime: '6 months - 5 years',
      estimatedCost: '₹25,000 - ₹2,00,000 (NHRC complaint is free)',
      worthItAnalysis: { status: 'Yes', rationale: 'Burden of proof shifts to police in custodial death cases; courts award heavy compensation.', complexity: 'High' },
      nextSteps: ['NHRC Complaint', 'High Court Writ Petition']
    },
    default: {
      legalNature: 'Human Rights Matter',
      severity: 'Medium',
      relevantActs: ['Protection of Human Rights Act, 1993', 'Constitution of India - Part III'],
      recommendedAction: ['File complaint with NHRC (nhrc.nic.in).', 'Document violations with evidence.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹0 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'NHRC provides free complaint mechanism; courts are proactive in human rights protection.', complexity: 'Medium' },
      nextSteps: ['NHRC/SHRC Complaint']
    }
  },

  tax: {
    income_tax: {
      legalNature: 'Tax Law (Income Tax Dispute)',
      severity: 'Medium',
      relevantActs: ['Income Tax Act, 1961', 'Finance Act (Annual)', 'Article 265 Constitution (No tax without authority of law)'],
      recommendedAction: ['File appeal with CIT (Appeals) within 30 days of order.', 'Approach Income Tax Appellate Tribunal (ITAT) for second appeal.', 'Hire Chartered Accountant or Tax Lawyer.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹15,000 - ₹1,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Tax disputes can be resolved through structured appeal process; ITAT is very effective.', complexity: 'Medium' },
      nextSteps: ['CIT Appeals', 'ITAT Appeal']
    },
    gst: {
      legalNature: 'Tax Law (GST Dispute)',
      severity: 'Medium',
      relevantActs: ['Central Goods and Services Tax Act, 2017', 'State GST Acts', 'Integrated GST Act, 2017'],
      recommendedAction: ['File appeal with GST Appellate Authority within 3 months.', 'Apply for advance ruling if interpretation issue.', 'File refund claim on GST portal within 2 years.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹10,000 - ₹75,000',
      worthItAnalysis: { status: 'Yes', rationale: 'GST disputes have structured tribunal process; advance ruling prevents future litigation.', complexity: 'Medium' },
      nextSteps: ['GST Portal', 'Appellate Authority']
    },
    customs: {
      legalNature: 'Tax Law (Customs & Import-Export)',
      severity: 'High',
      relevantActs: ['Customs Act, 1962', 'Foreign Trade (Development and Regulation) Act, 1992', 'FEMA, 1999'],
      recommendedAction: ['File appeal with Commissioner (Appeals) within 60 days.', 'Approach CESTAT for further appeal.', 'Apply for provisional release of seized goods.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹25,000 - ₹2,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Customs seizures can be challenged; provisional release is available on bond/bank guarantee.', complexity: 'High' },
      nextSteps: ['Commissioner Appeals', 'CESTAT']
    },
    property_tax: {
      legalNature: 'Tax Law (Property Tax Dispute)',
      severity: 'Low',
      relevantActs: ['Municipal Corporation Acts (State-specific)', 'Article 243X Constitution (Powers of Municipalities)', 'Property Tax Rules'],
      recommendedAction: ['File objection with Municipal Corporation within prescribed time.', 'Apply for reassessment if property valued incorrectly.', 'Approach civil court for illegal tax demands.'],
      estimatedTime: '1 - 6 months',
      estimatedCost: '₹5,000 - ₹20,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Property tax objections are usually resolved quickly by municipal authorities.', complexity: 'Low' },
      nextSteps: ['Municipal Corporation Objection', 'Reassessment Application']
    },
    default: {
      legalNature: 'Tax / Revenue Matter',
      severity: 'Medium',
      relevantActs: ['Income Tax Act, 1961', 'GST Act, 2017', 'Article 265 Constitution'],
      recommendedAction: ['Consult a Tax Lawyer or Chartered Accountant.', 'File appeal within prescribed time limits.'],
      estimatedTime: '3 months - 3 years',
      estimatedCost: '₹10,000 - ₹75,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Tax disputes have well-defined appeal mechanisms; timely filing is critical.', complexity: 'Medium' },
      nextSteps: ['Tax Professional Consultation']
    }
  },

  environment: {
    pollution: {
      legalNature: 'Environmental Law (Pollution)',
      severity: 'High',
      relevantActs: ['Environment (Protection) Act, 1986', 'Water (Prevention and Control of Pollution) Act, 1974', 'Air (Prevention and Control of Pollution) Act, 1981', 'National Green Tribunal Act, 2010'],
      recommendedAction: ['Report to State Pollution Control Board (SPCB).', 'File complaint with National Green Tribunal (NGT).', 'File PIL in High Court for widespread pollution.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹5,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'NGT is fast-track and specialized; polluter-pays principle ensures compensation.', complexity: 'Medium' },
      nextSteps: ['SPCB Complaint', 'NGT Application']
    },
    wildlife: {
      legalNature: 'Environmental Law (Wildlife Crime)',
      severity: 'High',
      relevantActs: ['Wildlife (Protection) Act, 1972', 'Environment (Protection) Act, 1986', 'Forest Conservation Act, 1980', 'Biological Diversity Act, 2002'],
      recommendedAction: ['Report poaching/trading to Wildlife Crime Control Bureau.', 'File FIR with Forest Department.', 'Report on wildlife.gov.in.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹10,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Wildlife crimes carry strict penalties including imprisonment; WCCB handles investigation.', complexity: 'Medium' },
      nextSteps: ['WCCB Report', 'Forest Department FIR']
    },
    forest: {
      legalNature: 'Environmental Law (Forest Rights)',
      severity: 'Medium',
      relevantActs: ['Forest Conservation Act, 1980', 'Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006', 'Indian Forest Act, 1927'],
      recommendedAction: ['File claim with Gram Sabha for forest rights recognition.', 'Challenge eviction through Forest Rights Committee.', 'Approach NGT for forest diversion issues.'],
      estimatedTime: '6 months - 3 years',
      estimatedCost: '₹5,000 - ₹30,000 (free legal aid available)',
      worthItAnalysis: { status: 'Yes', rationale: 'Forest Rights Act protects tribal land rights; Gram Sabha is the primary authority.', complexity: 'Medium' },
      nextSteps: ['Gram Sabha Claim', 'Forest Rights Committee']
    },
    noise: {
      legalNature: 'Environmental Law (Noise Pollution)',
      severity: 'Low',
      relevantActs: ['Environment (Protection) Act, 1986', 'Noise Pollution (Regulation and Control) Rules, 2000', 'IPC Section 268 (Public nuisance)', 'Article 21 Constitution'],
      recommendedAction: ['Complain to local police under Section 268 IPC.', 'File complaint with Pollution Control Board.', 'Approach NGT for persistent noise issues.'],
      estimatedTime: '1 - 6 months',
      estimatedCost: '₹2,000 - ₹15,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Supreme Court has recognized right to silence under Article 21; noise limits are strictly enforceable.', complexity: 'Low' },
      nextSteps: ['Police Complaint', 'Pollution Control Board']
    },
    waste: {
      legalNature: 'Environmental Law (Waste Management)',
      severity: 'Medium',
      relevantActs: ['Solid Waste Management Rules, 2016', 'Hazardous Waste Management Rules, 2016', 'E-Waste Management Rules, 2016', 'Environment (Protection) Act, 1986'],
      recommendedAction: ['Report illegal dumping to Municipal Corporation.', 'File complaint with SPCB for hazardous waste.', 'Approach NGT for persistent violations.'],
      estimatedTime: '1 - 12 months',
      estimatedCost: '₹2,000 - ₹20,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Waste management violations carry heavy fines; NGT actively penalizes non-compliance.', complexity: 'Low' },
      nextSteps: ['Municipal Corporation Complaint', 'SPCB/NGT']
    },
    default: {
      legalNature: 'Environmental Matter',
      severity: 'Medium',
      relevantActs: ['Environment (Protection) Act, 1986', 'National Green Tribunal Act, 2010'],
      recommendedAction: ['Report to State Pollution Control Board.', 'Approach National Green Tribunal.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹5,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'NGT provides specialized, fast-track environmental justice.', complexity: 'Medium' },
      nextSteps: ['SPCB Complaint', 'NGT Application']
    }
  },

  realestate: {
    builder_delay: {
      legalNature: 'Real Estate Law (Project Delay)',
      severity: 'Medium',
      relevantActs: ['Real Estate (Regulation and Development) Act, 2016 (RERA)', 'Consumer Protection Act, 2019', 'Indian Contract Act, 1872'],
      recommendedAction: ['Check builder RERA registration status.', 'File complaint on state RERA portal.', 'Claim interest at SBI lending rate + 2% on delayed possession.'],
      estimatedTime: '3 - 12 months',
      estimatedCost: '₹5,000 - ₹25,000',
      worthItAnalysis: { status: 'Yes', rationale: 'RERA mandates strict timelines; builders pay interest for every month of delay.', complexity: 'Low' },
      nextSteps: ['File RERA Complaint', 'Claim Interest/Refund']
    },
    illegal_construction: {
      legalNature: 'Real Estate/Municipal Law (Unauthorized Construction)',
      severity: 'Medium',
      relevantActs: ['Municipal Corporation Acts (State-specific)', 'Building Bye-laws', 'Environment (Protection) Act, 1986', 'CPC Order 39 (Injunction)'],
      recommendedAction: ['Report to Municipal Corporation/Development Authority.', 'File complaint with RERA if builder involved.', 'Seek injunction from civil court.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹10,000 - ₹50,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Municipal authorities have power to demolish illegal constructions; early reporting is effective.', complexity: 'Medium' },
      nextSteps: ['Municipal Corporation Complaint', 'Civil Court Injunction']
    },
    encroachment: {
      legalNature: 'Property/Criminal Law (Encroachment)',
      severity: 'High',
      relevantActs: ['IPC Section 441 (Criminal trespass)', 'IPC Section 447 (Punishment for criminal trespass)', 'Specific Relief Act, 1963', 'Transfer of Property Act, 1882'],
      recommendedAction: ['File FIR for criminal trespass.', 'File civil suit for possession and injunction.', 'Approach Revenue Department for government land encroachment.'],
      estimatedTime: '6 months - 5 years',
      estimatedCost: '₹20,000 - ₹1,00,000',
      worthItAnalysis: { status: 'Yes', rationale: 'Both criminal and civil remedies available; injunction can stop encroachment immediately.', complexity: 'Medium' },
      nextSteps: ['File FIR', 'Civil Suit for Possession']
    },
    default: {
      legalNature: 'Real Estate Matter',
      severity: 'Medium',
      relevantActs: ['RERA Act, 2016', 'Transfer of Property Act, 1882'],
      recommendedAction: ['Check RERA registration.', 'Consult a Real Estate Lawyer.'],
      estimatedTime: '3 months - 2 years',
      estimatedCost: '₹10,000 - ₹75,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'RERA provides strong buyer protections; most issues can be resolved through RERA portal.', complexity: 'Medium' },
      nextSteps: ['RERA Portal', 'Property Lawyer Consultation']
    }
  },

  other: {
    not_listed: {
      legalNature: 'General Legal Inquiry',
      severity: 'Low',
      relevantActs: ['Constitution of India', 'Relevant statutory provisions'],
      recommendedAction: ['Consult a General Practitioner Lawyer.', 'Visit nearest District Legal Services Authority for free legal aid.'],
      estimatedTime: 'Variable',
      estimatedCost: '₹0 - ₹10,000 (Free legal aid available)',
      worthItAnalysis: { status: 'Maybe', rationale: 'Free legal aid is available under NALSA for eligible persons; basic consultation is always recommended.', complexity: 'Low' },
      nextSteps: ['District Legal Services Authority', 'NALSA Helpline']
    },
    default: {
      legalNature: 'General Legal Inquiry',
      severity: 'Low',
      relevantActs: ['Constitution of India'],
      recommendedAction: ['Consult a General Practitioner Lawyer.'],
      estimatedTime: 'Variable',
      estimatedCost: '₹0 - ₹15,000',
      worthItAnalysis: { status: 'Maybe', rationale: 'Basic consultation is always worth it to avoid mistakes.', complexity: 'Medium' },
      nextSteps: ['Legal Advice']
    }
  }
};

exports.analyzeRuleBased = (category, subCategory) => {
  const catRules = RULES[category] || RULES['other'];
  const specificRule = catRules[subCategory] || catRules['default'] || RULES['other']['default'];

  return {
    category,
    subCategory,
    ...specificRule
  };
};
