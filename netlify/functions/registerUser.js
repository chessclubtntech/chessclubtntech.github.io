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

    // Parse request body
    const { username, email, password, school } = JSON.parse(event.body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      school // Assuming 'school' is a field in your User schema
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User registered successfully' })
    };
  } catch (error) {
    console.error('Registration error:', error); // Log the error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Registration failed', error: error.message })
    };
  }
};
