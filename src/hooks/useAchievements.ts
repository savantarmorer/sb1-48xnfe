import { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { Achievement } from '../types';

export function useAchievements() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    checkAchievements();
  }, [state.user.xp, state.user.streak]);

  const checkAchievements = () => {
    const newAchievements: Achievement[] = [];

    // XP Milestones
    const xpMilestones = [1000, 5000, 10000, 50000];
    xpMilestones.forEach(milestone => {
      if (state.user.xp >= milestone && !hasAchievement(`xp_${milestone}`)) {
        newAchievements.push({
          id: `xp_${milestone}`,
          title: `${milestone.toLocaleString()} XP Master`,
          description: `Earn ${milestone.toLocaleString()} total XP`,
          icon: '🌟',
          rarity: milestone >= 10000 ? 'legendary' : 'epic',
          unlockedAt: new Date()
        });
      }
    });

    // Streak Achievements
    const streakMilestones = [7, 30, 100];
    streakMilestones.forEach(milestone => {
      if (state.user.streak >= milestone && !hasAchievement(`streak_${milestone}`)) {
        newAchievements.push({
          id: `streak_${milestone}`,
          title: `${milestone} Day Streak`,
          description: `Maintain a ${milestone} day study streak`,
          icon: '🔥',
          rarity: milestone >= 30 ? 'legendary' : 'epic',
          unlockedAt: new Date()
        });
      }
    });

    // Add new achievements
    newAchievements.forEach(achievement => {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement });
    });
  };

  const hasAchievement = (id: string): boolean => {
    return state.user.achievements.some(a => a.id === id);
  };

  return {
    achievements: state.user.achievements,
    hasAchievement
  };
}