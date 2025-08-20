const googleSheetsService = require('../services/googleSheetsService');
const { uploadBufferAsFile } = require('../services/googleDriveService');

exports.createRegistration = async (req, res) => {
  try {
    const registrationData = req.body;
    if (!registrationData?.selectedCompetition || !registrationData?.teamProfile?.teamName) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    await googleSheetsService.addRegistration(registrationData);
    return res.status(201).json({ success: true, message: 'Registration submitted successfully' });
  } catch (error) {
    console.error('[createRegistration]', error);
    return res.status(error.status || 400).json({ success: false, error: error.message || 'Failed to submit' });
  }
};

exports.createRegistrationWithFiles = async (req, res) => {
  try {
    let payload;
    if (req.body && typeof req.body === 'object' && (req.body.teamProfile || req.body.selectedCompetition)) {
      // Handle typical multipart where non-file fields are strings
      const maybeParsedTeamProfile = (() => {
        const v = req.body.teamProfile;
        if (typeof v === 'string') {
          try { return JSON.parse(v); } catch (_) { return {}; }
        }
        return v;
      })();
      payload = {
        selectedCompetition: req.body.selectedCompetition,
        termsAccepted: String(req.body.termsAccepted).toLowerCase() === 'true',
        teamProfile: maybeParsedTeamProfile,
      };
    } else if (req.body && req.body.payload) {
      payload = JSON.parse(req.body.payload);
    } else {
      payload = JSON.parse(req.body.data || '{}');
    }

    if (!payload?.selectedCompetition || !payload?.teamProfile?.teamName) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const docs = {};
    const fields = ['studentCard', 'enrollmentProof', 'postProof', 'storyProof', 'paymentProof'];
    for (const field of fields) {
      const fileList = req.files?.[field];
      if (fileList && fileList[0]) {
        const file = fileList[0];
        const uploaded = await uploadBufferAsFile(
          file,
          payload.selectedCompetition,
          payload.teamProfile.teamName
        );
        docs[field] = {
          driveLink: uploaded.webViewLink,
          fileId: uploaded.id,
        };
      }
    }

    const dataToStore = { ...payload, documents: docs };
    await googleSheetsService.addRegistration(dataToStore);
    return res.status(201).json({ success: true, message: 'Registration with files submitted successfully' });
  } catch (error) {
    console.error('[createRegistrationWithFiles]', error);
    const reason = (error && (error.reason || error.code || error.status)) || '';
    const apiReason = Array.isArray(error?.errors) && error.errors[0]?.reason;
    const needsOAuth = error?.status === 401 || /not connected/i.test(error?.message || '');
    const isQuota = reason === 403 || error?.status === 403 || apiReason === 'storageQuotaExceeded';
    const friendly = needsOAuth
      ? 'Google Drive not connected. Visit /api/google/auth to authorize your Google account, then retry.'
      : (error.message || 'Failed to submit');
    return res.status(error.status || 400).json({ success: false, error: friendly });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    const { competition, teamName } = req.body;
    if (!competition || !teamName) return res.status(400).json({ success: false, error: 'competition and teamName are required' });
    const uploaded = await uploadBufferAsFile(req.file, competition, teamName);
    return res.json({ success: true, data: { id: uploaded.id, link: uploaded.webViewLink } });
  } catch (error) {
    console.error('[uploadDocument]', error);
    const needsOAuth = error?.status === 401 || /not connected/i.test(error?.message || '');
    const friendly = needsOAuth
      ? 'Google Drive not connected. Visit /api/google/auth to authorize your Google account, then retry.'
      : (error.message || 'Upload failed');
    return res.status(error.status || 500).json({ success: false, error: friendly });
  }
};

exports.checkTeamNameAvailability = async (req, res) => {
  try {
    const { teamName } = req.query;
    if (!teamName) return res.status(400).json({ success: false, error: 'teamName is required' });
    const ok = await googleSheetsService.checkTeamNameAvailability(teamName);
    return res.json({ success: true, available: ok });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Failed to check' });
  }
};


