// import tambahan
import React, { useState, useEffect } from 'react'
import './PastEvent.css'
import './Event.css' // reuse styling modal
import { pastEventData } from '../data/past-event-data'

type PastEvent = {
  id: number
  title: string
  subtitle: string
  image: string
  // tambahkan/aktifkan ini di datanya:
  documentationImage?: string[]
}

export default function PastEvent() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<PastEvent | null>(null)

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % pastEventData.length)
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + pastEventData.length) % pastEventData.length)
  const goToSlide = (i: number) => setCurrentSlide(i)

  useEffect(() => {
    if (!isAutoPlaying) return
    const t = setInterval(nextSlide, 5000)
    return () => clearInterval(t)
  }, [isAutoPlaying, currentSlide])

  const handleOpenModal = (ev: PastEvent) => {
    setSelectedEvent(ev)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    document.body.style.overflow = 'unset'
  }

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onEsc)
    return () => {
      window.removeEventListener('keydown', onEsc)
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <section className="past-event" id="past-event">
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
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <button className="carousel-nav prev" onClick={prevSlide}>
            <img src="/assets/arrow-left-carousel.svg" alt="Previous" className="nav-arrow" />
          </button>

          <div className="carousel-container">
            <div className="carousel-slide-wrapper">
              {pastEventData.map((event, index) => (
                <div
                  key={event.id}
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
                  onClick={() => handleOpenModal(event)}
                >
                  <div className="slide-image">
                    <img
                      src={event.image}
                      alt={event.title}
                      onError={(e) => { e.currentTarget.src = `https://via.placeholder.com/1200x500?text=${encodeURIComponent(event.title)}` }}
                    />
                    <div className="slide-overlay">
                      <div className="slide-content">
                        {/* tidak tampilkan judul/subtitle di modal; boleh tetap di slide */}
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
            <img src="/assets/arrow-right-carousel.svg" alt="Next" className="nav-arrow" />
          </button>

          <div className="carousel-dots">
            {pastEventData.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: gambar saja */}
      {isModalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal-content images-only" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close">
              <svg className="close-icon" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="modal-header">
              <h3 className="modal-header-title">{selectedEvent.subtitle}</h3>
              {/* opsional: tampilkan kategori/subtitle jika mau */}
              {/* {selectedEvent.subtitle && (
                <p className="modal-header-subtitle">ICEE {selectedEvent.title}</p>
              )} */}
            </div>

            <div className="modal-images-grid">
              {(selectedEvent.documentationImage ?? [selectedEvent.image]).map((img, i) => (
                <div key={i} className="grid-item">
                  <img className="modal-image" src={img} alt={`doc-${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
