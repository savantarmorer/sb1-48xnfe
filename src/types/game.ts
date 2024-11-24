import type { Quest, QuestStatus, QuestCategory, UserQuest, QuestProgressUpdate, QuestType, QuestRequirement } from './quests';
import type { Achievement } from './achievements';
import type { User } from './user';
import type { 
  Item, 
  GameItem, 
  InventoryItem,
  ItemType,
  ItemRarity,
  ItemEffect
} from './items';
import type { LeaderboardEntry } from './leaderboard';
import type { BattleStatus } from './battle';
import type { ProgressionSource } from './progression';

// Re-export item types for backward compatibility
export type { 
  Item,
  GameItem,
  InventoryItem,
  ItemType,
  ItemRarity,
  ItemEffect
};

// Re-export quest types
export type {
  Quest,
  QuestStatus,
  QuestCategory,
  UserQuest,
  QuestProgressUpdate,
  QuestRequirement,
  QuestType
};

// Re-export user type for convenience
export type { User } from './user';

// Re-export types for convenience
export type { 
  ProgressionSource
};

// Re-export LeaderboardEntry interface
export type { LeaderboardEntry } from './leaderboard';

// Re-export Achievement interface
export type { Achievement } from './achievements';

// Export enum values so they are used
export { QuestStatus, QuestCategory } from './quests';

/**
 * Activity type for tracking user actions
 */
export interface ActivityEntry {
  id: string;
  userId?: string;
  type: 'battle' | 'quest' | 'achievement' | 'purchase' | 'login' | 'xp_gain';
  details: {
    action?: string;
    result?: string;
    metadata?: {
      amount?: number;
      source?: string;
      multiplier?: number;
      [key: string]: any;
    };
  };
  timestamp: string;
}

/**
 * Game statistics interface
 */
export interface GameStatistics {
  battlesWon: number;
  questionsAnswered: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  totalCoins: number;
  questsCompleted: number;
  activeUsers: number;
  completedQuests: number;
  totalStudyTime: number;
  studySessions: {
    date: string;
    duration: number;
  }[];
  recentActivity: {
    type: string;
    timestamp: string;
    details: Record<string, unknown>;
  }[];
}

/**
 * Battle question interface - matches battle_questions table
 */
