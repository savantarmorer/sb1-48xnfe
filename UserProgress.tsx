import React from 'react';
import { useLevelSystem } from '../hooks/useLevelSystem';
import { useGame } from '../contexts/GameContext';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import UserSettings from './UserSettings';

interface UserProgressProps {
  showSettings?: boolean;
}

export default function UserProgress({ showSettings = false }: UserProgressProps) {
  const { state } = useGame();
  const { currentLevel, progress, xpToNextLevel } = useLevelSystem();
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

  return (
    <div className="flex items-center justify-between">
      {/* User Profile Section */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-lg font-semibold">
              {state.user.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
            {currentLevel}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-medium dark:text-gray-200">
            {state.user.name || 'User'}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {state.user.title || 'Novice'}
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="flex-1 space-y-2 mx-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium dark:text-gray-200">
            Level {currentLevel}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {xpToNextLevel} XP to next level
          </span>
        </div>

        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 dark:bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <span className="font-medium dark:text-gray-200">
              {state.user.coins}
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">Coins</span>
          </div>
          <div>
            <span className="font-medium dark:text-gray-200">
              {state.user.streak}
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">
              {state.user.streak === 1 ? 'Day' : 'Days'} Streak
            </span>
          </div>
          <div>
            <span className="font-medium dark:text-gray-200">
              {state.achievements?.filter(a => a.unlocked)?.length || 0}
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">Achievements</span>
          </div>
        </div>
      </div>

      {/* Settings Button */}
      {showSettings && (
        <button
          onClick={() => setShowSettingsModal(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <Settings size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <UserSettings onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}