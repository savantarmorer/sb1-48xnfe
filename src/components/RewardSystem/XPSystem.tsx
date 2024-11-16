import React, { useEffect } from 'react';
import { Star, Gift, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LevelSystem } from '../../lib/levelSystem';
import LootBox from '../LootBox';

export function XPSystem() {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();

  const currentLevelProgress = LevelSystem.calculateProgress(state.user.xp);
  const xpForNextLevel = LevelSystem.calculateXPToNextLevel(state.user.xp);
  const totalXPForCurrentLevel = LevelSystem.calculateXPForLevel(state.user.level);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading text-xl">{t('common.xpProgress')}</h2>
        <div className="flex items-center space-x-2">
          <Star className="text-yellow-500" />
          <span className="font-bold text-gray-900 dark:text-white">{state.user.xp} XP</span>
        </div>
      </div>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="badge badge-success">
              {t('common.nextLevel')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-primary">
              {totalXPForCurrentLevel - xpForNextLevel}/{totalXPForCurrentLevel} XP
            </span>
          </div>
        </div>
        <div className="progress-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentLevelProgress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="progress-bar-fill"
          />
        </div>
      </div>

      <AnimatePresence>
        {state.recentXPGains && state.recentXPGains.map((gain, index) => {
          const gainTime = new Date(gain.timestamp);
          return (
            <motion.div
              key={`${gainTime.getTime()}-${index}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-center space-x-2 mb-2 p-2 rounded-lg ${
                gain.isCritical 
                  ? 'bg-yellow-500/10 dark:bg-yellow-500/20 border border-yellow-500/20 dark:border-yellow-500/30' 
                  : 'bg-brand-teal-500/10 dark:bg-brand-teal-500/20 border border-brand-teal-500/20 dark:border-brand-teal-500/30'
              }`}
            >
              {gain.isCritical ? (
                <Zap size={16} className="text-yellow-500" />
              ) : (
                <Star size={16} className="text-brand-teal-500 dark:text-brand-teal-400" />
              )}
              <span className="font-bold text-gray-900 dark:text-white">+{gain.amount} XP</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">{gain.reason}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <LootBox
        isOpen={state.showLevelUpReward}
        onClose={() => dispatch({ type: 'DISMISS_LEVEL_UP_REWARD' })}
        rewards={state.currentLevelRewards || []}
      />
    </div>
  );
}