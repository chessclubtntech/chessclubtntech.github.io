const mongoose = require('mongoose');
const User = require('../../models/user.js'); // Adjust the path as necessary

exports.handler = async (event) => {
  const mongoUri = process.env.MONGODB_URI; // Ensure this URI is correct

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      dbName: 'chess_database', // Specify the database name here
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected');

    // Fetch users from the 'users' collection
    const users = await User.find({}, 'username rating');
    console.log('Fetched users:', users);

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error('Error fetching users:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch users' }),
    };
  } finally {
    mongoose.connection.close();
  }
};
