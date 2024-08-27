const mongoose = require('mongoose');
const User = require('../../models/user.js');
const bcrypt = require('bcrypt');

const mongoUri = process.env.MONGODB_URI;

exports.handler = async (event) => {
  try {
    // Log the entire event for debugging
    console.log('Received event:', event);

    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }

    // Parse request body
    let body;
    try {
      body = JSON.parse(event.body);
      console.log('Parsed body:', body); // Log the parsed body
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid JSON format' })
      };
    }

    const { username, email, password, school } = body;

    // Ensure required fields are present
    if (!username || !email || !password || !school) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }

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
