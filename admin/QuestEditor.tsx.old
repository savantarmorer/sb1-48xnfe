import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { Quest, QuestType, QuestRequirement, QuestRequirementType } from '../../types/quests';
import Button from '../Button';

interface QuestEditorProps {
  quest?: Quest;
  onSave: (quest: Partial<Quest>) => void;
  onClose: () => void;
}

type LootboxRarity = 'common' | 'rare' | 'epic' | 'legendary';

export default function QuestEditor({ quest, onSave, onClose }: QuestEditorProps) {
  const [editingQuest, setEditingQuest] = useState<Partial<Quest>>({
    title: '',
    description: '',
    type: 'daily' as QuestType,
    xpReward: 100,
    coinReward: 50,
    requirements: [] as QuestRequirement[],
    progress: 0,
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
    lootbox: {
      rarity: 'common' as LootboxRarity,
      contents: []
    },
    ...quest
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleAddRequirement = () => {
    const newRequirement: QuestRequirement = {
      id: `req_${Date.now()}`,
      description: '',
      type: 'level',
      value: 0,
      completed: false
    };

    setEditingQuest(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), newRequirement]
    }));
  };

  const handleUpdateRequirement = (index: number, updates: Partial<QuestRequirement>) => {
    setEditingQuest(prev => ({
      ...prev,
      requirements: prev.requirements?.map((req, i) => 
        i === index ? { 
          ...req, 
          ...updates,
          type: updates.type as QuestRequirementType || req.type
        } : req
      ) || []
    }));
  };

  const handleRemoveRequirement = (index: number) => {
    setEditingQuest(prev => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index) || []
    }));
  };

  const handleTypeChange = (value: string) => {
    setEditingQuest(prev => ({
      ...prev,
      type: value as QuestType,
      deadline: new Date(Date.now() + (value === 'weekly' ? 7 : 1) * 24 * 60 * 60 * 1000)
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onSave(editingQuest);
      onClose();
    } catch (error) {
      console.error('Error saving quest:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLootboxChange = (rarity: LootboxRarity) => {
    setEditingQuest(prev => ({
      ...prev,
      lootbox: {
        rarity,
        contents: prev.lootbox?.contents || []
      }
    }));
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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Quest Editor</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={editingQuest.title}
              onChange={e => setEditingQuest(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={editingQuest.description}
              onChange={e => setEditingQuest(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Requirements</label>
            <div className="space-y-2">
              {editingQuest.requirements?.map((req, index) => (
                <div key={req.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={req.description}
                    onChange={e => handleUpdateRequirement(index, { description: e.target.value })}
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <button
                    onClick={() => handleRemoveRequirement(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddRequirement}
                icon={<Plus size={16} />}
              >
                Add Requirement
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">XP Reward</label>
              <input
                type="number"
                value={editingQuest.xpReward}
                onChange={e => setEditingQuest(prev => ({ ...prev, xpReward: parseInt(e.target.value) }))}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Coin Reward</label>
              <input
                type="number"
                value={editingQuest.coinReward}
                onChange={e => setEditingQuest(prev => ({ ...prev, coinReward: parseInt(e.target.value) }))}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={editingQuest.type}
                onChange={e => handleTypeChange(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="epic">Epic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lootbox Rarity</label>
              <select
                value={editingQuest.lootbox?.rarity || 'common'}
                onChange={e => handleLootboxChange(e.target.value as LootboxRarity)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              icon={<Save size={16} />}
              disabled={isLoading}
            >
              Save Quest
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}