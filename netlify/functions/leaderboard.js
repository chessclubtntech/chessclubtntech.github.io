// netlify/functions/leaderboard.js

const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path based on your file structure

const mongoURI = process.env.MONGODB_URI; // Ensure this environment variable is set in Netlify

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async function (event, context) {
  try {
    // Fetch users and sort by rating in descending order
    const users = await User.find().sort({ rating: -1 }).exec();
    
    // Return sorted users in JSON format
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
  } finally {
    // Close the mongoose connection
    mongoose.connection.close();
  }
};
