import { useState } from 'react';
import { useItems } from './useItems';
import { GameItem, ItemType, ItemRarity } from '../types/items';

/**
 * Interface for item filtering options
 */
interface ItemFilters {
  type: ItemType | 'all';
  search: string;
  rarity: ItemRarity | 'all';
}

/**
 * Interface for item sorting configuration
 * Using snake_case for database field names
 */
export interface ItemSort {
  field: 'name' | 'created_at' | 'cost' | 'type' | 'rarity';
  direction: 'asc' | 'desc';
}

/**
 * Interface for item management state
 */
interface ItemManagementState {
  selectedItem: GameItem | null;
  showEditor: boolean;
  filters: ItemFilters;
  sort: ItemSort;
}

/**
 * Hook for managing item filtering, sorting, and UI state
 */
export function useItemManagement() {
  const { isLoading, error, saveItem, deleteItem, fetchItems } = useItems();

  // Local state management
  const [state, setState] = useState<ItemManagementState>({
    selectedItem: null,
    showEditor: false,
    filters: {
      type: 'all',
      search: '',
      rarity: 'all'
    },
    sort: {
      field: 'created_at',
      direction: 'desc'
    }
  });

  /**
   * Updates state partially
   * @param updates - Partial state updates
   */
  const updateState = (updates: Partial<ItemManagementState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  /**
   * Safely compares values for sorting
   */
  const compareValues = (a: any, b: any): number => {
    if (a === undefined && b === undefined) return 0;
    if (a === undefined) return 1;
    if (b === undefined) return -1;

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }

    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }

    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    return String(a).localeCompare(String(b));
  };

  /**
   * Filters and sorts items
   */
  const getFilteredItems = (items: GameItem[]): GameItem[] => {
    return items
      .filter(item => 
        (state.filters.type === 'all' || item.type === state.filters.type) &&
        (state.filters.rarity === 'all' || item.rarity === state.filters.rarity) &&
        (state.filters.search === '' || 
          item.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
          item.description.toLowerCase().includes(state.filters.search.toLowerCase()))
      )
      .sort((a, b) => {
        const aValue = a[state.sort.field];
        const bValue = b[state.sort.field];
        const comparison = compareValues(aValue, bValue);
        return state.sort.direction === 'asc' ? comparison : -comparison;
      });
  };

  /**
   * Editor management functions
   */
  const openEditor = (item?: GameItem) => {
    updateState({
      selectedItem: item || null,
      showEditor: true
    });
  };

  const closeEditor = () => {
    updateState({
      selectedItem: null,
      showEditor: false
    });
  };

  /**
   * Filter and sort management
   */
  const updateFilters = (newFilters: Partial<ItemFilters>) => {
    updateState({
      filters: { ...state.filters, ...newFilters }
    });
  };

  const updateSort = (field?: ItemSort['field'], direction?: ItemSort['direction']) => {
    updateState({
      sort: {
        field: field || state.sort.field,
        direction: direction || state.sort.direction
      }
    });
  };

  const toggleSortDirection = () => {
    updateState({
      sort: {
        ...state.sort,
        direction: state.sort.direction === 'asc' ? 'desc' : 'asc'
      }
    });
  };

  /**
   * Item save handler with error management
   */
  const handleSaveItem = async (itemData: Partial<GameItem>) => {
    try {
      const savedItem = await saveItem(itemData);
      if (savedItem) {
        closeEditor();
      }
      return savedItem;
    } catch (error) {
      console.error('Error saving item:', error);
      return undefined;
    }
  };

  return {
    // State
    isLoading,
    error,
    selectedItem: state.selectedItem,
    showEditor: state.showEditor,
    filters: state.filters,
    sort: state.sort,

    // Actions
    saveItem: handleSaveItem,
    deleteItem,
    fetchItems,
    openEditor,
    closeEditor,
    updateFilters,
    updateSort,
    toggleSortDirection,
    getFilteredItems
  };
}

/**
 * Hook Dependencies:
 * - useItems: For CRUD operations
 * - GameItem types: For type definitions
 * 
 * State Management:
 * - Unified state object
 * - Partial state updates
 * - Delegates CRUD to useItems
 * 
 * Features:
 * - Item filtering
 * - Item sorting
 * - Editor management
 * - Error handling
 * 
 * Scalability:
 * - Modular state updates
 * - Type-safe operations
 * - Extensible filters
 * - Reusable logic
 */ 

