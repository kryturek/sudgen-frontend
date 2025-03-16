import React from 'react';
import HamburgerMenu from './HamburgerMenu';

export const Navbar = ({ 
  isDarkMode, 
  onDarkModeToggle, 
  onNewGame, 
  onAuthClick, 
  onLogout,  // Add this
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
      
      <div className="navbar-menu">
        <button onClick={onNewGame}>New Game</button>
        <button onClick={onSolve}>
          {isSolved ? 'Hide Solution' : 'Show Solution'}
        </button>
        <button onClick={onDarkModeToggle}>
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="navbar-end">
        {isAuthenticated ? (
          <>
            <span className="username">Hi, {username}!</span>
            <button className="auth-button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="auth-button" onClick={onAuthClick}>
            Login / Register
          </button>
        )}
        <HamburgerMenu
          isOpen={menuOpen}
          onToggle={() => setMenuOpen(!menuOpen)}
          onNewGame={onNewGame}
          onSolve={onSolve}
          onDarkModeToggle={onDarkModeToggle}
          onAuthClick={onAuthClick}
          onLogout={onLogout}  // Add this
          isDarkMode={isDarkMode}
          isAuthenticated={isAuthenticated}
          username={username}
        />
      </div>
    </nav>
  );
};
