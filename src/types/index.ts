import { Achievement } from './achievements';
import { GameItem, InventoryItem, ItemType } from './items';
import { User } from './user';

/**
 * Core Challenge interface
 * Used for game challenges and quests
 */
export interface Challenge {
  id: string;
  type: string;
  difficulty: number;
  requirements: string[];
}

/**
 * Re-export essential types
 * These are commonly used across the application
 */
export type {
  // User types
  User,
  
  // Item types
  GameItem,
  InventoryItem,
  ItemType,
  
  // Achievement types
  Achievement,
};

/**
 * Type guard for checking if an item is equippable
 * @param item - Item to check
 * @returns boolean indicating if item can be equipped
 */
export function isEquippableItem(item: InventoryItem): boolean {
  return item.type === 'equipment' || item.type === 'cosmetic';
}

/**
 * Type guard for checking if an item is consumable
 * @param item - Item to check
 * @returns boolean indicating if item can be consumed
 */
export function isConsumableItem(item: InventoryItem): boolean {
  return item.type === 'consumable' && item.metadata?.uses !== undefined;
}

/**
 * Module Role:
 * - Central type definitions
 * - Type re-exports
 * - Type guard functions
 * 
 * Dependencies:
 * - achievements.ts
 * - items.ts
 * - user.ts
 * 
 * Used By:
 * - Components needing type definitions
 * - Services requiring type checking
 * - Utility functions
 * 
 * Features:
 * - Type-safe exports
 * - Utility functions
 * - Type guards
 * 
 * Scalability:
 * - Centralized type management
 * - Easy to extend
 * - Clear dependencies
 * 
 * Best Practices:
 * - Named exports
 * - Type guards
 * - Clear documentation
 * - Modular organization
 * 
 * Related Files:
 * - achievements.ts
 * - items.ts
 * - user.ts
 * - actions.ts
 */


