const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  school: { type: String, required: false },
  numGamesPlayed: { type: Number, default: 0 }, // Default value: 0
  totalTournamentScore: { type: Number, default: 0 }, // Default value: 0
  rating: { type: String, default: "300P" }, // Default rating: 300P
  role: { type: String, default: "student" }
});

module.exports = mongoose.model('User', userSchema);
