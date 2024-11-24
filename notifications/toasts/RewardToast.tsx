import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Star } from 'lucide-react';
import { Reward } from '../../../types/rewards';

export interface RewardToastProps {
  visible: boolean;
  reward: Reward;
}

export function RewardToast({ visible, reward }: RewardToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[300px] border-l-4 border-yellow-500"
    >
      <div className="flex items-center space-x-3">
        <Gift className="text-yellow-500" size={24} />
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white">
            {typeof reward.value === 'number' 
              ? `+${reward.value} ${reward.type.toUpperCase()}`
              : reward.value}
          </p>
          <div className="flex items-center mt-1">
            <Star className={`
              ${reward.rarity === 'legendary' ? 'text-yellow-500' :
                reward.rarity === 'epic' ? 'text-purple-500' :
                reward.rarity === 'rare' ? 'text-blue-500' :
                'text-gray-500'}
            `} size={16} />
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1 capitalize">
              {reward.rarity} Reward
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 

