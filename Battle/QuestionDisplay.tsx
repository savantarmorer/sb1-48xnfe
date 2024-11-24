import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BattleQuestion, BattleState } from '../../types/battle';
import { useGame } from '../../contexts/GameContext';

interface QuestionDisplayProps {
  question: BattleQuestion;
  onAnswer: (index: number) => void;
  timeLeft: number;
  disabled?: boolean;
}

export default function QuestionDisplay({ 
  question, 
  onAnswer, 
  timeLeft,
  disabled 
}: QuestionDisplayProps) {
  const { state } = useGame();
  const battle = state.battle as BattleState;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <motion.div
          className="relative"
          animate={{
            scale: timeLeft <= 5 ? [1, 1.02, 1] : 1
          }}
          transition={{
            duration: 0.5,
            repeat: timeLeft <= 5 ? Infinity : 0
          }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {question.question}
          </h3>
          {timeLeft <= 5 && (
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-3">
          {question.answers.map((answer: string, index: number) => (
            <motion.button
              key={index}
              onClick={() => !disabled && onAnswer(index)}
              disabled={disabled || battle.status !== 'battle'}
              whileHover={!disabled && battle.status === 'battle' ? { scale: 1.02 } : {}}
              whileTap={!disabled && battle.status === 'battle' ? { scale: 0.98 } : {}}
              className={`p-4 text-left rounded-lg border ${
                disabled || battle.status !== 'battle'
                  ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-brand-teal-50 hover:border-brand-teal-300 dark:hover:bg-brand-teal-900/20 dark:hover:border-brand-teal-700'
              } transition-colors text-gray-900 dark:text-white`}
            >
              {answer}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Component Role:
 * - Displays current battle question
 * - Handles answer selection
 * - Provides visual feedback
 * 
 * Dependencies:
 * - GameContext for battle state
 * - Question type for props
 * - Framer Motion for animations
 * 
 * Used by:
 * - BattleMode component
 * 
 * Features:
 * - Animated transitions
 * - Time-based UI feedback
 * - Disabled state handling
 * - Dark mode support
 * 
 * Scalability:
 * - Modular design
 * - Reusable animations
 * - Configurable timing
 * - Extensible styling
 */ 

