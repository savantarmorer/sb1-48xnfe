import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Award } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface StreakDisplayProps {
  streak: number;
}

export default function StreakDisplay({ streak }: StreakDisplayProps) {
  const { dispatch } = useGame();

  useEffect(() => {
    // Check for streak-based achievements
    const streakMilestones = [7, 30, 100];
    streakMilestones.forEach(milestone => {
      if (streak >= milestone) {
        dispatch({
          type: 'UNLOCK_ACHIEVEMENT',
          payload: {
            id: `streak_${milestone}`,
            title: `${milestone} Day Streak`,
            description: `Maintained a ${milestone} day login streak`,
            category: 'progress',
            points: milestone,
            rarity: milestone >= 100 ? 'legendary' : milestone >= 30 ? 'epic' : 'rare',
            unlocked: true,
            unlockedAt: new Date(),
            prerequisites: [],
            dependents: [],
            triggerConditions: [{
              type: 'streak',
              value: milestone,
              comparison: 'gte'
            }],
            order: milestone
          }
        });
      }
    });
  }, [streak]);

  const getStreakBonus = (streak: number) => {
    if (streak >= 30) return 100;
    if (streak >= 14) return 80;
    if (streak >= 7) return 50;
    if (streak >= 3) return 20;
    return 0;
  };

  const bonus = getStreakBonus(streak);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Flame
              size={32}
              className={`${
                streak >= 30
                  ? 'text-red-500'
                  : streak >= 14
                  ? 'text-orange-500'
                  : streak >= 7
                  ? 'text-yellow-500'
                  : 'text-gray-400'
              }`}
            />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {streak} Day Streak
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Keep logging in daily to earn bonus rewards!
            </p>
          </div>
        </div>
        {bonus > 0 && (
          <div className="flex items-center space-x-2 bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
            <Award className="text-indigo-500" size={16} />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              +{bonus}% Bonus
            </span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Next Milestone</span>
          {streak < 3 && <span>3 days</span>}
          {streak >= 3 && streak < 7 && <span>7 days</span>}
          {streak >= 7 && streak < 14 && <span>14 days</span>}
          {streak >= 14 && streak < 30 && <span>30 days</span>}
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(streak % 7) * 14.28}%` }}
            className="h-full bg-indigo-600 dark:bg-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}