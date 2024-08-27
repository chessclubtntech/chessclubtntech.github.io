const mongoose = require('mongoose');
const User = require('../../models/user.js');

exports.handler = async function(event, context) {
  try {
    // Retrieve user ID from query parameters
    const userId = event.queryStringParameters && event.queryStringParameters.id;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID is required' }),
      };
    }

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid user ID format.' }),
      };
    }

    // Convert userId to ObjectId
    const objectId = mongoose.Types.ObjectId(userId);

    // Fetch the user by ObjectId
    const user = await User.findById(objectId);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ username: user.username }),
    };
  } catch (error) {
    console.error('Error fetching username:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
