const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const LegalAct = require('../models/LegalAct');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const newActs = [
  // --- Constitution (additional) ---
  { name: "Citizenship Act", shortName: "Citizenship Act", year: 1955, category: "Constitution",
    description: "Law on acquisition and loss of Indian citizenship.",
    sections: [
      { number: "3", title: "Citizenship by birth", content: "Every person born in India on or after 26.01.1950 but before 01.07.1987 shall be a citizen of India by birth." },
      { number: "5", title: "Citizenship by registration", content: "Persons of Indian origin who are ordinarily resident in India can apply for citizenship." },
      { number: "9", title: "Termination of citizenship", content: "Any citizen who acquires citizenship of another country shall cease to be a citizen of India." }
    ]
  },
  { name: "Citizenship (Amendment) Act", shortName: "CAA", year: 2019, category: "Constitution",
    description: "Amends Citizenship Act to grant citizenship to persecuted minorities from Pakistan, Bangladesh, and Afghanistan.",
    sections: [{ number: "2", title: "Amendment of Section 2", content: "Provides that Hindus, Sikhs, Buddhists, Jains, Parsis, and Christians from specified countries shall not be treated as illegal migrants." }]
  },
  { name: "Foreigners Act", shortName: "Foreigners Act", year: 1946, category: "Constitution",
    description: "Powers to deal with foreigners in India, including deportation.",
    sections: [{ number: "3", title: "Power to make orders", content: "Central Government may by order make provision for prohibiting, regulating, or restricting the entry of foreigners." }]
  },
  { name: "Passport Act", shortName: "Passport Act", year: 1967, category: "Constitution",
    description: "Regulation of issuance and usage of passports and travel documents.",
    sections: [{ number: "3", title: "Passport necessary for departure", content: "No person shall depart from India unless he holds a valid passport." }]
  },

  // --- Criminal Defense (additional) ---
  { name: "Dowry Prohibition Act", shortName: "Dowry Act", year: 1961, category: "Criminal Defense",
    description: "Prohibits the giving or taking of dowry.",
    sections: [
      { number: "2", title: "Definition of dowry", content: "Any property or valuable security given or agreed to be given in connection with the marriage." },
      { number: "3", title: "Penalty for giving or taking dowry", content: "Imprisonment for not less than 5 years and fine of not less than ₹15,000 or value of dowry." },
      { number: "6", title: "Dowry benefit to wife", content: "If dowry received by any person other than the woman, it shall be transferred to the woman within 3 months." }
    ]
  },
  { name: "SC/ST (Prevention of Atrocities) Act", shortName: "SC/ST Act", year: 1989, category: "Criminal Defense",
    description: "Prevents atrocities and discrimination against Scheduled Castes and Scheduled Tribes.",
    sections: [
      { number: "3", title: "Punishments for offences", content: "Detailed list of atrocities including assault, forced labor, land dispossession, and social boycott." },
      { number: "14", title: "Special Courts", content: "State Government shall establish Special Courts for the trial of offences under this Act." },
      { number: "15A", title: "Duties of public servants", content: "Police officers shall not fail to register FIR or investigate cases under this Act." }
    ]
  },
  { name: "Explosive Substances Act", shortName: "Explosives Act", year: 1908, category: "Criminal Defense",
    description: "Law relating to regulation, manufacture, possession, and transport of explosives.",
    sections: [{ number: "3", title: "Punishment for causing explosion", content: "Any person who unlawfully causes an explosion likely to endanger life shall be punished with transportation for life." }]
  },
  { name: "Prevention of Corruption Act", shortName: "PCA", year: 1988, category: "Criminal Defense",
    description: "Law to combat corruption among public servants.",
    sections: [
      { number: "7", title: "Taking gratification", content: "Public servant who obtains undue advantage shall be punishable with 3-7 years imprisonment." },
      { number: "13", title: "Criminal misconduct", content: "Habitual acceptance of gratification, possession of disproportionate assets." }
    ]
  },
  { name: "Prevention of Money Laundering Act", shortName: "PMLA", year: 2002, category: "Criminal Defense",
    description: "Prevention of money-laundering and confiscation of property derived from laundering.",
    sections: [
      { number: "3", title: "Offence of money-laundering", content: "Whosoever directly or indirectly attempts to indulge in money-laundering shall be guilty." },
      { number: "5", title: "Attachment of property", content: "Director or authorized officer may provisionally attach property involved in money-laundering." }
    ]
  },
  { name: "Unlawful Activities (Prevention) Act", shortName: "UAPA", year: 1967, category: "Criminal Defense",
    description: "Prevention of unlawful activities of individuals and associations; anti-terrorism law.",
    sections: [
      { number: "15", title: "Terrorist act", content: "Any act intended to threaten unity, integrity, security, or sovereignty of India using bombs, dynamite, or other means." },
      { number: "43D", title: "Modified application of certain provisions", content: "Court shall not grant bail if on perusal of case diary, there are reasonable grounds to believe the accusation is prima facie true." }
    ]
  },
  { name: "Indian Evidence Act", shortName: "IEA", year: 1872, category: "Criminal Defense",
    description: "Rules governing the admissibility of evidence in judicial proceedings.",
    sections: [
      { number: "113A", title: "Presumption as to abetment of suicide by married woman", content: "If a woman commits suicide within 7 years of marriage and husband subjected her to cruelty, court may presume abetment." },
      { number: "113B", title: "Presumption as to dowry death", content: "When death occurs within 7 years of marriage under abnormal circumstances, court shall presume dowry death." },
      { number: "114", title: "Court may presume existence of certain facts", content: "Court may presume certain facts based on common course of natural events." }
    ]
  },

  // --- Land & Property (additional) ---
  { name: "Land Acquisition Act", shortName: "LARR", year: 2013, category: "Land & Property",
    description: "Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act.",
    sections: [
      { number: "26", title: "Determination of market value", content: "Market value shall be highest of value as per Indian Stamp Act, average sale price, or consented amount." },
      { number: "27", title: "Solatium and multiplier", content: "100% solatium over market value; multiplier of 1 to 2 for rural land." },
      { number: "40", title: "Rehabilitation and Resettlement Award", content: "Administrator shall pass an R&R Award for affected families." }
    ]
  },
  { name: "Indian Stamp Act", shortName: "Stamp Act", year: 1899, category: "Land & Property",
    description: "Law relating to stamp duty on instruments and documents.",
    sections: [{ number: "3", title: "Instruments chargeable with duty", content: "Every instrument mentioned in Schedule I shall be chargeable with the duty indicated in that Schedule." }]
  },
  { name: "Indian Succession Act", shortName: "Succession Act", year: 1925, category: "Land & Property",
    description: "Law on wills, intestate succession, and administration of estates for non-Hindus.",
    sections: [{ number: "63", title: "Execution of unprivileged wills", content: "The testator shall sign or affix his mark to the will in the presence of two or more witnesses." }]
  },
  { name: "Cooperative Societies Act", shortName: "Co-op Act", year: 1912, category: "Land & Property",
    description: "Registration and management of cooperative societies.",
    sections: [{ number: "4", title: "Conditions of registration", content: "Society which has as its object the promotion of economic interests of its members may be registered." }]
  },
  { name: "Hindu Succession Act", shortName: "HSA", year: 1956, category: "Land & Property",
    description: "Law of intestate succession among Hindus; gives women equal coparcenary rights.",
    sections: [
      { number: "6", title: "Devolution of interest in coparcenary property", content: "Daughter of a coparcener shall have the same rights as a son (2005 Amendment)." },
      { number: "14", title: "Property of female Hindu to be her absolute property", content: "Any property possessed by a female Hindu shall be held by her as full owner." }
    ]
  },

  // --- Family Law (additional) ---
  { name: "Protection of Women from Domestic Violence Act", shortName: "PWDVA", year: 2005, category: "Family Law",
    description: "Civil law for protection of women from domestic violence including physical, sexual, verbal, emotional, and economic abuse.",
    sections: [
      { number: "12", title: "Application to Magistrate", content: "An aggrieved person or Protection Officer may present application to the Magistrate." },
      { number: "17", title: "Right to reside in shared household", content: "Every woman in a domestic relationship shall have right to reside in the shared household." },
      { number: "19", title: "Residence orders", content: "Magistrate may restrain respondent from dispossessing the aggrieved person from shared household." },
      { number: "20", title: "Monetary relief", content: "Magistrate may direct respondent to pay monetary relief to meet expenses incurred and losses suffered." }
    ]
  },
  { name: "Muslim Women (Protection of Rights on Divorce) Act", shortName: "Muslim Women Act", year: 1986, category: "Family Law",
    description: "Rights of Muslim women on divorce including maintenance and mahr.",
    sections: [{ number: "3", title: "Mahr and maintenance", content: "Divorced woman entitled to reasonable and fair provision within iddat period, mahr or dower, and maintenance for children." }]
  },
  { name: "Hindu Minority and Guardianship Act", shortName: "HMGA", year: 1956, category: "Family Law",
    description: "Guardianship of Hindu minors and their property.",
    sections: [{ number: "6", title: "Natural guardians", content: "Father is natural guardian of minor boy/girl, mother after him; for illegitimate child, mother then father." }]
  },
  { name: "Indian Divorce Act", shortName: "IDA", year: 1869, category: "Family Law",
    description: "Law governing divorce among Christians in India.",
    sections: [{ number: "10", title: "Grounds for dissolution", content: "Court may dissolve marriage on grounds of adultery, conversion, unsoundness of mind, or cruelty." }]
  },
  { name: "Prohibition of Child Marriage Act", shortName: "PCMA", year: 2006, category: "Family Law",
    description: "Prevents solemnization of child marriages.",
    sections: [
      { number: "3", title: "Child marriage to be voidable", content: "Child marriage shall be voidable at the option of the contracting party who was a child." },
      { number: "9", title: "Punishment for male adult", content: "Male above 18 contracting child marriage shall be punished with 2 years rigorous imprisonment." }
    ]
  },

  // --- Employment (additional) ---
  { name: "Sexual Harassment of Women at Workplace Act", shortName: "POSH Act", year: 2013, category: "Employment",
    description: "Prevention, prohibition, and redressal of sexual harassment of women at workplace.",
    sections: [
      { number: "2(n)", title: "Sexual harassment defined", content: "Includes physical contact, demand for sexual favours, sexually coloured remarks, showing pornography, any unwelcome sexual conduct." },
      { number: "4", title: "Internal Complaints Committee", content: "Every employer of a workplace with 10+ employees shall constitute an Internal Complaints Committee." },
      { number: "9", title: "Complaint of sexual harassment", content: "Aggrieved woman may make written complaint to ICC within 3 months of the incident." }
    ]
  },
  { name: "Payment of Wages Act", shortName: "PWA", year: 1936, category: "Employment",
    description: "Regulates payment of wages to certain classes of employed persons.",
    sections: [{ number: "5", title: "Time of payment", content: "Wages shall be paid before the 7th day (under 1000 employees) or 10th day of the month." }]
  },
  { name: "Payment of Gratuity Act", shortName: "PGA", year: 1972, category: "Employment",
    description: "Payment of gratuity to employees engaged in factories, mines, plantations, etc.",
    sections: [{ number: "4", title: "Payment of gratuity", content: "Gratuity payable to employee on termination after 5+ years of continuous service, at 15 days wages per year." }]
  },
  { name: "Employees' Provident Funds Act", shortName: "EPF Act", year: 1952, category: "Employment",
    description: "Institution of provident funds and pension funds for employees.",
    sections: [{ number: "6", title: "Contributions and matters", content: "Employer and employee each contribute 12% of basic wages to the Provident Fund." }]
  },
  { name: "Equal Remuneration Act", shortName: "ERA", year: 1976, category: "Employment",
    description: "Payment of equal remuneration to men and women workers.",
    sections: [{ number: "4", title: "Duty of employer", content: "Employer shall pay equal remuneration to men and women workers for same work or work of similar nature." }]
  },
  { name: "Trade Unions Act", shortName: "TUA", year: 1926, category: "Employment",
    description: "Registration and regulation of Trade Unions.",
    sections: [{ number: "4", title: "Mode of registration", content: "Any seven or more members may apply for registration of a Trade Union." }]
  },
  { name: "Maternity Benefit Act", shortName: "MBA", year: 1961, category: "Employment",
    description: "Maternity protection and benefits for women employees.",
    sections: [{ number: "5", title: "Right to payment of maternity benefit", content: "Woman entitled to maternity benefit of 26 weeks (increased from 12 weeks by 2017 amendment)." }]
  },

  // --- Consumer Rights (additional) ---
  { name: "Food Safety and Standards Act", shortName: "FSSAI Act", year: 2006, category: "Consumer Rights",
    description: "Establishes FSSAI for food safety regulation and standards.",
    sections: [
      { number: "3", title: "Definitions", content: "Defines 'food', 'food business operator', 'unsafe food', 'misbranded food', and 'adulterated food'." },
      { number: "26", title: "Prohibition of unsafe food", content: "No person shall manufacture, store, sell, or distribute any food which is unsafe." }
    ]
  },
  { name: "Essential Commodities Act", shortName: "ECA", year: 1955, category: "Consumer Rights",
    description: "Control of production, supply, and distribution of essential commodities.",
    sections: [{ number: "3", title: "Powers to control", content: "Central Government may regulate or prohibit production, supply, and distribution of essential commodities." }]
  },

  // --- Business Law (additional) ---
  { name: "Arbitration and Conciliation Act", shortName: "Arbitration Act", year: 1996, category: "Business Law",
    description: "Law relating to domestic and international commercial arbitration.",
    sections: [
      { number: "7", title: "Arbitration agreement", content: "An agreement by the parties to submit disputes to arbitration, whether existing or future." },
      { number: "34", title: "Setting aside arbitral award", content: "Application for setting aside an arbitral award may be made to the court within 3 months." },
      { number: "36", title: "Enforcement of award", content: "An arbitral award shall be enforced as if it were a decree of the court." }
    ]
  },
  { name: "Limited Liability Partnership Act", shortName: "LLP Act", year: 2008, category: "Business Law",
    description: "Formation and regulation of limited liability partnerships.",
    sections: [{ number: "3", title: "LLP to be body corporate", content: "LLP formed and registered under this Act is a body corporate with perpetual succession." }]
  },
  { name: "SARFAESI Act", shortName: "SARFAESI", year: 2002, category: "Business Law",
    description: "Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest.",
    sections: [{ number: "13", title: "Enforcement of security interest", content: "Secured creditor may enforce security interest without court intervention after 60-day notice." }]
  },
  { name: "Foreign Exchange Management Act", shortName: "FEMA", year: 1999, category: "Business Law",
    description: "Regulation of foreign exchange transactions and external trade payments.",
    sections: [
      { number: "3", title: "Dealing in foreign exchange", content: "No person shall deal in or transfer any foreign exchange except through authorized person." },
      { number: "6", title: "Capital account transactions", content: "Any person may sell or draw foreign exchange for a capital account transaction as per RBI rules." }
    ]
  },
  { name: "SEBI Act", shortName: "SEBI Act", year: 1992, category: "Business Law",
    description: "Establishment of Securities and Exchange Board of India for investor protection.",
    sections: [{ number: "11", title: "Functions of SEBI", content: "Protect investors, regulate securities market, prohibit insider trading and unfair trade practices." }]
  },
  { name: "Goods and Services Tax Act", shortName: "GST Act", year: 2017, category: "Business Law",
    description: "Unified indirect tax on supply of goods and services across India.",
    sections: [
      { number: "9", title: "Levy and collection", content: "Tax shall be levied on all intra-State supplies of goods or services at the rate notified by Government." },
      { number: "16", title: "Input tax credit", content: "Every registered person shall be entitled to take credit of input tax charged on any supply of goods or services." }
    ]
  },
  { name: "Income Tax Act", shortName: "IT Act", year: 1961, category: "Business Law",
    description: "Comprehensive law for levy, administration, collection, and recovery of income tax.",
    sections: [
      { number: "2(24)", title: "Income defined", content: "Income includes profits, dividends, capital gains, house property income, and other sources." },
      { number: "80C", title: "Deductions", content: "Deduction of up to ₹1,50,000 for investments in PF, ELSS, insurance, tuition fees, etc." },
      { number: "139", title: "Return of income", content: "Every person whose income exceeds the exemption limit shall file a return of income." }
    ]
  },

  // --- Cyber Law (additional) ---
  { name: "Indian Telegraph Act", shortName: "Telegraph Act", year: 1885, category: "Cyber Law",
    description: "Government's power over telecommunication; used for internet surveillance and shutdowns.",
    sections: [{ number: "5(2)", title: "Power to intercept", content: "Government may direct interception of messages on occurrence of any public emergency or in the interest of public safety." }]
  },

  // --- Health & Medical (additional) ---
  { name: "Food Safety and Standards Act (Health)", shortName: "FSSA", year: 2006, category: "Health & Medical",
    description: "Standards for food articles and regulation of their manufacture, storage, distribution, sale, and import.",
    sections: [{ number: "59", title: "Penalty for unsafe food", content: "If injury not grievous: fine up to ₹5 lakhs. If grievous: up to ₹10 lakhs. If death: not less than ₹10 lakhs." }]
  },
  { name: "Epidemic Diseases Act", shortName: "Epidemic Act", year: 1897, category: "Health & Medical",
    description: "Government powers to take special measures during epidemic outbreaks.",
    sections: [{ number: "2", title: "Power to take special measures", content: "State Government may take measures to prevent outbreak or spread of dangerous epidemic diseases." }]
  },
  { name: "Clinical Establishments Act", shortName: "CEA", year: 2010, category: "Health & Medical",
    description: "Registration and regulation of clinical establishments.",
    sections: [{ number: "7", title: "Condition for registration", content: "No person shall run a clinical establishment unless it has been duly registered." }]
  },
  { name: "Rights of Persons with Disabilities Act", shortName: "RPWD Act", year: 2016, category: "Health & Medical",
    description: "Rights of persons with disabilities; mandates 5% reservation in government jobs.",
    sections: [
      { number: "3", title: "Equality and non-discrimination", content: "Government shall ensure that persons with disabilities enjoy the right to equality and non-discrimination." },
      { number: "34", title: "Reservation", content: "Not less than 4% of total number of vacancies shall be reserved for persons with benchmark disabilities." }
    ]
  },

  // --- Education Law (additional) ---
  { name: "National Education Policy", shortName: "NEP", year: 2020, category: "Education Law",
    description: "Policy framework for transformation of education system in India.",
    sections: [
      { number: "Policy", title: "5+3+3+4 Structure", content: "New pedagogical structure: Foundational (5 years), Preparatory (3), Middle (3), Secondary (4)." },
      { number: "Policy", title: "Mother tongue instruction", content: "Medium of instruction until at least Grade 5 shall be the home/mother tongue or regional language." }
    ]
  },
  { name: "Anti-Ragging Regulations (UGC)", shortName: "Anti-Ragging", year: 2009, category: "Education Law",
    description: "UGC regulations for curbing menace of ragging in educational institutions.",
    sections: [
      { number: "3", title: "What constitutes ragging", content: "Any physical or mental abuse targeting new students, including teasing, demanding, or forcing to do any act." },
      { number: "7", title: "Action to be taken against defaulters", content: "Suspension, expulsion, debarring from examinations, withholding results, derecognition of institution." }
    ]
  },

  // --- Human Rights (additional) ---
  { name: "POCSO Act", shortName: "POCSO", year: 2012, category: "Human Rights",
    description: "Protection of Children from Sexual Offences - special law for heinous crimes against children.",
    sections: [
      { number: "3", title: "Penetrative sexual assault", content: "Any person who commits penetrative sexual assault on a child shall be punished with 7 years to life imprisonment." },
      { number: "19", title: "Reporting of offences", content: "Any person who has apprehension that an offence is likely to be committed shall provide information to police." },
      { number: "35", title: "Presumption", content: "Special Court shall presume that accused committed the offence unless proven otherwise." }
    ]
  },
  { name: "Child Labour (Prohibition and Regulation) Act", shortName: "Child Labour Act", year: 1986, category: "Human Rights",
    description: "Prohibits employment of children below 14 in hazardous occupations.",
    sections: [
      { number: "3", title: "Prohibition of employment", content: "No child shall be employed in any occupation or process listed in the Schedule." },
      { number: "14", title: "Penalty", content: "Whoever employs a child in contravention shall be punishable with imprisonment of 6 months to 2 years." }
    ]
  },
  { name: "Bonded Labour System (Abolition) Act", shortName: "Bonded Labour Act", year: 1976, category: "Human Rights",
    description: "Abolition of bonded labour system and rehabilitation of freed labourers.",
    sections: [{ number: "4", title: "Abolition of bonded labour system", content: "On commencement of this Act, the bonded labour system shall stand abolished." }]
  },
  { name: "National Commission for Women Act", shortName: "NCW Act", year: 1990, category: "Human Rights",
    description: "Constitution of National Commission for Women.",
    sections: [{ number: "10", title: "Functions of Commission", content: "Investigate and examine all matters relating to safeguards provided for women under the Constitution." }]
  },

  // --- Environment & Wildlife (NEW) ---
  { name: "Environment (Protection) Act", shortName: "EPA", year: 1986, category: "Environment & Wildlife",
    description: "Umbrella legislation for environmental protection, empowering Central Government to take measures.",
    sections: [
      { number: "3", title: "Power of Central Government", content: "Central Government shall have power to take all measures for protecting and improving quality of environment." },
      { number: "7", title: "Prohibition on handling hazardous substances", content: "No person shall handle hazardous substances except in accordance with prescribed procedures." },
      { number: "15", title: "Penalty for contravention", content: "Imprisonment up to 5 years and/or fine up to ₹1 lakh; additional ₹5,000/day for continuing violation." }
    ]
  },
  { name: "Water (Prevention and Control of Pollution) Act", shortName: "Water Act", year: 1974, category: "Environment & Wildlife",
    description: "Prevention and control of water pollution; establishment of Pollution Control Boards.",
    sections: [
      { number: "3", title: "Central Pollution Control Board", content: "Constitution of Central Pollution Control Board for pollution prevention." },
      { number: "24", title: "Prohibition on polluting streams", content: "No person shall knowingly cause or permit any poisonous, noxious, or polluting matter into any stream or well." }
    ]
  },
  { name: "Air (Prevention and Control of Pollution) Act", shortName: "Air Act", year: 1981, category: "Environment & Wildlife",
    description: "Prevention, control, and abatement of air pollution.",
    sections: [{ number: "21", title: "Restrictions on use of industrial plant", content: "No person shall operate an industrial plant without consent of State Board." }]
  },
  { name: "Wildlife (Protection) Act", shortName: "WLPA", year: 1972, category: "Environment & Wildlife",
    description: "Protection of wild animals, birds, and plants; establishment of sanctuaries and national parks.",
    sections: [
      { number: "9", title: "Prohibition of hunting", content: "No person shall hunt any wild animal specified in Schedules I-IV." },
      { number: "39", title: "Wild animals are Government property", content: "Every wild animal hunted or found dead shall be the property of the Government." },
      { number: "51", title: "Penalties", content: "Offences related to Schedule I/II animals punishable with 3-7 years imprisonment and fine up to ₹25,000." }
    ]
  },
  { name: "Forest Conservation Act", shortName: "FCA", year: 1980, category: "Environment & Wildlife",
    description: "Restricts de-reservation of forests and use of forest land for non-forest purposes.",
    sections: [{ number: "2", title: "Restriction on de-reservation", content: "No State Government shall direct that any reserved forest or forest land be used for any non-forest purpose without Central Government approval." }]
  },
  { name: "Forest Rights Act", shortName: "FRA", year: 2006, category: "Environment & Wildlife",
    description: "Recognition of rights of Scheduled Tribes and other traditional forest dwellers over forest land.",
    sections: [
      { number: "3", title: "Forest rights", content: "Rights including right to hold and live in forest land, community rights, right of access to biodiversity." },
      { number: "6", title: "Authorities to vest forest rights", content: "Gram Sabha shall be the authority to initiate the process of determining forest rights." }
    ]
  },
  { name: "Biological Diversity Act", shortName: "BDA", year: 2002, category: "Environment & Wildlife",
    description: "Conservation of biological diversity, sustainable use, and fair sharing of benefits.",
    sections: [{ number: "3", title: "Certain persons not to undertake biodiversity related activities", content: "No person who is not a citizen of India shall obtain any biological resource for research or commercial use without NBA approval." }]
  },
  { name: "National Green Tribunal Act", shortName: "NGT Act", year: 2010, category: "Environment & Wildlife",
    description: "Establishment of National Green Tribunal for effective and expeditious disposal of environmental cases.",
    sections: [
      { number: "14", title: "Tribunal to settle disputes", content: "Tribunal has jurisdiction over civil cases involving substantial question relating to the environment." },
      { number: "15", title: "Relief and compensation", content: "Tribunal may provide relief and compensation to victims of pollution and environmental damage." }
    ]
  },

  // --- Tax & Revenue (NEW) ---
  { name: "Income Tax Act (Tax)", shortName: "Income Tax Act", year: 1961, category: "Tax & Revenue",
    description: "Comprehensive law governing direct taxation on income of individuals, companies, and other entities.",
    sections: [
      { number: "4", title: "Charge of income-tax", content: "Income-tax shall be charged for any assessment year at the rates enacted by the Finance Act." },
      { number: "10", title: "Incomes not included in total income", content: "Certain incomes like agricultural income, HUF income to members, are exempt from tax." },
      { number: "139", title: "Return of income", content: "Every person whose total income exceeds the maximum amount not chargeable to tax shall file a return." },
      { number: "271", title: "Penalty for failure", content: "Penalty for failure to furnish returns, comply with notices, or concealment of income." }
    ]
  },
  { name: "Central Goods and Services Tax Act", shortName: "CGST Act", year: 2017, category: "Tax & Revenue",
    description: "Levy, collection, and administration of Central Goods and Services Tax.",
    sections: [
      { number: "9", title: "Levy and collection of CGST", content: "Central tax on all intra-State supplies of goods or services at rates notified by Government." },
      { number: "16", title: "Eligibility for input tax credit", content: "Registered person entitled to take credit of input tax charged on supplies used in the course of business." },
      { number: "73", title: "Determination of tax not paid", content: "Proper officer shall serve notice on person chargeable with tax which has not been paid or has been short paid." }
    ]
  },
  { name: "Customs Act", shortName: "Customs Act", year: 1962, category: "Tax & Revenue",
    description: "Regulation of import and export of goods; levying customs duties.",
    sections: [
      { number: "12", title: "Dutiable goods", content: "Duties of customs shall be levied at rates specified on goods imported into or exported from India." },
      { number: "111", title: "Confiscation of improperly imported goods", content: "Goods that are imported or attempted to be imported contrary to prohibition shall be confiscated." }
    ]
  },
  { name: "Indian Stamp Act (Tax)", shortName: "Indian Stamp Act", year: 1899, category: "Tax & Revenue",
    description: "Law relating to stamp duty payable on instruments and documents.",
    sections: [
      { number: "3", title: "Instruments chargeable with duty", content: "Every instrument mentioned in Schedule I shall be chargeable with the duty indicated therein." },
      { number: "35", title: "Instruments not duly stamped", content: "An instrument not duly stamped shall not be admitted in evidence or acted upon by any public officer." }
    ]
  },
  { name: "Benami Transactions (Prohibition) Act", shortName: "Benami Act", year: 1988, category: "Tax & Revenue",
    description: "Prohibition of benami transactions and confiscation of benami properties.",
    sections: [
      { number: "2(9)", title: "Benami transaction defined", content: "Transaction where property is transferred to one person for consideration paid by another person." },
      { number: "3", title: "Prohibition", content: "No person shall enter into any benami transaction. Such property is liable to confiscation." }
    ]
  }
];

const seedNewActs = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not defined");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check existing acts to avoid duplicates
    const existingNames = await LegalAct.distinct('name');
    const toInsert = newActs.filter(act => !existingNames.includes(act.name));

    if (toInsert.length === 0) {
      console.log("All acts already exist. No new acts to add.");
    } else {
      await LegalAct.insertMany(toInsert);
      console.log(`Successfully added ${toInsert.length} new legal acts!`);
    }

    const total = await LegalAct.countDocuments();
    console.log(`Total legal acts in database: ${total}`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedNewActs();
