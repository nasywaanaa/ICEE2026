import React, { useState } from 'react'
import './PersonalInfo.css'

interface PersonalInfoData {
  namaLengkap: string
  email: string
  nomorWhatsApp: string
  jenisPeserta: string
  pekerjaan: string
  institusi: string
  nomorIndukMahasiswa: string
  alamat: string
  paketPendaftaran: string
}

interface PersonalInfoProps {
  data: PersonalInfoData
  onChange: (data: PersonalInfoData) => void
  onValidation?: (isValid: boolean) => void
}

interface ValidationErrors {
  namaLengkap?: string
  email?: string
  nomorWhatsApp?: string
  jenisPeserta?: string
  pekerjaan?: string
  institusi?: string
  nomorIndukMahasiswa?: string
  alamat?: string
  paketPendaftaran?: string
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, onChange, onValidation }) => {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [showErrors, setShowErrors] = useState(false)

  const updateField = (field: keyof PersonalInfoData, value: string) => {
    onChange({
      ...data,
      [field]: value
    })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

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

  const validateNIM = (nim: string): string | undefined => {
    if (!nim?.trim()) {
      return '*Field ini wajib diisi'
    }
    if (!/^\d+$/.test(nim.trim())) {
      return '*Masukkan NIM yang hanya berisi angka'
    }
    return undefined
  }

  const validateForm = React.useCallback(() => {
    const newErrors: ValidationErrors = {}
    let hasErrors = false

    if (!data.namaLengkap?.trim()) {
      newErrors.namaLengkap = '*Field ini wajib diisi'
      hasErrors = true
    }

    const emailError = validateEmail(data.email)
    if (emailError) {
      newErrors.email = emailError
      hasErrors = true
    }

    const phoneError = validatePhone(data.nomorWhatsApp)
    if (phoneError) {
      newErrors.nomorWhatsApp = phoneError
      hasErrors = true
    }

    if (!data.jenisPeserta) {
      newErrors.jenisPeserta = '*Field ini wajib diisi'
      hasErrors = true
    }

    if (!data.pekerjaan?.trim()) {
      newErrors.pekerjaan = '*Field ini wajib diisi'
      hasErrors = true
    }

    if (!data.institusi?.trim()) {
      newErrors.institusi = '*Field ini wajib diisi'
      hasErrors = true
    }

    // NIM required only for Mahasiswa TPB ITB or Anggota HMS ITB
    if (data.jenisPeserta === 'Mahasiswa TPB ITB' || data.jenisPeserta === 'Anggota HMS ITB') {
      const nimError = validateNIM(data.nomorIndukMahasiswa)
      if (nimError) {
        newErrors.nomorIndukMahasiswa = nimError
        hasErrors = true
      }
    }

    if (!data.alamat?.trim()) {
      newErrors.alamat = '*Field ini wajib diisi'
      hasErrors = true
    }

    if (!data.paketPendaftaran) {
      newErrors.paketPendaftaran = '*Field ini wajib diisi'
      hasErrors = true
    }

    setErrors(newErrors)
    setShowErrors(true)
    return !hasErrors
  }, [data])

  const validateSingleField = (field: keyof PersonalInfoData, value: string) => {
    const newErrors = { ...errors }
    
    if (field === 'namaLengkap') {
      if (!value?.trim()) {
        newErrors.namaLengkap = '*Field ini wajib diisi'
      } else {
        newErrors.namaLengkap = undefined
      }
    } else if (field === 'email') {
      const emailError = validateEmail(value)
      newErrors.email = emailError
    } else if (field === 'nomorWhatsApp') {
      const phoneError = validatePhone(value)
      newErrors.nomorWhatsApp = phoneError
    } else if (field === 'jenisPeserta') {
      if (!value) {
        newErrors.jenisPeserta = '*Field ini wajib diisi'
      } else {
        newErrors.jenisPeserta = undefined
      }
    } else if (field === 'pekerjaan') {
      if (!value?.trim()) {
        newErrors.pekerjaan = '*Field ini wajib diisi'
      } else {
        newErrors.pekerjaan = undefined
      }
    } else if (field === 'institusi') {
      if (!value?.trim()) {
        newErrors.institusi = '*Field ini wajib diisi'
      } else {
        newErrors.institusi = undefined
      }
    } else if (field === 'nomorIndukMahasiswa') {
      if (data.jenisPeserta === 'Mahasiswa TPB ITB' || data.jenisPeserta === 'Anggota HMS ITB') {
        const nimError = validateNIM(value)
        newErrors.nomorIndukMahasiswa = nimError
      } else {
        newErrors.nomorIndukMahasiswa = undefined
      }
    } else if (field === 'alamat') {
      if (!value?.trim()) {
        newErrors.alamat = '*Field ini wajib diisi'
      } else {
        newErrors.alamat = undefined
      }
    } else if (field === 'paketPendaftaran') {
      if (!value) {
        newErrors.paketPendaftaran = '*Field ini wajib diisi'
      } else {
        newErrors.paketPendaftaran = undefined
      }
    }
    
    setErrors(newErrors)
    setShowErrors(true)
  }

  // Check form validity and notify parent
  React.useEffect(() => {
    const isNIMValid = data.jenisPeserta === 'Umum' || 
      (data.jenisPeserta !== 'Umum' && data.nomorIndukMahasiswa?.trim() && /^\d+$/.test(data.nomorIndukMahasiswa.trim()))
    
    const isValid = Boolean(
      data.namaLengkap?.trim() &&
      data.email?.trim() &&
      validateEmail(data.email) === undefined &&
      data.nomorWhatsApp?.trim() &&
      validatePhone(data.nomorWhatsApp) === undefined &&
      data.jenisPeserta &&
      data.pekerjaan?.trim() &&
      data.institusi?.trim() &&
      data.alamat?.trim() &&
      data.paketPendaftaran &&
      isNIMValid
    )
    
    onValidation?.(isValid)
  }, [data, onValidation])

  // Expose validation function to parent
  React.useEffect(() => {
    (window as any).validatePersonalInfo = () => {
      const isValid = validateForm()
      return isValid
    }
  }, [validateForm])

  return (
    <div className="personal-info-content">
      {/* Top Notes */}
      <div className="info-notes">
        <h3 className="notes-title">Informasi Penting</h3>
        <ul className="notes-list">
          <li>Terdapat 2 jenis paket pendaftaran yaitu individu dan kelompok</li>
          <li>Terdapat penggolongan peserta yaitu umum, HMS, dan TPB</li>
        </ul>
      </div>

      {/* Pricing Information */}
      <div className="pricing-info-section">
        <h3 className="pricing-info-title">Informasi Harga Tiket</h3>
        <div className="pricing-grid">
          <div className="pricing-category">
            <strong className="pricing-category-title">Early Bird:</strong>
            <ul className="pricing-list">
              <li>Individu: Rp55.000</li>
              <li>Bundling 2 org: Rp100.000</li>
              <li>Bundling 3 org: Rp135.000</li>
            </ul>
          </div>
          <div className="pricing-category">
            <strong className="pricing-category-title">Reguler Ticket:</strong>
            <ul className="pricing-list">
              <li>Individu: Rp65.000</li>
              <li>Bundling 2 org: Rp120.000</li>
              <li>Bundling 3 org: Rp165.000</li>
            </ul>
          </div>
          <div className="pricing-category">
            <strong className="pricing-category-title">HMS & TPB:</strong>
            <ul className="pricing-list">
              <li>Individu: Rp50.000</li>
              <li>Bundling 2 org: Rp90.000</li>
              <li>Bundling 3 org: Rp120.000</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="personal-info-title">Data Diri Pengisi Form</h2>
      
      <div className="form-grid">
        <div className="form-field">
          <label className="field-label">Nama Lengkap</label>
          <div className="input-with-icon">
            <img src="/assets/registration/info-team/name.svg" alt="Name" className="input-icon" />
            <input
              type="text"
              value={data.namaLengkap}
              onChange={(e) => updateField('namaLengkap', e.target.value)}
              onBlur={(e) => validateSingleField('namaLengkap', e.target.value)}
              placeholder="Nama Lengkap"
              className={`form-input ${showErrors && errors.namaLengkap ? 'error' : ''}`}
            />
          </div>
          {showErrors && errors.namaLengkap && (
            <span className="error-message">{errors.namaLengkap}</span>
          )}
        </div>

        <div className="form-field">
          <label className="field-label">Email</label>
          <div className="input-with-icon">
            <img src="/assets/registration/info-team/email.svg" alt="Email" className="input-icon" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => updateField('email', e.target.value)}
              onBlur={(e) => validateSingleField('email', e.target.value)}
              placeholder="Email"
              className={`form-input ${showErrors && errors.email ? 'error' : ''}`}
            />
          </div>
          {showErrors && errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-field">
          <label className="field-label">Nomor WhatsApp</label>
          <div className="input-with-icon">
            <img src="/assets/registration/info-team/phone.svg" alt="Phone" className="input-icon" />
            <input
              type="tel"
              value={data.nomorWhatsApp}
              onChange={(e) => updateField('nomorWhatsApp', e.target.value)}
              onBlur={(e) => validateSingleField('nomorWhatsApp', e.target.value)}
              placeholder="08xxxxxxxxxx"
              className={`form-input ${showErrors && errors.nomorWhatsApp ? 'error' : ''}`}
            />
          </div>
          {showErrors && errors.nomorWhatsApp && (
            <span className="error-message">{errors.nomorWhatsApp}</span>
          )}
        </div>

        <div className="form-field">
          <label className="field-label">Jenis Peserta</label>
          <div className="input-with-icon">
            <img src="/assets/registration/info-team/institution.svg" alt="Institution" className="input-icon" />
            <select
              value={data.jenisPeserta}
              onChange={(e) => {
                const newJenisPeserta = e.target.value
                // Update jenisPeserta and clear NIM if switching to Umum, all in one update
                onChange({
                  ...data,
                  jenisPeserta: newJenisPeserta,
                  nomorIndukMahasiswa: newJenisPeserta === 'Umum' ? '' : data.nomorIndukMahasiswa
                })
                // Clear error when user changes selection
                if (errors.jenisPeserta) {
                  setErrors(prev => ({
                    ...prev,
                    jenisPeserta: undefined
                  }))
                }
                // Clear NIM error if switching to Umum
                if (newJenisPeserta === 'Umum' && errors.nomorIndukMahasiswa) {
                  setErrors(prev => ({
                    ...prev,
                    nomorIndukMahasiswa: undefined
                  }))
                }
              }}
              onBlur={(e) => validateSingleField('jenisPeserta', e.target.value)}
              className={`form-input form-select ${showErrors && errors.jenisPeserta ? 'error' : ''}`}
            >
              <option value="">Pilih Jenis Peserta</option>
              <option value="Umum">Umum</option>
              <option value="Mahasiswa TPB ITB">Mahasiswa TPB ITB</option>
              <option value="Anggota HMS ITB">Anggota HMS ITB</option>
            </select>
          </div>
          {showErrors && errors.jenisPeserta && (
            <span className="error-message">{errors.jenisPeserta}</span>
          )}
        </div>

        <div className="form-field">
          <label className="field-label">Pekerjaan</label>
          <div className="input-with-icon">
            <img src="/assets/registration/info-team/institution.svg" alt="Work" className="input-icon" />
            <input
              type="text"
              value={data.pekerjaan}
              onChange={(e) => updateField('pekerjaan', e.target.value)}
              onBlur={(e) => validateSingleField('pekerjaan', e.target.value)}
              placeholder="Pekerjaan"
              className={`form-input ${showErrors && errors.pekerjaan ? 'error' : ''}`}
            />
          </div>
          {showErrors && errors.pekerjaan && (
            <span className="error-message">{errors.pekerjaan}</span>
          )}
        </div>

        <div className="form-field">
          <label className="field-label">Institusi</label>
          <div className="input-with-icon">
            <img src="/assets/registration/info-team/institution.svg" alt="Institution" className="input-icon" />
            <input
              type="text"
              value={data.institusi}
              onChange={(e) => updateField('institusi', e.target.value)}
              onBlur={(e) => validateSingleField('institusi', e.target.value)}
              placeholder="Institusi"
              className={`form-input ${showErrors && errors.institusi ? 'error' : ''}`}
            />
          </div>
          {showErrors && errors.institusi && (
            <span className="error-message">{errors.institusi}</span>
          )}
        </div>

        {(data.jenisPeserta === 'Mahasiswa TPB ITB' || data.jenisPeserta === 'Anggota HMS ITB') && (
          <div className="form-field">
            <label className="field-label">Nomor Induk Mahasiswa</label>
            <div className="input-with-icon">
              <img src="/assets/registration/info-team/institution.svg" alt="NIM" className="input-icon" />
                <input
                  type="text"
                  value={data.nomorIndukMahasiswa}
                  onChange={(e) => {
                    const inputValue = e.target.value;

                    // Validasi: kalau ada selain angka → error
                    if (/[^0-9]/.test(inputValue)) {
                      setErrors(prev => ({
                        ...prev,
                        nomorIndukMahasiswa: '*Masukkan NIM yang hanya berisi angka',
                      }));
                    } else {
                      setErrors(prev => ({
                        ...prev,
                        nomorIndukMahasiswa: undefined,
                      }));
                    }

                    // SIMPAN APA ADANYA (jangan difilter)
                    updateField('nomorIndukMahasiswa', inputValue);
                  }}
                  onBlur={() =>
                    validateSingleField('nomorIndukMahasiswa', data.nomorIndukMahasiswa)
                  }
                  placeholder="Nomor Induk Mahasiswa"
                  className={`form-input ${
                    showErrors && errors.nomorIndukMahasiswa ? 'error' : ''
                  }`}
                />
            </div>
            {showErrors && errors.nomorIndukMahasiswa && (
              <span className="error-message">{errors.nomorIndukMahasiswa}</span>
            )}
          </div>
        )}

        <div className="form-field full-width">
          <label className="field-label">Alamat</label>
          <div className="input-with-icon">
            <img src="/assets/registration/info-team/institution.svg" alt="Address" className="input-icon" />
            <textarea
              value={data.alamat}
              onChange={(e) => updateField('alamat', e.target.value)}
              onBlur={(e) => validateSingleField('alamat', e.target.value)}
              placeholder="Alamat"
              rows={3}
              className={`form-input form-textarea ${showErrors && errors.alamat ? 'error' : ''}`}
            />
          </div>
          {showErrors && errors.alamat && (
            <span className="error-message">{errors.alamat}</span>
          )}
        </div>

        <div className="form-field full-width">
          <label className="field-label">Paket Pendaftaran</label>
          <div className="input-with-icon">
            <img src="/assets/registration/info-team/institution.svg" alt="Package" className="input-icon" />
            <select
              value={data.paketPendaftaran}
              onChange={(e) => updateField('paketPendaftaran', e.target.value)}
              onBlur={(e) => validateSingleField('paketPendaftaran', e.target.value)}
              className={`form-input form-select ${showErrors && errors.paketPendaftaran ? 'error' : ''}`}
            >
              <option value="">Pilih Paket Pendaftaran</option>
              <option value="Individu">Individu</option>
              <option value="2 orang">2 orang</option>
              <option value="3 orang">3 orang</option>
            </select>
          </div>
          {showErrors && errors.paketPendaftaran && (
            <span className="error-message">{errors.paketPendaftaran}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalInfo
