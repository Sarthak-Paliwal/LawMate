const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const LegalAct = require('../models/LegalAct');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const acts = [
  // --- Constitution (5) ---
  {
    name: "Constitution of India", shortName: "Constitution", year: 1950, category: "Constitution",
    description: "The supreme law of India, establishing the framework for government, fundamental rights, and duties.",
    sections: [
      { number: "1", title: "Name and territory of the Union", content: "India, that is Bharat, shall be a Union of States. The territory of India shall comprise the territories of the States, Union territories, and any territory that may be acquired. The First Schedule lists all States and Union Territories." },
      { number: "14", title: "Equality before law", content: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India. This guarantees both formal equality (British concept of Rule of Law) and substantive equality (American concept of Equal Protection). Reasonable classification is permitted if it has a rational nexus with the object sought to be achieved." },
      { number: "15", title: "Prohibition of discrimination", content: "The State shall not discriminate against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them. No citizen shall be subject to any disability, liability, restriction or condition on these grounds in shops, public restaurants, wells, bathing ghats, roads etc. However, special provisions may be made for women, children, socially and educationally backward classes, SC/STs (clauses 3, 4, 5)." },
      { number: "17", title: "Abolition of Untouchability", content: "'Untouchability' is abolished and its practice in any form is forbidden. The enforcement of any disability arising out of Untouchability shall be an offence punishable in accordance with law. The Protection of Civil Rights Act, 1955 prescribes punishment for practicing untouchability  -  imprisonment up to 6 months and fine up to ₹500 for first offence." },
      { number: "19(1)(a)", title: "Freedom of speech and expression", content: "All citizens shall have the right to freedom of speech and expression. This includes freedom of press, right to information, right to silence, and right to broadcast. However, the State may impose reasonable restrictions in the interests of sovereignty, integrity, security, friendly relations, public order, decency/morality, contempt of court, defamation, or incitement to offence (Article 19(2))." },
      { number: "19(1)(g)", title: "Right to practice any profession", content: "All citizens shall have the right to practise any profession, or to carry on any occupation, trade or business. The State may impose reasonable restrictions in the interest of the general public and may prescribe professional or technical qualifications. The State can also create monopoly in any trade/business in favour of itself or a corporation, excluding citizens." },
      { number: "21", title: "Protection of life and personal liberty", content: "No person shall be deprived of his life or personal liberty except according to procedure established by law. The Supreme Court has expanded this to include right to livelihood, right to privacy, right to clean environment, right to speedy trial, right to shelter, right to health, right to education, right against custodial violence, right to legal aid, and right to live with dignity. After Maneka Gandhi v. Union of India, the procedure must also be just, fair, and reasonable." },
      { number: "21A", title: "Right to education", content: "The State shall provide free and compulsory education to all children of the age of six to fourteen years in such manner as the State may determine. Added by the 86th Constitutional Amendment Act, 2002. Implemented through the Right to Education Act, 2009, which mandates neighbourhood schools, no-detention policy up to Class 8, and 25% reservation in private schools for economically weaker sections." },
      { number: "32", title: "Remedies for enforcement of rights", content: "The right to move the Supreme Court by appropriate proceedings for the enforcement of Fundamental Rights is guaranteed. The Supreme Court may issue writs including Habeas Corpus (unlawful detention), Mandamus (command to perform duty), Prohibition (stopping inferior court), Certiorari (quashing order), and Quo Warranto (challenging public office). Dr. B.R. Ambedkar called this the 'heart and soul of the Constitution'." },
      { number: "44", title: "Uniform civil code", content: "The State shall endeavour to secure for the citizens a uniform civil code throughout the territory of India. This is a Directive Principle of State Policy (Part IV) and is not enforceable by court. It aims to replace personal laws based on religion (Hindu law, Muslim law, Christian law) with a common set of civil rules governing marriage, divorce, inheritance, and adoption for all citizens irrespective of religion." },
      { number: "51A", title: "Fundamental duties", content: "Added by the 42nd Amendment Act, 1976 (originally 10 duties, 11th added by 86th Amendment). Duties include: abide by the Constitution and respect national symbols; cherish ideals of freedom struggle; uphold sovereignty, unity, and integrity; defend the country; promote harmony; preserve composite culture; protect environment and wildlife; develop scientific temper; safeguard public property; strive towards excellence. These are non-justiciable but can be enforced through legislation." },
      { number: "300A", title: "Right to Property", content: "No person shall be deprived of his property save by authority of law. Originally a Fundamental Right under Article 31, it was made a constitutional right (not fundamental) by the 44th Amendment Act, 1978. The State can acquire private property only by authority of law and must provide compensation, though the adequacy of compensation is not justiciable. Land acquisition must follow the LARR Act, 2013 which mandates fair compensation (2-4x market value for rural land)." }
    ]
  },
  {
    name: "Right to Information Act", shortName: "RTI", year: 2005, category: "Constitution",
    description: "Empowers citizens to secure access to information under the control of public authorities.",
    sections: [
      { number: "3", title: "Right to information", content: "Subject to the provisions of this Act, all citizens shall have the right to information. This right covers inspection of works, documents, records; taking notes/extracts/certified copies; and obtaining information in electronic form. Certain information is exempt under Section 8 (national security, privacy, trade secrets, cabinet papers, etc.)." },
      { number: "4", title: "Obligations of public authorities", content: "Every public authority shall maintain all its records duly catalogued and indexed in a manner that facilitates the right to information. They must proactively publish within 120 days: organization structure, powers and duties of officers, decision-making procedures, rules/regulations, directory of employees, monthly remuneration, budget allocations, subsidy programs, and details of information available in electronic form." },
      { number: "6", title: "Request for obtaining information", content: "A person who desires to obtain any information shall make a request in writing or through electronic means, accompanied by a prescribed fee (typically ₹10). The applicant is not required to give any reason for requesting the information. The request should be made to the Public Information Officer (PIO) of the concerned authority. BPL applicants are exempt from paying any fee." },
      { number: "7", title: "Disposal of request", content: "Information should be provided within 30 days of the receipt of the request. If life or liberty of a person is involved, it must be provided within 48 hours. If the PIO fails to provide information within the prescribed time, the information shall be provided free of charge. First appeal lies to an officer senior to the PIO within 30 days; second appeal to the Information Commission within 90 days." }
    ]
  },
  {
    name: "Protection of Civil Rights Act", shortName: "PCR Act", year: 1955, category: "Constitution",
    description: "Prescribes punishment for the preaching and practice of 'Untouchability'.",
    sections: [
      { number: "3", title: "Punishment for enforcing religious disabilities", content: "Whoever on the ground of untouchability prevents any person from entering, worshipping, or offering prayers in any place of public worship, or from bathing in or using any sacred tank, well, spring, or watercourse, shall be punishable with imprisonment of 1-6 months and fine of ₹100-₹500. Second and subsequent offences: imprisonment of 6 months-2 years and fine of ₹200-₹1,000." },
      { number: "4", title: "Punishment for enforcing social disabilities", content: "Whoever on the ground of untouchability enforces any disability with regard to: (a) access to any shop, public restaurant, hotel, public entertainment venue; (b) use of utensils or articles kept in such places; (c) practice of any profession or occupation; (d) use of water sources, bathing ghats, roads, places of public resort  -  shall be punishable with imprisonment of 1-6 months and fine of ₹100-₹500." }
    ]
  },
  {
    name: "Representation of the People Act", shortName: "RPA", year: 1951, category: "Constitution",
    description: "Code for the conduct of elections to the Houses of Parliament and State Legislatures.",
    sections: [
      { number: "8", title: "Disqualification on conviction", content: "A person convicted of any offence and sentenced to imprisonment for not less than 2 years shall be disqualified from the date of conviction and shall continue to be disqualified for a further period of 6 years from the date of release. A person convicted under NDPS Act, Prevention of Corruption Act, Protection of Civil Rights Act, UAPA, or RP Act provisions on corrupt practices is disqualified even if imprisonment is less than 2 years." },
      { number: "123", title: "Corrupt practices", content: "Corrupt practices include: (a) bribery  -  any gift, offer, or promise to any person to stand/withdraw as candidate or to vote/refrain from voting; (b) undue influence  -  interference or threat to a candidate or voter; (c) appeal to vote on grounds of religion, race, caste, community, or language; (d) promotion of feelings of enmity between classes; (e) publication of false statements about personal character of a candidate; (f) hiring vehicles for transporting voters; (g) booth capturing. An election can be declared void if corrupt practices are proved." }
    ]
  },
  {
    name: "Official Languages Act", shortName: "OLA", year: 1963, category: "Constitution",
    description: "Provisions for languages used for official purposes of the Union.",
    sections: [{ number: "3", title: "Continuation of English Language", content: "Notwithstanding the expiration of the 15-year period from the commencement of the Constitution, the English language may continue to be used, in addition to Hindi, for all official purposes of the Union and for transaction of business in Parliament. This was enacted to address concerns of non-Hindi-speaking states. Both Hindi and English versions of Bills, Acts, and ordinances are authoritative." }]
  },

  // --- Criminal Defense (5) ---
  {
    name: "Indian Penal Code", shortName: "IPC", year: 1860, category: "Criminal Defense",
    description: "The primary and comprehensive criminal code of India.",
    sections: [
      { number: "124A", title: "Sedition", content: "Whoever by words, signs, or visible representation brings or attempts to bring into hatred or contempt, or excites disaffection towards the Government established by law shall be punished with imprisonment for life or up to 3 years with fine. The Supreme Court in Kedar Nath Singh v. State of Bihar held that only speech inciting violence or public disorder constitutes sedition, not mere criticism of the Government." },
      { number: "300", title: "Murder", content: "Culpable homicide is murder if the act is done with the intention of causing death, or with the intention of causing such bodily injury as the offender knows to be likely to cause death, or if the bodily injury intended is sufficient in the ordinary course of nature to cause death. Five exceptions reduce murder to culpable homicide not amounting to murder: grave provocation, private defence, public servant exceeding powers, sudden fight, and consent of victim above 18 years." },
      { number: "302", title: "Punishment for murder", content: "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. The Supreme Court in Bachan Singh v. State of Punjab held that death penalty should be imposed only in the 'rarest of rare' cases where the alternative option of life imprisonment is unquestionably foreclosed. Factors like age, mental condition, probability of reform, and circumstances of the crime must be considered." },
      { number: "304A", title: "Death by negligence", content: "Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide shall be punished with imprisonment up to 2 years, or with fine, or both. This section covers cases like medical negligence causing death, rash driving accidents, and industrial negligence. The act must be the proximate cause of death, and there must be a direct nexus between the negligent act and the death." },
      { number: "307", title: "Attempt to murder", content: "Whoever does any act with such intention or knowledge and under such circumstances that if he by that act caused death, he would be guilty of murder, shall be punished with imprisonment up to 10 years and fine. If the act causes hurt, the punishment may extend to life imprisonment. The prosecution must prove that the accused had the intention to kill, not merely to cause injury." },
      { number: "375", title: "Rape", content: "A man is said to commit rape if he penetrates or performs sexual acts against a woman's will, without her consent, with consent obtained by fear/fraud, when she is unable to communicate consent, or when she is under 18 years (even with consent). Punishment under Section 376: rigorous imprisonment of not less than 10 years extending to life imprisonment and fine. Gang rape (Sec 376D): not less than 20 years to life. Rape of minor under 12: minimum 20 years to death penalty." },
      { number: "378", title: "Theft", content: "Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person's consent, moves that property, is said to commit theft. Punishment under Section 379: imprisonment up to 3 years, or fine, or both. Theft in a dwelling house (Sec 380): up to 7 years. Theft by clerk/servant (Sec 381): up to 7 years. Theft after preparation for causing death/hurt (Sec 382): up to 10 years rigorous imprisonment." },
      { number: "405", title: "Criminal breach of trust", content: "Whoever, being entrusted with property or dominion over property, dishonestly misappropriates or converts to his own use that property, or dishonestly uses or disposes of that property, commits criminal breach of trust. Punishment under Section 406: imprisonment up to 3 years, or fine, or both. If by carrier/wharfinger (Sec 407): up to 7 years. If by public servant/banker/merchant (Sec 409): life imprisonment or up to 10 years with fine." },
      { number: "415", title: "Cheating", content: "Whoever, by deceiving any person, fraudulently or dishonestly induces the person deceived to deliver any property, or to consent to the retention of any property, or intentionally induces the person to do or omit to do anything, is said to cheat. Punishment under Section 417: imprisonment up to 1 year, or fine, or both. Cheating and dishonestly inducing delivery of property (Sec 420): up to 7 years and fine. Cheating by personation (Sec 419): up to 3 years and fine." },
      { number: "498A", title: "Cruelty by husband or relatives", content: "Whoever, being the husband or relative of the husband of a woman, subjects her to cruelty shall be punished with imprisonment up to 3 years and fine. 'Cruelty' means any wilful conduct likely to drive the woman to commit suicide or cause grave injury, or harassment with a view to coercing her or her relatives to meet any unlawful demand for property. The offence is cognizable, non-bailable, and non-compoundable. Supreme Court guidelines in Arnesh Kumar v. State of Bihar mandate preliminary enquiry before arrest." }
    ]
  },
  {
    name: "Code of Criminal Procedure", shortName: "CrPC", year: 1973, category: "Criminal Defense",
    description: "Detailed procedure for the investigation, trial, and punishment of crimes.",
    sections: [
      { number: "41", title: "Arrest without warrant", content: "A police officer may arrest without a warrant any person who has been concerned in any cognizable offence, against whom a reasonable complaint or credible information exists, or who is a proclaimed offender. After the 2009 Amendment (Sec 41A), for offences with imprisonment up to 7 years, the police officer shall issue a notice of appearance instead of arresting. Non-compliance with notice may lead to arrest. Arnesh Kumar v. State of Bihar guidelines must be followed." },
      { number: "46", title: "Arrest how made", content: "The police officer making the arrest shall actually touch or confine the body of the person unless there is submission to custody by word or action. No woman shall be arrested after sunset and before sunrise except in exceptional circumstances, and by a woman police officer with prior written permission of the Judicial Magistrate. The person arrested must be informed of the grounds of arrest and right to bail. Medical examination of the arrested person shall be done by a registered medical practitioner." },
      { number: "154", title: "Information in cognizable cases (FIR)", content: "Every information relating to the commission of a cognizable offence, if given orally or in writing to a police officer in charge of a police station, shall be reduced to writing and read over to the informant. A copy of the FIR shall be given to the informant free of cost. If the officer refuses to record the FIR, the informant may send the substance of the information by post to the Superintendent of Police who shall direct investigation. The Supreme Court in Lalita Kumari v. Govt. of UP made it mandatory to register an FIR for every cognizable offence." },
      { number: "167", title: "Procedure when investigation cannot be completed in 24 hours", content: "If the investigation cannot be completed within 24 hours, the accused can be detained beyond 24 hours only under order of the nearest Judicial Magistrate. Maximum detention: 90 days for offences punishable with death, life imprisonment, or imprisonment of 10+ years; 60 days for other offences. If investigation is not completed within this period, the accused gets 'default bail' as a matter of right. This is an indefeasible right and cannot be denied by the court if the chargesheet has not been filed." },
      { number: "437", title: "When bail may be taken in non-bailable offences", content: "A person accused of a non-bailable offence may be released on bail if there are reasonable grounds for believing that he is not guilty, or if the trial is likely to be delayed and the accused has been in jail for half the maximum period of imprisonment. Bail shall not be granted if the person is accused of an offence punishable with death or life imprisonment, unless the court considers special reasons. Women, children under 16, and sick/infirm persons have a preferential right to bail under this section." }
    ]
  },
  {
    name: "Indian Evidence Act", shortName: "Evidence Act", year: 1872, category: "Criminal Defense",
    description: "Rules governing the admissibility and weight of evidence in judicial proceedings.",
    sections: [
      { number: "24", title: "Confession caused by inducement", content: "A confession made by an accused person is irrelevant in criminal proceedings if it appears to the court that it was caused by any inducement, threat, or promise from a person in authority, and sufficient in the opinion of the court to give the accused grounds to suppose he would gain any advantage or avoid any evil. The inducement must relate to the charge against the accused. However, a confession made after the impression caused by inducement has been fully removed is admissible." },
      { number: "25", title: "Confession to police officer", content: "No confession made to a police officer shall be proved as against a person accused of any offence. This is a fundamental protection against police coercion. However, under Section 27, if a fact is discovered based on information received from the accused while in police custody, so much of the information as relates distinctly to the fact discovered may be proved (e.g., recovery of weapon). Confessions recorded before a Magistrate (Section 164 CrPC) are admissible." }
    ]
  },
  {
    name: "Arms Act", shortName: "Arms Act", year: 1959, category: "Criminal Defense",
    description: "Law relating to arms and ammunition.",
    sections: [{ number: "3", title: "Licence for firearms", content: "No person shall acquire, have in his possession, or carry any firearm or ammunition unless he holds a licence issued in accordance with the provisions of this Act. Licence is granted by the District Magistrate. A non-prohibited bore (NPB) licence is for personal safety; prohibited bore (PB) requires special approval. Possession without licence: imprisonment of 1-3 years and fine for NPB weapons; 3-7 years for PB weapons. The 2019 Amendment reduced the number of firearms per licence from 3 to 2." }]
  },
  {
    name: "Narcotic Drugs and Psychotropic Substances Act", shortName: "NDPS", year: 1985, category: "Criminal Defense",
    description: "Law dealing with drugs and their illegal trafficking.",
    sections: [{ number: "8", title: "Prohibition of operations", content: "No person shall cultivate any coca plant, opium poppy, or cannabis plant; produce, manufacture, possess, sell, purchase, transport, warehouse, use, consume, import, export, or tranship any narcotic drug or psychotropic substance, except for medical or scientific purposes and under licence/permit. Penalties depend on quantity: small quantity  -  up to 1 year imprisonment or fine up to ₹10,000; commercial quantity  -  10-20 years rigorous imprisonment and fine of ₹1-2 lakhs; intermediate quantity  -  up to 10 years and fine up to ₹1 lakh. Repeat offences: 1.5x the punishment, up to death penalty for repeat commercial quantity offenders." }]
  },

  // --- Traffic Law (5) ---
  {
    name: "Motor Vehicles Act", shortName: "MVA", year: 1988, category: "Traffic Law",
    description: "Standard law for road safety, vehicle registration, and traffic offence penalties.",
    sections: [
      { number: "3", title: "Necessity for driving licence", content: "No person shall drive a motor vehicle in any public place unless he holds an effective driving licence issued to him authorizing him to drive the vehicle. A learner's licence may be granted to any person over 16 (for motorcycles without gear up to 50cc) or 18 (for all motor vehicles). Penalty for driving without licence: first offence up to ₹5,000; subsequent offence up to ₹10,000. The 2019 Amendment significantly increased penalties across all sections." },
      { number: "128", title: "Safety for pillion riders", content: "No driver of a two-wheeled motor vehicle shall carry more than one person in addition to himself on that vehicle. The pillion rider must also wear a properly fastened protective headgear. Exception: a child below 4 years may be carried as an additional passenger. Penalty for violation: ₹1,000 fine and/or 3 months imprisonment under the 2019 Amendment." },
      { number: "129", title: "Wearing of helmets", content: "Every person driving or riding on a motorcycle shall wear protective headgear conforming to BIS standards. The helmet must be properly fastened with a chin strap. States may exempt certain categories (Sikh wearing turbans are exempt). Penalty after 2019 Amendment: ₹1,000 fine and disqualification of licence for 3 months. Not wearing a helmet also affects insurance claim settlement in case of accidents." },
      { number: "184", title: "Dangerous driving", content: "Whoever drives a motor vehicle at a speed or in a manner which is dangerous to the public shall be punishable with imprisonment up to 1 year and/or fine up to ₹5,000 for first offence. For second or subsequent offence: imprisonment up to 2 years and/or fine up to ₹10,000. Dangerous driving includes racing, zigzag driving, and driving against traffic flow. The 2019 Amendment added a specific provision for juvenile driving where guardian/vehicle owner shall be held responsible." },
      { number: "185", title: "Drunken driving", content: "Whoever while driving or attempting to drive a motor vehicle has blood alcohol content exceeding 30mg per 100ml of blood shall be punishable. First offence: imprisonment up to 6 months and/or fine up to ₹10,000. Second offence (within 3 years): imprisonment up to 2 years and/or fine up to ₹15,000. The vehicle can be impounded and the licence may be suspended. Refusal to submit to a breath/blood test is also an offence under this section." },
      { number: "194", title: "Overloading", content: "Driving a goods vehicle exceeding the permissible weight is punishable with fine of ₹20,000 plus ₹2,000 per additional tonne. The driver shall not be allowed to drive until the excess load is removed. The 2019 Amendment significantly increased these penalties (previously ₹2,000 for first offence). Overloading contributes to road damage and accidents  -  studies show overloaded trucks are 3x more likely to be involved in fatal accidents." }
    ]
  },
  {
    name: "National Highways Act", shortName: "NHA", year: 1956, category: "Traffic Law",
    description: "Declaration and maintenance of certain highways as national highways.",
    sections: [{ number: "3A", title: "Power to acquire land", content: "The Central Government may acquire any land needed for building, maintenance, management, or operation of a national highway by issuing a notification in the Official Gazette. The competent authority shall determine the market value of the land and pay compensation. An amount equal to the market value shall be deposited with the competent authority before taking possession. Any person aggrieved by the award may file objections within 21 days. Appeal lies to the Arbitrator appointed under the Act." }]
  },
  {
    name: "Central Motor Vehicles Rules", shortName: "CMVR", year: 1989, category: "Traffic Law",
    description: "Detailed rules for vehicle implementation, safety standards, and emissions.",
    sections: [{ number: "115", title: "Emission of smoke, etc.", content: "Every motor vehicle shall comply with mass emission standards prescribed by the Central Government (Bharat Stage norms). India currently follows BS-VI emission standards (effective April 2020), which mandate significantly reduced levels of particulate matter, nitrogen oxides, and carbon monoxide. Manufacturers must obtain Type Approval Certificate for each vehicle model. Non-compliant vehicles are subject to fine of ₹10,000 for first offence and may be impounded. Pollution Under Control (PUC) certificate is mandatory for all vehicles." }]
  },
  {
    name: "Road Transport Corporations Act", shortName: "RTCA", year: 1950, category: "Traffic Law",
    description: "Incorporation and management of road transport corporations in states.",
    sections: [{ number: "18", title: "Duty of Corporation", content: "It shall be the duty of every State Road Transport Corporation to provide or secure or promote the provision of an efficient, adequate, economical, and properly coordinated system of road transport service within the State. The Corporation shall act on business principles and must maintain its fleet in roadworthy condition. The Corporation can operate on inter-state routes with permission. State governments may provide capital grants and loans to the Corporation for expansion." }]
  },
  {
    name: "Carriage by Road Act", shortName: "CRA", year: 2007, category: "Traffic Law",
    description: "Liability and transit related rules for common carriers.",
    sections: [{ number: "10", title: "Liability for loss or damage", content: "A common carrier shall be liable for loss of or damage to any goods entrusted to him for carriage, unless he proves that such loss or damage was due to act of God, act of war, order of the Government, or inherent nature of the goods. The liability is limited to the value declared by the consignor, or if no value is declared, such amount as may be prescribed. The consignor must file a claim within 180 days from the date of booking. The carrier must provide a goods receipt for all consignments." }]
  },

  // --- Land & Property (4) ---
  {
    name: "Transfer of Property Act", shortName: "TPA", year: 1882, category: "Land & Property",
    description: "Governs the transfer of property between living persons (Inter-vivos).",
    sections: [
      { number: "5", title: "Transfer of property defined", content: "An act by which a living person conveys property, in present or in future, to one or more other living persons, or to himself and one or more other living persons. 'Living person' includes a company or association or body of individuals. The transfer must be between living persons (inter-vivos) and is different from succession (upon death). Transfer of immovable property of value ₹100 or more must be by registered instrument." },
      { number: "54", title: "Sale of immovable property", content: "Sale is a transfer of ownership in exchange for a price paid or promised or part-paid and part-promised. Tangible immovable property of value ₹100 or more can only be transferred by a registered instrument (sale deed). For property under ₹100, transfer may be made by delivery of property. The buyer acquires all rights of the seller including easements. Stamp duty (varies by state, typically 5-8% of market value) and registration charges (usually 1%) are payable." },
      { number: "105", title: "Lease defined", content: "A lease of immovable property is a transfer of a right to enjoy such property for a certain time, express or implied, or in perpetuity, in consideration of a price paid or promised (rent/premium). The transferor is the 'lessor', the transferee the 'lessee'. The lease must specify duration, rent amount, and terms. Registration is mandatory if the lease period exceeds 1 year. The lessor must disclose material defects and the lessee must pay rent and maintain the property." },
      { number: "122", title: "Gift defined", content: "Gift is the transfer of certain existing moveable or immoveable property made voluntarily and without consideration by one person (donor) to another (donee) and accepted by or on behalf of the donee. Acceptance must be made during the lifetime of the donor and while the donor is still capable of giving. For immovable property, the gift must be effected by a registered instrument. Gift of moveable property may be made by delivery. Gift can be revoked only under specific conditions." }
    ]
  },
  {
    name: "Real Estate (Regulation and Development) Act", shortName: "RERA", year: 2016, category: "Land & Property",
    description: "Protects home-buyers and boosts investment in the real estate industry.",
    sections: [
      { number: "3", title: "Registration of projects", content: "No promoter shall advertise, market, book, sell, or offer for sale any plot/apartment/building in a real estate project without registering the project with RERA. Registration requires disclosure of land title, layout plan, approvals, timeline, and financial details. A project-specific bank account must be maintained where 70% of amounts collected shall be deposited. Non-registration attracts penalty up to 10% of project cost; continued violation may lead to imprisonment up to 3 years." },
      { number: "13", title: "No deposit without agreement", content: "A promoter shall not accept a sum more than 10% of the cost of the apartment, plot, or building as the case may be, as an advance or application fee, from a person without first entering into a written agreement for sale and registering the said agreement. The agreement must specify the construction timeline, payment schedule, and specifications of the apartment/plot. This provision protects buyers from developers collecting large sums without any legal commitment." },
      { number: "18", title: "Return of amount and compensation", content: "If the promoter fails to complete or deliver possession by the agreed date, or if the allottee wishes to withdraw, the promoter shall return the full amount received with interest at the rate prescribed by RERA (typically SBI Prime Lending Rate + 2%). The allottee may also choose to continue and be paid interest for every month of delay until possession. RERA Appellate Tribunals across states have consistently ruled in favour of homebuyers in delayed projects." }
    ]
  },
  {
    name: "Registration Act", shortName: "Registration Act", year: 1908, category: "Land & Property",
    description: "Law relating to the mandatory registration of certain documents.",
    sections: [{ number: "17", title: "Compulsory registration", content: "The following documents must be compulsorily registered: (a) instruments of gift of immovable property; (b) non-testamentary instruments which purport to create, declare, assign, or extinguish rights to immovable property of value ₹100 or more (sale deeds, mortgage deeds, lease deeds exceeding 1 year); (c) non-testamentary instruments acknowledging receipt of consideration for such properties. An unregistered document which requires registration is inadmissible as evidence and cannot confer any title. Registration must be done within 4 months of execution at the Sub-Registrar's office." }]
  },
  {
    name: "Indian Trust Act", shortName: "Trust Act", year: 1882, category: "Land & Property",
    description: "The law relating to private trusts and trustees.",
    sections: [{ number: "6", title: "Creation of Trust", content: "A trust is created when the author of the trust indicates with reasonable certainty: (a) intention to create a trust; (b) the purpose of the trust; (c) the beneficiary (who can be any person capable of holding property); and (d) the trust-property. For immovable property, the trust must be declared by a non-testamentary instrument in writing signed by the author or the trustee, and registered. For movable property, ownership must be transferred to the trustee. The trust must be for a lawful purpose." }]
  },

  // --- Family Law (5) ---
  {
    name: "Hindu Marriage Act", shortName: "HMA", year: 1955, category: "Family Law",
    description: "Codifies laws related to marriage, divorce, and restitution for Hindus.",
    sections: [
      { number: "5", title: "Conditions for Hindu Marriage", content: "A Hindu marriage may be solemnized if: (a) neither party has a spouse living (monogamy); (b) neither party is incapable of giving valid consent due to unsoundness of mind or mental disorder or unfitness to marry/procreate; (c) the bridegroom has completed 21 years and the bride 18 years of age; (d) the parties are not within degrees of prohibited relationship unless custom permits; (e) the parties are not sapindas of each other. Marriage in contravention of (c) is not void but punishable." },
      { number: "9", title: "Restitution of conjugal rights", content: "When either the husband or the wife has, without reasonable excuse, withdrawn from the society of the other, the aggrieved party may apply to the District Court for restitution of conjugal rights. If the court is satisfied of the truth of the statement and there is no legal ground for not passing the decree, it may decree restitution. If the decree is not complied with for 1 year, it becomes a ground for divorce. The Supreme Court in Saroj Rani v. Sudarshan Kumar upheld the constitutional validity of this section." },
      { number: "13", title: "Divorce grounds", content: "Either party may present a petition for dissolution of marriage on grounds including: adultery (voluntary sexual intercourse outside marriage), cruelty (physical or mental), desertion for not less than 2 continuous years, conversion to another religion, unsoundness of mind, virulent and incurable leprosy, venereal disease, renunciation of the world (sanyas), or not being heard of alive for 7 years. Wife may additionally file on grounds of bigamy, rape/sodomy/bestiality by husband, or non-resumption of cohabitation after maintenance decree." },
      { number: "13B", title: "Divorce by mutual consent", content: "Both parties together may present a petition for dissolution of marriage on the ground that they have been living separately for a period of one year or more and have mutually agreed that the marriage should be dissolved. After 6 months but before 18 months of filing, a second motion must be made. The Supreme Court in Amardeep Singh v. Harveen Kaur (2017) held that the 6-month cooling period can be waived by the court in exceptional circumstances. This is the most common form of divorce in India." }
    ]
  },
  {
    name: "Special Marriage Act", shortName: "SMA", year: 1954, category: "Family Law",
    description: "Provision for a civil form of marriage for all Indian citizens regardless of religion.",
    sections: [
      { number: "4", title: "Conditions for solemnization", content: "A marriage between any two persons may be solemnized under this Act if at the time of the marriage: (a) neither party has a spouse living; (b) neither party is incapable of giving consent to it due to unsoundness of mind; (c) the male has completed 21 years and the female 18 years; and (d) the parties are not within the degrees of prohibited relationship." },
      { number: "27", title: "Divorce", content: "A petition for divorce may be presented to the district court by either the husband or the wife on the ground that the respondent has, after the solemnization of the marriage, had voluntary sexual intercourse with any person other than his/her spouse, deserted the petitioner for a continuous period of not less than two years, is undergoing a sentence of imprisonment for seven years or more, treated the petitioner with cruelty, or has been of unsound mind, among other grounds." }
    ]
  },
  {
    name: "Muslim Personal Law Application Act", shortName: "Shariat Act", year: 1937, category: "Family Law",
    description: "Mandates the application of Shariat law to Muslims in personal matters.",
    sections: [{ number: "2", title: "Application of Shariat", content: "In questions regarding marriage (nikah), dissolution of marriage (talaq, khula, mubarat), maintenance (nafaqa), dower (mahr), guardianship, gifts (hiba), trusts (waqf), and inheritance (miraas), the rule of decision in cases where the parties are Muslims shall be the Muslim Personal Law (Shariat). Muslim marriages are contractual in nature (not sacramental). Triple talaq (talaq-e-biddat) was declared unconstitutional by the Supreme Court in Shayara Bano v. Union of India (2017) and criminalized by the Muslim Women Act, 2019." }]
  },
  {
    name: "Guardians and Wards Act", shortName: "GWA", year: 1890, category: "Family Law",
    description: "Governs the appointment and duties of a minor's guardian.",
    sections: [{ number: "7", title: "Power of Court to appoint guardian", content: "The court may appoint a guardian of the person or property (or both) of a minor when the court considers it necessary for the welfare of the minor. The court shall consider: (a) the welfare of the minor as the paramount consideration; (b) the personal law of the minor; (c) the character, capacity, and stability of the proposed guardian; (d) the age, sex, and wishes of the minor (if old enough to form an intelligent preference). A minor's own parent is preferred, but the court may appoint any suitable person. The guardian must maintain the minor's property and file accounts." }]
  },
  {
    name: "Hindu Adoption and Maintenance Act", shortName: "HAMA", year: 1956, category: "Family Law",
    description: "Laws for adoption and maintenance obligations within Hindu families.",
    sections: [{ number: "18", title: "Maintenance of wife", content: "A Hindu wife, whether married before or after the commencement of this Act, shall be entitled to be maintained by her husband during her lifetime. She can live separately and still claim maintenance if the husband: is guilty of desertion, has treated her with cruelty, is suffering from virulent leprosy, has any other wife living, keeps a concubine, has converted, or if there is any other cause justifying separate living. Maintenance includes provision for food, clothing, residence, education, and medical attendance." }]
  },

  // --- Employment (4) ---
  {
    name: "Minimum Wages Act", shortName: "MWA", year: 1948, category: "Employment",
    description: "Ensures workers receive a basic minimum wage for their labor.",
    sections: [
      { number: "3", title: "Fixing minimum rates", content: "The appropriate government shall fix minimum rates of wages payable to employees in scheduled employments by notification. Different minimum rates may be fixed for different scheduled employments, classes of work, adults/adolescents/children, and different localities. The rates must be reviewed and revised at intervals not exceeding 5 years. The government can fix minimum wages by committee method (appointing committees) or notification method (publishing proposals in Official Gazette)." },
      { number: "12", title: "Payment of minimum wages", content: "Where minimum wages have been fixed, the employer shall pay to every employee wages at a rate not less than the minimum rate of wages. No deductions shall be made from wages except those authorized by or under any law (e.g., PF, ESI, TDS). Any employer who pays less than the minimum wages is liable to pay the difference amount plus compensation up to 10 times the difference. The worker can file a claim before the Authority under Section 20." },
      { number: "20", title: "Claims", content: "The appropriate government shall appoint an Authority to hear and decide claims arising out of payment of less than minimum wages, or deductions from wages in contravention of the Act. The application can be made within 1 year from the date of payment. The Authority may direct payment of the amount due and compensation of up to 10 times the underpaid amount. Both the employee and employer have the right of appeal to a higher authority within 30 days." }
    ]
  },
  {
    name: "Industrial Disputes Act", shortName: "IDA", year: 1947, category: "Employment",
    description: "Aims to maintain industrial peace and harmony by providing machinery for dispute settlement.",
    sections: [
      { number: "2(k)", title: "Industrial dispute defined", content: "An industrial dispute means any dispute or difference between employers and employers, or between employers and workmen, or between workmen and workmen, which is connected with the employment or non-employment or the terms of employment or with the conditions of labor, of any person." },
      { number: "25F", title: "Condition for retrenchment", content: "No workman employed in continuous service for not less than one year under an employer shall be retrenched until: (a) the workman has been given one month's notice in writing indicating the reasons for retrenchment and the period of notice has expired, or the workman has been paid in lieu of such notice, wages for the period; and (b) the workman has been paid, at the time of retrenchment, compensation equivalent to 15 days' average pay for every completed year of continuous service." },
      { number: "33C", title: "Recovery of money due", content: "Where any money is due to a workman from an employer under a settlement or an award, the workman himself or any authorized person may make an application to the appropriate Government for the recovery of the money due to him, and if satisfied, it shall issue a certificate for that amount to the Collector who shall proceed to recover the same." }
    ]
  },
  {
    name: "Factories Act", shortName: "Factories Act", year: 1948, category: "Employment",
    description: "Health, safety, and welfare of workers in factories.",
    sections: [{ number: "11", title: "Cleanliness", content: "Every factory shall be kept clean and free from effluvia arising from any drain, privy, or other nuisance. Effective arrangements shall be made for the disposal of wastes and effluents. The factory must be whitewashed or repainted at prescribed intervals. Floors, walls, and ceilings must be regularly cleaned. This is part of a comprehensive framework covering working hours (max 48/week), overtime (2x wages), women's employment (no night shifts unless permitted), child labour prohibition (under 14), and mandatory provision of canteens, rest rooms, and first-aid facilities." }]
  },
  {
    name: "Employee's Compensation Act", shortName: "ECA", year: 1923, category: "Employment",
    description: "Fixed compensation for employees injured in the course of employment.",
    sections: [{ number: "3", title: "Employer's liability", content: "If personal injury is caused to an employee by accident arising out of and in the course of employment, the employer shall be liable to pay compensation. For death: 50% of monthly wages x relevant factor (based on age), minimum ₹1,20,000. For permanent total disablement: 60% of monthly wages x relevant factor, minimum ₹1,40,000. For permanent partial disablement: percentage of total disablement compensation. For temporary disablement: half-monthly payment equal to 25% of monthly wages. Employer's liability is absolute  -  no proof of negligence needed." }]
  },

  // --- Consumer Rights (4) ---
  {
    name: "Consumer Protection Act", shortName: "CPA", year: 2019, category: "Consumer Rights",
    description: "Comprehensive law to protect consumers against unfair trade practices and product defects.",
    sections: [
      { number: "2(9)", title: "Consumer rights", content: "Six consumer rights are recognized: (a) Right to safety  -  protection from hazardous goods; (b) Right to be informed  -  complete product information; (c) Right to choose  -  access to variety at competitive prices; (d) Right to be heard  -  consumer's interests receive due consideration; (e) Right to seek redressal  -  settlement of genuine grievances; (f) Right to consumer education. These rights are enforceable through three-tier consumer courts." },
      { number: "2(47)", title: "Unfair trade practice", content: "Includes: false representation about the standard, quality, grade, or composition of goods/services; publishing misleading advertisements; offering gifts or prizes with intention not to provide them; product not conforming to ISI/BIS standards; hoarding or destroying goods to manipulate prices; manufacturing spurious goods. The 2019 Act also specifically covers misleading electronic advertisements and e-commerce platforms. CCPA (Central Consumer Protection Authority) can impose penalties up to ₹10 lakhs on first offence." },
      { number: "34", title: "District Commission Jurisdiction", content: "The District Commission has jurisdiction over complaints where the value of goods or services and claims for compensation does not exceed ₹1 Crore. State Commission: ₹1 Crore to ₹10 Crore. National Commission: above ₹10 Crore. Filing fee varies from ₹100 to ₹5,000 based on claim value for District Commission. The complaint must be filed within 2 years from the date of cause of action. Mediation is now an option before adjudication under the 2019 Act." },
      { number: "100", title: "Additional remedy", content: "The provisions of this Act shall be in addition to and not in derogation of any other law for the time being in force. This means a consumer can file a complaint under this Act even if remedies are available under other laws. However, the consumer cannot claim double compensation for the same cause of action. Consumer courts can award punitive damages, replacement of goods, refund with interest, and compensation for mental agony and harassment." }
    ]
  },
  {
    name: "Legal Metrology Act", shortName: "LMA", year: 2009, category: "Consumer Rights",
    description: "Standards of weights and measures; packaging rules.",
    sections: [{ number: "11", title: "Prohibition of non-standard units", content: "No person shall quote or issue any price list, invoice, or commercial document in relation to any goods, class of goods, or service in any unit of weight, measure, or numeration other than the standard unit. All prepackaged commodities must declare: name, address, quantity/weight, month and year of manufacture, expiry date, MRP, and consumer complaints address. Sale above MRP is punishable. First offence: fine up to ₹25,000; second offence: fine up to ₹50,000; third offence: fine up to ₹1 lakh and imprisonment up to 1 year." }]
  },
  {
    name: "Bureau of Indian Standards Act", shortName: "BIS Act", year: 2016, category: "Consumer Rights",
    description: "Product quality certification and standard setting.",
    sections: [{ number: "13", title: "Indian Standards", content: "The Bureau of Indian Standards (BIS) has authority to establish, publish, and promote Indian Standards for goods, services, and processes. BIS grants licences to use the Standard Mark (ISI mark) on products that conform to Indian Standards. Certain products require mandatory BIS certification (helmets, cement, LPG cylinders, packaged drinking water, electrical appliances, etc.). Using ISI mark without licence is punishable with imprisonment up to 2 years and fine up to ₹5 lakhs. BIS also handles Hallmarking of gold jewellery (mandatory since 2021)." }]
  },
  {
    name: "Competition Act", shortName: "Competition Act", year: 2002, category: "Consumer Rights",
    description: "Prevention of practices having an adverse effect on market competition.",
    sections: [{ number: "3", title: "Anti-competitive agreements", content: "Any agreement in respect of production, supply, distribution, storage, acquisition, or control of goods/services which causes or is likely to cause an appreciable adverse effect on competition (AAEC) within India is void. Horizontal agreements (between competitors) including price-fixing, market sharing, bid-rigging, and output limitation are presumed to have AAEC. Vertical agreements (e.g., tie-in, exclusive supply/distribution, refusal to deal, resale price maintenance) are assessed on rule of reason. Penalty: up to 10% of average turnover for preceding 3 years; for cartels: up to 3x the profit or 10% of turnover." }]
  },

  // --- Business Law (5) ---
  {
    name: "Indian Contract Act", shortName: "Contract Act", year: 1872, category: "Business Law",
    description: "Sets the rules for creating, executing, and breaking legal agreements.",
    sections: [
      { number: "2(h)", title: "Contract defined", content: "An agreement enforceable by law is a contract. Agreements are promises or sets of promises forming consideration for each other. A promise is an accepted proposal. For a valid contract, there must be: offer and acceptance, free consent (not by coercion, undue influence, fraud, misrepresentation, or mistake), lawful consideration, lawful object, competent parties, and it should not be expressly declared void (e.g., wagering agreements under Sec 30)." },
      { number: "10", title: "Competency to contract", content: "Every person is competent to contract who is: (a) of the age of majority (18 years, or 21 if guardian appointed by court); (b) of sound mind at the time of making the contract; and (c) not disqualified from contracting by any law. Consent is free when not caused by coercion (Sec 15), undue influence (Sec 16), fraud (Sec 17), misrepresentation (Sec 18), or mistake of fact (Sec 20). A contract by a minor is void ab initio (not merely voidable) as per Mohori Bibee v. Dharmodas Ghose." },
      { number: "73", title: "Compensation for loss", content: "When a contract has been broken, the party who suffers by such breach is entitled to receive compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach, or which the parties knew at the time of contract would be likely to result from the breach. Such compensation is not to be given for any remote and indirect loss or damage sustained by reason of the breach. This codifies the principles from Hadley v. Baxendale." }
    ]
  },
  {
    name: "Companies Act", shortName: "Companies Act", year: 2013, category: "Business Law",
    description: "Consolidated law for the formation and regulation of companies in India.",
    sections: [
      { number: "2(20)", title: "Company defined", content: "A company means a company incorporated under this Act or under any previous company law. This imparts a distinct legal entity to the organization separate from its members, allowing it to own property, incur debts, and sue or be sued in its own name." },
      { number: "135", title: "Corporate Social Responsibility", content: "Every company having net worth of ₹500 crore or more, turnover of ₹1,000 crore or more, or net profit of ₹5 crore or more during the immediately preceding financial year shall constitute a Corporate Social Responsibility Committee. The Board shall ensure that the company spends, in every financial year, at least 2% of the average net profits made during the three immediately preceding financial years towards CSR." },
      { number: "403", title: "Fee for filing", content: "Any document, required to be submitted, filed, registered or recorded under this Act, shall be submitted within the time specified on payment of such fee as may be prescribed. Any non-compliance might lead to additional fees or penalties, and directors may be held liable." }
    ]
  },
  {
    name: "Partnership Act", shortName: "Partnership Act", year: 1932, category: "Business Law",
    description: "Relation between persons who have agreed to share profits of a business.",
    sections: [{ number: "4", title: "Partnership defined", content: "Partnership is the relation between persons who have agreed to share the profits of a business carried on by all or any of them acting for all. The business must be carried on by all or any of the partners acting for all (mutual agency). Maximum partners: 50 (no upper limit for banking/professional firms). A partnership firm can hold property, sue and be sued in its firm name if registered. Registration is not mandatory but an unregistered firm cannot enforce any right arising from contract in any court. Partners have unlimited liability for the debts of the firm." }]
  },
  {
    name: "Negotiable Instruments Act", shortName: "NI Act", year: 1881, category: "Business Law",
    description: "Promissory notes, bills of exchange, and cheques.",
    sections: [{ number: "138", title: "Cheque bounce", content: "Where a cheque drawn for the discharge of any liability is returned unpaid due to insufficiency of funds, the drawer shall be punished with imprisonment up to 2 years, or fine up to twice the cheque amount, or both. Conditions: (a) cheque must be presented within 6 months or validity period; (b) payee must give written notice demanding payment within 30 days of dishonour; (c) drawer must fail to pay within 15 days of receipt of notice. Complaint must be filed within 1 month of expiry of the 15-day period. The Supreme Court in Dayawati v. Yogesh Kumar held this is a strict liability offence." }]
  },
  {
    name: "Insolvency and Bankruptcy Code", shortName: "IBC", year: 2016, category: "Business Law",
    description: "Time-bound process for resolving insolvency in companies and individuals.",
    sections: [{ number: "7", title: "Initiation by financial creditor", content: "A financial creditor (either by itself or jointly with other financial creditors) may file an application before NCLT for initiating Corporate Insolvency Resolution Process (CIRP) against a corporate debtor when a default of ₹1 crore or more has occurred. The NCLT must admit or reject the application within 14 days. Upon admission, a moratorium is declared (no suits, no recovery, no transfer of assets), and an Interim Resolution Professional is appointed. The entire CIRP must be completed within 330 days (including litigation time). If no resolution plan is approved, the company goes into liquidation." }]
  },

  // --- Cyber Law (4) ---
  {
    name: "Information Technology Act", shortName: "IT Act", year: 2000, category: "Cyber Law",
    description: "Legal framework for electronic governance, e-commerce, and cybercrime punishment.",
    sections: [
      { number: "43", title: "Penalty for damage to computer", content: "If any person without permission of the owner or person in charge: accesses or secures access to a computer, downloads, copies, or extracts any data, introduces any computer virus or contaminant, damages or disrupts a computer system  -  he shall be liable to pay compensation up to ₹1 crore per incident. This section applies to unauthorized access, data theft, introducing malware, denial of service attacks, and any tampering with computer source code." },
      { number: "66C", title: "Identity theft", content: "Whoever, fraudulently or dishonestly makes use of the electronic signature, password, or any other unique identification feature of any other person, shall be punished with imprisonment up to 3 years and fine up to ₹1 lakh. This covers using someone else's social media accounts, email credentials, Aadhaar number, or digital certificates for fraudulent purposes. The number of cases under this section has increased 5x in recent years with growing digital transactions." },
      { number: "66D", title: "Cheating by personation using computer resource", content: "Whoever, by means of any communication device or computer resource, cheats by personating, shall be punished with imprisonment up to 3 years and fine up to ₹1 lakh. This covers phishing attacks, fake websites mimicking banks/government portals, impersonation on social media, and fraudulent emails/calls to trick victims into sharing sensitive information. Complaints can be filed at cybercrime.gov.in or the nearest Cyber Crime Cell." },
      { number: "67", title: "Obscene material in electronic form", content: "Whoever publishes or transmits or causes to be published in electronic form any material which is lascivious or appeals to the prurient interest shall be punished on first conviction with imprisonment up to 3 years and fine up to ₹5 lakhs; on second conviction up to 5 years and ₹10 lakhs fine. Section 67A (sexually explicit material): up to 5 years and ₹10 lakhs. Section 67B (child pornography): up to 5 years and ₹10 lakhs on first conviction, up to 7 years and ₹10 lakhs on second." }
    ]
  },
  {
    name: "Digital Personal Data Protection Act", shortName: "DPDP", year: 2023, category: "Cyber Law",
    description: "Regulates the processing of digital personal data while respecting individuals' privacy.",
    sections: [
      { number: "4", title: "Processing grounds", content: "A person may process the personal data of a Data Principal only in accordance with the provisions of this Act and for a lawful purpose, (a) for which the Data Principal has given her consent; or (b) for certain legitimate uses. Legitimate uses include situations where the Data Principal has voluntarily provided her personal data to the Data Fiduciary." },
      { number: "8", title: "Data Fiduciary obligations", content: "A Data Fiduciary shall be responsible for complying with the provisions of this Act. It includes ensuring completeness, accuracy, and consistency of personal data, implementing appropriate technical and organizational measures for security, and protecting personal data by taking reasonable security safeguards to prevent personal data breach." },
      { number: "15", title: "Right to grievance redressal", content: "A Data Principal shall have the right to have readily available means of grievance redressal provided by a Data Fiduciary or Consent Manager in respect of any act or omission regarding the performance of its obligations in relation to the personal data of such Data Principal." }
    ]
  },
  {
    name: "Aadhaar Act", shortName: "Aadhaar Act", year: 2016, category: "Cyber Law",
    description: "Targeted delivery of subsidies and benefits using biometric identification.",
    sections: [{ number: "29", title: "Restriction on sharing information", content: "Core biometric information (fingerprint, iris scan) collected under this Act shall not be shared with anyone for any reason whatsoever, nor shall it be used for any purpose other than generation of Aadhaar numbers and authentication. Identity information, other than core biometric, may be shared only with the consent of the Aadhaar number holder or pursuant to a court order. The Supreme Court in K.S. Puttaswamy v. Union of India upheld Aadhaar's validity but struck down Section 57 (use by private entities), mandatory linking with bank accounts and mobile numbers, and made authentication voluntary for most services." }]
  },
  {
    name: "Computer Emergency Response Team Rules", shortName: "CERT Rules", year: 2013, category: "Cyber Law",
    description: "Incident reporting and coordination for cyber security.",
    sections: [{ number: "12", title: "Mandatory reporting", content: "All service providers, intermediaries, data centres, and body corporates must mandatorily report specified cyber security incidents to CERT-In within 6 hours of noticing or being brought to notice. Reportable incidents include: targeted scanning/probing, compromise of critical systems, unauthorized access, website defacement, malware attacks, data breaches, DDoS attacks, attacks on IoT devices, and fake mobile apps. CERT-In may also issue directions for blocking websites or content in the interest of cyber security. Non-compliance may result in imprisonment up to 1 year or fine up to ₹1 lakh." }]
  },

  // --- Health & Medical (5) ---
  {
    name: "Medical Termination of Pregnancy Act", shortName: "MTP Act", year: 1971, category: "Health & Medical",
    description: "Specific conditions under which pregnancies can be legally terminated in India.",
    sections: [
      { number: "3", title: "When termination is legal", content: "A pregnancy may be terminated by a registered medical practitioner if the length of the pregnancy doesn't exceed 20 weeks, or by two practitioners if it exceeds 20 weeks but doesn't exceed 24 weeks for certain categories. They must opine in good faith that the continuance of the pregnancy would involve a risk to the life of the pregnant woman or of grave injury to her physical or mental health, or a substantial risk of physical/mental abnormality for the child." },
      { number: "5", title: "Emergency termination", content: "The provisions relating to the length of the pregnancy and the opinion of not less than two registered medical practitioners shall not apply to the termination of a pregnancy by a registered medical practitioner in a case where he is of opinion, formed in good faith, that the termination of such pregnancy is immediately necessary to save the life of the pregnant woman." }
    ]
  },
  {
    name: "Mental Healthcare Act", shortName: "MHCA", year: 2017, category: "Health & Medical",
    description: "Rights based law to provide mental healthcare and ensure dignity for persons with mental illness.",
    sections: [
      { number: "18", title: "Right to access healthcare", content: "Every person shall have a right to access mental healthcare and treatment from mental health establishments run or funded by the appropriate Government. This right includes provision of acute mental healthcare services, half-way homes, sheltered accommodation, and supported accommodation to ensure that no person is discriminated against on the basis of mental illness." },
      { number: "115", title: "Decriminalization of suicide", content: "Notwithstanding anything contained in section 309 of the Indian Penal Code, any person who attempts to commit suicide shall be presumed, unless proved otherwise, to have severe stress and shall not be tried and punished. The appropriate Government shall have a duty to provide care, treatment and rehabilitation to a person to reduce the risk of recurrence." }
    ]
  },
  {
    name: "Drugs and Cosmetics Act", shortName: "D&C Act", year: 1940, category: "Health & Medical",
    description: "Standards for import, manufacture, and sale of drugs and cosmetics.",
    sections: [{ number: "18", title: "Prohibition of manufacture", content: "No person shall manufacture for sale, sell, stock, exhibit, or distribute any drug which is misbranded (misleading label), adulterated (substandard ingredients), or spurious (imitation/counterfeit). Manufacture requires a licence from the State Drug Controller. Import requires approval from the Central Drugs Standard Control Organisation (CDSCO). Sale of misbranded drugs: imprisonment up to 1 year and fine up to ₹20,000. Sale of adulterated drugs: up to 3 years and ₹50,000 fine. Sale of spurious drugs: up to life imprisonment and fine up to ₹10 lakhs or 3x the value of confiscated drugs." }]
  },
  {
    name: "Transplantation of Human Organs Act", shortName: "THOA", year: 1994, category: "Health & Medical",
    description: "Regulation of removal, storage, and transplantation of human organs and tissues.",
    sections: [{ number: "18", title: "Illegal organ removal", content: "Any person who renders services for or abets the removal of any human organ without authority is punishable with imprisonment of 5-10 years and fine of ₹20 lakhs to ₹1 crore. Organ donation from living donors is permitted only to near relatives (spouse, parents, siblings, children). Non-related donors require approval from the Authorization Committee constituted by the appropriate government. Commercial dealing in human organs is strictly prohibited. Any intermediary (tout/agent) facilitating illegal organ trade faces the same punishment. Brain death was legally recognized as death for the purposes of organ transplantation." }]
  },
  {
    name: "Pre-Conception and Pre-Natal Diagnostic Techniques Act", shortName: "PCPNDT", year: 1994, category: "Health & Medical",
    description: "Prohibits sex selection before or after conception; prevents female feticide.",
    sections: [{ number: "3A", title: "Prohibition of sex selection", content: "No person, including a specialist or team of specialists, shall conduct or cause to be conducted or aid in any pre-conception or pre-natal sex determination technique on any woman for the purpose of detecting the sex of a foetus. All genetic counselling centres, laboratories, and clinics must be registered. Advertising sex determination is prohibited. Penalty for contravention: first offence  -  imprisonment up to 3 years and fine up to ₹10,000; subsequent offence  -  imprisonment of 3-5 years and fine of ₹50,000 to ₹1,00,000. Medical practitioners face suspension/cancellation of registration alongside criminal penalties." }]
  },

  // --- Education Law (3) ---
  {
    name: "Right to Education Act", shortName: "RTE", year: 2009, category: "Education Law",
    description: "Guarantee of free and compulsory education for all children between 6 and 14 years.",
    sections: [
      { number: "3", title: "Right to free primary education", content: "Every child of the age of 6-14 years has a right to free and compulsory education in a neighbourhood school till completion of elementary education (Class 8). 'Free' means no child shall be liable to pay any fees or charges or expenses which prevent access. 'Compulsory' means the appropriate government and local authority must ensure admission, attendance, and completion. No child shall be denied admission on any grounds including birth certificate. Age-appropriate admission is guaranteed for out-of-school children." },
      { number: "12", title: "25% Reservation in private schools", content: "All schools (not run wholly by government) shall admit at least 25% of their class strength from children belonging to weaker sections and disadvantaged groups in Class 1 (or pre-primary). The school shall be reimbursed by the government at per-child expenditure or the actual amount charged (whichever is less). The Supreme Court in Society for Unaided Private Schools v. Union of India upheld this provision as constitutional. This applies to aided and unaided private schools but not minority institutions." },
      { number: "13", title: "No capitation fee and screening", content: "No school or person shall, while admitting a child, collect any capitation fee or subject the child or parents to any screening procedure. 'Capitation fee' means any kind of donation, contribution, or payment other than the notified fee. Any school contravening this shall be liable to fine up to 10 times the capitation fee charged; for screening, fine of ₹25,000 for first contravention and ₹50,000 for each subsequent contravention. The aim is to ensure equitable access regardless of economic status." }
    ]
  },
  {
    name: "University Grants Commission Act", shortName: "UGC Act", year: 1956, category: "Education Law",
    description: "Coordination and determination of standards in Universities.",
    sections: [{ number: "22", title: "Right to confer degrees", content: "Only a university established by law or an institution deemed to be a university or an institution specially empowered by an Act of Parliament shall have the right to confer or grant degrees. Any person who issues, grants, or awards a degree without authorization shall be punishable with imprisonment up to 3 years or fine up to ₹1,000 or both. The UGC maintains a list of recognized universities and has power to de-recognize institutions not meeting prescribed standards. Deemed university status can be granted by the Central Government on UGC recommendation." }]
  },
  {
    name: "AICTE Act", shortName: "AICTE Act", year: 1987, category: "Education Law",
    description: "Planning and development of technical education system in India.",
    sections: [{ number: "10", title: "Functional mandate", content: "AICTE is mandated to: (a) grant approval for establishing new technical institutions and introduce new courses/programmes in all disciplines of engineering, technology, management, architecture, pharmacy, applied arts, and hotel management; (b) fix norms for intake capacity, fees, faculty qualifications, and infrastructure; (c) promote quality and innovation in technical education; (d) conduct inspection and ensure compliance. Institutions operating without AICTE approval are illegal and degrees granted by them are invalid. AICTE can impose penalties including withdrawal of approval and debarring admissions." }]
  },

  // --- Human Rights (3) ---
  {
    name: "Protection of Human Rights Act", shortName: "PHRA", year: 1993, category: "Human Rights",
    description: "Establishes the National and State Human Rights Commissions to protect citizens' liberties.",
    sections: [
      { number: "12", title: "Functions of NHRC", content: "The Commission shall inquire, suo motu or on a petition presented to it by a victim or any person on his behalf, into complaint of (i) violation of human rights or abetment thereof; or (ii) negligence in the prevention of such violation, by a public servant; intervene in any proceeding involving allegation of human rights violation; and visit any jail or other institution to study the living conditions." },
      { number: "18", title: "Steps during inquiry", content: "Upon the completion of an inquiry held under this Act, where the inquiry discloses the commission of violation of human rights or negligence in the prevention of violation of human rights by a public servant, the Commission may recommend to the concerned Government or authority to make payment of compensation or damages to the complainant or to the victim or the members of his family." }
    ]
  },
  {
    name: "Domestic Violence Act", shortName: "DV Act", year: 2005, category: "Human Rights",
    description: "Protects women from physical, sexual, emotional, and economic abuse within a domestic relationship.",
    sections: [
      { number: "3", title: "Definition of domestic violence", content: "Domestic violence includes: (a) Physical abuse  -  any act causing bodily pain, harm, or danger to life, limb, or health; (b) Sexual abuse  -  any conduct of a sexual nature that abuses, humiliates, degrades, or violates dignity; (c) Verbal and emotional abuse  -  insults, ridicule, name calling, threats to cause physical pain, repeated accusations of having an affair; (d) Economic abuse  -  deprivation of economic or financial resources, disposal of household assets, restriction of access to resources the woman is entitled to." },
      { number: "18", title: "Protection orders", content: "The Magistrate may pass a Protection Order prohibiting the respondent from: committing any act of domestic violence, aiding or abetting domestic violence, entering the workplace or school of the aggrieved person, attempting to communicate in any form, isolating or cutting off assets used by the aggrieved person, causing violence to dependants or relatives, or any other act specified in the protection order. Breach of protection order is a cognizable and non-bailable offence punishable with imprisonment up to 1 year and/or fine up to ₹20,000." }
    ]
  },
  {
    name: "Juvenile Justice Act", shortName: "JJ Act", year: 2015, category: "Human Rights",
    description: "Law for children in conflict with law and children in need of care and protection.",
    sections: [{ number: "15", title: "Heinous offences by juveniles aged 16-18", content: "In case of a heinous offence (minimum punishment of 7 years or more) alleged to have been committed by a child aged 16-18, the Juvenile Justice Board shall conduct a preliminary assessment regarding mental and physical capacity, ability to understand consequences, and circumstances of the offence. If the Board is satisfied, the case may be transferred to the Children's Court which may try the child as an adult. However, the maximum sentence for a juvenile is 3 years in a Special Home, with provision for periodic review. This amendment was introduced after the 2012 Delhi gang rape case where one accused was a juvenile." }]
  }
];

const seedActs = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await LegalAct.deleteMany({});
    console.log("Cleared existing legal acts");

    await LegalAct.insertMany(acts);
    console.log(`Successfully seeded ${acts.length} legal acts!`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedActs();
