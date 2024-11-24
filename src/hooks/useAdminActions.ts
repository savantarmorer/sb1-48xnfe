import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/user';
import { GameItem } from '../types/items';
import { Quest } from '../types/quests';
import { supabase } from '../lib/supabase';
import { convertQuestToDB, convertQuestFromDB } from '../utils/questConverters';
import { convertItemToDB, convertItemFromDB } from '../utils/supabaseUtils';
import type { Database } from '../types/supabase';

interface AdminActions {
  saveQuest: (quest: Partial<Quest>) => Promise<Quest>;
  saveItem: (item: Partial<GameItem>) => Promise<GameItem>;
  updateUserProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  fetchStatistics: () => Promise<{
    activeUsers: number;
    completedQuests: number;
    purchasedItems: number;
  } | null>;
  resetStreak: () => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  setLevel: (level: number) => Promise<void>;
}

export function useAdminActions(): AdminActions {
  const { dispatch } = useGame();
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('admin') || false;

  const checkAdmin = () => {
    if (!isAdmin) throw new Error('Admin access required');
  };

  const resetStreak = async () => {
    checkAdmin();
    dispatch({ type: 'RESET_STREAK' });
  };

  const addCoins = async (amount: number) => {
    checkAdmin();
    dispatch({ type: 'ADD_COINS', payload: amount });
  };

  const addXP = async (amount: number) => {
    checkAdmin();
    dispatch({ type: 'ADD_XP', payload: amount });
  };

  const setLevel = async (level: number) => {
    checkAdmin();
    dispatch({ type: 'SET_LEVEL', payload: level });
  };

  /**
   * Saves or updates a quest
   */
  const saveQuest = async (quest: Partial<Quest>): Promise<Quest> => {
    checkAdmin();

    try {
      const questData = convertQuestToDB({
        ...quest,
        created_by: quest.created_by || user?.id,
        updated_by: user?.id
      });
      const { data, error } = await supabase
        .from('quests')
        .upsert(questData)
        .select()
        .single();

      if (error) throw error;
      const savedQuest = convertQuestFromDB(data);
      
      dispatch({ type: 'UPDATE_QUEST', payload: savedQuest });
      return savedQuest;
    } catch (err) {
      console.error('Error saving quest:', err);
      throw err;
    }
  };

  /**
   * Saves or updates an item
   */
  const saveItem = async (item: Partial<GameItem>): Promise<GameItem> => {
    checkAdmin();

    try {
      const dbItem = convertItemToDB(item);
      const { data, error } = await supabase
        .from('items')
        .upsert([dbItem])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      const savedItem = convertItemFromDB(data);

      dispatch({
        type: item.id ? 'UPDATE_ITEM' : 'ADD_ITEM',
        payload: savedItem
      });

      return savedItem;
    } catch (error) {
      console.error('Error saving item:', error);
      throw error;
    }
  };

  /**
   * Updates a user's profile
   */
  const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
    checkAdmin();

    try {
      const { error } = await supabase
        .from('users')
        .update(updates as Database['public']['Tables']['users']['Update'])
        .eq('id', userId);

      if (error) throw error;

      dispatch({
        type: 'UPDATE_USER_PROFILE',
        payload: updates
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  /**
   * Fetches system statistics
   */
  const fetchStatistics = async () => {
    checkAdmin();

    try {
      const [usersResult, questsResult, itemsResult] = await Promise.all([
        supabase.from('users').select('id'),
        supabase.from('quests').select('id'),
        supabase.from('items').select('id')
      ]);

      const stats = {
        activeUsers: (usersResult.data || []).length,
        completedQuests: (questsResult.data || []).length,
        purchasedItems: (itemsResult.data || []).length,
        lastUpdated: new Date().toISOString()
      };

      dispatch({
        type: 'SYNC_STATISTICS',
        payload: stats
      });

      return stats;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return null;
    }
  };

  return {
    saveQuest,
    saveItem,
    updateUserProfile,
    fetchStatistics,
    resetStreak,
    addCoins,
    addXP,
    setLevel
  };
}

/**
 * Hook Dependencies:
 * - useGame: For dispatching state updates
 * - useAuth: For permission checks
 * - supabase: For database operations
 * - supabaseUtils: For data conversion
 * 
 * State Management:
 * - Dispatches to GameContext
 * - Handles database synchronization
 * 
 * Error Handling:
 * - Permission checks
 * - Database errors
 * - Data validation
 * 
 * Scalability:
 * - Modular action handlers
 * - Type-safe operations
 * - Centralized admin logic
 */ 
