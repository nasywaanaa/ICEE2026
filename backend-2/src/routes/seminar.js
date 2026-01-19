const express = require('express');
const router = express.Router();

const controller = require('../controllers/seminarController');
const multer = require('multer');

const storage = multer.memoryStorage();
const allowed = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
]);

function fileFilter(req, file, cb) {
  if (!allowed.has(file.mimetype)) {
    const err = new Error(`Forbidden file type: ${file.mimetype}`);
    err.code = 'FORBIDDEN_FILE_TYPE';
    return cb(err);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 }, // 500KB
  fileFilter,
});

const uploadPaymentProof = upload.fields([
  { name: 'paymentProof', maxCount: 1 },
]);

function handleUploadError(err, req, res, next) {
  if (!err) return next();
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, error: 'File too large' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ success: false, error: 'Unexpected file field' });
  }
  if (err.code === 'FORBIDDEN_FILE_TYPE') {
    return res.status(403).json({ success: false, error: err.message });
  }
  return res.status(400).json({ success: false, error: err.message || 'Upload error' });
}

// Create seminar registration (expects JSON body; documents uploaded separately)
router.post('/', controller.createSeminarRegistration);

// Multipart submit in one go (formData including JSON fields and files)
router.post('/submit', uploadPaymentProof, handleUploadError, controller.createSeminarRegistrationWithFiles);

// Get all seminar registrations
router.get('/', controller.getAllSeminarRegistrations);

// Send payment confirmation email (after payment verification by ICEE staff)
router.post('/send-payment-confirmation', controller.sendPaymentConfirmation);

// Health check endpoint for email service configuration
router.get('/email-health', controller.checkEmailHealth);

module.exports = router;
