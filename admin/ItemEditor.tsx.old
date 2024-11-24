import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { GameItem, ItemType, ItemEffect, ItemRequirement, ItemRarity } from '../../types/items';
import Button from '../Button';
import type { Json } from '../../types/supabase';

interface ItemEditorProps {
  item?: Partial<GameItem>;
  onSave: (item: Partial<GameItem>) => Promise<void>;
  onClose: () => void;
}

// Add FormData interface
interface FormData extends Partial<GameItem> {
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  cost: number;
  effects: ItemEffect[];
  requirements: ItemRequirement[];
  metadata: Record<string, Json>;
  is_active: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

/**
 * ItemEditor Component
 * 
 * Handles creation and editing of game items
 * Provides form validation and effect/requirement management
 * 
 * Dependencies:
 * - GameItem types
 * - Button component
 * - Framer Motion for animations
 */
export default function ItemEditor({ item, onSave, onClose }: ItemEditorProps) {
  const [formData, setFormData] = useState<FormData>({
    name: item?.name || '',
    description: item?.description || '',
    type: item?.type || 'material',
    rarity: item?.rarity || 'common',
    cost: item?.cost || 0,
    effects: item?.effects || [],
    requirements: item?.requirements || [],
    metadata: item?.metadata || {},
    is_active: item?.is_active ?? true,
    ...item // Spread remaining properties
  });

  const [error, setError] = useState<string | null>(null);

  /**
   * Validates form data before submission
   * Returns true if valid, false otherwise
   */
  const validateForm = (): { valid: boolean; errors: ValidationError[] } => {
    const errors: ValidationError[] = [];

    if (!formData.name?.trim()) {
      errors.push({ field: 'name', message: 'Name is required' });
    }
    if (!formData.description?.trim()) {
      errors.push({ field: 'description', message: 'Description is required' });
    }
    if (formData.cost === undefined || formData.cost < 0) {
      errors.push({ field: 'cost', message: 'Cost must be a positive number' });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  /**
   * Handles form submission
   * Validates data and calls onSave callback
   */
  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.valid) {
      setError(validation.errors[0].message);
      return;
    }
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setError('Failed to save item');
    }
  };

  /**
   * Adds a new effect to the item
   */
  const addEffect = () => {
    setFormData(prev => ({
      ...prev,
      effects: [
        ...(prev.effects || []),
        { type: 'xp_boost', value: 0 }
      ]
    }));
  };

  /**
   * Adds a new requirement to the item
   */
  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [
        ...(prev.requirements || []),
        { type: 'level', value: 1, comparison: 'gte' }
      ]
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
          <h2 className="text-xl font-bold dark:text-white">
            {item ? 'Edit Item' : 'Create Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost</label>
              <input
                type="number"
                value={formData.cost}
                onChange={e => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) }))}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Type and Rarity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as ItemType }))}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="material">Material</option>
                <option value="booster">Booster</option>
                <option value="cosmetic">Cosmetic</option>
                <option value="consumable">Consumable</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rarity</label>
              <select
                value={formData.rarity}
                onChange={e => setFormData(prev => ({ ...prev, rarity: e.target.value as GameItem['rarity'] }))}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          {/* Effects */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Effects</label>
              <Button
                variant="outline"
                size="sm"
                onClick={addEffect}
              >
                Add Effect
              </Button>
            </div>
            {formData.effects?.map((effect, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <select
                  value={effect.type}
                  onChange={e => {
                    const newEffects = [...(formData.effects || [])];
                    newEffects[index] = { ...effect, type: e.target.value as ItemEffect['type'] };
                    setFormData(prev => ({ ...prev, effects: newEffects }));
                  }}
                  className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="xp_boost">XP Boost</option>
                  <option value="coin_boost">Coin Boost</option>
                  <option value="study_boost">Study Boost</option>
                  <option value="score_boost">Score Boost</option>
                </select>
                <input
                  type="number"
                  value={effect.value}
                  onChange={e => {
                    const newEffects = [...(formData.effects || [])];
                    newEffects[index] = { ...effect, value: parseInt(e.target.value) };
                    setFormData(prev => ({ ...prev, effects: newEffects }));
                  }}
                  className="w-24 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newEffects = [...(formData.effects || [])];
                    newEffects.splice(index, 1);
                    setFormData(prev => ({ ...prev, effects: newEffects }));
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Requirements</label>
              <Button
                variant="outline"
                size="sm"
                onClick={addRequirement}
              >
                Add Requirement
              </Button>
            </div>
            {formData.requirements?.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <select
                  value={requirement.type}
                  onChange={e => {
                    const newRequirements = [...(formData.requirements || [])];
                    newRequirements[index] = { ...requirement, type: e.target.value as ItemRequirement['type'] };
                    setFormData(prev => ({ ...prev, requirements: newRequirements }));
                  }}
                  className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="level">Level</option>
                  <option value="achievement">Achievement</option>
                  <option value="quest">Quest</option>
                  <option value="item">Item</option>
                </select>
                <input
                  type="text"
                  value={requirement.value}
                  onChange={e => {
                    const newRequirements = [...(formData.requirements || [])];
                    newRequirements[index] = { ...requirement, value: e.target.value };
                    setFormData(prev => ({ ...prev, requirements: newRequirements }));
                  }}
                  className="w-24 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <select
                  value={requirement.comparison}
                  onChange={e => {
                    const newRequirements = [...(formData.requirements || [])];
                    newRequirements[index] = { ...requirement, comparison: e.target.value as 'eq' | 'gte' | 'lte' };
                    setFormData(prev => ({ ...prev, requirements: newRequirements }));
                  }}
                  className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="eq">Equal</option>
                  <option value="gte">Greater or Equal</option>
                  <option value="lte">Less or Equal</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newRequirements = [...(formData.requirements || [])];
                    newRequirements.splice(index, 1);
                    setFormData(prev => ({ ...prev, requirements: newRequirements }));
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={e => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label className="text-sm font-medium">Active</label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            icon={<Save size={16} />}
          >
            Save Item
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
} 