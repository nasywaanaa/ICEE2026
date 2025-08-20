import React, { useEffect } from 'react'
import { sponsorsData } from '../data/sponsors-data'
import './Sponsors.css'

interface Sponsor {
  id: number
  name: string
  logo: string
  type: 'sponsor' | 'media-partner'
  website?: string
}

const Sponsors: React.FC = () => {
  const handleSponsorClick = (sponsor: Sponsor) => {
    if (sponsor.website) {
      window.open(sponsor.website, '_blank')
    }
  }

  // Create duplicated array for infinite scroll effect
  const duplicatedSponsors = [...sponsorsData, ...sponsorsData]

  return (
    <section className="sponsors" id="sponsors">
      {/* Background decorative line */}
      <div className="background-lines">
        <div className="black-line line-6">
          <img 
            src="/assets/background/hero/black-line-6.svg" 
            alt="ICEE 2026 Background Line 6"
            className="line-svg"
          />
        </div>
      </div>
      
      <div className="container">
        <div className="sponsors-header">
          <h2 className="sponsors-title">
            Our <span className="sponsors-gradient">Sponsors & Media Partners</span>
          </h2>
          <p className="sponsors-description">
            ICEE 6 owes its success to the tremendous support of our amazing sponsors & media partners.
            They will be leading workshops, talking about job opportunities, giving away prizes, and offering much
            more throughout the event.
          </p>
        </div>
        
        <div className="sponsors-carousel">
          <div className="sponsors-track">
            {duplicatedSponsors.map((sponsor, index) => (
              <div
                key={`${sponsor.id}-${index}`}
                className={`sponsor-card ${sponsor.type}`}
                onClick={() => handleSponsorClick(sponsor)}
                style={{ cursor: sponsor.website ? 'pointer' : 'default' }}
              >
                <div className="sponsor-logo">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name}
                    onError={(e) => {
                      console.log('Sponsor logo failed to load:', sponsor.logo);
                      e.currentTarget.src = `https://via.placeholder.com/200x100/f0f0f0/999999?text=${sponsor.name}`;
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Sponsors
