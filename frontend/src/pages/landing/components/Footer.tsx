import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();

    if (sectionId === 'map') {
      console.log('Map clicked');
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      const headerHeight = 80;
      window.scrollTo({ top: el.offsetTop - headerHeight, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      {/* Row 1 — centered nav */}
      <div className="footer-container">
        <nav className="footer-top">
          <a href="#home" className="footer-nav-link" onClick={(e) => handleNavClick(e, 'home')}>
            Home
          </a>
          <a href="#map" className="footer-nav-link" onClick={(e) => handleNavClick(e, 'map')}>
            Map
          </a>
                     <Link
             to="/registration"
             className="footer-nav-link"
           >
             Registration
           </Link>
        </nav>
      </div>

      {/* Gradient line */}
      <div className="footer-divider" />

      {/* Row 2 — left logo & copy, right socials */}
      <div className="footer-container">
        <div className="footer-bottom">
          <div className="footer-left">
            <img
              src="/src/assets/Logo ICEE White.svg"
              alt="ICEE 2025"
              className="footer-logo-image"
            />
            <p className="footer-copy">© ITB Civil Engineering Expo 2025. All rights reserved.</p>
          </div>

          <div className="footer-right">
            <a href="#" className="social-icon" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 3.675c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zM19.406 6.98a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433A2.06 2.06 0 1 1 7.4 5.368a2.06 2.06 0 0 1-2.063 2.065zM7.119 20.452H3.555V9h3.564v11.452z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="YouTube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
