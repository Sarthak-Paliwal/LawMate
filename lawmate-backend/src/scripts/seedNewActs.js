const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const LegalAct = require('../models/LegalAct');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const newActs = [
  // --- Constitution (additional) ---
  {
    name: "Citizenship Act", shortName: "Citizenship Act", year: 1955, category: "Constitution",
    description: "Law on acquisition and loss of Indian citizenship.",
    sections: [
      { number: "3", title: "Citizenship by birth", content: "Every person born in India on or after 26.01.1950 but before 01.07.1987 is a citizen of India by birth irrespective of the nationality of his parents. For persons born between 01.07.1987 and 03.12.2004, at least one parent must be an Indian citizen. For those born on or after 03.12.2004, either both parents must be citizens or one a citizen and the other not an illegal migrant." },
      { number: "5", title: "Citizenship by registration", content: "Persons of Indian origin who are ordinarily resident in India for seven years can apply for citizenship by registration. This also applies to persons married to an Indian citizen and ordinarily resident in India for seven years, and minor children of Indian citizens. The applicant must take an oath of allegiance to the Indian Constitution before being registered." },
      { number: "9", title: "Termination of citizenship", content: "Any citizen of India who by naturalization, registration or otherwise voluntarily acquires the citizenship of another country shall, upon such acquisition, cease to be a citizen of India. This is because the Indian Constitution does not allow dual citizenship. However, this rule does not apply during any war in which India may be engaged." }
    ]
  },
  {
    name: "Citizenship (Amendment) Act", shortName: "CAA", year: 2019, category: "Constitution",
    description: "Amends Citizenship Act to grant citizenship to persecuted minorities from Pakistan, Bangladesh, and Afghanistan.",
    sections: [{ number: "2", title: "Amendment of Section 2", content: "Provides that Hindus, Sikhs, Buddhists, Jains, Parsis, and Christians from Afghanistan, Bangladesh, and Pakistan, who entered India on or before 31st December 2014, and who have been exempted by the Central Government, shall not be treated as illegal migrants. They face an expedited path to citizenship compared to the standard 11-year requirement." }]
  },
  {
    name: "Foreigners Act", shortName: "Foreigners Act", year: 1946, category: "Constitution",
    description: "Powers to deal with foreigners in India, including deportation.",
    sections: [{ number: "3", title: "Power to make orders", content: "The Central Government may by order make provision for prohibiting, regulating, or restricting the entry of foreigners into India or their departure. This includes requiring foreigners to reside in a particular place, imposing restrictions on their movements, or requiring them to furnish proof of identity and report to prescribed authorities continuously." }]
  },
  {
    name: "Passport Act", shortName: "Passport Act", year: 1967, category: "Constitution",
    description: "Regulation of issuance and usage of passports and travel documents.",
    sections: [{ number: "3", title: "Passport necessary for departure", content: "No person shall depart from, or attempt to depart from, India unless he holds in this behalf a valid passport or travel document. Contravening this provision is punishable with imprisonment for a term which may extend to two years or with fine. The passport is a mandatory document establishing identity and nationality of the individual traveling." }]
  },

  // --- Criminal Defense (additional) ---
  {
    name: "Dowry Prohibition Act", shortName: "Dowry Act", year: 1961, category: "Criminal Defense",
    description: "Prohibits the giving or taking of dowry.",
    sections: [
      { number: "2", title: "Definition of dowry", content: "Dowry means any property or valuable security given or agreed to be given, directly or indirectly, by one party to a marriage to the other party, or by their parents, at or before or after the marriage in connection with the marriage. It explicitly excludes dower or mahr in the case of persons to whom the Muslim Personal Law applies." },
      { number: "3", title: "Penalty for giving or taking dowry", content: "If any person gives or takes or abets the giving or taking of dowry, they shall be punishable with imprisonment for a term which shall not be less than five years, and with fine which shall not be less than fifteen thousand rupees or the amount of the value of such dowry. Voluntary customary gifts are exempt if no demand was made." },
      { number: "6", title: "Dowry to be for the benefit of the wife", content: "Where any dowry is received by any person other than the woman in connection with whose marriage it is given, that person must transfer it to the woman within three months after the date of marriage or receipt. Failure to transfer the property is punishable with imprisonment up to two years." }
    ]
  },
  {
    name: "SC/ST (Prevention of Atrocities) Act", shortName: "SC/ST Act", year: 1989, category: "Criminal Defense",
    description: "Prevents atrocities and discrimination against Scheduled Castes and Scheduled Tribes.",
    sections: [
      { number: "3", title: "Punishments for offences", content: "Prescribes severe punishments for various atrocities including assault, forced labor, land dispossession, social boycott, making derogatory remarks in public, and parading individuals naked. Minimum imprisonment is usually six months, extending up to five years, and with a fine. Some severe offences carry life imprisonment or the death penalty if they result in murder." },
      { number: "14", title: "Special Courts", content: "The State Government shall establish or specify for each district a Special Court and an Exclusive Special Court to try the offences under this Act to ensure speedy trials. These courts are specifically tasked with handling cases of atrocities to prevent delays and ensure justice for marginalized communities." },
      { number: "15A", title: "Duties of public servants", content: "It defines strict duties for public servants, including police officers, who shall not fail to register FIRs or investigate cases under this Act. Neglect of duties by a public servant (not being a member of SC/ST) is punishable with imprisonment for a term of six months to one year." }
    ]
  },
  {
    name: "Explosive Substances Act", shortName: "Explosives Act", year: 1908, category: "Criminal Defense",
    description: "Law relating to regulation, manufacture, possession, and transport of explosives.",
    sections: [{ number: "3", title: "Punishment for causing explosion", content: "Any person who unlawfully and maliciously causes by any explosive substance an explosion of a nature likely to endanger life or to cause serious injury to property shall, whether any injury to person or property has been actually caused or not, be punished with life imprisonment, or rigorous imprisonment which may extend to ten years." }]
  },
  {
    name: "Prevention of Corruption Act", shortName: "PCA", year: 1988, category: "Criminal Defense",
    description: "Law to combat corruption among public servants.",
    sections: [
      { number: "7", title: "Taking gratification", content: "Any public servant who obtains, accepts, or attempts to obtain an undue advantage with the intention to perform or cause performance of public duty improperly or dishonestly shall be punishable with imprisonment for a term of three to seven years and shall also be liable to fine. This covers any gratification other than legal remuneration." },
      { number: "13", title: "Criminal misconduct by a public servant", content: "A public servant is said to commit criminal misconduct if he misappropriates property entrusted to him or if he intentionally enriches himself illicitly during the period of his office. This includes the possession of disproportionate assets for which he cannot satisfactorily account. The punishment is imprisonment for four to ten years." }
    ]
  },
  {
    name: "Prevention of Money Laundering Act", shortName: "PMLA", year: 2002, category: "Criminal Defense",
    description: "Prevention of money-laundering and confiscation of property derived from laundering.",
    sections: [
      { number: "3", title: "Offence of money-laundering", content: "Whosoever directly or indirectly attempts to indulge or knowingly assists or is a party or is actually involved in any process or activity connected with the proceeds of crime including its concealment, possession, acquisition or use and projecting or claiming it as untainted property shall be guilty of offence of money-laundering." },
      { number: "5", title: "Attachment of property", content: "The Director or any other authorized officer may, if he has reason to believe that any person is in possession of proceeds of crime, provisionally attach such property for a period not exceeding 180 days. This prevents the disposal or transfer of property while proceedings are pending before the Adjudicating Authority." }
    ]
  },
  {
    name: "Unlawful Activities (Prevention) Act", shortName: "UAPA", year: 1967, category: "Criminal Defense",
    description: "Prevention of unlawful activities of individuals and associations; anti-terrorism law.",
    sections: [
      { number: "15", title: "Terrorist act", content: "Any act performed with intent to threaten the unity, integrity, security, economic security, or sovereignty of India or with intent to strike terror in the people, using bombs, dynamite, poisonous gases, or other lethal weapons or substances. A terrorist act includes kidnapping and cyber-terrorism." },
      { number: "43D", title: "Modified application of certain provisions", content: "A person accused of a terrorist offence shall not be released on bail if the court, on perusing the case diary or the report under section 173 of the Code, is of the opinion that there are reasonable grounds for believing that the accusation against such person is prima facie true. This reverses the normal rule of 'bail, not jail'." }
    ]
  },
  {
    name: "Indian Evidence Act", shortName: "IEA", year: 1872, category: "Criminal Defense",
    description: "Rules governing the admissibility of evidence in judicial proceedings.",
    sections: [
      { number: "113A", title: "Presumption as to abetment of suicide by married woman", content: "If a woman commits suicide within seven years of her marriage and it is shown that her husband or any relative of her husband subjected her to cruelty, the court may presume, having regard to all the other circumstances of the case, that such suicide had been abetted by her husband or relative." },
      { number: "113B", title: "Presumption as to dowry death", content: "When the question is whether a person has committed the dowry death of a woman and it is shown that soon before her death such woman had been subjected to cruelty or harassment for, or in connection with, any demand for dowry, the court shall presume that such person had caused the dowry death." },
      { number: "114", title: "Court may presume existence of certain facts", content: "The Court may presume the existence of any fact which it thinks likely to have happened, regard being had to the common course of natural events, human conduct and public and private business. For example, it may presume that a man in possession of stolen goods soon after the theft is either the thief or has received the goods knowing them to be stolen." }
    ]
  },

  // --- Land & Property (additional) ---
  {
    name: "Land Acquisition Act", shortName: "LARR", year: 2013, category: "Land & Property",
    description: "Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act.",
    sections: [
      { number: "26", title: "Determination of market value", content: "The Collector shall determine the market value of the land by assessing the highest of: the minimum land value specified in the Indian Stamp Act, the average sale price of similar type of land situated in the nearest village, or the consented amount of compensation as agreed upon in case of acquisition for PPP projects." },
      { number: "27", title: "Solatium and multiplier", content: "A solatium amount equivalent to 100% of the compensation amount shall be added to the market value. For rural land, a multiplier factor ranging from 1 to 2, depending on the distance of the project from the urban area, shall be applied to calculate the final compensation amount to offset the loss of livelihood." },
      { number: "40", title: "Rehabilitation and Resettlement Award", content: "The Administrator shall pass a Rehabilitation and Resettlement Award for each affected family detailing provisions for housing, land-for-land (where applicable), one-time financial assistance, annuity payments, and employment opportunities to ensure they are not left impoverished by the acquisition." }
    ]
  },
  {
    name: "Indian Stamp Act", shortName: "Stamp Act", year: 1899, category: "Land & Property",
    description: "Law relating to stamp duty on instruments and documents.",
    sections: [{ number: "3", title: "Instruments chargeable with duty", content: "Every instrument mentioned in Schedule I (like conveyances, leases, mortgages, trust deeds) shall be chargeable with the duty of the amount indicated in that Schedule. Proper stamping is a prerequisite for a document to be legally recognized and accepted as evidence in any court or public office." }]
  },
  {
    name: "Indian Succession Act", shortName: "Succession Act", year: 1925, category: "Land & Property",
    description: "Law on wills, intestate succession, and administration of estates for non-Hindus.",
    sections: [{ number: "63", title: "Execution of unprivileged wills", content: "The testator shall sign or affix his mark to the will, or it shall be signed by some other person in his presence and by his direction. The signature or mark shall be so placed that it shall appear that it was intended to give effect to the writing as a will. The will must be attested by two or more witnesses." }]
  },
  {
    name: "Cooperative Societies Act", shortName: "Co-op Act", year: 1912, category: "Land & Property",
    description: "Registration and management of cooperative societies.",
    sections: [{ number: "4", title: "Conditions of registration", content: "A society which has as its object the promotion of the economic interests of its members in accordance with cooperative principles, or a society established with the object of facilitating the operations of such a society, may be registered under this Act with or without limited liability." }]
  },
  {
    name: "Hindu Succession Act", shortName: "HSA", year: 1956, category: "Land & Property",
    description: "Law of intestate succession among Hindus; gives women equal coparcenary rights.",
    sections: [
      { number: "6", title: "Devolution of interest in coparcenary property", content: "Due to the 2005 Amendment, the daughter of a coparcener shall by birth become a coparcener in her own right in the same manner as the son. She shall have the same rights in the coparcenary property as she would have had if she had been a son, and she is subject to the same liabilities." },
      { number: "14", title: "Property of female Hindu to be her absolute property", content: "Any property possessed by a female Hindu, whether acquired before or after the commencement of this Act, shall be held by her as full owner thereof and not as a limited owner. This completely abolished the concept of a 'Hindu Woman's Estate' where a woman only had lifelong usage rights without the power to alienate." }
    ]
  },

  // --- Family Law (additional) ---
  {
    name: "Protection of Women from Domestic Violence Act", shortName: "PWDVA", year: 2005, category: "Family Law",
    description: "Civil law for protection of women from domestic violence including physical, sexual, verbal, emotional, and economic abuse.",
    sections: [
      { number: "12", title: "Application to Magistrate", content: "An aggrieved person or a Protection Officer or any other person on behalf of the aggrieved person may present an application to the Magistrate seeking one or more reliefs under this Act. The Magistrate shall fix the first hearing date within three days and endeavor to dispose of every application within sixty days." },
      { number: "17", title: "Right to reside in shared household", content: "Every woman in a domestic relationship shall have the right to reside in the shared household, whether or not she has any right, title or beneficial interest in the same. The aggrieved person shall not be evicted or excluded from the shared household except in accordance with the procedure established by law." },
      { number: "19", title: "Residence orders", content: "While disposing of an application, the Magistrate may pass a residence order restraining the respondent from dispossessing or disturbing the possessions of the aggrieved person from the shared household, directing the respondent to remove himself from the shared household, or restraining him from entering any portion where the aggrieved person resides." },
      { number: "20", title: "Monetary relief", content: "The Magistrate may direct the respondent to pay monetary relief to meet the expenses incurred and losses suffered by the aggrieved person and any child of the aggrieved person as a result of the domestic violence. This includes medical expenses, loss of earnings, loss due to destruction of property, and maintenance." }
    ]
  },
  {
    name: "Muslim Women (Protection of Rights on Divorce) Act", shortName: "Muslim Women Act", year: 1986, category: "Family Law",
    description: "Rights of Muslim women on divorce including maintenance and mahr.",
    sections: [{ number: "3", title: "Mahr and maintenance", content: "A divorced Muslim woman is entitled to a reasonable and fair provision and maintenance to be made and paid to her within the iddat period by her former husband. She is also entitled to an amount equal to the sum of mahr or dower agreed to be paid to her at the time of her marriage or at any time thereafter, and all properties given to her." }]
  },
  {
    name: "Hindu Minority and Guardianship Act", shortName: "HMGA", year: 1956, category: "Family Law",
    description: "Guardianship of Hindu minors and their property.",
    sections: [{ number: "6", title: "Natural guardians", content: "The natural guardians of a Hindu minor, in respect of the minor's person as well as property, are the father, and after him, the mother. However, the custody of a minor who has not completed the age of five years shall ordinarily be with the mother. For an illegitimate boy or an illegitimate unmarried girl, the natural guardian is the mother, and after her, the father." }]
  },
  {
    name: "Indian Divorce Act", shortName: "IDA", year: 1869, category: "Family Law",
    description: "Law governing divorce among Christians in India.",
    sections: [{ number: "10", title: "Grounds for dissolution", content: "Either the husband or the wife may present a petition to the District Court for dissolution of marriage on the grounds that the respondent has committed adultery, ceased to be a Christian by conversion to another religion, has been of unsound mind, has been suffering from a virulent and incurable form of leprosy, or has treated the petitioner with cruelty such as to cause a reasonable apprehension of harm." }]
  },
  {
    name: "Prohibition of Child Marriage Act", shortName: "PCMA", year: 2006, category: "Family Law",
    description: "Prevents solemnization of child marriages.",
    sections: [
      { number: "3", title: "Child marriage to be voidable", content: "Every child marriage, whether solemnized before or after the commencement of this Act, shall be voidable at the option of the contracting party who was a child at the time of the marriage. A petition for annulling a child marriage by a decree of nullity may be filed in the district court within two years of attaining the age of majority." },
      { number: "9", title: "Punishment for male adult", content: "Whoever, being a male adult above eighteen years of age, contracts a child marriage shall be punishable with rigorous imprisonment which may extend to two years or with fine which may extend to one lakh rupees or with both. The law emphasizes punishing adults partaking in such marriages." }
    ]
  },

  // --- Employment (additional) ---
  {
    name: "Sexual Harassment of Women at Workplace Act", shortName: "POSH Act", year: 2013, category: "Employment",
    description: "Prevention, prohibition, and redressal of sexual harassment of women at workplace.",
    sections: [
      { number: "2(n)", title: "Sexual harassment defined", content: "Sexual harassment includes any one or more of the following unwelcome acts or behavior: physical contact and advances, a demand or request for sexual favours, making sexually coloured remarks, showing pornography, or any other unwelcome physical, verbal or non-verbal conduct of sexual nature." },
      { number: "4", title: "Internal Complaints Committee", content: "Every employer of a workplace where ten or more workers are employed must constitute an Internal Complaints Committee (ICC). The committee must be headed by a senior female employee and must have at least one external member from an NGO or association committed to the cause of women." },
      { number: "9", title: "Complaint of sexual harassment", content: "Any aggrieved woman may make, in writing, a complaint of sexual harassment at workplace to the Internal Committee within a period of three months from the date of incident. If it is a series of incidents, within a period of three months from the date of the last incident. This limitation period can be extended by the ICC." }
    ]
  },
  {
    name: "Payment of Wages Act", shortName: "PWA", year: 1936, category: "Employment",
    description: "Regulates payment of wages to certain classes of employed persons.",
    sections: [{ number: "5", title: "Time of payment", content: "The wages of every person employed upon or in any railway, factory or industrial establishment with less than one thousand persons must be paid before the expiry of the seventh day. For establishments with more than one thousand persons, before the expiry of the tenth day. All wages must be paid in current coin or currency notes or by cheque/bank credit." }]
  },
  {
    name: "Payment of Gratuity Act", shortName: "PGA", year: 1972, category: "Employment",
    description: "Payment of gratuity to employees engaged in factories, mines, plantations, etc.",
    sections: [{ number: "4", title: "Payment of gratuity", content: "Gratuity shall be payable to an employee on the termination of his employment after he has rendered continuous service for not less than five years, on his superannuation, retirement, resignation, death or disablement. The calculation is typically 15 days' wages for every completed year of service, capped at a maximum of ₹20,000,000 as per recent amendments." }]
  },
  {
    name: "Employees' Provident Funds Act", shortName: "EPF Act", year: 1952, category: "Employment",
    description: "Institution of provident funds and pension funds for employees.",
    sections: [{ number: "6", title: "Contributions and matters", content: "The contribution which shall be paid by the employer to the Fund shall be 12% of the basic wages, dearness allowance and retaining allowance payable to each of the employees whether employed by him directly or by or through a contractor. The employee pays an equal contribution, making it a powerful retirement saving tool." }]
  },
  {
    name: "Equal Remuneration Act", shortName: "ERA", year: 1976, category: "Employment",
    description: "Payment of equal remuneration to men and women workers.",
    sections: [{ number: "4", title: "Duty of employer", content: "No employer shall pay to any worker remuneration at rates less favorable than those at which remuneration is paid by him to the workers of the opposite sex in such establishment for performing the same work or work of a similar nature. The Act seeks to prevent discrimination based on gender in employment and wages." }]
  },
  {
    name: "Trade Unions Act", shortName: "TUA", year: 1926, category: "Employment",
    description: "Registration and regulation of Trade Unions.",
    sections: [{ number: "4", title: "Mode of registration", content: "Any seven or more members of a Trade Union may, by subscribing their names to the rules of the Trade Union and by otherwise complying with the provisions of this Act with respect to registration, apply for registration of the Trade Union under this Act. Unregistered unions operate at a severe legal disadvantage." }]
  },
  {
    name: "Maternity Benefit Act", shortName: "MBA", year: 1961, category: "Employment",
    description: "Maternity protection and benefits for women employees.",
    sections: [{ number: "5", title: "Right to payment of maternity benefit", content: "Every woman shall be entitled to, and her employer shall be liable for, the payment of maternity benefit. The 2017 amendment dramatically increased the maximum period for which any woman shall be entitled to maternity benefit to 26 weeks, of which not more than eight weeks shall precede the date of her expected delivery." }]
  },

  // --- Consumer Rights (additional) ---
  {
    name: "Food Safety and Standards Act", shortName: "FSSAI Act", year: 2006, category: "Consumer Rights",
    description: "Establishes FSSAI for food safety regulation and standards.",
    sections: [
      { number: "3", title: "Definitions", content: "Defines 'food' extensively as any substance, whether processed, partially processed or unprocessed, which is intended for human consumption. It also defines highly technical concepts such as 'unsafe food', 'misbranded food', and 'adulterated food' to provide legal concrete footing against hazardous practices." },
      { number: "26", title: "Prohibition of unsafe food", content: "No person shall manufacture, store, sell, or distribute any article of food which is unsafe, misbranded, or sub-standard or contains extraneous matter. Additionally, no food business operator shall manufacture or sell anything which requires a licence without obtaining such a licence." }
    ]
  },
  {
    name: "Essential Commodities Act", shortName: "ECA", year: 1955, category: "Consumer Rights",
    description: "Control of production, supply, and distribution of essential commodities.",
    sections: [{ number: "3", title: "Powers to control", content: "If the Central Government is of opinion that it is necessary or expedient to maintain or increase supplies of any essential commodity or for securing their equitable distribution at fair prices, it may, by order, provide for regulating or prohibiting the production, supply and distribution thereof and trade and commerce therein." }]
  },

  // --- Business Law (additional) ---
  {
    name: "Arbitration and Conciliation Act", shortName: "Arbitration Act", year: 1996, category: "Business Law",
    description: "Law relating to domestic and international commercial arbitration.",
    sections: [
      { number: "7", title: "Arbitration agreement", content: "An agreement by the parties to submit to arbitration all or certain disputes which have arisen or which may arise between them in respect of a defined legal relationship, whether contractual or not. An arbitration agreement must be in writing, such as in a document signed by the parties or an exchange of letters." },
      { number: "34", title: "Setting aside arbitral award", content: "Recourse to a Court against an arbitral award may be made only by an application for setting aside such award. It must be made within three months from the date of receipt of the award. The grounds are extremely limited, primarily regarding incapacity of a party, invalid agreement, lack of notice, or conflict with public policy." },
      { number: "36", title: "Enforcement of award", content: "Where the time for making an application to set aside the arbitral award has expired, or such application has been refused, the award shall be enforced under the Code of Civil Procedure, 1908 in the same manner as if it were a decree of the court." }
    ]
  },
  {
    name: "Limited Liability Partnership Act", shortName: "LLP Act", year: 2008, category: "Business Law",
    description: "Formation and regulation of limited liability partnerships.",
    sections: [{ number: "3", title: "LLP to be body corporate", content: "A limited liability partnership is a body corporate formed and incorporated under this Act and is a legal entity separate from that of its partners. An LLP shall have perpetual succession. Any change in the partners of a limited liability partnership shall not affect the existence, rights or liabilities of the limited liability partnership." }]
  },
  {
    name: "SARFAESI Act", shortName: "SARFAESI", year: 2002, category: "Business Law",
    description: "Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest.",
    sections: [{ number: "13", title: "Enforcement of security interest", content: "Any security interest created in favour of any secured creditor may be enforced, without the intervention of the court or tribunal, by such creditor against the borrower whose account is classified as a non-performing asset. Upon a 60-day notice, the creditor can take possession of the secured assets of the borrower including the right to transfer by way of lease, assignment or sale." }]
  },
  {
    name: "Foreign Exchange Management Act", shortName: "FEMA", year: 1999, category: "Business Law",
    description: "Regulation of foreign exchange transactions and external trade payments.",
    sections: [
      { number: "3", title: "Dealing in foreign exchange", content: "No person shall deal in or transfer any foreign exchange or foreign security to any person not being an authorized person, or make any payment to or for the credit of any person resident outside India in any manner, except in accordance with the provisions of this Act." },
      { number: "6", title: "Capital account transactions", content: "Any person may sell or draw foreign exchange to or from an authorised person for a capital account transaction. The Reserve Bank may, in consultation with the Central Government, specify any class or classes of capital account transactions which are permissible and the exact limit up to which foreign exchange shall be admissible for such transactions." }
    ]
  },
  {
    name: "SEBI Act", shortName: "SEBI Act", year: 1992, category: "Business Law",
    description: "Establishment of Securities and Exchange Board of India for investor protection.",
    sections: [{ number: "11", title: "Functions of SEBI", content: "It shall be the duty of the Board to protect the interests of investors in securities and to promote the development of, and to regulate the securities market. Measures include regulating business in stock exchanges, registering and regulating intermediaries, prohibiting fraudulent trades, and eliminating insider trading." }]
  },
  {
    name: "Goods and Services Tax Act", shortName: "GST Act", year: 2017, category: "Business Law",
    description: "Unified indirect tax on supply of goods and services across India.",
    sections: [
      { number: "9", title: "Levy and collection", content: "There shall be levied a tax called the central goods and services tax on all intra-State supplies of goods or services or both, except on the supply of alcoholic liquor for human consumption, on the value determined and at such rates as may be notified by the Government on the recommendations of the Council." },
      { number: "16", title: "Input tax credit", content: "Every registered person shall, subject to such conditions and restrictions as may be prescribed, be entitled to take credit of input tax charged on any supply of goods or services or both to him which are used or intended to be used in the course or furtherance of his business." }
    ]
  },
  {
    name: "Income Tax Act", shortName: "IT Act", year: 1961, category: "Business Law",
    description: "Comprehensive law for levy, administration, collection, and recovery of income tax.",
    sections: [
      { number: "2(24)", title: "Income defined", content: "Income includes profits and gains, dividends, voluntary contributions received by trusts, the value of any perquisite or profit in lieu of salary, any special allowance or benefit, any capital gains, and winnings from lotteries, crossword puzzles, races, card games and other games of any sort." },
      { number: "80C", title: "Deductions", content: "An assessee, being an individual or a Hindu undivided family, can claim a deduction up to ₹1,50,000 from their gross total income by making specified investments or expenditures. Eligible items include life insurance premiums, deferred annuities, contributions to provident funds, equity linked savings schemes (ELSS), and tuition fees." },
      { number: "139", title: "Return of income", content: "Every person, being a company or a firm, or being a person other than a company or a firm, if his total income or the total income of any other person in respect of which he is assessable under this Act during the previous year exceeded the maximum amount which is not chargeable to income-tax, shall furnish a return of his income." }
    ]
  },

  // --- Cyber Law (additional) ---
  {
    name: "Indian Telegraph Act", shortName: "Telegraph Act", year: 1885, category: "Cyber Law",
    description: "Government's power over telecommunication; used for internet surveillance and shutdowns.",
    sections: [{ number: "5(2)", title: "Power to intercept", content: "On the occurrence of any public emergency, or in the interest of the public safety, the Central Government or a State Government may, if satisfied that it is necessary or expedient so to do in the interests of the sovereignty and integrity of India, the security of the State, friendly relations with foreign States or public order, intercept and detain messages." }]
  },

  // --- Health & Medical (additional) ---
  {
    name: "Food Safety and Standards Act (Health)", shortName: "FSSA", year: 2006, category: "Health & Medical",
    description: "Standards for food articles and regulation of their manufacture, storage, distribution, sale, and import.",
    sections: [{ number: "59", title: "Penalty for unsafe food", content: "Any person who whether by himself or by any other person on his behalf, manufactures for sale or stores or sells or distributes or imports any article of food for human consumption which is unsafe, shall be punishable with imprisonment. If it does not result in injury: fine up to ₹5 lakhs. If grievous injury: up to ₹10 lakhs. If death: life imprisonment and fine not less than ₹10 lakhs." }]
  },
  {
    name: "Epidemic Diseases Act", shortName: "Epidemic Act", year: 1897, category: "Health & Medical",
    description: "Government powers to take special measures during epidemic outbreaks.",
    sections: [{ number: "2", title: "Power to take special measures", content: "When the State Government is satisfied that the State is threatened with an outbreak of any dangerous epidemic disease, if it thinks that the ordinary provisions of the law for the time being in force are insufficient, it may take, or require or empower any person to take, such measures and, by public notice, prescribe such temporary regulations to be observed by the public to prevent the outbreak." }]
  },
  {
    name: "Clinical Establishments Act", shortName: "CEA", year: 2010, category: "Health & Medical",
    description: "Registration and regulation of clinical establishments.",
    sections: [{ number: "7", title: "Condition for registration", content: "No person shall run a clinical establishment unless it has been duly registered in accordance with the provisions of this Act. Establishing a standard system of registration ensures baseline requirements of facilities and services are met uniformly across recognized healthcare providers." }]
  },
  {
    name: "Rights of Persons with Disabilities Act", shortName: "RPWD Act", year: 2016, category: "Health & Medical",
    description: "Rights of persons with disabilities; mandates 5% reservation in government jobs.",
    sections: [
      { number: "3", title: "Equality and non-discrimination", content: "The appropriate Government shall ensure that the persons with disabilities enjoy the right to equality, life with dignity, and respect for his or her integrity equally with others. No person with disability shall be discriminated on the ground of disability, unless it is shown that the impugned act or omission is a proportionate means of achieving a legitimate aim." },
      { number: "34", title: "Reservation", content: "Every appropriate Government shall appoint in every Government establishment, not less than four per cent of the total number of vacancies in the cadre strength in each group of posts meant to be filled with persons with benchmark disabilities of which, one per cent each shall be reserved for persons with blindness and low vision, deaf and hard of hearing, and locomotor disability." }
    ]
  },

  // --- Education Law (additional) ---
  {
    name: "National Education Policy", shortName: "NEP", year: 2020, category: "Education Law",
    description: "Policy framework for transformation of education system in India.",
    sections: [
      { number: "Policy", title: "5+3+3+4 Structure", content: "The new pedagogical structure reimagines the 10+2 system into a 5+3+3+4 design covering ages 3-18. This corresponds to Foundational (3 years of preschool + Grades 1-2), Preparatory (Grades 3-5), Middle (Grades 6-8), and Secondary (Grades 9-12), replacing rote-learning with developmental and holistic outcomes." },
      { number: "Policy", title: "Mother tongue instruction", content: "The policy highlights that wherever possible, the medium of instruction until at least Grade 5, but preferably till Grade 8 and beyond, shall be the home language, mother tongue, local language, or regional language. This is intended to ensure cognitive development natively before exposing youths to foreign languages deeply." }
    ]
  },
  {
    name: "Anti-Ragging Regulations (UGC)", shortName: "Anti-Ragging", year: 2009, category: "Education Law",
    description: "UGC regulations for curbing menace of ragging in educational institutions.",
    sections: [
      { number: "3", title: "What constitutes ragging", content: "Ragging constitutes any physical or mental abuse targeting new students. It covers any act by a senior student that prevents, disrupts or disturbs the regular academic activity of a student, or exploiting the services of a fresher for completing academic tasks assigned, or any act of financial extortion or forceful expenditure." },
      { number: "7", title: "Action to be taken against defaulters", content: "Penalties for those found guilty of ragging at the institution level shall include suspension from attending classes and academic privileges, expulsion from the institution and consequent debarring from admission to any other institution for a specified period, withholding scholarships, and even FIR registration." }
    ]
  },

  // --- Human Rights (additional) ---
  {
    name: "POCSO Act", shortName: "POCSO", year: 2012, category: "Human Rights",
    description: "Protection of Children from Sexual Offences - special law for heinous crimes against children.",
    sections: [
      { number: "3", title: "Penetrative sexual assault", content: "Whoever commits penetrative sexual assault on a child (defined as any person below the age of 18) shall be punished with rigorous imprisonment for a term which shall not be less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine." },
      { number: "19", title: "Reporting of offences", content: "Any person (including the child), who has an apprehension that an offence under this Act is likely to be committed or has knowledge that such an offence has been committed, shall provide such information to the Special Juvenile Police Unit or the local police. Failure to report is also an independent criminal offence under the Act." },
      { number: "35", title: "Presumption of culpable mental state", content: "In any prosecution for any offence under this Act which requires a culpable mental state on the part of the accused, the Special Court shall presume the existence of such mental state. It shall be a defence for the accused to prove the fact that he had no such mental state with respect to the act charged as an offence in that prosecution." }
    ]
  },
  {
    name: "Child Labour (Prohibition and Regulation) Act", shortName: "Child Labour Act", year: 1986, category: "Human Rights",
    description: "Prohibits employment of children below 14 in hazardous occupations.",
    sections: [
      { number: "3", title: "Prohibition of employment", content: "No child (a person who has not completed his fourteenth year of age) shall be employed or permitted to work in any occupation or process listed in the Schedule. Following the 2016 amendment, it prohibits the employment of children in all occupations and processes, completely banning child labour." },
      { number: "14", title: "Penalty", content: "Whoever employs any child or permits any child to work in contravention of the provisions of section 3 shall be punishable with imprisonment for a term which shall not be less than six months but which may extend to two years, or with fine which shall not be less than twenty thousand rupees but which may extend to fifty thousand rupees, or with both." }
    ]
  },
  {
    name: "Bonded Labour System (Abolition) Act", shortName: "Bonded Labour Act", year: 1976, category: "Human Rights",
    description: "Abolition of bonded labour system and rehabilitation of freed labourers.",
    sections: [{ number: "4", title: "Abolition of bonded labour system", content: "On the commencement of this Act, the bonded labour system shall stand abolished and every bonded labourer shall, on such commencement, stand freed and discharged from any obligation to render any bonded labour. Any custom or tradition or any contract by virtue of which any person, or any member of the family is required to do any work as bonded labour shall be void." }]
  },
  {
    name: "National Commission for Women Act", shortName: "NCW Act", year: 1990, category: "Human Rights",
    description: "Constitution of National Commission for Women.",
    sections: [{ number: "10", title: "Functions of Commission", content: "The Commission shall investigate and examine all matters relating to the safeguards provided for women under the Constitution and other laws, present to the Central Government reports upon the working of those safeguards, and make recommendations for the effective implementation of those safeguards for improving the conditions of women by the Union or any State." }]
  },

  // --- Environment & Wildlife (NEW) ---
  {
    name: "Environment (Protection) Act", shortName: "EPA", year: 1986, category: "Environment & Wildlife",
    description: "Umbrella legislation for environmental protection, empowering Central Government to take measures.",
    sections: [
      { number: "3", title: "Power of Central Government", content: "The Central Government shall have the power to take all such measures as it deems necessary or expedient for the purpose of protecting and improving the quality of the environment and preventing, controlling and abating environmental pollution. This includes laying down standards for the quality of environment." },
      { number: "7", title: "Prohibition on handling hazardous substances", content: "No person carrying on any industry, operation or process shall discharge or emit or permit to be discharged or emitted any environmental pollutant in excess of such standards as may be prescribed. Furthermore, handling of hazardous substances is completely prohibited except under tightly prescribed guidelines." },
      { number: "15", title: "Penalty for contravention", content: "Whoever fails to comply with or contravenes any of the provisions of this Act, or the rules made or orders or directions issued thereunder, shall, in respect of each such failure or contravention, be punishable with imprisonment for a term which may extend to five years with fine which may extend to one lakh rupees, or with both." }
    ]
  },
  {
    name: "Water (Prevention and Control of Pollution) Act", shortName: "Water Act", year: 1974, category: "Environment & Wildlife",
    description: "Prevention and control of water pollution; establishment of Pollution Control Boards.",
    sections: [
      { number: "3", title: "Central Pollution Control Board", content: "The Central Government shall constitute a Central Pollution Control Board (CPCB) to promote cleanliness of streams and wells in different areas of the States. It advises the Central Government, coordinates the activities of the State Boards, provides technical assistance and guidance, and lays down standards for a stream or well." },
      { number: "24", title: "Prohibition on polluting streams", content: "No person shall knowingly cause or permit any poisonous, noxious or polluting matter determined in accordance with such standards as may be laid down by the State Board to enter (whether directly or indirectly) into any stream or well or sewer or on land." }
    ]
  },
  {
    name: "Air (Prevention and Control of Pollution) Act", shortName: "Air Act", year: 1981, category: "Environment & Wildlife",
    description: "Prevention, control, and abatement of air pollution.",
    sections: [{ number: "21", title: "Restrictions on use of industrial plant", content: "No person shall, without the previous consent of the State Board, establish or operate any industrial plant in an air pollution control area. State boards monitor emissions of the industrial operations, grant consent with specific conditions, and possess the capability to cancel that consent upon violation." }]
  },
  {
    name: "Wildlife (Protection) Act", shortName: "WLPA", year: 1972, category: "Environment & Wildlife",
    description: "Protection of wild animals, birds, and plants; establishment of sanctuaries and national parks.",
    sections: [
      { number: "9", title: "Prohibition of hunting", content: "No person shall hunt any wild animal specified in Schedules I, II, III and IV except as provided under section 11 and section 12. Protection degrees decline through the schedules, where Schedule I offers absolute protection and offences prescribe the harshest penalties." },
      { number: "39", title: "Wild animals are Government property", content: "Every wild animal, other than vermin, which is hunted under section 11 or kept or bred in captivity or hunted in contravention of any provision of this Act, and any animal article, trophy or uncured trophy shall be the property of the State Government, and in the case of a National Park or Sanctuary, it shall be the property of the Central Government." },
      { number: "51", title: "Penalties", content: "Offences relating to species protected under Schedule I or Part II of Schedule II are punishable with imprisonment for a term which shall not be less than three years but may extend to seven years and also with a fine which shall not be less than ten thousand rupees. Second convictions face double penalties." }
    ]
  },
  {
    name: "Forest Conservation Act", shortName: "FCA", year: 1980, category: "Environment & Wildlife",
    description: "Restricts de-reservation of forests and use of forest land for non-forest purposes.",
    sections: [{ number: "2", title: "Restriction on de-reservation", content: "Notwithstanding anything contained in any other law for the time being in force in a State, no State Government or other authority shall make, except with the prior approval of the Central Government, any order directing that any reserved forest or any portion thereof, shall cease to be reserved, or that any forest land may be used for any non-forest purpose." }]
  },
  {
    name: "Forest Rights Act", shortName: "FRA", year: 2006, category: "Environment & Wildlife",
    description: "Recognition of rights of Scheduled Tribes and other traditional forest dwellers over forest land.",
    sections: [
      { number: "3", title: "Forest rights", content: "The Act recognizes rights of forest dwelling Scheduled Tribes and other traditional forest dwellers including the right to hold and live in the forest land under the individual or common occupation, rights of ownership over minor forest produce, community rights of uses or entitlements like fish and other products of water bodies, and right of access to biodiversity." },
      { number: "6", title: "Authorities to vest forest rights", content: "The Gram Sabha shall be the authority to initiate the process for determining the nature and extent of individual or community forest rights or both that may be given to the forest dwelling Scheduled Tribes and other traditional forest dwellers. It protects traditional structures rather than imposing state hegemony from the top." }
    ]
  },
  {
    name: "Biological Diversity Act", shortName: "BDA", year: 2002, category: "Environment & Wildlife",
    description: "Conservation of biological diversity, sustainable use, and fair sharing of benefits.",
    sections: [{ number: "3", title: "Certain persons not to undertake biodiversity related activities", content: "No person who is not a citizen of India or a non-resident Indian or a foreign corporate entity shall, without previous approval of the National Biodiversity Authority, obtain any biological resource occurring in India or knowledge associated thereto for research or for commercial utilisation or for bio-survey and bio-utilisation. This protects indigenous knowledge from commercial exploitation without compensation." }]
  },
  {
    name: "National Green Tribunal Act", shortName: "NGT Act", year: 2010, category: "Environment & Wildlife",
    description: "Establishment of National Green Tribunal for effective and expeditious disposal of environmental cases.",
    sections: [
      { number: "14", title: "Tribunal to settle disputes", content: "The Tribunal shall have the jurisdiction over all civil cases where a substantial question relating to environment (including enforcement of any legal right relating to environment), is involved and such question arises out of the implementation of the enactments specified in Schedule I." },
      { number: "15", title: "Relief and compensation", content: "The Tribunal may, by an order, provide relief and compensation to the victims of pollution and other environmental damage arising under the enactments specified in the Schedule, for restitution of property damaged, or for restitution of the environment for such area or areas." }
    ]
  },

  // --- Tax & Revenue (NEW) ---
  {
    name: "Income Tax Act (Tax)", shortName: "Income Tax Act", year: 1961, category: "Tax & Revenue",
    description: "Comprehensive law governing direct taxation on income of individuals, companies, and other entities.",
    sections: [
      { number: "4", title: "Charge of income-tax", content: "Income-tax shall be charged for any assessment year at any rate or rates enacted by any Central Act for that year. In respect of the total income of the previous year of every person, income-tax shall be charged without prejudice to any provisions by which tax may be deducted at source or paid in advance as stipulated." },
      { number: "10", title: "Incomes not included in total income", content: "In computing the total income of a previous year of any person, any income falling within any of the following clauses shall not be included: agricultural income, any sum received by a coparcener from the estate of a Hindu undivided family, certain types of interest paid to non-residents, and various allowances specifically exempted in the schedule." },
      { number: "139", title: "Return of income", content: "Every person, being a company or a firm, or any other person whose total income exceeded the maximum amount which is not chargeable to income-tax, shall furnish a return of his income in the prescribed form and verified in the prescribed manner setting forth such other particulars as may be prescribed." },
      { number: "271", title: "Penalty for failure", content: "If the Assessing Officer or the Commissioner (Appeals) in the course of any proceedings under this Act is satisfied that any person has failed to comply with a notice, or has concealed the particulars of his income or furnished inaccurate particulars, he may direct that such person shall pay by way of penalty up to three times the amount of tax evading." }
    ]
  },
  {
    name: "Central Goods and Services Tax Act", shortName: "CGST Act", year: 2017, category: "Tax & Revenue",
    description: "Levy, collection, and administration of Central Goods and Services Tax.",
    sections: [
      { number: "9", title: "Levy and collection of CGST", content: "There shall be levied a tax called the central goods and services tax on all intra-State supplies of goods or services or both, except on the supply of alcoholic liquor for human consumption, on the value determined. The government monitors inputs and output chains through an electronic network system." },
      { number: "16", title: "Eligibility for input tax credit", content: "Every registered person shall be entitled to take credit of input tax charged on any supply of goods or services or both to him which are used or intended to be used in the course or furtherance of his business. The said amount shall be credited to the electronic credit ledger of such person, dramatically offsetting cascaded taxes." },
      { number: "73", title: "Determination of tax not paid", content: "Where it appears to the proper officer that any tax has not been paid or short paid or erroneously refunded, or where input tax credit has been wrongly availed or utilised for any reason, other than the reason of fraud or any wilful-misstatement, he shall serve notice on the person chargeable with tax calling upon him to show cause." }
    ]
  },
  {
    name: "Customs Act", shortName: "Customs Act", year: 1962, category: "Tax & Revenue",
    description: "Regulation of import and export of goods; levying customs duties.",
    sections: [
      { number: "12", title: "Dutiable goods", content: "Except as otherwise provided in this Act, duties of customs shall be levied at such rates as may be specified under the Customs Tariff Act, 1975, or any other law for the time being in force, on goods imported into, or exported from, India." },
      { number: "111", title: "Confiscation of improperly imported goods", content: "The following goods brought from a place outside India shall be liable to confiscation: any goods which are imported or attempted to be imported or are brought within the Indian customs waters for the purpose of being imported, contrary to any prohibition imposed by or under this Act or any other law for the time being in force." }
    ]
  },
  {
    name: "Indian Stamp Act (Tax)", shortName: "Indian Stamp Act", year: 1899, category: "Tax & Revenue",
    description: "Law relating to stamp duty payable on instruments and documents.",
    sections: [
      { number: "3", title: "Instruments chargeable with duty", content: "Subject to the provisions of this Act and the exemptions contained in Schedule I, every instrument mentioned in that Schedule shall be chargeable with duty of the amount indicated in that Schedule as the proper duty therefor. States can introduce their own variations of schedule rates depending upon territorial powers." },
      { number: "35", title: "Instruments not duly stamped", content: "No instrument chargeable with duty shall be admitted in evidence for any purpose by any person having by law or consent of parties authority to receive evidence, or shall be acted upon, registered or authenticated by any such person or by any public officer, unless such instrument is duly stamped." }
    ]
  },
  {
    name: "Benami Transactions (Prohibition) Act", shortName: "Benami Act", year: 1988, category: "Tax & Revenue",
    description: "Prohibition of benami transactions and confiscation of benami properties.",
    sections: [
      { number: "2(9)", title: "Benami transaction defined", content: "A transaction or an arrangement where a property is transferred to, or is held by, a person, and the consideration for such property has been provided, or paid by, another person; and the property is held for the immediate or future benefit, direct or indirect, of the person who has provided the consideration." },
      { number: "3", title: "Prohibition", content: "No person shall enter into any benami transaction. Whoever enters into any benami transaction shall be punishable with rigorous imprisonment for a term which shall not be less than one year, but which may extend to seven years and shall also be liable to fine. Additionally, any property, which is the subject matter of benami transaction, shall be liable to be confiscated by the Central Government." }
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
