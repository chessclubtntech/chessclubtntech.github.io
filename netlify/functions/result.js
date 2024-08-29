const mongoose = require('mongoose');
const Result = require('../../models/results.js'); // Adjust the path as necessary
const User = require('../../models/user.js'); // Make sure you have a User model

const mongoUri = process.env.MONGODB_URI; // Ensure your environment variable is set correctly

exports.handler = async (event) => {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Ensure body exists and is valid JSON
    if (!event.body) {
      console.error('Request body is empty');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is empty' })
      };
    }

    const parsedBody = JSON.parse(event.body);
    console.log('Parsed Body:', parsedBody); // Debugging line

    const { user1Id, user1Result, user2Id, user2Result } = parsedBody;

    // Check for missing fields
    if (!user1Id || !user2Id || !user1Result || !user2Result) {
      console.error('Missing required fields');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Bad Request: Missing required fields' })
      };
    }

    // Fetch user names
    const [user1, user2] = await Promise.all([
      User.findById(user1Id),
      User.findById(user2Id)
    ]);

    if (!user1 || !user2) {
      console.error('One or both users not found');
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    // Create a new result document
    const result = new Result({
      user1Id,
      user1Name: user1.username,
      user1Result,
      user2Id,
      user2Name: user2.username,
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
