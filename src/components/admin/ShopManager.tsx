import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Plus, Trash2, Save, Star } from 'lucide-react';
import { InventoryItem } from '../../types';

interface ShopItem extends InventoryItem {
  price: number;
  available: boolean;
}

export default function ShopManager() {
  const { state } = useGame();
  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem('shopItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [newItem, setNewItem] = useState<Partial<ShopItem>>({
    type: 'material',
    rarity: 'common',
    price: 100,
    available: true
  });

  const addItem = () => {
    if (!newItem.name || !newItem.description || !newItem.price) return;

    const item: ShopItem = {
      id: `shop_${Date.now()}`,
      name: newItem.name,
      description: newItem.description,
      type: newItem.type || 'material',
      rarity: newItem.rarity || 'common',
      price: newItem.price,
      available: newItem.available ?? true,
      uses: newItem.uses
    };

    setShopItems([...shopItems, item]);
    setNewItem({
      type: 'material',
      rarity: 'common',
      price: 100,
      available: true
    });
  };

  const removeItem = (id: string) => {
    setShopItems(shopItems.filter(item => item.id !== id));
  };

  const saveItems = () => {
    localStorage.setItem('shopItems', JSON.stringify(shopItems));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Add Shop Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name || ''}
            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <select
            value={newItem.type || 'material'}
            onChange={e => setNewItem({ ...newItem, type: e.target.value as ShopItem['type'] })}
            className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="material">Material</option>
            <option value="booster">Booster</option>
            <option value="cosmetic">Cosmetic</option>
          </select>
          <div className="md:col-span-2">
            <textarea
              placeholder="Item Description"
              value={newItem.description || ''}
              onChange={e => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              rows={3}
            />
          </div>
          <select
            value={newItem.rarity || 'common'}
            onChange={e => setNewItem({ ...newItem, rarity: e.target.value as ShopItem['rarity'] })}
            className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
          <input
            type="number"
            placeholder="Price (coins)"
            value={newItem.price || ''}
            onChange={e => setNewItem({ ...newItem, price: parseInt(e.target.value) })}
            className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newItem.available ?? true}
              onChange={e => setNewItem({ ...newItem, available: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-300">Available</span>
          </div>
          <button
            onClick={addItem}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Add to Shop</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Shop Items</h3>
          <button
            onClick={saveItems}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Save size={20} />
            <span>Save Changes</span>
          </button>
        </div>
        <div className="space-y-4">
          {shopItems.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${
                item.available
                  ? 'border-gray-200 dark:border-gray-600'
                  : 'border-red-200 dark:border-red-800 opacity-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium dark:text-white">{item.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-300">{item.price}</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.rarity === 'legendary'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        : item.rarity === 'epic'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                        : item.rarity === 'rare'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    }`}>
                      {item.rarity}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">{item.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}