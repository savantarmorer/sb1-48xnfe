import React from 'react';
import { motion } from 'framer-motion';
import { format, isSameDay } from 'date-fns';
import { Gift, Star, Check } from 'lucide-react';

interface LoginCalendarProps {
  loginDates: string[];
  rewards: Array<{
    day: number;
    reward: {
      type: string;
      value: number;
      rarity: string;
    };
  }>;
  currentStreak: number;
}

export default function LoginCalendar({
  loginDates,
  rewards,
  currentStreak
}: LoginCalendarProps) {
  const currentDay = currentStreak % 7 || 7;

  return (
    <div className="card">
      <div className="grid grid-cols-7 gap-2">
        {rewards.map((reward, index) => {
          const isCompleted = index < currentDay - 1;
          const isCurrent = index === currentDay - 1;
          const date = loginDates[index] ? new Date(loginDates[index]) : null;

          return (
            <motion.div
              key={reward.day}
              initial={isCurrent ? { scale: 0.9 } : { scale: 1 }}
              animate={isCurrent ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={isCurrent ? { repeat: Infinity, duration: 2 } : {}}
              className={`relative p-4 rounded-lg border ${
                isCompleted
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  : isCurrent
                  ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-medium mb-2">Day {reward.day}</div>
                <div className="flex justify-center mb-2">
                  {isCompleted ? (
                    <Check className="text-green-500" size={24} />
                  ) : (
                    <Gift
                      className={
                        isCurrent ? 'text-indigo-500' : 'text-gray-400'
                      }
                      size={24}
                    />
                  )}
                </div>
                <div className="text-sm font-medium">
                  {reward.reward.value} {reward.reward.type}
                </div>
                {reward.reward.rarity === 'legendary' && (
                  <div className="absolute -top-2 -right-2">
                    <Star className="text-yellow-500" size={16} />
                  </div>
                )}
              </div>
              {date && (
                <div className="absolute bottom-1 right-1 text-xs text-gray-500">
                  {format(date, 'dd/MM')}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}