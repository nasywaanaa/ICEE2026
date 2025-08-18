import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  // Handle smooth scrolling to sections
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();

    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Adjust based on your header height
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'competition', 'event', 'past-event'];
      const scrollPosition = window.scrollY + 100; // Offset for header

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial active section

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <img src="/src/assets/Logo ICEE White.svg" alt="ICEE 2025" className="logo-image" />
        </div>
        <nav className="nav">
          <a 
            href="#home" 
            className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'home')}
          >
            Home
          </a>
          <a 
            href="#about" 
            className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'about')}
          >
            About ICEE
          </a>
          <a 
            href="#competition" 
            className={`nav-link ${activeSection === 'competition' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'competition')}
          >
            Competition
          </a>
          <a 
            href="#event" 
            className={`nav-link ${activeSection === 'event' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'event')}
          >
            Event
          </a>
          <Link 
            to="/registration" 
            className="nav-link registration-btn"
          >
            Registration →
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
