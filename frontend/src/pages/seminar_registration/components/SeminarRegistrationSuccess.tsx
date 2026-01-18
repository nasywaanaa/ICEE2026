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
              <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 className="success-title">Pendaftaran seminar Anda telah berhasil dikirim!</h1>
          
          <div className="success-message">
            <p>Terima kasih telah menyelesaikan pendaftaran seminar.</p>
            <p>Status pendaftaran: <strong>{status}</strong></p>
            <p>Kami menghargai partisipasi Anda dan berharap dapat bertemu di acara seminar!</p>
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
