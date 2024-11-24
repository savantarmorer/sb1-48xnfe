import React from 'react';
import { motion } from 'framer-motion';
import { Scroll, Star } from 'lucide-react';
import { Quest } from '../../../types/quests';

export interface QuestToastProps {
  visible: boolean;
  quest: Quest;
}

export function QuestToast({ visible, quest }: QuestToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[300px] border-l-4 border-indigo-500"
    >
      <div className="flex items-center space-x-3">
        <Scroll className="text-indigo-500" size={24} />
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white">
            {quest.title}
          </p>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center">
              <Star className="text-yellow-500" size={16} />
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                +{quest.xpReward} XP
              </span>
            </div>
            <div className="flex items-center">
              <Star className="text-yellow-500" size={16} />
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                +{quest.coinReward} Coins
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 

