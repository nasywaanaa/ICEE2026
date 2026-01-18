# Seminar Registration API Test Script

This script tests the seminar registration API endpoint with three comprehensive test cases covering all `Paket Pendaftaran` and `Jenis Peserta` combinations.

## Test Cases

### Test Case 1: Individu - Umum
- **Paket Pendaftaran**: `Individu`
- **Jenis Peserta**: `Umum` (no NIM required)
- **Email**: nasywaa.anggun@gmail.com
- **Status**: `INDIVIDU SELESAI`
- **Total Harga**: Rp55,000 (Early Bird pricing)
- **Potongan**: Rp0

### Test Case 2: 2 Orang - Mahasiswa TPB ITB
- **Paket Pendaftaran**: `2 orang`
- **Pengisi Form**: `Mahasiswa TPB ITB` (NIM: 1234567890)
- **Peserta 2**: `Mahasiswa TPB ITB` (NIM: 0987654321)
- **Emails**: 
  - syahrialalzaidan@gmail.com (Pengisi Form)
  - study.nasywaa@gmail.com (Peserta 2)
- **Status**: `KELOMPOK SELESAI`
- **Total Harga**: Rp90,000 (HMS & TPB pricing)
- **Potongan**: Rp10,000

### Test Case 3: 3 Orang - Mixed Types
- **Paket Pendaftaran**: `3 orang`
- **Pengisi Form**: `Umum` (no NIM)
- **Peserta 2**: `Mahasiswa TPB ITB` (NIM: 1122334455)
- **Peserta 3**: `Anggota HMS ITB` (NIM: 5544332211)
- **Emails**:
  - nasywaa.anggun@gmail.com (Pengisi Form)
  - syahrialalzaidan@gmail.com (Peserta 2)
  - study.nasywaa@gmail.com (Peserta 3)
- **Status**: `KELOMPOK SELESAI`
- **Total Harga**: Rp135,000 (Early Bird pricing)
- **Potongan**: Rp30,000

## Usage

### Basic Usage (Default: localhost:5002)
```bash
./test-seminar-registration.sh
```

### With Custom API URL
```bash
# Option 1: Environment variable
API_URL=http://localhost:5002 ./test-seminar-registration.sh

# Option 2: Export first
export API_URL=https://your-api-domain.com
./test-seminar-registration.sh
```

### Example Output
```
========================================
Seminar Registration API Test Suite
========================================
API Endpoint: http://localhost:5002/api/seminar/submit

========================================
Test Case 1: Individu - Umum
========================================
Paket Pendaftaran: Individu
Jenis Peserta: Umum
Sending request...

Response Status: 201
Response Body:
{
  "success": true,
  "message": "Seminar registration with files submitted successfully",
  "uniqueId": "SEM-UMUM-001",
  ...
}
✅ Test PASSED
```

## Prerequisites

- `curl` (usually pre-installed on macOS/Linux)
- `jq` (optional, for pretty JSON formatting)
  - Install on macOS: `brew install jq`
  - Install on Linux: `sudo apt-get install jq` or `sudo yum install jq`

## Notes

- The script sends real requests to your API endpoint
- All test emails are configured to use the provided email addresses
- Payment proof file is optional and omitted in these tests
- Each test case validates:
  - HTTP status code (200-299)
  - Response contains `"success":true`
  - Proper JSON structure

## Troubleshooting

### Connection Refused
- Ensure your backend server is running
- Check the API_URL matches your server address

### JSON Parse Errors
- Install `jq` for better JSON formatting
- The script will still work without `jq`, but output will be less readable

### Permission Denied
- Make script executable: `chmod +x test-seminar-registration.sh`
