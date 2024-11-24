import { 
  Achievement, 
  AchievementTrigger, 
  AchievementReward 
} from './achievements';
import { 
  BattleState, 
  BattleResults, 
  BattleRewards 
} from './battle';
import { 
  GameState, 
  User, 
  GameStatistics,
  ActivityEntry,
  XPGain
} from './game';
import { Quest, QuestRequirement } from './quests';
import { InventoryItem, Item } from './items';

/**
 * Detailed error logging for type validation failures
 */
const logTypeError = (type: string, obj: any, missingProps: string[] = [], invalidProps: { [key: string]: string }[] = []): void => {
  console.error(`Invalid ${type} object:`, {
    receivedObject: obj,
    missingRequiredProperties: missingProps,
    invalidPropertyTypes: invalidProps,
    expectedType: type
  });
};

/**
 * Type guard for Achievement
 */
export const isAchievement = (achievement: any): achievement is Achievement => {
  if (!achievement || typeof achievement !== 'object') {
    logTypeError('Achievement', achievement, ['id', 'title', 'description', 'trigger', 'rewards']);
    return false;
  }

  const invalidProps: { [key: string]: string }[] = [];
  if (typeof achievement.id !== 'string') invalidProps.push({ id: `expected string, got ${typeof achievement.id}` });
  if (typeof achievement.title !== 'string') invalidProps.push({ title: `expected string, got ${typeof achievement.title}` });
  if (typeof achievement.description !== 'string') invalidProps.push({ description: `expected string, got ${typeof achievement.description}` });
  if (!achievement.trigger || typeof achievement.trigger !== 'object') invalidProps.push({ trigger: 'expected object' });
  if (!Array.isArray(achievement.rewards)) invalidProps.push({ rewards: `expected array, got ${typeof achievement.rewards}` });

  const isValid = typeof achievement.id === 'string'
    && typeof achievement.title === 'string'
    && typeof achievement.description === 'string'
    && achievement.trigger
    && typeof achievement.trigger === 'object'
    && Array.isArray(achievement.rewards);

  if (!isValid && invalidProps.length > 0) {
    logTypeError('Achievement', achievement, [], invalidProps);
  }

  return isValid;
};

/**
 * Type guard for AchievementReward
 */
export const isAchievementReward = (obj: any): obj is AchievementReward => {
  if (!obj) {
    logTypeError('AchievementReward', obj, ['type', 'amount']);
    return false;
  }

  const invalidProps: { [key: string]: string }[] = [];
  if (!['xp', 'coins', 'item', 'title'].includes(obj.type)) {
    invalidProps.push({ type: `expected one of ['xp', 'coins', 'item', 'title'], got ${obj.type}` });
  }
  if (typeof obj.amount !== 'number') {
    invalidProps.push({ amount: `expected number, got ${typeof obj.amount}` });
  }

  const isValid = obj 
    && ['xp', 'coins', 'item', 'title'].includes(obj.type)
    && typeof obj.amount === 'number';

  if (!isValid && invalidProps.length > 0) {
    logTypeError('AchievementReward', obj, [], invalidProps);
  }

  return isValid;
};

/**
 * Type guard for BattleRewards
 */
export const isBattleRewards = (obj: any): obj is BattleRewards => {
  if (!obj) {
    logTypeError('BattleRewards', obj, ['xp', 'coins', 'streakBonus', 'timeBonus', 'achievements']);
    return false;
  }

  const invalidProps: { [key: string]: string }[] = [];
  if (typeof obj.xp !== 'number') invalidProps.push({ xp: `expected number, got ${typeof obj.xp}` });
  if (typeof obj.coins !== 'number') invalidProps.push({ coins: `expected number, got ${typeof obj.coins}` });
  if (obj.streakBonus && typeof obj.streakBonus !== 'number') invalidProps.push({ streakBonus: `expected number, got ${typeof obj.streakBonus}` });
  if (obj.timeBonus && typeof obj.timeBonus !== 'number') invalidProps.push({ timeBonus: `expected number, got ${typeof obj.timeBonus}` });
  if (obj.achievements && !Array.isArray(obj.achievements)) invalidProps.push({ achievements: `expected array, got ${typeof obj.achievements}` });

  const isValid = obj 
    && typeof obj.xp === 'number'
    && typeof obj.coins === 'number'
    && (!obj.streakBonus || typeof obj.streakBonus === 'number')
    && (!obj.timeBonus || typeof obj.timeBonus === 'number')
    && (!obj.achievements || Array.isArray(obj.achievements));

  if (!isValid && invalidProps.length > 0) {
    logTypeError('BattleRewards', obj, [], invalidProps);
  }

  return isValid;
};

/**
 * Type guard for BattleResults
 */
