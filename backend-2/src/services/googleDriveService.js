const { google } = require('googleapis');
const { Readable } = require('stream');
const { getOAuth2ClientWithTokens } = require('../config/googleOAuth');

async function ensureFolder(driveClient, name, parentId) {
  const q = `mimeType = 'application/vnd.google-apps.folder' and name = '${name.replace(/'/g, "\\'")}' and '${parentId}' in parents and trashed = false`;
  const found = await driveClient.files.list({
    q,
    fields: 'files(id, name)',
  });
  if (found.data.files && found.data.files.length > 0) {
    return found.data.files[0];
  }
  const created = await driveClient.files.create({
    requestBody: { name, mimeType: 'application/vnd.google-apps.folder', parents: [parentId] },
    fields: 'id, name, webViewLink',
  });
  return created.data;
}

async function ensureNestedFolders(competition, teamName) {
  const rootId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!rootId) {
    const err = new Error('GOOGLE_DRIVE_FOLDER_ID is not configured');
    err.status = 500;
    throw err;
  }
  const oauth2 = getOAuth2ClientWithTokens();
  const drive = google.drive({ version: 'v3', auth: oauth2 });
  const competitionFolder = await ensureFolder(drive, competition, rootId);
  const teamFolder = await ensureFolder(drive, teamName, competitionFolder.id);
  return { drive, teamFolder };
}

// Special function for seminar payment proof uploads
async function ensureSeminarPaymentFolders(paketPendaftaran) {
  const rootId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!rootId) {
    const err = new Error('GOOGLE_DRIVE_FOLDER_ID is not configured');
    err.status = 500;
    throw err;
  }
  const oauth2 = getOAuth2ClientWithTokens();
  const drive = google.drive({ version: 'v3', auth: oauth2 });
  
  // Create folder structure: Payment Proof Seminar > [Paket Folder]
  const paymentProofFolder = await ensureFolder(drive, 'Payment Proof Seminar', rootId);
  
  // Map paket pendaftaran to folder name
  let paketFolderName;
  if (paketPendaftaran === 'Individu') {
    paketFolderName = 'Individu';
  } else if (paketPendaftaran === '2 orang') {
    paketFolderName = '2 Orang';
  } else if (paketPendaftaran === '3 orang') {
    paketFolderName = '3 Orang';
  } else {
    paketFolderName = 'Lainnya';
  }
  
  const paketFolder = await ensureFolder(drive, paketFolderName, paymentProofFolder.id);
  return { drive, paketFolder };
}

async function uploadBufferAsFile(fileObject, competition, teamName) {
  const { drive, teamFolder } = await ensureNestedFolders(competition, teamName);
  const media = {
    mimeType: fileObject.mimetype,
    body: Readable.from(fileObject.buffer),
  };
  const res = await drive.files.create({
    requestBody: { name: fileObject.originalname, parents: [teamFolder.id] },
    media,
    fields: 'id, name, webViewLink, webContentLink',
  });
  return { ...res.data, folderId: teamFolder.id };
}

async function uploadSeminarPaymentProof(fileObject, paketPendaftaran, participantName) {
  const { drive, paketFolder } = await ensureSeminarPaymentFolders(paketPendaftaran);
  const media = {
    mimeType: fileObject.mimetype,
    body: Readable.from(fileObject.buffer),
  };
  // Include participant name in filename for easier identification
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const fileName = `${participantName}_${timestamp}_${fileObject.originalname}`;
  const res = await drive.files.create({
    requestBody: { name: fileName, parents: [paketFolder.id] },
    media,
    fields: 'id, name, webViewLink, webContentLink',
  });
  return { ...res.data, folderId: paketFolder.id };
}

module.exports = { uploadBufferAsFile, uploadSeminarPaymentProof };


