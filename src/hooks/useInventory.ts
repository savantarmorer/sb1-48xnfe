import { useContext, useCallback } from 'react';
import { GameContext } from '../contexts/GameContext';
import { GameItem, InventoryItem, ItemEffect } from '../types/items';

export function useInventory() {
  const { state, dispatch, handleItemTransaction } = useContext(GameContext);

  const addItem = useCallback(async (item: GameItem, quantity: number, price: number) => {
    await handleItemTransaction(item, quantity, 'purchase', price);
  }, [handleItemTransaction]);

  const removeItem = useCallback(async (item: GameItem, quantity: number) => {
    await handleItemTransaction(item, quantity, 'use', 0);
  }, [handleItemTransaction]);

  const sellItem = useCallback(async (item: GameItem, quantity: number, price: number) => {
    await handleItemTransaction(item, quantity, 'sell', price);
  }, [handleItemTransaction]);

  const equipItem = useCallback(async (item: GameItem) => {
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: {
        inventory: state.user.inventory.map(i =>
          i.item.id === item.id
            ? { ...i, isEquipped: true, lastUsed: new Date() }
            : i
        )
      }
    });
  }, [dispatch, state.user.inventory]);

  const unequipItem = useCallback(async (item: GameItem) => {
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: {
        inventory: state.user.inventory.map(i =>
          i.item.id === item.id
            ? { ...i, isEquipped: false }
            : i
        )
      }
    });
  }, [dispatch, state.user.inventory]);

  const useItem = useCallback(async (item: GameItem) => {
    await handleItemTransaction(item, 1, 'use', 0);
  }, [handleItemTransaction]);

  const getInventoryItem = useCallback((itemId: string): InventoryItem | undefined => {
    return state.user.inventory.find(i => i.item.id === itemId);
  }, [state.user.inventory]);

  const getActiveEffects = useCallback((): ItemEffect[] => {
    return state.activeEffects || [];
  }, [state.activeEffects]);

  const hasActiveEffect = useCallback((effectType: string): boolean => {
    return (state.activeEffects || []).some(effect => 
      effect.type === effectType && (!effect.expiresAt || effect.expiresAt > new Date())
    );
  }, [state.activeEffects]);

  const getEffectValue = useCallback((effectType: string): number => {
    const effect = (state.activeEffects || []).find(e => 
      e.type === effectType && (!e.expiresAt || e.expiresAt > new Date())
    );
    return effect?.value || 0;
  }, [state.activeEffects]);

  return {
    inventory: state.user.inventory,
    activeEffects: state.activeEffects || [],
    addItem,
    removeItem,
    sellItem,
    equipItem,
    unequipItem,
    useItem,
    getInventoryItem,
    getActiveEffects,
    hasActiveEffect,
    getEffectValue
  };
}
