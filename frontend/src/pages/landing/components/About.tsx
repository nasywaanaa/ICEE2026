import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about">
      {/* Background decorative lines */}
      <div className="background-lines">
        <div className="blue-line line-1">
          <img 
            src="/src/assets/background/hero/blue-line-1.svg" 
            alt="ICEE 2026 Background Line 1"
            className="line-svg"
          />
        </div>
        <div className="blue-line line-2">
          <img 
            src="/src/assets/background/hero/blue-line-2.svg" 
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
              The ITB Civil Engineering Expo (ICEE) is an annual event organized by the Civil Engineering 
              Student Association (HMS) of ITB. It serves as a platform for collaboration, innovation, and 
              creativity for students, helping them to develop themselves through various activities integrated 
              with the civil engineering issues addressed. Presented as a <span className="highlight-link">national competition</span> and even an 
              international student <span className="highlight-link">conference</span>, ICEE focuses on <span className="highlight-link">learning, innovating</span>, and <span className="highlight-link">contributing</span>. It is a 
              platform for civil engineering activists and a solution to address future challenges.
            </p>
          </div>

          <div className="our-vision">
            <h2 className="section-title">
              Our <span className="vision-gradient">Vision?</span>
            </h2>
            <p className="section-description">
              The ITB Civil Engineering Expo (ICEE) is an annual event organized by the Civil Engineering Student 
              Association (HMS) of ITB. It serves as a platform for collaboration, innovation, and creativity for students, 
              helping them to develop themselves through various activities integrated with the civil engineering issues 
              addressed. Presented as a <span className="highlight-link">national competition</span> and even an international student <span className="highlight-link">conference</span>, ICEE focuses 
              on <span className="highlight-link">learning, innovating</span>, and <span className="highlight-link">contributing</span>. It is a platform for civil engineering activists and a solution to 
              address future challenges.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
