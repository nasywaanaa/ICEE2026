import React, { useState } from 'react'
import './Payment.css'

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

interface PaymentProps {
  paketPendaftaran: string
  pengisiForm: ParticipantData
  peserta2: ParticipantData | null
  peserta3: ParticipantData | null
  paymentProof: File | null
  onChange: (paymentProof: File | null) => void
  onValidation?: (isValid: boolean) => void
}

const Payment: React.FC<PaymentProps> = ({ paketPendaftaran, pengisiForm, peserta2, peserta3, paymentProof, onChange, onValidation }) => {
  const MAX_FILE_SIZE = 500 * 1024 // 500KB in bytes
  const [fileError, setFileError] = useState('')

  const isGroup = paketPendaftaran === '2 orang' || paketPendaftaran === '3 orang'

  // Pricing structure
  const PRICING = {
    'Early Bird': {
      'Individu': 55000,
      '2 orang': 100000,
      '3 orang': 135000,
    },
    'Reguler Ticket': {
      'Individu': 65000,
      '2 orang': 120000,
      '3 orang': 165000,
    },
    'HMS & TPB': {
      'Individu': 50000,
      '2 orang': 90000,
      '3 orang': 120000,
    },
  }

  // Format Rupiah
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Determine pricing category based on jenisPeserta
  const getPricingCategory = (): 'Early Bird' | 'Reguler Ticket' | 'HMS & TPB' => {
    // If participant is HMS or TPB, use HMS & TPB pricing
    if (pengisiForm.jenisPeserta === 'Mahasiswa TPB ITB' || pengisiForm.jenisPeserta === 'Anggota HMS ITB') {
      return 'HMS & TPB'
    }
    // For Umum, default to Reguler Ticket (Early Bird can be added later with date logic)
    return 'Reguler Ticket'
  }

  // Calculate total price
  const calculateTotal = (): string => {
    const pricingCategory = getPricingCategory()
    const prices = PRICING[pricingCategory]
    
    let total = 0
    if (paketPendaftaran === 'Individu') {
      total = prices['Individu']
    } else if (paketPendaftaran === '2 orang') {
      total = prices['2 orang']
    } else if (paketPendaftaran === '3 orang') {
      total = prices['3 orang']
    }
    
    return formatRupiah(total)
  }

  // Calculate discount for group packages
  const calculateDiscount = (): string => {
    if (!isGroup) return ''
    
    const pricingCategory = getPricingCategory()
    const prices = PRICING[pricingCategory]
    const individualPrice = prices['Individu']
    
    let discount = 0
    if (paketPendaftaran === '2 orang') {
      const individualTotal = individualPrice * 2
      discount = individualTotal - prices['2 orang']
    } else if (paketPendaftaran === '3 orang') {
      const individualTotal = individualPrice * 3
      discount = individualTotal - prices['3 orang']
    }
    
    return discount > 0 ? formatRupiah(discount) : ''
  }

  const handleFileUpload = (file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE) {
      const errorMessage = `Ukuran file harus kurang dari 500KB. Ukuran file saat ini: ${(file.size / 1024).toFixed(2)} KB`
      setFileError(errorMessage)
      return
    }
    
    setFileError('')
    onChange(file)
  }

  // Get all participants for summary
  const getAllParticipants = () => {
    const participants = [pengisiForm]
    if (peserta2) participants.push(peserta2)
    if (peserta3) participants.push(peserta3)
    return participants
  }

  React.useEffect(() => {
    const isValid = !!paymentProof && !fileError
    onValidation?.(isValid)
  }, [paymentProof, fileError, onValidation])

  return (
    <div className="payment-content">
      <h2 className="payment-title">Pembayaran</h2>

      {/* Rekapitulasi Pendaftar */}
      <div className="summary-section">
        <h3 className="summary-title">Rekapitulasi Pendaftar</h3>
        <div className="participants-list">
          {getAllParticipants().map((participant, index) => (
            <div key={index} className="participant-summary">
              <div className="participant-number">Peserta {index + 1}</div>
              <div className="participant-details">
                <div className="detail-row">
                  <span className="detail-label">Nama:</span>
                  <span className="detail-value">{participant.namaLengkap}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{participant.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Jenis Peserta:</span>
                  <span className="detail-value">{participant.jenisPeserta}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Institusi:</span>
                  <span className="detail-value">{participant.institusi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Harga */}
      <div className="price-section">
        <div className="price-row">
          <span className="price-label">Total Harga:</span>
          <span className="price-value">{calculateTotal()}</span>
        </div>
        {isGroup && (
          <div className="price-row discount-row">
            <span className="price-label">Potongan untuk pendaftar kelompok:</span>
            <span className="price-value discount-value">{calculateDiscount()}</span>
          </div>
        )}
      </div>

      {/* Penjelasan Opsi Pembayaran
      <div className="payment-info-section">
        <h3 className="info-title">Penjelasan Opsi Pembayaran</h3>
        <div className="info-content">
          <p>Informasi mengenai opsi pembayaran akan ditampilkan di sini.</p>
          <p>Silakan hubungi panitia untuk informasi lebih lanjut mengenai metode pembayaran yang tersedia.</p>
        </div>
      </div> */}

      <div className="payment-info-section">
        <h3 className="payment-info-title">Informasi Pembayaran</h3>
        <div className="payment-details">
          <div className="payment-method-item">
            <strong>Gopay:</strong> 081317778003 a.n Aufa
          </div>
          <div className="payment-method-item">
            <strong>BCA:</strong> 8050579213 a.n Aufaniswatul Dave
          </div>
        </div>
      </div>

      {/* Upload Bukti Pembayaran */}
      <div className="upload-section">
        <h3 className="upload-title">Upload Bukti Pembayaran</h3>
        
        <div className="file-upload-area">
          <input
            type="file"
            id="paymentProof"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
            className="file-input"
          />
          <label htmlFor="paymentProof" className="file-upload-label">
            {paymentProof ? (
              <div className="file-uploaded">
                <div className="upload-success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="file-info">
                  <span className="file-name">{paymentProof.name}</span>
                  <span className="file-size">{(paymentProof.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span className="upload-status">✓ File berhasil diunggah</span>
                </div>
                <button 
                  type="button" 
                  className="change-file-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('paymentProof')?.click()
                  }}
                >
                  Ganti file
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
                  <span className="upload-main">Seret file Anda untuk mulai mengunggah</span>
                  <span className="upload-divider">ATAU</span>
                  <button 
                    type="button" 
                    className="browse-btn"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('paymentProof')?.click()
                    }}
                  >
                    Pilih file
                  </button>
                </div>
              </div>
            )}
          </label>
        </div>
        
        <p className="file-format">Format yang didukung: JPG, PNG, PDF</p>
        <p className="file-size-limit">Ukuran file maksimum: 500KB</p>
        
        {fileError && (
          <div className="file-error-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {fileError}
          </div>
        )}
      </div>
    </div>
  )
}

export default Payment
