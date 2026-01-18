import React, { useState } from 'react'
import './GroupParticipants.css'

interface ParticipantData {
  namaLengkap: string
  email: string
  nomorWhatsApp: string
  jenisPeserta: string
  pekerjaan: string
  institusi: string
  nomorIndukMahasiswa: string
  alamat: string
}

interface GroupParticipantsProps {
  peserta2: ParticipantData | null
  peserta3: ParticipantData | null
  paketPendaftaran: string
  onChange: (peserta2: ParticipantData | null, peserta3: ParticipantData | null) => void
  onValidation?: (isValid: boolean) => void
}

interface ParticipantErrors {
  [key: string]: string | undefined
}

interface ValidationErrors {
  peserta2?: ParticipantErrors
  peserta3?: ParticipantErrors
}

const GroupParticipants: React.FC<GroupParticipantsProps> = ({ peserta2, peserta3, paketPendaftaran, onChange, onValidation }) => {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [showErrors, setShowErrors] = useState(false)

  const isGroup = paketPendaftaran === '2 orang' || paketPendaftaran === '3 orang'
  const needsPeserta2 = paketPendaftaran === '2 orang' || paketPendaftaran === '3 orang'
  const needsPeserta3 = paketPendaftaran === '3 orang'

  const validateEmail = (email: string): string | undefined => {
    if (!email?.trim()) {
      return '*Field ini wajib diisi'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return '*Masukkan alamat email yang valid'
    }
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    if (!phone?.trim()) {
      return '*Field ini wajib diisi'
    }
    const phoneRegex = /^08\d{8,13}$/
    if (!phoneRegex.test(phone)) {
      return '*Nomor WhatsApp harus dimulai dengan 08 dan berisi 8-15 digit angka'
    }
    return undefined
  }

  const updateParticipant = (participantNum: 2 | 3, field: keyof ParticipantData, value: string) => {
    const currentPeserta2 = peserta2 || {
      namaLengkap: '', email: '', nomorWhatsApp: '', jenisPeserta: '', pekerjaan: '', institusi: '', nomorIndukMahasiswa: '', alamat: ''
    }
    const currentPeserta3 = peserta3 || {
      namaLengkap: '', email: '', nomorWhatsApp: '', jenisPeserta: '', pekerjaan: '', institusi: '', nomorIndukMahasiswa: '', alamat: ''
    }

    if (participantNum === 2) {
      onChange({
        ...currentPeserta2,
        [field]: value
      }, currentPeserta3)
    } else {
      onChange(currentPeserta2, {
        ...currentPeserta3,
        [field]: value
      })
    }

    // Clear error when user starts typing
    const errorKey = participantNum === 2 ? 'peserta2' : 'peserta3'
    if (errors[errorKey]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: {
          ...prev[errorKey],
          [field]: undefined
        }
      }))
    }
  }

  const validateSingleField = (participantNum: 2 | 3, field: keyof ParticipantData, value: string) => {
    const newErrors = { ...errors }
    const errorKey = participantNum === 2 ? 'peserta2' : 'peserta3'
    if (!newErrors[errorKey]) {
      newErrors[errorKey] = {}
    }

    const participant = participantNum === 2 ? peserta2 : peserta3

    if (field === 'namaLengkap') {
      if (!value?.trim()) {
        newErrors[errorKey]![field] = '*Field ini wajib diisi'
      } else {
        newErrors[errorKey]![field] = undefined
      }
    } else if (field === 'email') {
      const emailError = validateEmail(value)
      newErrors[errorKey]![field] = emailError
    } else if (field === 'nomorWhatsApp') {
      const phoneError = validatePhone(value)
      newErrors[errorKey]![field] = phoneError
    } else if (field === 'jenisPeserta') {
      if (!value) {
        newErrors[errorKey]![field] = '*Field ini wajib diisi'
      } else {
        newErrors[errorKey]![field] = undefined
      }
    } else if (field === 'pekerjaan') {
      if (!value?.trim()) {
        newErrors[errorKey]![field] = '*Field ini wajib diisi'
      } else {
        newErrors[errorKey]![field] = undefined
      }
    } else if (field === 'institusi') {
      if (!value?.trim()) {
        newErrors[errorKey]![field] = '*Field ini wajib diisi'
      } else {
        newErrors[errorKey]![field] = undefined
      }
    } else if (field === 'nomorIndukMahasiswa') {
      if (participant?.jenisPeserta === 'Mahasiswa TPB ITB' || participant?.jenisPeserta === 'Anggota HMS ITB') {
        if (!value?.trim()) {
          newErrors[errorKey]![field] = '*Field ini wajib diisi'
        } else if (/[^0-9]/.test(value.trim())) {
          newErrors[errorKey]![field] = '*Masukkan NIM yang hanya berisi angka'
        } else {
          newErrors[errorKey]![field] = undefined
        }
      } else {
        newErrors[errorKey]![field] = undefined
      }
    } else if (field === 'alamat') {
      if (!value?.trim()) {
        newErrors[errorKey]![field] = '*Field ini wajib diisi'
      } else {
        newErrors[errorKey]![field] = undefined
      }
    }

    setErrors(newErrors)
    setShowErrors(true)
  }

  // Check form validity
  React.useEffect(() => {
    if (!isGroup) {
      onValidation?.(true)
      return
    }

    const validateParticipant = (p: ParticipantData | null): boolean => {
      if (!p) return false
      
      // Check NIM validation: must be numbers only if jenisPeserta is TPB or HMS
      const isNIMValid = p.jenisPeserta === 'Umum' || 
        (p.jenisPeserta !== 'Umum' && 
         p.nomorIndukMahasiswa?.trim() && 
         /^\d+$/.test(p.nomorIndukMahasiswa.trim()))
      
      return Boolean(
        p.namaLengkap?.trim() &&
        p.email?.trim() &&
        validateEmail(p.email) === undefined &&
        p.nomorWhatsApp?.trim() &&
        validatePhone(p.nomorWhatsApp) === undefined &&
        p.jenisPeserta &&
        p.pekerjaan?.trim() &&
        p.institusi?.trim() &&
        p.alamat?.trim() &&
        isNIMValid
      )
    }

    const isValid = needsPeserta2 && validateParticipant(peserta2) &&
      (!needsPeserta3 || validateParticipant(peserta3))

    onValidation?.(isValid)
  }, [peserta2, peserta3, isGroup, needsPeserta2, needsPeserta3, onValidation])

  // Expose validation function to parent
  React.useEffect(() => {
    (window as any).validateGroupParticipants = () => {
      if (!isGroup) return true

      const validateParticipant = (p: ParticipantData | null, num: 2 | 3): boolean => {
        if (!p) return false
        const newErrors: ValidationErrors = {}
        const errorKey = num === 2 ? 'peserta2' : 'peserta3'
        newErrors[errorKey] = {}
        let hasErrors = false

        if (!p.namaLengkap?.trim()) {
          newErrors[errorKey]!.namaLengkap = '*Field ini wajib diisi'
          hasErrors = true
        }
        const emailError = validateEmail(p.email)
        if (emailError) {
          newErrors[errorKey]!.email = emailError
          hasErrors = true
        }
        const phoneError = validatePhone(p.nomorWhatsApp)
        if (phoneError) {
          newErrors[errorKey]!.nomorWhatsApp = phoneError
          hasErrors = true
        }
        if (!p.jenisPeserta) {
          newErrors[errorKey]!.jenisPeserta = '*Field ini wajib diisi'
          hasErrors = true
        }
        if (!p.pekerjaan?.trim()) {
          newErrors[errorKey]!.pekerjaan = '*Field ini wajib diisi'
          hasErrors = true
        }
        if (!p.institusi?.trim()) {
          newErrors[errorKey]!.institusi = '*Field ini wajib diisi'
          hasErrors = true
        }
        if (p.jenisPeserta === 'Mahasiswa TPB ITB' || p.jenisPeserta === 'Anggota HMS ITB') {
          if (!p.nomorIndukMahasiswa?.trim()) {
            newErrors[errorKey]!.nomorIndukMahasiswa = '*Field ini wajib diisi'
            hasErrors = true
          } else if (/[^0-9]/.test(p.nomorIndukMahasiswa.trim())) {
            newErrors[errorKey]!.nomorIndukMahasiswa = '*Masukkan NIM yang hanya berisi angka'
            hasErrors = true
          }
        }
        if (!p.alamat?.trim()) {
          newErrors[errorKey]!.alamat = '*Field ini wajib diisi'
          hasErrors = true
        }

        setErrors(prev => ({ ...prev, ...newErrors }))
        return !hasErrors
      }

      const peserta2Valid = validateParticipant(peserta2, 2)
      const peserta3Valid = !needsPeserta3 || validateParticipant(peserta3, 3)
      setShowErrors(true)
      return peserta2Valid && peserta3Valid
    }
  }, [isGroup, peserta2, peserta3, needsPeserta3])

  if (!isGroup) {
    return null
  }

  const renderParticipantForm = (participantNum: 2 | 3, participant: ParticipantData | null) => {
    const p = participant || {
      namaLengkap: '', email: '', nomorWhatsApp: '', jenisPeserta: '', pekerjaan: '', institusi: '', nomorIndukMahasiswa: '', alamat: ''
    }
    const errorKey = participantNum === 2 ? 'peserta2' : 'peserta3'
    const participantErrors = errors[errorKey] || {}

    return (
      <div className="participant-section">
        <h3 className="participant-title">Peserta {participantNum}</h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="field-label">Nama Lengkap</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/name.svg" alt="Name" className="input-icon" />
              <input
                type="text"
                value={p.namaLengkap}
                onChange={(e) => updateParticipant(participantNum, 'namaLengkap', e.target.value)}
                onBlur={(e) => validateSingleField(participantNum, 'namaLengkap', e.target.value)}
                placeholder={`Nama Lengkap Peserta ${participantNum}`}
                className={`form-input ${showErrors && participantErrors.namaLengkap ? 'error' : ''}`}
              />
            </div>
            {showErrors && participantErrors.namaLengkap && (
              <span className="error-message">{participantErrors.namaLengkap}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Email</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/email.svg" alt="Email" className="input-icon" />
              <input
                type="email"
                value={p.email}
                onChange={(e) => updateParticipant(participantNum, 'email', e.target.value)}
                onBlur={(e) => validateSingleField(participantNum, 'email', e.target.value)}
                placeholder={`Email Peserta ${participantNum}`}
                className={`form-input ${showErrors && participantErrors.email ? 'error' : ''}`}
              />
            </div>
            {showErrors && participantErrors.email && (
              <span className="error-message">{participantErrors.email}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Nomor WhatsApp</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/phone.svg" alt="Phone" className="input-icon" />
              <input
                type="tel"
                value={p.nomorWhatsApp}
                onChange={(e) => updateParticipant(participantNum, 'nomorWhatsApp', e.target.value)}
                onBlur={(e) => validateSingleField(participantNum, 'nomorWhatsApp', e.target.value)}
                placeholder="08xxxxxxxxxx"
                className={`form-input ${showErrors && participantErrors.nomorWhatsApp ? 'error' : ''}`}
              />
            </div>
            {showErrors && participantErrors.nomorWhatsApp && (
              <span className="error-message">{participantErrors.nomorWhatsApp}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Jenis Peserta</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/institution.svg" alt="Institution" className="input-icon" />
              <select
                value={p.jenisPeserta}
                onChange={(e) => {
                  const newJenisPeserta = e.target.value
                  
                  // Update jenisPeserta and clear NIM if switching to Umum
                  const currentPeserta2 = peserta2 || {
                    namaLengkap: '', email: '', nomorWhatsApp: '', jenisPeserta: '', pekerjaan: '', institusi: '', nomorIndukMahasiswa: '', alamat: ''
                  }
                  const currentPeserta3 = peserta3 || {
                    namaLengkap: '', email: '', nomorWhatsApp: '', jenisPeserta: '', pekerjaan: '', institusi: '', nomorIndukMahasiswa: '', alamat: ''
                  }

                  if (participantNum === 2) {
                    onChange({
                      ...currentPeserta2,
                      jenisPeserta: newJenisPeserta,
                      nomorIndukMahasiswa: newJenisPeserta === 'Umum' ? '' : currentPeserta2.nomorIndukMahasiswa
                    }, currentPeserta3)
                  } else {
                    onChange(currentPeserta2, {
                      ...currentPeserta3,
                      jenisPeserta: newJenisPeserta,
                      nomorIndukMahasiswa: newJenisPeserta === 'Umum' ? '' : currentPeserta3.nomorIndukMahasiswa
                    })
                  }

                  // Clear errors when user changes selection
                  const errorKey = participantNum === 2 ? 'peserta2' : 'peserta3'
                  if (errors[errorKey]?.jenisPeserta) {
                    setErrors(prev => ({
                      ...prev,
                      [errorKey]: {
                        ...prev[errorKey],
                        jenisPeserta: undefined
                      }
                    }))
                  }
                  // Clear NIM error if switching to Umum
                  if (newJenisPeserta === 'Umum' && errors[errorKey]?.nomorIndukMahasiswa) {
                    setErrors(prev => ({
                      ...prev,
                      [errorKey]: {
                        ...prev[errorKey],
                        nomorIndukMahasiswa: undefined
                      }
                    }))
                  }
                }}
                onBlur={(e) => validateSingleField(participantNum, 'jenisPeserta', e.target.value)}
                className={`form-input form-select ${showErrors && participantErrors.jenisPeserta ? 'error' : ''}`}
              >
                <option value="">Pilih Jenis Peserta</option>
                <option value="Umum">Umum</option>
                <option value="Mahasiswa TPB ITB">Mahasiswa TPB ITB</option>
                <option value="Anggota HMS ITB">Anggota HMS ITB</option>
              </select>
            </div>
            {showErrors && participantErrors.jenisPeserta && (
              <span className="error-message">{participantErrors.jenisPeserta}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Pekerjaan</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/institution.svg" alt="Work" className="input-icon" />
              <input
                type="text"
                value={p.pekerjaan}
                onChange={(e) => updateParticipant(participantNum, 'pekerjaan', e.target.value)}
                onBlur={(e) => validateSingleField(participantNum, 'pekerjaan', e.target.value)}
                placeholder={`Pekerjaan Peserta ${participantNum}`}
                className={`form-input ${showErrors && participantErrors.pekerjaan ? 'error' : ''}`}
              />
            </div>
            {showErrors && participantErrors.pekerjaan && (
              <span className="error-message">{participantErrors.pekerjaan}</span>
            )}
          </div>

          <div className="form-field">
            <label className="field-label">Institusi</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/institution.svg" alt="Institution" className="input-icon" />
              <input
                type="text"
                value={p.institusi}
                onChange={(e) => updateParticipant(participantNum, 'institusi', e.target.value)}
                onBlur={(e) => validateSingleField(participantNum, 'institusi', e.target.value)}
                placeholder={`Institusi Peserta ${participantNum}`}
                className={`form-input ${showErrors && participantErrors.institusi ? 'error' : ''}`}
              />
            </div>
            {showErrors && participantErrors.institusi && (
              <span className="error-message">{participantErrors.institusi}</span>
            )}
          </div>

          {(p.jenisPeserta === 'Mahasiswa TPB ITB' || p.jenisPeserta === 'Anggota HMS ITB') && (
            <div className="form-field">
              <label className="field-label">Nomor Induk Mahasiswa</label>
              <div className="input-with-icon">
                <img src="/assets/registration/info-team/institution.svg" alt="NIM" className="input-icon" />
                <input
                  type="text"
                  value={p.nomorIndukMahasiswa}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const errorKey = participantNum === 2 ? 'peserta2' : 'peserta3';

                    // Validasi: kalau ada selain angka → error
                    if (/[^0-9]/.test(inputValue)) {
                      setErrors(prev => ({
                        ...prev,
                        [errorKey]: {
                          ...prev[errorKey],
                          nomorIndukMahasiswa: '*Masukkan NIM yang hanya berisi angka',
                        }
                      }));
                    } else {
                      setErrors(prev => ({
                        ...prev,
                        [errorKey]: {
                          ...prev[errorKey],
                          nomorIndukMahasiswa: undefined,
                        }
                      }));
                    }

                    // SIMPAN APA ADANYA (jangan difilter)
                    updateParticipant(participantNum, 'nomorIndukMahasiswa', inputValue);
                  }}
                  onBlur={() =>
                    validateSingleField(participantNum, 'nomorIndukMahasiswa', p.nomorIndukMahasiswa)
                  }
                  placeholder={`Nomor Induk Mahasiswa Peserta ${participantNum}`}
                  className={`form-input ${showErrors && participantErrors.nomorIndukMahasiswa ? 'error' : ''}`}
                />
              </div>
              {showErrors && participantErrors.nomorIndukMahasiswa && (
                <span className="error-message">{participantErrors.nomorIndukMahasiswa}</span>
              )}
            </div>
          )}

          <div className="form-field full-width">
            <label className="field-label">Alamat</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/institution.svg" alt="Address" className="input-icon" />
              <textarea
                value={p.alamat}
                onChange={(e) => updateParticipant(participantNum, 'alamat', e.target.value)}
                onBlur={(e) => validateSingleField(participantNum, 'alamat', e.target.value)}
                placeholder={`Alamat Peserta ${participantNum}`}
                rows={3}
                className={`form-input form-textarea ${showErrors && participantErrors.alamat ? 'error' : ''}`}
              />
            </div>
            {showErrors && participantErrors.alamat && (
              <span className="error-message">{participantErrors.alamat}</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group-participants-content">
      <h2 className="group-participants-title">Data Diri Paketan</h2>
      <p className="group-note">*Pertanyaan di atas berulang sesuai dengan jumlah paket yang dipilih</p>
      
      {needsPeserta2 && renderParticipantForm(2, peserta2)}
      {needsPeserta3 && renderParticipantForm(3, peserta3)}
    </div>
  )
}

export default GroupParticipants
