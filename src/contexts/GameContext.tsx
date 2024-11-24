import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';
import { LevelSystem } from '../lib/levelSystem';
import type { 
  Achievement,
  AchievementTriggerType
} from '../types/achievements';
import type { 
  GameState,
  GameAction,
  BattleState,
  User,
  XPGain,
  Quest,
  QuestRequirement,
  UserQuest
} from '../types/game';
import type { GameItem, InventoryItem } from '../types/items';
import { QuestType, QuestStatus } from '../types/quests';
import { TABLES } from '../config/supabase';
import { 
  calculateLevel,
  isGameItem,
  validateGameItem,
  isInventoryItem,
  isAchievement
} from '../utils/gameUtils';
import { calculateQuestProgress } from '../utils/questUtils';
import { BattleStatus } from '../types/battle';

// Initial state and types...
const initialState: GameState = {
  user: {
    id: '',
    username: '',
    email: '',
    full_name: null,
    avatar_url: null,
    roles: [],
    title: null,
    health: 100,
    max_health: 100,
    active_effects: [],
    quests: [],
    level: 1,
    xp: 0,
    coins: 0,
    streak: 0,
    last_active: new Date().toISOString(),
    study_time: 0,
    subject_scores: {
      administrative: 0,
      civil: 0,
      criminal: 0,
      constitutional: 0
    },
    statistics: {
      questsCompleted: 0,
      battlesPlayed: 0,
      achievementsUnlocked: 0,
      itemsCollected: 0,
      coinsEarned: 0,
      xpGained: 0
    },
    achievements: [],
    inventory: [],
    rewardMultipliers: {
      xp: 1,
      coins: 1
    },
    streakMultiplier: 1
  },
  battle: {
    status: 'idle',
    in_progress: false,
    questions: [],
    current_question: 0,
    score: {
      player: 0,
      opponent: 0
    },
    player: 0,
    opponent: 0,
    time_left: 0,
    time_per_question: 30,
    player_answers: []
  },
  quests: [],
  completedQuests: [],
  achievements: [],
  recentXPGains: [],
  loading: false,
  error: null
};

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  checkAchievements: () => void;
  handleXPGain: (xpGain: XPGain) => Promise<void>;
  handleCoinTransaction: (amount: { amount: number; source: string }) => Promise<void>;
  handleItemTransaction: (item: GameItem, quantity: number, type: 'purchase' | 'reward' | 'use', cost: number) => Promise<void>;
  useItemEffect: (itemId: string) => Promise<void>;
  handleQuestProgress: (quest: Quest, requirement: QuestRequirement, progress: number) => void;
  handleError: (error: unknown) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const supabaseUrl = 'https://tvmjnkdgiuwutobtqprh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bWpna2RnaXV3dXRvYnRxcHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0Mzk0MTEsImV4cCI6MjA0NzAxNTQxMX0.OoHtnkZajEJvqN5CLQhFOnAYQ1S33WJZK8mw6NOL84I';

const supabase = createClient(supabaseUrl, supabaseKey);

// Utility functions
const updateInventory = async (
  userId: string,
  inventory: InventoryItem[],
  supabase: any
): Promise<void> => {
  await supabase
    .from(TABLES.USER_INVENTORY)
    .upsert(
      inventory.map(item => ({
        user_id: userId,
        item_id: item.item.id,
        quantity: item.quantity,
        acquired_at: item.item.acquiredAt
      }))
    );
};

const updateStreakMultiplier = (streak: number): number => {
  return Math.min(1 + (streak * 0.15), 2.0);
};

const processSubjectScores = (scoresData: any[] | null) => {
  if (!scoresData) return {};
  return scoresData.reduce((acc: Record<string, number>, score: any) => {
    acc[score.subject.toLowerCase()] = score.score;
    return acc;
  }, {});
};

const isAchievementCompleted = (achievement: Achievement): boolean => {
  if (achievement.unlocked || achievement.unlockedAt) return true;
  if (!achievement.triggerConditions || achievement.triggerConditions.length === 0) return false;

  return achievement.triggerConditions.every(condition => {
    // If progress is not set, the achievement is not complete
    if (achievement.progress === undefined) return false;
    
    // Compare progress against trigger value based on comparison type
    switch (condition.comparison) {
      case 'eq': return achievement.progress === condition.value;
      case 'gt': return achievement.progress > condition.value;
      case 'lt': return achievement.progress < condition.value;
      case 'gte': return achievement.progress >= condition.value;
      case 'lte': return achievement.progress <= condition.value;
      default: return false;
    }
  });
};

const processAchievements = (achievements: Achievement[]) => {
  return achievements.map(achievement => ({
    ...achievement,
    unlocked: isAchievementCompleted(achievement)
  }));
};

