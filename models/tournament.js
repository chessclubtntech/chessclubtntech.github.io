const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
  player1: { type: String, required: true },
  player2: { type: String, required: true },
  winner: { type: String, default: null },
  round: { type: Number, required: true },
  nextMatchId: { type: Schema.Types.ObjectId, ref: 'Match', default: null },
});

const tournamentSchema = new Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  matches: [matchSchema],
});

const Tournament = mongoose.model('Tournament', tournamentSchema);
module.exports = Tournament;