export interface BattleQuestion {
  id: string;
  question: string;
  answers: string[];
  correct_answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

/**
 * Battle state interface
 */
export interface BattleState {
  status: BattleStatus;
  in_progress: boolean;
  questions: BattleQuestion[];
  current_question: number;
  score: {
    player: number;
    opponent: number;
  };
  time_left: number;
  time_per_question: number;
  player_answers: boolean[];
  start_time?: string;
  end_time?: string;
  difficulty?: number;
  rewards?: BattleRewards;
}

/**
 * Battle results interface
 */
export interface BattleResults {
  winner: string;
  playerScore: number;
  opponentScore: number;
  rewards: BattleRewards;
  questionsAnswered: number;
  accuracy: number;
  timeBonus: number;
  experienceGained: number;
}

/**
 * Battle statistics interface
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
  battleHistory: BattleHistoryEntry[];
}

/**
 * Battle rewards interface
 */
export interface BattleRewards {
  xp: number;
  coins: number;
  streakBonus?: number;
  timeBonus?: number;
  achievements?: string[];
}

/**
 * Battle history entry interface - matches battle_history table
 */
export interface BattleHistoryEntry {
  id: string;
  user_id: string;
  opponent_id?: string;
  winner_id?: string;
  score_player: number;
  score_opponent: number;
  xp_earned: number;
  coins_earned: number;
  streak_bonus?: number;
  created_at: string;
}

/**
 * Quest progress interface
 */
export interface QuestProgress {
  questId: string;
  userId: string;
  requirements: {
    type: QuestType;
    current: number;
    target: number;
  }[];
  startedAt: string;
  lastUpdated: string;
}

/**
 * Game-specific inventory item interface
 * Extends the base inventory item with game-specific properties
 */
export interface GameInventoryItem extends GameItem {
  acquiredAt: string;
  isActive: boolean;
}

/**
 * Achievement reward interface
 */
export interface AchievementReward {
  type: 'xp' | 'coins' | 'item' | 'title';
  amount: number;
  itemId?: string;
  title?: string;
}

/**
 * Level data interface for tracking user progression
 * Contains all necessary information about a user's level status
 */
export interface LevelData {
  /** Current level number */
  level: number;
  /** XP needed to reach next level */
  xpForNextLevel: number;
  /** Progress percentage to next level (0-100) */
  progress: number;
  /** Total accumulated XP */
  totalXP: number;
  /** Whether user has reached maximum level */
  isMaxLevel: boolean;
}

/**
 * Game state interface
 */
export interface GameState {
  user: User;
  battle: BattleState;
  quests: Quest[];
  completedQuests: string[];
  achievements: Achievement[];
  recentXPGains: XPGain[];
  loading: boolean;
  error: string | null;
  currentLevelRewards?: {
    xp: number;
    coins: number;
    items?: InventoryItem[];
  };
}

/**
 * XP gain interface for tracking experience points earned
 */
export interface XPGain {
  amount: number;
  source: 'battle' | 'quest' | 'achievement' | 'daily_bonus' | 'study_session';
  timestamp: string;
  multiplier?: number;
  details?: {
    battle_id?: string;
    quest_id?: string;
    achievement_id?: string;
    [key: string]: any;
  };
}

/**
 * Game action types
 */
export interface GameAction {
  type: 
    | 'SET_LOADING'
    | 'SET_ERROR'
    | 'INITIALIZE_USER'
    | 'UPDATE_USER_PROFILE'
    | 'ADD_XP'
    | 'ADD_COINS'
    | 'UNLOCK_ACHIEVEMENT'
    | 'UPDATE_ACHIEVEMENT_PROGRESS'
    | 'INITIALIZE_BATTLE'
    | 'ANSWER_QUESTION'
    | 'END_BATTLE'
    | 'UPDATE_GAME_STATE'
    | 'LEVEL_UP'
    | 'SYNC_STATISTICS'
    | 'UPDATE_STREAK_MULTIPLIER'
    | 'COMPLETE_QUEST'
    | 'PURCHASE_ITEM'
    | 'UPDATE_ACHIEVEMENT'
    | 'CHECK_ACHIEVEMENTS'
    | 'SET_BATTLE_ERROR'
    | 'UPDATE_SUBJECT_SCORE'
    | 'ADD_BATTLE_HISTORY'
    | 'ADD_ACTIVITY'
    | 'UPDATE_LEADERBOARD'
    | 'UPDATE_QUESTS'
    | 'UPDATE_STATISTICS'
    | 'UPDATE_INVENTORY'
    | 'UPDATE_REWARD_MULTIPLIER'
    | 'REMOVE_EFFECT'
    | 'RESET_BATTLE';
  payload?: 
    | boolean  // SET_LOADING
    | string  // SET_ERROR
    | User  // INITIALIZE_USER
    | Partial<User>  // UPDATE_USER_PROFILE
    | XPGain  // ADD_XP
    | { amount: number; source: string }  // ADD_COINS
    | Achievement  // UNLOCK_ACHIEVEMENT, UPDATE_ACHIEVEMENT
    | { achievementId: string; progress: number }  // UPDATE_ACHIEVEMENT_PROGRESS
    | { questions: BattleQuestion[]; timePerQuestion: number; difficulty?: number }  // INITIALIZE_BATTLE
    | { isCorrect: boolean; timeSpent: number; answer: number }  // ANSWER_QUESTION
    | { victory: boolean; rewards: BattleRewards; stats: Partial<BattleStats> }  // END_BATTLE
    | Partial<GameState>  // UPDATE_GAME_STATE
    | { level: number; rewards: { xp: number; coins: number; items: InventoryItem[] } }  // LEVEL_UP
    | GameStatistics  // SYNC_STATISTICS
    | { quest: Quest; rewards: { xp: number; coins: number; items?: InventoryItem[] } }  // COMPLETE_QUEST
    | { item: InventoryItem; cost: number }  // PURCHASE_ITEM
    | { message: string; code?: string }  // SET_BATTLE_ERROR
    | { subject: string; score: number }  // UPDATE_SUBJECT_SCORE
    | BattleHistoryEntry  // ADD_BATTLE_HISTORY
    | ActivityEntry  // ADD_ACTIVITY
    | LeaderboardEntry[]  // UPDATE_LEADERBOARD
    | { active: Quest[]; completed: Quest[] }  // UPDATE_QUESTS
    | Partial<GameStatistics>  // UPDATE_STATISTICS
    | InventoryItem[]  // UPDATE_INVENTORY
    | { type: 'xp' | 'coins'; value: number }  // UPDATE_REWARD_MULTIPLIER
    | { effectId: string; effectType: 'xp' | 'coins' | 'health' };  // REMOVE_EFFECT
}