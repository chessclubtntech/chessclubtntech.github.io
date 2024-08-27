const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/user.js');
const authRoutes = require('./routes/auth');
const morgan = require('morgan'); // Add morgan for HTTP request logging

const app = express();

const mongoUri = process.env.MONGODB_URI;

app.set('view engine', 'ejs');

// Middleware for logging HTTP requests
app.use(morgan('dev'));

// Middleware for handling JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(session({
  secret: 'e498ee956ef71ba1530cd99f1eb4a6e7',
  resave: false,
  saveUninitialized: true
}));

app.use('/api/auth', authRoutes); // Mount the auth routes on '/api/auth'
app.use(express.static(path.join(__dirname, 'public')));

// Main page with both login and register forms
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 page
app.get('/404', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '404.html'));
});

// Register endpoint
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
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login endpoint
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// API endpoints
app.get('/api/username', (req, res) => {
  const username = req.session.username;
  res.json({ username });
});

app.get('/api/user/all', async (req, res) => {
  try {
    const users = await User.find({}, 'username rating');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboardData = await User.find().sort({ rating: -1 });
    res.json(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard data', error: error.message });
  }
});

app.get('/api/random-users', async (req, res) => {
  try {
    const users = await User.aggregate([{ $sample: { size: 2 } }]);
    res.json({ user1: users[0], user2: users[1] });
  } catch (err) {
    console.error('Error fetching random users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/test-db-connection', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

app.post('/api/update-rating', async (req, res) => {
  try {
    const { userId, ratingUpdate } = req.body;
    await User.findByIdAndUpdate(userId, { $inc: { rating: ratingUpdate } });
    res.json({ message: 'User rating updated successfully' });
  } catch (err) {
    console.error('Error updating user rating:', err);
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
    console.error('Error updating user game data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Catch-all route for any unmatched routes
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
