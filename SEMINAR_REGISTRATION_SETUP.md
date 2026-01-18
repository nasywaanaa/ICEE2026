# Seminar Registration Setup Guide

This document provides an overview of the new Seminar Registration feature that has been added to the ICEE 2026 project.

## Overview

A new Seminar Registration page has been created that follows the same design system, layout, styling, components, and UX patterns as the existing competition registration page. The implementation includes:

- **Frontend**: React/TypeScript components with the same styling and UX patterns
- **Backend**: Google Sheets and Google Drive integration following the same approach as competition registration
- **Route**: `/seminar/register`

## Features

### Form Structure

1. **Top Notes** (displayed at the top):
   - Information about package types (individu and kelompok)
   - Participant categories (umum, HMS, TPB)
   - Pricing information (TBD)

2. **Section 1 - Data Diri Pengisi Form**:
   - Nama Lengkap
   - Email
   - Nomor WhatsApp
   - Jenis Peserta (Umum, Mahasiswa TPB ITB, Anggota HMS ITB)
   - Pekerjaan
   - Institusi
   - Nomor Induk Mahasiswa (conditional - required for TPB/HMS)
   - Alamat
   - Paket Pendaftaran (Individu, 2 orang, 3 orang)

3. **Section 2 - Data Diri Paketan** (only for groups):
   - Shows when Paket Pendaftaran is "2 orang" or "3 orang"
   - Repeats participant fields for Peserta 2 and Peserta 3
   - Same fields as Section 1 for each additional participant

4. **Section 3 - Pembayaran**:
   - Rekapitulasi Pendaftar (read-only summary)
   - Total Harga (read-only, shows "Rp TBD" for now)
   - Potongan (for groups, shows "Rp TBD" for now)
   - Penjelasan Opsi Pembayaran (info block)
   - Upload Bukti Pembayaran (jpg/png/pdf, max 10MB)
   - Status display after submission (INDIVIDU SELESAI / KELOMPOK SELESAI)

### Conditional Logic

- **NIM Field**: 
  - Hidden/disabled for "Umum" participants
  - Required for "Mahasiswa TPB ITB" and "Anggota HMS ITB"

- **Group Participants Section**:
  - Only shown when Paket Pendaftaran is "2 orang" or "3 orang"
  - Validates all group participants before allowing submission

- **Stepper**:
  - Individual: 2 steps (Data Diri → Pembayaran)
  - Group: 3 steps (Data Diri → Data Paketan → Pembayaran)

## File Structure

### Backend Files Created

```
backend-2/src/
├── services/
│   └── seminarSheetsService.js       # Google Sheets service for seminar registrations
├── controllers/
│   └── seminarController.js          # Controller for seminar registration endpoints
├── routes/
│   └── seminar.js                    # Routes for seminar registration API
└── app.js                             # Updated to include seminar routes
```

### Frontend Files Created

```
frontend/src/pages/seminar_registration/
├── SeminarRegistrationPage.tsx       # Main registration page component
├── components/
│   ├── PersonalInfo.tsx              # Section 1: Personal information form
│   ├── PersonalInfo.css
│   ├── GroupParticipants.tsx         # Section 2: Group participants form
│   ├── GroupParticipants.css
│   ├── Payment.tsx                    # Section 3: Payment and file upload
│   ├── Payment.css
│   ├── SeminarRegistrationHeader.tsx  # Header component
│   └── SeminarRegistrationSuccess.tsx # Success page component
```

## API Endpoints

### POST `/api/seminar/submit`
Submit seminar registration with payment proof file.

**Request**: Multipart form data
- `paketPendaftaran`: string (Individu, 2 orang, 3 orang)
- `pengisiForm`: JSON string (participant data)
- `peserta2`: JSON string (optional, for groups)
- `peserta3`: JSON string (optional, for groups)
- `paymentProof`: File (jpg/png/pdf)
- `status`: string (INDIVIDU SELESAI / KELOMPOK SELESAI)
- `totalHarga`: string
- `potongan`: string (for groups)

**Response**:
```json
{
  "success": true,
  "message": "Seminar registration with files submitted successfully"
}
```

