import { Achievement } from './achievements';
import { InventoryItem } from './items';
import { Quest } from './quests';
import { BattleStats, BattleHistoryEntry } from './game';
import { XPGain } from './progression';

/**
 * Core user data from users table
 */
export interface DBUser {
  id: uuid;
  username: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

/**
 * User profile data from profiles table
 */
export interface UserProfile {
  id: uuid;
  name: string;
  study_time?: number;
  xp: number;
  level: number;
  is_super_admin?: boolean;
  avatar?: string;
  title?: string;
  coins: number;
  streak: number;
  administrative_score?: number;
  criminal_score?: number;
  civil_score?: number;
  constitutional_score?: number;
  created_at: string;
  updated_at: string;
}

/**
 * User progress data from user_progress table
 */
export interface UserProgress {
  id: uuid;
  user_id: uuid;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  achievements: Achievement[];
  inventory: InventoryItem[];
  battle_stats: BattleStats;
  reward_multipliers: RewardMultipliers;
  streak_multiplier: number;
  recent_xp_gains: XPGain[];
  last_battle_time?: string;
  daily_battles: number;
  last_daily_reset?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Combined user interface for the game context
 * 
 * This interface aggregates data from multiple database tables:
 * - users: Core user data (id, username, email, full_name)
 * - profiles: User profile and game progress (level, xp, coins, subject_scores)
 * - user_progress: Game progression and stats
 * - battle_stats: Combat-related statistics
 * 
 * @see DBUser - Core user data
 * @see UserProfile - Profile-specific data
 * @see UserProgress - Game progression data
 */
export interface User {
  // Core user data
  id: uuid;
  username: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  roles: string[];
  title: string | null;
  
  // Game state
  health: number;
  max_health: number;
  active_effects: any[];
  quests: Quest[];
  
  // Profile data
  level: number;
  xp: number;
  coins: number;
  streak: number;
  last_active: string;
  study_time?: number;
  subject_scores?: {
    administrative: number;
    criminal: number;
    civil: number;
    constitutional: number;
  };
  
  // Battle data
  battle_stats: {
    wins: number;
    losses: number;
    total_battles: number;
    current_streak: number;
    highest_streak: number;
    battle_history: BattleHistoryEntry[];
    error?: string;
    error_code?: string;
  };
  
  // Progress data
  achievements: Achievement[];
  inventory: InventoryItem[];
  reward_multipliers: RewardMultipliers;
  streak_multiplier: number;
  recent_xp_gains: XPGain[];
  daily_battles: number;
  
  // Game statistics
  statistics: {
    quests_completed: number;
    battles_played: number;
    achievements_unlocked: number;
    items_collected: number;
    coins_earned: number;
    xp_gained: number;
    highest_streak?: number;
  };
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_battle_time?: string;
  last_daily_reset?: string;
}

export interface RewardMultipliers {
  xp: number;
  coins: number;
}

export type uuid = string;

/**
 * Role: User data structure that maps to the database schema
 * Tables:
 * - users: Core user data (id, username, email, full_name)
 * - profiles: User profile and scores
 * - user_progress: Game progress and stats
 * - subject_scores: Subject-specific scores
 * 
 * Features:
 * - Core user identification
 * - Profile management
 * - Progress tracking
 * - Battle statistics
 * - Achievement system
 * - Inventory management
 * - Subject scoring
 */
