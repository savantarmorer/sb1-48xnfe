import React, { useState } from 'react';
import { Trophy, Flame, Coins, Settings } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { LevelSystem } from '../lib/levelSystem';
import UserSettings from './UserSettings';

interface UserProgressProps {
  showSettings?: boolean;
}

export default function UserProgress({ showSettings = false }: UserProgressProps) {
  const { state } = useGame();
  const { t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Calculate level progress
  const currentLevelProgress = LevelSystem.calculateProgress(state.user.xp);
  const xpForNextLevel = LevelSystem.calculateXPToNextLevel(state.user.xp);
  const totalXPForCurrentLevel = LevelSystem.calculateXPForLevel(state.user.level);
  const currentLevelXP = totalXPForCurrentLevel - xpForNextLevel;

  return (
    <>
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={state.user.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
                alt={state.user.name}
                className="w-16 h-16 rounded-full border-4 border-indigo-500 dark:border-indigo-400"
              />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full px-2 py-1 text-xs font-bold"
              >
                {t('common.level')} {state.user.level}
              </motion.span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{state.user.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{state.user.title || t('profile.defaultTitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Stat icon={<Trophy className="text-yellow-500" />} value={state.user.xp.toLocaleString()} label={t('common.xp')} />
            <Stat icon={<Flame className="text-red-500" />} value={state.user.streak} label={t('common.streak')} />
            <Stat icon={<Coins className="text-yellow-400" />} value={state.user.coins.toLocaleString()} label={t('common.coins')} />
            {showSettings && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <Settings size={20} />
              </button>
            )}
          </div>
        </div>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50">
                {t('common.levelProgress')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-indigo-600 dark:text-indigo-400">
                {currentLevelXP}/{totalXPForCurrentLevel} XP
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-indigo-100 dark:bg-indigo-900/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentLevelProgress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500"
            />
          </div>
        </div>
      </div>

      {isSettingsOpen && <UserSettings onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="flex items-center space-x-1">
      {icon}
      <div>
        <motion.p
          key={value.toString()}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-lg font-bold text-gray-800 dark:text-white"
        >
          {value}
        </motion.p>
        <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}