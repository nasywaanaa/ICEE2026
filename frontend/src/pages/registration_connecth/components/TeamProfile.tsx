import React, { useState } from 'react'
import './TeamProfile.css'

interface TeamMember {
  name: string
  email: string
  phone: string
  institution: string
  role: string
}

interface TeamProfileData {
  teamName: string
  university: string
  members: TeamMember[]
}

interface TeamProfileProps {
  data: TeamProfileData
  onChange: (data: TeamProfileData) => void
  onValidation?: (isValid: boolean) => void
}

interface ValidationErrors {
  teamName?: string
  members?: {
    [key: number]: {
      name?: string
      email?: string
      phone?: string
      institution?: string
    }
  }
}

const TeamProfile: React.FC<TeamProfileProps> = ({ data, onChange, onValidation }) => {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [showErrors, setShowErrors] = useState(false)

  const updateTeamInfo = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value
    })
    
    // Clear error when user starts typing
    if (field === 'teamName' && errors.teamName) {
      setErrors(prev => ({
        ...prev,
        teamName: undefined
      }))
    }
  }

  const updateMember = (index: number, field: string, value: string) => {
    const updatedMembers = [...data.members]
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    }
    onChange({
      ...data,
      members: updatedMembers
    })

    // Clear error when user starts typing (immediate feedback)
    if (errors.members?.[index] && field in (errors.members[index] || {})) {
      setErrors(prev => ({
        ...prev,
        members: {
          ...prev.members,
          [index]: {
            ...prev.members?.[index],
            [field as keyof TeamMember]: undefined
          }
        }
      }))
    }
  }

  const validateEmail = React.useCallback((email: string): string | undefined => {
    if (!email?.trim()) {
      return '*This field is required'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return '*Please enter a valid email address (e.g., name@gmail.com, name@itb.ac.id)'
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
    const newErrors: ValidationErrors = {
      members: {}
    }
    let hasErrors = false

    // Validate team name (only check if it's filled, no duplicate checking)
    if (!data.teamName?.trim()) {
      newErrors.teamName = '*This field is required'
      hasErrors = true
    }

    // Validate all members
    data.members.forEach((member, index) => {
      newErrors.members![index] = {}
      
      // Validate name
      if (!member.name?.trim()) {
        newErrors.members![index].name = '*This field is required'
        hasErrors = true
      }
      
      // Validate email
      const emailError = validateEmail(member.email)
      if (emailError) {
        newErrors.members![index].email = emailError
        hasErrors = true
      }
      
      // Validate phone
      const phoneError = validatePhone(member.phone)
      if (phoneError) {
        newErrors.members![index].phone = phoneError
        hasErrors = true
      }
      
      // Validate institution
      if (!member.institution?.trim()) {
        newErrors.members![index].institution = '*This field is required'
        hasErrors = true
      }
    })

    setErrors(newErrors)
    setShowErrors(true)
    return !hasErrors
  }, [data, validateEmail, validatePhone])

  // Validate individual field on blur (when user leaves the field)
  const validateSingleField = (field: string, value: string, memberIndex?: number) => {
    const newErrors = { ...errors }
    
    if (field === 'teamName') {
      if (!value?.trim()) {
        newErrors.teamName = '*This field is required'
      } else {
        newErrors.teamName = undefined
      }
    } else if (memberIndex !== undefined) {
      if (!newErrors.members) newErrors.members = {}
      if (!newErrors.members[memberIndex]) newErrors.members[memberIndex] = {}
      
      if (field === 'name') {
        if (!value?.trim()) {
          newErrors.members[memberIndex].name = '*This field is required'
        } else {
          newErrors.members[memberIndex].name = undefined
        }
      } else if (field === 'email') {
        const emailError = validateEmail(value)
        newErrors.members[memberIndex].email = emailError
      } else if (field === 'phone') {
        const phoneError = validatePhone(value)
        newErrors.members[memberIndex].phone = phoneError
      } else if (field === 'institution') {
        if (!value?.trim()) {
          newErrors.members[memberIndex].institution = '*This field is required'
        } else {
          newErrors.members[memberIndex].institution = undefined
        }
      }
    }
    
    setErrors(newErrors)
    setShowErrors(true)
  }

  // Check form validity and notify parent (without showing errors)
  React.useEffect(() => {
    const isValid = Boolean(
      data.teamName?.trim() && 
      data.members.every(member => 
        member.name?.trim() && 
        member.institution?.trim() &&
        validateEmail(member.email) === undefined &&
        validatePhone(member.phone) === undefined
      )
    )
    
    onValidation?.(isValid)
  }, [data, onValidation, validateEmail, validatePhone])

  // Expose validation function to parent
  React.useEffect(() => {
    (window as any).validateTeamProfile = () => {
      const isValid = validateForm()
      return isValid
    }
  }, [validateForm])

  return (
    <div className="team-profile-content">
      <h2 className="team-profile-title">Info Team</h2>
      
      {/* Team Name Section */}
      <div className="team-name-section">
        <label className="field-label">Team Name</label>
        <div className="input-with-icon">
          <img src="/assets/registration/info-team/team.svg" alt="Team" className="input-icon" />
          <input
            type="text"
            value={data.teamName}
            onChange={(e) => updateTeamInfo('teamName', e.target.value)}
            onBlur={(e) => validateSingleField('teamName', e.target.value)}
            placeholder="Your Team Name"
            className={`team-input ${showErrors && errors.teamName ? 'error' : ''}`}
          />
        </div>
        {showErrors && errors.teamName && (
          <span className="error-message">{errors.teamName}</span>
        )}
      </div>

      {/* Team Leader Section */}
      <div className="member-section">
        <h3 className="member-title">Personal Information - Team Leader</h3>
        <div className="member-form-grid">
          <div className="form-field">
            <label className="field-label">Name</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/name.svg" alt="Name" className="input-icon" />
              <input
                type="text"
                value={data.members[0]?.name || ''}
                onChange={(e) => updateMember(0, 'name', e.target.value)}
                onBlur={(e) => validateSingleField('name', e.target.value, 0)}
                placeholder="Name of Team Leader"
                className={`member-input ${showErrors && errors.members?.[0]?.name ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.members?.[0]?.name && (
              <span className="error-message">{errors.members[0]?.name}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Phone Number</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/phone.svg" alt="Phone" className="input-icon" />
              <input
                type="tel"
                value={data.members[0]?.phone || ''}
                onChange={(e) => updateMember(0, 'phone', e.target.value)}
                onBlur={(e) => validateSingleField('phone', e.target.value, 0)}
                placeholder="Phone Number of Team Leader"
                className={`member-input ${showErrors && errors.members?.[0]?.phone ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.members?.[0]?.phone && (
              <span className="error-message">{errors.members[0]?.phone}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Email</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/email.svg" alt="Email" className="input-icon" />
              <input
                type="email"
                value={data.members[0]?.email || ''}
                onChange={(e) => updateMember(0, 'email', e.target.value)}
                onBlur={(e) => validateSingleField('email', e.target.value, 0)}
                placeholder="Email of Team Leader"
                className={`member-input ${showErrors && errors.members?.[0]?.email ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.members?.[0]?.email && (
              <span className="error-message">{errors.members[0]?.email}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Institution</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/institution.svg" alt="Institution" className="input-icon" />
              <input
                type="text"
                value={data.members[0]?.institution || ''}
                onChange={(e) => updateMember(0, 'institution', e.target.value)}
                onBlur={(e) => validateSingleField('institution', e.target.value, 0)}
                placeholder="Institution of Team Leader"
                className={`member-input ${showErrors && errors.members?.[0]?.institution ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.members?.[0]?.institution && (
              <span className="error-message">{errors.members[0]?.institution}</span>
            )}
          </div>
        </div>
      </div>

      {/* Team Member 1 */}
      <div className="member-section">
        <h3 className="member-title">Personal Information - Team Member 1</h3>
        <div className="member-form-grid">
          <div className="form-field">
            <label className="field-label">Name</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/name.svg" alt="Name" className="input-icon" />
              <input
                type="text"
                value={data.members[1]?.name || ''}
                onChange={(e) => updateMember(1, 'name', e.target.value)}
                onBlur={(e) => validateSingleField('name', e.target.value, 1)}
                placeholder="Name of Team Member 1"
                className={`member-input ${showErrors && errors.members?.[1]?.name ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.members?.[1]?.name && (
              <span className="error-message">{errors.members[1]?.name}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Phone Number</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/phone.svg" alt="Phone" className="input-icon" />
              <input
                type="tel"
                value={data.members[1]?.phone || ''}
                onChange={(e) => updateMember(1, 'phone', e.target.value)}
                onBlur={(e) => validateSingleField('phone', e.target.value, 1)}
                placeholder="Phone Number of Team Member 1"
                className={`member-input ${showErrors && errors.members?.[1]?.phone ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.members?.[1]?.phone && (
              <span className="error-message">{errors.members[1]?.phone}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Email</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/email.svg" alt="Email" className="input-icon" />
              <input
                type="email"
                value={data.members[1]?.email || ''}
                onChange={(e) => updateMember(1, 'email', e.target.value)}
                onBlur={(e) => validateSingleField('email', e.target.value, 1)}
                placeholder="Email of Team Member 1"
                className={`member-input ${showErrors && errors.members?.[1]?.email ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.members?.[1]?.email && (
              <span className="error-message">{errors.members[1]?.email}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Institution</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/institution.svg" alt="Institution" className="input-icon" />
              <input
                type="text"
                value={data.members[1]?.institution || ''}
                onChange={(e) => updateMember(1, 'institution', e.target.value)}
                onBlur={(e) => validateSingleField('institution', e.target.value, 1)}
                placeholder="Institution of Team Member 1"
                className={`member-input ${showErrors && errors.members?.[1]?.institution ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.members?.[1]?.institution && (
              <span className="error-message">{errors.members[1]?.institution}</span>
            )}
          </div>
        </div>
      </div>

      {/* Team Member 2 */}
      <div className="member-section">
        <h3 className="member-title">Personal Information - Team Member 2</h3>
        <div className="member-form-grid">
          <div className="form-field">
            <label className="field-label">Name</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/name.svg" alt="Name" className="input-icon" />
              <input
                type="text"
                value={data.members[2]?.name || ''}
                onChange={(e) => updateMember(2, 'name', e.target.value)}
                onBlur={(e) => validateSingleField('name', e.target.value, 2)}
                placeholder="Name of Team Member 2"
                className={`member-input ${showErrors && errors.members?.[2]?.name ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.members?.[2]?.name && (
              <span className="error-message">{errors.members[2]?.name}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Phone Number</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/phone.svg" alt="Phone" className="input-icon" />
              <input
                type="tel"
                value={data.members[2]?.phone || ''}
                onChange={(e) => updateMember(2, 'phone', e.target.value)}
                onBlur={(e) => validateSingleField('phone', e.target.value, 2)}
                placeholder="Phone Number of Team Member 2"
                className={`member-input ${showErrors && errors.members?.[2]?.phone ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.members?.[2]?.phone && (
              <span className="error-message">{errors.members[2]?.phone}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Email</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/email.svg" alt="Email" className="input-icon" />
              <input
                type="email"
                value={data.members[2]?.email || ''}
                onChange={(e) => updateMember(2, 'email', e.target.value)}
                onBlur={(e) => validateSingleField('email', e.target.value, 2)}
                placeholder="Email of Team Member 2"
                className={`member-input ${showErrors && errors.members?.[2]?.email ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.members?.[2]?.email && (
              <span className="error-message">{errors.members[2]?.email}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Institution</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/institution.svg" alt="Institution" className="input-icon" />
              <input
                type="text"
                value={data.members[2]?.institution || ''}
                onChange={(e) => updateMember(2, 'institution', e.target.value)}
                onBlur={(e) => validateSingleField('institution', e.target.value, 2)}
                placeholder="Institution of Team Member 2"
                className={`member-input ${showErrors && errors.members?.[2]?.institution ? 'error' : ''}`}
              />
            </div>
            {showErrors && errors.members?.[2]?.institution && (
              <span className="error-message">{errors.members[2]?.institution}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamProfile
