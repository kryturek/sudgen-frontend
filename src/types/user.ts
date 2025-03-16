export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  gamesPlayed: number;
  gamesWon: number;
}

export interface SavedGame {
  id?: number;
  user_id?: number;
  puzzle: number[][];
  solution: number[][];
  pencil_marks: Record<string, number[]>;  // Changed from Set<number>
  difficulty: number;
  started_at: string;  // Changed from Date to string
  last_played: string; // Changed from Date to string
  completed: boolean;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  savedGames: SavedGame[];
}
