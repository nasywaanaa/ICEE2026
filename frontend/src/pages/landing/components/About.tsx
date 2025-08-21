import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about">
      {/* Background decorative lines */}
      <div className="background-lines">
        <div className="blue-line line-1">
          <img 
            src="/assets/background/hero/blue-line-1.svg" 
            alt="ICEE 2026 Background Line 1"
            className="line-svg"
          />
        </div>
        <div className="blue-line line-2">
          <img 
            src="/assets/background/hero/blue-line-2.svg" 
            alt="ICEE 2026 Background Line 2"
            className="line-svg"
          />
        </div>
      </div>

      <div className="container">
        <div className="about-content">
          <div className="what-is-icee">
            <h2 className="section-title">
              What is <span className="icee-gradient">ICEE?</span>
            </h2>
            <p className="section-description">
              The ITB Civil Engineering Expo (ICEE) is an annual event organized by the <span className="highlight-link">Civil Engineering Student Association (HMS)</span> of ITB. It acts as a platform for collaboration, creativity, and innovation, encouraging students to grow through various activities related to current civil engineering challenges. ICEE features <span className="highlight-link">national competitions and international student conferences</span>, with a strong emphasis on learning, innovating, and making meaningful contributions. It serves as a gathering place for civil engineering enthusiasts to engage and offer solutions to future challenges.
            </p>
          </div>

          <div className="our-vision">
            <h2 className="section-title">
              Our <span className="vision-gradient">Vision?</span>
            </h2>
            <p className="section-description">
              Actualizing ICEE 2026 as an excellent <span className="highlight-link">platform for exploration</span> to utilize the roles and potential of its members as part of HMS ITB, and encouraging awareness among all participants involved to make an <span className="highlight-link">impact on society</span> through innovation and creativity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
