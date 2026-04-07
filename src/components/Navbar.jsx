import React from 'react';
import { useEvents } from '../context/EventContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { themePreference, toggleTheme } = useEvents();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">📅</span>
        <h1>Lumina Map Wall Calendar</h1>
      </div>
      <div className="navbar-actions">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {themePreference === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
