/* eslint-disable no-unused-vars */
import type { GameItem } from './items';

/**
 * Available quest types - defines the frequency and nature of quests
 */
export enum QuestType {
  DAILY = 'daily',    // Resets daily
  WEEKLY = 'weekly',  // Resets weekly
  STORY = 'story',    // One-time story quests
  EVENT = 'event',    // Special event quests
  ACHIEVEMENT = 'achievement' // Achievement-linked quests
}

/**
 * Quest status - tracks the current state of a quest
 */
export enum QuestStatus {
  AVAILABLE = 'available',    // Quest can be started
  IN_PROGRESS = 'in_progress', // Quest is currently active
  COMPLETED = 'completed',    // Quest has been completed
  FAILED = 'failed',         // Quest failed (e.g., time limit)
  EXPIRED = 'expired',       // Quest is no longer available
  LOCKED = 'locked'          // Quest requirements not met
}

/**
 * Quest category - organizes quests by their focus area
 */
export enum QuestCategory {
  GENERAL = 'general',     // General gameplay
  STUDY = 'study',        // Study-related activities
  BATTLE = 'battle',      // PvP activities
  SOCIAL = 'social',      // Community interaction
  SPECIAL = 'special',    // Special events
  ACHIEVEMENT = 'achievement', // Achievement-linked quests
  STREAK = 'streak',      // Streak-based quests
  COLLECTION = 'collection' // Collection-based quests
}

/**
 * Quest requirement interface - matches quest_requirements table
 */
export interface QuestRequirement {
  id: string;
  quest_id: string;
  type: string;
  requirement_value: {
    target: number;
    current?: number;
  };
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Core Quest interface - matches quests table
 */
export interface Quest {
  id: string;
  title: string;
  description?: string;
  type: QuestType;
  category?: string;
  status?: QuestStatus;
  requirements: QuestRequirement[];
  xp_reward: number;
  coin_reward: number;
  progress?: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  display_order: number;
  order: number;
}

/**
 * User Quest Progress - matches user_quests table
 */
export interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  status: QuestStatus;
  progress: number;
  created_at?: Date;
  updated_at?: Date;
  completed_at?: Date;
}

/**
 * Quest Progress Update - for tracking changes
 */
export interface QuestProgressUpdate {
  questId: string;
  requirementType: string;
  progress: number;
  timestamp: Date;
}

/**
 * Dependencies:
 * - GameContext: Uses these types for state management
 * - QuestManager: Uses these types for database operations
 * - UI Components: Use these types for display
 * 
 * Database Tables:
 * - quests: Core quest definitions
 * - quest_requirements: Individual quest requirements
 * - user_quests: User progress on quests
 * 
 * Related Systems:
 * - Achievement System
 * - Progress Tracking
 * - Reward System
 */

export const isQuestComplete = (quest: Quest, userQuest: UserQuest): boolean => {
  return userQuest.status === QuestStatus.COMPLETED;
};

export const calculateQuestProgress = (quest: Quest, requirements: QuestRequirement[]): number => {
  if (!requirements.length) return 0;
  
  // Calculate progress based on quest requirements
  const totalRequirements = requirements.length;
  const completedRequirements = requirements.filter(req => 
    req.requirement_value.current >= req.requirement_value.target
  ).length;
  
  return Math.floor((completedRequirements / totalRequirements) * 100);
};

/**
 * Utility Functions:
 * - isQuestComplete: Checks quest completion status
 * - calculateQuestProgress: Computes overall progress
 * 
 * Database Integration:
 * - All types align with database schema
 * - Supports real-time updates
 * - Maintains data consistency
 */
