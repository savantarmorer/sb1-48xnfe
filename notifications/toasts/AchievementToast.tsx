import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { Achievement } from '../../../types/achievements';

export interface AchievementToastProps {
  visible: boolean;
  achievement: Achievement;
}

export function AchievementToast({ visible, achievement }: AchievementToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[300px] border-l-4 border-purple-500"
    >
      <div className="flex items-center space-x-3">
        <Trophy className="text-purple-500" size={24} />
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white">
            {achievement.title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {achievement.description}
          </p>
          <div className="flex items-center mt-1">
            <Star className={`
              ${achievement.rarity === 'legendary' ? 'text-yellow-500' :
                achievement.rarity === 'epic' ? 'text-purple-500' :
                achievement.rarity === 'rare' ? 'text-blue-500' :
                'text-gray-500'}
            `} size={16} />
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              +{achievement.points} points
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 

