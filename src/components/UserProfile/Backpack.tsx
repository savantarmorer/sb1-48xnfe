import React from 'react';
import { Package, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';
import { InventoryItem } from '../../types';

export default function Backpack() {
  const { state, dispatch } = useGame();
  const { backpack = [], inventory = [] } = state.user;

  const equipItem = (item: InventoryItem) => {
    dispatch({ type: 'EQUIP_ITEM', payload: item.id });
  };

  const unequipItem = (item: InventoryItem) => {
    dispatch({ type: 'UNEQUIP_ITEM', payload: item.id });
  };

  const availableItems = inventory.filter(
    item => !backpack.some(equipped => equipped.id === item.id)
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Package className="text-indigo-500" />
          <h2 className="text-xl font-bold">Backpack</h2>
        </div>
        <span className="text-sm text-gray-600">
          {backpack.length}/{10} slots used
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Equipped Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {backpack.map((item, index) => (
                <motion.div
                  key={`equipped-${item.id}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-3 rounded-lg border border-indigo-200 bg-indigo-50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <button
                      onClick={() => unequipItem(item)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Available Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableItems.map((item, index) => (
              <div
                key={`available-${item.id}-${index}`}
                className="p-3 rounded-lg border border-gray-200 bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <button
                    onClick={() => equipItem(item)}
                    disabled={backpack.length >= 10}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      backpack.length >= 10
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Equip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}