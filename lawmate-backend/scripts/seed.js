require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Models ──────────────────────────────────────────────────
const User = require('../src/models/User');
const AdvocateProfile = require('../src/models/AdvocateProfile');
const Booking = require('../src/models/Booking');
const Document = require('../src/models/Document');
const LegalAct = require('../src/models/LegalAct');
const LegalQuery = require('../src/models/LegalQuery');

// ── Seed Data ───────────────────────────────────────────────

const users = [
  // Regular users
  { name: 'Rahul Sharma', email: 'rahul@example.com', password: 'password123', role: 'user', phone: '9876543210' },
  { name: 'Priya Singh', email: 'priya@example.com', password: 'password123', role: 'user', phone: '9876543211' },
  { name: 'Amit Gupta', email: 'amit@example.com', password: 'password123', role: 'user', phone: '9876543212' },
  { name: 'Neha Verma', email: 'neha@example.com', password: 'password123', role: 'user', phone: '9876543213' },
  { name: 'Vikram Patel', email: 'vikram@example.com', password: 'password123', role: 'user', phone: '9876543214' },

  // Advocates
  { name: 'Adv. Sanjay Mehta', email: 'sanjay.advocate@example.com', password: 'password123', role: 'advocate', phone: '9988776601' },
  { name: 'Adv. Kavita Reddy', email: 'kavita.advocate@example.com', password: 'password123', role: 'advocate', phone: '9988776602' },
  { name: 'Adv. Rajesh Kumar', email: 'rajesh.advocate@example.com', password: 'password123', role: 'advocate', phone: '9988776603' },
  { name: 'Adv. Deepa Nair', email: 'deepa.advocate@example.com', password: 'password123', role: 'advocate', phone: '9988776604' },
  { name: 'Adv. Arjun Desai', email: 'arjun.advocate@example.com', password: 'password123', role: 'advocate', phone: '9988776605' },
];

const advocateProfiles = [
  {
    bio: 'Senior criminal lawyer with 18 years of experience in the Supreme Court and High Courts. Specializes in bail applications, criminal appeals, and white-collar crime defense.',
    specialization: ['Criminal Defense', 'Constitution'],
    experience: 18,
    barCouncilNumber: 'MH/1234/2006',
    hourlyRate: 5000,
    location: 'Mumbai',
    rating: 4.8,
    reviewCount: 127,
    casesHandled: 340,
    isAvailable: true,
  },
  {
    bio: 'Family law specialist handling divorce, custody, and domestic violence cases. Compassionate approach with a focus on amicable dispute resolution and mediation.',
    specialization: ['Family Law', 'Human Rights'],
    experience: 12,
    barCouncilNumber: 'DL/5678/2012',
    hourlyRate: 3500,
    location: 'Delhi',
    rating: 4.6,
    reviewCount: 89,
    casesHandled: 215,
    isAvailable: true,
  },
  {
    bio: 'Property and real estate law expert. Handles land disputes, title verification, RERA complaints, and property registration matters across Karnataka.',
    specialization: ['Land & Property', 'Consumer Rights'],
    experience: 15,
    barCouncilNumber: 'KA/9012/2009',
    hourlyRate: 4000,
    location: 'Bengaluru',
    rating: 4.7,
    reviewCount: 105,
    casesHandled: 280,
    isAvailable: true,
  },
  {
    bio: 'Cyber law and IT Act specialist. Handles data privacy, online fraud, social media defamation, and digital evidence cases. Also advises startups on compliance.',
    specialization: ['Cyber Law', 'Business Law'],
    experience: 8,
    barCouncilNumber: 'TN/3456/2016',
    hourlyRate: 3000,
    location: 'Chennai',
    rating: 4.5,
    reviewCount: 56,
    casesHandled: 120,
    isAvailable: true,
  },
  {
    bio: 'Employment and labor law expert with deep knowledge of Industrial Disputes Act, Factories Act, and POSH Act. Represents both employers and employees.',
    specialization: ['Employment', 'Business Law'],
    experience: 20,
    barCouncilNumber: 'GJ/7890/2004',
    hourlyRate: 4500,
    location: 'Ahmedabad',
    rating: 4.9,
    reviewCount: 150,
    casesHandled: 410,
    isAvailable: false,
  },
];

