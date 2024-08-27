// netlify/functions/username.js
const mongoose = require('mongoose');
const User = require('./models/user'); // Adjust the path as necessary

const uri = process.env.MONGODB_URI; // Ensure your environment variable is set correctly

exports.handler = async (event, context) => {
  try {
    // Ensure MongoDB is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    // Placeholder: Fetch username based on session or request
    const userId = 'some-user-id'; // Replace with actual logic to fetch userId
    const user = await User.findById(userId);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ username: user.username }),
    };
  } catch (error) {
    console.error('Error fetching username:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
