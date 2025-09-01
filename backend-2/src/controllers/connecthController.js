const connecthSheetsService = require('../services/connecthSheetsService');

exports.createConnectHRegistration = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));
    
    let registrationData;
    
    // Handle both JSON and FormData
    if (req.body && typeof req.body === 'object' && req.body.personalInfo) {
      // Handle FormData where personalInfo is a JSON string
      const personalInfoStr = req.body.personalInfo;
      let personalInfo;
      try {
        personalInfo = typeof personalInfoStr === 'string' ? JSON.parse(personalInfoStr) : personalInfoStr;
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid personalInfo format' });
      }
      
      registrationData = {
        selectedCompetition: req.body.selectedCompetition,
        termsAccepted: String(req.body.termsAccepted).toLowerCase() === 'true',
        personalInfo: personalInfo
      };
    } else {
      // Handle direct JSON
      registrationData = req.body;
    }
    
    // Validate required fields
    if (!registrationData?.selectedCompetition || !registrationData?.personalInfo?.name) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Validate personal info fields
    const { personalInfo } = registrationData;
    if (!personalInfo.email || !personalInfo.institution || !personalInfo.idLine || !personalInfo.phone) {
      return res.status(400).json({ success: false, error: 'Missing required personal information fields' });
    }

    // For HMS registrations, major is optional, for Non-HMS it's required
    const isHMS = registrationData.selectedCompetition.includes('HMS');
    if (!isHMS && !personalInfo.major) {
      return res.status(400).json({ success: false, error: 'Major field is required for Non-HMS registrations' });
    }

    await connecthSheetsService.addConnectHRegistration(registrationData);
    return res.status(201).json({ success: true, message: 'Connect-H registration submitted successfully' });
  } catch (error) {
    console.error('[createConnectHRegistration]', error);
    return res.status(error.status || 400).json({ success: false, error: error.message || 'Failed to submit registration' });
  }
};

exports.getAllConnectHRegistrations = async (req, res) => {
  try {
    const registrations = await connecthSheetsService.getAllConnectHRegistrations();
    return res.json({ success: true, data: registrations });
  } catch (error) {
    console.error('[getAllConnectHRegistrations]', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch registrations' });
  }
};
