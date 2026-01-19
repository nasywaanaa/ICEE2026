# Email Sending Issue Analysis

## Problem Summary
The test script (`test-seminar-registration.sh`) works successfully locally, but emails are not being sent when the form is submitted through the deployed website.

## Root Causes Identified

### 1. **Missing Environment Variables in Production** ⚠️ (MOST LIKELY)
The Brevo email service requires these environment variables:
- `BREVO_API_KEY` - Required for API authentication
- `BREVO_SENDER_EMAIL` - Sender email (has fallback)
- `BREVO_SENDER_NAME` - Sender name (has fallback)

**Issue**: If `BREVO_API_KEY` is `undefined` in production, the API call will fail silently.

**Location**: `backend-2/src/services/brevoEmailService.js:3`
```javascript
const BREVO_API_KEY = process.env.BREVO_API_KEY
```

### 2. **Silent Error Handling** ⚠️
Email errors are caught but don't fail the request, so the API returns success even when emails fail.

**Location**: `backend-2/src/controllers/seminarController.js:142-193`
```javascript
// Email errors are caught but only logged
emailPromises.push(
  sendSeminarRegistrationEmail(...).catch(err => {
    console.error('[Email Error] Failed to send email:', err);
    return { success: false, error: err.message };
  })
);
```

### 3. **No Environment Variable Validation**
The code doesn't validate that required environment variables exist before attempting to send emails.

### 4. **Potential API Endpoint Mismatch**
The frontend constructs the API URL dynamically:
```javascript
const RAW_BASE = (import.meta as any).env?.VITE_API_BASE_URL || ''
const API_BASE = RAW_BASE && !/^https?:\/\//i.test(RAW_BASE) 
  ? `https://${RAW_BASE}` 
  : (RAW_BASE || 'http://localhost:5002')
```

If `VITE_API_BASE_URL` is not set correctly in production, it might be calling the wrong endpoint.

## Diagnostic Steps

### Step 1: Check Environment Variables in Production
Verify these are set in your deployment platform:
```bash
BREVO_API_KEY=xkeysib-your-actual-api-key
BREVO_SENDER_EMAIL=noreply@icee2026.com  # Must be verified in Brevo
BREVO_SENDER_NAME=ICEE 2026
```

### Step 2: Check Backend Logs
Look for these log messages in your production logs:
- `[Email Sent]` - Email was sent successfully
- `[Email Error] Failed to send email:` - Email failed
- `[Brevo Email Service] Error sending email:` - Detailed error from Brevo service

### Step 3: Verify API Endpoint
Check browser Network tab when submitting the form:
- What URL is being called?
- What's the response status code?
- What's the response body?

### Step 4: Test Brevo API Key
Test if the API key works by making a direct API call:
```bash
curl -X POST 'https://api.brevo.com/v3/smtp/email' \
  -H 'api-key: YOUR_BREVO_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "sender": {"name": "ICEE 2026", "email": "noreply@icee2026.com"},
    "to": [{"email": "test@example.com", "name": "Test"}],
    "subject": "Test",
    "htmlContent": "<p>Test</p>"
  }'
```

## Recommended Fixes

### ✅ Fix 1: Add Environment Variable Validation (IMPLEMENTED)
Added validation at startup and before sending emails to ensure required variables are set.

### ✅ Fix 2: Improve Error Logging (IMPLEMENTED)
Added detailed error logging with:
- Email addresses and unique IDs in logs
- Success/failure counts
- Detailed error objects with stack traces
- HTTP status codes and API responses

### ✅ Fix 3: Add Health Check Endpoint (IMPLEMENTED)
Created `/api/seminar/email-health` endpoint to verify email service configuration.

**Usage:**
```bash
curl https://your-api-domain.com/api/seminar/email-health
```

**Response:**
```json
{
  "success": true,
  "health": {
    "emailService": "Brevo",
    "configured": {
      "apiKey": true,
      "apiKeyLength": 70,
      "senderEmail": "noreply@icee2026.com",
      "senderName": "ICEE 2026"
    },
    "status": "configured",
    "message": "Email service is configured. Check logs for actual sending status."
  }
}
```

### ✅ Fix 4: Better Error Messages (IMPLEMENTED)
Added specific error messages for:
- Missing API key
- Authentication failures (401)
- Permission issues (403)
- General API errors

## Next Steps

1. **Immediate**: Check if `BREVO_API_KEY` is set in your production environment
   ```bash
   # In your deployment platform, verify:
   echo $BREVO_API_KEY
   ```

2. **Immediate**: Check production logs for email-related errors
   - Look for `[Email Sent] ✅` for successful sends
   - Look for `[Email Error] ❌` for failures
   - Look for `⚠️ WARNING: BREVO_API_KEY is not set!` at startup

3. **Immediate**: Test the health check endpoint
   ```bash
   curl https://your-api-domain.com/api/seminar/email-health
   ```

4. **Immediate**: Verify Brevo sender email is verified
   - Log into Brevo dashboard
   - Go to Senders & IP
   - Ensure `BREVO_SENDER_EMAIL` is verified

5. **Debugging**: Check browser Network tab when submitting form
   - What URL is being called?
   - What's the response status code?
   - What's the response body?

## Testing the Fixes

After deploying these changes:

1. **Check startup logs** - You should see warnings if `BREVO_API_KEY` is missing
2. **Test health endpoint** - Verify configuration is correct
3. **Submit a test registration** - Check logs for detailed email sending status
4. **Monitor logs** - Look for the new detailed error messages

## Common Issues and Solutions

### Issue: `BREVO_API_KEY is not configured`
**Solution**: Set the environment variable in your deployment platform

### Issue: `Email service authentication failed: Invalid BREVO_API_KEY`
**Solution**: Verify the API key is correct and hasn't been regenerated

### Issue: `Email service forbidden: Check BREVO_API_KEY permissions`
**Solution**: 
- Verify sender email is verified in Brevo
- Check API key has SMTP sending permissions
- Ensure sender email matches verified domain

### Issue: API endpoint not found
**Solution**: Verify `VITE_API_BASE_URL` is set correctly in frontend environment
