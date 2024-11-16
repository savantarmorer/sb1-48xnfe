import { User, Challenge, Achievement } from '../types';

interface MoodleEvent {
  type: 'quiz_completed' | 'forum_post' | 'assignment_submitted' | 'resource_viewed';
  userId: string;
  courseId: string;
  timestamp: Date;
  data: Record<string, any>;
}

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

  private setupEventListeners() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'MOODLE_EVENT') {
        this.handleMoodleEvent(event.data.payload);
      }
    });
  }

  private handleMoodleEvent(event: MoodleEvent) {
    this.eventQueue.push(event);
    this.processEventQueue();
  }

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

  private async handleQuizCompletion(event: MoodleEvent) {
    const { score, maxScore } = event.data;
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

  private async handleForumPost(event: MoodleEvent) {
    const { wordCount, isFirstPost } = event.data;
    
    return {
      xp: Math.min(wordCount / 2, 100) + (isFirstPost ? 50 : 0),
      coins: Math.floor(wordCount / 10),
      achievements: this.checkForumAchievements(event.userId)
    };
  }

  private async handleAssignmentSubmission(event: MoodleEvent) {
    const { submittedBefore, deadline } = event.data;
    const earlySubmission = new Date(deadline).getTime() - new Date().getTime() > 86400000; // 24h
    
    return {
      xp: 100 + (earlySubmission ? 50 : 0),
      coins: earlySubmission ? 50 : 25,
      achievements: this.checkAssignmentAchievements(event.userId)
    };
  }

  private async handleResourceView(event: MoodleEvent) {
    const { timeSpent } = event.data;
    const meaningfulInteraction = timeSpent > 60; // More than 1 minute
    
    return {
      xp: meaningfulInteraction ? 10 : 0,
      coins: meaningfulInteraction ? 5 : 0,
      achievements: []
    };
  }

  private checkQuizAchievements(score: number): Achievement[] {
    const achievements: Achievement[] = [];
    
    if (score === 100) {
      achievements.push({
        id: 'perfect_quiz',
        title: 'Perfect Score',
        description: 'Score 100% on a quiz',
        icon: '🎯',
        rarity: 'rare',
        unlockedAt: new Date()
      });
    }
    
    return achievements;
  }

  private checkForumAchievements(userId: string): Achievement[] {
    // Implementation for forum achievements
    return [];
  }

  private checkAssignmentAchievements(userId: string): Achievement[] {
    // Implementation for assignment achievements
    return [];
  }
}