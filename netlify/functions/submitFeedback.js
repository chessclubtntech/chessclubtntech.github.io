const mongoose = require('mongoose');
const Feedback = require('../../models/feedback.js');

const mongoUri = process.env.MONGODB_URI;

exports.handler = async (event) => {
  try {
    const { userId, feedback } = JSON.parse(event.body);
    
    if (!userId || !feedback) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID and feedback are required' })
      };
    }

    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'chess_database'
      });
    }

    // Save feedback to MongoDB
    const newFeedback = new Feedback({ userId, feedback });
    await newFeedback.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Feedback submitted successfully' })
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
