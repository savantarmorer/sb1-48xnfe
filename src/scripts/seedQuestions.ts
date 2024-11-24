import { BattleService } from '../services/battleService';

const sampleQuestions = [
  {
    question: "Qual é o prazo para contestação em procedimento comum?",
    answers: [
      "10 dias úteis",
      "15 dias úteis",
      "20 dias úteis",
      "30 dias úteis"
    ],
    correctAnswer: 1,  // 15 dias úteis
    category: "prazos",
    difficulty: 1
  },
  {
    question: "O que é o princípio do contraditório?",
    answers: [
      "Direito de recorrer sempre",
      "Direito de ser ouvido e se manifestar no processo",
      "Direito de produzir provas",
      "Direito de ter um advogado"
    ],
    correctAnswer: 1,
    category: "principios",
    difficulty: 1
  },
  {
    question: "Qual é o prazo para apresentar réplica à contestação?",
    answers: [
      "5 dias úteis",
      "10 dias úteis",
      "15 dias úteis",
      "20 dias úteis"
    ],
    correctAnswer: 2,  // 15 dias úteis
    category: "prazos",
    difficulty: 1
  },
  {
    question: "O que é a tutela provisória?",
    answers: [
      "Decisão final do processo",
      "Medida urgente ou baseada em evidência",
      "Recurso especial",
      "Tipo de perícia"
    ],
    correctAnswer: 1,
    category: "tutela",
    difficulty: 1
  },
  {
    question: "Qual é o prazo para agravo de instrumento?",
    answers: [
      "5 dias úteis",
      "10 dias úteis",
      "15 dias úteis",
      "20 dias úteis"
    ],
    correctAnswer: 2,  // 15 dias úteis
    category: "recursos",
    difficulty: 1
  }
];

async function seedQuestions() {
  console.log('Starting to seed questions...');
  
  try {
    for (const question of sampleQuestions) {
      await BattleService.addQuestion(question);
      console.log(`Added question: ${question.question}`);
    }
    
    console.log('Successfully seeded all questions!');
  } catch (error) {
    console.error('Error seeding questions:', error);
  }
}

// Execute if running directly
if (require.main === module) {
  seedQuestions();
}
