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

module.exports = { uploadBufferAsFile };


