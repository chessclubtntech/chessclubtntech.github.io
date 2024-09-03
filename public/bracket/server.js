const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const Tournament = require('../../models/tournament.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('your-mongodb-connection-string', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// WebSocket setup
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('updateMatch', async (data) => {
    try {
      const tournament = await Tournament.findById(data.tournamentId);
      if (!tournament) return;

      const match = tournament.matches.id(data.matchId);
      if (match) {
        match.winner = data.winner;
        await tournament.save();

        // Emit updated match to all clients
        io.emit('matchUpdated', { tournamentId: data.tournamentId, match });
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.use(express.json());

// API endpoint to get tournament data
app.get('/api/tournaments/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).send('Tournament not found');
    res.json(tournament);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
