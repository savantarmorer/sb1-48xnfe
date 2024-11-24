import { GameItem, User } from './index';
import { Quest } from './quests';
import { Reward } from './rewards';
import { Achievement } from './achievements';
import { 
  BattleResults, 
  BattleStatus, 
  BattleQuestion, 
  BattleScore,
  BattleState 
} from './battle';

/**
 * All possible game actions
 * Used by GameContext reducer
 */
export type { BattleState };
export type GameAction =
  // XP and Currency Actions
  | { type: 'ADD_XP'; payload: number }
  | { type: 'ADD_COINS'; payload: number }
  
  // Streak Management
  | { type: 'INCREMENT_STREAK' }
  | { type: 'RESET_STREAK' }
  
  // Achievement System
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'UPDATE_ACHIEVEMENT_PROGRESS'; payload: { id: string; progress: number } }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: Achievement }
  | { type: 'REMOVE_ACHIEVEMENT'; payload: string }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  
  // Quest System
  | { type: 'COMPLETE_QUEST'; payload: string }
  | { type: 'ADD_QUEST'; payload: Quest }
  | { type: 'UPDATE_QUEST'; payload: Quest }
  | { type: 'REMOVE_QUEST'; payload: string }
  | { type: 'SET_QUESTS'; payload: Quest[] }
  | { type: 'SYNC_QUEST_PROGRESS'; payload: { questId: string; progress: number } }
  
  // Battle System Actions
  | { type: "START_BATTLE"; payload: string }
  | { type: 'INITIALIZE_BATTLE'; payload: { questions: BattleQuestion[]; timePerQuestion: number } }
  | { type: 'SET_BATTLE_STATUS'; payload: BattleStatus }
  | { type: 'SET_BATTLE_QUESTIONS'; payload: BattleQuestion[] }
  | { 
      type: 'UPDATE_BATTLE_PROGRESS'; 
      payload: { 
        questionId: string; 
        correct: boolean;
        playerAnswers: boolean[];
        score: BattleScore;
      }
    }
  | { type: 'ADVANCE_QUESTION'; payload: number }
  | { type: 'END_BATTLE'; payload: BattleResults }
  | { type: 'UPDATE_BATTLE_STATUS'; payload: BattleStatus }
  
  // Item Management
  | { type: 'ADD_ITEM'; payload: GameItem }
  | { type: 'UPDATE_ITEM'; payload: GameItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'SYNC_ITEMS'; payload: GameItem[] }
  | { type: 'ADD_TO_INVENTORY'; payload: { item: GameItem } }
  | { type: 'REMOVE_FROM_INVENTORY'; payload: { itemId: string } }
  | { type: 'EQUIP_ITEM'; payload: { itemId: string } }
  | { type: 'UNEQUIP_ITEM'; payload: { itemId: string } }
  
  // User Management
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<User> }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_USER_ROLE'; payload: string[] }
  
  // Rewards and Notifications
  | { type: 'CLAIM_REWARD'; payload: Reward }
  | { type: 'ADD_REWARD'; payload: { reward: Reward; contents: Reward[] } }
  | { type: 'SHOW_NOTIFICATION'; payload: {
      type: 'achievement' | 'quest' | 'reward' | 'error' | 'success';
      message: Achievement | Quest | Reward | string;
    }}
  | { type: 'CLEAR_NOTIFICATION' }
  
  // System and Admin
  | { type: 'SYNC_STATISTICS'; payload: { 
      activeUsers: number; 
      completedQuests: number; 
      purchasedItems: number; 
      lastUpdated: string;
    }}
  | { type: 'RECORD_LOGIN'; payload: string }
  | { type: 'SET_LAST_LOGIN'; payload: string }
  | { type: 'UPDATE_REWARD_MULTIPLIERS'; payload: Record<string, number> }
  | { type: 'SYNC_START' }
  | { type: 'SYNC_SUCCESS'; payload: { user: Partial<User> } }
  | { type: 'SYNC_ERROR' }
  | { type: 'UPDATE_STREAK_MULTIPLIER' }
  | { type: 'TOGGLE_DEBUG_MODE' }
  | { type: 'DISMISS_LEVEL_UP_REWARD' }
  | { type: 'LEVEL_UP'; payload: { newLevel: number; rewards: Reward[] } };

/**
 * Dependencies:
 * - Battle types from battle.ts
 * - User types from user.ts
 * - Quest types from quests.ts
 * - Reward types from rewards.ts
 * - Achievement types from achievements.ts
 * 
 * Used By:
 * - GameContext reducer
 * - Action creators
 * - Game state management
 * 
 * Features:
 * - Type-safe action definitions
 * - Comprehensive game actions
 * - Organized by feature
 * - Clear payload types
 * 
 * Scalability:
 * - Easy to add new actions
 * - Grouped by functionality
 * - Maintainable structure
 * - Clear dependencies
 */

