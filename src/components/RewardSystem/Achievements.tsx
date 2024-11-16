import React from 'react';
import { Award, Lock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isSecret?: boolean;
  progress?: number;
  total?: number;
  unlocked: boolean;
  reward: {
    type: 'xp' | 'item' | 'title';
    value: string | number;
  };
}

export function Achievements() {
  const { t } = useLanguage();

  const ACHIEVEMENTS: Achievement[] = [
    {
      id: 'perfect_quiz',
      title: t('achievements.perfectScholar.title'),
      description: t('achievements.perfectScholar.description'),
      rarity: 'legendary',
      progress: 3,
      total: 5,
      unlocked: false,
      reward: {
        type: 'title',
        value: t('achievements.perfectScholar.reward')
      }
    },
    {
      id: 'study_streak',
      title: t('achievements.dedicatedLearner.title'),
      description: t('achievements.dedicatedLearner.description'),
      rarity: 'epic',
      progress: 22,
      total: 30,
      unlocked: false,
      reward: {
        type: 'xp',
        value: 1000
      }
    }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading text-xl">{t('common.achievements')}</h2>
        <div className="text-sm text-muted">
          {ACHIEVEMENTS.filter(a => a.unlocked).length} / {ACHIEVEMENTS.length} {t('common.unlocked')}
        </div>
      </div>

      <div className="space-y-4">
        {ACHIEVEMENTS.map(achievement => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.02 }}
            className={`achievement-card ${achievement.rarity}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  {achievement.unlocked ? (
                    <CheckCircle size={20} className="text-brand-teal-500 dark:text-brand-teal-400" />
                  ) : (
                    <Lock size={20} className="text-gray-400 dark:text-gray-500" />
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
                </div>
                <p className="text-muted mt-1 ml-7">{achievement.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Award size={20} className="text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {achievement.reward.type === 'xp' && `+${achievement.reward.value} XP`}
                  {achievement.reward.type === 'title' && achievement.reward.value}
                </span>
              </div>
            </div>
            {achievement.progress !== undefined && (
              <div className="mt-3 ml-7">
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>{t('common.progress')}</span>
                  <span>{achievement.progress}/{achievement.total}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${(achievement.progress / (achievement.total || 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}