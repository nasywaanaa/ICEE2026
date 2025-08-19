import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Competition.css';

interface CompetitionData {
  id: string;
  title: string;
  description: string;
  image: string;
}

const Competition: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const competitions: CompetitionData[] = [
    {
      id: 'IBDC',
      title: 'IBDC',
      description: 'Leverage advanced data analytics and cutting-edge SHMS to design a bridge that thinks ahead—detecting potential risks early, optimizing maintenance, and ensuring unmatched safety, durability, and sustainability!',
      image: '/assets/bridge-competition.svg'
    },
    {
      id: 'CETC',
      title: 'CETC',
      description: 'Prepare a forward-thinking and competitive tender proposal for a vital construction project, featuring breakthrough safety (K3) innovations that protect workers, boost efficiency, and redefine workplace safety standards!',
              image: '/assets/tender.svg'
    },
    {
      id: 'ITEC',
      title: 'ITEC',
      description: 'Shape an innovation to transform urban mobility—harnessing data-driven innovation and real-time digital insights to create smarter, more connected, and sustainable transportation systems!',
              image: '/assets/innovation.svg'
    },
    {
      id: 'GECC',
      title: 'GECC',
      description: 'Solve real-world geotechnical challenges by applying data-driven geotechnics in modern monitoring systems—enabling faster decisions, proactive maintenance, and long-term safety!',
              image: '/assets/geo.svg'
    }
  ];

  const handleRegister = (competitionId: string) => {
    // Navigate to registration page with the selected competition
    navigate(`/registration?competition=${competitionId}`);
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === competitions.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? competitions.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const currentCompetition = competitions[currentIndex];

  return (
    <section className="competition" id="competition">
      {/* Background decorative line */}
      <div className="background-lines">
        <div className="black-line line-3">
          <img 
            src="/assets/background/hero/black-line-3.svg" 
            alt="ICEE 2026 Background Line 3"
            className="line-svg"
          />
        </div>
      </div>
      
      <div className="container">
        <div className="competition-header">
          <h2 className="competition-title">
            Our <span className="competition-gradient">Competition</span>
          </h2>
          <p className="competition-description">
            In 2025, we have exciting new offerings lined up for you. Get ready for innovative solutions and 
            exceptional experiences. We can't wait to share what's coming next!
          </p>
        </div>

        <div className="competition-carousel">
          <div className="carousel-container">
            {competitions.map((competition, index) => {
              let position = index - currentIndex;
              
              if (position > 2) position -= competitions.length;
              if (position < -2) position += competitions.length;
              
              let translateX = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 1;
              let blur = 0;
              let pointerEvents: 'auto' | 'none' = 'auto';
              
              // Check if we're on mobile (you can adjust this breakpoint)
              const isMobile = windowWidth <= 1053;
              const isSmallMobile = windowWidth <= 768;
              
              if (position === 0) {
                translateX = 0;
                scale = 1;
                opacity = 1;
                zIndex = 10;
                pointerEvents = 'auto';
              } else if (position === -1 && !isMobile) {
                // Left preview card - only show on desktop
                translateX = -400;
                scale = 0.8;
                opacity = 0.6;
                zIndex = 5;
                pointerEvents = 'none';
              } else if (position === 1 && !isMobile) {
                // Right preview card - only show on desktop
                translateX = 400;
                scale = 0.8;
                opacity = 0.6;
                zIndex = 5;
                pointerEvents = 'none';
              } else {
                // Hidden cards
                translateX = position < 0 ? -800 : 800;
                scale = 0.6;
                opacity = 0;
                zIndex = 1;
                pointerEvents = 'none';
              }
              
              // Calculate card dimensions for responsive positioning
              let cardWidth, cardHeight;
              if (windowWidth <= 480) {
                // Very small mobile screens
                cardWidth = 260;
                cardHeight = 320;
              } else if (isSmallMobile) {
                // Small mobile screens
                cardWidth = 280;
                cardHeight = 350;
              } else if (isMobile) {
                // Medium mobile screens
                cardWidth = 320;
                cardHeight = 400;
              } else {
                // Desktop screens
                cardWidth = 500;
                cardHeight = 500;
              }
              
              return (
                <div
                  key={competition.id}
                  className="competition-card"
                  style={{
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    opacity: opacity,
                    zIndex: zIndex,
                    pointerEvents: pointerEvents,
                    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginLeft: `-${cardWidth / 2}px`,
                    marginTop: `-${cardHeight / 2}px`
                  }}
                  onClick={() => {
                    if (position !== 0) {
                      // If clicking on an inactive card, navigate to it
                      goToSlide(index);
                    }
                  }}
                >
                  {/* Blur overlay for inactive cards */}
                  {position !== 0 && (
                    <div className="card-blur-overlay"></div>
                  )}
                  
                  <div className="card-background">
                    <div className="card-illustration">
                      {competition.id === 'IBDC' && (
                        <img 
                          src="/assets/bridge-competition.svg" 
                          alt="Bridge Competition" 
                          className="competition-svg"
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                      )}
                      
                      {competition.id === 'CETC' && (
                        <img 
                          src="/assets/tender.svg" 
                          alt="Civil Engineering Tender Competition" 
                          className="competition-svg"
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                      )}
                      
                      {competition.id === 'ITEC' && (
                        <img 
                          src="/assets/innovation.svg" 
                          alt="Engineering Innovation Competition" 
                          className="competition-svg"
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                      )}
                      
                      {competition.id === 'GECC' && (
                        <img 
                          src="/assets/geo.svg" 
                          alt="Geotechnical Engineering Case Competition" 
                          className="competition-svg"
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                      )}
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{competition.title}</h3>
                      <p className="card-description">{competition.description}</p>
                      <button className="register-btn" onClick={() => handleRegister(competition.id)}>
                        Register <span className="arrow">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation arrows */}
          <button className="carousel-nav prev" onClick={prevSlide}>
            <img 
              src="/assets/arrow-left-carousel.svg" 
              alt="Previous" 
              className="nav-arrow"
            />
          </button>
          <button className="carousel-nav next" onClick={nextSlide}>
            <img 
              src="/assets/arrow-right-carousel.svg" 
              alt="Next" 
              className="nav-arrow"
            />
          </button>

          {/* Dots indicator
          <div className="carousel-dots">
            {competitions.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Competition;
