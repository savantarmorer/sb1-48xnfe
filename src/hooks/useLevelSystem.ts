import { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { LevelSystem } from '../lib/levelSystem';
import { useNotification } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

export function useLevelSystem() {
  const { state, dispatch } = useGame();
  const { showNotification } = useNotification();
  const { t } = useLanguage();

  useEffect(() => {
    const currentLevel = LevelSystem.calculateLevel(state.user.xp);
    if (currentLevel > state.user.level) {
      const rewards = LevelSystem.getLevelRewards(currentLevel);
      
      dispatch({
        type: 'LEVEL_UP',
        payload: {
          level: currentLevel,
          rewards
        }
      });

      // Show level up notification
      showNotification({
        type: 'achievement',
        message: {
          title: t('levelUp.title', { level: currentLevel }),
          description: t('levelUp.description'),
          rewards
        },
        duration: 5000
      });
    }
  }, [state.user.xp, state.user.level, dispatch, showNotification, t]);

  return {
    currentLevel: state.user.level,
    currentXP: state.user.xp,
    progress: LevelSystem.calculateProgress(state.user.xp),
    xpToNextLevel: LevelSystem.calculateXPToNextLevel(state.user.xp),
    totalXPForCurrentLevel: LevelSystem.calculateTotalXPForLevel(state.user.level)
  };
} 