const legalActs = [
  {
    name: 'Indian Penal Code',
    shortName: 'IPC',
    year: 1860,
    description: 'Main criminal code of India covering substantive criminal law.',
    category: 'Criminal Defense',
    sections: [
      { number: '1', title: 'Title and extent', content: 'This Act shall be called the Indian Penal Code, and shall extend to the whole of India except the State of Jammu and Kashmir.' },
      { number: '299', title: 'Culpable homicide', content: 'Whoever causes death by doing an act with the intention of causing death, or with the intention of causing such bodily injury as is likely to cause death, commits the offence of culpable homicide.' },
      { number: '302', title: 'Punishment for murder', content: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.' },
      { number: '378', title: 'Theft', content: 'Whoever, intending to take dishonestly any movable property out of the possession of any person without that person\'s consent, moves that property in order to such taking, is said to commit theft.' },
      { number: '420', title: 'Cheating and dishonestly inducing delivery of property', content: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.' },
    ],
  },
  {
    name: 'Code of Criminal Procedure',
    shortName: 'CrPC',
    year: 1973,
    description: 'Main legislation on procedure for administration of criminal law in India.',
    category: 'Criminal Defense',
    sections: [
      { number: '41', title: 'When police may arrest without warrant', content: 'Any police officer may without an order from a Magistrate and without a warrant, arrest any person who has been concerned in any cognizable offence.' },
      { number: '154', title: 'Information in cognizable cases (FIR)', content: 'Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction.' },
      { number: '438', title: 'Anticipatory bail', content: 'When any person has reason to believe that he may be arrested on an accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session for a direction.' },
    ],
  },
  {
    name: 'Indian Contract Act',
    shortName: 'ICA',
    year: 1872,
    description: 'Regulates contract law in India.',
    category: 'Business Law',
    sections: [
      { number: '2(h)', title: 'Definition of contract', content: 'An agreement enforceable by law is a contract.' },
      { number: '10', title: 'What agreements are contracts', content: 'All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object.' },
      { number: '23', title: 'What considerations and objects are lawful', content: 'The consideration or object of an agreement is lawful, unless it is forbidden by law; or is of such a nature that, if permitted, it would defeat the provisions of any law.' },
      { number: '73', title: 'Compensation for breach', content: 'When a contract has been broken, the party who suffers by such breach is entitled to receive, as compensation for any loss or damage caused to him thereby.' },
    ],
  },
  {
    name: 'Hindu Marriage Act',
    shortName: 'HMA',
    year: 1955,
    description: 'Governs marriage and divorce among Hindus.',
    category: 'Family Law',
    sections: [
      { number: '5', title: 'Conditions for a Hindu marriage', content: 'A marriage may be solemnized between any two Hindus, if the following conditions are fulfilled: (i) neither party has a spouse living; (ii) at the time of the marriage, neither party is incapable of giving valid consent.' },
      { number: '13', title: 'Divorce', content: 'Any marriage solemnized, whether before or after the commencement of this Act, may, on a petition presented by either the husband or the wife, be dissolved by a decree of divorce on the ground that the other party has, after the solemnization of the marriage, had voluntary sexual intercourse with any person other than his or her spouse.' },
      { number: '24', title: 'Maintenance pendente lite and expenses of proceedings', content: 'Where in any proceeding under this Act it appears to the court that either the wife or the husband, as the case may be, has no independent income sufficient for her or his support, the court may order the respondent to pay the expenses of the proceeding and monthly maintenance.' },
    ],
  },
  {
    name: 'Consumer Protection Act',
    shortName: 'CPA',
    year: 2019,
    description: 'Protection of consumer rights and redressal of consumer disputes.',
    category: 'Consumer Rights',
    sections: [
      { number: '2(7)', title: 'Consumer', content: '"Consumer" means any person who buys any goods or avails of any service for a consideration which has been paid or promised or partly paid and partly promised.' },
      { number: '35', title: 'Jurisdiction of District Commission', content: 'The District Commission shall have jurisdiction to entertain complaints where the value of the goods or services paid as consideration does not exceed fifty lakh rupees.' },
      { number: '39', title: 'Appeal against order of District Commission', content: 'Any person aggrieved by an order made by the District Commission may prefer an appeal against such order to the State Commission within a period of forty-five days.' },
    ],
  },
  {
    name: 'Motor Vehicles Act',
    shortName: 'MVA',
    year: 2019,
    description: 'Regulates all aspects of road transport vehicles including permits, licensing, penalties, and insurance.',
    category: 'Traffic Law',
    sections: [
      { number: '3', title: 'Necessity for driving licence', content: 'No person shall drive a motor vehicle in any public place unless he holds an effective driving licence issued to him authorising him to drive the vehicle.' },
      { number: '112', title: 'Limits of speed', content: 'No person shall drive a motor vehicle in any public place at a speed exceeding the maximum speed fixed for the vehicle under this Act or by any other law.' },
      { number: '185', title: 'Driving by a drunken person or by a person under the influence of drugs', content: 'Whoever, while driving, or attempting to drive, a motor vehicle, has, in his blood, alcohol exceeding 30 mg per 100 ml of blood detected in a test by a breath analyser, shall be punishable.' },
    ],
  },
  {
    name: 'Information Technology Act',
    shortName: 'IT Act',
    year: 2000,
    description: 'Provides legal recognition to electronic commerce and penalizes cyber crimes.',
    category: 'Cyber Law',
    sections: [
      { number: '43', title: 'Penalty and compensation for damage to computer', content: 'If any person without permission of the owner accesses or secures access to computer, computer system or computer network, he shall be liable to pay damages by way of compensation to the person so affected.' },
      { number: '66', title: 'Computer related offences', content: 'If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine which may extend to five lakh rupees or with both.' },
      { number: '67', title: 'Publishing obscene material in electronic form', content: 'Whoever publishes or transmits or causes to be published in the electronic form any material which is lascivious or appeals to the prurient interest shall be punished.' },
    ],
  },
  {
    name: 'Right to Information Act',
    shortName: 'RTI',
    year: 2005,
    description: 'Empowers citizens to request information from public authorities, promoting transparency and accountability.',
    category: 'Human Rights',
    sections: [
      { number: '3', title: 'Right to information', content: 'Subject to the provisions of this Act, all citizens shall have the right to information.' },
      { number: '6', title: 'Request for obtaining information', content: 'A person, who desires to obtain any information under this Act, shall make a request in writing or through electronic means to the Central Public Information Officer or the State Public Information Officer.' },
      { number: '7', title: 'Disposal of request', content: 'The Central Public Information Officer or State Public Information Officer shall, as expeditiously as possible, and in any case within thirty days of the receipt of the request, either provide the information sought or reject the request for any of the reasons specified.' },
    ],
  },
];

// ── Seed Function ───────────────────────────────────────────

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lawmate';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // ──── 1. Drop ALL existing data ────
    console.log('\n🗑️  Clearing ALL collections...');
    await Promise.all([
      User.deleteMany({}),
      AdvocateProfile.deleteMany({}),
      Booking.deleteMany({}),
      Document.deleteMany({}),
      LegalAct.deleteMany({}),
      LegalQuery.deleteMany({}),
    ]);
    console.log('   ✔ All collections cleared');

    // ──── 2. Seed Users ────
    console.log('\n👤 Seeding Users...');
    const createdUsers = [];
    for (const u of users) {
      const user = new User(u); // pre-save hook will hash password
      await user.save();
      createdUsers.push(user);
    }
    console.log(`   ✔ ${createdUsers.length} users created`);

    // Separate users and advocates for convenience
    const regularUsers = createdUsers.filter(u => u.role === 'user');
    const advocateUsers = createdUsers.filter(u => u.role === 'advocate');

    // ──── 3. Seed Advocate Profiles ────
    console.log('\n⚖️  Seeding Advocate Profiles...');
    const createdProfiles = [];
    for (let i = 0; i < advocateUsers.length; i++) {
      const profile = await AdvocateProfile.create({
        user: advocateUsers[i]._id,
        ...advocateProfiles[i],
      });
      createdProfiles.push(profile);
    }
    console.log(`   ✔ ${createdProfiles.length} advocate profiles created`);

    // ──── 4. Seed Legal Acts ────
    console.log('\n📜 Seeding Legal Acts...');
    const createdActs = await LegalAct.insertMany(legalActs);
    console.log(`   ✔ ${createdActs.length} legal acts created`);

    // ──── 5. Seed Bookings ────
    console.log('\n📅 Seeding Bookings...');
    const bookingsData = [
      { user: regularUsers[0]._id, advocate: advocateUsers[0]._id, message: 'I need help with a theft case FIR filing.', status: 'pending', scheduledAt: new Date('2026-03-05T10:00:00') },
      { user: regularUsers[1]._id, advocate: advocateUsers[1]._id, message: 'Seeking consultation for divorce proceedings.', status: 'accepted', rating: 5, scheduledAt: new Date('2026-03-02T14:00:00') },
      { user: regularUsers[2]._id, advocate: advocateUsers[2]._id, message: 'Property dispute regarding ancestral land.', status: 'completed', rating: 4, scheduledAt: new Date('2026-02-20T11:00:00') },
      { user: regularUsers[3]._id, advocate: advocateUsers[3]._id, message: 'Online fraud complaint – money lost via UPI scam.', status: 'accepted', scheduledAt: new Date('2026-03-08T16:00:00') },
      { user: regularUsers[0]._id, advocate: advocateUsers[4]._id, message: 'Wrongful termination from my job, need legal advice.', status: 'rejected', scheduledAt: new Date('2026-02-25T09:00:00') },
      { user: regularUsers[4]._id, advocate: advocateUsers[0]._id, message: 'Need anticipatory bail consultation.', status: 'pending', scheduledAt: new Date('2026-03-10T15:00:00') },
      { user: regularUsers[2]._id, advocate: advocateUsers[1]._id, message: 'Child custody matter after separation.', status: 'completed', rating: 5, scheduledAt: new Date('2026-02-18T10:30:00') },
    ];
    const createdBookings = await Booking.insertMany(bookingsData);
    console.log(`   ✔ ${createdBookings.length} bookings created`);

    // ──── 6. Seed Documents ────
    console.log('\n📄 Seeding Documents...');
    const documentsData = [
      {
        user: regularUsers[0]._id,
        type: 'Legal Notice',
        data: { senderName: 'Rahul Sharma', recipientName: 'XYZ Pvt Ltd', subject: 'Non-payment of dues', amount: 150000 },
        content: '<h1>Legal Notice</h1><p>To: XYZ Pvt Ltd</p><p>Subject: Non-payment of dues amounting to ₹1,50,000</p><p>You are hereby called upon to pay the outstanding amount within 15 days from the receipt of this notice, failing which legal proceedings shall be initiated against you.</p>',
      },
      {
        user: regularUsers[1]._id,
        type: 'Rent Agreement',
        data: { landlordName: 'Suresh Iyer', tenantName: 'Priya Singh', address: '42, MG Road, Delhi', rent: 25000, duration: '11 months' },
        content: '<h1>Rent Agreement</h1><p>This Rent Agreement is entered into between Suresh Iyer (Landlord) and Priya Singh (Tenant) for the property at 42, MG Road, Delhi at a monthly rent of ₹25,000 for a period of 11 months.</p>',
      },
      {
        user: regularUsers[2]._id,
        type: 'RTI Application',
        data: { applicantName: 'Amit Gupta', department: 'Municipal Corporation', info: 'Details of road development funds allocated for Ward 45 in FY 2025-26' },
        content: '<h1>RTI Application</h1><p>To: Public Information Officer, Municipal Corporation</p><p>Subject: Information regarding road development funds allocated for Ward 45 in FY 2025-26.</p><p>Under the Right to Information Act, 2005, I request the following information...</p>',
      },
      {
        user: regularUsers[3]._id,
        type: 'Consumer Complaint',
        data: { complainantName: 'Neha Verma', companyName: 'QuickShop Online', product: 'Laptop', amount: 65000, issue: 'Defective product not replaced' },
        content: '<h1>Consumer Complaint</h1><p>Before the District Consumer Disputes Redressal Commission</p><p>Complainant: Neha Verma</p><p>Opposite Party: QuickShop Online</p><p>The complainant purchased a laptop worth ₹65,000 which turned out to be defective. Despite multiple requests, the company has failed to replace or refund the product.</p>',
      },
      {
        user: regularUsers[4]._id,
        type: 'General Affidavit',
        data: { deponentName: 'Vikram Patel', purpose: 'Name change', details: 'I wish to change my name from Vikram Patel to Vikram P. Shah for all official records.' },
        content: '<h1>General Affidavit</h1><p>I, Vikram Patel, son of Mahesh Patel, residing at 15, Satellite Road, Ahmedabad, do hereby solemnly affirm and declare that I wish to change my name from Vikram Patel to Vikram P. Shah for all official and legal purposes.</p>',
      },
    ];
    const createdDocs = await Document.insertMany(documentsData);
    console.log(`   ✔ ${createdDocs.length} documents created`);

    // ──── 7. Seed Legal Queries ────
    console.log('\n💬 Seeding Legal Queries...');
    const queriesData = [
      {
        user: regularUsers[0]._id,
        question: 'Someone stole my bike from the parking lot. What should I do?',
        response: 'You should file an FIR at the nearest police station under Section 378 IPC (Theft). Carry your bike registration documents and any CCTV evidence available.',
        category: 'Criminal Defense',
        subCategory: 'Theft',
        description: 'Bike stolen from parking lot near office',
        status: 'closed',
        decision: {
          legalNature: 'Criminal – Theft',
          severity: 'Medium',
          recommendedAction: ['File FIR under Section 378 IPC', 'Collect CCTV footage', 'Notify insurance company'],
          relevantActs: ['Indian Penal Code – Section 378', 'Code of Criminal Procedure – Section 154'],
          estimatedTime: '1-3 months',
          estimatedCost: '₹2,000 - ₹5,000',
          nextSteps: ['Visit nearest police station', 'File written complaint', 'Get FIR copy'],
        },
        isSaved: true,
      },
      {
        user: regularUsers[1]._id,
        question: 'My husband is harassing me for dowry. What legal options do I have?',
        response: 'You can file a complaint under Section 498A IPC for cruelty by husband and his relatives. You may also seek protection under the Domestic Violence Act, 2005.',
        category: 'Family Law',
        subCategory: 'Domestic Violence',
        description: 'Dowry harassment by husband and in-laws',
        status: 'open',
        decision: {
          legalNature: 'Criminal & Civil – Domestic Violence / Dowry',
          severity: 'Critical',
          recommendedAction: ['File complaint under Section 498A IPC', 'Apply for protection order under DV Act', 'Seek maintenance under Section 125 CrPC'],
          relevantActs: ['Indian Penal Code – Section 498A', 'Domestic Violence Act, 2005', 'Dowry Prohibition Act, 1961'],
          estimatedTime: '2-6 months',
          estimatedCost: '₹5,000 - ₹20,000',
          nextSteps: ['Consult a family law advocate', 'File complaint at Women\'s Cell / police station', 'Apply for interim maintenance'],
        },
        isSaved: true,
      },
      {
        user: regularUsers[2]._id,
        question: 'My neighbour has encroached on my land. How can I get it back?',
        response: 'You can file a civil suit for possession and injunction. Collect property documents, survey reports, and any evidence of encroachment.',
        category: 'Land & Property',
        subCategory: 'Land Dispute',
        description: 'Boundary dispute with neighbour encroaching on land',
        status: 'open',
        decision: {
          legalNature: 'Civil – Property Dispute',
          severity: 'High',
          recommendedAction: ['File civil suit for possession', 'Apply for temporary injunction', 'Get land survey done'],
          relevantActs: ['Code of Civil Procedure – Order XXXIX', 'Transfer of Property Act – Section 5', 'Indian Penal Code – Section 441 (Criminal Trespass)'],
          estimatedTime: '6-18 months',
          estimatedCost: '₹10,000 - ₹50,000',
          nextSteps: ['Collect land ownership documents', 'Get survey report from revenue department', 'Consult a property lawyer'],
        },
        isSaved: false,
      },
      {
        user: regularUsers[3]._id,
        question: 'I received a challan for overspeeding. Is it valid without photographic evidence?',
        response: 'Under the Motor Vehicles Act, an e-challan must have photographic or video evidence. You can challenge it if no evidence is provided.',
        category: 'Traffic Law',
        subCategory: 'Challan Dispute',
        description: 'Overspeeding challan without photo evidence',
        status: 'closed',
        decision: {
          legalNature: 'Traffic Offence',
          severity: 'Low',
          recommendedAction: ['Request photographic evidence', 'File an appeal if evidence is missing', 'Pay fine if evidence is valid'],
          relevantActs: ['Motor Vehicles Act – Section 112', 'Motor Vehicles Act – Section 200'],
          estimatedTime: '1-4 weeks',
          estimatedCost: '₹500 - ₹2,000',
          nextSteps: ['Visit traffic police office', 'Request evidence copy', 'File appeal if needed'],
        },
        isSaved: false,
      },
      {
        user: regularUsers[4]._id,
        question: 'My employer fired me without notice. Can I take legal action?',
        response: 'Yes, under the Industrial Disputes Act, termination without proper notice or compensation is illegal for workers covered under the Act. You can file a complaint with the Labour Commissioner.',
        category: 'Employment',
        subCategory: 'Wrongful Termination',
        description: 'Fired without notice or severance pay',
        status: 'open',
        decision: {
          legalNature: 'Labour Dispute – Wrongful Termination',
          severity: 'High',
          recommendedAction: ['File complaint with Labour Commissioner', 'Send legal notice to employer', 'File case under Industrial Disputes Act'],
          relevantActs: ['Industrial Disputes Act – Section 25F', 'Industrial Employment (Standing Orders) Act', 'Payment of Wages Act'],
          estimatedTime: '3-12 months',
          estimatedCost: '₹5,000 - ₹25,000',
          nextSteps: ['Collect appointment letter, salary slips, termination letter', 'Consult a labour law advocate', 'File conciliation application'],
        },
        isSaved: true,
      },
    ];
    const createdQueries = await LegalQuery.insertMany(queriesData);
    console.log(`   ✔ ${createdQueries.length} legal queries created`);

    // ──── Summary ────
    console.log('\n═══════════════════════════════════════════');
    console.log('🎉  DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════');
    console.log(`   Users:             ${createdUsers.length}`);
    console.log(`   Advocate Profiles:  ${createdProfiles.length}`);
    console.log(`   Legal Acts:         ${createdActs.length}`);
    console.log(`   Bookings:           ${createdBookings.length}`);
    console.log(`   Documents:          ${createdDocs.length}`);
    console.log(`   Legal Queries:      ${createdQueries.length}`);
    console.log('═══════════════════════════════════════════');
    console.log('\n📌 Test login credentials:');
    console.log('   User:     rahul@example.com / password123');
    console.log('   Advocate: sanjay.advocate@example.com / password123');
    console.log('═══════════════════════════════════════════\n');

  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
