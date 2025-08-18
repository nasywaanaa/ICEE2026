const express = require('express');
const { google } = require('googleapis');
const { getAuthUrl, saveTokens, getOAuth2ClientWithTokens } = require('../config/googleOAuth');

const router = express.Router();

router.get('/auth', (req, res) => {
  try {
    const url = getAuthUrl();
    return res.redirect(url);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/oauth2/callback', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).json({ success: false, error: 'Missing code' });
    const oauth2 = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    });
    const { tokens } = await oauth2.getToken(code);
    if (!tokens.refresh_token) {
      // Depending on account, Google may not return refresh_token unless prompt=consent and offline; we already set both
      // If still missing, revoke and try again
    }
    // Save to disk (dev) and also display refresh token (for serverless envs like Vercel)
    try { saveTokens(tokens); } catch (_) {}
    const refresh = tokens.refresh_token ? `<p><strong>Refresh Token:</strong> ${tokens.refresh_token}</p>` : '<p><em>No refresh_token returned; try again ensuring consent screen shows.</em></p>';
    return res.send(`
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.5; padding:24px;">
        <h2>Google Drive connected</h2>
        <p>Copy the refresh token below and add it to your Vercel Project Env as <code>GOOGLE_OAUTH_REFRESH_TOKEN</code>.</p>
        ${refresh}
        <p>You may close this window.</p>
      </div>
    `);
  } catch (err) {
    console.error('[google oauth callback]', err);
    return res.status(500).send('OAuth failed: ' + (err.message || 'Unknown error'));
  }
});

router.get('/status', (req, res) => {
  try {
    getOAuth2ClientWithTokens();
    return res.json({ connected: true });
  } catch (_) {
    return res.json({ connected: false });
  }
});

module.exports = router;


