export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type RewardType = 'xp' | 'coins' | 'item' | 'lootbox';
export interface Reward {
  id: string;
  type: 'xp' | 'coins' | 'item' | 'lootbox';
  value: number | string;
  rarity: RewardRarity;
  contents?: Reward[];
  metadata?: {
    source?: string;
    streakLevel?: number;
    [key: string]: any;
  };
}

export function isNumericReward(reward: Reward): boolean {
  return reward.type === 'xp' || reward.type === 'coins';
} 

