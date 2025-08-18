import React, { useState, useEffect } from 'react'
import { pastEventData } from '../data/past-event-data'
import './PastEvent.css'

interface PastEvent {
  id: number
  title: string
  subtitle: string
  image: string
  description: string
}

const PastEvent: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % pastEventData.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + pastEventData.length) % pastEventData.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [currentSlide, isAutoPlaying])

  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  return (
    <section className="past-event" id="past-event">
      {/* Background decorative line */}
      <div className="background-lines">
        <div className="green-line line-5">
          <img 
            src="/assets/background/hero/green-line-5.svg" 
            alt="ICEE 2026 Background Line 5"
            className="line-svg"
          />
        </div>
      </div>
      
      <div className="container">
        <div className="past-event-header">
          <h2 className="past-event-title">
            Our <span className="past-event-gradient">Past Event</span>
          </h2>
          <p className="past-event-description">
            In 2025, we have exciting new offerings lined up for you. Get ready for innovative solutions and 
            exceptional experiences. We can't wait to share what's coming next!
          </p>
        </div>
        
        <div 
          className="past-event-carousel"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="carousel-nav prev" onClick={prevSlide}>
            <img 
              src="/assets/arrow-left-carousel.svg" 
              alt="Previous" 
              className="nav-arrow"
            />
          </button>
          
          <div className="carousel-container">
            <div className="carousel-slide-wrapper">
              {pastEventData.map((event, index) => (
                <div
                  key={event.id}
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  style={{
                    transform: `translateX(${(index - currentSlide) * 100}%)`,
                  }}
                >
                  <div className="slide-image">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      onError={(e) => {
                        console.log('Image failed to load:', event.image);
                        e.currentTarget.src = 'https://via.placeholder.com/1200x500/4a90e2/ffffff?text=' + event.title;
                      }}
                      onLoad={() => console.log('Image loaded:', event.image)}
                    />
                    <div className="slide-overlay">
                      <div className="slide-content">
                        <h3 className="slide-title">{event.title}</h3>
                        <p className="slide-subtitle">{event.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="carousel-nav next" onClick={nextSlide}>
            <img 
              src="/assets/arrow-right-carousel.svg" 
              alt="Next" 
              className="nav-arrow"
            />
          </button>
          
          <div className="carousel-dots">
            {pastEventData.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PastEvent
