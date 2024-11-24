export interface MoodleEvent {
  type: 'quiz_completed' | 'forum_post' | 'assignment_submitted';
  token: string;
  data: Record<string, any>;
} 

