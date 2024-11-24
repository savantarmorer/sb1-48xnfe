import { BATTLE_CONFIG } from '../config/battleConfig';

interface Player {
  id: string;
  rating: number;
  level: number;
  streak: number;
}

/**
 * Service for handling battle matchmaking
 */
export class MatchmakingService {
  /**
   * Finds a suitable opponent based on player rating and level
   * 
   * @param player - Current player data
   * @returns Promise with matched opponent or null
   */
  static async findOpponent(player: Player): Promise<Player | null> {
    // In real implementation, this would query the database
    // For now, generate a simulated opponent
    return this.generateSimulatedOpponent(player);
  }

  /**
   * Updates player ratings after a battle
   * Uses ELO rating system
   * 
   * @param winner - Winner's data
   * @param loser - Loser's data
   * @returns Updated ratings for both players
   */
  static updateRatings(winner: Player, loser: Player): { winnerRating: number; loserRating: number } {
    const expectedWinner = this.calculateExpectedScore(winner.rating, loser.rating);
    const expectedLoser = 1 - expectedWinner;

    const winnerRating = Math.round(
      winner.rating + BATTLE_CONFIG.matchmaking.kFactor * (1 - expectedWinner)
    );
    const loserRating = Math.round(
      loser.rating + BATTLE_CONFIG.matchmaking.kFactor * (0 - expectedLoser)
    );

    return { winnerRating, loserRating };
  }

  private static calculateExpectedScore(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  private static generateSimulatedOpponent(player: Player): Player {
    const ratingDiff = Math.floor(Math.random() * 200) - 100;
    const levelDiff = Math.floor(Math.random() * 3) - 1;

    return {
      id: `bot_${Date.now()}`,
      rating: player.rating + ratingDiff,
      level: Math.max(1, player.level + levelDiff),
      streak: Math.floor(Math.random() * 3)
    };
  }
}

/**
 * Service Role:
 * - Opponent matching
 * - Rating calculations
 * - Match balancing
 * 
 * Dependencies:
 * - Battle configuration
 * 
 * Used by:
 * - BattleService
 * - useBattle hook
 * 
 * Scalability:
 * - Ready for real matchmaking implementation
 * - Configurable matching parameters
 * - Rating system extensibility
 */ 

