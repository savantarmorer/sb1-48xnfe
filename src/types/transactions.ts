/**
 * Types of transactions that can occur in the game
 * @enum {string}
 * @description Defines all possible transaction types in the game economy
 * 
 * @property {string} PURCHASE - Item purchased from shop
 * @property {string} REWARD - Item received as reward
 * @property {string} REFUND - Item refunded to user
 * @property {string} GIFT - Item received as gift
 * @property {string} QUEST_REWARD - Item received from quest completion
 * @property {string} ACHIEVEMENT_REWARD - Item received from achievement
 * @property {string} BATTLE_REWARD - Item received from battle victory
 * @property {string} DAILY_BONUS - Item received from daily login bonus
 * @property {string} SYSTEM_GRANT - Item granted by system
 */
export enum TransactionType {
  PURCHASE = 'purchase',
  REWARD = 'reward',
  REFUND = 'refund',
  GIFT = 'gift',
  QUEST_REWARD = 'quest_reward',
  ACHIEVEMENT_REWARD = 'achievement_reward',
  BATTLE_REWARD = 'battle_reward',
  DAILY_BONUS = 'daily_bonus',
  SYSTEM_GRANT = 'system_grant'
}