export const isBattleResults = (obj: any): obj is BattleResults => {
  if (!obj) {
    logTypeError('BattleResults', obj, ['isVictory', 'score', 'xp', 'coins', 'totalScore', 'opponent']);
    return false;
  }

  const invalidProps: { [key: string]: string }[] = [];
  if (typeof obj.isVictory !== 'boolean') invalidProps.push({ isVictory: `expected boolean, got ${typeof obj.isVictory}` });
  if (typeof obj.score !== 'number') invalidProps.push({ score: `expected number, got ${typeof obj.score}` });
  if (typeof obj.xp !== 'number') invalidProps.push({ xp: `expected number, got ${typeof obj.xp}` });
  if (typeof obj.coins !== 'number') invalidProps.push({ coins: `expected number, got ${typeof obj.coins}` });
  if (typeof obj.totalScore !== 'number') invalidProps.push({ totalScore: `expected number, got ${typeof obj.totalScore}` });
  if (obj.opponent && typeof obj.opponent.id !== 'string') invalidProps.push({ opponent: { id: `expected string, got ${typeof obj.opponent.id}` } });
  if (obj.opponent && typeof obj.opponent.name !== 'string') invalidProps.push({ opponent: { name: `expected string, got ${typeof obj.opponent.name}` } });

  const isValid = obj 
    && typeof obj.isVictory === 'boolean'
    && typeof obj.score === 'number'
    && typeof obj.xp === 'number'
    && typeof obj.coins === 'number'
    && typeof obj.totalScore === 'number'
    && (!obj.opponent || (typeof obj.opponent.id === 'string' && typeof obj.opponent.name === 'string'));

  if (!isValid && invalidProps.length > 0) {
    logTypeError('BattleResults', obj, [], invalidProps);
  }

  return isValid;
};

/**
 * Type guard for XPGain
 */
export const isXPGain = (obj: any): obj is XPGain => {
  if (!obj) {
    logTypeError('XPGain', obj, ['amount', 'source', 'timestamp', 'multiplier']);
    return false;
  }

  const invalidProps: { [key: string]: string }[] = [];
  if (typeof obj.amount !== 'number') invalidProps.push({ amount: `expected number, got ${typeof obj.amount}` });
  if (typeof obj.source !== 'string') invalidProps.push({ source: `expected string, got ${typeof obj.source}` });
  if (typeof obj.timestamp !== 'string') invalidProps.push({ timestamp: `expected string, got ${typeof obj.timestamp}` });
  if (typeof obj.multiplier !== 'number') invalidProps.push({ multiplier: `expected number, got ${typeof obj.multiplier}` });

  const isValid = obj 
    && typeof obj.amount === 'number'
    && typeof obj.source === 'string'
    && typeof obj.timestamp === 'string'
    && typeof obj.multiplier === 'number';

  if (!isValid && invalidProps.length > 0) {
    logTypeError('XPGain', obj, [], invalidProps);
  }

  return isValid;
};

/**
 * Type guard for Quest
 */
export const isQuest = (obj: any): obj is Quest => {
  if (!obj) {
    logTypeError('Quest', obj, ['title', 'description', 'xpReward', 'coinReward', 'requirements', 'progress', 'isActive']);
    return false;
  }

  const invalidProps: { [key: string]: string }[] = [];
  if (typeof obj.title !== 'string') invalidProps.push({ title: `expected string, got ${typeof obj.title}` });
  if (typeof obj.description !== 'string') invalidProps.push({ description: `expected string, got ${typeof obj.description}` });
  if (typeof obj.xpReward !== 'number') invalidProps.push({ xpReward: `expected number, got ${typeof obj.xpReward}` });
  if (typeof obj.coinReward !== 'number') invalidProps.push({ coinReward: `expected number, got ${typeof obj.coinReward}` });
  if (!Array.isArray(obj.requirements)) invalidProps.push({ requirements: `expected array, got ${typeof obj.requirements}` });
  if (typeof obj.progress !== 'number') invalidProps.push({ progress: `expected number, got ${typeof obj.progress}` });
  if (typeof obj.isActive !== 'boolean') invalidProps.push({ isActive: `expected boolean, got ${typeof obj.isActive}` });

  const isValid = obj 
    && typeof obj.title === 'string'
    && typeof obj.description === 'string'
    && typeof obj.xpReward === 'number'
    && typeof obj.coinReward === 'number'
    && Array.isArray(obj.requirements)
    && typeof obj.progress === 'number'
    && typeof obj.isActive === 'boolean';

  if (!isValid && invalidProps.length > 0) {
    logTypeError('Quest', obj, [], invalidProps);
  }

  return isValid;
};

/**
 * Type guard for InventoryItem
 */
