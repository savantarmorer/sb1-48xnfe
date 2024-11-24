import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Star } from 'lucide-react';
import LootboxScene from './LootboxScene';
import Button from '../Button';

interface LootboxRewardProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: Array<{
    type: string;
    value: number | string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
}

export default function LootboxReward({ isOpen, onClose, rewards }: LootboxRewardProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const highestRarity = rewards.reduce((highest, reward) => {
    const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
    return rarityOrder[reward.rarity] > rarityOrder[highest] ? reward.rarity : highest;
  }, 'common' as 'common' | 'rare' | 'epic' | 'legendary');

  useEffect(() => {
    if (!isOpen) {
      setIsOpening(false);
      setShowRewards(false);
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => setShowRewards(true), 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      >
        <AnimatePresence mode="wait">
          {!showRewards ? (
            <motion.div
              key="lootbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <LootboxScene
                rarity={highestRarity}
                isOpening={isOpening}
                onOpenComplete={() => setShowRewards(true)}
              />
              {!isOpening && (
                <Button
                  variant="primary"
                  onClick={handleOpen}
                  className="mt-4"
                >
                  Open Lootbox
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="rewards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
                Rewards Unlocked!
              </h2>
              {rewards.map((reward, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`p-4 rounded-lg ${
                    reward.rarity === 'legendary' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    reward.rarity === 'epic' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    reward.rarity === 'rare' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    'bg-gray-100 dark:bg-gray-900/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Gift className={
                        reward.rarity === 'legendary' ? 'text-yellow-500' :
                        reward.rarity === 'epic' ? 'text-purple-500' :
                        reward.rarity === 'rare' ? 'text-blue-500' :
                        'text-gray-500'
                      } />
                      <span className="font-medium dark:text-white">
                        {reward.type === 'xp' && `+${reward.value} XP`}
                        {reward.type === 'coins' && `+${reward.value} Coins`}
                        {reward.type === 'item' && reward.value}
                      </span>
                    </div>
                    <Star className={
                      reward.rarity === 'legendary' ? 'text-yellow-500' :
                      reward.rarity === 'epic' ? 'text-purple-500' :
                      reward.rarity === 'rare' ? 'text-blue-500' :
                      'text-gray-500'
                    } />
                  </div>
                </motion.div>
              ))}
              <Button
                variant="primary"
                onClick={onClose}
                className="w-full mt-6"
              >
                Continue
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}