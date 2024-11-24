/**
 * XP gain interface for tracking experience points earned by users
 * Used to record and calculate experience points from various sources
 * such as battles, quests, and achievements
 */
export interface XPGain {
  amount: number;
  source: string;
  timestamp: string;
  multiplier: number;
  details?: {
    questId?: string;
    battleId?: string;
    achievementId?: string;
  };
}

/**
 * Progression-related types for tracking user advancement
 * through the game system
 */
export type ProgressionSource = 
  | 'battle'
  | 'quest'
  | 'achievement'
  | 'daily_reward'
  | 'streak_bonus'
  | 'admin_grant';
