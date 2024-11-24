import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Gift, Flame, Settings } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import LoginCalendar from './LoginCalendar';
import RewardNotification from './RewardNotification';
import StreakDisplay from './StreakDisplay';
import AdminPanel from './AdminPanel';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { formatISO, isToday, parseISO } from 'date-fns';

interface DailyReward {
  day: number;
  reward: {
    type: 'xp' | 'coins' | 'item';
    value: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
}

export default function DailyRewardSystem() {
  const { state, dispatch } = useGame();
  const [showNotification, setShowNotification] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [lastLoginDate, setLastLoginDate] = useLocalStorage('lastLoginDate', '');
  const [currentReward, setCurrentReward] = useState<DailyReward['reward'] | null>(null);
  const isAdmin = state.user.roles?.includes('admin');

  const DAILY_REWARDS: DailyReward[] = [
    { day: 1, reward: { type: 'xp', value: 100, rarity: 'common' } },
    { day: 2, reward: { type: 'coins', value: 50, rarity: 'common' } },
    { day: 3, reward: { type: 'xp', value: 150, rarity: 'rare' } },
    { day: 4, reward: { type: 'coins', value: 100, rarity: 'rare' } },
    { day: 5, reward: { type: 'xp', value: 250, rarity: 'epic' } },
    { day: 6, reward: { type: 'coins', value: 200, rarity: 'epic' } },
    { day: 7, reward: { type: 'item', value: 500, rarity: 'legendary' } }
  ];

  useEffect(() => {
    checkDailyLogin();
  }, []);

  useEffect(() => {
    if (state.user.streak > 0) {
      dispatch({ type: 'UPDATE_STREAK_MULTIPLIER' });
    }
  }, [state.user.streak]);

  const checkDailyLogin = () => {
    const today = formatISO(new Date(), { representation: 'date' });
    
    if (!lastLoginDate || !isToday(parseISO(lastLoginDate))) {
      const dayIndex = (state.user.streak % 7);
      const reward = DAILY_REWARDS[dayIndex].reward;
      
      setCurrentReward(reward);
      setShowNotification(true);
      setLastLoginDate(today);
      
      if (!state.loginHistory?.includes(today)) {
        dispatch({ type: 'INCREMENT_STREAK' });
        dispatch({ type: 'RECORD_LOGIN', payload: today });
        dispatch({ type: 'UPDATE_STREAK_MULTIPLIER' });
      }
    }
  };

  const handleClaimReward = () => {
    if (currentReward) {
      if (currentReward.type === 'xp') {
        dispatch({ type: 'ADD_XP', payload: currentReward.value });
      } else if (currentReward.type === 'coins') {
        dispatch({ type: 'ADD_COINS', payload: currentReward.value });
      }
    }
    setShowNotification(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Daily Rewards
        </h2>
        {isAdmin && (
          <button
            onClick={() => setShowAdminPanel(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>

      <StreakDisplay streak={state.user.streak} />
      
      <LoginCalendar
        loginDates={state.loginHistory || []}
        rewards={DAILY_REWARDS}
        currentStreak={state.user.streak}
      />

      <AnimatePresence>
        {showNotification && currentReward && (
          <RewardNotification
            reward={currentReward}
            onClaim={handleClaimReward}
          />
        )}
      </AnimatePresence>

      {showAdminPanel && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
          rewards={DAILY_REWARDS}
          onUpdateRewards={(newRewards) => {
            // Handle reward updates
            console.log('Updated rewards:', newRewards);
          }}
        />
      )}
    </div>
  );
}