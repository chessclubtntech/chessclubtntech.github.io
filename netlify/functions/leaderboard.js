const mongoose = require('mongoose');

let connection = null; // Store the connection globally

const connectToDatabase = async () => {
  if (connection && mongoose.connection.readyState === 1) {
    // If a connection is already established, return it
    return;
  }

  try {
    // Connect to MongoDB using the URI from environment variables
    connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('MongoDB connection failed');
  }
};

const handler = async (event, context) => {
  try {
    await connectToDatabase(); // Ensure the database is connected

    const UserSchema = new mongoose.Schema({
      username: String,
      rating: Number,
    });

    const User = mongoose.model('User', UserSchema);

    // Fetch users sorted by rating in descending order
    const users = await User.find().sort({ rating: -1 });

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

module.exports = { handler };
