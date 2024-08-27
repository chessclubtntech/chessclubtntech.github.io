const mongoose = require('mongoose');
const User = require('../../models/user.js');

const mongoUri = process.env.MONGODB_URI;

exports.handler = async (event) => {
  try {
    console.log('Request received with query parameters:', event.queryStringParameters);

    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }

    // Extract userId from the query parameters
    const userId = event.queryStringParameters.id;
    if (!userId) {
      console.log('User ID is missing in the request');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID is required' })
      };
    }

    // Fetch user from the database
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found with ID:', userId);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    // Return the username
    console.log('User found:', user);
    return {
      statusCode: 200,
      body: JSON.stringify({ username: user.username })
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
