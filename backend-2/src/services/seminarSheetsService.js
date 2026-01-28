const { sheets } = require('../config/googleAuth');

/**
 * Generate unique ID based on jenisPeserta
 * A-XXX for Umum, B-XXX for Mahasiswa TPB ITB or Anggota HMS ITB
 * @param {string} jenisPeserta - Type of participant ('Umum' or other)
 * @param {string[]} pendingIds - Array of IDs that will be written in this batch but haven't been written yet
 */
async function generateUniqueId(jenisPeserta, pendingIds = []) {
  try {
    // Read sheet directly to avoid circular dependency
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SEMINAR_SPREADSHEET_ID,
      range: process.env.SEMINAR_SHEETS_RANGE || 'Seminar!A:Z',
    });
    const rows = response.data.values || [];
    
    // Determine prefix based on jenisPeserta
    const prefix = jenisPeserta === 'Umum' ? 'A' : 'B';
    
    // Find the highest number for this prefix
    // Skip header row (index 0) if exists
    let maxNumber = 0;
    const startIndex = rows.length > 0 && rows[0][0] === 'Timestamp' ? 1 : 0;
    
    // Check all unique ID columns: uniqueId (index 1), uniqueIdPeserta2 (index 2), uniqueIdPeserta3 (index 3)
    const uniqueIdColumns = [1, 2, 3];
    
    for (let i = startIndex; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      
      // Check all unique ID columns
      for (const colIndex of uniqueIdColumns) {
        if (row[colIndex]) {
          const existingId = row[colIndex].toString().trim();
          if (existingId.startsWith(prefix + '-')) {
            const numberStr = existingId.substring(prefix.length + 1);
            const number = parseInt(numberStr) || 0;
            if (number > maxNumber) {
              maxNumber = number;
            }
          }
        }
      }
    }
    
    // Also check pending IDs that will be written in this batch
    for (const pendingId of pendingIds) {
      if (pendingId && typeof pendingId === 'string') {
        const trimmedId = pendingId.trim();
        if (trimmedId.startsWith(prefix + '-')) {
          const numberStr = trimmedId.substring(prefix.length + 1);
          const number = parseInt(numberStr) || 0;
          if (number > maxNumber) {
            maxNumber = number;
          }
        }
      }
    }
    
    // Generate new ID
    const newNumber = maxNumber + 1;
    const uniqueId = `${prefix}-${String(newNumber).padStart(3, '0')}`;
    
    return uniqueId;
  } catch (error) {
    console.error('[generateUniqueId] Error:', error);
    // Fallback: generate based on timestamp if sheet read fails
    const prefix = jenisPeserta === 'Umum' ? 'A' : 'B';
    const timestamp = Date.now();
    return `${prefix}-${String(timestamp % 1000).padStart(3, '0')}`;
  }
}

async function addSeminarRegistration(registrationData) {
  const {
    paketPendaftaran,
    pengisiForm,
    peserta2,
    peserta3,
    totalHarga,
    potongan,
    paymentMethod,
    paymentProofLink,
    status,
    uniqueId, // Unique ID for pengisi form
    uniqueIdPeserta2, // Unique ID for peserta2
    uniqueIdPeserta3, // Unique ID for peserta3
  } = registrationData;

  const rowData = [
    new Date().toISOString(),
    uniqueId || '', // Unique ID for pengisi form
    uniqueIdPeserta2 || '', // Unique ID for peserta2
    uniqueIdPeserta3 || '', // Unique ID for peserta3
    paketPendaftaran,
    // Data Pengisi Form
    pengisiForm.namaLengkap || '',
    pengisiForm.email || '',
    pengisiForm.nomorWhatsApp || '',
    pengisiForm.jenisPeserta || '',
    pengisiForm.pekerjaan || '',
    pengisiForm.institusi || '',
    pengisiForm.nomorIndukMahasiswa || '',
    pengisiForm.alamat || '',
    // Peserta 2 (if exists)
    peserta2?.namaLengkap || '',
    peserta2?.email || '',
    peserta2?.nomorWhatsApp || '',
    peserta2?.jenisPeserta || '',
    peserta2?.pekerjaan || '',
    peserta2?.institusi || '',
    peserta2?.nomorIndukMahasiswa || '',
    peserta2?.alamat || '',
    // Peserta 3 (if exists)
    peserta3?.namaLengkap || '',
    peserta3?.email || '',
    peserta3?.nomorWhatsApp || '',
    peserta3?.jenisPeserta || '',
    peserta3?.pekerjaan || '',
    peserta3?.institusi || '',
    peserta3?.nomorIndukMahasiswa || '',
    peserta3?.alamat || '',
    // Payment info
    totalHarga || '',
    potongan || '',
    paymentMethod || '',
    paymentProofLink || '',
    status || '',
  ];

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SEMINAR_SPREADSHEET_ID,
    range: process.env.SEMINAR_SHEETS_RANGE || 'Seminar!A:Z',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [rowData] },
  });
  return response.data;
}

