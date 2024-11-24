import { useState, useCallback, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { BattleState, Question, BattleResults } from '../types/battle';
import { Achievement } from '../types/achievements';

export function useBattle() {
  const { state, dispatch } = useGame();
  const [battleState, setBattleState] = useState<BattleState>({
    status: 'searching',
    currentQuestion: 0,
    timeLeft: 30,
    score: { player: 0, opponent: 0 },
    streakBonus: 0,
    questions: []
  });

  // Handle battle state transitions
  useEffect(() => {
    if (battleState.status === 'searching') {
      const timer = setTimeout(() => {
        setBattleState(prev => ({ ...prev, status: 'ready' }));
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (battleState.status === 'ready') {
      const timer = setTimeout(() => {
        setBattleState(prev => ({ ...prev, status: 'battle' }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [battleState.status]);

  // Handle timer
  useEffect(() => {
    if (battleState.status === 'battle') {
      const timer = setInterval(() => {
        setBattleState(prev => {
          if (prev.timeLeft <= 1) {
            handleAnswer(-1);
            return { ...prev, timeLeft: 30 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [battleState.status]);

  const handleAnswer = useCallback((answerIndex: number) => {
    const currentQuestion = battleState.questions[battleState.currentQuestion];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const baseXP = 50;
      const timeBonus = Math.floor(battleState.timeLeft * 0.5);
      const streakMultiplier = 1 + (state.user.streak * 0.1);
      const totalXP = Math.floor((baseXP + timeBonus) * streakMultiplier);

      dispatch({
        type: 'ADD_XP',
        payload: {
          amount: totalXP,
          reason: 'Battle Question Correct'
        }
      });

      setBattleState(prev => ({
        ...prev,
        score: {
          ...prev.score,
          player: prev.score.player + 1
        },
        streakBonus: prev.streakBonus + Math.floor(totalXP - baseXP)
      }));
    }

    // Simulate opponent answer
    const opponentCorrect = Math.random() > 0.4; // 60% chance to be correct
    setBattleState(prev => ({
      ...prev,
      score: {
        ...prev.score,
        opponent: prev.score.opponent + (opponentCorrect ? 1 : 0)
      }
    }));

    if (battleState.currentQuestion < battleState.questions.length - 1) {
      setBattleState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        timeLeft: 30
      }));
    } else {
      endBattle();
    }
  }, [battleState, dispatch, state.user.streak]);

  const endBattle = useCallback(() => {
    const isVictory = battleState.score.player > battleState.score.opponent;
    const results: BattleResults = {
      score: battleState.score.player,
      totalQuestions: battleState.questions.length,
      xpEarned: battleState.score.player * 50 + battleState.streakBonus,
      coinsEarned: battleState.score.player * 20 + (isVictory ? 50 : 0),
      isVictory,
      streakBonus: battleState.streakBonus,
      achievements: []
    };

    // Handle achievements
    if (battleState.score.player === battleState.questions.length) {
      const achievement: Achievement = {
        id: 'perfect_battle',
        title: 'Perfect Scholar',
        description: 'Answer all questions correctly in a battle',
        category: 'battles',
        points: 100,
        rarity: 'legendary',
        unlocked: true,
        unlockedAt: new Date(),
        prerequisites: [],
        dependents: [],
        triggerConditions: [{
          type: 'battle_score',
          value: 100,
          comparison: 'eq'
        }],
        order: 100
      };
      
      dispatch({
        type: 'UNLOCK_ACHIEVEMENT',
        payload: achievement
      });
      results.achievements.push(achievement.id);
    }

    if (isVictory) {
      dispatch({ type: 'INCREMENT_STREAK' });
    } else {
      dispatch({ type: 'RESET_STREAK' });
    }

    setBattleState(prev => ({ ...prev, status: 'completed' }));
    return results;
  }, [battleState, dispatch]);

  return {
    battleState,
    handleAnswer,
    endBattle
  };
} 