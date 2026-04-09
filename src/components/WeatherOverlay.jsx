import React, { useMemo } from 'react';
import '../styles/weather-overlay.css';

const WeatherOverlay = ({ season }) => {
  // Generate random values once so they don't jump on every re-render
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map(() => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 3}s`,
      animationDelay: `${Math.random() * 5}s`,
    }));
  }, []);

  if (season === 'jan-apr') {
    return (
      <div className="weather-overlay snow-overlay">
        {particles.slice(0, 50).map((style, i) => (
          <div key={i} className="snowflake" style={style}></div>
        ))}
      </div>
    );
  }

  if (season === 'sep-dec') {
    return (
      <div className="weather-overlay rain-overlay">
        {particles.map((style, i) => (
          <div key={i} className="raindrop" style={{
            left: style.left,
            animationDuration: `${Math.random() * 0.5 + 0.5}s`,
            animationDelay: `${Math.random() * 2}s`
          }}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="weather-overlay sun-overlay">
      {particles.slice(0, 40).map((style, i) => (
        <div key={i} className="dust-mote" style={style}></div>
      ))}
    </div>
  );
};

export default WeatherOverlay;
