import { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { supabase } from '../lib/supabase';
import { GameItem } from '../types/items';
import { convertItemFromDB, convertItemToDB } from '../utils/supabaseUtils';

/**
 * Interface for database item timestamps
 */
interface ItemTimestamps {
  created_at: string;
  updated_at: string;
}

/**
 * Hook for managing items in the system
 * Provides CRUD operations and state management
 * 
 * Dependencies:
 * - GameContext for global state
 * - Supabase for persistence
 * - supabaseUtils for data conversion
 */
export function useItems() {
  const { dispatch } = useGame();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches all items from the database
   * Updates local state via GameContext
   * 
   * @returns Promise<GameItem[]> Array of items
   * 
   * Used by:
   * - ItemManager component
   * - Shop component
   */
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      const items = data?.map(convertItemFromDB) || [];
      dispatch({ type: 'SYNC_ITEMS', payload: items });

      return items;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Creates or updates an item
   * Handles both database and local state updates
   * 
   * @param itemData - Partial item data to save
   * @returns Promise<GameItem | undefined> Saved item
   * 
   * Used by:
   * - ItemEditor component
   * - ItemManager component
   */
  const saveItem = async (itemData: Partial<GameItem>): Promise<GameItem | undefined> => {
    try {
      setError(null);
      const isNew = !itemData.id;
      const timestamp = new Date().toISOString();

      // Create timestamps object with correct property names
      const timestamps: Partial<ItemTimestamps> = {
        updated_at: timestamp
      };

      if (isNew) {
        timestamps.created_at = timestamp;
      }

      const dbItem = convertItemToDB({
        ...itemData,
        ...timestamps // Spread timestamps with correct property names
      });
      
      const { data, error: dbError } = isNew
        ? await supabase
            .from('items')
            .insert([dbItem])
            .select()
            .single()
        : await supabase
            .from('items')
            .update(dbItem)
            .eq('id', itemData.id!)
            .select()
            .single();

      if (dbError) throw dbError;

      if (data) {
        const convertedItem = convertItemFromDB(data);
        dispatch({
          type: isNew ? 'ADD_ITEM' : 'UPDATE_ITEM',
          payload: convertedItem
        });
        return convertedItem;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save item';
      setError(message);
      throw new Error(message);
    }
  };

  /**
   * Deletes an item from both database and local state
   * 
   * @param itemId - ID of item to delete
   * @returns Promise<void>
   * 
   * Used by:
   * - ItemManager component
   */
  const deleteItem = async (itemId: string): Promise<void> => {
    try {
      setError(null);
      const { error: dbError } = await supabase
        .from('items')
        .delete()
        .match({ id: itemId });

      if (dbError) throw dbError;

      dispatch({
        type: 'REMOVE_ITEM',
        payload: { id: itemId } // Fixed to match action payload type
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item';
      setError(message);
      throw new Error(message);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchItems();
  }, []);

  return {
    isLoading,
    error,
    fetchItems,
    saveItem,
    deleteItem
  };
}

/**
 * Hook Dependencies:
 * - useGame: For accessing and modifying game state
 * - supabase: For database operations
 * - convertItemFromDB/convertItemToDB: For data transformation
 * 
 * State Management:
 * - Local loading and error states
 * - Global state through GameContext
 * 
 * Database Interactions:
 * - CRUD operations on items table
 * - Handles data conversion between frontend and database
 * 
 * Used By:
 * - ItemManager component
 * - Shop component
 * - Inventory component
 * 
 * Features:
 * - Item CRUD operations
 * - Error handling
 * - Loading states
 * - Data conversion
 * 
 * Scalability Considerations:
 * - Separate interfaces for database types
 * - Error handling with proper messages
 * - Loading states for UI feedback
 * - Type safety throughout
 * - Modular data conversion
 */ 

