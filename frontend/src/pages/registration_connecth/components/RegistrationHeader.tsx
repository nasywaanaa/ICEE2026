import React from 'react'
import { Link } from 'react-router-dom'
import './RegistrationHeader.css'

const RegistrationHeader: React.FC = () => {
  return (
    <header className="registration-header">
      <div className="registration-header-container">
        <Link to="/" className="registration-logo">
          <img src="/assets/Logo ICEE White.svg" alt="ICEE 2025" className="registration-logo-image" />
        </Link>
        
        <nav className="registration-nav">
          <Link to="/" className="registration-nav-link">Home</Link>
          <Link to="/#competition" className="registration-nav-link">Competition</Link>
          <Link to="/#about" className="registration-nav-link">About ICEE</Link>
          <Link to="/#event" className="registration-nav-link">Event</Link>
          <Link to="/registration" className="registration-nav-link registration-btn">Registration →</Link>
        </nav>
      </div>
    </header>
  )
}

export default RegistrationHeader
