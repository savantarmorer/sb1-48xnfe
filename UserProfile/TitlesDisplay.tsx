import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Shield, Award } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const TITLE_ICONS = {
  legendary: Crown,
  epic: Star,
  rare: Shield,
  common: Award
};

export default function TitlesDisplay() {
  const { state, dispatch } = useGame();
  const { user } = state;

  const titles = [
    { id: 'legal_master', name: 'Legal Master', rarity: 'legendary', unlocked: true },
    { id: 'quiz_champion', name: 'Quiz Champion', rarity: 'epic', unlocked: true },
    { id: 'dedicated_learner', name: 'Dedicated Learner', rarity: 'rare', unlocked: false },
    { id: 'rising_star', name: 'Rising Star', rarity: 'common', unlocked: true }
  ];

  const handleSelectTitle = (titleId: string) => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: { selectedTitle: titleId }
    });
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-6">Titles & Badges</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Crown className="text-yellow-500" />
          <span className="font-medium">Active Title:</span>
          <span className="text-indigo-600 dark:text-indigo-400">
            {titles.find(t => t.id === user.selectedTitle)?.name || 'None Selected'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {titles.map((title) => {
            const Icon = TITLE_ICONS[title.rarity as keyof typeof TITLE_ICONS];
            return (
              <motion.button
                key={title.id}
                whileHover={title.unlocked ? { scale: 1.02 } : undefined}
                onClick={() => title.unlocked && handleSelectTitle(title.id)}
                className={`p-4 rounded-lg border ${
                  !title.unlocked
                    ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                    : user.selectedTitle === title.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`${
                    title.rarity === 'legendary' ? 'text-yellow-500' :
                    title.rarity === 'epic' ? 'text-purple-500' :
                    title.rarity === 'rare' ? 'text-blue-500' :
                    'text-gray-500'
                  }`} />
                  <div>
                    <h4 className="font-medium">{title.name}</h4>
                    <p className="text-sm text-muted capitalize">{title.rarity} Title</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}