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

          {/* Condensed Thank You Message */}
          <div className="success-message">
            <p>
              Terima kasih telah menyelesaikan pendaftaran Seminar <strong>ICEE ITB 2026</strong>.
            </p>
          </div>

          {/* Email Info Card */}
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="info-card-title">Periksa Email Anda</h3>
            </div>
            <p className="info-card-text">
              Silakan periksa email Anda untuk mendapatkan code peserta, informasi detail acara, dan link untuk bergabung ke Grup WhatsApp peserta.
            </p>
            <div className="info-card-note">
              <div className="info-icon-small">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-2.586a1 1 0 0 0-.707.293l-2.414 2.414a1 1 0 0 1-.707.293h-3.172a1 1 0 0 1-.707-.293l-2.414-2.414A1 1 0 0 0 6.586 13H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Apabila email belum ditemukan, mohon periksa folder <strong>Spam / Promotions</strong>.</span>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="contact-cta">
            <div className="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="contact-text">
              <p className="contact-label">Masih belum menerima email?</p>
              <a 
                href="https://www.instagram.com/iceeitb/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-button"
              >
                Hubungi Panitia ICEE ITB 2026
              </a>
            </div>
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
