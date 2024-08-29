const { MongoClient, ObjectId } = require('mongodb');

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
    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db('chess_database');
    const usersCollection = db.collection('users');
    const resultsCollection = db.collection('results');

    // Fetch user details
    const [user1, user2] = await Promise.all([
      usersCollection.findOne({ _id: ObjectId(user1Id) }),
      usersCollection.findOne({ _id: ObjectId(user2Id) })
    ]);

    // Check if users are found
    if (!user1 || !user2) {
      await client.close();
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User(s) not found" })
      };
    }

    // Create a new result document
    const result = {
      user1Id,
      user1Name: user1.username || "Unknown", // Add user1 name with fallback
      user1Result,
      user2Id,
      user2Name: user2.username || "Unknown", // Add user2 name with fallback
      user2Result,
      date: new Date() // Add current date
    };

    // Save the result to the database
    await resultsCollection.insertOne(result);

    // Update user1
    await usersCollection.updateOne(
      { _id: ObjectId(user1Id) },
      { $inc: { numGamesPlayed: 1, totalTournamentScore: getScore(user1Result) } }
    );

    // Update user2
    await usersCollection.updateOne(
      { _id: ObjectId(user2Id) },
      { $inc: { numGamesPlayed: 1, totalTournamentScore: getScore(user2Result) } }
    );

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Result submitted successfully" })
    };
  } catch (error) {
    console.error('Error submitting result:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" })
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
