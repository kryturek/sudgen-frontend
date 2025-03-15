export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  gamesPlayed: number;
  gamesWon: number;
}

export interface SavedGame {
  id: string;
  puzzle: number[][];
  solution: number[][];
  pencilMarks: Record<string, Set<number>>;
  difficulty: number;
  startedAt: Date;
  lastPlayed: Date;
  completed: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  savedGames: SavedGame[];
}
