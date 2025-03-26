import React from 'react';

const HamburgerMenu = ({ 
  isOpen, 
  onToggle, 
  onNewGame, 
  onSolve, 
  onDarkModeToggle, 
  isDarkMode
}) => {
  return (
    <div className="hamburger-container">
      <button className={`hamburger ${isOpen ? 'open' : ''}`} onClick={onToggle}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div className={`menu-overlay ${isOpen ? 'show' : ''}`} onClick={onToggle}>
        <div className="menu-content" onClick={e => e.stopPropagation()}>
          <button className="menu-item" onClick={onNewGame}>
            🍎 New Game
          </button>
          
          <button className="menu-item" onClick={onSolve}>
            ✅ Show Solution
          </button>
          
          <button className="menu-item" onClick={onDarkModeToggle}>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
