import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, SavedGame } from '../types/user';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  saveGame: (game: Omit<SavedGame, 'id'>) => Promise<void>;
  loadGame: (gameId: string) => Promise<SavedGame>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    savedGames: []
  });

  useEffect(() => {
    // Check for existing session
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/session', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          savedGames: data.savedGames
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    setAuthState({
      user: data.user,
      isAuthenticated: true,
      savedGames: data.savedGames
    });
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    await login(email, password);
  };

  const logout = async () => {
    await fetch('http://localhost:8000/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setAuthState({ user: null, isAuthenticated: false, savedGames: [] });
  };

  const saveGame = async (game: Omit<SavedGame, 'id'>) => {
    const response = await fetch('http://localhost:8000/games/save', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game)
    });

    if (!response.ok) {
      throw new Error('Failed to save game');
    }

    const savedGame = await response.json();
    setAuthState(prev => ({
      ...prev,
      savedGames: [...prev.savedGames, savedGame]
    }));
  };

  const loadGame = async (gameId: string) => {
    const response = await fetch(`http://localhost:8000/games/${gameId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to load game');
    }

    return response.json();
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      saveGame,
      loadGame
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
