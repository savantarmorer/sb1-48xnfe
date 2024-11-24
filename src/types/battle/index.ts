export * from '../battle';

/**
 * Central export point for battle types
 * 
 * Purpose:
 * - Provides a single import point for all battle-related types
 * - Maintains backward compatibility
 * - Simplifies imports across the application
 * 
 * Exports:
 * - BattleStatus: Battle state enum
 * - BattleQuestion: Question structure
 * - BattleScore: Score tracking
 * - BattleState: Complete battle state
 * - BattleResults: Battle completion data
 * - BattleStats: Battle statistics
 * 
 * Used By:
 * - BattleContext
 * - GameContext
 * - Battle components
 * - Achievement system
 * 
 * Dependencies:
 * - battle.ts: Main type definitions
 * 
 * Migration Note:
 * Previously split types have been consolidated into battle.ts
 * This file now serves as a facade for those types
 */ 