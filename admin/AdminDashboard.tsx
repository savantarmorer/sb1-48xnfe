// src/components/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  Package, 
  ScrollText, 
  Store, 
  Users, 
  X
} from 'lucide-react';
import QuestManager from './QuestManager';
import ItemManager from './ItemManager';
import ShopManager from './ShopManager';
import UserManager from './UserManager';
import Statistics from './Statistics';
import Button from '../Button';
import { StatisticsService } from '../../services/statisticsService';
import { useGame } from '../../contexts/GameContext';
import type { GameStatistics } from '../../types/game';

interface AdminDashboardProps {
  onClose: () => void;
}

type Tab = 'overview' | 'quests' | 'items' | 'shop' | 'users' | 'achievements';

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state, dispatch } = useGame();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await StatisticsService.fetchStatistics();
      
      if (stats) {
        dispatch({
          type: 'SYNC_STATISTICS',
          payload: stats
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'quests', label: 'Quests', icon: ScrollText },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'shop', label: 'Shop', icon: Store },
    { id: 'users', label: 'Users', icon: Users }
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadStatistics}>Retry</Button>
        </div>
      );
    }

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
        return (
          <Statistics
            statistics={state.statistics}
            onRefresh={loadStatistics}
            isLoading={loading}
            error={error}
          />
        );
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
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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

        <div className="p-4 border-t dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {state.statistics?.lastUpdated ? new Date(state.statistics.lastUpdated).toLocaleString() : 'Never'}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Component Role:
 * - Admin interface for managing game content
 * - Statistics overview
 * - User management
 * - Content management
 * 
 * Dependencies:
 * - GameContext for state
 * - StatisticsService for data
 * - Management components
 * 
 * Features:
 * - Tab navigation
 * - Statistics loading
 * - Error handling
 * - Loading states
 * 
 * Scalability:
 * - Easy to add new tabs
 * - Modular components
 * - Error boundary ready
 * - Performance optimized
 */