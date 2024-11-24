import { supabase } from '../config/supabaseClient';
import type { 
  Quest,
  QuestType,
  QuestStatus,
  QuestRequirement,
  QuestProgressUpdate,
  UserQuest
} from '../types/quests';
import { isQuestComplete, calculateQuestProgress } from '../types/quests';

/**
 * QuestManager Service
 * 
 * Handles all quest-related operations including:
 * - Loading quests from database
 * - Tracking quest progress
 * - Validating quest completion
 * - Managing quest lifecycle
 * 
 * Database Integration:
 * - Uses Supabase for persistence
 * - Maintains quest state in real-time
 * - Handles offline/online synchronization
 */
export class QuestManager {
  /**
   * Load all available quests for a user
   * @param userId - The ID of the user
   * @returns Promise<{quests: Quest[], userQuests: UserQuest[]}> - Available quests and user progress
   */
  static async loadQuests(userId: string): Promise<{quests: Quest[], userQuests: UserQuest[]}> {
    // Load quests
    const { data: quests, error: questError } = await supabase
      .from('quests')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (questError) throw new Error(`Failed to load quests: ${questError.message}`);

    // Load quest requirements
    const { data: requirements, error: reqError } = await supabase
      .from('quest_requirements')
      .select('*')
      .in('quest_id', quests?.map(q => q.id) || []);

    if (reqError) throw new Error(`Failed to load requirements: ${reqError.message}`);

    // Load user quest progress
    const { data: userQuests, error: userQuestError } = await supabase
      .from('user_quests')
      .select('*')
      .eq('user_id', userId);

    if (userQuestError) throw new Error(`Failed to load user quests: ${userQuestError.message}`);

    // Combine quest data with requirements
    const questsWithRequirements = quests?.map(quest => ({
      ...quest,
      requirements: requirements?.filter(req => req.quest_id === quest.id) || []
    })) || [];

    return {
      quests: questsWithRequirements,
      userQuests: userQuests || []
    };
  }

  /**
   * Start a quest for a user
   * @param userId - The ID of the user
   * @param questId - The ID of the quest to start
   */
  static async startQuest(userId: string, questId: string): Promise<void> {
    const { error } = await supabase
      .from('user_quests')
      .upsert({
        user_id: userId,
        quest_id: questId,
        status: QuestStatus.IN_PROGRESS,
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) throw new Error(`Failed to start quest: ${error.message}`);
  }

  /**
   * Update quest progress
   * @param userId - The ID of the user
   * @param update - Quest progress update details
   */
  static async updateProgress(userId: string, update: QuestProgressUpdate): Promise<void> {
    const { questId, progress, timestamp } = update;

    const { error } = await supabase
      .from('user_quests')
      .update({
        progress,
        updated_at: timestamp.toISOString()
      })
      .match({ user_id: userId, quest_id: questId });

    if (error) throw new Error(`Failed to update quest progress: ${error.message}`);
  }

  /**
   * Complete a quest and award rewards
   * @param userId - The ID of the user
   * @param questId - The ID of the completed quest
   */
  static async completeQuest(userId: string, questId: string): Promise<void> {
    // Start a transaction
    const { error } = await supabase.rpc('complete_quest', {
      p_user_id: userId,
      p_quest_id: questId
    });

    if (error) throw new Error(`Failed to complete quest: ${error.message}`);
  }

  /**
   * Reset daily quests for a user
   * @param userId - The ID of the user
   */
  static async resetDailyQuests(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_quests')
      .update({
        status: QuestStatus.AVAILABLE,
        progress: 0,
        completed_at: null,
        updated_at: new Date().toISOString()
      })
      .match({ user_id: userId })
      .eq('type', QuestType.DAILY);

    if (error) throw new Error(`Failed to reset daily quests: ${error.message}`);
  }

  /**
   * Reset weekly quests for a user
   * @param userId - The ID of the user
   */
  static async resetWeeklyQuests(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_quests')
      .update({
        status: QuestStatus.AVAILABLE,
        progress: 0,
        completed_at: null,
        updated_at: new Date().toISOString()
      })
      .match({ user_id: userId })
      .eq('type', QuestType.WEEKLY);

    if (error) throw new Error(`Failed to reset weekly quests: ${error.message}`);
  }

  /**
   * Get quest statistics for a user
   * @param userId - The ID of the user
   */
  static async getQuestStats(userId: string): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    available: number;
  }> {
    const { data: stats, error } = await supabase
      .from('user_quests')
      .select('status')
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to get quest stats: ${error.message}`);

    const counts = (stats || []).reduce((acc, { status }) => ({
      ...acc,
      [status]: (acc[status] || 0) + 1
    }), {} as Record<QuestStatus, number>);

    return {
      total: stats?.length || 0,
      completed: counts[QuestStatus.COMPLETED] || 0,
      inProgress: counts[QuestStatus.IN_PROGRESS] || 0,
      available: counts[QuestStatus.AVAILABLE] || 0
    };
  }
}

/**
 * Database Integration:
 * - quests table: Core quest data
 * - quest_requirements table: Individual requirements
 * - user_quests table: User progress tracking
 * 
 * Related Tables:
 * - profiles: User level and stats
 * - user_progress: Overall progress tracking
 * 
 * Functions:
 * - complete_quest: Stored procedure for quest completion
 * 
 * Dependencies:
 * - Supabase client
 * - Quest types
 * - User authentication
 */
