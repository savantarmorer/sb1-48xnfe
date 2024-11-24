import { BattleQuestion } from '../types/battle';
import { supabase } from '../lib/supabase';

/**
 * Database question type
 * Represents the question structure in the database
 */
interface DBQuestion {
  id: string;
  question: string;
  answers: string[];
  correct_answer: number;
  difficulty: number;
  category?: string;
  explanation?: string;
  source?: string;
  tags?: string[];
  is_active: boolean;
}

/**
 * Service for managing battle questions
 */
export class QuestionService {
  /**
   * Fetches questions from the database
   * 
   * @param count - Number of questions to fetch
   * @param category - Optional category filter
   * @param difficulty - Optional difficulty filter
   * @returns Promise with formatted questions
   */
  static async fetchQuestions(
    count: number,
    category?: string,
    difficulty?: number
  ): Promise<BattleQuestion[]> {
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('is_active', true);

      if (category) {
        query = query.eq('category', category);
      }

      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }

      const { data, error } = await query
        .limit(count)
        .order('RANDOM()');

      if (error) throw error;

      return (data as DBQuestion[]).map(this.formatQuestion);
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  }

  /**
   * Validates an answer for a question
   * 
   * @param questionId - Question ID
   * @param answer - User's answer index
   * @returns Promise with validation result
   */
  static async validateAnswer(questionId: string, answer: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('correct_answer')
        .eq('id', questionId)
        .single();

      if (error) throw error;

      return data.correct_answer === answer;
    } catch (error) {
      console.error('Error validating answer:', error);
      return false;
    }
  }

  /**
   * Formats a database question to frontend format
   * 
   * @param dbQuestion - Database question object
   * @returns Formatted Question object
   */
  private static formatQuestion(dbQuestion: DBQuestion): BattleQuestion {
    return {
      id: dbQuestion.id,
      question: dbQuestion.question,
      answers: dbQuestion.answers,
      correctAnswer: dbQuestion.correct_answer,
      category: dbQuestion.category,
      difficulty: dbQuestion.difficulty,
      timeLimit: undefined // Can be added later if needed
    };
  }
}

/**
 * Service Role:
 * - Question retrieval and validation
 * - Database interaction
 * - Question formatting
 * 
 * Dependencies:
 * - Supabase client
 * - Question types
 * - Database schema
 * 
 * Used by:
 * - BattleService
 * - Admin question management
 * - Battle system
 * 
 * Features:
 * - Random question selection
 * - Category filtering
 * - Difficulty filtering
 * - Answer validation
 * 
 * Scalability:
 * - Separate DB interface
 * - Type-safe operations
 * - Easy to extend
 * - Caching support (future)
 * 
 * Error Handling:
 * - Database errors
 * - Type validation
 * - Fallback responses
 */ 

