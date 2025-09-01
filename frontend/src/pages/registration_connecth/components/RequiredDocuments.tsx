import React, { useState } from 'react'
import './RequiredDocuments.css'

interface DocumentsData {
  studentCard: File | null
  enrollmentProof: File | null
  postProof: File | null
  storyProof: File | null
  paymentProof: File | null
}

interface RequiredDocumentsProps {
  data: DocumentsData
  onChange: (data: DocumentsData) => void
}

const RequiredDocuments: React.FC<RequiredDocumentsProps> = ({ data, onChange }) => {
  const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB in bytes
  const [fileErrors, setFileErrors] = useState<Record<keyof DocumentsData, string>>({
    studentCard: '',
    enrollmentProof: '',
    postProof: '',
    storyProof: '',
    paymentProof: ''
  })

  const handleFileUpload = (field: keyof DocumentsData, file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE) {
      const errorMessage = `File size must be less than 1MB. Current file size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`
      setFileErrors(prev => ({
        ...prev,
        [field]: errorMessage
      }))
      return
    }
    
    // Clear error when valid file is uploaded
    setFileErrors(prev => ({
      ...prev,
      [field]: ''
    }))
    
    onChange({
      ...data,
      [field]: file
    })
  }

  const FileUploadCard: React.FC<{
    title: string
    field: keyof DocumentsData
    accept: string
    supportedFormats: string
  }> = ({ title, field, accept, supportedFormats }) => {
    const file = data[field]
    const error = fileErrors[field]
    
    return (
      <div className="file-upload-card">
        <h3 className="upload-title">{title}</h3>
        
        <div className="file-upload-area">
          <input
            type="file"
            id={field}
            accept={accept}
            onChange={(e) => handleFileUpload(field, e.target.files?.[0] || null)}
            className="file-input"
          />
          <label htmlFor={field} className="file-upload-label">
            {file ? (
              <div className="file-uploaded">
                <div className="upload-success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span className="upload-status">✓ File uploaded successfully</span>
                </div>
                <button 
                  type="button" 
                  className="change-file-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(field)?.click()
                  }}
                >
                  Change file
                </button>
              </div>
            ) : (
              <div className="file-placeholder">
                <div className="upload-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="upload-text">
                  <span className="upload-main">Drag your file to start uploading</span>
                  <span className="upload-divider">OR</span>
                  <button type="button" className="browse-btn">Browse files</button>
                </div>
              </div>
            )}
          </label>
        </div>
        
        <p className="file-format">{supportedFormats}</p>
        <p className="file-size-limit">Maximum file size: 1MB</p>
        
        {error && (
          <div className="file-error-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="required-documents-container">
      <h1 className="page-title">Required Document</h1>

      <div className="documents-grid">
        <FileUploadCard
          title="Student Card"
          field="studentCard"
          accept=".pdf"
          supportedFormats="Only support pdf files"
        />
        
        <FileUploadCard
          title="Proof of Enrollment"
          field="enrollmentProof"
          accept=".pdf"
          supportedFormats="Only support pdf files"
        />
        
        <FileUploadCard
          title="Proof of Instagram Post"
          field="postProof"
          accept=".pdf"
          supportedFormats="Only support pdf files"
        />
        
        <FileUploadCard
          title="Proof of Instagram Story"
          field="storyProof"
          accept=".pdf"
          supportedFormats="Only support pdf files"
        />
        
        <FileUploadCard
          title="Proof of Payment"
          field="paymentProof"
          accept=".pdf"
          supportedFormats="Only support pdf files"
        />
      </div>
    </div>
  )
}

export default RequiredDocuments
