import { motion } from 'framer-motion';
import { AchievementTier } from '../../types/achievements';

interface AchievementPointsProps {
  totalPoints: number;
  currentTier: AchievementTier;
  nextTier?: AchievementTier;
}

export default function AchievementPoints({ totalPoints, currentTier, nextTier }: AchievementPointsProps) {
  const progress = nextTier
    ? ((totalPoints - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100
    : 100;

  const Icon = currentTier.icon;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon className={currentTier.color} size={24} />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {currentTier.name} Tier
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalPoints.toLocaleString()} total points
            </p>
          </div>
        </div>
      </div>

      {nextTier && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{currentTier.name}</span>
            <span>{nextTier.name}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full ${currentTier.color.replace('text-', 'bg-')}`}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {nextTier.threshold - totalPoints} points until next tier
          </p>
        </div>
      )}
    </div>
  );
}