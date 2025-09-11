
import '../styles/nav-bar.scss'; 
import React from 'react';


function NavBar({ menuOpen, setMenuOpen, onLogoClick }) {
  const handleToggle = () => setMenuOpen(prev => !prev);
  return (
    <nav className="nav-bar">
      <button className="nav-logo" onClick={() => onLogoClick && onLogoClick()} aria-label="Home">
        Kristina Driggs
      </button>
      {/* Menu Toggle Button */}
      <button
        className="menu-toggle-btn"
        aria-label="Toggle menu"
        onClick={handleToggle}
        title="Toggle menu"
      >
        {/* Inline SVG for menu toggle */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 122.6 95.45"
          width="40"
          height="32"
        >
          <rect className="toggleBackground" width="122.6" height="95.45" rx="10.85" ry="10.85"  />
          {/* Hamburger icon */}
          {!menuOpen && (
            <g id="hamburger">
              <line className="toggleStroke" x1="24.42" y1="20.58" x2="98.19" y2="20.58" strokeWidth="11" strokeLinecap="round" />
              <line className="toggleStroke" x1="24.42" y1="47.72" x2="98.19" y2="47.72"  strokeWidth="11" strokeLinecap="round" />
              <line className="toggleStroke" x1="24.42" y1="74.87" x2="98.19" y2="74.87"  strokeWidth="11" strokeLinecap="round" />
            </g>
          )}
          {/* X icon */}
          {menuOpen && (
            <g id="X">
              <line className="toggleStroke" x1="35.22" y1="21.64" x2="87.38" y2="73.81" strokeWidth="11" strokeLinecap="round" />
              <line className="toggleStroke" x1="35.22" y1="73.81" x2="87.38" y2="21.64" strokeWidth="11" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </button>
    </nav>
  );
}

export default NavBar;