export const isInventoryItem = (obj: any): obj is InventoryItem => {
  if (!obj) {
    logTypeError('InventoryItem', obj, ['id', 'quantity', 'item']);
    return false;
  }

  const invalidProps: { [key: string]: string }[] = [];
  if (typeof obj.id !== 'string') invalidProps.push({ id: `expected string, got ${typeof obj.id}` });
  if (typeof obj.quantity !== 'number') invalidProps.push({ quantity: `expected number, got ${typeof obj.quantity}` });
  if (!obj.item) invalidProps.push({ item: 'expected object, got undefined' });
  if (obj.item && typeof obj.item.id !== 'string') invalidProps.push({ item: { id: `expected string, got ${typeof obj.item.id}` } });
  if (obj.item && typeof obj.item.name !== 'string') invalidProps.push({ item: { name: `expected string, got ${typeof obj.item.name}` } });
  if (obj.item && typeof obj.item.type !== 'string') invalidProps.push({ item: { type: `expected string, got ${typeof obj.item.type}` } });

  const isValid = obj 
    && typeof obj.id === 'string'
    && typeof obj.quantity === 'number'
    && obj.item 
    && typeof obj.item.id === 'string'
    && typeof obj.item.name === 'string'
    && typeof obj.item.type === 'string';

  if (!isValid && invalidProps.length > 0) {
    logTypeError('InventoryItem', obj, [], invalidProps);
  }

  return isValid;
};

/**
 * Validates a game item object against required properties and types
 */
export const validateGameItem = (item: any): boolean => {
  if (!item || typeof item !== 'object') {
    logTypeError('GameItem', item, ['id', 'name', 'description', 'type']);
    return false;
  }

  const invalidProps: { [key: string]: string }[] = [];
  if (typeof item.id !== 'string') invalidProps.push({ id: `expected string, got ${typeof item.id}` });
  if (typeof item.name !== 'string') invalidProps.push({ name: `expected string, got ${typeof item.name}` });
  if (typeof item.description !== 'string') invalidProps.push({ description: `expected string, got ${typeof item.description}` });
  if (typeof item.type !== 'string') invalidProps.push({ type: `expected string, got ${typeof item.type}` });

  const isValid = typeof item.id === 'string'
    && typeof item.name === 'string'
    && typeof item.description === 'string'
    && typeof item.type === 'string';

  if (!isValid && invalidProps.length > 0) {
    logTypeError('GameItem', item, [], invalidProps);
  }

  return isValid;
};

/**
 * Type guard for GameState updates
 * Validates partial updates to ensure type safety
 */
export const isValidGameStateUpdate = (
  current: GameState, 
  update: Partial<GameState>
): boolean => {
  // Check user updates
  if (update.user) {
    if (typeof update.user.level !== 'number' && update.user.level !== undefined) return false;
    if (typeof update.user.xp !== 'number' && update.user.xp !== undefined) return false;
    if (typeof update.user.coins !== 'number' && update.user.coins !== undefined) return false;
    if (update.user.inventory && !Array.isArray(update.user.inventory)) return false;
  }

  // Check battle updates
  if (update.battle) {
    if (typeof update.battle.inProgress !== 'boolean' && update.battle.inProgress !== undefined) return false;
    if (update.battle.questions && !Array.isArray(update.battle.questions)) return false;
    if (update.battle.score && typeof update.battle.score.player !== 'number') return false;
  }

  // Check statistics updates
  if (update.statistics) {
    if (typeof update.statistics.totalXP !== 'number' && update.statistics.totalXP !== undefined) return false;
    if (typeof update.statistics.totalStudyTime !== 'number' && update.statistics.totalStudyTime !== undefined) return false;
    if (update.statistics.studySessions && !Array.isArray(update.statistics.studySessions)) return false;
  }

  return true;
};

/**
 * Type guard for activity entries
 */
export const isActivityEntry = (obj: any): obj is ActivityEntry => {
  if (!obj) {
    logTypeError('ActivityEntry', obj, ['id', 'userId', 'type', 'details', 'timestamp']);
    return false;
  }

  const invalidProps: { [key: string]: string }[] = [];
  if (typeof obj.id !== 'string') invalidProps.push({ id: `expected string, got ${typeof obj.id}` });
  if (typeof obj.userId !== 'string') invalidProps.push({ userId: `expected string, got ${typeof obj.userId}` });
  if (!['battle', 'quest', 'achievement', 'purchase', 'login'].includes(obj.type)) {
    invalidProps.push({ type: `expected one of ['battle', 'quest', 'achievement', 'purchase', 'login'], got ${obj.type}` });
  }
  if (typeof obj.details !== 'object') invalidProps.push({ details: `expected object, got ${typeof obj.details}` });
  if (typeof obj.timestamp !== 'string') invalidProps.push({ timestamp: `expected string, got ${typeof obj.timestamp}` });

  const isValid = obj 
    && typeof obj.id === 'string'
    && typeof obj.userId === 'string'
    && ['battle', 'quest', 'achievement', 'purchase', 'login'].includes(obj.type)
    && typeof obj.details === 'object'
    && typeof obj.timestamp === 'string';

  if (!isValid && invalidProps.length > 0) {
    logTypeError('ActivityEntry', obj, [], invalidProps);
  }

  return isValid;
};
