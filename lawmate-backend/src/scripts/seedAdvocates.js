const mongoose = require('mongoose');
const User = require('../models/User');
const AdvocateProfile = require('../models/AdvocateProfile');
require('dotenv').config();

const ADVOCATES = [
  {
    name: 'Adv. Rajesh Khanna',
    email: 'rajesh@lawmate.com',
    password: 'password123',
    role: 'advocate',
    profile: {
      bio: 'Expert in Criminal Law with 15 years of experience in High Court cases.',
      specialization: ['Criminal', 'Bail'],
      experience: 15,
      barCouncilNumber: 'BC/1234/2009',
      hourlyRate: 2000,
      location: 'New Delhi',
      rating: 4.8,
      reviewCount: 150
    }
  },
  {
    name: 'Adv. Priya Sharma',
    email: 'priya@lawmate.com',
    password: 'password123',
    role: 'advocate',
    profile: {
      bio: 'Specializing in Family Law, Divorce, and Child Custody matters.',
      specialization: ['Family', 'Civil'],
      experience: 8,
      barCouncilNumber: 'BC/5678/2016',
      hourlyRate: 1500,
      location: 'Mumbai',
      rating: 4.9,
      reviewCount: 85
    }
  },
  {
    name: 'Adv. Vikram Singh',
    email: 'vikram@lawmate.com',
    password: 'password123',
    role: 'advocate',
    profile: {
      bio: 'Property and Real Estate legal expert with deep knowledge of RERA.',
      specialization: ['Property', 'Consumer'],
      experience: 12,
      barCouncilNumber: 'BC/9012/2012',
      hourlyRate: 2500,
      location: 'Bangalore',
      rating: 4.7,
      reviewCount: 120
    }
  },
  {
    name: 'Adv. Anjali Mehta',
    email: 'anjali@lawmate.com',
    password: 'password123',
    role: 'advocate',
    profile: {
      bio: 'Corporate legal advisor specializing in contracts and startups.',
      specialization: ['Corporate', 'Civil'],
      experience: 6,
      barCouncilNumber: 'BC/3456/2018',
      hourlyRate: 3000,
      location: 'Hyderabad',
      rating: 4.6,
      reviewCount: 45
    }
  },
  {
    name: 'Adv. Sameer Ahmed',
    email: 'sameer@lawmate.com',
    password: 'password123',
    role: 'advocate',
    profile: {
      bio: 'Labor law specialist fighting for worker rights and fair wages.',
      specialization: ['Labor', 'Civil'],
      experience: 10,
      barCouncilNumber: 'BC/7890/2014',
      hourlyRate: 1200,
      location: 'Chennai',
      rating: 4.5,
      reviewCount: 60
    }
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lawmate';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clean existing advocates
    const advocatesToDelete = await User.find({ role: 'advocate' });
    const ids = advocatesToDelete.map(u => u._id);
    await AdvocateProfile.deleteMany({ user: { $in: ids } });
    await User.deleteMany({ role: 'advocate' });
    console.log('Cleared existing advocates');

    for (const adv of ADVOCATES) {
      const user = await User.create({
        name: adv.name,
        email: adv.email,
        password: adv.password,
        role: adv.role
      });

      await AdvocateProfile.create({
        user: user._id,
        ...adv.profile
      });
      console.log(`Created advocate: ${adv.name}`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
