const { sheets } = require('../config/googleAuth');

async function addRegistration(registrationData) {
  const {
    selectedCompetition,
    termsAccepted,
    teamProfile,
    documents = {},
    submissionDate,
  } = registrationData;

  const rowData = [
    new Date().toISOString(),
    selectedCompetition,
    teamProfile.teamName,
    termsAccepted ? 'Yes' : 'No',
    submissionDate || new Date().toISOString(),
    'Submitted',
    '',
    '',
    '',
    '',
  ];

  teamProfile.members.forEach((member) => {
    rowData.push(
      member.name || '',
      member.email || '',
      member.phone || '',
      member.institution || '',
      member.role || ''
    );
  });

  const documentFields = ['studentCard', 'enrollmentProof', 'twibbonProof', 'paymentProof'];
  documentFields.forEach((field) => {
    rowData.push(documents[field]?.driveLink || '');
  });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: process.env.GOOGLE_SHEETS_RANGE,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [rowData] },
  });
  return response.data;
}

async function getAllRegistrations() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: process.env.GOOGLE_SHEETS_RANGE,
  });
  const rows = response.data.values || [];
  if (rows.length === 0) return [];
  const registrations = rows.slice(1).map((row, index) => {
    const [
      timestamp,
      competition,
      teamName,
      termsAccepted,
      submissionDate,
      status,
      reviewNotes,
      reviewedBy,
      reviewDate,
      emailSent,
      leaderName, leaderEmail, leaderPhone, leaderInstitution, leaderRole,
      member1Name, member1Email, member1Phone, member1Institution, member1Role,
      member2Name, member2Email, member2Phone, member2Institution, member2Role,
      studentCardLink, enrollmentProofLink, twibbonProofLink, paymentProofLink,
    ] = row;
    return {
      id: index + 1,
      timestamp,
      selectedCompetition: competition,
      teamProfile: {
        teamName,
        members: [
          { name: leaderName || '', email: leaderEmail || '', phone: leaderPhone || '', institution: leaderInstitution || '', role: leaderRole || 'Leader' },
          { name: member1Name || '', email: member1Email || '', phone: member1Phone || '', institution: member1Institution || '', role: member1Role || 'Member' },
          { name: member2Name || '', email: member2Email || '', phone: member2Phone || '', institution: member2Institution || '', role: member2Role || 'Member' },
        ],
      },
      termsAccepted: termsAccepted === 'Yes',
      status,
      reviewNotes,
      reviewedBy,
      reviewDate,
      emailSent: emailSent === 'Yes',
      documents: {
        studentCard: { driveLink: studentCardLink },
        enrollmentProof: { driveLink: enrollmentProofLink },
        twibbonProof: { driveLink: twibbonProofLink },
        paymentProof: { driveLink: paymentProofLink },
      },
      submissionDate,
    };
  });
  return registrations;
}

async function checkTeamNameAvailability(teamName) {
  const list = await getAllRegistrations();
  const exists = list.find(
    (r) => r.teamProfile?.teamName?.toLowerCase() === String(teamName).toLowerCase()
  );
  return !exists;
}

module.exports = { addRegistration, getAllRegistrations, checkTeamNameAvailability };


