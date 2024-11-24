/**
 * Battle status enum
 * Represents different states of a battle
 */
export enum BattleStatus {
  SEARCHING = 'searching',
  READY = 'ready',
  IN_BATTLE = 'battle',
  COMPLETED = 'completed'
}

/**
 * Question interface
 * Represents a battle question with answers
 */
export interface BattleQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  category?: string;
  difficulty?: number;
  timeLimit?: number;
}

/**
 * Battle score interface
 * Tracks scores for both players
 */
export interface BattleScore {
  player: number;
  opponent: number;
}

/**
 * Battle rewards interface
 * Represents rewards earned from a battle
 */
export interface BattleRewards {
  xp: number;
  coins: number;
  streakBonus?: number;
  timeBonus?: number;
  achievements?: string[];
}

/**
 * Battle state interface
 * Represents the current state of a battle
 */
export interface BattleState {
  status: BattleStatus;
  inProgress: boolean;
  questions: BattleQuestion[];
  currentQuestion: number;
  score: BattleScore;
  timeLeft: number;
  timePerQuestion: number;
  playerAnswers: boolean[];
  currentOpponent?: string;
  opponentRating?: number;
  rewards?: BattleRewards;
}

/**
 * Battle results interface
 * Contains final battle results and rewards
 */
export interface BattleResults {
  isVictory: boolean;
  score: number;
  playerScore: number;
  xp: number;
  coins: number;
  streakBonus: number;
  timeBonus: number;
  totalScore: number;
  totalQuestions: number;
  scorePercentage: number;
  opponent: {
    id: string;
    name: string;
    rating: number;
  };
  rewards: {
    items: any[];
    achievements: string[];
    bonuses: Array<{
      type: string;
      amount: number;
    }>;
  };
}

/**
 * Battle statistics interface
 * Tracks overall battle performance
 */
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
 * Dependencies:
 * - None (self-contained type system)
 * 
 * Used By:
 * - BattleContext
 * - GameContext
 * - BattleService
 * - Battle components
 * 
 * Features:
 * - Complete battle state tracking
 * - Score management
 * - Statistics tracking
 * - Achievement integration
 * 
 * Scalability:
 * - Easy to extend states
 * - Flexible question format
 * - Configurable scoring
 * - Comprehensive statistics
 */ 

export interface InitializeBattlePayload {
  questions: BattleQuestion[];
  timePerQuestion: number;
  timeLeft?: number;
}
