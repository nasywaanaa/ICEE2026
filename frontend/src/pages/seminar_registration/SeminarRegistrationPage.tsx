import React, { useState } from 'react'
import SeminarRegistrationHeader from './components/SeminarRegistrationHeader'
import StepIndicator from '../registration/components/StepIndicator'
import PersonalInfo from './components/PersonalInfo'
import GroupParticipants from './components/GroupParticipants'
import Payment from './components/Payment'
import SeminarRegistrationSuccess from './components/SeminarRegistrationSuccess'
import '../registration/RegistrationPage.css'

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

const SeminarRegistrationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    pengisiForm: {
      namaLengkap: '',
      email: '',
      nomorWhatsApp: '',
      jenisPeserta: '',
      pekerjaan: '',
      institusi: '',
      nomorIndukMahasiswa: '',
      alamat: '',
      paketPendaftaran: ''
    },
    peserta2: null as ParticipantData | null,
    peserta3: null as ParticipantData | null,
    paymentProof: null as File | null
  })

  const [isPersonalInfoValid, setIsPersonalInfoValid] = useState(false)
  const [isGroupParticipantsValid, setIsGroupParticipantsValid] = useState(true)
  const [isPaymentValid, setIsPaymentValid] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState('')

  const isGroup = formData.pengisiForm.paketPendaftaran === '2 orang' || formData.pengisiForm.paketPendaftaran === '3 orang'

  // Always show 3 steps
  const steps = [
    { id: 1, title: 'Data Diri', subtitle: 'Lengkapi data diri Anda' },
    { id: 2, title: 'Data Paketan', subtitle: isGroup ? 'Lengkapi data peserta tambahan' : 'Tidak diperlukan untuk individu' },
    { id: 3, title: 'Pembayaran', subtitle: 'Upload bukti pembayaran' }
  ]

  // Determine if step 2 should be marked as completed (for individuals)
  const isStep2Completed = !isGroup && currentStep >= 3

  const handleNext = () => {
    if (currentStep === 1) {
      if ((window as any).validatePersonalInfo) {
        const isValid = (window as any).validatePersonalInfo()
        if (!isValid) {
          return
        }
      }
      // If individual, skip step 2 and go directly to step 3
      if (!isGroup) {
        setCurrentStep(3)
        return
      }
    }
    
    if (currentStep === 2 && isGroup) {
      if ((window as any).validateGroupParticipants) {
        const isValid = (window as any).validateGroupParticipants()
        if (!isValid) {
          return
        }
      }
    }
    
    if (currentStep === 3) {
      setShowSubmitModal(true)
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Calculate pricing based on user selections
  const calculatePricing = () => {
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

    // Determine pricing category
    let pricingCategory: 'Early Bird' | 'Reguler Ticket' | 'HMS & TPB' = 'Reguler Ticket'
    if (formData.pengisiForm.jenisPeserta === 'Mahasiswa TPB ITB' || formData.pengisiForm.jenisPeserta === 'Anggota HMS ITB') {
      pricingCategory = 'HMS & TPB'
    }

    const prices = PRICING[pricingCategory]
    const paket = formData.pengisiForm.paketPendaftaran
    
    let total = 0
    let discount = 0

    if (paket === 'Individu') {
      total = prices['Individu']
    } else if (paket === '2 orang') {
      total = prices['2 orang']
      const individualTotal = prices['Individu'] * 2
      discount = individualTotal - total
    } else if (paket === '3 orang') {
      total = prices['3 orang']
      const individualTotal = prices['Individu'] * 3
      discount = individualTotal - total
    }

    return { total, discount }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const fd = new FormData()
      fd.append('paketPendaftaran', formData.pengisiForm.paketPendaftaran)
      fd.append('pengisiForm', JSON.stringify(formData.pengisiForm))
      
      if (formData.peserta2) {
        fd.append('peserta2', JSON.stringify(formData.peserta2))
      }
      if (formData.peserta3) {
        fd.append('peserta3', JSON.stringify(formData.peserta3))
      }

      // Calculate status
      const status = isGroup ? 'KELOMPOK SELESAI' : 'INDIVIDU SELESAI'
      fd.append('status', status)
      
      // Calculate actual pricing
      const { total, discount } = calculatePricing()
      fd.append('totalHarga', total.toString())
      fd.append('potongan', discount.toString())

      if (formData.paymentProof) {
        fd.append('paymentProof', formData.paymentProof)
      }

      const RAW_BASE = (import.meta as any).env?.VITE_API_BASE_URL || ''
      const API_BASE = RAW_BASE && !/^https?:\/\//i.test(RAW_BASE) 
        ? `https://${RAW_BASE}` 
        : (RAW_BASE || 'http://localhost:5002')
      const endpoint = `${API_BASE.replace(/\/$/, '')}/api/seminar/submit`
      const res = await fetch(endpoint, {
        method: 'POST',
        body: fd
      })
      const json = await res.json().catch(() => ({} as any))
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Submission failed')
      }

      setShowSubmitModal(false)
      setSubmissionStatus(status)
      setIsSubmitted(true)
    } catch (err) {
      console.error('Submit error:', err)
      alert('Pengiriman gagal. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelSubmit = () => {
    setShowSubmitModal(false)
  }

  const handlePrevious = () => {
    if (currentStep === 3 && !isGroup) {
      // For individuals, go back from step 3 to step 1 (skip step 2)
      setCurrentStep(1)
    } else if (currentStep > 1) {
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
          <PersonalInfo 
            data={formData.pengisiForm}
            onChange={(data) => updateFormData('pengisiForm', data)}
            onValidation={setIsPersonalInfoValid}
          />
        )
      case 2:
        // Only show GroupParticipants for groups
        if (isGroup) {
          return (
            <GroupParticipants 
              peserta2={formData.peserta2}
              peserta3={formData.peserta3}
              paketPendaftaran={formData.pengisiForm.paketPendaftaran}
              onChange={(peserta2, peserta3) => {
                setFormData(prev => ({
                  ...prev,
                  peserta2,
                  peserta3
                }))
              }}
              onValidation={setIsGroupParticipantsValid}
            />
          )
        }
        // For individuals, step 2 is skipped, so this shouldn't render
        return null
      case 3:
        return (
          <Payment 
            paketPendaftaran={formData.pengisiForm.paketPendaftaran}
            pengisiForm={formData.pengisiForm}
            peserta2={formData.peserta2}
            peserta3={formData.peserta3}
            paymentProof={formData.paymentProof}
            onChange={(paymentProof) => updateFormData('paymentProof', paymentProof)}
            onValidation={setIsPaymentValid}
          />
        )
      default:
        return null
    }
  }

  // Show success page after submission
  if (isSubmitted) {
    return <SeminarRegistrationSuccess status={submissionStatus} />
  }

  return (
    <div className="registration-page">
      <SeminarRegistrationHeader />
      
      <div className="registration-container">
        <StepIndicator 
          steps={steps} 
          currentStep={currentStep}
          completedSteps={isStep2Completed ? [2] : []}
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
                ← Sebelumnya
              </button>
              
              <button 
                className="nav-button next-button" 
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isPersonalInfoValid) ||
                  (currentStep === 2 && isGroup && !isGroupParticipantsValid) ||
                  (currentStep === 3 && !isPaymentValid)
                }
              >
                {currentStep === 3 ? 'Kirim' : 'Selanjutnya →'}
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
            <h3 className="modal-title">Kirim Pendaftaran</h3>
            <div className="modal-message">
              <p>Apakah Anda yakin ingin mengirim formulir ini?</p>
              <p>Pastikan semua detail sudah akurat.</p>
            </div>
            <div className="modal-buttons">
              <button 
                className="modal-button cancel-button"
                onClick={handleCancelSubmit}
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button 
                className="modal-button submit-button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Mengirim...
                  </>
                ) : (
                  'Kirim'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeminarRegistrationPage
