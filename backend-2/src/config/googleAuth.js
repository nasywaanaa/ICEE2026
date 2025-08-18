const { google } = require('googleapis');

const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
let privateKey = process.env.GOOGLE_PRIVATE_KEY;

if (!serviceAccountEmail || !privateKey) {
  console.warn('[backend-2/googleAuth] Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY.');
}

if (privateKey && privateKey.includes('\\n')) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

const scopes = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

const jwtClient = new google.auth.JWT({
  email: serviceAccountEmail,
  key: privateKey,
  scopes,
});

const sheets = google.sheets({ version: 'v4', auth: jwtClient });
const drive = google.drive({ version: 'v3', auth: jwtClient });

module.exports = { sheets, drive, authClient: jwtClient };


