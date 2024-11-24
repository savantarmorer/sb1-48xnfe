import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Timer, Trophy } from 'lucide-react';
import { BattleStatus } from '../../types/battle';

interface BattleStateTransitionProps {
  status: BattleStatus;
  message?: string;
  subMessage?: string;
  onComplete?: () => void;
}

export default function BattleStateTransition({ status, onComplete }: BattleStateTransitionProps) {
  const getTransitionContent = () => {
    switch (status) {
      case 'searching':
        return {
          icon: <Swords size={48} className="text-brand-teal-500" />,
          text: 'Finding Opponent...',
          subtext: 'Preparing for battle'
        };
      case 'ready':
        return {
          icon: <Timer size={48} className="text-yellow-500" />,
          text: 'Get Ready!',
          subtext: 'Battle starting soon'
        };
      case 'completed':
        return {
          icon: <Trophy size={48} className="text-yellow-500" />,
          text: 'Battle Complete!',
          subtext: 'Calculating results...'
        };
      default:
        return null;
    }
  };

  const content = getTransitionContent();
  if (!content) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onAnimationComplete={onComplete}
        className="text-center"
      >
        <motion.div
          animate={status === 'searching' ? {
            rotate: [0, 360],
            transition: { duration: 2, repeat: Infinity }
          } : {
            scale: [1, 1.1, 1],
            transition: { duration: 1, repeat: Infinity }
          }}
          className="mb-4"
        >
          {content.icon}
        </motion.div>
        
        <motion.h2
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-2xl font-bold mb-2 text-gray-900 dark:text-white"
        >
          {content.text}
        </motion.h2>
        
        <p className="text-gray-600 dark:text-gray-400">
          {content.subtext}
        </p>
      </motion.div>
    </AnimatePresence>
  );
} 

