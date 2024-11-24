import { BATTLE_CONFIG } from '../config/battleConfig';
import { BattleResults } from '../types/battle';
import { Reward } from '../types/rewards';
import { Quest } from '../types/quests';

export class RewardService {
  static calculateRewards(params: {
    type: 'quest' | 'battle' | 'achievement';
    data: any;
  }): Reward[] {
    switch (params.type) {
      case 'quest':
        return this.calculateQuestRewards(params.data);
      case 'battle':
        return this.calculateBattleRewards(params.data);
      case 'achievement':
        return this.calculateAchievementRewards(params.data);
      default:
        return [];
    }
  }

  private static calculateQuestRewards(quest: Quest): Reward[] {
    // Quest reward calculation logic
    return quest.rewards || [];
  }

  static calculateBattleRewards(results: BattleResults): Reward[] {
    const rewards: Reward[] = [];

    // XP Reward
    rewards.push({
      id: `battle_xp_${Date.now()}`,
      type: 'xp',
      value: results.experienceGained,
      rarity: results.isVictory ? 'rare' : 'common'
    });

    // Coins Reward
    rewards.push({
      id: `battle_coins_${Date.now()}`,
      type: 'coins',
      value: results.coinsEarned,
      rarity: 'common'
    });

    // Streak Bonus
    if (results.streakBonus > 0) {
      rewards.push({
        id: `streak_bonus_${Date.now()}`,
        type: 'xp',
        value: results.streakBonus,
        rarity: 'rare'
      });
    }

    // Time Bonus
    if (results.timeBonus > 0) {
      rewards.push({
        id: `time_bonus_${Date.now()}`,
        type: 'xp',
        value: results.timeBonus,
        rarity: 'common'
      });
    }

    return rewards;
  }
} 

