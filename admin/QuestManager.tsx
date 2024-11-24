import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useAdminActions } from '../../hooks/useAdminActions';
import QuestEditor from './QuestEditor';
import Button from '../Button';
import { Quest } from '../../types/quests';

type QuestWithId = Quest & Required<Pick<Quest, 'id'>>;

interface QuestManagerState {
  showEditor: boolean;
  selectedQuest?: QuestWithId;
  isLoading: boolean;
}

export default function QuestManager() {
  const { state } = useGame();
  const { saveQuest } = useAdminActions();
  const [localState, setLocalState] = useState<QuestManagerState>({
    showEditor: false,
    selectedQuest: undefined,
    isLoading: false
  });

  const handleEditQuest = (quest: Quest) => {
    setLocalState({
      ...localState,
      selectedQuest: quest as QuestWithId
    });
    setLocalState({
      ...localState,
      showEditor: true
    });
  };

  const handleAddQuest = () => {
    setLocalState({
      ...localState,
      selectedQuest: undefined,
      showEditor: true
    });
  };

  const handleSaveQuest = async (quest: Partial<Quest>) => {
    try {
      setLocalState({
        ...localState,
        isLoading: true
      });
      await saveQuest(quest);
      setLocalState({
        ...localState,
        showEditor: false
      });
    } catch (error) {
      console.error('Error saving quest:', error);
    } finally {
      setLocalState({
        ...localState,
        isLoading: false
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Quest Management</h2>
        <Button
          variant="primary"
          onClick={handleAddQuest}
          icon={<Plus size={16} />}
        >
          Add Quest
        </Button>
      </div>

      <div className="grid gap-4">
        {state.quests?.map((quest) => (
          <motion.div
            key={quest.id}
            layout
            className="card"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{quest.title}</h3>
                <p className="text-sm text-muted">{quest.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`badge ${
                    quest.type === 'epic' ? 'badge-warning' :
                    quest.type === 'weekly' ? 'badge-info' :
                    'badge-success'
                  }`}>
                    {quest.type}
                  </span>
                  <span className="text-sm text-muted">
                    XP: {quest.xpReward} | Coins: {quest.coinReward}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditQuest(quest)}
                icon={<Settings size={16} />}
              >
                Edit
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {localState.showEditor && (
        <QuestEditor
          quest={localState.selectedQuest}
          onSave={handleSaveQuest}
          onClose={() => setLocalState({
            ...localState,
            showEditor: false
          })}
        />
      )}
    </div>
  );
}