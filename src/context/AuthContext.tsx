import React, { createContext, useContext } from 'react';

// Simplified interface without user auth
interface AuthContextType {
  isAuthenticated: boolean;
  user: null;
  savedGames: never[];
  login: () => Promise<void>;
  register: () => Promise<void>;
  logout: () => void;
  saveGame: () => Promise<void>;
  loadGame: () => Promise<null>;
}

// Create a simple context without actual auth
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  savedGames: [],
  login: async () => {},
  register: async () => {},
  logout: () => {},
  saveGame: async () => {},
  loadGame: async () => null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Provide a dummy auth context that always returns not authenticated
  const authValue = {
    isAuthenticated: false,
    user: null,
    savedGames: [],
    login: async () => {
      console.log('Auth functionality has been removed');
    },
    register: async () => {
      console.log('Auth functionality has been removed');
    },
    logout: () => {
      console.log('Auth functionality has been removed');
    },
    saveGame: async () => {
      console.log('Remote game saving has been removed');
    },
    loadGame: async () => {
      console.log('Remote game loading has been removed');
      return null;
    }
  };

  return (
    <AuthContext.Provider value={authValue}>
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
