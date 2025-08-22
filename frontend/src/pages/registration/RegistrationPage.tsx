import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import RegistrationHeader from './components/RegistrationHeader'
import StepIndicator from './components/StepIndicator'
import TermsOfReference from './components/TermsOfReference'
import TeamProfile from './components/TeamProfile'
import RequiredDocuments from './components/RequiredDocuments'
import RegistrationSuccess from './components/RegistrationSuccess'
import './RegistrationPage.css'

const RegistrationPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    selectedCompetition: '',
    termsAccepted: false,
    teamProfile: {
      teamName: '',
      university: '',
      members: [
        { name: '', email: '', phone: '', institution: '', role: 'Leader' },
        { name: '', email: '', phone: '', institution: '', role: 'Member' },
        { name: '', email: '', phone: '', institution: '', role: 'Member' }
      ]
    },
    documents: {
      studentCard: null,
      enrollmentProof: null,
      postProof: null,
      storyProof: null,
      paymentProof: null
    }
  })

  const [isTeamProfileValid, setIsTeamProfileValid] = useState(false)
  const [areDocumentsValid, setAreDocumentsValid] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle URL parameters for competition selection
  useEffect(() => {
    const competitionFromUrl = searchParams.get('competition')
    if (competitionFromUrl && !formData.selectedCompetition) {
      setFormData(prev => ({
        ...prev,
        selectedCompetition: competitionFromUrl
      }))
    }
  }, [searchParams, formData.selectedCompetition])

  // Validate documents when they change
  React.useEffect(() => {
    const { studentCard, enrollmentProof, postProof, storyProof, paymentProof } = formData.documents
    const allDocumentsUploaded = studentCard && enrollmentProof && postProof && storyProof && paymentProof
    setAreDocumentsValid(!!allDocumentsUploaded)
  }, [formData.documents])

  const steps = [
    { id: 1, title: 'Terms of Reference', subtitle: 'Please read ToR before continue registration' },
    { id: 2, title: 'Team Profile', subtitle: 'Please complete your team profile' },
    { id: 3, title: 'Required Document', subtitle: 'Please complete all required document' }
  ]

  const handleNext = async () => {
    if (currentStep === 2) {
      // Always trigger validation for team profile form
      if ((window as any).validateTeamProfile) {
        try {
          const isValid = await (window as any).validateTeamProfile()
          if (!isValid) {
            return
          }
        } catch (error) {
          console.error('Validation error:', error)
          return
        }
      }
    }
    
    if (currentStep === 3) {
      // Show confirmation modal before submitting
      setShowSubmitModal(true)
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const fd = new FormData()
      fd.append('selectedCompetition', formData.selectedCompetition)
      fd.append('termsAccepted', String(formData.termsAccepted))
      fd.append('teamProfile', JSON.stringify(formData.teamProfile))

      const { studentCard, enrollmentProof, postProof, storyProof, paymentProof } = formData.documents
      if (studentCard) fd.append('studentCard', studentCard)
      if (enrollmentProof) fd.append('enrollmentProof', enrollmentProof)
      if (postProof) fd.append('postProof', postProof)
      if (storyProof) fd.append('storyProof', storyProof)
      if (paymentProof) fd.append('paymentProof', paymentProof)

      const RAW_BASE = (import.meta as any).env?.VITE_API_BASE_URL || ''
      const API_BASE = RAW_BASE && !/^https?:\/\//i.test(RAW_BASE) ? `https://${RAW_BASE}` : RAW_BASE
      const endpoint = `${API_BASE.replace(/\/$/, '')}/api/registrations/submit`
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

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TermsOfReference 
            isAccepted={formData.termsAccepted}
            onAccept={(accepted) => updateFormData('termsAccepted', accepted)}
            selectedCompetition={formData.selectedCompetition}
            onCompetitionChange={(competition) => updateFormData('selectedCompetition', competition)}
          />
        )
      case 2:
        return (
          <TeamProfile 
            data={formData.teamProfile}
            onChange={(data) => updateFormData('teamProfile', data)}
            onValidation={setIsTeamProfileValid}
          />
        )
      case 3:
        return (
          <RequiredDocuments 
            data={formData.documents}
            onChange={(data) => updateFormData('documents', data)}
          />
        )
      default:
        return null
    }
  }

  // Show success page after submission
  if (isSubmitted) {
    return <RegistrationSuccess />
  }

  return (
    <div className="registration-page">
      <RegistrationHeader />
      
      <div className="registration-container">
        <StepIndicator 
          steps={steps} 
          currentStep={currentStep} 
        />
        
        <div className="registration-form-container">
          <div className="registration-form">
            {renderStepContent()}
            
            <div className="form-navigation">
              <button 
                className="nav-button prev-button" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                ← Previous
              </button>
              
              <button 
                className="nav-button next-button" 
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (!formData.termsAccepted || !formData.selectedCompetition)) ||
                  (currentStep === 2 && !isTeamProfileValid) ||
                  (currentStep === 3 && !areDocumentsValid)
                }
              >
                {currentStep === 3 ? 'Submit' : 'Next →'}
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
