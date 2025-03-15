import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onNewGame: () => void;
  onAuthClick: () => void;
  onSolve: () => void;  // Add this
  isSolved: boolean;     // Add this
}

export function Navbar({ 
  isDarkMode, 
  onDarkModeToggle, 
  onNewGame, 
  onAuthClick,
  onSolve,
  isSolved 
}: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Sudoku</h1>
      </div>
      <div className="navbar-menu">
        <button onClick={onNewGame}>New Game</button>
        <button onClick={onSolve}>{isSolved ? 'Unsolve' : 'Solve'}</button>
        <button onClick={onDarkModeToggle}>
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      <div className="navbar-end">
        {isAuthenticated ? (
          <>
            <span className="username">Welcome, {user?.username}!</span>
            <button className="auth-button" onClick={logout}>Logout</button>
          </>
        ) : (
          <button className="auth-button" onClick={onAuthClick}>Login</button>
        )}
      </div>
    </nav>
  );
}
