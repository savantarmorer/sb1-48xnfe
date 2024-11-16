import React from 'react';
import { Trophy, Star, Lock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Level {
  level: number;
  xpRequired: number;
  rewards: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

export function LevelSystem({ currentXP = 0 }) {
  const { t } = useLanguage();

  const LEVELS: Level[] = [
    {
      level: 1,
      xpRequired: 0,
      rewards: [
        {
          title: t('levels.1.rewards.profileCustomization.title'),
          description: t('levels.1.rewards.profileCustomization.description'),
          icon: <Star className="text-yellow-400" />
        }
      ]
    },
    {
      level: 2,
      xpRequired: 100,
      rewards: [
        {
          title: t('levels.2.rewards.mockExam.title'),
          description: t('levels.2.rewards.mockExam.description'),
          icon: <Trophy className="text-blue-400" />
        }
      ]
    }
  ];

  const getCurrentLevel = () => {
    return LEVELS.reduce((highest, level) => 
      currentXP >= level.xpRequired ? level : highest
    );
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = LEVELS.find(level => level.xpRequired > currentXP);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading text-xl">{t('common.level')} {currentLevel.level}</h2>
        <div className="text-sm text-muted">
          {currentXP} / {nextLevel?.xpRequired || '∞'} XP
        </div>
      </div>

      <div className="space-y-6">
        {LEVELS.map(level => (
          <div
            key={level.level}
            className={`p-4 rounded-lg ${
              currentXP >= level.xpRequired
                ? 'bg-brand-teal-50 dark:bg-brand-teal-900/20 border border-brand-teal-200 dark:border-brand-teal-800'
                : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t('common.level')} {level.level}
              </h3>
              {currentXP >= level.xpRequired ? (
                <span className="text-brand-teal-600 dark:text-brand-teal-400 text-sm font-medium">
                  {t('common.unlocked')}
                </span>
              ) : (
                <Lock size={16} className="text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <div className="space-y-2">
              {level.rewards.map((reward, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm text-muted"
                >
                  {reward.icon}
                  <span>{reward.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}