const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const AdvocateProfile = require('../models/AdvocateProfile');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const advocates = [
  { name: 'Arjun Kapoor', email: 'arjun.kapoor.law@gmail.com', specialization: ['Criminal Defense', 'Civil Litigation'], location: 'New Delhi', experience: 12, rate: 2500, casesWon: 120 },
  { name: 'Meera Reddy', email: 'meera.reddy.law@gmail.com', specialization: ['Family Law', 'Property Law'], location: 'Mumbai', experience: 8, rate: 1800, casesWon: 85 },
  { name: 'Siddharth Rao', email: 'siddharth.rao.adv@gmail.com', specialization: ['Corporate Law', 'Tax Law'], location: 'Bengaluru', experience: 15, rate: 3000, casesWon: 200 },
  { name: 'Anjali Menon', email: 'anjali.menon.law@gmail.com', specialization: ['Intellectual Property', 'Media Law'], location: 'Chennai', experience: 6, rate: 1500, casesWon: 45 },
  { name: 'Ravi Kumar', email: 'ravi.kumar.advocate@gmail.com', specialization: ['Real Estate Law', 'Dispute Resolution'], location: 'Hyderabad', experience: 20, rate: 3500, casesWon: 310 },
  { name: 'Simran Kaur', email: 'simran.kaur.legal@gmail.com', specialization: ['Labor Law', 'Employment Law'], location: 'Chandigarh', experience: 10, rate: 2000, casesWon: 95 },
  { name: 'Karthik Nair', email: 'karthik.nair.law@gmail.com', specialization: ['Tax Law', 'Corporate Law'], location: 'Pune', experience: 14, rate: 2800, casesWon: 150 },
  { name: 'Pooja Joshi', email: 'pooja.joshi.adv@gmail.com', specialization: ['Civil Litigation', 'Consumer Rights'], location: 'Jaipur', experience: 5, rate: 1200, casesWon: 30 },
  { name: 'Aman Gupta', email: 'aman.gupta.legal@gmail.com', specialization: ['Criminal Defense', 'Human Rights'], location: 'Lucknow', experience: 18, rate: 3200, casesWon: 280 },
  { name: 'Neha Patil', email: 'neha.patil.law@gmail.com', specialization: ['Environmental Law', 'Public Interest Litigation'], location: 'Bhopal', experience: 7, rate: 1600, casesWon: 60 },
  { name: 'Rajesh Tiwari', email: 'rajesh.tiwari.adv@gmail.com', specialization: ['Constitutional Law', 'Service Law'], location: 'Patna', experience: 22, rate: 4000, casesWon: 350 },
  { name: 'Divya Chawla', email: 'divya.chawla.legal@gmail.com', specialization: ['Cyber Law', 'IT Act'], location: 'Noida', experience: 9, rate: 2200, casesWon: 75 },
  { name: 'Suresh Pillai', email: 'suresh.pillai.adv@gmail.com', specialization: ['Human Rights', 'NGO Law'], location: 'Kochi', experience: 16, rate: 2700, casesWon: 180 },
  { name: 'Kavita Rathi', email: 'kavita.rathi.law@gmail.com', specialization: ['Immigration Law', 'International Law'], location: 'Ahmedabad', experience: 11, rate: 2400, casesWon: 110 },
  { name: 'Mohit Agarwal', email: 'mohit.agarwal.legal@gmail.com', specialization: ['Banking Law', 'Insolvency'], location: 'Kolkata', experience: 13, rate: 2600, casesWon: 140 }
];

const seedAdvocates = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for Advocates");

    // Clear all existing advocates and their profiles
    await AdvocateProfile.deleteMany({});
    await User.deleteMany({ role: 'advocate' });
    console.log("Cleared all existing advocates and profiles from the database");

    let createdCount = 0;
    for (let i = 0; i < advocates.length; i++) {
      const advData = advocates[i];
      const exists = await User.findOne({ email: advData.email });
      if (!exists) {
        
        // Create User
        const user = new User({
          name: advData.name,
          email: advData.email,
          password: 'Password@123',
          role: 'advocate',
          isEmailVerified: true,
          isAdvocateVerified: true,
          barCouncilId: `BCI/${advData.location.substring(0, 3).toUpperCase()}/${2000 + i}`,
          enrollmentYear: 2026 - advData.experience,
          stateBarCouncil: `${advData.location} Bar Council`
        });
        const savedUser = await user.save();

        // Create Profile
        const profile = new AdvocateProfile({
          user: savedUser._id,
          bio: `Highly experienced advocate based in ${advData.location}, specializing in ${advData.specialization.join(' and ')}. Committed to providing excellent legal representation.`,
          qualifications: `LLB, LLM`,
          specialization: advData.specialization,
          experience: advData.experience,
          barCouncilNumber: savedUser.barCouncilId,
          hourlyRate: advData.rate,
          consultationFee: Math.floor(advData.rate * 0.6),
          location: advData.location,
          rating: 4.0 + (i % 5) * 0.2,
          reviewCount: 20 + advData.experience * 2,
          casesHandled: advData.casesWon + Math.floor(advData.experience * 3),
          casesWon: advData.casesWon,
          isAvailable: true
        });
        await profile.save();
        createdCount++;
      }
    }

    console.log(`Successfully seeded ${createdCount} realistic Indian advocates!`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedAdvocates();
