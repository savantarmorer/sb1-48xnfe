export const LEVEL_CONFIG = {
  baseXP: 1000,
  scalingFactor: 1.5, // Each level requires 1.5x more XP than the previous
  maxLevel: 100,
  bonusPerLevel: 100,
};

export const XP_MULTIPLIERS = {
  streak: {
    3: 1.2,  // 3 day streak = 20% bonus
    7: 1.5,  // 7 day streak = 50% bonus
    14: 1.8, // 14 day streak = 80% bonus
    30: 2.0  // 30 day streak = 100% bonus
  },
  critical: {
    chance: 0.2,    // 20% chance for critical XP
    multiplier: 2.0 // 2x XP on critical
  }
};

export const QUEST_REWARDS = {
  daily: {
    xp: { min: 50, max: 150 },
    coins: { min: 25, max: 75 }
  },
  weekly: {
    xp: { min: 300, max: 500 },
    coins: { min: 150, max: 250 }
  },
  epic: {
    xp: { min: 1000, max: 2000 },
    coins: { min: 500, max: 1000 }
  }
};