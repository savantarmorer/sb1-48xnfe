import React, { useState } from 'react';
import { Circle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { Quest, QuestType } from '../../types/quests';
import LootBox from '../LootBox';
import { RewardService } from '../../services/rewardService';
import { useNotification } from '../../contexts/NotificationContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { Reward } from '../../types/rewards';
import { NotificationMessage } from '../../types/notifications';

interface MissionListProps {
  missions: Quest[];
  onMissionComplete?: (mission: Quest) => void;
}

export default function MissionList({ missions, onMissionComplete }: MissionListProps) {
  const { state, dispatch } = useGame();
  const [showLootBox, setShowLootBox] = useState(false);
  const [currentRewards, setCurrentRewards] = useState<Reward[]>([]);
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  const handleCompleteMission = async (mission: Quest) => {
    if (!mission.id || state.completedQuests.includes(mission.id)) return;

    // Calculate rewards
    const rewards = RewardService.calculateRewards({
      type: 'quest',
      data: mission
    });
    setCurrentRewards(rewards);
    setShowLootBox(true);

    // Update game state
    dispatch({ 
      type: 'UPDATE_USER_STATS', 
      payload: {
        xp: rewards.reduce((sum: number, r: Reward) => r.type === 'xp' ? sum + Number(r.value) : sum, 0),
        coins: rewards.reduce((sum: number, r: Reward) => r.type === 'coins' ? sum + Number(r.value) : sum, 0),
        streak: state.user.streak // Maintain current streak
      }
    });

    // Mark quest as completed
    dispatch({ 
      type: 'COMPLETE_QUEST', 
      payload: {
        questId: mission.id,
        rewards
      }
    });

    // Show notification
    const notificationMessage: NotificationMessage = {
      title: t('quest.completed'),
      description: mission.title,
      questId: mission.id,
      rewardsList: rewards
    };

    showNotification({
      type: 'quest',
      message: notificationMessage,
      duration: 5000
    });

    // Callback if provided
    if (onMissionComplete) {
      onMissionComplete(mission);
    }
  };

  const getQuestTypeLabel = (type: QuestType): string => {
    switch (type) {
      case 'daily':
        return t('quest.type.daily');
      case 'weekly':
        return t('quest.type.weekly');
      case 'story':
        return t('quest.type.story');
      case 'achievement':
        return t('quest.type.achievement');
      default:
        return type;
    }
  };

  const getQuestTypeClass = (type: QuestType): string => {
    switch (type) {
      case 'daily':
        return 'badge-success';
      case 'weekly':
        return 'badge-info';
      case 'story':
        return 'badge-warning';
      case 'achievement':
        return 'badge-purple';
      default:
        return 'badge-default';
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {missions.map((mission) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${
              mission.id && state.completedQuests.includes(mission.id)
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  {mission.id && state.completedQuests.includes(mission.id) ? (
                    <CheckCircle2 className="text-green-500" size={20} />
                  ) : (
                    <Circle className="text-gray-400 dark:text-gray-500" size={20} />
                  )}
                  <h3 className="text-lg font-semibold dark:text-white">
                    {mission.title}
                  </h3>
                  <span className={`badge ${getQuestTypeClass(mission.type)}`}>
                    {getQuestTypeLabel(mission.type)}
                  </span>
                </div>
                <p className="text-muted mt-1 ml-7">{mission.description}</p>

                {mission.requirements && (
                  <ul className="mt-2 ml-7 space-y-1">
                    {mission.requirements.map((req, index) => (
                      <li key={index} className="flex items-center space-x-2 text-muted">
                        <Circle size={6} />
                        <span>{req.description}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  {mission.rewards?.map((reward, index) => (
                    <span
                      key={index}
                      className="text-sm font-medium text-gray-600 dark:text-gray-300"
                    >
                      +{reward.value} {reward.type}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleCompleteMission(mission)}
                  disabled={mission.id && state.completedQuests.includes(mission.id)}
                  className={`btn ${
                    mission.id && state.completedQuests.includes(mission.id)
                      ? 'btn-secondary opacity-50 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {mission.id && state.completedQuests.includes(mission.id) 
                    ? t('quest.completed') 
                    : t('quest.complete')}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {showLootBox && (
        <LootBox
          isOpen={showLootBox}
          onClose={() => setShowLootBox(false)}
          rewards={currentRewards}
          source="quest"
        />
      )}
    </div>
  );
}