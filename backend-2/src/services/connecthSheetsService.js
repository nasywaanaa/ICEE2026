const { sheets } = require('../config/googleAuth');

async function addConnectHRegistration(registrationData) {
  const {
    selectedCompetition,
    termsAccepted,
    personalInfo,
    submissionDate,
  } = registrationData;

  // Check if it's HMS registration and modify major field
  const isHMS = selectedCompetition.includes('HMS');
  const majorField = isHMS ? `${personalInfo.major || ''} (HMS)` : personalInfo.major || '';

  const rowData = [
    new Date().toISOString(),
    selectedCompetition,
    personalInfo.name || '',
    personalInfo.email || '',
    personalInfo.institution || '',
    majorField,
    personalInfo.idLine || '',
    personalInfo.phone || '',
    termsAccepted ? 'Yes' : 'No',
    submissionDate || new Date().toISOString(),
    'Submitted',
  ];

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: 'ConnectH!A:K', // ConnectH sheet with columns A to K
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [rowData] },
  });
  return response.data;
}

async function getAllConnectHRegistrations() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: 'ConnectH!A:K',
  });
  const rows = response.data.values || [];
  if (rows.length === 0) return [];
  
  const registrations = rows.slice(1).map((row, index) => {
    const [
      timestamp,
      competition,
      name,
      email,
      institution,
      major,
      idLine,
      phone,
      termsAccepted,
      submissionDate,
      status,
    ] = row;
    
    return {
      id: index + 1,
      timestamp,
      selectedCompetition: competition,
      personalInfo: {
        name: name || '',
        email: email || '',
        institution: institution || '',
        major: major || '',
        idLine: idLine || '',
        phone: phone || '',
        commitmentAccepted: termsAccepted === 'Yes',
      },
      termsAccepted: termsAccepted === 'Yes',
      status,
      submissionDate,
    };
  });
  return registrations;
}

module.exports = { addConnectHRegistration, getAllConnectHRegistrations };
