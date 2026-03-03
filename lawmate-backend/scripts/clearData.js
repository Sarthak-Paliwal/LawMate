require('dotenv').config();
const mongoose = require('mongoose');

async function clearData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const userResult = await mongoose.connection.db.collection('users').deleteMany({});
    console.log(`Deleted ${userResult.deletedCount} users`);

    const advocateResult = await mongoose.connection.db.collection('advocateprofiles').deleteMany({});
    console.log(`Deleted ${advocateResult.deletedCount} advocate profiles`);

    console.log('Done! All user and advocate data cleared.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

clearData();
