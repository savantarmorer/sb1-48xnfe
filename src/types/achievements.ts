/* eslint-disable no-unused-vars */
import { LucideIcon } from 'lucide-react';

/**
 * Achievement trigger types
 * Defines all possible triggers for achievements
 */
export type AchievementTriggerType = 
  | 'battle_won'
  | 'questions_answered'
  | 'correct_answers'
  | 'streak_reached'
  | 'xp_reached'
  | 'coins_earned'
  | 'items_collected'
  | 'quests_completed'
  | 'achievements_unlocked'
  | 'time_played'
  | 'battles_played'
  | 'perfect_battles'
  | 'daily_logins'
  | 'items_purchased'
  | 'items_used'
  | 'study_time'
  | 'score'
  | 'reward_rarity'
  | 'battle_score'    
  | 'battle_wins'
  | 'battle_streak'
  | 'battle_rating';

/**
 * Achievement trigger configuration
 */
export interface AchievementTrigger {
  type: AchievementTriggerType;
  value: number;
  comparison: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
  metadata?: {
    scoreType?: string;
    battleType?: string;
    [key: string]: any;
  };
}

/**
 * Achievement category types
 */
export type AchievementCategory = 
  | 'battle' 
  | 'quest' 
  | 'learning' 
  | 'social' 
  | 'collection'
  | 'rewards';

/**
 * Achievement reward structure
 */
export interface AchievementReward {
  type: 'xp' | 'coins' | 'item' | 'title';
  amount: number;
  itemId?: string;
  title?: string;
}

/**
 * Achievement progress tracking
 */
export interface AchievementProgress {
  current: number;
  target: number;
  lastUpdated: string;
}

/**
 * Achievement interface
 * Matches achievements table schema and includes runtime tracking fields
 */
export interface Achievement {
  // Database fields
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  prerequisites: string[];
  order?: number;
  triggerConditions: AchievementTrigger[];
  rewards?: AchievementReward[];
  
  // Runtime fields
  progress?: number;
  icon?: string;
  iconColor?: string;
}

/**
 * Achievement as stored in user_achievements table
 */
export interface UserAchievement {
  achievementId: string;
  userId: string;
  progress: number;
  unlockedAt?: string;
}

/**
 * Achievement update payload
 */
export interface AchievementUpdatePayload {
  achievementId: string;
  progress: number;
  metadata?: Record<string, any>;
}

/**
 * Role: Achievement type definitions and tracking
 * 
 * Dependencies:
 * - LucideIcon for UI integration
 * 
 * Used By:
 * - GameContext
 * - Achievement components
 * - Battle system
 * - Quest system
 * 
 * Features:
 * - Comprehensive achievement tracking
 * - Progress monitoring
 * - Reward management
 * - Category organization
 * - Prerequisite system
 * 
 * Integration Points:
 * - Battle system for combat achievements
 * - Quest system for learning achievements
 * - Profile system for social achievements
 * - Inventory system for collection achievements
 */
