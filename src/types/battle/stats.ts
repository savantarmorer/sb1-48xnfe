export interface BattleStats {
  totalBattles: number;
  wins: number;
  losses: number;
  winStreak: number;
  highestStreak: number;
  totalXpEarned: number;
  totalCoinsEarned: number;
  averageScore: number;
  lastBattleDate?: string;
  battleHistory?: {
    date: string;
    result: 'victory' | 'defeat';
    score: number;
    opponent?: string;
  }[];
}

/**
 * Used by:
 * - User profile
 * - Statistics component
 * - Matchmaking system
 * - Achievement triggers
 */ 