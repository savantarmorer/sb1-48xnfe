import React from 'react';
import { Trophy, Star, Lock, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LevelSystem as LevelCalculator } from '../../lib/levelSystem';

const LEVEL_REWARDS = [
  {
    level: 1,
    rewards: [
      {
        type: 'feature',
        title: 'Personalização de Perfil',
        description: 'Desbloqueie opções de personalização do seu perfil',
        icon: <Star className="text-yellow-400" />
      }
    ]
  },
  {
    level: 2,
    rewards: [
      {
        type: 'feature',
        title: 'Simulados',
        description: 'Acesso a simulados práticos',
        icon: <Trophy className="text-blue-400" />
      }
    ]
  },
  {
    level: 5,
    rewards: [
      {
        type: 'title',
        title: 'Título: Estudante Dedicado',
        description: 'Um título especial para seu perfil',
        icon: <Gift className="text-purple-400" />
      }
    ]
  },
  {
    level: 10,
    rewards: [
      {
        type: 'feature',
        title: 'Modo Batalha Avançado',
        description: 'Desbloqueie batalhas especiais com recompensas únicas',
        icon: <Trophy className="text-indigo-400" />
      }
    ]
  }
];

export function LevelSystem() {
  const { state } = useGame();
  const { t } = useLanguage();
  const currentLevel = state.user.level;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading text-xl">{t('common.level')} {currentLevel}</h2>
        <div className="text-sm text-muted">
          {state.user.xp} / {LevelCalculator.calculateXPForLevel(currentLevel + 1)} XP
        </div>
      </div>

      <div className="space-y-6">
        {LEVEL_REWARDS.map(({ level, rewards }) => (
          <motion.div
            key={level}
            initial={false}
            animate={{
              scale: currentLevel >= level ? [1.02, 1] : 1,
              transition: { duration: 0.3 }
            }}
            className={`p-4 rounded-lg ${
              currentLevel >= level
                ? 'bg-brand-teal-50 dark:bg-brand-teal-900/20 border border-brand-teal-200 dark:border-brand-teal-800'
                : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Nível {level}
              </h3>
              {currentLevel >= level ? (
                <span className="text-brand-teal-600 dark:text-brand-teal-400 text-sm font-medium">
                  {t('common.unlocked')}
                </span>
              ) : (
                <Lock size={16} className="text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <div className="space-y-3">
              {rewards.map((reward, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-sm text-muted"
                >
                  {reward.icon}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {reward.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {reward.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}