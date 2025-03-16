import React from 'react';
import HamburgerMenu from './HamburgerMenu';

export const Navbar = ({ 
  isDarkMode, 
  onDarkModeToggle, 
  onNewGame, 
  onAuthClick, 
  onLogout,
  onSolve,
  isSolved,
  isAuthenticated,
  username,
  menuOpen,
  setMenuOpen
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Sudoku</h1>
      </div>
      
      <HamburgerMenu
        isOpen={menuOpen}
        onToggle={() => setMenuOpen(!menuOpen)}
        onNewGame={onNewGame}
        onSolve={onSolve}
        onDarkModeToggle={onDarkModeToggle}
        onAuthClick={onAuthClick}
        onLogout={onLogout}
        isDarkMode={isDarkMode}
        isAuthenticated={isAuthenticated}
        username={username}
      />
    </nav>
  );
};
