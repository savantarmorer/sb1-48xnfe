export const translations = {
  en: {
    battle: {
      victory: 'Victory!',
      defeat: 'Defeat',
      completed: 'Battle Completed',
      searching: 'Searching for opponent...',
      searchingDesc: 'This may take a few moments',
      getReady: 'Get Ready!',
      startBattle: 'Start Battle'
    },
    levelUp: {
      title: 'Level Up! Level {level}',
      description: 'You reached a new level!'
    },
    quest: {
      completed: 'Quest Completed',
      complete: 'Complete',
      type: {
        daily: 'Daily',
        weekly: 'Weekly',
        story: 'Story',
        achievement: 'Achievement'
      }
    }
  },
  pt: {
    // Portuguese translations...
  },
  es: {
    // Spanish translations...
  }
} as const;

export type TranslationKeys = keyof typeof translations;
export type Languages = keyof typeof translations;

