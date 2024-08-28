// getProfile.js
const mongoose = require('mongoose');
const User = require('../../models/user.js'); // Adjust the path as necessary

const mongoUri = process.env.MONGODB_URI;

exports.handler = async (event) => {
  try {
    console.log('Request received with query parameters:', event.queryStringParameters);

    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'chess_database' // Ensure you're connecting to the correct database
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

    // Return the user's profile data
    console.log('User found:', user);
    return {
      statusCode: 200,
      body: JSON.stringify({ username: user.username, email: user.email, rating: user.rating, school: user.school }) // Add more fields as needed
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
