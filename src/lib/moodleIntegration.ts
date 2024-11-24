import { Achievement } from '../types/achievements';

/**
 * Moodle event types
 */
interface MoodleEvent {
  type: 'quiz_completed' | 'forum_post' | 'assignment_submitted' | 'resource_viewed';
  userId: string;
  courseId: string;
  timestamp: Date;
  data: Record<string, any>;
}

/**
 * Quiz completion data
 */
interface QuizData {
  score: number;
  maxScore: number;
  timeSpent: number;
  attempts: number;
}

/**
 * Forum post data
 */
interface ForumData {
  wordCount: number;
  isFirstPost: boolean;
  topicId: string;
}

/**
 * Assignment data
 */
interface AssignmentData {
  deadline: string;
  timeSubmitted: string;
  fileCount: number;
}

/**
 * Singleton class for Moodle integration
 */
export class MoodleIntegration {
  private static instance: MoodleIntegration;
  private eventQueue: MoodleEvent[] = [];

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): MoodleIntegration {
    if (!MoodleIntegration.instance) {
      MoodleIntegration.instance = new MoodleIntegration();
    }
    return MoodleIntegration.instance;
  }

  /**
   * Sets up event listeners for Moodle events
   */
  private setupEventListeners() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'MOODLE_EVENT') {
        this.handleMoodleEvent(event.data.payload);
      }
    });
  }

  /**
   * Handles incoming Moodle events
   */
  private handleMoodleEvent(event: MoodleEvent) {
    this.eventQueue.push(event);
    this.processEventQueue();
  }

  /**
   * Processes queued events
   */
  private async processEventQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (!event) continue;

      switch (event.type) {
        case 'quiz_completed':
          await this.handleQuizCompletion(event);
          break;
        case 'forum_post':
          await this.handleForumPost(event);
          break;
        case 'assignment_submitted':
          await this.handleAssignmentSubmission(event);
          break;
        case 'resource_viewed':
          await this.handleResourceView(event);
          break;
      }
    }
  }

  /**
   * Handles quiz completion events
   */
  private async handleQuizCompletion(event: MoodleEvent) {
    const { score, maxScore } = event.data as QuizData;
    const percentage = (score / maxScore) * 100;
    
    // Calculate XP based on score
    const baseXP = Math.floor(percentage * 2);
    const bonusXP = percentage >= 90 ? 50 : 0;
    
    return {
      xp: baseXP + bonusXP,
      coins: Math.floor(percentage / 2),
      achievements: this.checkQuizAchievements(percentage)
    };
  }

  /**
   * Handles forum post events
   */
  private async handleForumPost(event: MoodleEvent) {
    const { wordCount, isFirstPost } = event.data as ForumData;
    
    return {
      xp: Math.min(wordCount / 2, 100) + (isFirstPost ? 50 : 0),
      coins: Math.floor(wordCount / 10),
      achievements: this.checkForumAchievements(event.userId)
    };
  }

  /**
   * Handles assignment submission events
   */
  private async handleAssignmentSubmission(event: MoodleEvent) {
    const { deadline, timeSubmitted } = event.data as AssignmentData;
    const earlySubmission = new Date(deadline).getTime() - new Date(timeSubmitted).getTime() > 86400000; // 24h
    
    return {
      xp: 100 + (earlySubmission ? 50 : 0),
      coins: earlySubmission ? 50 : 25,
      achievements: this.checkAssignmentAchievements(event.userId)
    };
  }

  /**
   * Handles resource view events
   */
  private async handleResourceView(event: MoodleEvent) {
    const { timeSpent } = event.data;
    const meaningfulInteraction = timeSpent > 60; // More than 1 minute
    
    return {
      xp: meaningfulInteraction ? 10 : 0,
      coins: meaningfulInteraction ? 5 : 0,
      achievements: []
    };
  }

  /**
   * Checks for quiz-related achievements
   */
  private checkQuizAchievements(score: number): Achievement[] {
    if (score === 100) {
      return [{
        id: 'perfect_quiz',
        title: 'Perfect Score',
        description: 'Score 100% on a quiz',
        category: 'quests',
        points: 50,
        rarity: 'rare',
        unlocked: true,
        unlockedAt: new Date(),
        prerequisites: [],
        dependents: [],
        triggerConditions: [{
          type: 'quiz_score',
          value: 100,
          comparison: 'eq'
        }],
        order: 1
      }];
    }
    return [];
  }

  /**
   * Checks for forum-related achievements
   */
  private checkForumAchievements(userId: string): Achievement[] {
    // Implementation for forum achievements
    return [];
  }

  /**
   * Checks for assignment-related achievements
   */
  private checkAssignmentAchievements(userId: string): Achievement[] {
    // Implementation for assignment achievements
    return [];
  }
}

/**
 * Module Role:
 * - Integrates with Moodle LMS
 * - Processes learning events
 * - Awards XP and achievements
 * 
 * Dependencies:
 * - Achievement types
 * - Event system
 * 
 * Used By:
 * - Game progression system
 * - Achievement system
 * - XP/Coins system
 * 
 * Features:
 * - Event queue processing
 * - Achievement tracking
 * - XP/Coins rewards
 * - Early submission bonuses
 * 
 * Scalability:
 * - Singleton pattern
 * - Event-driven architecture
 * - Type-safe events
 * - Modular achievement checks
 */

