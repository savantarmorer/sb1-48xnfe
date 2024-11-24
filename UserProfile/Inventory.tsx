import React from 'react';
import { motion } from 'framer-motion';
import { Package, Star } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { InventoryItem } from '../../types';

export default function Inventory() {
  const { state, dispatch } = useGame();
  const { inventory = [], backpack = [] } = state.user;

  const handleEquip = (item: InventoryItem) => {
    dispatch({
      type: 'EQUIP_ITEM',
      payload: { itemId: item.id }
    });
  };

  const handleUnequip = (item: InventoryItem) => {
    dispatch({
      type: 'UNEQUIP_ITEM',
      payload: { itemId: item.id }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">Inventory</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {backpack.length}/10 slots used
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-3 dark:text-white">Equipped Items</h3>
          <div className="space-y-2">
            {backpack.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium dark:text-white">{item.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUnequip(item)}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Unequip
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 dark:text-white">Available Items</h3>
          <div className="space-y-2">
            {inventory
              .filter(item => !backpack.some(equipped => equipped.id === item.id))
              .map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium dark:text-white">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEquip(item)}
                      disabled={backpack.length >= 10}
                      className={`text-sm ${
                        backpack.length >= 10
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300'
                      }`}
                    >
                      Equip
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}