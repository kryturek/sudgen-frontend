import React from 'react';
import HamburgerMenu from './HamburgerMenu';

export const Navbar = ({ 
  isDarkMode, 
  onDarkModeToggle, 
  onNewGame, 
  onSolve,
  menuOpen,
  setMenuOpen
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Sudgen</h1>
      </div>
      
      <HamburgerMenu
        isOpen={menuOpen}
        onToggle={() => setMenuOpen(!menuOpen)}
        onNewGame={onNewGame}
        onSolve={onSolve}
        onDarkModeToggle={onDarkModeToggle}
        isDarkMode={isDarkMode}
      />
    </nav>
  );
};
