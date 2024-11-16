import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  Package, 
  ScrollText, 
  Store, 
  Users, 
  X,
  BarChart 
} from 'lucide-react';
import QuestManager from './QuestManager';
import ItemManager from './ItemManager';
import ShopManager from './ShopManager';
import UserManager from './UserManager';
import Statistics from './Statistics';

interface AdminDashboardProps {
  onClose: () => void;
}

type Tab = 'overview' | 'quests' | 'items' | 'shop' | 'users';

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'quests', label: 'Quests', icon: ScrollText },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'shop', label: 'Shop', icon: Store },
    { id: 'users', label: 'Users', icon: Users }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'quests':
        return <QuestManager />;
      case 'items':
        return <ItemManager />;
      case 'shop':
        return <ShopManager />;
      case 'users':
        return <UserManager />;
      default:
        return <Statistics />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-7xl mx-4 h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold dark:text-white">Admin Dashboard</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} className="dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <nav className="w-64 border-r dark:border-gray-700 p-4">
            <ul className="space-y-2">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </motion.div>
    </motion.div>
  );
}