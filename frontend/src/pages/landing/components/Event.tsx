import React, { useState } from "react";
import { eventData } from "../data/event-data";
import "./Event.css";

interface EventItem {
  id: number;
  name: string;
  description: string;
  image: string;
  documentationImage: string[];
}

const Events: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const handleLearnMoreModal = (event: EventItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % eventData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + eventData.length) % eventData.length);
  };

  const getCardPosition = (index: number) => {
    const totalCards = eventData.length;
    const adjustedIndex = (index - currentIndex + totalCards) % totalCards;
    
    if (adjustedIndex === 0) return 'center';
    if (adjustedIndex === 1) return 'right';
    if (adjustedIndex === totalCards - 1) return 'left';
    return 'hidden';
  };

  return (
    <section className="event" id="event">
      {/* Background decorative line */}
      <div className="background-lines">
        <div className="blue-line line-7">
          <img 
            src="/assets/background/hero/blue-line-4.svg" 
            alt="ICEE 2026 Background Line 7"
            className="line-svg"
          />
        </div>
      </div>
      
      <div className="event-header">
        <h2 className="event-title">
          Our <span className="event-gradient">Events</span>
        </h2>
        <p className="event-description">
          Discover our exciting lineup of events designed to inspire, educate, and connect the engineering community.
        </p>
      </div>

      <div className="event-carousel">
        <div className="event-cards-container">
          {eventData.map((event, index) => {
            const position = getCardPosition(index);
            return (
              <div
                key={event.id}
                className={`event-card-wrapper ${position}`}
                style={{
                  transform: position === 'center' 
                    ? 'translateX(0) scale(1)' 
                    : position === 'left' 
                    ? 'translateX(-120%) scale(0.8)' 
                    : position === 'right' 
                    ? 'translateX(120%) scale(0.8)' 
                    : 'translateX(0) scale(0.6)',
                  opacity: position === 'hidden' ? 0 : 1,
                  zIndex: position === 'center' ? 10 : 5,
                }}
              >
                <div className="event-card">
                  <div className="event-card-content">
                    <div className="event-card-header">
                      <h3 className="event-card-name">{event.name}</h3>
                      <div className="event-card-icon">
                        <img 
                          src={event.image} 
                          alt={event.name}
                          className="event-icon-image"
                        />
                      </div>
                    </div>
                    <button 
                      className="event-card-button"
                      onClick={(e) => handleLearnMoreModal(event, e)}
                      disabled
                    >
                      <span className="button-text">Learn More</span>
                      <div className="button-arrow">
                        <svg className="arrow-icon" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="carousel-nav prev" onClick={prevSlide}>
          <svg className="nav-arrow" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button className="carousel-nav next" onClick={nextSlide}>
          <svg className="nav-arrow" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {isModalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <svg className="close-icon" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="modal-body">
              {/* LEFT: text + actions */}
              <div className="modal-info">
                <h3 className="modal-title">
                  <span className="modal-title-blue">ICEE&nbsp;</span>
                  <span className="modal-title-green">National Conference</span>
                </h3>

                <p className="modal-description">
                  ICEE National Student Conference 2024 is a civil engineering issue discussion forum that
                  involving many field of study on its discussion, so that the issue can be seen from wider
                  point of view. The output from this conference is a conclusion of the issue's solution
                  in form of memorandum that agreed by all participants.
                </p>

                <div className="modal-actions">
                  <button className="modal-button back-button" onClick={closeModal} aria-label="Back">
                    <svg className="button-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <button className="modal-button register-button">
                    <span>Register</span>
                    <span className="register-dot" aria-hidden>
                      <svg viewBox="0 0 24 24">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* RIGHT: stacked images */}
              <div className="modal-images">
                <div className="image-stack">
                  <div className="stacked-image">
                    <img className="modal-image" src="/images/conf-1.jpg" alt="Conference 1"/>
                  </div>
                  <div className="stacked-image">
                    <img className="modal-image" src="/images/conf-2.jpg" alt="Conference 2"/>
                  </div>
                  <div className="stacked-image">
                    <img className="modal-image" src="/images/conf-3.jpg" alt="Conference 3"/>
                  </div>
                </div>

                {/* dotted rail purely decorative like the screenshot */}
                <div className="image-rail-dots" aria-hidden />
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default Events;
