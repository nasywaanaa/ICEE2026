const express = require('express');
const multer = require('multer');
const router = express.Router();

const controller = require('../controllers/connecthController');

// Multer middleware for parsing FormData (no files)
const upload = multer();

// Create Connect-H registration (handles both JSON and FormData)
router.post('/submit', upload.none(), controller.createConnectHRegistration);

// Get all Connect-H registrations
router.get('/', controller.getAllConnectHRegistrations);

module.exports = router;
