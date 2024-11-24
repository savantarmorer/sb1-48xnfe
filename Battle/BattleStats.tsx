import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, TrendingUp, Medal, Swords, Award, Crown } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { BattleStats as BattleStatsType } from '../../types/battle';

export default function BattleStats() {
  const { state } = useGame();
  const stats = state.battleStats;

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        No battle statistics available yet.
      </div>
    );
  }

  const calculateWinRate = (stats: BattleStatsType) => {
    if (!stats.totalBattles) return 0;
    return ((stats.wins / stats.totalBattles) * 100).toFixed(1);
  };

  const getRankInfo = (rating: number): { title: string; color: string; icon: JSX.Element } => {
    if (rating >= 2000) return { 
      title: 'Grandmaster', 
      color: 'text-yellow-500',
      icon: <Crown className="h-8 w-8" />
    };
    if (rating >= 1800) return { 
      title: 'Master', 
      color: 'text-purple-500',
      icon: <Award className="h-8 w-8" />
    };
    if (rating >= 1600) return { 
      title: 'Expert', 
      color: 'text-blue-500',
      icon: <Star className="h-8 w-8" />
    };
    if (rating >= 1400) return { 
      title: 'Veteran', 
      color: 'text-green-500',
      icon: <Medal className="h-8 w-8" />
    };
    if (rating >= 1200) return { 
      title: 'Skilled', 
      color: 'text-indigo-500',
      icon: <Target className="h-8 w-8" />
    };
    return { 
      title: 'Novice', 
      color: 'text-gray-500',
      icon: <Swords className="h-8 w-8" />
    };
  };

  const rankInfo = getRankInfo(state.user.battleRating || 0);

  return (
    <div className="space-y-8">
      {/* Rank Display */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-gray-400 text-sm uppercase tracking-wider">Current Rank</h2>
            <div className="flex items-center space-x-3">
              <span className={`${rankInfo.color}`}>
                {rankInfo.icon}
              </span>
              <div>
                <p className={`text-3xl font-bold ${rankInfo.color}`}>
                  {rankInfo.title}
                </p>
                <p className="text-gray-400">
                  Rating: {state.user.battleRating || 0}
                </p>
              </div>
            </div>
          </div>
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className={`${rankInfo.color} opacity-20`}
          >
            {rankInfo.icon}
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Swords className="text-blue-500 h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Battles</p>
              <p className="text-2xl font-bold">{stats.totalBattles}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Trophy className="text-yellow-500 h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Win Rate</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold">{calculateWinRate(stats)}%</p>
                <p className="text-sm text-gray-500">
                  ({stats.wins}W - {stats.losses}L)
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Star className="text-green-500 h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Win Streak</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold">{stats.winStreak}</p>
                <p className="text-sm text-gray-500">
                  (Best: {stats.highestStreak})
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Star className="text-orange-500 h-5 w-5" />
            <span>Performance</span>
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                <span className="font-medium">{stats.averageScore.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.averageScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-orange-500 rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Current Streak</span>
                <span className="font-medium">{stats.winStreak} / {stats.highestStreak}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.winStreak / stats.highestStreak) * 100}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <TrendingUp className="text-green-500 h-5 w-5" />
            <span>Progress</span>
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total XP</span>
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="font-medium"
              >
                {stats.totalXpEarned.toLocaleString()}
              </motion.span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Coins</span>
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="font-medium"
              >
                {stats.totalCoinsEarned.toLocaleString()}
              </motion.span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Last Battle</span>
              <span className="text-sm text-gray-500">
                {stats.lastBattleDate ? new Date(stats.lastBattleDate).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}