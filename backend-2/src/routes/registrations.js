const express = require('express');
const router = express.Router();

const controller = require('../controllers/registrationController');
const { uploadDocuments, uploadSingle, handleUploadError } = require('../middleware/upload');

// Create registration (expects JSON body; documents uploaded separately or via multipart endpoint below)
router.post('/', controller.createRegistration);

// Optional: single document upload, returns Drive link
router.post('/upload', uploadSingle, handleUploadError, controller.uploadDocument);

// Multipart submit in one go (formData including JSON fields and files)
router.post('/submit', uploadDocuments, handleUploadError, controller.createRegistrationWithFiles);

// Check team name availability
router.get('/check-team-name', controller.checkTeamNameAvailability);

module.exports = router;