const handleQuestAction = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_QUEST': {
      const quest = { ...action.quest, status: QuestStatus.IN_PROGRESS, startedAt: new Date() };
      return {
        ...state,
        user: {
          ...state.user,
          quests: state.user.quests.map(q => 
            q.id === quest.id 
              ? quest 
              : q
          )
        }
      };
    }
    
    case 'UPDATE_QUEST_PROGRESS': {
      const { questId, requirementType, progress } = action.update;
      return {
        ...state,
        user: {
          ...state.user,
          quests: state.user.quests.map(quest => {
            if (quest.id !== questId) return quest;
            
            const newRequirements = quest.requirements.map(req => {
              if (req.type !== requirementType) return req;
              return {
                ...req,
                requirement_value: {
                  ...req.requirement_value,
                  current: progress
                }
              };
            });
            
            const newProgress = calculateQuestProgress(
              { ...quest, requirements: newRequirements },
              state.user
            );
            
            return {
              ...quest,
              requirements: newRequirements,
              progress: newProgress
            };
          })
        }
      };
    }
    
    case 'COMPLETE_QUEST': {
      if ('payload' in action) {
        const { quest, rewards } = action.payload;
        const completedQuest = state.user.quests.find(q => q.id === quest.id);
        if (!completedQuest) return state;
        
        // Award rewards
        const { xp = 0, coins = 0, items = [] } = rewards;
        
        // Create quest completion achievement
        const achievement: Achievement = {
          id: `quest_complete_${quest.id}`,
          title: `Completed: ${completedQuest.title}`,
          description: `Successfully completed the quest "${completedQuest.title}"`,
          category: 'quest',
          points: 50,
          rarity: 'common',
          unlocked: true,
          unlockedAt: new Date().toISOString(),
          prerequisites: [],
          order: 0,
          triggerConditions: [{
            type: 'quest',
            value: 1,
            comparison: 'eq',
            metadata: {
              questId: quest.id
            }
          }],
          rewards: [{
            type: 'xp',
            amount: 50
          }],
          progress: 100
        };

        // Update user state with rewards and completed quest
        return {
          ...state,
          user: {
            ...state.user,
            xp: state.user.xp + xp,
            coins: state.user.coins + coins,
            inventory: [...state.user.inventory, ...items],
            quests: state.user.quests.map(q => 
              q.id === quest.id 
                ? { ...q, status: QuestStatus.COMPLETED, progress: 100 } 
                : q
            ),
            achievements: [...state.user.achievements, achievement],
            statistics: {
              ...state.user.statistics,
              questsCompleted: state.user.statistics.questsCompleted + 1
            }
          }
        };
      } else {
        // Handle simple questId variant
        const completedQuest = state.user.quests.find(q => q.id === action.questId);
        if (!completedQuest) return state;

        return {
          ...state,
          user: {
            ...state.user,
            quests: state.user.quests.map(q => 
              q.id === action.questId 
                ? { ...q, status: QuestStatus.COMPLETED, progress: 100 } 
                : q
            ),
            statistics: {
              ...state.user.statistics,
              questsCompleted: state.user.statistics.questsCompleted + 1
            }
          }
        };
      }
    }
    
    case 'FAIL_QUEST':
      return {
        ...state,
        user: {
          ...state.user,
          quests: state.user.quests.map(q => 
            q.id === action.questId 
              ? { ...q, status: QuestStatus.FAILED }
              : q
          )
        }
      };
      
    case 'EXPIRE_QUEST':
      return {
        ...state,
        user: {
          ...state.user,
          quests: state.user.quests.map(q => 
            q.id === action.questId 
              ? { ...q, status: QuestStatus.EXPIRED }
              : q
          )
        }
      };
      
    case 'RESET_DAILY_QUESTS':
      return {
        ...state,
        user: {
          ...state.user,
          quests: state.user.quests.map(q => 
            q.type === QuestType.DAILY
              ? {
                  ...q,
                  status: QuestStatus.AVAILABLE,
                  progress: 0,
                  requirements: q.requirements.map(r => ({ ...r, requirement_value: { target: r.requirement_value.target, current: 0 } })),
                  startedAt: undefined,
                  completedAt: undefined
                }
              : q
          )
        }
      };
      
    case 'RESET_WEEKLY_QUESTS':
      return {
        ...state,
        user: {
          ...state.user,
          quests: state.user.quests.map(q => 
            q.type === QuestType.WEEKLY
              ? {
                  ...q,
                  status: QuestStatus.AVAILABLE,
                  progress: 0,
                  requirements: q.requirements.map(r => ({ ...r, requirement_value: { target: r.requirement_value.target, current: 0 } })),
                  startedAt: undefined,
                  completedAt: undefined
                }
              : q
          )
        }
      };
      
    default:
      return state;
  }
};

