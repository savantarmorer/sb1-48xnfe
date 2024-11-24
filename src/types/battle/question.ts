export interface BattleQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  category?: string;
  difficulty?: number;
  timeLimit?: number;
} 