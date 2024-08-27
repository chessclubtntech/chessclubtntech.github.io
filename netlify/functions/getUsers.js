// netlify/functions/getUsers.js
const mongoose = require('mongoose');
const User = require('../../models/user.js'); // Adjust the path as needed

exports.handler = async (event, context) => {
  try {
    const users = await User.find({}, 'username rating');
    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch users', error: error.message }),
    };
  }
};
