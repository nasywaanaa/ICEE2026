import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../landing/components/Header'
import Footer from '../../landing/components/Footer'
import '../../registration/components/RegistrationSuccess.css'

interface SeminarRegistrationSuccessProps {
  status: string
}

const SeminarRegistrationSuccess: React.FC<SeminarRegistrationSuccessProps> = ({ status }) => {
  return (
    <div className="success-page">
      <Header />
      
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path
                d="m9 12 2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="success-title">
            Pendaftaran Seminar Berhasil 
          </h1>

          <div className="success-message">
            <p>
              Terima kasih telah menyelesaikan pendaftaran Seminar <strong>ICEE ITB 2026</strong>.
            </p>

            <p>
              Status pendaftaran Anda saat ini: <strong>{status}</strong>
            </p>

            <p>
              Silakan <strong>periksa email Anda</strong> untuk mendapatkan code peserta, informasi detail acara, dan link untuk bergabung ke Grup WhatsApp peserta.
            </p>

            <p style={{ marginTop: "12px" }}>
              Apabila email belum ditemukan, mohon periksa folder <strong>Spam / Promotions</strong>.
            </p>

            <p>
              Jika Anda masih belum menerima email tersebut, silakan menghubungi
              <strong> Panitia ICEE ITB 2026</strong> melalui kontak resmi kami.
            </p>

          </div>

          <Link to="/" className="back-home-btn">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default SeminarRegistrationSuccess
