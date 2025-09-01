import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  // teks berulang untuk mengisi pita
  // const REPEAT = ('ICEE 2026     ').repeat(12);
  const [showRegisterOptions, setShowRegisterOptions] = React.useState(false);

  const handleLearnMore = () => {
    // Scroll to About section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegisterNow = () => {
    // Toggle dropdown for HMS / Non-HMS choice
    setShowRegisterOptions(prev => !prev);
  };

  const handleChoose = (type: 'HMS' | 'NON_HMS') => {
    setShowRegisterOptions(false);
    if (type === 'HMS') navigate('/connecth-hms');
    else navigate('/connecth');
  };

  return (
    <section className="hero" id="home">
      {/* Ribbons background */}
      <div className="hero-ribbons" aria-hidden="true">
        <div className="ribbon ribbon-blue rb1">
          <span className="ribbon-text" data-label=" ICEE 2026 ">{(' ICEE 2026 ').repeat(80)}</span>
        </div>
        <div className="ribbon ribbon-green rb2">
          <span className="ribbon-text" data-label=" ICEE 2026 ">{(' ICEE 2026 ').repeat(80)}</span>
        </div>
        <div className="ribbon ribbon-dark rb3">
          <span className="ribbon-text" data-label=" ICEE 2026 ">{(' ICEE 2026 ').repeat(80)}</span>
        </div>
        <div className="ribbon ribbon-blue rb4">
          <span className="ribbon-text" data-label=" ICEE 2026 ">{(' ICEE 2026 ').repeat(80)}</span>
        </div>
        <div className="ribbon ribbon-dark rb5">
          <span className="ribbon-text" data-label=" ICEE 2026 ">{(' ICEE 2026 ').repeat(80)}</span>
        </div>
        <div className="ribbon ribbon-green rb6">
          <span className="ribbon-text" data-label=" ICEE 2026 ">{(' ICEE 2026 ').repeat(80)}</span>
        </div>
      </div>


      {/* Content */}
      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="quote-mark">"</span>
                Smart Structure Smarter Future: Forging the Next Era of Infrastructure Through Digital Transformation
              <span className="quote-mark">"</span>
            </h1>
            <div className="hero-description">
              <p>
                Step into 2026 and discover the future of civil engineering through innovation and digital transformation! Be inspired by smarter solutions, creative breakthroughs, and impactful experiences. ICEE 2026 carries the theme <span className="theme-highlight">“Smart Structure Smarter Future”</span> to highlight the urgency of building infrastructure that is not only sustainable and resilient, but also digitally intelligent. With BIM, AI, and IoT, the next generation of infrastructure will be more adaptive, efficient, and future-ready.
              </p>
            </div>
            <div className="hero-actions">
              <button className="cta-button primary" onClick={handleLearnMore}>Learn More</button>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button className="cta-button secondary" onClick={handleRegisterNow}>Register Now ▾</button>
                {showRegisterOptions && (
                  <div style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 180, zIndex: 20 }}>
                    <button onClick={() => handleChoose('HMS')} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Gabarito, sans-serif', color: '#2d3748', fontSize: '14px', fontWeight: '600' }}>HMS</button>
                    <div style={{ height: 1, background: '#edf2f7' }}></div>
                    <button onClick={() => handleChoose('NON_HMS')} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Gabarito, sans-serif', color: '#2d3748', fontSize: '14px', fontWeight: '600' }}>Non-HMS</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
