import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame } from 'lucide-react';

interface ScoreDisplayProps {
  playerScore: number;
  opponentScore: number;
  streak: number;
  timeLeft: number;
}

export default function ScoreDisplay({ 
  playerScore, 
  opponentScore, 
  streak,
  timeLeft 
}: ScoreDisplayProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <motion.div
          className="text-2xl font-bold"
          key={`${playerScore}-${opponentScore}`}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-brand-teal-600 dark:text-brand-teal-400">
            {playerScore}
          </span>
          <span className="text-gray-400 mx-2">-</span>
          <span className="text-gray-600 dark:text-gray-400">
            {opponentScore}
          </span>
        </motion.div>

        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-1"
          >
            <Flame className="text-orange-500" size={20} />
            <motion.span
              key={streak}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-medium text-orange-500"
            >
              {streak}
            </motion.span>
          </motion.div>
        )}
      </div>

      {playerScore > opponentScore && (
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            transition: { duration: 2, repeat: Infinity }
          }}
        >
          <Trophy className="text-yellow-500" size={24} />
        </motion.div>
      )}
    </div>
  );
} 