### GET `/api/seminar`
Get all seminar registrations.

**Response**:
```json
{
  "success": true,
  "data": [...]
}
```

## Google Sheets Structure

The seminar registration data is stored in a separate Google Sheet with the following columns:

1. Timestamp
2. Paket Pendaftaran
3. Pengisi Form: Nama Lengkap, Email, Nomor WhatsApp, Jenis Peserta, Pekerjaan, Institusi, NIM, Alamat
4. Peserta 2: (same 8 fields)
5. Peserta 3: (same 8 fields)
6. Total Harga
7. Potongan
8. Link Bukti Pembayaran
9. Status

## Google Drive Structure

Payment proof files are uploaded to:
```
GOOGLE_DRIVE_FOLDER_ID/
└── Seminar/
    └── [Participant Name]/
        └── [payment proof file]
```

## Environment Variables

Add these to your `backend-2/.env` file:

```env
# Seminar Registration Google Sheets
SEMINAR_SPREADSHEET_ID=your-seminar-sheets-id
SEMINAR_SHEETS_RANGE=Seminar!A:Z  # Optional, defaults to 'Seminar!A:Z'
```

See `backend-2/ENV_SETUP.md` for complete environment variable documentation.

## Setup Instructions

### 1. Create Google Sheet for Seminar Registration

1. Create a new Google Sheet (separate from competition sheet)
2. Add headers in the first row (see "Google Sheets Structure" above)
3. Copy the Sheet ID from the URL
4. Set `SEMINAR_SPREADSHEET_ID` in your `.env` file

### 2. Set Environment Variables

Add the seminar-specific environment variables to `backend-2/.env`:
```env
SEMINAR_SPREADSHEET_ID=your-seminar-sheets-id
SEMINAR_SHEETS_RANGE=Seminar!A:Z
```

### 3. Grant Permissions

Ensure the Google Service Account has Editor access to:
- The seminar Google Sheet
- The Google Drive folder (same as competition)

### 4. Test the Registration Flow

1. Navigate to `/seminar/register` in your frontend
2. Fill out the form
3. Upload payment proof
4. Submit and verify data appears in Google Sheets

## Validation Rules

- **Email**: Must be valid email format
- **Phone**: Must start with 08 and contain 8-15 digits
- **NIM**: Required only for TPB/HMS participants
- **File Upload**: Max 10MB, formats: jpg, jpeg, png, pdf
- **All fields**: Required unless conditionally hidden

## Pricing

Currently displays "Rp TBD" for both total price and discount. Update the `calculateTotal()` and `calculateDiscount()` functions in `Payment.tsx` when pricing is finalized.

## Styling

All components use the same CSS classes and styling patterns as the competition registration page:
- Same color scheme (gradient buttons, error states, etc.)
- Same form input styles
- Same file upload UI
- Same modal and success page styling
- Responsive design matching competition page

## Testing Checklist

- [ ] Individual registration flow (2 steps)
- [ ] Group registration flow (3 steps)
- [ ] NIM field visibility (hidden for Umum, shown for TPB/HMS)
- [ ] Group participants section (only shown for 2/3 orang packages)
- [ ] File upload (jpg, png, pdf)
- [ ] Form validation (all required fields)
- [ ] Submission to Google Sheets
- [ ] File upload to Google Drive
- [ ] Success page display
- [ ] Responsive design (mobile/tablet/desktop)

## Notes

- The seminar registration uses the same Google Drive folder as competition registration, but creates a "Seminar" subfolder
- The seminar sheet is completely separate from the competition sheet
- All validation follows the same patterns as competition registration
- The UI/UX matches the competition registration page exactly

## Troubleshooting

### Data not appearing in Google Sheets
- Check `SEMINAR_SPREADSHEET_ID` is correct
- Verify service account has Editor access
- Check sheet range matches your headers

### File upload failing
- Verify service account has Editor access to Drive folder
- Check file size (max 10MB)
- Verify file format (jpg, png, pdf only)

### Form validation not working
- Check browser console for JavaScript errors
- Verify all required fields are filled
- Check conditional logic (NIM, group participants)
