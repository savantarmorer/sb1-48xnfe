import {
  isAchievement,
  isAchievementReward,
  isBattleRewards,
  isBattleResults,
  isXPGain,
  isQuest,
  isInventoryItem,
  isValidGameStateUpdate,
  isActivityEntry
} from '../guards';
import { Achievement, AchievementReward } from '../achievements';
import { BattleRewards, BattleResults } from '../battle';
import { GameState, XPGain, ActivityEntry } from '../game';
import { Quest } from '../quests';
import { InventoryItem } from '../items';

describe('Type Guards', () => {
  describe('isAchievement', () => {
    it('should validate a valid achievement', () => {
      const validAchievement: Achievement = {
        id: 'test-achievement',
        title: 'Test Achievement',
        description: 'A test achievement',
        rewards: [],
        trigger: {
          type: 'xp_gained',
          value: 100
        }
      };
      expect(isAchievement(validAchievement)).toBe(true);
    });

    it('should reject invalid achievements', () => {
      const cases = [
        { id: 123, title: 'Invalid ID Type' },
        { id: 'valid', title: 123 },
        { id: 'valid', title: 'Valid', description: 123 },
        { id: 'valid', title: 'Valid', description: 'Valid', rewards: 'not-array' },
        { id: 'valid', title: 'Valid', description: 'Valid', rewards: [], trigger: 'invalid' }
      ];

      cases.forEach(testCase => {
        expect(isAchievement(testCase)).toBe(false);
      });
    });
  });

  describe('isAchievementReward', () => {
    it('should validate valid achievement rewards', () => {
      const validRewards: AchievementReward[] = [
        { type: 'xp', amount: 100 },
        { type: 'coins', amount: 50 },
        { type: 'item', amount: 1 },
        { type: 'title', amount: 1 }
      ];

      validRewards.forEach(reward => {
        expect(isAchievementReward(reward)).toBe(true);
      });
    });

    it('should reject invalid achievement rewards', () => {
      const cases = [
        { type: 'invalid', amount: 100 },
        { type: 'xp', amount: 'invalid' },
        { type: 123, amount: 100 },
        {}
      ];

      cases.forEach(testCase => {
        expect(isAchievementReward(testCase)).toBe(false);
      });
    });
  });

  describe('isBattleRewards', () => {
    it('should validate valid battle rewards', () => {
      const validRewards: BattleRewards = {
        xp: 100,
        coins: 50,
        streakBonus: 10,
        timeBonus: 5,
        achievements: []
      };
      expect(isBattleRewards(validRewards)).toBe(true);
    });

    it('should validate battle rewards without optional fields', () => {
      const minimalRewards: BattleRewards = {
        xp: 100,
        coins: 50
      };
      expect(isBattleRewards(minimalRewards)).toBe(true);
    });

    it('should reject invalid battle rewards', () => {
      const cases = [
        { xp: 'invalid', coins: 50 },
        { xp: 100, coins: 'invalid' },
        { xp: 100, coins: 50, streakBonus: 'invalid' },
        { xp: 100, coins: 50, achievements: 'not-array' }
      ];

      cases.forEach(testCase => {
        expect(isBattleRewards(testCase)).toBe(false);
      });
    });
  });

  describe('isXPGain', () => {
    it('should validate valid XP gain', () => {
      const validXPGain: XPGain = {
        amount: 100,
        source: 'battle',
        timestamp: new Date().toISOString(),
        multiplier: 1.5
      };
      expect(isXPGain(validXPGain)).toBe(true);
    });

    it('should reject invalid XP gain', () => {
      const cases = [
        { amount: 'invalid', source: 'battle' },
        { amount: 100, source: 123 },
        { amount: 100, source: 'battle', timestamp: 123 },
        { amount: 100, source: 'battle', timestamp: 'invalid-date', multiplier: 'invalid' }
      ];

      cases.forEach(testCase => {
        expect(isXPGain(testCase)).toBe(false);
      });
    });
  });

  describe('isActivityEntry', () => {
    it('should validate valid activity entries', () => {
      const validEntry: ActivityEntry = {
        id: 'test-activity',
        userId: 'user-123',
        type: 'battle',
        details: { score: 100 },
        timestamp: new Date().toISOString()
      };
      expect(isActivityEntry(validEntry)).toBe(true);
    });

    it('should reject invalid activity entries', () => {
      const cases = [
        { id: 123, userId: 'valid' },
        { id: 'valid', userId: 123 },
        { id: 'valid', userId: 'valid', type: 'invalid-type' },
        { id: 'valid', userId: 'valid', type: 'battle', details: 'not-object' }
      ];

      cases.forEach(testCase => {
        expect(isActivityEntry(testCase)).toBe(false);
      });
    });
  });

  describe('isValidGameStateUpdate', () => {
    const baseState: GameState = {
      user: {
        id: 'test-user',
        username: 'tester',
        level: 1,
        xp: 0,
        coins: 0,
        inventory: [],
        achievements: [],
        streak: 0,
        streakMultiplier: 1
      },
      battle: {
        inProgress: false,
        status: 'idle',
        currentOpponent: null,
        questions: [],
        score: { player: 0, opponent: 0 }
      },
      statistics: {
        totalXP: 0,
        totalStudyTime: 0,
        studySessions: [],
        recentActivity: []
      },
      quests: [],
      completedQuests: []
    };

    it('should validate valid game state updates', () => {
      const validUpdates = [
        { user: { level: 2, xp: 100 } },
        { battle: { inProgress: true, score: { player: 10 } } },
        { statistics: { totalXP: 100, totalStudyTime: 3600 } }
      ];

      validUpdates.forEach(update => {
        expect(isValidGameStateUpdate(baseState, update)).toBe(true);
      });
    });

    it('should reject invalid game state updates', () => {
      const invalidUpdates = [
        { user: { level: 'invalid' } },
        { battle: { inProgress: 'invalid' } },
        { statistics: { totalXP: 'invalid' } }
      ];

      invalidUpdates.forEach(update => {
        expect(isValidGameStateUpdate(baseState, update)).toBe(false);
      });
    });
  });
});
