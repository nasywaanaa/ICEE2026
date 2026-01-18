# Environment Variables Setup

This document describes all environment variables required for the backend-2 application.

## Required Environment Variables

### Google API Configuration (Service Account)
These are required for Google Sheets and Drive integration using service account authentication:

```env
# Google Service Account Email
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com

# Google Private Key (from service account JSON)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Competition Registration (Existing)
```env
# Google Sheets ID for competition registrations
GOOGLE_SHEETS_ID=your-competition-sheets-id

# Google Sheets Range for competition registrations
GOOGLE_SHEETS_RANGE=Registrations!A:Z

# Google Drive Folder ID (root folder for competition documents)
GOOGLE_DRIVE_FOLDER_ID=your-drive-folder-id
```

### Seminar Registration (New)
```env
# Google Sheets ID for seminar registrations
SEMINAR_SPREADSHEET_ID=your-seminar-sheets-id

# Google Sheets Range for seminar registrations (optional, defaults to 'Seminar!A:Z')
SEMINAR_SHEETS_RANGE=Seminar!A:Z

# Note: Seminar documents will be uploaded to the same Drive folder structure
# Files will be stored under: GOOGLE_DRIVE_FOLDER_ID/Seminar/[Participant Name]/
```

### Google OAuth Configuration (Optional - for OAuth-based Drive access)
```env
# OAuth Client ID
GOOGLE_OAUTH_CLIENT_ID=your-oauth-client-id

# OAuth Client Secret
GOOGLE_OAUTH_CLIENT_SECRET=your-oauth-client-secret

# OAuth Redirect URI
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5000/api/google/auth/callback

# OAuth Refresh Token (optional, can be stored in google-oauth-tokens.json)
GOOGLE_OAUTH_REFRESH_TOKEN=your-refresh-token
```

### Brevo Email Configuration (For Seminar Registration)
```env
# Brevo API Key (from Brevo dashboard)
BREVO_API_KEY=xkeysib-your-api-key-here

# Brevo Sender Email (must be verified in Brevo)
BREVO_SENDER_EMAIL=noreply@yourdomain.com

# Brevo Sender Name (optional, defaults to 'ICEE 2026')
BREVO_SENDER_NAME=ICEE 2026
```

**Note**: The API key is currently hardcoded as a fallback, but it's recommended to set it as an environment variable for security.

### Server Configuration
```env
# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

## Setup Instructions

### 1. Google Cloud Project Setup

1. Create a Google Cloud Project
2. Enable the following APIs:
   - Google Sheets API
   - Google Drive API

### 2. Service Account Setup (Recommended for Production)

1. Go to Google Cloud Console > IAM & Admin > Service Accounts
2. Create a new service account
3. Download the JSON key file
4. Extract the `client_email` and `private_key` from the JSON file
5. Set `GOOGLE_SERVICE_ACCOUNT_EMAIL` to the `client_email` value
6. Set `GOOGLE_PRIVATE_KEY` to the `private_key` value (keep the `\n` characters)

### 3. Google Sheets Setup

#### For Competition Registration:
1. Create a Google Sheet
2. Add headers in the first row (or use the default structure)
3. Copy the Sheet ID from the URL
4. Set `GOOGLE_SHEETS_ID` to the Sheet ID
5. Set `GOOGLE_SHEETS_RANGE` to the range (e.g., `Registrations!A:Z`)

#### For Seminar Registration:
1. Create a new Google Sheet (separate from competition sheet)
2. Add headers in the first row:
   - Timestamp
   - Unique ID (Kode Pendaftaran)
   - Paket Pendaftaran
   - Pengisi Form fields (Nama Lengkap, Email, Nomor WhatsApp, Jenis Peserta, Pekerjaan, Institusi, NIM, Alamat)
   - Peserta 2 fields (same as Pengisi Form)
   - Peserta 3 fields (same as Pengisi Form)
   - Total Harga
   - Potongan
   - Link Bukti Pembayaran
   - Status
3. Copy the Sheet ID from the URL
4. Set `SEMINAR_SPREADSHEET_ID` to the Sheet ID
5. Set `SEMINAR_SHEETS_RANGE` to the range (e.g., `Seminar!A:Z`)

**Note**: The Unique ID column will automatically be populated with codes like A-001, A-002 (for Umum) or B-001, B-002 (for Mahasiswa TPB/Anggota HMS).

### 4. Google Drive Setup

1. Create a folder in Google Drive for document storage
2. Share the folder with the service account email (give Editor access)
3. Copy the Folder ID from the URL
4. Set `GOOGLE_DRIVE_FOLDER_ID` to the Folder ID

### 5. Environment File

Create a `.env` file in the `backend-2` directory:

```bash
cd backend-2
cp .env.example .env  # If .env.example exists
# Or create .env manually
```

Add all the required environment variables to the `.env` file.

## Notes

- **Service Account vs OAuth**: The application uses service account authentication by default (more secure for server-to-server). OAuth is optional and used for user-based authentication.
- **Drive Folder Structure**: 
  - Competition documents: `GOOGLE_DRIVE_FOLDER_ID/[Competition Name]/[Team Name]/`
  - Seminar documents: `GOOGLE_DRIVE_FOLDER_ID/Seminar/[Participant Name]/`
- **Sheet Permissions**: Make sure the service account has Editor access to both Google Sheets and the Drive folder.
- **Private Key Format**: The `GOOGLE_PRIVATE_KEY` should include the `\n` characters. In `.env` files, you may need to use actual newlines or escape sequences.

## Troubleshooting

### Error: "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY"
- Ensure both variables are set in your `.env` file
- Check that the private key includes the BEGIN/END markers

### Error: "GOOGLE_DRIVE_FOLDER_ID is not configured"
- Set the `GOOGLE_DRIVE_FOLDER_ID` environment variable
- Ensure the folder ID is correct (from the Drive URL)

### Error: "The caller does not have permission"
- Ensure the service account has Editor access to the Google Sheet
- Ensure the service account has Editor access to the Google Drive folder
- Check that the APIs are enabled in Google Cloud Console

### Error: "SEMINAR_SPREADSHEET_ID is not configured"
- Create a new Google Sheet for seminar registrations
- Set the `SEMINAR_SPREADSHEET_ID` environment variable
- Optionally set `SEMINAR_SHEETS_RANGE` (defaults to `Seminar!A:Z`)

### 6. Brevo Email Setup

1. Sign up for a Brevo account at https://www.brevo.com
2. Go to Settings > SMTP & API
3. Copy your API key (starts with `xkeysib-`)
4. Set `BREVO_API_KEY` in your `.env` file
5. Verify your sender email address in Brevo:
   - Go to Settings > Senders & IP
   - Add and verify your sender email address
   - Set `BREVO_SENDER_EMAIL` to your verified email
6. The sender email must be verified before you can send emails

**Note**: Unique registration IDs are automatically generated:
- **A-XXX** for "Umum" (General) participants
- **B-XXX** for "Mahasiswa TPB ITB" or "Anggota HMS ITB" participants

The unique ID is saved to Google Sheets and sent to the participant's email via Brevo.

### Error: "Failed to send email" or Brevo email issues
- Ensure `BREVO_API_KEY` is set correctly in your `.env` file
- Verify your sender email address in Brevo dashboard
- Check that the sender email is verified
- Ensure the recipient email is valid
- Check Brevo API logs in the Brevo dashboard for detailed error messages
