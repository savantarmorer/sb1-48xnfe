import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Gift, Sparkles, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGame } from '../contexts/GameContext';

interface Reward {
  type: 'xp' | 'coins' | 'item';
  value: number | string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LootBoxProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: Reward[];
}

const rarityColors = {
  common: 'from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600',
  rare: 'from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600',
  epic: 'from-purple-400 to-purple-500 dark:from-purple-500 dark:to-purple-600',
  legendary: 'from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600'
};

const rarityGlowColors = {
  common: 'shadow-gray-400/50 dark:shadow-gray-500/50',
  rare: 'shadow-blue-400/50 dark:shadow-blue-500/50',
  epic: 'shadow-purple-400/50 dark:shadow-purple-500/50',
  legendary: 'shadow-yellow-400/50 dark:shadow-yellow-500/50'
};

const rarityAnimations = {
  common: { duration: 1, scale: [1, 1.1, 1] },
  rare: { duration: 1.5, scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] },
  epic: { duration: 2, scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] },
  legendary: { duration: 2.5, scale: [1, 1.4, 1], rotate: [0, 20, -20, 0] }
};

export default function LootBox({ isOpen, onClose, rewards }: LootBoxProps) {
  const { t } = useLanguage();
  const { dispatch } = useGame();
  const [isRevealed, setIsRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentRewardIndex, setCurrentRewardIndex] = useState(-1);
  const [isOpening, setIsOpening] = useState(false);
  const [determinedRarity, setDeterminedRarity] = useState<string | null>(null);
  const hasLegendary = rewards.some(reward => reward.rarity === 'legendary');

  useEffect(() => {
    if (isOpen) {
      setIsRevealed(false);
      setShowConfetti(false);
      setCurrentRewardIndex(-1);
      setIsOpening(false);
      setDeterminedRarity(null);
    }
  }, [isOpen]);

  const handleReveal = async () => {
    if (isOpening) return;
    setIsOpening(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDeterminedRarity('determining');
    
    const highestRarity = rewards.reduce((highest, reward) => {
      const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
      return rarityOrder[reward.rarity] > rarityOrder[highest] ? reward.rarity : highest;
    }, 'common' as Reward['rarity']);
    
    const pauseDuration = {
      common: 1000,
      rare: 1500,
      epic: 2000,
      legendary: 2500
    }[highestRarity];
    
    await new Promise(resolve => setTimeout(resolve, pauseDuration));
    setDeterminedRarity(highestRarity);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsRevealed(true);
    setShowConfetti(true);
    revealRewards();
  };

  const revealRewards = () => {
    let delay = 0;
    rewards.forEach((reward, index) => {
      setTimeout(() => {
        setCurrentRewardIndex(index);
        if (reward.type === 'xp') {
          dispatch({
            type: 'ADD_XP',
            payload: {
              amount: reward.value as number,
              reason: `${t('lootbox.reward')} (${t(`items.rarity.${reward.rarity}`)})`
            }
          });
        } else if (reward.type === 'coins') {
          dispatch({
            type: 'ADD_COINS',
            payload: reward.value as number
          });
        } else if (reward.type === 'item') {
          dispatch({
            type: 'PURCHASE_ITEM',
            payload: {
              itemId: `reward_${Date.now()}`,
              cost: 0,
              item: {
                name: reward.value,
                rarity: reward.rarity,
                type: 'material'
              }
            }
          });
        }
      }, delay);
      delay += 800;
    });
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={hasLegendary ? 500 : 200}
          colors={hasLegendary ? ['#FFD700', '#FFA500', '#FF8C00'] : undefined}
        />
      )}
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      >
        {!isRevealed ? (
          <motion.div
            className="text-center"
            whileHover={!isOpening ? { scale: 1.05 } : undefined}
            whileTap={!isOpening ? { scale: 0.95 } : undefined}
            onClick={() => !isOpening && handleReveal()}
          >
            <Gift size={64} className="mx-auto mb-4 text-indigo-500" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {isOpening ? t('lootbox.opening') : t('lootbox.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {determinedRarity === 'determining' 
                ? t('lootbox.determining')
                : determinedRarity 
                  ? t(`lootbox.rarityFound.${determinedRarity}`)
                  : t('lootbox.clickToOpen')}
            </p>
            <motion.div
              className="relative w-32 h-32 mx-auto"
              animate={isOpening ? {
                rotateY: [0, 360],
                scale: [1, 1.2, 1],
              } : {
                rotateY: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: isOpening ? 2 : 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div
                className={`absolute inset-0 rounded-lg shadow-[0_0_50px_10px] ${
                  determinedRarity && determinedRarity !== 'determining'
                    ? rarityGlowColors[determinedRarity as keyof typeof rarityGlowColors]
                    : 'shadow-indigo-400/50 dark:shadow-indigo-500/50'
                }`}
              >
                <div
                  className={`w-full h-full rounded-lg bg-gradient-to-br ${
                    determinedRarity && determinedRarity !== 'determining'
                      ? rarityColors[determinedRarity as keyof typeof rarityColors]
                      : 'from-indigo-400 to-indigo-500 dark:from-indigo-500 dark:to-indigo-600'
                  } flex items-center justify-center`}
                >
                  <Sparkles className="text-white" size={48} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              {t('lootbox.rewardsUnlocked')}
            </h2>
            {rewards.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={currentRewardIndex >= index ? {
                  x: 0,
                  opacity: 1,
                  ...rarityAnimations[reward.rarity]
                } : {}}
                transition={{ delay: index * 0.2 }}
                className={`p-4 rounded-lg bg-gradient-to-r ${rarityColors[reward.rarity]} text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="animate-pulse" size={20} />
                    <span className="font-bold">
                      {reward.type === 'xp' && `+${reward.value} XP`}
                      {reward.type === 'coins' && `+${reward.value} ${t('common.coins')}`}
                      {reward.type === 'item' && reward.value}
                    </span>
                  </div>
                  <span className="text-sm opacity-75">
                    {t(`items.rarity.${reward.rarity}`)}
                  </span>
                </div>
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {t('common.continue')}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}