const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const registrationRoutes = require('./routes/registrations');
const googleAuthRoutes = require('./routes/googleAuth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// Routes
app.use('/api/registrations', registrationRoutes);
app.use('/api/google', googleAuthRoutes);

// Error handler fallback
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`[backend-2] Server listening on port ${PORT}`);
  console.log("[OAuth] Using client_id:", process.env.GOOGLE_OAUTH_CLIENT_ID);
});


