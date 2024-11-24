import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Plus, Edit, Trash2, Save } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { Achievement } from '../../types/achievements';
import { supabase } from '../../lib/supabase';
import Button from '../Button';

export default function AchievementManager() {
  const { state, dispatch } = useGame();
  const [achievements, setAchievements] = useState<Achievement[]>(state.achievements);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Achievement>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      if (data) {
        setAchievements(data);
        dispatch({ type: 'SYNC_ACHIEVEMENTS', payload: data });
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingId(achievement.id);
    setEditForm(achievement);
  };

  const handleSave = async () => {
    if (!editForm.id) return;
    setLoading(true);

    try {
      const updatedAchievement: Achievement = {
        id: editForm.id,
        title: editForm.title || '',
        description: editForm.description || '',
        category: editForm.category || 'general',
        points: editForm.points || 0,
        rarity: editForm.rarity || 'common',
        unlocked: false,
        unlockedAt: new Date(),
        prerequisites: editForm.prerequisites || [],
        dependents: editForm.dependents || [],
        triggerConditions: editForm.triggerConditions || [],
        order: editForm.order || 0
      };

      const { error } = await supabase
        .from('achievements')
        .upsert(updatedAchievement);

      if (error) throw error;

      setAchievements(prev => 
        prev.map(a => a.id === updatedAchievement.id ? updatedAchievement : a)
      );

      dispatch({
        type: 'UPDATE_ACHIEVEMENT',
        payload: updatedAchievement
      });

      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error saving achievement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAchievements(prev => prev.filter(a => a.id !== id));
      dispatch({
        type: 'REMOVE_ACHIEVEMENT',
        payload: id
      });
    } catch (error) {
      console.error('Error deleting achievement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const newAchievement: Achievement = {
      id: `achievement_${Date.now()}`,
      title: 'New Achievement',
      description: 'Achievement description',
      category: 'general',
      points: 10,
      rarity: 'common',
      unlocked: false,
      unlockedAt: new Date(),
      prerequisites: [],
      dependents: [],
      triggerConditions: [],
      order: achievements.length
    };

    try {
      const { error } = await supabase
        .from('achievements')
        .insert([newAchievement]);

      if (error) throw error;

      setAchievements(prev => [...prev, newAchievement]);
      dispatch({
        type: 'ADD_ACHIEVEMENT',
        payload: newAchievement
      });
      handleEdit(newAchievement);
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Achievement Manager</h2>
        <Button
          variant="primary"
          onClick={handleAdd}
          icon={<Plus size={20} />}
          disabled={loading}
        >
          Add Achievement
        </Button>
      </div>

      <div className="space-y-4">
        {achievements.map(achievement => (
          <motion.div
            key={achievement.id}
            layout
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            {editingId === achievement.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Achievement Title"
                />
                <textarea
                  value={editForm.description || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Achievement Description"
                />
                <div className="flex space-x-4">
                  <input
                    type="number"
                    value={editForm.points || 0}
                    onChange={e => setEditForm(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                    className="w-24 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Points"
                  />
                  <select
                    value={editForm.rarity || 'common'}
                    onChange={e => setEditForm(prev => ({ ...prev, rarity: e.target.value as Achievement['rarity'] }))}
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({});
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    icon={<Save size={20} />}
                    disabled={loading}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold dark:text-white">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Trophy size={16} className="text-yellow-500" />
                    <span className="text-sm">{achievement.points} points</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                      achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                      achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {achievement.rarity}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(achievement)}
                    icon={<Edit size={20} />}
                    disabled={loading}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(achievement.id)}
                    icon={<Trash2 size={20} />}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 

