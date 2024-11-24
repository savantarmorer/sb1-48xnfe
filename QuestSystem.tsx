import React from 'react';
import { useGame } from '../contexts/GameContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';

export default function QuestSystem() {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();
  const { showNotification } = useNotification();

  const handleQuestComplete = async (questId: string, rewards: any[]) => {
    try {
      dispatch({
        type: 'COMPLETE_QUEST',
        payload: { questId, rewards }
      });

      showNotification({
        type: 'success',
        message: t('quests.completed'),
        description: t('quests.rewardsEarned', { 
          xp: rewards.find(r => r.type === 'xp')?.value || 0,
          coins: rewards.find(r => r.type === 'coins')?.value || 0
        })
      });
    } catch (error) {
      showNotification({
        type: 'error',
        message: t('quests.error'),
        description: t('quests.errorDescription')
      });
    }
  };

  const calculateQuestProgress = (quest: any) => {
    // Calculate progress based on quest type
    switch (quest.type) {
      case 'battle':
        return (state.battleStats?.battlesWon || 0) / quest.target;
      case 'streak':
        return state.user.streak / quest.target;
      case 'xp':
        return state.user.xp / quest.target;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">
        {t('quests.title')}
      </h2>
      <div className="grid gap-4">
        {state.quests?.map((quest) => {
          const progress = calculateQuestProgress(quest);
          const isCompleted = state.completedQuests?.includes(quest.id);
          const canClaim = progress >= 1 && !isCompleted;

          return (
            <div
              key={quest.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <h3 className="font-semibold">{quest.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {quest.description}
              </p>
              
              {/* Progress bar */}
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${Math.min(progress * 100, 100)}%` }}
                />
              </div>
              
              {/* Progress text */}
              <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                {Math.floor(progress * 100)}% {t('quests.complete')}
              </p>

              {/* Rewards */}
              <div className="mt-2 flex gap-2">
                {quest.rewards.map((reward: any, index: number) => (
                  <span 
                    key={index}
                    className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    {reward.type === 'xp' ? '✨' : '💰'} {reward.value}
                  </span>
                ))}
              </div>

              {/* Claim button */}
              {canClaim && (
                <button
                  onClick={() => handleQuestComplete(quest.id, quest.rewards)}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  {t('quests.claim')}
                </button>
              )}
              
              {isCompleted && (
                <span className="mt-2 inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  {t('quests.completed')}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}