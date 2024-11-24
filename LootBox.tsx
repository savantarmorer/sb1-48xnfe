import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Star, Sparkles } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Reward, RewardRarity } from '../types/rewards';
import { Achievement, AchievementCategory } from '../types/achievements';
import Button from './Button';

interface LootBoxProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: Reward[];
  source?: 'level_up' | 'daily_reward' | 'quest' | 'battle';
}

/**
 * LootBox Component
 * Displays and handles reward animations and distribution
 * 
 * Dependencies:
 * - GameContext for state management
 * - Reward types for type safety
 * - Achievement system for legendary rewards
 * 
 * Used by:
 * - BattleMode
 * - QuestSystem
 * - DailyRewards
 */
export default function LootBox({ isOpen, onClose, rewards, source }: LootBoxProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const { dispatch } = useGame();
  const { t } = useLanguage();

  const rarityOrder: Record<RewardRarity, number> = {
    common: 0,
    rare: 1,
    epic: 2,
    legendary: 3
  };

  const highestRarity = rewards.reduce((highest, reward) => {
    return rarityOrder[reward.rarity] > rarityOrder[highest] ? reward.rarity : highest;
  }, 'common' as RewardRarity);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      setShowRewards(true);
      rewards.forEach(reward => {
        if (reward.type === 'xp') {
          dispatch({
            type: 'ADD_XP',
            payload: Number(reward.value)
          });
        } else if (reward.type === 'coins') {
          dispatch({
            type: 'ADD_COINS',
            payload: Number(reward.value)
          });
        }
      });
    }, 2000);
  };

  const createLegendaryAchievement = (): Achievement => ({
    id: 'legendary_reward',
    title: 'Legendary Fortune',
    description: 'Obtain a legendary reward',
    category: 'rewards',
    points: 100,
    rarity: 'legendary',
    unlocked: true,
    unlockedAt: new Date(),
    prerequisites: [],
    dependents: [],
    triggerConditions: [{
      type: 'reward_rarity',
      value: 4,
      comparison: 'eq'
    }],
    order: 100
  });

  const handleClaimRewards = () => {
    rewards.forEach(reward => {
      dispatch({
        type: 'CLAIM_REWARD',
        payload: reward
      });
    });

    if (source === 'level_up') {
      const legendaryReward = rewards.find(r => r.rarity === 'legendary');
      if (legendaryReward) {
        dispatch({
          type: 'UNLOCK_ACHIEVEMENT',
          payload: createLegendaryAchievement()
        });
      }
    }

    onClose();
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
              <motion.div
                animate={isOpening ? {
                  scale: [1, 1.2, 0],
                  rotate: [0, 15, -15, 360],
                  y: [0, -20, 50]
                } : {
                  rotate: [0, 10, -10, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
                className={`w-32 h-32 mx-auto mb-6 rounded-lg relative ${
                  highestRarity === 'legendary' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  highestRarity === 'epic' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                  highestRarity === 'rare' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                  'bg-gradient-to-br from-gray-400 to-gray-600'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gift className="text-white" size={48} />
                </div>
                {!isOpening && (
                  <motion.div
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute -inset-2"
                  >
                    <Sparkles className={`w-full h-full ${
                      highestRarity === 'legendary' ? 'text-yellow-300' :
                      highestRarity === 'epic' ? 'text-purple-300' :
                      highestRarity === 'rare' ? 'text-blue-300' :
                      'text-gray-300'
                    }`} />
                  </motion.div>
                )}
              </motion.div>
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
                    <span className="font-medium dark:text-white">
                      {reward.type === 'xp' && `+${reward.value} XP`}
                      {reward.type === 'coins' && `+${reward.value} Coins`}
                      {reward.type === 'item' && reward.value}
                    </span>
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
                onClick={handleClaimRewards}
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