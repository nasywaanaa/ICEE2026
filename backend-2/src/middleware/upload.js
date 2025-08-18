const multer = require('multer');

const storage = multer.memoryStorage();

const allowed = new Set([
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'image/png',
  'image/jpeg',
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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

const uploadSingle = upload.single('file');

const uploadDocuments = upload.fields([
  { name: 'studentCard', maxCount: 1 },
  { name: 'enrollmentProof', maxCount: 1 },
  { name: 'twibbonProof', maxCount: 1 },
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

module.exports = { uploadSingle, uploadDocuments, handleUploadError };


