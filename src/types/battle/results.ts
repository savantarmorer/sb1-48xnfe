export interface BattleResults {
  isVictory: boolean;
  experienceGained: number;
  coinsEarned: number;
  streakBonus: number;
  totalScore: number;
  rewards?: {
    items?: string[];
    achievements?: string[];
    bonuses?: {
      type: string;
      amount: number;
    }[];
  };
}

/**
 * Used by:
 * - BattleService.calculateResults
 * - BattleContext.endBattle
 * - GameReducer END_BATTLE action
 * 
 * Dependencies:
 * - Achievement system
 * - Reward system
 * - Battle scoring system
 */ 