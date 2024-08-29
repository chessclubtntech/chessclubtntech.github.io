//RUN ME node scripts/backfill-names.js

const mongoose = require('mongoose');
const Result = require('../models/results.js'); // Adjust the path if necessary
const User = require('../models/user.js'); // Adjust the path if necessary

const mongoUri = process.env.MONGODB_URI;

async function backfillNames() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    const results = await Result.find({});

    for (let result of results) {
      const user1 = await User.findById(result.user1Id);
      const user2 = await User.findById(result.user2Id);

      if (user1 && user2) {
        result.user1Name = user1.username;
        result.user2Name = user2.username;
        await result.save();
      }
    }

    console.log('Backfill completed');
  } catch (error) {
    console.error('Error during backfill:', error);
  } finally {
    mongoose.connection.close();
  }
}

backfillNames();
