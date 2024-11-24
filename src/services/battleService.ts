import { BATTLE_CONFIG } from '../config/battleConfig';
import { supabase } from '../lib/supabase';
import { BattleResults, BattleQuestion, BattleStats } from '../types/battle';

export class BattleService {
  static async getQuestions(
    count: number = BATTLE_CONFIG.questionsPerBattle,
    category?: string,
    difficulty?: number
  ): Promise<BattleQuestion[]> {
    try {
      console.log('Fetching questions from database...');
      
      // Calculate how many questions to fetch, with a buffer
      const fetchLimit = Math.min(count * 3, 50);
      
      let query = supabase
        .from('quiz_questions')
        .select(`
          id,
          question,
          quiz_answers!inner (
            id,
            answer_text,
            is_correct
          ),
          category_id,
          difficulty
        `)
        .eq('is_active', true)  // Only get active questions
        .order('id', { ascending: false })
        .limit(fetchLimit)
        .abortSignal(new AbortController().signal);

      if (category) {
        query = query.eq('category_id', category);
      }

      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching questions:', error);
        throw new Error('Failed to fetch questions: ' + error.message);
      }

      if (!data || data.length === 0) {
        console.error('No questions returned from database');
        throw new Error('No questions available');
      }

      // Map and validate questions, ensuring each has at least 4 answers
      const validQuestions = data
        .filter(q => q.quiz_answers?.length >= 4)
        .map(q => ({
          id: q.id,
          question: q.question,
          answers: q.quiz_answers.map(a => a.answer_text),
          correctAnswer: q.quiz_answers.findIndex(a => a.is_correct),
          category: q.category_id,
          difficulty: q.difficulty
        }))
        .filter(q => q.answers.length >= 4 && q.correctAnswer !== -1);

      if (validQuestions.length < count) {
        console.error(`Not enough valid questions. Required: ${count}, Found: ${validQuestions.length}`);
        throw new Error('Insufficient valid questions available');
      }

      console.log(`Successfully fetched ${validQuestions.length} questions`);
      
      // Shuffle the questions and return the required number
      const shuffled = validQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

      return shuffled;

    } catch (error) {
      console.error('getQuestions failed:', error);
      // Add more context to the error
      throw new Error(
        `Failed to fetch battle questions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static async updateStats(
    userId: string,
    results: BattleResults,
    currentStats?: Partial<BattleStats>
  ): Promise<void> {
    try {
      const newStats = {
        user_id: userId,
        total_battles: (currentStats?.totalBattles || 0) + 1,
        wins: (currentStats?.wins || 0) + (results.isVictory ? 1 : 0),
        losses: (currentStats?.losses || 0) + (results.isVictory ? 0 : 1),
        total_xp_earned: (currentStats?.totalXpEarned || 0) + results.experienceGained,
        total_coins_earned: (currentStats?.totalCoinsEarned || 0) + results.coinsEarned,
        highest_streak: Math.max(
          currentStats?.highestStreak || 0,
          results.streakBonus / BATTLE_CONFIG.rewards.streakBonus.multiplier
        ),
        score_average: this.calculateNewAverageScore(
          results.scorePercentage,
          currentStats?.averageScore || 0,
          currentStats?.totalBattles || 0
        ),
        last_battle_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('battle_stats')
        .upsert(newStats);

      if (error) throw error;

      // Record battle history
      await this.recordBattleHistory(userId, results);
    } catch (error) {
      console.error('Error updating battle stats:', error);
    }
  }

  static async saveBattleProgress(battleState: any): Promise<void> {
    try {
      const { data: existingSave, error: fetchError } = await supabase
        .from('battle_saves')
        .select('id')
        .eq('user_id', battleState.userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking existing battle save:', fetchError);
        throw fetchError;
      }

      const battleSaveData = {
        user_id: battleState.userId,
        battle_state: {
          questions: battleState.questions,
          currentQuestion: battleState.currentQuestion,
          playerAnswers: battleState.playerAnswers,
          score: battleState.score,
          timeLeft: battleState.timeLeft,
          status: battleState.status,
          lastError: battleState.lastError,
          timestamp: new Date().toISOString()
        }
      };

      let saveError;
      if (existingSave?.id) {
        // Update existing save
        const { error } = await supabase
          .from('battle_saves')
          .update(battleSaveData)
          .eq('id', existingSave.id);
        saveError = error;
      } else {
        // Create new save
        const { error } = await supabase
          .from('battle_saves')
          .insert([battleSaveData]);
        saveError = error;
      }

      if (saveError) {
        console.error('Error saving battle state:', saveError);
        throw saveError;
      }
    } catch (error) {
      console.error('saveBattleProgress failed:', error);
      throw error;
    }
  }

  static async recoverBattleState(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('battle_saves')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No saved state found
          return null;
        }
        console.error('Error recovering battle state:', error);
        throw error;
      }

      if (!data || !data.battle_state) {
        return null;
      }

      // Validate timestamp - only recover battles less than 1 hour old
      const savedTime = new Date(data.battle_state.timestamp).getTime();
      const currentTime = new Date().getTime();
      const hourInMs = 60 * 60 * 1000;
      
      if (currentTime - savedTime > hourInMs) {
        // Delete old save
        await supabase
          .from('battle_saves')
          .delete()
          .eq('id', data.id);
        return null;
      }

      // Clean up save after successful recovery
      await supabase
        .from('battle_saves')
        .delete()
        .eq('id', data.id);

      return data.battle_state;
    } catch (error) {
      console.error('recoverBattleState failed:', error);
      throw error;
    }
  }

  static async clearBattleSave(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('battle_saves')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error clearing battle save:', error);
        throw error;
      }
    } catch (error) {
      console.error('clearBattleSave failed:', error);
      throw error;
    }
  }

  private static calculateNewAverageScore(
    newScore: number,
    currentAverage: number,
    totalBattles: number
  ): number {
    return Math.round(
      ((currentAverage * totalBattles) + newScore) / (totalBattles + 1)
    );
  }

  private static async recordBattleHistory(
    userId: string,
    results: BattleResults
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('battle_history')
        .insert({
          user_id: userId,
          score_player: results.totalScore,
          is_victory: results.isVictory,
          xp_earned: results.experienceGained,
          coins_earned: results.coinsEarned,
          streak_bonus: results.streakBonus
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording battle history:', error);
      // Don't throw - allow battle to continue even if history recording fails
    }
  }
}