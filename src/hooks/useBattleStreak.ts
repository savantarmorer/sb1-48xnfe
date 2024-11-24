import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import { BattleService } from '../services/battleService';
import { RewardService } from '../services/rewardService';
import { Reward } from '../types/rewards';
import { supabase } from '../lib/supabase';

export function useBattleStreak() {
  const { state, dispatch } = useGame();
  const { user: authUser } = useAuth();

  const handleBattleResult = async (isVictory: boolean): Promise<Reward[]> => {
    try {
      const userId = state.user?.id || authUser?.id;
      if (!userId) {
        console.error('No user ID found');
        return [];
      }

      // Update streak in database
      const { data, error } = await supabase
        .from('battle_stats')
        .upsert({
          user_id: userId,
          win_streak: isVictory ? (state.battleStats?.winStreak || 0) + 1 : 0,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      dispatch({
        type: 'UPDATE_BATTLE_STATS',
        payload: {
          winStreak: isVictory ? (state.battleStats?.winStreak || 0) + 1 : 0
        }
      });

      let rewards: Reward[] = [];

      // Check for streak-based rewards
      if (isVictory && state.battleStats?.winStreak && state.battleStats.winStreak % 3 === 0) {
        const streakReward = RewardService.createStreakLootboxReward(state.battleStats.winStreak);
        rewards.push(streakReward);
      }

      return rewards;
    } catch (error) {
      console.error('Error updating battle streak:', error);
      return [];
    }
  };

  return {
    handleBattleResult,
    currentStreak: state.battleStats?.winStreak || 0
  };
}

/**
 * Role: Manages battle streak rewards
 * Dependencies:
 * - GameContext
 * - BattleService
 * - RewardService
 * Used by:
 * - BattleMode component
 * Features:
 * - Streak tracking
 * - Automatic reward distribution
 * - Notification system
 */ 