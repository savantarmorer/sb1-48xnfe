import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Achievement, LeaderboardEntry } from '../types';
import { LevelSystem } from '../lib/levelSystem';
import { XP_MULTIPLIERS } from '../lib/gameConfig';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import { supabase, subscribeToUserProgress, updateUserProgress, getUserProgress } from '../lib/supabase';

interface GameState {
  user: User;
  recentXPGains: {
    amount: number;
    reason: string;
    timestamp: string;
    isCritical: boolean;
  }[];
  completedQuests: string[];
  leaderboard: LeaderboardEntry[];
  showLevelUpReward: boolean;
  currentLevelRewards: any[] | null;
  syncing: boolean;
}

type GameAction =
  | { type: 'ADD_XP'; payload: { amount: number; reason: string } }
  | { type: 'ADD_COINS'; payload: number }
  | { type: 'COMPLETE_QUEST'; payload: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'PURCHASE_ITEM'; payload: { itemId: string; cost: number } }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'DISMISS_LEVEL_UP_REWARD' }
  | { type: 'SYNC_START' }
  | { type: 'SYNC_SUCCESS'; payload: Partial<GameState> }
  | { type: 'SYNC_ERROR' };

const initialState: GameState = {
  user: {
    id: '1',
    name: 'Maria Silva',
    level: 1,
    xp: 0,
    streak: 7,
    coins: 1000,
    achievements: [],
    inventory: []
  },
  recentXPGains: [],
  completedQuests: [],
  leaderboard: [
    {
      userId: '1',
      username: 'Maria Silva',
      score: 0,
      rank: 1,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    }
  ],
  showLevelUpReward: false,
  currentLevelRewards: null,
  syncing: false
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SYNC_START':
      return { ...state, syncing: true };

    case 'SYNC_SUCCESS':
      return { ...state, ...action.payload, syncing: false };

    case 'SYNC_ERROR':
      return { ...state, syncing: false };

    case 'ADD_XP': {
      const oldLevel = state.user.level;
      const streakMultiplier = XP_MULTIPLIERS.streak[state.user.streak as keyof typeof XP_MULTIPLIERS.streak] || 1;
      const isCritical = Math.random() < XP_MULTIPLIERS.critical.chance;
      const criticalMultiplier = isCritical ? XP_MULTIPLIERS.critical.multiplier : 1;
      
      const finalXP = Math.floor(
        action.payload.amount * streakMultiplier * criticalMultiplier
      );
      
      const newXP = state.user.xp + finalXP;
      const newLevel = LevelSystem.calculateLevel(newXP);
      
      let coinsToAdd = 0;
      let levelUpRewards = null;

      if (newLevel > oldLevel) {
        const rewards = LevelSystem.handleLevelUp(state.user, oldLevel, newLevel);
        coinsToAdd = rewards.reduce((sum, reward) => sum + reward.coins, 0);
        levelUpRewards = rewards.flatMap(reward => reward.items);
      }

      const newGain = {
        amount: finalXP,
        reason: action.payload.reason + (isCritical ? ' (Critical!)' : ''),
        timestamp: new Date().toISOString(),
        isCritical
      };

      const updatedLeaderboard = [...state.leaderboard];
      const userIndex = updatedLeaderboard.findIndex(entry => entry.userId === state.user.id);
      if (userIndex !== -1) {
        updatedLeaderboard[userIndex] = {
          ...updatedLeaderboard[userIndex],
          score: newXP
        };
        updatedLeaderboard.sort((a, b) => b.score - a.score);
        updatedLeaderboard.forEach((entry, index) => {
          entry.rank = index + 1;
        });
      }

      const newState = {
        ...state,
        user: {
          ...state.user,
          xp: newXP,
          level: newLevel,
          coins: state.user.coins + coinsToAdd
        },
        recentXPGains: [newGain, ...state.recentXPGains.slice(0, 4)],
        leaderboard: updatedLeaderboard,
        showLevelUpReward: levelUpRewards !== null,
        currentLevelRewards: levelUpRewards
      };

      // Sync with Supabase
      updateUserProgress(state.user.id, {
        xp: newXP,
        level: newLevel,
        coins: state.user.coins + coinsToAdd
      });

      return newState;
    }

    case 'ADD_COINS': {
      const newState = {
        ...state,
        user: {
          ...state.user,
          coins: Math.max(0, state.user.coins + action.payload)
        }
      };

      // Sync with Supabase
      updateUserProgress(state.user.id, {
        coins: newState.user.coins
      });

      return newState;
    }

    case 'COMPLETE_QUEST': {
      const newState = {
        ...state,
        completedQuests: [...(state.completedQuests || []), action.payload]
      };

      // Sync with Supabase
      updateUserProgress(state.user.id, {
        completed_quests: newState.completedQuests
      });

      return newState;
    }

    case 'UNLOCK_ACHIEVEMENT': {
      if (state.user.achievements.some(a => a.id === action.payload.id)) {
        return state;
      }

      const newState = {
        ...state,
        user: {
          ...state.user,
          achievements: [...state.user.achievements, action.payload]
        }
      };

      // Sync with Supabase
      updateUserProgress(state.user.id, {
        achievements: newState.user.achievements
      });

      return newState;
    }

    case 'PURCHASE_ITEM': {
      if (state.user.coins < action.payload.cost) {
        return state;
      }

      const newState = {
        ...state,
        user: {
          ...state.user,
          coins: state.user.coins - action.payload.cost,
          inventory: [
            ...state.user.inventory,
            {
              id: action.payload.itemId,
              name: action.payload.itemId,
              description: '',
              type: 'material',
              rarity: 'common'
            }
          ]
        }
      };

      // Sync with Supabase
      updateUserProgress(state.user.id, {
        coins: newState.user.coins,
        inventory: newState.user.inventory
      });

      return newState;
    }

    case 'UPDATE_PROFILE': {
      const updatedUser = { ...state.user, ...action.payload };
      const updatedLeaderboard = state.leaderboard.map(entry =>
        entry.userId === state.user.id
          ? { ...entry, username: updatedUser.name, avatar: updatedUser.avatar || entry.avatar }
          : entry
      );
      
      const newState = {
        ...state,
        user: updatedUser,
        leaderboard: updatedLeaderboard
      };

      // Sync with Supabase
      updateUserProgress(state.user.id, action.payload);

      return newState;
    }

    case 'DISMISS_LEVEL_UP_REWARD':
      return {
        ...state,
        showLevelUpReward: false,
        currentLevelRewards: null
      };

    default:
      return state;
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth();
  const [savedState, setSavedState] = useLocalStorage<GameState>('gameState', initialState);
  const [state, dispatch] = useReducer(gameReducer, savedState || initialState);

  // Initial data load
  useEffect(() => {
    if (authUser) {
      dispatch({ type: 'SYNC_START' });
      
      getUserProgress(authUser.id)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error loading user progress:', error);
            dispatch({ type: 'SYNC_ERROR' });
            return;
          }

          if (data) {
            dispatch({
              type: 'SYNC_SUCCESS',
              payload: {
                user: {
                  ...state.user,
                  ...data,
                  id: authUser.id
                }
              }
            });
          }
        });
    }
  }, [authUser]);

  // Set up real-time subscription
  useEffect(() => {
    if (authUser) {
      const subscription = subscribeToUserProgress(authUser.id, (payload) => {
        if (payload.new) {
          dispatch({
            type: 'SYNC_SUCCESS',
            payload: {
              user: {
                ...state.user,
                ...payload.new
              }
            }
          });
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [authUser]);

  // Save state to localStorage
  useEffect(() => {
    setSavedState(state);
  }, [state, setSavedState]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}