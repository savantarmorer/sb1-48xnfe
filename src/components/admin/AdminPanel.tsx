import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Save } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  deadline: Date;
  type: 'daily' | 'weekly' | 'epic';
  requirements?: string[];
}

interface AdminPanelProps {
  quests: Quest[];
  onUpdateQuests: (quests: Quest[]) => void;
  onClose: () => void;
}

export default function AdminPanel({ quests, onUpdateQuests, onClose }: AdminPanelProps) {
  const [editingQuests, setEditingQuests] = useState<Quest[]>(quests);
  const [newRequirement, setNewRequirement] = useState('');

  const addQuest = () => {
    const newQuest: Quest = {
      id: `quest_${Date.now()}`,
      title: '',
      description: '',
      xpReward: 100,
      coinReward: 50,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      type: 'daily',
      requirements: []
    };
    setEditingQuests([...editingQuests, newQuest]);
  };

  const updateQuest = (index: number, field: keyof Quest, value: any) => {
    const updated = [...editingQuests];
    updated[index] = { ...updated[index], [field]: value };
    setEditingQuests(updated);
  };

  const removeQuest = (index: number) => {
    setEditingQuests(editingQuests.filter((_, i) => i !== index));
  };

  const addRequirement = (questIndex: number) => {
    if (!newRequirement.trim()) return;
    const updated = [...editingQuests];
    updated[questIndex].requirements = [
      ...(updated[questIndex].requirements || []),
      newRequirement.trim()
    ];
    setEditingQuests(updated);
    setNewRequirement('');
  };

  const removeRequirement = (questIndex: number, reqIndex: number) => {
    const updated = [...editingQuests];
    updated[questIndex].requirements = updated[questIndex].requirements?.filter(
      (_, i) => i !== reqIndex
    );
    setEditingQuests(updated);
  };

  const saveChanges = () => {
    onUpdateQuests(editingQuests);
    localStorage.setItem('quests', JSON.stringify(editingQuests));
    onClose();
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
        className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Quest Management</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {editingQuests.map((quest, index) => (
            <div key={quest.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">Quest #{index + 1}</h3>
                <button
                  onClick={() => removeQuest(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={quest.title}
                    onChange={(e) => updateQuest(index, 'title', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={quest.type}
                    onChange={(e) => updateQuest(index, 'type', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="epic">Epic</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={quest.description}
                    onChange={(e) => updateQuest(index, 'description', e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    XP Reward
                  </label>
                  <input
                    type="number"
                    value={quest.xpReward}
                    onChange={(e) => updateQuest(index, 'xpReward', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Coin Reward
                  </label>
                  <input
                    type="number"
                    value={quest.coinReward}
                    onChange={(e) => updateQuest(index, 'coinReward', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Requirements
                  </label>
                  <div className="mt-1 space-y-2">
                    {quest.requirements?.map((req, reqIndex) => (
                      <div key={reqIndex} className="flex items-center space-x-2">
                        <span className="flex-1">{req}</span>
                        <button
                          onClick={() => removeRequirement(index, reqIndex)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="Add requirement"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <button
                        onClick={() => addRequirement(index)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={addQuest}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Quest</span>
          </button>
          <button
            onClick={saveChanges}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Save size={20} />
            <span>Save Changes</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}