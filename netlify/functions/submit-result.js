const mongoose = require('mongoose');
const Result = require('../../models/results.js'); // Path to your Result model
const User = require('../../models/user.js'); // Path to your User model

const mongoUri = process.env.MONGODB_URI;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" })
    };
  }

  try {
    // Parse incoming JSON data
    const { user1Id, user1Result, user2Id, user2Result } = JSON.parse(event.body);

    // Check for missing fields
    if (!user1Id || !user2Id || !user1Result || !user2Result) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Bad Request: Missing required fields" })
      };
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Fetch user details for both users
    const [user1, user2] = await Promise.all([
      User.findById(user1Id).exec(),
      User.findById(user2Id).exec()
    ]);

    // Check if users are found
    if (!user1 || !user2) {
      await mongoose.disconnect();
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User(s) not found" })
      };
    }

    // Create a new result document with usernames
    const result = new Result({
      user1Id,
      user1Name: user1.username || "Unknown", // Get user1 username
      user1Result,
      user2Id,
      user2Name: user2.username || "Unknown", // Get user2 username
      user2Result,
      date: new Date() // Set the current date
    });

    // Save the result to the database
    await result.save();

    // Update user1
    await User.updateOne(
      { _id: user1Id },
      { $inc: { numGamesPlayed: 1, totalTournamentScore: getScore(user1Result) } }
    );

    // Update user2
    await User.updateOne(
      { _id: user2Id },
      { $inc: { numGamesPlayed: 1, totalTournamentScore: getScore(user2Result) } }
    );

    // Disconnect from MongoDB
    await mongoose.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Result submitted successfully" })
    };
  } catch (error) {
    console.error('Error submitting result:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

// Helper function to convert result to score
function getScore(result) {
  switch(result) {
    case 'Win':
      return 3;
    case 'Draw':
      return 1;
    case 'Lose':
      return 0;
    default:
      return 0;
  }
}
