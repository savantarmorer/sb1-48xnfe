export interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  streak: number;
  coins: number;
  achievements: Achievement[];
  inventory: InventoryItem[];
  backpack?: InventoryItem[];
  roles?: string[];
  title?: string;
  avatar?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  deadline: Date;
  type: 'daily' | 'weekly' | 'epic';
  requirements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'booster' | 'material' | 'cosmetic';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  uses?: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  rank: number;
  avatar: string;
}