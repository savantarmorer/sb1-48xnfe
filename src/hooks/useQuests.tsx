import { useState, useCallback, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { supabase } from '../lib/supabase';
import { Quest } from '../types/quests';

export function useQuests() {
  const { state, dispatch } = useGame();
  const [loading, setLoading] = useState(false);

  const syncQuests = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedQuests = data?.map(quest => ({
        id: quest.id,
        title: quest.title,
        description: quest.description,
        type: quest.type,
        status: quest.status,
        category: quest.category,
        xpReward: quest.xp_reward,
        coinReward: quest.coin_reward,
        requirements: quest.requirements || [],
        progress: quest.progress || 0,
        isActive: quest.is_active
      })) as Quest[];

      console.log('Synced quests:', formattedQuests);

      dispatch({
        type: 'INITIALIZE_QUESTS',
        payload: formattedQuests
      });

      return formattedQuests;
    } catch (error) {
      console.error('Error syncing quests:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    syncQuests();
  }, [syncQuests]);

  useEffect(() => {
    const interval = setInterval(syncQuests, 30 * 1000);
    return () => clearInterval(interval);
  }, [syncQuests]);

  return {
    quests: state.quests,
    loading,
    syncQuests
  };
} 

