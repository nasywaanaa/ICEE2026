#!/bin/bash

# Test Script for Seminar Registration API
# Tests all Paket Pendaftaran and Jenis Peserta combinations

# Configuration
API_URL="${API_URL:-http://localhost:5002}"
ENDPOINT="${API_URL}/api/seminar/submit"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper function to print test header
print_test_header() {
    echo ""
    echo "========================================"
    echo -e "${BLUE}$1${NC}"
    echo "========================================"
}

# Helper function to print response
print_response() {
    local status_code=$1
    local response_body=$2
    
    echo -e "${YELLOW}Response Status:${NC} $status_code"
    echo -e "${YELLOW}Response Body:${NC}"
    echo "$response_body" | jq '.' 2>/dev/null || echo "$response_body"
    echo ""
}

# Helper function to validate response
validate_response() {
    local status_code=$1
    local response_body=$2
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        if echo "$response_body" | grep -q '"success":true'; then
            echo -e "${GREEN}✅ Test PASSED${NC}"
            return 0
        else
            echo -e "${RED}❌ Test FAILED: Response indicates failure${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Test FAILED: HTTP $status_code${NC}"
        return 1
    fi
}

# Test Case 1: Individu - Umum
test_case_1() {
    print_test_header "Test Case 1: Individu - Umum"
    
    echo "Paket Pendaftaran: Individu"
    echo "Jenis Peserta: Umum"
    echo "Sending request..."
    echo ""
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
        -F "paketPendaftaran=Individu" \
        -F 'pengisiForm={
            "namaLengkap": "Test User Individu",
            "email": "nasywaa.anggun@gmail.com",
            "nomorWhatsApp": "081234567890",
            "jenisPeserta": "Umum",
            "pekerjaan": "Mahasiswa",
            "institusi": "Universitas Test",
            "nomorIndukMahasiswa": "",
            "alamat": "Jl. Test No. 123, Jakarta",
            "paketPendaftaran": "Individu"
        }' \
        -F "status=INDIVIDU SELESAI" \
        -F "totalHarga=55000" \
        -F "potongan=0")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$http_code" "$body"
    validate_response "$http_code" "$body"
}

# Test Case 2: 2 Orang - Mahasiswa TPB ITB
test_case_2() {
    print_test_header "Test Case 2: 2 Orang - Mahasiswa TPB ITB"
    
    echo "Paket Pendaftaran: 2 orang"
    echo "Pengisi Form: Mahasiswa TPB ITB"
    echo "Peserta 2: Mahasiswa TPB ITB"
    echo "Sending request..."
    echo ""
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
        -F "paketPendaftaran=2 orang" \
        -F 'pengisiForm={
            "namaLengkap": "Test User TPB 1",
            "email": "syahrialalzaidan@gmail.com",
            "nomorWhatsApp": "081234567891",
            "jenisPeserta": "Mahasiswa TPB ITB",
            "pekerjaan": "Mahasiswa",
            "institusi": "Institut Teknologi Bandung",
            "nomorIndukMahasiswa": "1234567890",
            "alamat": "Jl. Test No. 456, Bandung",
            "paketPendaftaran": "2 orang"
        }' \
        -F 'peserta2={
            "namaLengkap": "Test User TPB 2",
            "email": "study.nasywaa@gmail.com",
            "nomorWhatsApp": "081234567892",
            "jenisPeserta": "Mahasiswa TPB ITB",
            "pekerjaan": "Mahasiswa",
            "institusi": "Institut Teknologi Bandung",
            "nomorIndukMahasiswa": "0987654321",
            "alamat": "Jl. Test No. 789, Bandung"
        }' \
        -F "status=KELOMPOK SELESAI" \
        -F "totalHarga=90000" \
        -F "potongan=10000")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$http_code" "$body"
    validate_response "$http_code" "$body"
}

# Test Case 3: 3 Orang - Mixed (Umum, TPB ITB, Anggota HMS ITB)
test_case_3() {
    print_test_header "Test Case 3: 3 Orang - Mixed Types"
    
    echo "Paket Pendaftaran: 3 orang"
    echo "Pengisi Form: Umum"
    echo "Peserta 2: Mahasiswa TPB ITB"
    echo "Peserta 3: Anggota HMS ITB"
    echo "Sending request..."
    echo ""
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
        -F "paketPendaftaran=3 orang" \
        -F 'pengisiForm={
            "namaLengkap": "Test User Umum",
            "email": "studyawa2026@gmail.com",
            "nomorWhatsApp": "081234567893",
            "jenisPeserta": "Umum",
            "pekerjaan": "Professional",
            "institusi": "PT. Test Company",
            "nomorIndukMahasiswa": "",
            "alamat": "Jl. Test No. 111, Jakarta",
            "paketPendaftaran": "3 orang"
        }' \
        -F 'peserta2={
            "namaLengkap": "Test User TPB",
            "email": "18222021@std.stei.itb.ac.id",
            "nomorWhatsApp": "081234567894",
            "jenisPeserta": "Mahasiswa TPB ITB",
            "pekerjaan": "Mahasiswa",
            "institusi": "Institut Teknologi Bandung",
            "nomorIndukMahasiswa": "1122334455",
            "alamat": "Jl. Test No. 222, Bandung"
        }' \
        -F 'peserta3={
            "namaLengkap": "Test User HMS",
            "email": "nasywaa.nugas@gmail.com",
            "nomorWhatsApp": "081234567895",
            "jenisPeserta": "Anggota HMS ITB",
            "pekerjaan": "Mahasiswa",
            "institusi": "Institut Teknologi Bandung",
            "nomorIndukMahasiswa": "5544332211",
            "alamat": "Jl. Test No. 333, Bandung"
        }' \
        -F "status=KELOMPOK SELESAI" \
        -F "totalHarga=135000" \
        -F "potongan=30000")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$http_code" "$body"
    validate_response "$http_code" "$body"
}

# Main execution
main() {
    echo "========================================"
    echo -e "${BLUE}Seminar Registration API Test Suite${NC}"
    echo "========================================"
    echo -e "API Endpoint: ${YELLOW}$ENDPOINT${NC}"
    echo ""
    
    # Check if jq is installed (optional, for pretty JSON)
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}Note: jq not found. JSON responses will not be formatted.${NC}"
        echo "Install jq for better output: brew install jq (macOS) or apt-get install jq (Linux)"
        echo ""
    fi
    
    # Run all test cases
    test_case_1
    test_case_2
    test_case_3
    
    echo ""
    echo "========================================"
    echo -e "${BLUE}All tests completed!${NC}"
    echo "========================================"
}

# Run main function
main
