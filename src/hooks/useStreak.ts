import { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { format } from 'date-fns';
import { Achievement, AchievementTrigger } from '../types/achievements';
import { supabase } from '../lib/supabase';

/**
 * Type for streak-specific trigger conditions
 * Extends base AchievementTrigger with streak-specific types
 */
type StreakTriggerType = 'streak' | 'login_days';

/**
 * Interface for streak-specific achievement triggers
 * Matches the base AchievementTrigger structure
 */
interface StreakTrigger {
  type: StreakTriggerType;
  value: number;
  comparison: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
}

/**
 * Creates a standard Achievement object from streak data
 * Ensures type compatibility with Achievement interface
 */
function createStreakAchievement(
  id: string,
  title: string,
  description: string,
  points: number,
  triggerCondition: StreakTrigger
): Achievement {
  return {
    id,
    title,
    description,
    category: 'streaks',
    points,
    rarity: 'common',
    unlocked: true,
    unlockedAt: new Date(),
    prerequisites: [],
    dependents: [],
    triggerConditions: [{
      type: triggerCondition.type as AchievementTrigger['type'],
      value: triggerCondition.value,
      comparison: triggerCondition.comparison
    }],
    order: 10
  };
}

/**
 * Hook for managing user streaks and related achievements
 */
export function useStreak() {
  const { state, dispatch } = useGame();

  const handleStreakUpdate = async (isVictory: boolean) => {
    const newStreak = isVictory ? state.user.streak + 1 : 0;
    
    // Update streak in database
    try {
      const { error } = await supabase
        .from('user_progress')
        .update({
          streak: newStreak,
          highest_streak: Math.max(state.user.highestStreak || 0, newStreak),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', state.user.id);

      if (error) throw error;

      // Update local state
      dispatch({
        type: 'UPDATE_STREAK',
        payload: {
          streak: newStreak,
          highestStreak: Math.max(state.user.highestStreak || 0, newStreak)
        }
      });

      // Check for streak-based rewards
      if (newStreak > 0 && newStreak % 5 === 0) {
        const streakReward = calculateStreakReward(newStreak);
        dispatch({
          type: 'ADD_REWARD',
          payload: streakReward
        });
      }
    } catch (err) {
      console.error('Error updating streak:', err);
    }
  };

  return { handleStreakUpdate };
}

/**
 * Hook Dependencies:
 * - useGame: For accessing and modifying game state
 * - date-fns: For date formatting and calculations
 * - Achievement types: For achievement structure
 * 
 * State Management:
 * - Uses GameContext for streak tracking
 * - Dispatches streak-related actions
 * 
 * Used By:
 * - StreakDisplay component
 * - DailyRewardSystem component
 * - XPSystem component
 * 
 * Features:
 * - Streak tracking
 * - Streak bonus calculation
 * - Achievement unlocking
 * - Date-based validation
 * 
 * Scalability Considerations:
 * - Separate trigger type definitions
 * - Factory function for achievement creation
 * - Type-safe achievement generation
 * - Extensible trigger conditions
 * - Configurable bonus tiers
 */ 

