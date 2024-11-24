import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X as CloseIcon, 
  Settings as SettingsIcon, 
  RotateCcw, 
  Play, 
  Save
} from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useAdmin } from '../../hooks/useAdmin';
import Button from '../Button';

/**
 * Interface for Debug Menu props
 */
interface DebugMenuProps {
  onClose: () => void;
}

/**
 * Interface for quest progress tracking
 */
interface QuestProgress {
  [questId: string]: number;
}

/**
 * Interface for reward multipliers
 */
interface RewardMultipliers {
  xp: number;
  coins: number;
}

/**
 * Interface for achievement progress tracking
 */
interface AchievementProgress {
  [achievementId: string]: number;
}

/**
 * Available debug tabs
 */
type DebugTab = 'quests' | 'rewards' | 'streak' | 'achievements';

/**
 * Interface for local state
 */
interface DebugMenuState {
  activeTab: DebugTab;
  questProgress: QuestProgress;
  rewardMultipliers: RewardMultipliers;
  achievementProgress: AchievementProgress;
  isLoading: boolean;
}

/**
 * DebugMenu Component
 * Provides admin tools for testing and debugging game features
 */
export default function DebugMenu({ onClose }: DebugMenuProps) {
  const { state, dispatch } = useGame();
  const { debugActions } = useAdmin();
  const [localState, setLocalState] = useState<DebugMenuState>({
    activeTab: 'quests',
    questProgress: {},
    rewardMultipliers: {
      xp: 1,
      coins: 1
    },
    achievementProgress: {},
    isLoading: false
  });

  /**
   * Updates local state
   * @param updates - Partial state updates
   */
  const updateState = (updates: Partial<DebugMenuState>) => {
    setLocalState(prev => ({ ...prev, ...updates }));
  };

  /**
   * Simulates quest progress update
   * @param questId - ID of the quest to update
   * @param progress - New progress value
   */
  const simulateQuestProgress = (questId: string, progress: number) => {
    updateState({
      questProgress: {
        ...localState.questProgress,
        [questId]: progress
      }
    });

    dispatch({
      type: 'SYNC_QUEST_PROGRESS',
      payload: { questId, progress }
    });
  };

  /**
   * Updates reward multipliers
   * Affects XP and coin gains
   */
  const updateRewardMultipliers = () => {
    dispatch({
      type: 'UPDATE_REWARD_MULTIPLIERS',
      payload: localState.rewardMultipliers
    });
  };

  /**
   * Resets user streak
   * Used for testing streak-based features
   */
  const handleResetStreak = () => {
    debugActions.resetStreak();
  };

  /**
   * Simulates user login
   * Used for testing daily rewards and streaks
   */
  const handleSimulateLogin = () => {
    debugActions.simulateLogin();
  };

  /**
   * Updates achievement progress
   * @param achievementId - ID of the achievement
   * @param progress - New progress value
   */
  const handleAchievementProgress = (achievementId: string, progress: number) => {
    updateState({
      achievementProgress: {
        ...localState.achievementProgress,
        [achievementId]: progress
      }
    });

    dispatch({
      type: 'UPDATE_ACHIEVEMENT_PROGRESS',
      payload: {
        id: achievementId,
        progress
      }
    });
  };

  /**
   * Available debug tabs configuration
   */
  const tabs: Array<{ id: DebugTab; label: string }> = [
    { id: 'quests', label: 'Quests' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'streak', label: 'Streak' },
    { id: 'achievements', label: 'Achievements' }
  ];

  /**
   * Renders content based on active tab
   */
  const renderTabContent = () => {
    switch (localState.activeTab) {
      case 'quests':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold dark:text-white">Quest Progress Simulation</h3>
            {state.quests?.map(quest => (
              <div key={quest.id} className="flex items-center space-x-4">
                <span className="text-sm font-medium">{quest.title}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localState.questProgress[quest.id] || 0}
                  onChange={e => {
                    setLocalState(prev => ({
                      ...prev,
                      questProgress: {
                        ...prev.questProgress,
                        [quest.id]: parseInt(e.target.value)
                      }
                    }));
                    simulateQuestProgress(quest.id, parseInt(e.target.value));
                  }}
                  className="flex-1"
                />
                <span className="text-sm">{localState.questProgress[quest.id] || 0}%</span>
              </div>
            ))}
          </div>
        );

      case 'rewards':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold dark:text-white">Reward Multipliers</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">XP Multiplier</label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={localState.rewardMultipliers.xp}
                  onChange={e => setLocalState(prev => ({
                    ...prev,
                    rewardMultipliers: {
                      ...prev.rewardMultipliers,
                      xp: parseFloat(e.target.value)
                    }
                  }))}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coin Multiplier</label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={localState.rewardMultipliers.coins}
                  onChange={e => setLocalState(prev => ({
                    ...prev,
                    rewardMultipliers: {
                      ...prev.rewardMultipliers,
                      coins: parseFloat(e.target.value)
                    }
                  }))}
                  className="input w-full"
                />
              </div>
            </div>
            <Button
              variant="primary"
              onClick={updateRewardMultipliers}
              icon={<Save size={16} />}
            >
              Apply Multipliers
            </Button>
          </div>
        );

      case 'streak':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold dark:text-white">Streak Controls</h3>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleResetStreak}
                icon={<RotateCcw size={16} />}
              >
                Reset Streak
              </Button>
              <Button
                variant="outline"
                onClick={handleSimulateLogin}
                icon={<Play size={16} />}
              >
                Simulate Login
              </Button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current streak: {state.user.streak} days
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold dark:text-white">Achievement Progress</h3>
            {state.achievements?.map(achievement => (
              <div key={achievement.id} className="flex items-center space-x-4">
                <span className="text-sm font-medium">{achievement.title}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localState.achievementProgress[achievement.id] || 0}
                  onChange={e => {
                    const newProgress = parseInt(e.target.value);
                    setLocalState(prev => ({
                      ...prev,
                      achievementProgress: {
                        ...prev.achievementProgress,
                        [achievement.id]: newProgress
                      }
                    }));
                    handleAchievementProgress(achievement.id, newProgress);
                  }}
                  className="flex-1"
                />
                <span className="text-sm">{localState.achievementProgress[achievement.id] || 0}%</span>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <SettingsIcon size={24} className="text-gray-400" />
            <h2 className="text-2xl font-bold dark:text-white">Debug Menu</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <CloseIcon size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setLocalState(prev => ({ ...prev, activeTab: tab.id }))}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                localState.activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Component Dependencies:
 * - useGame: For accessing and modifying game state
 * - useAdmin: For admin-specific actions
 * - Button: For UI interactions
 * - Framer Motion: For animations
 * 
 * State Management:
 * - Local state for UI and form data
 * - Global state through GameContext
 * 
 * Features:
 * - Quest progress simulation
 * - Reward multiplier adjustment
 * - Streak manipulation
 * - Achievement progress control
 * 
 * Used By:
 * - AdminDashboard component
 * 
 * Scalability Considerations:
 * - Modular tab system
 * - Separate interfaces for data types
 * - Reusable components
 * - Easy to add new debug features
 */