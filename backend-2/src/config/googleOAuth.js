const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI;
const DRIVE_SCOPE = process.env.GOOGLE_DRIVE_SCOPE || 'https://www.googleapis.com/auth/drive.file';
const ENV_REFRESH_TOKEN = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  console.warn('[backend-2/googleOAuth] Missing GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET / GOOGLE_OAUTH_REDIRECT_URI. OAuth will not work until set.');
}

const TOKENS_PATH = path.join(__dirname, 'google-oauth-tokens.json');

function createOAuth2Client() {
  return new google.auth.OAuth2({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  });
}

function loadTokens() {
  // Prefer env-based refresh token for serverless (e.g., Vercel)
  if (ENV_REFRESH_TOKEN) {
    return { refresh_token: ENV_REFRESH_TOKEN };
  }
  try {
    if (fs.existsSync(TOKENS_PATH)) {
      const raw = fs.readFileSync(TOKENS_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[googleOAuth] Failed to load tokens:', err.message);
  }
  return null;
}

function saveTokens(tokens) {
  try {
    // In serverless, writing to disk is ephemeral. Caller may choose to surface the refresh token instead.
    fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2), 'utf8');
  } catch (err) {
    console.error('[googleOAuth] Failed to save tokens:', err.message);
    throw err;
  }
}

function getAuthUrl() {
  const oauth2 = createOAuth2Client();
  return oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [DRIVE_SCOPE],
  });
}

function getOAuth2ClientWithTokens() {
  const oauth2 = createOAuth2Client();
  const tokens = loadTokens();
  if (!tokens) {
    const err = new Error('Google Drive is not connected. Visit /api/google/auth to authorize.');
    err.status = 401;
    throw err;
  }
  oauth2.setCredentials(tokens);
  return oauth2;
}

module.exports = {
  getAuthUrl,
  saveTokens,
  getOAuth2ClientWithTokens,
};


