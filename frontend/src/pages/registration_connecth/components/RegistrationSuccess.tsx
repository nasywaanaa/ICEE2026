import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../landing/components/Header'
import Footer from '../../landing/components/Footer'
import './RegistrationSuccess.css'

const RegistrationSuccess: React.FC = () => {
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
          
          <h1 className="success-title">Your registration has been submitted!</h1>
          
          <div className="success-message">
            <p>Thank you for completing your registration for the</p>
            <p>competition. We're grateful for your participation</p>
            <p>and wish you the best of luck!</p>
          </div>
          
          <Link to="/" className="back-home-btn">
            Back to Home
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default RegistrationSuccess
