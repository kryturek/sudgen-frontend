import React from 'react';

const HamburgerMenu = ({ 
  isOpen, 
  onToggle, 
  onNewGame, 
  onSolve, 
  onDarkModeToggle, 
  // onAuthClick,
  // onLogout,  // Add this
  isDarkMode,
  // isAuthenticated,
  // username 
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
          {/* {isAuthenticated ? (
            <>
              <div className="menu-user">
                <span>Hi, {username}!</span>
              </div>
              <button className="menu-item" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <button className="menu-item" onClick={onAuthClick}>
              Login / Register
            </button>
          )} */}
          
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
