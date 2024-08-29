const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user1Name: { type: String, required: true }, // Add this field
  user1Result: { type: String, enum: ['Win', 'Draw', 'Lose'], required: true },
  user2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2Name: { type: String, required: true }, // Add this field
  user2Result: { type: String, enum: ['Win', 'Draw', 'Lose'], required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
