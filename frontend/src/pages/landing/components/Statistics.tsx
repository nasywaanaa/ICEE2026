import React, { useState, useEffect, useRef } from 'react';
import './Statistics.css';

interface StatCardProps {
  number: number;
  label: string;
  isVisible: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, isVisible }) => {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    if (isVisible) {
      let startTime: number;
      const duration = 1000; 

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        setCurrentNumber(Math.floor(easeOutCubic * number));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, number]);

  return (
    <div className="stat-card">
      <div className="stat-number">
        {currentNumber.toLocaleString()}+
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const Statistics: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const statistics = [
    { number: 9000, label: 'Total Participants' },
    { number: 400, label: 'Group Participants' },
    { number: 1800, label: 'Workshop Participants' },
    { number: 1000, label: 'Expo Participants' },
    { number: 2000, label: 'Conference Participants' },
    { number: 1800, label: 'National Seminar Participants' },
  ];

  return (
    <section ref={sectionRef} className="statistics">
      <div className="container">
        <div className="stats-grid">
          {statistics.map((stat, index) => (
            <StatCard
              key={index}
              number={stat.number}
              label={stat.label}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
