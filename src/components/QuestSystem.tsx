import React, { useState, useEffect } from 'react';
import { Scroll, Timer, Award, CheckCircle2, Circle, Sparkles, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { useLanguage } from '../contexts/LanguageContext';
import LootBox from './LootBox';
import AdminPanel from './admin/AdminPanel';

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

export default function QuestSystem() {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();
  const [showLootBox, setShowLootBox] = useState(false);
  const [currentRewards, setCurrentRewards] = useState<any[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [quests, setQuests] = useState<Quest[]>([]);
  const isAdmin = state.user.roles?.includes('admin');

  const getTimeRemaining = (deadline: Date) => {
    const total = new Date(deadline).getTime() - Date.now();
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return `${hours}h ${minutes}m`;
  };

  const completeQuest = (quest: Quest) => {
    if (state.completedQuests?.includes(quest.id)) return;

    const rewards = [
      {
        type: 'xp',
        value: quest.xpReward,
        rarity: quest.type === 'weekly' ? 'epic' : 'rare'
      },
      {
        type: 'coins',
        value: quest.coinReward,
        rarity: 'common'
      }
    ];

    if (Math.random() > 0.8) {
      rewards.push({
        type: 'item',
        value: 'Material de Estudo Premium',
        rarity: 'legendary'
      });
    }

    setCurrentRewards(rewards);
    setShowLootBox(true);

    dispatch({
      type: 'ADD_XP',
      payload: {
        amount: quest.xpReward,
        reason: `Quest Completed: ${quest.title}`
      }
    });
    dispatch({ type: 'ADD_COINS', payload: quest.coinReward });
    dispatch({ type: 'COMPLETE_QUEST', payload: quest.id });
  };

  // Filter available quests
  const availableQuests = quests.filter(quest => 
    !state.completedQuests?.includes(quest.id)
  );

  useEffect(() => {
    // Load quests from localStorage
    const savedQuests = localStorage.getItem('quests');
    if (savedQuests) {
      setQuests(JSON.parse(savedQuests));
    }

    // Set up daily quest reset
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeToMidnight = midnight.getTime() - Date.now();
    
    const timer = setTimeout(() => {
      dispatch({ type: 'RESET_DAILY_QUESTS' });
    }, timeToMidnight);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading text-2xl">Missões Diárias</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-muted">
            <Timer size={16} />
            <span>Reseta em {getTimeRemaining(new Date(Date.now() + 24 * 60 * 60 * 1000))}</span>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAdminPanel(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <Settings size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {availableQuests.map(quest => (
            <motion.div
              key={quest.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Circle className="text-gray-400 dark:text-gray-500" size={20} />
                    <h3 className="font-semibold text-gray-900 dark:text-white">{quest.title}</h3>
                    <span className={`badge ${
                      quest.type === 'epic' ? 'badge-warning' :
                      quest.type === 'weekly' ? 'badge-info' :
                      'badge-success'
                    }`}>
                      {quest.type === 'weekly' ? 'Semanal' : 
                       quest.type === 'epic' ? 'Épica' : 'Diária'}
                    </span>
                  </div>
                  <p className="text-muted mt-1 ml-7">{quest.description}</p>
                  {quest.requirements && (
                    <ul className="mt-2 ml-7 space-y-1">
                      {quest.requirements.map((req, index) => (
                        <li key={index} className="flex items-center space-x-2 text-muted">
                          <Circle size={6} />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-primary-600 dark:text-primary-400">
                      <Sparkles size={16} />
                      <span className="font-medium">+{quest.xpReward} XP</span>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                      <Award size={16} />
                      <span className="font-medium">+{quest.coinReward} Coins</span>
                    </div>
                  </div>
                  <button
                    onClick={() => completeQuest(quest)}
                    className="btn btn-primary"
                  >
                    Complete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <LootBox
        isOpen={showLootBox}
        onClose={() => setShowLootBox(false)}
        rewards={currentRewards}
      />

      {isAdmin && showAdminPanel && (
        <AdminPanel
          quests={quests}
          onUpdateQuests={setQuests}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  );
}