const calculateQuestionScore = (timeSpent: number): number => {
  const baseScore = 100;
  const timeBonus = Math.max(0, 1 - (timeSpent / 30)); // 30 seconds max time
  return Math.round(baseScore * (1 + timeBonus));
};

const handleBattleStateUpdate = (battleState: BattleState, action: GameAction): BattleState => {
  switch (action.type) {
    case 'INITIALIZE_BATTLE':
      return {
        status: 'battle',
        inProgress: true,
        questions: action.payload.questions,
        currentQuestion: 0,
        score: { player: 0, opponent: 0 },
        timeLeft: action.payload.timePerQuestion,
        timePerQuestion: action.payload.timePerQuestion,
        playerAnswers: []
      };

    case 'ANSWER_QUESTION':
      if (!battleState) {
        console.error('Invalid battle state');
        return battleState;
      }
      
      const newScore = action.payload.isCorrect 
        ? battleState.score.player + calculateQuestionScore(action.payload.timeSpent)
        : battleState.score.player;

      return {
        ...battleState,
        currentQuestion: battleState.currentQuestion + 1,
        score: { ...battleState.score, player: newScore },
        playerAnswers: [...battleState.playerAnswers, action.payload.isCorrect],
        timeLeft: battleState.timePerQuestion
      };

    case 'END_BATTLE':
      const baseRewards = {
        xp: action.payload.rewards.xp,
        coins: action.payload.rewards.coins
      };

      const optionalRewards = {
        ...(action.payload.rewards.streakBonus !== undefined && { streakBonus: action.payload.rewards.streakBonus }),
        ...(action.payload.rewards.timeBonus !== undefined && { timeBonus: action.payload.rewards.timeBonus }),
        ...(action.payload.rewards.achievements !== undefined && { achievements: action.payload.rewards.achievements })
      };

      return {
        ...battleState,
        status: 'complete',
        inProgress: false,
        rewards: { ...baseRewards, ...optionalRewards }
      };

    case 'RESET_BATTLE':
      return {
        status: 'idle',
        inProgress: false,
        questions: [],
        currentQuestion: 0,
        score: { player: 0, opponent: 0 },
        timeLeft: 0,
        timePerQuestion: 0,
        playerAnswers: []
      };

    default:
      return battleState;
  }
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  try {
    switch (action.type) {
      case 'SET_LOADING': {
        return {
          ...state,
          loading: action.payload
        };
      }

      case 'SET_ERROR': {
        return {
          ...state,
          error: action.payload
        };
      }

      case 'INITIALIZE_BATTLE':
      case 'ANSWER_QUESTION':
      case 'END_BATTLE':
      case 'RESET_BATTLE': {
        // Handle battle state updates using the helper function
        const updatedBattleState = handleBattleStateUpdate(state.battle, action);
        return {
          ...state,
          battle: updatedBattleState
        };
      }

      case 'UNLOCK_ACHIEVEMENT': {
        const achievement = action.payload;
        const now = new Date().toISOString();
        
        return {
          ...state,
          user: {
            ...state.user,
            achievements: state.user.achievements.map(a => 
              a.id === achievement.id 
                ? { ...a, unlockedAt: now, completed: true }
                : a
            ),
            statistics: {
              ...state.user.statistics,
              achievementsUnlocked: state.user.statistics.achievementsUnlocked + 1
            }
          }
        };
      }

      case 'UPDATE_ACHIEVEMENT_PROGRESS': {
        const { achievementId, progress } = action.payload;
        
        return {
          ...state,
          user: {
            ...state.user,
            achievements: state.user.achievements.map(achievement => 
              achievement.id === achievementId
                ? { ...achievement, progress }
                : achievement
            )
          }
        };
      }

      case 'ADD_XP': {
        const { amount, multiplier = 1 } = action.payload;
        const totalXP = amount * multiplier * state.user.rewardMultipliers.xp;
        
        return {
          ...state,
          user: {
            ...state.user,
            xp: state.user.xp + totalXP,
            statistics: {
              ...state.user.statistics,
              xpGained: state.user.statistics.xpGained + totalXP
            }
          }
        };
      }

      case 'ADD_COINS': {
        const { amount } = action.payload;
        const totalCoins = amount * state.user.rewardMultipliers.coins;
        
        return {
          ...state,
          user: {
            ...state.user,
            coins: state.user.coins + totalCoins,
            statistics: {
              ...state.user.statistics,
              coinsEarned: state.user.statistics.coinsEarned + totalCoins
            }
          }
        };
      }

      case 'UPDATE_USER_PROFILE': {
        return {
          ...state,
          user: {
            ...state.user,
            ...action.payload,
            achievements: action.payload.achievements || state.user.achievements
          }
        };
      }

      case 'LEVEL_UP': {
        const { level, rewards } = action.payload;
        return {
          ...state,
          user: {
            ...state.user,
            level,
            xp: state.user.xp + rewards.xp,
            coins: state.user.coins + rewards.coins,
            inventory: [...state.user.inventory, ...rewards.items]
          }
        };
      }

      case 'UPDATE_STREAK_MULTIPLIER': {
        return {
          ...state,
          user: {
            ...state.user,
            streakMultiplier: updateStreakMultiplier(state.user.streak)
          }
        };
      }

      case 'UPDATE_REWARD_MULTIPLIER': {
        const { type, value } = action.payload;
        return {
          ...state,
          user: {
            ...state.user,
            rewardMultipliers: {
              ...state.user.rewardMultipliers,
              [type]: value
            }
          }
        };
      }

      case 'UPDATE_INVENTORY': {
        return {
          ...state,
          user: {
            ...state.user,
            inventory: action.payload
          }
        };
      }

      case 'UPDATE_STATISTICS': {
        return {
          ...state,
          user: {
            ...state.user,
            statistics: {
              ...state.user.statistics,
              ...action.payload
            }
          }
        };
      }

      case 'UPDATE_QUESTS':
        return {
          ...state,
          user: {
            ...state.user,
            quests: action.payload.active
          }
        };

      case 'START_QUEST':
      case 'UPDATE_QUEST_PROGRESS':
      case 'COMPLETE_QUEST':
      case 'FAIL_QUEST':
      case 'EXPIRE_QUEST':
      case 'RESET_DAILY_QUESTS':
      case 'RESET_WEEKLY_QUESTS':
        return handleQuestAction(state, action);

      case 'SET_LOADING':
        return {
          ...state,
          loading: action.payload
        };

      case 'SET_BATTLE_ERROR':
        return {
          ...state,
          user: {
            ...state.user,
            battleStats: {
              ...state.user.battleStats,
              error: action.payload.message,
              errorCode: action.payload.code
            }
          }
        };

      case 'UPDATE_SUBJECT_SCORE':
        return {
          ...state,
          user: {
            ...state.user,
            statistics: {
              ...state.user.statistics,
              [`${action.payload.subject}Score`]: action.payload.score
            }
          }
        };

      case 'ADD_BATTLE_HISTORY':
        return {
          ...state,
          user: {
            ...state.user,
            battleStats: {
              ...state.user.battleStats,
              battleHistory: [
                action.payload,
                ...state.user.battleStats.battleHistory
              ].slice(0, 50) // Keep last 50 battles
            }
          }
        };

      case 'ADD_EFFECT': {
        const effect = action.payload;
        return {
          ...state,
          user: {
            ...state.user,
            activeEffects: [...state.user.activeEffects, effect]
          }
        };
      }

      case 'REMOVE_EFFECT': {
        const { effectId, effectType } = action.payload;
        // Type guard to ensure effectType is 'xp' or 'coins'
        if (effectType !== 'xp' && effectType !== 'coins') {
          return state;
        }
        return {
          ...state,
          user: {
            ...state.user,
            activeEffects: state.user.activeEffects.filter(effect => effect.id !== effectId),
            rewardMultipliers: {
              ...state.user.rewardMultipliers,
              [effectType]: state.user.rewardMultipliers[effectType] / (1 + (effectType === 'xp' ? 0.5 : 1))
            }
          }
        };
      }

      case 'INITIALIZE_USER': {
        const { profile, progress, achievements, inventory, quests, battleStats } = action.payload;
        
        return {
          ...state,
          loading: false,
          user: {
            ...state.user,
            ...profile,
            achievements: achievements || [],
            inventory: inventory || [],
            quests: quests || [],
            rewardMultipliers: progress?.reward_multipliers || { xp: 1, coins: 1 },
            streakMultiplier: progress?.streak_multiplier || 1,
            statistics: {
              questsCompleted: progress?.quests_completed || 0,
              battlesPlayed: battleStats?.total_battles || 0,
              achievementsUnlocked: achievements?.length || 0,
              itemsCollected: inventory?.length || 0,
              coinsEarned: profile?.coins || 0,
              xpGained: profile?.xp || 0
            }
          }
        };
      }

      default:
        return state;
    }
  } catch (error) {
    console.error('Error in game reducer:', error);
    return state;
  }
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth();
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Error handling utility
  const handleError = useCallback((error: unknown) => {
    console.error('Game Error:', error);
  }, []);

  // Load user progress
  const loadUserProgress = useCallback(async (): Promise<void> => {
    if (!authUser?.id) return;

    try {
      // Set loading state to true at the start
      dispatch({ type: 'SET_LOADING', payload: true });

      // Load user profile
      const { data: profile, error: profileError } = await supabase
        .from(TABLES.PROFILES)
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) throw profileError;

      // Initialize user if not exists
      if (!profile) {
        const newUser = {
          id: authUser.id,
          name: authUser.user_metadata?.name || 'Player',
          level: 1,
          xp: 0,
          coins: 0,
          inventory: [],
          achievements: [],
          quests: [],
          statistics: {
            questsCompleted: 0,
            battlesWon: 0,
            itemsUsed: 0,
            coinsEarned: 0,
            xpGained: 0
          },
          rewardMultipliers: {
            xp: 1,
            coins: 1
          },
          streakMultiplier: 1,
          lastActive: new Date().toISOString()
        };

        dispatch({ type: 'INITIALIZE_USER', payload: newUser });
        return;
      }

      // Load related data
      const [
        { data: achievements },
        { data: quests },
        { data: inventory },
        { data: statistics }
      ] = await Promise.all([
        supabase.from(TABLES.USER_ACHIEVEMENTS).select('*').eq('user_id', authUser.id),
        supabase.from(TABLES.USER_QUESTS).select('*').eq('user_id', authUser.id),
        supabase.from(TABLES.USER_INVENTORY).select('*').eq('user_id', authUser.id),
        supabase.from(TABLES.USER_STATISTICS).select('*').eq('user_id', authUser.id).single()
      ]);

      // Initialize user state
      const user = {
        ...profile,
        achievements: achievements || [],
        quests: quests || [],
        inventory: inventory || [],
        statistics: statistics || {
          questsCompleted: 0,
          battlesWon: 0,
          itemsUsed: 0,
          coinsEarned: 0,
          xpGained: 0
        }
      };

      dispatch({ type: 'INITIALIZE_USER', payload: user });
    } catch (error) {
      handleError(error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
    } finally {
      // Always set loading to false when done
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [authUser?.id, authUser?.user_metadata?.name, handleError]);

  // Initialize user data
  useEffect(() => {
    if (authUser?.id) {
      loadUserProgress();
    }
  }, [authUser?.id, loadUserProgress]);

  // Achievement checking logic
  const checkAchievements = useCallback(async (): Promise<void> => {
    if (!state.user.id) return;

    try {
      // Check each achievement's conditions
      const unlockedAchievements = state.user.achievements
        .filter(achievement => !achievement.unlocked)
        .filter(achievement => 
          achievement.triggerConditions.every(condition => {
            const { type, value, comparison } = condition;
            const currentValue = state.user.statistics[type as keyof typeof state.user.statistics] || 0;
            
            switch (comparison) {
              case 'eq': return currentValue === value;
              case 'gt': return currentValue > value;
              case 'lt': return currentValue < value;
              case 'gte': return currentValue >= value;
              case 'lte': return currentValue <= value;
              default: return false;
            }
          })
        );

      // Unlock each achievement that meets its conditions
      for (const achievement of unlockedAchievements) {
        await handleAchievementUnlock(achievement);
      }
    } catch (error) {
      handleError(error);
    }
  }, [state.user, state.user.statistics, handleError]);

  // XP gain handling
  const handleXPGain = useCallback(async (xpGain: XPGain): Promise<void> => {
    const { amount, source } = xpGain;
    const multiplier = state.user.rewardMultipliers.xp * state.user.streakMultiplier;
    const totalXP = Math.round(amount * multiplier);

    // Add activity log entry for XP gain
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: crypto.randomUUID(),
        userId: state.user.id,
        type: 'xp_gain',
        details: {
          action: 'GAIN_XP',
          metadata: {
            amount: totalXP,
            source,
            multiplier
          }
        },
        timestamp: new Date().toISOString()
      }
    });

    dispatch({
      type: 'ADD_XP',
      payload: {
        ...xpGain,
        amount: totalXP,
        multiplier
      }
    });

    // Check for level up
    const newLevel = calculateLevel(state.user.xp + totalXP);
    if (newLevel > state.user.level) {
      const rewardsArray = LevelSystem.calculateLevelUpRewards(newLevel);
      
      // Transform rewards array into expected format
      const rewards = {
        xp: rewardsArray.find(r => r.type === 'xp')?.value as number || 0,
        coins: rewardsArray.find(r => r.type === 'coins')?.value as number || 0,
        items: rewardsArray
          .filter(r => r.type === 'item')
          .map(r => ({
            id: r.id,
            item: {
              instanceId: crypto.randomUUID(),
              id: r.id,
              name: r.value as string,
              description: `Level ${newLevel} reward`,
              type: 'consumable',
              rarity: 'common',
              basePrice: 0,
              isActive: false,
              acquiredAt: new Date()
            },
            quantity: 1
          }))
      };
      
      dispatch({
        type: 'LEVEL_UP',
        payload: {
          level: newLevel,
          rewards
        }
      });

      // Process level up rewards
      await handleCoinTransaction({ 
        amount: rewards.coins, 
        source: 'level_up' 
      });

      for (const item of rewards.items) {
        await handleItemTransaction(
          item.item,
          1,
          'reward',
          0
        );
      }
    }

    // Update XP in database
    try {
      await supabase
        .from('user_progress')
        .update({
          xp: state.user.xp + totalXP,
          level: newLevel,
          last_xp_gain: new Date().toISOString()
        })
        .eq('user_id', state.user.id);

      await checkAchievements();
    } catch (error) {
      handleError(error);
    }
  }, [state.user, handleError, checkAchievements]);

  // Coin transaction handling
  const handleCoinTransaction = useCallback(async (amount: { amount: number; source: string }): Promise<void> => {
    const { user } = state;
    let newAmount = amount.amount;
    
    if (amount.source === 'earn') {
      newAmount = Math.round(amount.amount * user.rewardMultipliers.coins * user.streakMultiplier);
    }
    
    const newBalance = amount.source === 'earn' 
      ? user.coins + newAmount 
      : user.coins - newAmount;
      
    if (newBalance < 0) {
      throw new Error('Insufficient coins');
    }
    
    await supabase
      .from(TABLES.PROFILES)
      .update({ coins: newBalance })
      .eq('id', user.id);
      
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: { coins: newBalance } });
  }, [state, supabase]);

  // Item transaction handling
  const handleItemTransaction = useCallback(async (
    item: GameItem,
    quantity: number,
    type: 'purchase' | 'reward' | 'use',
    cost: number = 0
  ): Promise<void> => {
    if (!validateGameItem(item)) {
      handleError(new Error('Invalid item data'));
      return;
    }

    try {
      const existingItem = state.user.inventory.find(i => 
        isInventoryItem(i) && i.item.id === item.id
      );

      if (existingItem) {
        // Update existing item quantity
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= 0) {
          // Remove item if quantity reaches 0
          const newInventory = state.user.inventory.filter(i => i.item.id !== item.id);
          await updateInventory(state.user.id, newInventory, supabase);
        } else {
          // Update quantity
          const newInventory = state.user.inventory.map(i =>
            i.item.id === item.id ? { ...i, quantity: newQuantity } : i
          );
          await updateInventory(state.user.id, newInventory, supabase);
        }
      } else if (quantity > 0) {
        // Add new item
        const newInventory = [
          ...state.user.inventory,
          {
            item: {
              ...item,
              instanceId: crypto.randomUUID(),
              acquiredAt: new Date().toISOString()
            },
            quantity
          }
        ];
        await updateInventory(state.user.id, newInventory, supabase);
      }

      // Handle cost if it's a purchase
      if (type === 'purchase' && cost > 0) {
        await handleCoinTransaction({ amount: -cost, source: 'purchase' });
      }

      // Log activity
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: {
          id: crypto.randomUUID(),
          userId: state.user.id,
          type: 'inventory',
          details: {
            action: type,
            result: `${type === 'purchase' ? 'Bought' : type === 'reward' ? 'Received' : 'Used'} ${quantity} ${item.name}`,
            metadata: {
              itemId: item.id,
              quantity,
              cost: type === 'purchase' ? cost : 0
            }
          },
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      handleError(error);
    }
  }, [state.user.inventory, handleCoinTransaction, handleError]);

  // Item effect usage handling
  const useItemEffect = useCallback(async (itemId: string): Promise<void> => {
    try {
      const itemInInventory = state.user.inventory.find(item => item.item.id === itemId);
      if (!itemInInventory) {
        throw new Error('Item not found in inventory');
      }

      if (!itemInInventory.isEquipped) {
        throw new Error('Item must be equipped to use its effect');
      }

      const { item } = itemInInventory;
      if (!item.effects || item.effects.length === 0) {
        throw new Error('Item has no effects to use');
      }

      // Apply each item effect
      for (const effect of item.effects) {
        const effectId = crypto.randomUUID();
        const startTime = new Date();
        const duration = effect.duration || 300; // 5 minutes default
        const value = effect.value || 1.5;
        
        // Schedule effect removal after duration
        setTimeout(() => {
          dispatch({
            type: 'REMOVE_EFFECT',
            payload: {
              effectId,
              effectType: effect.type
            }
          });
        }, duration * 1000);

        switch (effect.type) {
          case 'xp_boost': {
            dispatch({
              type: 'ADD_EFFECT',
              payload: {
                id: effectId,
                type: effect.type,
                value,
                startTime: startTime.toISOString(), // Convert timestamp to ISO string format
                duration,
                sourceItem: {
                  id: item.id,
                  name: item.name
                }
              }
            });
            
            dispatch({
              type: 'UPDATE_USER_PROFILE',
              payload: {
                rewardMultipliers: {
                  ...state.user.rewardMultipliers,
                  xp: state.user.rewardMultipliers.xp * value
                }
              }
            });
            break;
          }
          case 'coin_boost': {
            dispatch({
              type: 'ADD_EFFECT',
              payload: {
                id: effectId,
                type: effect.type,
                value,
                startTime: startTime.toISOString(), // Convert timestamp to ISO string format
                duration,
                sourceItem: {
                  id: item.id,
                  name: item.name
                }
              }
            });
            
            dispatch({
              type: 'UPDATE_USER_PROFILE',
              payload: {
                rewardMultipliers: {
                  ...state.user.rewardMultipliers,
                  coins: state.user.rewardMultipliers.coins * value
                }
              }
            });
            break;
          }
          case 'score_boost': {
            dispatch({
              type: 'ADD_EFFECT',
              payload: {
                id: effectId,
                type: effect.type,
                value,
                startTime: startTime.toISOString(), // Convert timestamp to ISO string format
                duration,
                sourceItem: {
                  id: item.id,
                  name: item.name
                }
              }
            });
            break;
          }
          case 'time_boost': {
            dispatch({
              type: 'ADD_EFFECT',
              payload: {
                id: effectId,
                type: effect.type,
                value,
                startTime: startTime.toISOString(), // Convert timestamp to ISO string format
                duration,
                sourceItem: {
                  id: item.id,
                  name: item.name
                }
              }
            });
            break;
          }
          default:
            throw new Error(`Unknown effect type: ${effect.type}`);
        }
      }

      // Log effect usage
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: {
          id: crypto.randomUUID(),
          userId: state.user.id,
          type: 'purchase',
          details: {
            action: 'use_item',
            result: `Used ${item.name}'s effects`,
            metadata: {
              itemId: item.id,
              itemName: item.name,
              effectTypes: item.effects.map(e => e.type),
              timestamp: new Date().toISOString()
            }
          },
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [state.user, handleError]);

  // Quest progress handling
  const handleQuestProgress = useCallback((quest: Quest, requirement: QuestRequirement, progress: number): void => {
    try {
      // Find the user's active quest that matches the input quest
      const userQuest = state.user.quests.find(
        q => q.id === quest.id && q.status !== QuestStatus.COMPLETED && q.is_active
      );

      if (!userQuest) return;

      // Create a progress map for requirements
      const progressMap = new Map<string, { current: number; target: number }>();
      userQuest.requirements.forEach(req => {
        const key = req.type;
        progressMap.set(key, {
          current: req.requirement_value.current || 0,
          target: req.requirement_value.target
        });
      });

      // Update progress for the specific requirement type
      if (progressMap.has(requirement.type)) {
        const currentData = progressMap.get(requirement.type)!;
        const newProgress = Math.min(currentData.current + progress, currentData.target);
        progressMap.set(requirement.type, { ...currentData, current: newProgress });
      }

      // Convert progress map back to requirements array
      const updatedRequirements = userQuest.requirements.map(req => ({
        ...req,
        requirement_value: {
          target: req.requirement_value.target,
          current: progressMap.get(req.type)?.current || 0
        },
        description: `Progress: ${progressMap.get(req.type)?.current || 0}/${req.requirement_value.target}`
      }));

      const allCompleted = updatedRequirements.every(req => {
        const progress = progressMap.get(req.type);
        return progress ? progress.current >= progress.target : false;
      });

      if (allCompleted && userQuest.status !== QuestStatus.COMPLETED) {
        // Quest completed - dispatch reward actions
        const timestamp = new Date().toISOString();
        
        dispatch({ 
          type: 'ADD_XP', 
          payload: { 
            amount: quest.xp_reward,
            source: 'quest_completion',
            timestamp,
            multiplier: state.user.rewardMultipliers.xp,
            details: {
              questId: quest.id
            }
          } 
        });

        dispatch({ 
          type: 'ADD_COINS', 
          payload: { 
            amount: quest.coin_reward, 
            source: 'quest_completion' 
          } 
        });

        // Log the quest completion
        dispatch({
          type: 'ADD_ACTIVITY',
          payload: {
            id: crypto.randomUUID(),
            userId: state.user.id,
            type: 'quest',
            details: {
              action: 'complete',
              metadata: {
                questId: quest.id,
                rewards: {
                  xp: quest.xp_reward,
                  coins: quest.coin_reward
                }
              }
            },
            timestamp: new Date().toISOString()
          }
        });

        // Mark quest as completed
        dispatch({
          type: 'COMPLETE_QUEST',
          payload: {
            quest,
            rewards: {
              xp: quest.xp_reward,
              coins: quest.coin_reward
            }
          }
        });

        // Update user quest state
        const updatedUserQuest: UserQuest = {
          id: userQuest.id,
          user_id: state.user.id,
          quest_id: quest.id,
          status: QuestStatus.COMPLETED,
          progress: 100,
          created_at: userQuest.created_at,
          updated_at: new Date(),
          completed_at: new Date()
        };

        // Update quest in database and don't wait for it
        void updateUserQuest(updatedUserQuest);

        // Update local state
        dispatch({
          type: 'UPDATE_QUEST_PROGRESS',
          update: {
            questId: quest.id,
            requirementType: requirement.type,
            progress: 100,
            timestamp: new Date()
          }
        });

        return;
      }

      // Calculate overall progress based on all requirements
      const totalTarget = updatedRequirements.reduce((sum, req) => sum + req.requirement_value.target, 0);
      const currentTotal = updatedRequirements.reduce((sum, req) => {
        const progress = progressMap.get(req.type);
        return sum + (progress?.current || 0);
      }, 0);

      const overallProgress = Math.floor((currentTotal / totalTarget) * 100);
      
      // Update quest progress
      dispatch({
        type: 'UPDATE_QUEST_PROGRESS',
        update: {
          questId: quest.id,
          requirementType: requirement.type,
          progress: overallProgress,
          timestamp: new Date()
        }
      });

      dispatch({
        type: 'UPDATE_QUESTS',
        payload: {
          active: state.user.quests.map(q => 
            q.id === quest.id 
              ? { ...q, requirements: updatedRequirements, progress: overallProgress }
              : q
          ),
          completed: state.user.quests.filter(q => q.status === QuestStatus.COMPLETED)
        }
      });

    } catch (error) {
      console.error('Error updating quest progress:', error);
    }
  }, [state.user.quests, state.user.id, dispatch]);

  const updateUserQuest = async (userQuest: UserQuest) => {
    try {
      const { error } = await supabase
        .from('user_quests')
        .update({
          status: userQuest.status,
          progress: userQuest.progress,
          completed_at: userQuest.completed_at
        })
        .eq('id', userQuest.id);

      if (error) {
        console.error('Error updating user quest:', error);
        handleError(error);
      }
    } catch (error) {
      console.error('Error updating user quest:', error);
      handleError(error);
    }
  };

  const dispatchCallback = useCallback((action: GameAction) => {
    console.log('Dispatching action:', action);
    dispatch(action);
  }, []);

  const checkAchievementsCallback = useCallback(() => {
    checkAchievements();
  }, [checkAchievements]);

  useEffect(() => {
    const updateAchievement = async (achievement: Achievement) => {
      const now = new Date().toISOString();
      try {
        await supabase
          .from('user_achievements')
          .upsert({
            user_id: state.user.id,
            achievement_id: achievement.id,
            unlocked_at: now,
            progress: 100
          });

        // Update user statistics
        await supabase
          .from('user_statistics')
          .upsert({
            user_id: state.user.id,
            achievements_unlocked: state.user.statistics.achievementsUnlocked + 1,
            last_updated: now
          });
      } catch (error) {
        console.error('Error updating achievement:', error);
      }
    };

    if (state.user.achievements.some(a => !a.unlockedAt)) {
      const newAchievement = state.user.achievements.find(a => !a.unlockedAt);
      if (newAchievement) {
        updateAchievement(newAchievement);
      }
    }
  }, [state.user.achievements, state.user.id, state.user.statistics.achievementsUnlocked]);

  useEffect(() => {
    const updateAchievementProgress = async (achievementId: string, progress: number) => {
      try {
        await supabase
          .from('user_achievements')
          .upsert({
            user_id: state.user.id,
            achievement_id: achievementId,
            progress: progress
          });
      } catch (error) {
        console.error('Error updating achievement progress:', error);
      }
    };

    const achievementsWithProgress = state.user.achievements.filter(a => !a.unlockedAt && a.progress);
    achievementsWithProgress.forEach(achievement => {
      if (achievement.progress) {
        updateAchievementProgress(achievement.id, achievement.progress);
      }
    });
  }, [state.user.achievements, state.user.id]);

  const contextValue: GameContextType = {
    state,
    dispatch: dispatchCallback,
    checkAchievements: checkAchievementsCallback,
    handleXPGain,
    handleCoinTransaction,
    handleItemTransaction,
    useItemEffect,
    handleQuestProgress,
    handleError
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};