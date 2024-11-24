import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Medal, Award } from 'lucide-react';
import { BattleResults as BattleResultsType } from '../../types/battle';
import Confetti from 'react-confetti';

interface BattleResultsProps {
  results: BattleResultsType;
  onClose: () => void;
}

export default function BattleResults({ results, onClose }: BattleResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      {results.isVictory && <Confetti recycle={false} numberOfPieces={200} />}
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      >
        <div className="text-center">
          {results.isVictory ? (
            <>
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl font-bold mb-4 text-yellow-500">Victory!</h2>
            </>
          ) : (
            <>
              <Medal className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h2 className="text-2xl font-bold mb-4 text-gray-500">Good Try!</h2>
            </>
          )}

          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-300">Score</span>
                <span className="font-bold">{results.score}/{results.totalQuestions}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-300">XP Earned</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-brand-teal-500 mr-1" />
                  <span className="font-bold text-brand-teal-500">+{results.xpEarned}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Coins Earned</span>
                <span className="font-bold text-yellow-500">+{results.coinsEarned}</span>
              </div>
            </div>

            {results.streakBonus > 0 && (
              <div className="bg-orange-100 dark:bg-orange-900/20 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 dark:text-orange-400">Streak Bonus</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    +{results.streakBonus}
                  </span>
                </div>
              </div>
            )}

              {results.rewards?.achievements && results.rewards.achievements.length > 0 && (
                  <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-1 text-purple-500" />
                      <span>Achievements Unlocked!</span>
                    </h3>
                    <div className="space-y-2">
                      {results.rewards.achievements.map((achievement: string, index: number) => (
                        <div key={index} className="text-sm text-purple-600 dark:text-purple-400">
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-brand-teal-500 hover:bg-brand-teal-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 

