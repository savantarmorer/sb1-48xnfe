import type { BattleQuestion, BattleScore } from '../battle';

export type BattleStatus = 'searching' | 'ready' | 'battle' | 'completed';

export interface BattleState {
  status: BattleStatus;
  inProgress: boolean;
  startTime?: string;
  endTime?: string;
  currentOpponent?: string;
  winStreak: number;
  totalBattles: number;
  questions: BattleQuestion[];
  currentQuestion: number;
  score: BattleScore;
  timePerQuestion: number;
  playerAnswers: boolean[];
  timeLeft?: number;
  streakBonus?: number;
}

/**
 * Dependencies:
 * - BattleQuestion from battle.ts
 * - BattleScore from battle.ts
 * 
 * Used By:
 * - BattleContext
 * - GameContext
 * - Battle components
 * 
 * Features:
 * - Complete battle state definition
 * - Type-safe status enum
 * - Comprehensive state tracking
 * 
 * Scalability:
 * - Easy to extend
 * - Clear dependencies
 * - Modular design
 */ 