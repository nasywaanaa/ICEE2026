import React from 'react'

interface EventCardProps {
  imageUrl: string
  name: string
  handleLearnMoreModal: (e: React.MouseEvent<Element, MouseEvent>) => void
}

const EventCard: React.FC<EventCardProps> = ({ imageUrl, name, handleLearnMoreModal }) => {
  return (
    <div className="event-card">
      <div className="event-card-content">
        <div className="event-card-header">
          <h3 className="event-card-name">{name}</h3>
          <div className="event-card-icon">
            <img 
              src={imageUrl} 
              alt={name} 
              className="event-icon-image"
              onError={(e) => {
                console.log('Event icon failed to load:', imageUrl)
                e.currentTarget.src = `https://via.placeholder.com/120x120/4a90e2/ffffff?text=${name}`
              }}
            />
          </div>
        </div>

        <button className="event-card-button" onClick={handleLearnMoreModal}>
          <span className="button-text">Learn More</span>
          <div className="button-arrow">
            <img 
              src="/src/assets/arrow-right.svg" 
              alt="arrow-right" 
              className="arrow-icon"
            />
          </div>
        </button>
      </div>
    </div>
  )
}

export default EventCard
