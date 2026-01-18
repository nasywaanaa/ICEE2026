# ICEE 2025 - ITB Civil Engineering Expo

Complete web application for ICEE 2025 with frontend and backend components.

## 📁 Project Structure

```
icee-2025/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/           # Express.js backend with Google Sheets/Drive integration
│   ├── src/
│   ├── package.json
│   └── ...
├── reference/         # Reference materials and assets
├── package.json       # Main project configuration
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Platform account (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd icee-2025
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy backend environment template
   cp backend/env.example backend/.env
   
   # Edit backend/.env with your Google API credentials
   ```

4. **Run both frontend and backend**
   ```bash
   npm run dev
   ```

## 🎯 Frontend (React + TypeScript)

The frontend is built with React, TypeScript, and Vite.

### Features
- Landing page with all ICEE sections
- Multi-step registration form
- Responsive design
- Modern UI/UX

### Running Frontend Only
```bash
npm run dev:frontend
# or
cd frontend && npm run dev
```

### Frontend URLs
- **Development**: http://localhost:5173
- **Production**: Build with `npm run build`

## 🔧 Backend (Express.js)

The backend handles registration data using Google Sheets and Google Drive.

### Features
- Registration data storage in Google Sheets
- Document upload to Google Drive
- Email notifications
- Public API endpoints (no authentication required)

### Running Backend Only
```bash
npm run dev:backend
# or
cd backend && npm run dev
```

### Backend URLs
- **API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📡 API Endpoints

### Competition Registration
- `POST /api/registrations` - Submit registration
- `GET /api/registrations` - Get all registrations
- `GET /api/registrations/:id` - Get specific registration
- `PUT /api/registrations/:id/status` - Update status
- `GET /api/registrations/stats` - Get statistics
- `GET /api/registrations/check-team-name` - Check team name
- `POST /api/registrations/upload` - Upload documents
- `POST /api/registrations/submit` - Submit registration with files (multipart)

### Seminar Registration
- `POST /api/seminar` - Submit seminar registration (JSON)
- `POST /api/seminar/submit` - Submit seminar registration with payment proof (multipart)
- `GET /api/seminar` - Get all seminar registrations

### System
- `GET /api/health` - Health check
- `GET /` - API information

## 🔐 Google API Setup

### Required APIs
1. Google Sheets API
2. Google Drive API

### Configuration
1. Create a Google Cloud Project
2. Enable the required APIs
3. Create OAuth 2.0 credentials
4. Set up Google Sheet with proper headers
5. Create Google Drive folder for documents
6. Update `backend/.env` with your credentials

## 📧 Email Configuration

Configure Gmail for sending confirmation emails:
1. Enable 2-factor authentication
2. Generate an App Password
3. Add to `backend/.env`

## 🛠️ Development

### Available Scripts

```bash
# Run both frontend and backend
npm run dev

# Run only frontend
npm run dev:frontend

# Run only backend
npm run dev:backend

# Build frontend for production
npm run build

# Start backend in production
npm start

# Install all dependencies
npm run install:all

# Clean all node_modules
npm run clean
```

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Google API Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Google Sheets Configuration (Competition)
GOOGLE_SHEETS_ID=your-google-sheets-id
GOOGLE_SHEETS_RANGE=Registrations!A:Z

# Google Sheets Configuration (Seminar)
SEMINAR_SPREADSHEET_ID=your-seminar-sheets-id
SEMINAR_SHEETS_RANGE=Seminar!A:Z

# Google Drive Configuration
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id

# Google Service Account (for Sheets/Drive API)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## 🚀 Deployment

### Frontend
- Build with `npm run build`
- Deploy the `frontend/dist` folder to your hosting service

### Backend
- Deploy to your server or cloud platform
- Set up environment variables
- Configure Google API credentials

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, please contact the ICEE 2025 development team.
