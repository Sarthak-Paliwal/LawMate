const mongoose = require('mongoose');

require('dotenv').config();

async function clearCollections() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = require('./src/models/User');
    const AdvocateProfile = require('./src/models/AdvocateProfile');

    const u = await User.deleteMany({});
    console.log(`Deleted ${u.deletedCount} users.`);

    const a = await AdvocateProfile.deleteMany({});
    console.log(`Deleted ${a.deletedCount} advocate profiles.`);

  } catch (err) {
    console.error('Error clearing collections:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Done.');
  }
}

clearCollections();
