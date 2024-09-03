const mongoose = require('mongoose');
const User = require('../../models/user.js'); // Adjust the path as necessary

const mongoUri = process.env.MONGODB_URI;

exports.handler = async (event) => {
  try {
    // Parse request body
    const { userId, bio } = JSON.parse(event.body);
    
    if (!userId || !bio) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID and bio are required' })
      };
    }

    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'chess_database' // Ensure you're connecting to the correct database
      });
    }

    // Update user's bio
    const user = await User.findByIdAndUpdate(userId, { bio: bio }, { new: true });
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Bio updated successfully' })
    };
  } catch (error) {
    console.error('Error updating bio:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
