import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { motion } from 'framer-motion';

export default function Leaderboard() {
  const { state } = useGame();
  const { leaderboard } = state;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-amber-600" size={24} />;
      default:
        return <Award className="text-indigo-400" size={24} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Top Legal Scholars</h2>
      
      <div className="space-y-4">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-4 p-4 rounded-lg ${
              entry.userId === state.user.id
                ? 'bg-indigo-50 border border-indigo-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex-shrink-0">
              {getRankIcon(entry.rank)}
            </div>
            <div className="flex-shrink-0">
              <img
                src={entry.avatar}
                alt={entry.username}
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{entry.username}</h3>
              <p className="text-sm text-gray-600">Level {Math.floor(entry.score / 1000) + 1}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{entry.score} XP</p>
              <p className="text-sm text-gray-600">Rank #{entry.rank}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}