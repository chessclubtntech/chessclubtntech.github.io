// netlify/functions/random-users.js
const mongoose = require('mongoose');
const User = require('./models/user'); // Adjust the path as necessary

const uri = process.env.MONGODB_URI; // Ensure your environment variable is set correctly

exports.handler = async (event, context) => {
  try {
    // Ensure MongoDB is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    // Fetch two random users from MongoDB
    const users = await User.aggregate([{ $sample: { size: 2 } }]);

    if (users.length < 2) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not enough users found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ user1: users[0], user2: users[1] }),
    };
  } catch (error) {
    console.error('Error fetching random users:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
