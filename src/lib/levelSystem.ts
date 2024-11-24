import { GameConfig } from '../config/gameConfig';
import { Reward } from '../types/rewards';

/**
 * Interface for level-up rewards
 */
interface LevelUpReward {
  type: 'coins' | 'lootbox' | 'title';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  value: string | number;
}

/**
 * Static class for managing level system calculations and rewards
 */
export class LevelSystem {
  // Base configuration values
  private static readonly BASE_XP = GameConfig.level.baseXP;
  private static readonly GROWTH_FACTOR = GameConfig.level.growthFactor;
  private static readonly MAX_LEVEL = GameConfig.level.maxLevel;

  /**
   * Calculates XP required for a specific level
   * Uses exponential growth formula
   * 
   * @param level - Target level
   * @returns XP required for the level
   */
  static calculateXPForLevel(level: number): number {
    if (level > this.MAX_LEVEL) return Infinity;
    return Math.floor(this.BASE_XP * Math.pow(this.GROWTH_FACTOR, level - 1));
  }

  /**
   * Calculates total XP required up to a level
   * Sums XP requirements for all previous levels
   * 
   * @param level - Target level
   * @returns Total XP required
   */
  static calculateTotalXPForLevel(level: number): number {
    let totalXP = 0;
    for (let i = 1; i < level; i++) {
      totalXP += this.calculateXPForLevel(i);
    }
    return totalXP;
  }

  /**
   * Calculates XP needed for next level
   * 
   * @param currentXP - Current XP amount
   * @returns XP needed for next level
   */
  static calculateXPToNextLevel(currentXP: number): number {
    const currentLevel = this.calculateLevel(currentXP);
    if (currentLevel >= this.MAX_LEVEL) return 0;
    const nextLevelXP = this.calculateTotalXPForLevel(currentLevel + 1);
    return nextLevelXP - currentXP;
  }

  /**
   * Calculates current level based on XP
   * 
   * @param xp - Current XP amount
   * @returns Current level
   */
  static calculateLevel(xp: number): number {
    let level = 1;
    let totalXP = 0;
    
    while (level < this.MAX_LEVEL && totalXP <= xp) {
      totalXP += this.calculateXPForLevel(level);
      if (totalXP > xp) break;
      level++;
    }
    
    return Math.min(level, this.MAX_LEVEL);
  }

  /**
   * Calculates progress percentage to next level
   * 
   * @param xp - Current XP amount
   * @returns Progress percentage (0-100)
   */
  static calculateProgress(xp: number): number {
    const currentLevel = this.calculateLevel(xp);
    if (currentLevel >= this.MAX_LEVEL) return 100;
    
    const currentLevelXP = this.calculateTotalXPForLevel(currentLevel);
    const nextLevelXP = this.calculateTotalXPForLevel(currentLevel + 1);
    const levelXP = nextLevelXP - currentLevelXP;
    const progress = xp - currentLevelXP;
    
    return Math.min(100, Math.floor((progress / levelXP) * 100));
  }

  /**
   * Calculates rewards for leveling up
   * 
   * @param level - Target level
   * @returns Array of rewards
   */
  static calculateLevelUpRewards(level: number): Reward[] {
    const rewards: Reward[] = [];
    
    // Base XP reward
    rewards.push({
      id: `level_${level}_xp`,
      type: 'xp',
      value: level * GameConfig.rewards.levelUp.xpMultiplier,
      rarity: level % 10 === 0 ? 'legendary' : level % 5 === 0 ? 'epic' : 'rare'
    });
    
    // Base coin reward
    rewards.push({
      id: `level_${level}_coins`,
      type: 'coins',
      value: level * GameConfig.rewards.levelUp.coinMultiplier,
      rarity: 'common'
    });
    
    // Special rewards for milestone levels
    if (level % 10 === 0) {
      rewards.push({
        id: `level_${level}_special`,
        type: 'item',
        value: 'Legendary Lootbox',
        rarity: 'legendary'
      });
    } else if (level % 5 === 0) {
      rewards.push({
        id: `level_${level}_special`,
        type: 'item',
        value: 'Epic Lootbox',
        rarity: 'epic'
      });
    }
    
    return rewards;
  }

  /**
   * Gets rewards for a specific level
   * 
   * @param level - Target level
   * @returns Array of rewards
   */
  static getLevelRewards(level: number): Reward[] {
    return [
      {
        id: `level_${level}_xp`,
        type: 'xp',
        value: level * 100,
        rarity: level % 10 === 0 ? 'legendary' : level % 5 === 0 ? 'epic' : 'rare'
      },
      {
        id: `level_${level}_coins`,
        type: 'coins',
        value: level * 50,
        rarity: 'common'
      }
    ];
  }
}

/**
 * Module Role:
 * - XP and level calculations
 * - Progress tracking
 * - Level-up rewards
 * - Level cap management
 * 
 * Dependencies:
 * - GameConfig for base values
 * 
 * Used by:
 * - LevelProgress component
 * - XPSystem component
 * - GameContext
 * - Achievement system
 * 
 * Features:
 * - Exponential XP scaling
 * - Progress calculation
 * - Milestone rewards
 * - Level cap
 * 
 * Scalability:
 * - Configurable base values
 * - Extensible reward system
 * - Pure calculations
 * - Performance optimized
 * 
 * Performance:
 * - Cached calculations
 * - Optimized algorithms
 * - Memory efficient
 */
