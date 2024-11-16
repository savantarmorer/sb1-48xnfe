import { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { Challenge } from '../types';
import { QUEST_REWARDS } from '../lib/gameConfig';

export function useQuests() {
  const { state, dispatch } = useGame();
  const [dailyQuests, setDailyQuests] = useState<Challenge[]>([]);
  const [weeklyQuests, setWeeklyQuests] = useState<Challenge[]>([]);

  useEffect(() => {
    loadQuests();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeToMidnight = midnight.getTime() - Date.now();
    
    const timer = setTimeout(() => {
      resetDailyQuests();
    }, timeToMidnight);

    return () => clearTimeout(timer);
  }, []);

  const loadQuests = () => {
    // Load quests from localStorage or generate new ones
    const savedDailyQuests = localStorage.getItem('dailyQuests');
    const savedWeeklyQuests = localStorage.getItem('weeklyQuests');

    if (savedDailyQuests) {
      setDailyQuests(JSON.parse(savedDailyQuests));
    } else {
      generateDailyQuests();
    }

    if (savedWeeklyQuests) {
      setWeeklyQuests(JSON.parse(savedWeeklyQuests));
    } else {
      generateWeeklyQuests();
    }
  };

  const generateDailyQuests = () => {
    // Generate 3 random daily quests
    const newQuests: Challenge[] = [];
    // Quest generation logic here
    setDailyQuests(newQuests);
    localStorage.setItem('dailyQuests', JSON.stringify(newQuests));
  };

  const generateWeeklyQuests = () => {
    // Generate 2 random weekly quests
    const newQuests: Challenge[] = [];
    // Quest generation logic here
    setWeeklyQuests(newQuests);
    localStorage.setItem('weeklyQuests', JSON.stringify(newQuests));
  };

  const resetDailyQuests = () => {
    generateDailyQuests();
  };

  const completeQuest = (questId: string) => {
    const quest = [...dailyQuests, ...weeklyQuests].find(q => q.id === questId);
    if (quest) {
      dispatch({ type: 'COMPLETE_QUEST', payload: questId });
      dispatch({ type: 'ADD_XP', payload: quest.xpReward });
      dispatch({ type: 'ADD_COINS', payload: quest.coinReward });
    }
  };

  return {
    dailyQuests,
    weeklyQuests,
    completeQuest
  };
}