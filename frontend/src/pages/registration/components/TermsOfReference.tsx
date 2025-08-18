import React, { useState } from 'react';
import './TermsOfReference.css';

interface TermsOfReferenceProps {
  isAccepted: boolean;
  onAccept: (accepted: boolean) => void;
  selectedCompetition: string;
  onCompetitionChange: (competition: string) => void;
}

const competitionOptions = {
  'CETC': 'Download ToR Civil Engineering Tender Competition',
  'IBDC': 'Download ToR Innovative Bridge Design Competition', 
  'GECC': 'Download ToR Geotechnical Engineering Case Competition',
  'ITEC': 'Download ToR Innovative Transportation Engineering Competition'
};

const TermsOfReference: React.FC<TermsOfReferenceProps> = ({ isAccepted, onAccept, selectedCompetition, onCompetitionChange }) => {
  const handleCompetitionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCompetitionChange(e.target.value);
  };

  return (
    <div className="tor-content">
 
      <div className="tor-title">
        Please check Terms of Reference
        <br />
        Competition through the file below:
      </div>

      <div className="tor-dropdown">
        <select value={selectedCompetition} onChange={handleCompetitionChange}>
          <option value="" disabled>
            Choose Your Competition
          </option>
          <option value="CETC">CETC (Civil Engineering Tender Competition)</option>
          <option value="IBDC">IBDC (Innovative Bridge Design Competition)</option>
          <option value="GECC">GECC (Geotechnical Engineering Case Competition)</option>
          <option value="ITEC">ITEC (Innovative Transportation Engineering Competition)</option>
        </select>
      </div>

      {selectedCompetition && (
        <div className="tor-file-section">
 
          <button className="tor-download-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="7,10 12,15 17,10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="15"
                x2="12"
                y2="3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="tor-file-text">
              {competitionOptions[selectedCompetition as keyof typeof competitionOptions]}
            </div>
          </button>
        </div>
      )}

      <label className="tor-checkbox">
        <input
          type="checkbox"
          checked={isAccepted}
          onChange={(e) => onAccept(e.target.checked)}
        />
        <span className="tor-checkbox-box" />
        <span className="tor-checkbox-text">
          I have read and agree to the Terms of Reference for the {selectedCompetition ? selectedCompetition : 'Selected Competition'}
        </span>
      </label>
    </div>
  );
};

export default TermsOfReference;
