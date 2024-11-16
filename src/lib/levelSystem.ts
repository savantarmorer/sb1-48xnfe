import { LEVEL_CONFIG } from './gameConfig';
import { User } from '../types';

export class LevelSystem {
  static calculateXPForLevel(level: number): number {
    return Math.floor(LEVEL_CONFIG.baseXP * Math.pow(LEVEL_CONFIG.scalingFactor, level - 1));
  }

  static calculateTotalXPForLevel(level: number): number {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += this.calculateXPForLevel(i);
    }
    return total;
  }

  static calculateLevel(xp: number): number {
    let level = 1;
    let totalXP = 0;
    
    while (level < LEVEL_CONFIG.maxLevel) {
      const nextLevelXP = this.calculateXPForLevel(level);
      if (totalXP + nextLevelXP > xp) break;
      totalXP += nextLevelXP;
      level++;
    }
    
    return Math.min(level, LEVEL_CONFIG.maxLevel);
  }

  static calculateProgress(xp: number): number {
    const currentLevel = this.calculateLevel(xp);
    const totalXPForCurrentLevel = this.calculateTotalXPForLevel(currentLevel);
    const xpInCurrentLevel = xp - totalXPForCurrentLevel;
    const xpNeededForNextLevel = this.calculateXPForLevel(currentLevel);
    
    return (xpInCurrentLevel / xpNeededForNextLevel) * 100;
  }

  static calculateXPToNextLevel(xp: number): number {
    const currentLevel = this.calculateLevel(xp);
    const totalXPForCurrentLevel = this.calculateTotalXPForLevel(currentLevel);
    const xpInCurrentLevel = xp - totalXPForCurrentLevel;
    const xpNeededForNextLevel = this.calculateXPForLevel(currentLevel);
    
    return xpNeededForNextLevel - xpInCurrentLevel;
  }

  static getLevelUpRewards(level: number): {
    coins: number;
    items: Array<{
      type: string;
      rarity: 'common' | 'rare' | 'epic' | 'legendary';
      value: string;
    }>;
  } {
    const rewards = {
      coins: LEVEL_CONFIG.bonusPerLevel * level,
      items: []
    };

    // Base rewards for every level
    rewards.items.push({
      type: 'xp',
      rarity: 'common',
      value: '100'
    });

    // Special rewards based on level milestones
    if (level % 5 === 0) {
      rewards.items.push({
        type: 'title',
        rarity: 'rare',
        value: `Level ${level} Master`
      });
    }

    if (level % 10 === 0) {
      rewards.items.push({
        type: 'item',
        rarity: 'epic',
        value: 'Premium Study Material'
      });
    }

    if (level % 25 === 0) {
      rewards.items.push({
        type: 'item',
        rarity: 'legendary',
        value: 'Exclusive Title: Legal Legend'
      });
    }

    return rewards;
  }

  static handleLevelUp(user: User, oldLevel: number, newLevel: number) {
    const rewards = [];
    
    for (let level = oldLevel + 1; level <= newLevel; level++) {
      rewards.push(this.getLevelUpRewards(level));
    }
    
    return rewards;
  }
}