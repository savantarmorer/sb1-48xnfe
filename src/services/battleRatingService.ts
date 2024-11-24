import { BATTLE_CONFIG } from '../config/battleConfig';
import { supabase } from '../lib/supabase';

interface RatingData {
  userId: string;
  rating: number;
  wins: number;
  losses: number;
  streak: number;
}

/**
 * Service for managing battle ratings and rankings
 */
export class BattleRatingService {
  /**
   * Updates player ratings after a battle
   * 
   * @param winnerId - Winner's user ID
   * @param loserId - Loser's user ID
   */
  static async updateRatings(winnerId: string, loserId: string): Promise<void> {
    try {
      const [winner, loser] = await Promise.all([
        this.getRating(winnerId),
        this.getRating(loserId)
      ]);

      const { winnerRating, loserRating } = this.calculateNewRatings(
        winner.rating,
        loser.rating
      );

      await Promise.all([
        this.saveRating({
          ...winner,
          rating: winnerRating,
          wins: winner.wins + 1,
          streak: winner.streak + 1
        }),
        this.saveRating({
          ...loser,
          rating: loserRating,
          losses: loser.losses + 1,
          streak: 0
        })
      ]);
    } catch (error) {
      console.error('Error updating ratings:', error);
    }
  }

  /**
   * Calculates new ratings using ELO system
   */
  private static calculateNewRatings(winnerRating: number, loserRating: number) {
    const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
    const expectedLoser = 1 - expectedWinner;
    const kFactor = BATTLE_CONFIG.matchmaking.kFactor;

    return {
      winnerRating: Math.round(
        winnerRating + kFactor * (1 - expectedWinner)
      ),
      loserRating: Math.round(
        loserRating + kFactor * (0 - expectedLoser)
      )
    };
  }

  private static async getRating(userId: string): Promise<RatingData> {
    const { data } = await supabase
      .from('battle_ratings')
      .select('*')
      .eq('user_id', userId)
      .single();

    return data || {
      userId,
      rating: BATTLE_CONFIG.matchmaking.defaultRating,
      wins: 0,
      losses: 0,
      streak: 0
    };
  }

  private static async saveRating(rating: RatingData): Promise<void> {
    await supabase
      .from('battle_ratings')
      .upsert({
        user_id: rating.userId,
        rating: rating.rating,
        wins: rating.wins,
        losses: rating.losses,
        streak: rating.streak
      });
  }
}

/**
 * Service Role:
 * - Rating calculations
 * - Streak tracking
 * - Database persistence
 * 
 * Dependencies:
 * - Battle configuration
 * - Supabase client
 * 
 * Used by:
 * - BattleService
 * - Matchmaking service
 * 
 * Scalability:
 * - Database integration
 * - Configurable rating system
 * - Performance tracking
 */ 

