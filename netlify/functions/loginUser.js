const mongoose = require('mongoose');
const User = require('./models/user.js'); // Adjust the path as needed
const bcrypt = require('bcrypt');

const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGODB_URI;

exports.handler = async (event) => {
  try {
    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }

    // Extract user details from the request
    const { email, password } = JSON.parse(event.body);

    // Find user
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid email or password' })
      };
    }

    // User authenticated
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Login successful' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error: error.message })
    };
  }
};
