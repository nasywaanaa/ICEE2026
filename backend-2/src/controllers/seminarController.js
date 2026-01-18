const seminarSheetsService = require('../services/seminarSheetsService');
const { uploadSeminarPaymentProof } = require('../services/googleDriveService');
const { sendSeminarRegistrationEmail, sendPaymentConfirmationEmail } = require('../services/brevoEmailService');

exports.createSeminarRegistration = async (req, res) => {
  try {
    const registrationData = req.body;
    if (!registrationData?.paketPendaftaran || !registrationData?.pengisiForm?.namaLengkap) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Generate unique ID based on jenisPeserta
    const jenisPeserta = registrationData.pengisiForm.jenisPeserta || '';
    const uniqueId = await seminarSheetsService.generateUniqueId(jenisPeserta);
    
    const dataToStore = {
      ...registrationData,
      uniqueId,
    };
    
    await seminarSheetsService.addSeminarRegistration(dataToStore);
    
    // Send confirmation email via Brevo
    try {
      const emailResult = await sendSeminarRegistrationEmail(
        registrationData.pengisiForm.email,
        registrationData.pengisiForm.namaLengkap,
        uniqueId,
        jenisPeserta
      );
      console.log('[Email Sent]', emailResult);
    } catch (emailError) {
      console.error('[Email Error] Failed to send email:', emailError);
    }
    
    return res.status(201).json({ 
      success: true, 
      message: 'Seminar registration submitted successfully',
      uniqueId: uniqueId
    });
  } catch (error) {
    console.error('[createSeminarRegistration]', error);
    return res.status(error.status || 400).json({ success: false, error: error.message || 'Failed to submit' });
  }
};

exports.createSeminarRegistrationWithFiles = async (req, res) => {
  try {
    let payload;
    if (req.body && typeof req.body === 'object' && (req.body.pengisiForm || req.body.paketPendaftaran)) {
      // Handle typical multipart where non-file fields are strings
      const maybeParsedPengisiForm = (() => {
        const v = req.body.pengisiForm;
        if (typeof v === 'string') {
          try { return JSON.parse(v); } catch (_) { return {}; }
        }
        return v;
      })();
      const maybeParsedPeserta2 = (() => {
        const v = req.body.peserta2;
        if (typeof v === 'string') {
          try { return JSON.parse(v); } catch (_) { return null; }
        }
        return v || null;
      })();
      const maybeParsedPeserta3 = (() => {
        const v = req.body.peserta3;
        if (typeof v === 'string') {
          try { return JSON.parse(v); } catch (_) { return null; }
        }
        return v || null;
      })();
      
      payload = {
        paketPendaftaran: req.body.paketPendaftaran,
        pengisiForm: maybeParsedPengisiForm,
        peserta2: maybeParsedPeserta2,
        peserta3: maybeParsedPeserta3,
        totalHarga: req.body.totalHarga || '',
        potongan: req.body.potongan || '',
        status: req.body.status || '',
      };
    } else if (req.body && req.body.payload) {
      payload = JSON.parse(req.body.payload);
    } else {
      payload = JSON.parse(req.body.data || '{}');
    }

    if (!payload?.paketPendaftaran || !payload?.pengisiForm?.namaLengkap) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Upload payment proof file to Google Drive
    let paymentProofLink = '';
    if (req.files?.paymentProof && req.files.paymentProof[0]) {
      const file = req.files.paymentProof[0];
      const mainParticipantName = payload.pengisiForm.namaLengkap || 'Seminar';
      const paketPendaftaran = payload.paketPendaftaran || 'Individu';
      const uploaded = await uploadSeminarPaymentProof(
        file,
        paketPendaftaran,
        mainParticipantName
      );
      paymentProofLink = uploaded.webViewLink;
    }

    // Generate unique ID based on jenisPeserta
    const jenisPeserta = payload.pengisiForm.jenisPeserta || '';
    const uniqueId = await seminarSheetsService.generateUniqueId(jenisPeserta);
    
    const dataToStore = {
      ...payload,
      paymentProofLink,
      uniqueId,
    };
    
    // Save to Google Sheets
    await seminarSheetsService.addSeminarRegistration(dataToStore);
    
    // Send confirmation email via Brevo
    try {
      const emailResult = await sendSeminarRegistrationEmail(
        payload.pengisiForm.email,
        payload.pengisiForm.namaLengkap,
        uniqueId,
        jenisPeserta
      );
      console.log('[Email Sent]', emailResult);
    } catch (emailError) {
      // Log email error but don't fail the registration
      console.error('[Email Error] Failed to send email:', emailError);
      // Continue with success response even if email fails
    }
    
    return res.status(201).json({ 
      success: true, 
      message: 'Seminar registration with files submitted successfully',
      uniqueId: uniqueId
    });
  } catch (error) {
    console.error('[createSeminarRegistrationWithFiles]', error);
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

exports.getAllSeminarRegistrations = async (req, res) => {
  try {
    const registrations = await seminarSheetsService.getAllSeminarRegistrations();
    return res.json({ success: true, data: registrations });
  } catch (error) {
    console.error('[getAllSeminarRegistrations]', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch registrations' });
  }
};

/**
 * Send payment confirmation email after payment verification by ICEE staff
 * POST /api/seminar/send-payment-confirmation
 * Body: { email, name, uniqueId, qrCodeLink }
 */
exports.sendPaymentConfirmation = async (req, res) => {
  try {
    const { email, name, uniqueId, qrCodeLink } = req.body;

    // Validate required fields
    if (!email || !name || !uniqueId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: email, name, and uniqueId are required' 
      });
    }

    // Generate QR code link if not provided (you can customize this)
    const finalQrCodeLink = qrCodeLink || `https://icee2026.com/qr/${uniqueId}`;

    // Send payment confirmation email
    const emailResult = await sendPaymentConfirmationEmail(
      email,
      name,
      uniqueId,
      finalQrCodeLink
    );

    return res.status(200).json({
      success: true,
      message: 'Payment confirmation email sent successfully',
      data: {
        email,
        uniqueId,
        messageId: emailResult.messageId
      }
    });
  } catch (error) {
    console.error('[sendPaymentConfirmation]', error);
    return res.status(error.status || 500).json({ 
      success: false, 
      error: error.message || 'Failed to send payment confirmation email' 
    });
  }
};
