import { motion } from 'framer-motion';
import { Award, X } from 'lucide-react';
import { Achievement } from '../../types/achievements';
import Button from '../Button';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-20 right-4 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-indigo-200 dark:border-indigo-800 z-50"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Award className={`text-${achievement.rarity === 'legendary' ? 'yellow' : 'indigo'}-500`} size={24} />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Achievement Unlocked!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {achievement.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              +{achievement.points} points
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          icon={<X size={16} />}
          className="!p-1"
        />
      </div>
    </motion.div>
  );
} 