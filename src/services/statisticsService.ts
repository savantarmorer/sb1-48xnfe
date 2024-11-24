import { supabase, getData } from '../lib/supabase';
import { GameStatistics } from '../types/game';

export class StatisticsService {
  static async fetchStatistics(): Promise<GameStatistics | null> {
    try {
      // Fetch data from multiple tables in parallel
      const [usersData, questsData, itemsData, battleData] = await Promise.all([
        getData('profiles'),
        getData('quests'),
        getData('items'),
        getData('battle_history')
      ]);

      const battles = battleData || [];
      const recentActivity = this.generateRecentActivity([
        ...battles,
        ...questsData || [],
        ...itemsData || []
      ]);

      return {
        activeUsers: (usersData || []).length,
        completedQuests: (questsData || []).length,
        purchasedItems: (itemsData || []).length,
        battlesPlayed: battles.length,
        battlesWon: battles.filter((b: any) => b.isVictory).length,
        averageScore: this.calculateAverageScore(battles),
        lastUpdated: new Date().toISOString(),
        recentActivity
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return null;
    }
  }

  private static calculateAverageScore(battleData: any[]): number {
    if (!battleData.length) return 0;
    const totalScore = battleData.reduce((sum, battle) => sum + (battle.score || 0), 0);
    return Math.round(totalScore / battleData.length);
  }

  private static generateRecentActivity(data: any[]): GameStatistics['recentActivity'] {
    return data
      .sort((a, b) => new Date(b.timestamp || b.created_at).getTime() - new Date(a.timestamp || a.created_at).getTime())
      .slice(0, 10)
      .map(item => ({
        type: item.isVictory !== undefined ? 'battle' : 
              item.questId ? 'quest' : 'purchase',
        description: this.getActivityDescription(item),
        timestamp: new Date(item.timestamp || item.created_at),
        value: item.score || item.amount
      }));
  }

  private static getActivityDescription(item: any): string {
    if (item.isVictory !== undefined) {
      return `Battle ${item.isVictory ? 'won' : 'lost'}`;
    }
    if (item.questId) {
      return `Quest completed: ${item.name}`;
    }
    return `Item purchased: ${item.name}`;
  }

  static async updateStatistics(statistics: Partial<GameStatistics>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('statistics')
        .upsert({
          ...statistics,
          lastUpdated: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating statistics:', error);
      return false;
    }
  }
}