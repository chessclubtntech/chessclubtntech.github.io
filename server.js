const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');
const User = require('./models/user.js');

const app = express();

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/chess_rating', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'e498ee956ef71ba1530cd99f1eb4a6e7',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/backgrounds', express.static(path.join(__dirname, 'backgrounds')));

app.get('/api/backgrounds', (req, res) => {
  const backgroundsDir = path.join(__dirname, 'backgrounds');
  fs.readdir(backgroundsDir, (err, files) => {
    if (err) {
      console.error('Error reading backgrounds directory:', err);
      return res.status(500).json({ error: 'Failed to load backgrounds' });
    }
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    res.json(images);
  });
});

// Main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// 404 page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '404.html'));
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    req.session.userId = user._id;
    req.session.username = user.username;
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.get('/api/username', (req, res) => {
  const username = req.session.username;
  res.json({ username });
});

app.get('/api/user/all', async (req, res) => {
  try {
    const users = await User.find({}, 'username rating');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboardData = await User.find().sort({ rating: -1 });
    res.json(leaderboardData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaderboard data', error: error.message });
  }
});

app.get('/club', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'club.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/archive', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'archive.html'));
});

app.get('/background', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'background.html'));
});

app.get('/tournament', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tournament.html'));
});

app.get('/api/random-users', async (req, res) => {
  try {
    const users = await User.aggregate([{ $sample: { size: 2 } }]);
    res.json({ user1: users[0], user2: users[1] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/update-rating', async (req, res) => {
  try {
    const { userId, ratingUpdate } = req.body;
    await User.findByIdAndUpdate(userId, { $inc: { rating: ratingUpdate } });
    res.json({ message: 'User rating updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/update-user-game-data', async (req, res) => {
  try {
    const { userId, outcome } = req.body;
    const user = await User.findById(userId);
    if (user) {
      user.numGamesPlayed += 1;
      user.totalTournamentScore = parseInt(user.totalTournamentScore) + outcome;
      await user.save();
      res.json({ message: 'User game data updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Catch-all route for any unmatched routes
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
