import React, { useState } from 'react'
import './PersonalInfo.css'

interface PersonalInfoData {
  name: string
  email: string
  institution: string
  major: string
  idLine: string
  phone: string
  commitmentAccepted: boolean
}

interface PersonalInfoProps {
  data: PersonalInfoData
  onChange: (data: PersonalInfoData) => void
  onValidation?: (isValid: boolean) => void
  hideMajor?: boolean
}

interface ValidationErrors {
  name?: string
  email?: string
  institution?: string
  major?: string
  idLine?: string
  phone?: string
  commitmentAccepted?: string
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, onChange, onValidation, hideMajor }) => {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [showErrors, setShowErrors] = useState(false)

  const updateField = (field: keyof PersonalInfoData, value: string | boolean) => {
    onChange({
      ...data,
      [field]: value
    })
    
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateEmail = React.useCallback((email: string): string | undefined => {
    if (!email?.trim()) {
      return '*This field is required'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return '*Please enter a valid email address'
    }
    
    return undefined
  }, [])

  const validatePhone = React.useCallback((phone: string): string | undefined => {
    if (!phone?.trim()) {
      return '*This field is required'
    }
    
    const phoneRegex = /^08\d{8,13}$/
    if (!phoneRegex.test(phone)) {
      return '*Phone number must start with 08 and contain only numbers (8-15 digits total)'
    }
    
    return undefined
  }, [])

  const validateForm = React.useCallback(() => {
    const newErrors: ValidationErrors = {}
    let hasErrors = false

    // Validate name
    if (!data.name?.trim()) {
      newErrors.name = '*This field is required'
      hasErrors = true
    }

    // Validate email
    const emailError = validateEmail(data.email)
    if (emailError) {
      newErrors.email = emailError
      hasErrors = true
    }

    // Validate institution
    if (!data.institution?.trim()) {
      newErrors.institution = '*This field is required'
      hasErrors = true
    }

    // Validate major (skip when hidden)
    if (!hideMajor) {
      if (!data.major?.trim()) {
        newErrors.major = '*This field is required'
        hasErrors = true
      }
    }

    // Validate ID Line
    if (!data.idLine?.trim()) {
      newErrors.idLine = '*This field is required'
      hasErrors = true
    }

    // Validate phone
    const phoneError = validatePhone(data.phone)
    if (phoneError) {
      newErrors.phone = phoneError
      hasErrors = true
    }

    // Validate commitment
    if (!data.commitmentAccepted) {
      newErrors.commitmentAccepted = '*You must accept the commitment declaration'
      hasErrors = true
    }

    setErrors(newErrors)
    setShowErrors(true)
    return !hasErrors
  }, [data, validateEmail, validatePhone])

  // Validate individual field on blur
  const validateSingleField = (field: keyof PersonalInfoData, value: string | boolean) => {
    const newErrors = { ...errors }
    
    if (field === 'name') {
      if (!String(value)?.trim()) {
        newErrors.name = '*This field is required'
      } else {
        newErrors.name = undefined
      }
    } else if (field === 'email') {
      const emailError = validateEmail(String(value))
      newErrors.email = emailError
    } else if (field === 'institution') {
      if (!String(value)?.trim()) {
        newErrors.institution = '*This field is required'
      } else {
        newErrors.institution = undefined
      }
    } else if (field === 'major') {
      if (!hideMajor) {
        if (!String(value)?.trim()) {
          newErrors.major = '*This field is required'
        } else {
          newErrors.major = undefined
        }
      }
    } else if (field === 'idLine') {
      if (!String(value)?.trim()) {
        newErrors.idLine = '*This field is required'
      } else {
        newErrors.idLine = undefined
      }
    } else if (field === 'phone') {
      const phoneError = validatePhone(String(value))
      newErrors.phone = phoneError
    } else if (field === 'commitmentAccepted') {
      if (!value) {
        newErrors.commitmentAccepted = '*You must accept the commitment declaration'
      } else {
        newErrors.commitmentAccepted = undefined
      }
    }
    
    setErrors(newErrors)
    setShowErrors(true)
  }

  // Check form validity and notify parent
  React.useEffect(() => {
    const isValid = Boolean(
      data.name?.trim() && 
      data.institution?.trim() &&
      (hideMajor ? true : Boolean(data.major?.trim())) &&
      data.idLine?.trim() &&
      data.commitmentAccepted &&
      validateEmail(data.email) === undefined &&
      validatePhone(data.phone) === undefined
    )
    
    onValidation?.(isValid)
  }, [data, onValidation, validateEmail, validatePhone])

  // Expose validation function to parent
  React.useEffect(() => {
    (window as any).validatePersonalInfo = () => {
      const isValid = validateForm()
      return isValid
    }
  }, [validateForm])

  return (
    <div className="personal-info-content">
      <h2 className="personal-info-title">Personal Information</h2>
      
      <div className="personal-info-form-grid">
        {/* Name */}
        <div className="form-field">
          <label className="field-label">Name</label>
          <div className="input-with-icon">
            <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateField('name', e.target.value)}
              onBlur={(e) => validateSingleField('name', e.target.value)}
              placeholder="Zara Reynolds"
              className={`personal-input ${showErrors && errors.name ? 'error' : ''}`}
            />
          </div>
          {showErrors && errors.name && (
            <span className="error-message">{errors.name}</span>
          )}
        </div>

        {/* Email */}
        <div className="form-field">
          <label className="field-label">Email</label>
          <div className="input-with-icon">
            <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="m4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="email"
              value={data.email}
              onChange={(e) => updateField('email', e.target.value)}
              onBlur={(e) => validateSingleField('email', e.target.value)}
              placeholder="zara@gmail.com"
              className={`personal-input ${showErrors && errors.email ? 'error' : ''}`}
            />
          </div>
          {showErrors && errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* Institution */}
        <div className="form-field">
          <label className="field-label">Institution</label>
          <div className="input-with-icon">
            <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 21V7l8-4v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 21V11l-6-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 15v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              value={data.institution}
              onChange={(e) => updateField('institution', e.target.value)}
              onBlur={(e) => validateSingleField('institution', e.target.value)}
              placeholder="Institut Teknologi Bandung"
              className={`personal-input ${showErrors && errors.institution ? 'error' : ''}`}
            />
          </div>
          {showErrors && errors.institution && (
            <span className="error-message">{errors.institution}</span>
          )}
        </div>

        {/* Major (optional hidden) */}
        {!hideMajor && (
          <div className="form-field">
            <label className="field-label">Major</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                value={data.major}
                onChange={(e) => updateField('major', e.target.value)}
                onBlur={(e) => validateSingleField('major', e.target.value)}
                placeholder="Civil Engineering"
                className={`personal-input ${showErrors && errors.major ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.major && (
              <span className="error-message">{errors.major}</span>
            )}
          </div>
        )}

        {/* Id Line */}
        <div className="form-field">
          <label className="field-label">Id Line</label>
          <div className="input-with-icon">
            <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              value={data.idLine}
              onChange={(e) => updateField('idLine', e.target.value)}
              onBlur={(e) => validateSingleField('idLine', e.target.value)}
              placeholder="ZaraReynolds123"
              className={`personal-input ${showErrors && errors.idLine ? 'error' : ''}`}
            />
          </div>
          {showErrors && errors.idLine && (
            <span className="error-message">{errors.idLine}</span>
          )}
        </div>

        {/* Phone Number */}
        <div className="form-field">
          <label className="field-label">Phone Number (WhatsApp)</label>
          <div className="input-with-icon">
            <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              onBlur={(e) => validateSingleField('phone', e.target.value)}
              placeholder="08123456789"
              className={`personal-input ${showErrors && errors.phone ? 'error' : ''}`}
            />
          </div>
          {showErrors && errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>
      </div>

      {/* Commitment Declaration */}
      <div className="commitment-section">
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="commitment"
            checked={data.commitmentAccepted}
            onChange={(e) => updateField('commitmentAccepted', e.target.checked)}
            onBlur={(e) => validateSingleField('commitmentAccepted', e.target.checked)}
            className={`commitment-checkbox ${showErrors && errors.commitmentAccepted ? 'error' : ''}`}
          />
          <label htmlFor="commitment" className="commitment-label">
            I declare my full commitment to participate in all sessions of this workshop seriously and responsibly. 
            If unavoidable obstacles occur, I will guarantee the presence of a replacement that I have prepared to 
            represent me.
          </label>
        </div>
        {showErrors && errors.commitmentAccepted && (
          <span className="error-message">{errors.commitmentAccepted}</span>
        )}
      </div>
    </div>
  )
}

export default PersonalInfo
