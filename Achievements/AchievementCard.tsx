import { motion } from 'framer-motion';
import { Share2, Lock, CheckCircle } from 'lucide-react';
import { Achievement, AchievementCategory } from '../../types/achievements';
import { useGame } from '../../contexts/GameContext';
import Button from '../Button';
import { useAdmin } from '../../hooks/useAdmin';

export interface AchievementCardProps {
  achievement: Achievement;
  category: AchievementCategory;
}

export default function AchievementCard({ achievement, category }: AchievementCardProps) {
  const { dispatch } = useGame();
  const { isAdmin } = useAdmin();
  const Icon = category.icon;

  const handleShare = async () => {
    if (!achievement.unlocked) return;

    try {
      await navigator.share({
        title: 'Conquista Desbloqueada!',
        text: `Acabei de desbloquear "${achievement.title}" no CepaC Play!`,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDebugUnlock = () => {
    if (isAdmin && !achievement.unlocked) {
      dispatch({
        type: 'UPDATE_ACHIEVEMENT_PROGRESS',
        payload: {
          id: achievement.id,
          progress: 100
        }
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`card ${achievement.unlocked ? 'achievement-card-unlocked' : 'achievement-card-locked'}`}
      onClick={handleDebugUnlock}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${category.color} bg-opacity-10`}>
            <Icon className={category.color} size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {achievement.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {achievement.description}
            </p>
          </div>
        </div>
        {achievement.unlocked ? (
          <CheckCircle className="text-green-500" size={20} />
        ) : (
          <Lock className="text-gray-400" size={20} />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            {achievement.points} pontos
          </span>
          {achievement.progress !== undefined && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              ({achievement.progress}%)
            </div>
          )}
        </div>
        {achievement.unlocked && (
          <Button
            variant="outline"
            size="sm"
            icon={<Share2 size={16} />}
            onClick={handleShare}
          >
            Compartilhar
          </Button>
        )}
      </div>

      {achievement.progress !== undefined && (
        <div className="mt-3">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${achievement.progress}%` }}
              className="h-full bg-indigo-600 dark:bg-indigo-500"
            />
          </div>
        </div>
      )}

      {isAdmin && !achievement.unlocked && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Click to debug unlock
        </div>
      )}
    </motion.div>
  );
}