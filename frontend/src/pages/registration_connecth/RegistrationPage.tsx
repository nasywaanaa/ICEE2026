import React, { useState } from 'react'
import RegistrationHeader from './components/RegistrationHeader'
import PersonalInfo from './components/PersonalInfo'
import RegistrationSuccess from './components/RegistrationSuccess'
import './RegistrationPage.css'

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    selectedCompetition: 'Connect-H',
    termsAccepted: true,
    personalInfo: {
      name: '',
      email: '',
      institution: '',
      major: '',
      idLine: '',
      phone: '',
      commitmentAccepted: false
    }
  })

  const [isPersonalInfoValid, setIsPersonalInfoValid] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitForm = () => {
    // Validate personal info form
    if ((window as any).validatePersonalInfo) {
      const isValid = (window as any).validatePersonalInfo()
      if (!isValid) {
        return
      }
    }
    // Show confirmation modal before submitting
    setShowSubmitModal(true)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const fd = new FormData()
      fd.append('selectedCompetition', formData.selectedCompetition)
      fd.append('termsAccepted', String(formData.termsAccepted))
      fd.append('personalInfo', JSON.stringify(formData.personalInfo))

      const RAW_BASE = (import.meta as any).env?.VITE_API_BASE_URL || ''
      const API_BASE = RAW_BASE && !/^https?:\/\//i.test(RAW_BASE) ? `https://${RAW_BASE}` : RAW_BASE
      const endpoint = `${API_BASE.replace(/\/$/, '')}/api/connecth/submit`
      const res = await fetch(endpoint, {
        method: 'POST',
        body: fd
      })
      const json = await res.json().catch(() => ({} as any))
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Submission failed')
      }

      setShowSubmitModal(false)
      setIsSubmitted(true)
    } catch (err) {
      console.error('Submit error:', err)
      alert('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelSubmit = () => {
    setShowSubmitModal(false)
  }

  const updatePersonalInfo = (data: any) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: data
    }))
  }

  // Show success page after submission
  if (isSubmitted) {
    return <RegistrationSuccess />
  }

  return (
    <div className="registration-page">
      <RegistrationHeader />
      
      <div className="registration-container">
        <div className="registration-form-container">
          <div className="registration-form">
            <PersonalInfo 
              data={formData.personalInfo}
              onChange={updatePersonalInfo}
              onValidation={setIsPersonalInfoValid}
              hideMajor={false}
            />
            
            <div className="form-navigation">
              <button 
                className="nav-button next-button" 
                onClick={handleSubmitForm}
                disabled={!isPersonalInfoValid}
              >
                Submit Registration
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="m9 15 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="modal-title">Submit Registration</h3>
            <div className="modal-message">
              <p>Are you sure you want to submit this form?</p>
              <p>Please confirm all details are accurate.</p>
            </div>
            <div className="modal-buttons">
              <button 
                className="modal-button cancel-button"
                onClick={handleCancelSubmit}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="modal-button submit-button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegistrationPage
