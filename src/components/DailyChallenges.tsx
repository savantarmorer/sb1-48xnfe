import React from 'react';
import { CheckCircle2, Circle, Timer, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ChallengeProps {
  title: string;
  description: string;
  progress: number;
  total: number;
  xp: number;
  completed: boolean;
}

export default function DailyChallenges() {
  const { t } = useLanguage();

  return (
    <div className="card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="heading text-xl">{t('challenges.dailyTitle')}</h2>
        <div className="flex items-center space-x-2">
          <Timer className="text-primary-500" size={20} />
          <span className="text-muted">{t('challenges.resetsIn')} 8h 45m</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <Challenge
          title={t('challenges.caseStudy')}
          description={t('challenges.caseStudyDesc')}
          progress={2}
          total={3}
          xp={150}
          completed={false}
        />
        <Challenge
          title={t('challenges.forumParticipation')}
          description={t('challenges.forumParticipationDesc')}
          progress={2}
          total={2}
          xp={100}
          completed={true}
        />
        <Challenge
          title={t('challenges.quizChampion')}
          description={t('challenges.quizChampionDesc')}
          progress={0}
          total={1}
          xp={200}
          completed={false}
        />
      </div>
    </div>
  );
}

function Challenge({
  title,
  description,
  progress,
  total,
  xp,
  completed
}: ChallengeProps) {
  return (
    <div className={`p-4 rounded-lg border ${completed ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {completed ? (
              <CheckCircle2 className="text-green-500" size={20} />
            ) : (
              <Circle className="text-gray-400 dark:text-gray-500" size={20} />
            )}
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
          </div>
          <p className="text-muted mt-1 ml-7">{description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="text-yellow-500" size={20} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">+{xp} XP</span>
        </div>
      </div>
      {!completed && (
        <div className="mt-3 ml-7">
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>Progress</span>
            <span>{progress}/{total}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-2 bg-primary-500 rounded-full"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}