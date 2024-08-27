const mongoose = require('mongoose');
const User = require('../../models/user.js');
const bcrypt = require('bcrypt');

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
        body: JSON.stringify({ success: false, message: 'Invalid email or password' })
      };
    }

    // User authenticated
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Login successful', redirectUrl: '/main.html' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal server error', error: error.message })
    };
  }
};
