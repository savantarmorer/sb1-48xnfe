import type { TransactionType } from './transactions';

/**
 * Core item type definitions
 */
export enum ItemType {
  CONSUMABLE = 'consumable',
  EQUIPMENT = 'equipment',
  COLLECTIBLE = 'collectible',
  BOOSTER = 'booster',
  COSMETIC = 'cosmetic'
}

export enum ItemRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

/**
 * Item effect definition
 * Represents temporary or permanent bonuses from items
 */
export interface ItemEffect {
  type: 'xp_boost' | 'coin_boost' | 'time_boost' | 'score_boost' | 'health_boost' | 'damage_boost';
  value: number;
  duration?: number; // in seconds
}

/**
 * Base item interface
 * Contains core item properties
 */
export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  basePrice: number;
  icon?: string;
  effects?: ItemEffect[];
  value?: number;
  stackable?: boolean;
  tradeable?: boolean;
  usable?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Extended game item interface
 * Adds shop-specific properties
 */
export interface GameItem extends Item {
  instanceId: string;
  acquiredAt: Date;
  expiresAt?: Date;
  durability?: number;
  uses?: number;
  level_requirement?: number;
  quest_requirement?: string[];
  achievement_requirement?: string[];
  cooldown?: number;
  charges?: number;
  isActive: boolean;
}

/**
 * Base inventory item interface
 * Contains core inventory item properties
 */
export interface InventoryItem {
  id: string;
  item: GameItem;
  quantity: number;
  isEquipped?: boolean;
  lastUsed?: Date;
  acquired_at: string;
  expires_at?: string;
  transaction_type: TransactionType;
  transaction_id?: string;
  remaining_uses?: number;
  condition?: number;
}

/**
 * Item transaction interface
 * Represents a transaction involving an item
 */
export interface ItemTransaction {
  id: string;
  userId: string;
  itemId: string;
  quantity: number;
  type: TransactionType;
  price: number;
  timestamp: Date;
}

/**
 * Type Dependencies:
 * - None (self-contained type system)
 * 
 * Used By:
 * - Inventory system
 * - Shop system
 * - Item management
 * - Quest requirements
 * - Achievement system
 * 
 * Features:
 * - Type-safe item definitions
 * - Flexible effect system
 * - Requirement validation
 * - Shop integration
 * - Metadata support
 * 
 * Scalability:
 * - Easy to add new item types
 * - Extensible effect system
 * - Flexible requirements
 * - Metadata for custom properties
 * 
 * Related Systems:
 * - Inventory management
 * - Shop system
 * - Quest system
 * - Achievement system
 * 
 * Database Mapping:
 * - Matches Supabase schema
 * - Supports JSON metadata
 * - Handles timestamps
 */
