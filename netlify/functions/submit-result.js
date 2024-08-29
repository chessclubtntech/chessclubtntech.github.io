const mongoose = require('mongoose');
const Result = require('../../models/results'); // Adjust the path as necessary
const User = require('../../models/user'); // Adjust the path as necessary

const mongoUri = process.env.MONGODB_URI;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" })
    };
  }

  try {
    const { user1Id, user1Result, user2Id, user2Result } = JSON.parse(event.body);

    if (!user1Id || !user2Id || !user1Result || !user2Result) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Bad Request: Missing required fields" })
      };
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Fetch user details
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

    // Create a new result document
    const result = new Result({
      user1Id,
      user1Name: user1.username || "Unknown", // Add user1 name with fallback
      user1Result,
      user2Id,
      user2Name: user2.username || "Unknown", // Add user2 name with fallback
      user2Result,
      date: new Date() // Add current date
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

    await mongoose.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Result submitted successfully" })
    };
  } catch (error) {
    console.error('Error submitting result:', error); // Log the error
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
