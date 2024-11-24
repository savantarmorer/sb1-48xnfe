import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useAdminActions } from '../../hooks/useAdminActions';
import { Plus, Star } from 'lucide-react';
import { GameItem } from '../../types/items';
import { motion } from 'framer-motion';
import Button from '../Button';
import ItemEditor from './ItemEditor';

type SaveItemFunction = (item: Partial<GameItem>) => Promise<void>;

export default function ShopManager() {
  const { state } = useGame();
  const { saveItem } = useAdminActions();
  const [shopItems, setShopItems] = useState<GameItem[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Partial<GameItem> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setShopItems(state.items || []);
  }, [state.items]);

  const handleSaveItem: SaveItemFunction = async (item) => {
    try {
      setIsLoading(true);
      await saveItem(item);
      setShowEditor(false);
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = (item: GameItem) => {
    setSelectedItem(item);
    setShowEditor(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      setIsLoading(true);
      await saveItem({ 
        id: itemId, 
        is_active: false 
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Shop Management</h2>
        <Button
          variant="primary"
          onClick={() => setShowEditor(true)}
          icon={<Plus size={16} />}
          disabled={isLoading}
        >
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopItems.map(item => (
          <motion.div
            key={item.id}
            layout
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    <Star className="inline-block w-4 h-4 text-yellow-500 mr-1" />
                    {item.cost} Coins
                  </span>
                  <span className={`badge ${
                    item.rarity === 'legendary' ? 'badge-warning' :
                    item.rarity === 'epic' ? 'badge-purple' :
                    item.rarity === 'rare' ? 'badge-info' :
                    'badge-gray'
                  }`}>
                    {item.rarity}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditItem(item)}
                  disabled={isLoading}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showEditor && (
        <ItemEditor
          item={selectedItem}
          onSave={handleSaveItem}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}

/**
 * ShopManager Component
 * 
 * Purpose:
 * - Manages shop items and their properties
 * - Handles item pricing and availability
 * 
 * Dependencies:
 * - useGame: For accessing item state
 * - useAdminActions: For item CRUD operations
 * 
 * Used by:
 * - AdminDashboard component
 * 
 * State management:
 * - Local state for shop items
 * - Global state sync through GameContext
 * 
 * Database interactions:
 * - Creates/updates items in Supabase
 * - Syncs with GameContext state
 */