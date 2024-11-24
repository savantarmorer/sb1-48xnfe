import React from 'react';
import { Trophy, Scroll, Gift } from 'lucide-react';
import { Achievement } from '../../types/achievements';
import { Quest } from '../../types/quests';
import { Reward } from '../../types/rewards';

interface ToastProps {
  visible: boolean;
}

export const AchievementToast: React.FC<ToastProps & { achievement: Achievement }> = ({ visible, achievement }) => (
  <div className={`${visible ? 'animate-enter' : 'animate-leave'} bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-center space-x-4`}>
    <div className="flex-shrink-0">
      <Trophy className="text-yellow-500" size={24} />
    </div>
    <div>
      <h3 className="font-bold text-gray-900 dark:text-white">{achievement.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
    </div>
  </div>
);

export const QuestToast: React.FC<ToastProps & { quest: Quest }> = ({ visible, quest }) => (
  <div className={`${visible ? 'animate-enter' : 'animate-leave'} bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4`}>
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <Scroll className="text-green-500" size={24} />
      </div>
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white">Quest Complete!</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{quest.title}</p>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-sm text-yellow-600">+{quest.xpReward} XP</span>
          <span className="text-sm text-yellow-600">+{quest.coinReward} Coins</span>
        </div>
      </div>
    </div>
  </div>
);

export const RewardToast: React.FC<ToastProps & { reward: Reward }> = ({ visible, reward }) => (
  <div className={`${visible ? 'animate-enter' : 'animate-leave'} bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4`}>
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <Gift className="text-indigo-500" size={24} />
      </div>
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white">Reward Received!</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {typeof reward.value === 'number' 
            ? `+${reward.value} ${reward.type}`
            : reward.value}
        </p>
      </div>
    </div>
  </div>
); 

