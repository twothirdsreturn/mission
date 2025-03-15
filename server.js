// Server configuration for the Golden MSP Acquisition Adventure Game
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cron = require('node-cron');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// MongoDB connection (for storing game state and MSP data)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/golden-msp-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// API routes for data fetching and game state persistence
app.get('/api/deals', async (req, res) => {
  try {
    // This would fetch from the database in production
    // For now, we'll return a success message
    res.json({ success: true, message: 'API endpoint for fetching deals' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Schedule hourly job to fetch new MSP listings
cron.schedule('0 * * * *', () => {
  console.log('Running hourly job to fetch new MSP listings');
  // This would call the data sourcing service in production
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
