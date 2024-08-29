const mongoose = require('mongoose');
const Result = require('../../models/results.js'); // Adjust the path as necessary

const mongoUri = process.env.MONGODB_URI; // Ensure your environment variable is set correctly

exports.handler = async (event) => {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    // Parse the request body
    const { user1Id, user1Result, user2Id, user2Result } = JSON.parse(event.body);

    // Validate input data
    if (!user1Id || !user1Result || !user2Id || !user2Result) {
      console.error('Invalid input data:', { user1Id, user1Result, user2Id, user2Result });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input data' })
      };
    }

    // Create a new result document
    const result = new Result({
      user1Id,
      user1Result,
      user2Id,
      user2Result
    });

    // Save the result to the database
    await result.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Result submitted successfully' })
    };
  } catch (error) {
    console.error('Error submitting result:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  } finally {
    mongoose.connection.close();
  }
};
