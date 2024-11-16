import React, { useState } from 'react';
import { Crown, Book, Users, Video, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LootBox from '../LootBox';

export function PremiumRewards() {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();
  const [showLootBox, setShowLootBox] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  const PREMIUM_REWARDS = [
    {
      id: 'mock_exam_bundle',
      title: t('store.items.studyMaterial.title'),
      description: t('store.items.studyMaterial.description'),
      cost: 2000,
      type: 'material',
      rarity: 'epic',
      icon: <Book className="text-purple-500" />,
      available: true
    },
    {
      id: 'expert_session',
      title: t('store.items.expertSession.title'),
      description: t('store.items.expertSession.description'),
      cost: 5000,
      type: 'session',
      rarity: 'legendary',
      icon: <Users className="text-yellow-500" />,
      available: true
    }
  ];

  const handlePurchase = (reward: any) => {
    if (state.user.coins < reward.cost) return;

    dispatch({
      type: 'PURCHASE_ITEM',
      payload: {
        itemId: reward.id,
        cost: reward.cost
      }
    });

    setSelectedReward(reward);
    setShowLootBox(true);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Crown className="text-yellow-500" />
          <h2 className="heading text-xl">{t('rewards.premium.title')}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="text-yellow-500" />
          <span className="font-bold text-gray-900 dark:text-white">
            {state.user.coins} {t('common.coins')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PREMIUM_REWARDS.map(reward => (
          <motion.div
            key={reward.id}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg border ${
              state.user.coins >= reward.cost
                ? 'border-brand-teal-200 dark:border-brand-teal-800 hover:border-brand-teal-300 dark:hover:border-brand-teal-700'
                : 'border-gray-200 dark:border-gray-700 opacity-50'
            } transition-all`}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                {reward.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{reward.title}</h3>
                <p className="text-sm text-muted mt-1">
                  {reward.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-medium text-primary">
                    {reward.cost} {t('common.coins')}
                  </span>
                  <button
                    onClick={() => handlePurchase(reward)}
                    disabled={state.user.coins < reward.cost}
                    className={`btn ${
                      state.user.coins >= reward.cost
                        ? 'btn-primary'
                        : 'btn-secondary opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {t('common.purchase')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedReward && (
        <LootBox
          isOpen={showLootBox}
          onClose={() => {
            setShowLootBox(false);
            setSelectedReward(null);
          }}
          rewards={[
            {
              type: selectedReward.type,
              value: selectedReward.title,
              rarity: selectedReward.rarity
            }
          ]}
        />
      )}
    </div>
  );
}