import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  // teks berulang untuk mengisi pita
  const REPEAT = ('ICEE 2026     ').repeat(12);

  const handleLearnMore = () => {
    // Scroll to About section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegisterNow = () => {
    // Navigate to registration page
    navigate('/registration');
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
              Integrating Strategies for Long-Term Infrastructure Resilience
              <span className="quote-mark">"</span>
            </h1>
            <div className="hero-description">
              <p>
                ICEE ITB 2025 carries the theme <span className="theme-highlight">"Integrating Strategies for Long-Term Infrastructure Resilience"</span> to address major challenges in modern infrastructure development. Climate change and frequent natural disasters underscore the need for infrastructure that is not only durable but also adaptable to extreme conditions. Rapid population growth urbanization further emphasize the importance of reliable and sustainable infrastructure.
              </p>
            </div>
            <div className="hero-actions">
              <button className="cta-button primary" onClick={handleLearnMore}>Learn More</button>
              <button className="cta-button secondary" onClick={handleRegisterNow}>Register Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
