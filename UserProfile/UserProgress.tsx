import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/gameContext';
import { XP, Coins, Level, Trophy } from 'lucide-react';

export function UserProgress() {
  const { state } = useGame();
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);

  useEffect(() => {
    setShowXPAnimation(true);
    const timer = setTimeout(() => setShowXPAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, [state.user.xp]);

  useEffect(() => {
    setShowCoinAnimation(true);
    const timer = setTimeout(() => setShowCoinAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, [state.user.coins]);

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="flex items-center">
          <XP className="w-5 h-5 mr-2" />
          <span>{state.user.xp}</span>
        </div>
        <AnimatePresence>
          {showXPAnimation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-6 left-0 text-green-500"
            >
              +{state.lastReward?.xp || 0}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Similar animations for coins and level */}
    </div>
  );
}