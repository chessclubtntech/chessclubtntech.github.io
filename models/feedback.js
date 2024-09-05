const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'feedback' });

module.exports = mongoose.model('Feedback', feedbackSchema);
