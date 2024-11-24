import { useGame } from '../contexts/GameContext';
import { Achievement } from '../types/achievements';

/**
 * Hook for managing achievements and progress
 */
export function useAchievements() {
  const { state, checkAchievements } = useGame();

  return {
    achievements: state.achievements,
    hasAchievement: (id: string) => state.achievements.some(a => a.id === id && a.unlocked),
    totalPoints: state.achievements.reduce((sum, a) => sum + (a.unlocked ? a.points : 0), 0),
    getProgress: (id: string) => state.achievements.find(a => a.id === id)?.progress || 0,
    checkAchievements
  };
}

/**
 * Hook Dependencies:
 * - useGame: For accessing and modifying game state
 * - Achievement types: For type definitions
 * 
 * State Management:
 * - Uses GameContext for achievement state
 * - Handles progress updates and unlocks
 * 
 * Used By:
 * - AchievementSystem component
 * - QuestSystem component
 * - RewardSystem component
 * 
 * Features:
 * - Achievement progress tracking
 * - Points calculation
 * - Automatic achievement checking
 * 
 * Scalability Considerations:
 * - Type safety throughout
 */
