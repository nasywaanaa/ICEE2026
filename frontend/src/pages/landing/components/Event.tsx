import React, { useState, useEffect } from 'react'
import EventCard from './EventCard'
import { eventData } from '../data/event-data'
import './Event.css'

interface Event {
  id: number
  name: string
  description: string
  image: string
  documentationImage: string[]
}

const Event: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % eventData.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + eventData.length) % eventData.length)
  }

  const handleCardClick = (index: number) => {
    setCurrentSlide(index)
  }

  const handleLearnMoreModal = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEvent(event)
    setIsModalOpen(true)
    setCurrentImageIndex(0)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedEvent) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedEvent.documentationImage.length)
    }
  }

  // const prevImage = () => {
  //   if (selectedEvent) {
  //     setCurrentImageIndex((prev) => (prev - 1 + selectedEvent.documentationImage.length) % selectedEvent.documentationImage.length)
  //   }
  // }

  const handleRegister = () => {
    if (selectedEvent?.name === "Workshop") {
      window.open("https://bit.ly/RegistrationSTRIDE", "_blank")
    } else if (selectedEvent?.name === "Seminar") {
      // Add seminar registration logic here
      console.log("Seminar registration")
    }
  }

  // Auto-advance image slideshow in modal
  useEffect(() => {
    if (!isModalOpen || !selectedEvent) return

    const interval = setInterval(() => {
      nextImage()
    }, 3000)

    return () => clearInterval(interval)
  }, [isModalOpen, selectedEvent, currentImageIndex])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isModalOpen])

  return (
    <section className="event" id="event">
      <div className="container">
        <div className="event-header">
          <h2 className="event-title">
            Our <span className="event-gradient">Event</span>
          </h2>
          <p className="event-description">
            In 2025, we have exciting new offerings lined up for you. Get ready for
            innovative solutions and exceptional experiences. We can't wait to
            share what's coming next!
          </p>
        </div>

        <div className="event-carousel">
          <button className="carousel-nav prev" onClick={prevSlide}>
            <img 
              src="/src/assets/arrow-left-carousel.svg" 
              alt="Previous" 
              className="nav-arrow"
            />
          </button>

          <div className="event-cards-container">
            {eventData.map((event, index) => {
              const position = (index - currentSlide + eventData.length) % eventData.length
              const isCenter = position === 0
              const isVisible = position <= 2

              if (!isVisible) return null

              return (
                <div
                  key={event.id}
                  className={`event-card-wrapper ${isCenter ? 'center' : ''}`}
                  style={{
                    transform: `translateX(${(position - 1) * 100}%)`,
                    opacity: isCenter ? 1 : 0.6,
                    scale: isCenter ? 1 : 0.8,
                    zIndex: isCenter ? 10 : 5,
                  }}
                  onClick={() => !isCenter && handleCardClick(index)}
                >
                  <EventCard
                    imageUrl={event.image}
                    name={event.name}
                    handleLearnMoreModal={(e: React.MouseEvent) => handleLearnMoreModal(event, e)}
                  />
                </div>
              )
            })}
          </div>

          <button className="carousel-nav next" onClick={nextSlide}>
            <img 
              src="/src/assets/arrow-right-carousel.svg" 
              alt="Next" 
              className="nav-arrow"
            />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <img
                src="/src/assets/arrow-left-carousel.svg"
                alt="Close"
                className="close-icon"
              />
            </button>

            <div className="modal-body">
              <div className="modal-images">
                <div className="image-carousel">
                  {selectedEvent.documentationImage.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedEvent.name} ${index + 1}`}
                      className={`modal-image ${index === currentImageIndex ? 'active' : ''}`}
                      onError={(e) => {
                        console.log('Image failed to load:', image)
                        e.currentTarget.src = `https://via.placeholder.com/600x400/4a90e2/ffffff?text=${selectedEvent.name}`
                      }}
                    />
                  ))}
                </div>
                
                <div className="image-dots">
                  {selectedEvent.documentationImage.map((_, index) => (
                    <button
                      key={index}
                      className={`image-dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-info">
                <h3 className="modal-title">{selectedEvent.name}</h3>
                {(selectedEvent.name === "Workshop" || selectedEvent.name === "ICEETalks") && (
                  <span className="exclusive-badge">Exclusive</span>
                )}
                <p className="modal-description">{selectedEvent.description}</p>
                <button className="register-button" onClick={handleRegister}>
                  {selectedEvent.name === "Workshop" || selectedEvent.name === "Seminar"
                    ? "Register Now"
                    : "Coming Soon"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Event