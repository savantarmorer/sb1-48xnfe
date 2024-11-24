import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { VirtualizedList } from '../VirtualizedList';

export default function LeaderboardList() {
  const { state } = useGame();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-amber-600" size={24} />;
      default:
        return <Award className="text-indigo-400" size={24} />;
    }
  };

  const renderLeaderboardEntry = (entry: any, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center space-x-4 p-4 rounded-lg ${
        entry.userId === state.user.id
          ? 'bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800'
          : 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
      }`}
    >
      <div className="flex-shrink-0">
        {getRankIcon(entry.rank)}
      </div>
      <div className="flex-shrink-0">
        <img
          src={entry.avatar}
          alt={entry.username}
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{entry.username}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Level {Math.floor(entry.score / 1000) + 1}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900 dark:text-white">{entry.score.toLocaleString()} XP</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Rank #{entry.rank}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Legal Scholars</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Updated every hour
        </div>
      </div>

      <VirtualizedList
        items={state.leaderboard}
        renderItem={renderLeaderboardEntry}
        itemHeight={88}
        className="space-y-4"
      />
    </div>
  );
}