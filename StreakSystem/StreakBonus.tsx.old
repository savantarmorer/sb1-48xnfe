import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Trophy } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

export function StreakBonus() {
  const { state } = useGame();
  const { streak } = state.user;

  const getStreakMultiplier = () => {
    if (streak >= 30) return 2.0;
    if (streak >= 14) return 1.8;
    if (streak >= 7) return 1.5;
    if (streak >= 3) return 1.2;
    return 1.0;
  };

  const multiplier = getStreakMultiplier();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Flame className="text-orange-500" size={24} />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Streak Bonus
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {streak} days streak
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="text-yellow-500" size={16} />
          <span className="font-bold text-yellow-600 dark:text-yellow-400">
            {multiplier}x XP
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Next Milestone</span>
          <span>
            {streak < 3 ? '3 days' :
             streak < 7 ? '7 days' :
             streak < 14 ? '14 days' :
             streak < 30 ? '30 days' :
             'Max bonus reached!'}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(streak % 7) * 14.28}%` }}
            className="h-full bg-orange-500"
          />
        </div>
      </div>
    </motion.div>
  );
} 