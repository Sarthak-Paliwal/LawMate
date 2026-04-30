const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const users = [
  { name: 'Rahul Desai', email: 'rahul.desai@gmail.com' },
  { name: 'Priya Sharma', email: 'priya.sharma@gmail.com' },
  { name: 'Amitabh Verma', email: 'amitabh.verma@gmail.com' },
  { name: 'Sneha Iyer', email: 'sneha.iyer@gmail.com' },
  { name: 'Vikram Singh', email: 'vikram.singh@gmail.com' }
];

const seedUsers = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for Users");

    // Clear all existing users with role 'user'
    await User.deleteMany({ role: 'user' });
    console.log("Cleared all existing users from the database");

    let createdCount = 0;
    for (const userData of users) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        const user = new User({
          name: userData.name,
          email: userData.email,
          password: 'Password@123',
          role: 'user',
          isEmailVerified: true
        });
        await user.save();
        createdCount++;
      }
    }

    console.log(`Successfully seeded ${createdCount} users with realistic data!`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedUsers();