async function getAllSeminarRegistrations() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SEMINAR_SPREADSHEET_ID,
    range: process.env.SEMINAR_SHEETS_RANGE || 'Seminar!A:Z',
  });
  const rows = response.data.values || [];
  if (rows.length === 0) return [];
  
  const registrations = rows.slice(1).map((row, index) => {
    const [
      timestamp,
      uniqueId,
      uniqueIdPeserta2,
      uniqueIdPeserta3,
      paketPendaftaran,
      pengisiNama, pengisiEmail, pengisiWhatsApp, pengisiJenisPeserta, pengisiPekerjaan, pengisiInstitusi, pengisiNIM, pengisiAlamat,
      peserta2Nama, peserta2Email, peserta2WhatsApp, peserta2JenisPeserta, peserta2Pekerjaan, peserta2Institusi, peserta2NIM, peserta2Alamat,
      peserta3Nama, peserta3Email, peserta3WhatsApp, peserta3JenisPeserta, peserta3Pekerjaan, peserta3Institusi, peserta3NIM, peserta3Alamat,
      totalHarga, potongan, paymentMethod, paymentProofLink, status,
    ] = row;
    
    return {
      id: index + 1,
      timestamp,
      uniqueId: uniqueId || '',
      uniqueIdPeserta2: uniqueIdPeserta2 || '',
      uniqueIdPeserta3: uniqueIdPeserta3 || '',
      paketPendaftaran,
      pengisiForm: {
        namaLengkap: pengisiNama || '',
        email: pengisiEmail || '',
        nomorWhatsApp: pengisiWhatsApp || '',
        jenisPeserta: pengisiJenisPeserta || '',
        pekerjaan: pengisiPekerjaan || '',
        institusi: pengisiInstitusi || '',
        nomorIndukMahasiswa: pengisiNIM || '',
        alamat: pengisiAlamat || '',
      },
      peserta2: peserta2Nama ? {
        namaLengkap: peserta2Nama || '',
        email: peserta2Email || '',
        nomorWhatsApp: peserta2WhatsApp || '',
        jenisPeserta: peserta2JenisPeserta || '',
        pekerjaan: peserta2Pekerjaan || '',
        institusi: peserta2Institusi || '',
        nomorIndukMahasiswa: peserta2NIM || '',
        alamat: peserta2Alamat || '',
      } : null,
      peserta3: peserta3Nama ? {
        namaLengkap: peserta3Nama || '',
        email: peserta3Email || '',
        nomorWhatsApp: peserta3WhatsApp || '',
        jenisPeserta: peserta3JenisPeserta || '',
        pekerjaan: peserta3Pekerjaan || '',
        institusi: peserta3Institusi || '',
        nomorIndukMahasiswa: peserta3NIM || '',
        alamat: peserta3Alamat || '',
      } : null,
      totalHarga,
      potongan,
      paymentMethod,
      paymentProofLink,
      status,
    };
  });
  return registrations;
}

module.exports = { 
  addSeminarRegistration, 
  getAllSeminarRegistrations,
  generateUniqueId 
};
