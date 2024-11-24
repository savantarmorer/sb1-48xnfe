import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play, RotateCcw, Save } from 'lucide-react';
import Button from '../Button';

interface AdminPanelProps {
  onClose: () => void;
  rewards: Array<{
    day: number;
    reward: {
      type: string;
      value: number;
      rarity: string;
    };
  }>;
  onUpdateRewards: (rewards: any[]) => void;
}

export default function AdminPanel({
  onClose,
  rewards,
  onUpdateRewards
}: AdminPanelProps) {
  const [editingRewards, setEditingRewards] = useState(rewards);
  const [previewMode, setPreviewMode] = useState<string | null>(null);

  const handleRewardUpdate = (index: number, field: string, value: any) => {
    const updated = [...editingRewards];
    updated[index] = {
      ...updated[index],
      reward: {
        ...updated[index].reward,
        [field]: value
      }
    };
    setEditingRewards(updated);
  };

  const handleSave = () => {
    onUpdateRewards(editingRewards);
    onClose();
  };

  const handlePreview = (mode: string) => {
    setPreviewMode(mode);
    setTimeout(() => setPreviewMode(null), 3000);
  };

  const handleResetStreak = () => {
    // Dispatch reset streak action
    console.log('Streak reset');
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
          <h2 className="text-2xl font-bold dark:text-white">
            Daily Rewards Debug Panel
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold dark:text-white">Preview Effects</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Play size={16} />}
                  onClick={() => handlePreview('common')}
                  loading={previewMode === 'common'}
                >
                  Common Reward
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Play size={16} />}
                  onClick={() => handlePreview('legendary')}
                  loading={previewMode === 'legendary'}
                >
                  Legendary Reward
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold dark:text-white">Streak Controls</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<RotateCcw size={16} />}
                  onClick={handleResetStreak}
                >
                  Reset Streak
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 dark:text-white">Reward Values</h3>
            <div className="space-y-4">
              {editingRewards.map((reward, index) => (
                <div
                  key={reward.day}
                  className="grid grid-cols-4 gap-4 items-center"
                >
                  <div className="text-sm font-medium dark:text-white">
                    Day {reward.day}
                  </div>
                  <select
                    value={reward.reward.type}
                    onChange={(e) =>
                      handleRewardUpdate(index, 'type', e.target.value)
                    }
                    className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  >
                    <option value="xp">XP</option>
                    <option value="coins">Coins</option>
                    <option value="item">Item</option>
                  </select>
                  <input
                    type="number"
                    value={reward.reward.value}
                    onChange={(e) =>
                      handleRewardUpdate(index, 'value', parseInt(e.target.value))
                    }
                    className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <select
                    value={reward.reward.rarity}
                    onChange={(e) =>
                      handleRewardUpdate(index, 'rarity', e.target.value)
                    }
                    className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  >
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={<Save size={16} />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}