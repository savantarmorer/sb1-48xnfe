import { useState, useCallback, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { supabase } from '../lib/supabase';
import { Quest } from '../types/quests';
import { formatQuestFromDB, formatQuestForDB } from '../utils/formatters';

/**
 * Interface for quest deletion payload
 */
interface DeleteQuestPayload {
  id: string;
}

/**
 * Interface for quest progress update
 */
interface QuestProgressUpdate {
  questId: string;
  progress: number;
}

/**
 * Hook for managing quests in the game
 * Provides CRUD operations and progress tracking with auto-sync
 */
export function useQuests() {
  const { state, dispatch } = useGame();
  const [loading, setLoading] = useState(false);

  /**
   * Syncs quests with database
   * @returns Promise with quests array
   */
  const syncQuests = useCallback(async () => {
    setLoading(true);
    try {
      const { data: questsData, error } = await supabase
        .from('quests')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedQuests = questsData?.map(formatQuestFromDB) as Quest[];

      dispatch({
        type: 'INITIALIZE_QUESTS',
        payload: formattedQuests
      });

      return formattedQuests;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sync quests';
      console.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Creates a new quest
   * @param quest - Quest data to create
   * @returns Promise with created quest
   */
  const createQuest = async (quest: Partial<Quest>) => {
    try {
      const dbQuest = formatQuestForDB(quest);
      const { data, error } = await supabase
        .from('quests')
        .insert([dbQuest])
        .select()
        .single();

      if (error) throw error;

      const formattedQuest = formatQuestFromDB(data);

      dispatch({
        type: 'ADD_QUEST',
        payload: formattedQuest
      });

      return formattedQuest;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create quest';
      console.error(message);
      throw err;
    }
  };

  /**
   * Updates an existing quest
   * @param quest - Quest data to update
   * @returns Promise with updated quest
   */
  const updateQuest = async (quest: Partial<Quest>) => {
    try {
      if (!quest.id) throw new Error('Quest ID is required for updates');

      const dbQuest = formatQuestForDB(quest);
      const { data, error } = await supabase
        .from('quests')
        .update(dbQuest)
        .eq('id', quest.id)
        .select()
        .single();

      if (error) throw error;

      const formattedQuest = formatQuestFromDB(data);

      dispatch({
        type: 'UPDATE_QUEST',
        payload: formattedQuest
      });

      return formattedQuest;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update quest';
      console.error(message);
      throw err;
    }
  };

  /**
   * Deletes a quest by ID
   * @param id - ID of the quest to delete
   */
  const deleteQuest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const payload: DeleteQuestPayload = { id };
      dispatch({
        type: 'REMOVE_QUEST',
        payload
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete quest';
      console.error(message);
      throw err;
    }
  };

  /**
   * Updates quest progress
   * @param questId - ID of the quest
   * @param progress - New progress value
   */
  const updateProgress = async (questId: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('quests')
        .update({ progress })
        .eq('id', questId);

      if (error) throw error;

      const payload: QuestProgressUpdate = { questId, progress };
      dispatch({
        type: 'SYNC_QUEST_PROGRESS',
        payload
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update quest progress';
      console.error(message);
      throw err;
    }
  };

  // Auto-sync on mount and every 30 seconds
  useEffect(() => {
    syncQuests();
    const interval = setInterval(syncQuests, 30 * 1000);
    return () => clearInterval(interval);
  }, [syncQuests]);

  return {
    quests: state.quests,
    loading,
    syncQuests,
    createQuest,
    updateQuest,
    deleteQuest,
    updateProgress
  };
}

/**
 * Hook Dependencies:
 * - useGame: For accessing and modifying game state
 * - supabase: For database operations
 * - formatters: For data transformation
 * 
 * State Management:
 * - Uses GameContext for global state
 * - Local caching through state.quests
 * - Loading state management
 * 
 * Database Interactions:
 * - CRUD operations on quests table
 * - Progress tracking updates
 * - Automatic sync every 30 seconds
 * 
 * Used By:
 * - QuestManager component
 * - QuestList component
 * - QuestProgress component
 * 
 * Features:
 * - Quest CRUD operations
 * - Progress tracking
 * - Error handling
 * - Data formatting
 * - Auto-sync functionality
 * 
 * Scalability Considerations:
 * - Separate interfaces for payloads
 * - Type safety for all operations
 * - Error handling with proper messages
 * - Modular data formatting
 * - Configurable sync interval
 */