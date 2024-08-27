const mongoose = require('mongoose');
const User = require('../../models/user'); // Adjust path as needed

exports.handler = async (event) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Fetch users
    const users = await User.find({}, 'username rating');
    
    return {
      statusCode: 200,
      body: JSON.stringify(users)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch users', error: error.message })
    };
  }
};
