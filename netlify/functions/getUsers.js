const mongoose = require('mongoose');
const User = require('../../models/user.js'); // Adjust the path if needed

const mongoUri = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
  try {
    console.log('Starting getUsers function');

    // Check MongoDB URI
    console.log('MongoDB URI:', mongoUri);

    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected');
    }

    // Check Mongoose connection state
    console.log('Mongoose connection state:', mongoose.connection.readyState);

    // Fetch users
    const users = await User.find({}, 'username rating');

    // Debug log users
    console.log('Fetched users:', users);

    // Return response
    return {
      statusCode: 200,
      body: JSON.stringify(users),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch users', error: error.message }),
    };
  }
};
