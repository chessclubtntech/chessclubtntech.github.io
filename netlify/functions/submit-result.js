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
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('chess_database');
    const resultsCollection = db.collection('results');

    // Update user1
    await resultsCollection.updateOne(
      { _id: ObjectId(user1Id) },
      { $inc: { numGamesPlayed: 1, totalTournamentScore: getScore(user1Result) } }
    );

    // Update user2
    await resultsCollection.updateOne(
      { _id: ObjectId(user2Id) },
      { $inc: { numGamesPlayed: 1, totalTournamentScore: getScore(user2Result) } }
    );

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Result submitted successfully" })
    };
  } catch (error) {
    console.error('Error:', error);
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
