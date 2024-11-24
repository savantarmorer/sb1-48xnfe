import { useCallback, useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import { BattleService } from '../services/BattleService';
import { BATTLE_CONFIG } from '../config/battleConfig';
import { BattleQuestion } from '../types/battle';

export function useBattle() {
  const { state, dispatch } = useGame();
  const battleStateRef = useRef(state.battle);
  const mountedRef = useRef(true);
  const initializingRef = useRef(false);

  // Update ref when battle state changes, but only for specific properties
  useEffect(() => {
    if (state.battle.status !== battleStateRef.current.status ||
        state.battle.questions !== battleStateRef.current.questions ||
        state.battle.currentQuestionIndex !== battleStateRef.current.currentQuestionIndex ||
        state.battle.timeLeft !== battleStateRef.current.timeLeft) {
      battleStateRef.current = state.battle;
    }
  }, [state.battle.status, state.battle.questions, state.battle.currentQuestionIndex, state.battle.timeLeft]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      initializingRef.current = false;
    };
  }, []);

  const handleBattleError = useCallback(async (error: Error, errorCode?: string) => {
    console.error('Battle error:', error);
    
    if (!mountedRef.current) return;

    dispatch({ 
      type: 'SET_BATTLE_ERROR', 
      payload: { 
        message: error.message,
        code: errorCode
      }
    });

    // Save current battle state if we have questions loaded
    if (battleStateRef.current?.questions?.length > 0) {
      try {
        await BattleService.saveBattleProgress({
          ...battleStateRef.current,
          userId: state.user.id,
          status: 'error',
          lastError: error.message
        });
      } catch (saveError) {
        console.error('Failed to save battle progress:', saveError);
      }
    }
  }, [dispatch, state.user.id]);

  const initializeBattle = useCallback(async () => {
    // Check if we're already initialized or initializing
    if (state.battle.inProgress || state.battle.status !== 'searching') {
      console.log('Battle already in progress or wrong status:', state.battle.status);
      return;
    }

    if (initializingRef.current) {
      console.log('Battle initialization already in progress');
      return;
    }

    initializingRef.current = true;
    
    try {
      console.log('Starting battle initialization...');
      
      // Set loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Question fetch timeout')), 20000);
      });

      // Create the question fetch promise
      const fetchPromise = BattleService.getQuestions(
        BATTLE_CONFIG.questionsPerBattle,
        undefined,
        undefined
      );

      // Race between timeout and fetch
      const questions = await Promise.race([fetchPromise, timeoutPromise])
        .catch(error => {
          console.error('Error in BattleService.getQuestions:', error);
          throw new Error('Failed to load battle questions: ' + error.message);
        });
      
      if (!questions || questions.length < BATTLE_CONFIG.questionsPerBattle) {
        throw new Error('Insufficient questions available for battle');
      }

      // Initialize battle with validated questions
      dispatch({
        type: 'INITIALIZE_BATTLE',
        payload: {
          questions: questions.slice(0, BATTLE_CONFIG.questionsPerBattle),
          timePerQuestion: BATTLE_CONFIG.timePerQuestion
        }
      });

      // Wait for state update and give time for UI to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'SET_STATUS', payload: 'ready' });
      
      // Start the battle after ready delay
      await new Promise(resolve => setTimeout(resolve, BATTLE_CONFIG.readyDelay));
      
      dispatch({ type: 'SET_STATUS', payload: 'battle' });

    } catch (error) {
      await handleBattleError(error as Error);
    } finally {
      initializingRef.current = false;
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, handleBattleError, state.battle.inProgress, state.battle.status]);

  const handleAnswer = useCallback(async (answer: string, timeSpent: number) => {
    if (!mountedRef.current || state.battle.status !== 'active') return;

    try {
      const currentQuestion = state.battle.questions[state.battle.currentQuestionIndex];
      if (!currentQuestion) {
        throw new Error('No current question found');
      }

      const isCorrect = BattleService.checkAnswer(currentQuestion, answer);

      dispatch({
        type: 'ANSWER_QUESTION',
        payload: {
          isCorrect,
          timeSpent
        }
      });

      // Save progress after each answer
      await BattleService.saveBattleProgress({
        ...battleStateRef.current,
        userId: state.user.id
      });

    } catch (error) {
      await handleBattleError(error as Error);
    }
  }, [dispatch, state.battle.questions, state.battle.currentQuestionIndex, state.battle.status, state.user.id, handleBattleError]);

  const updateTimer = useCallback((timeLeft: number) => {
    if (!mountedRef.current || state.battle.status !== 'active') return;

    dispatch({
      type: 'UPDATE_BATTLE_TIME',
      payload: timeLeft
    });
  }, [dispatch, state.battle.status]);

  return {
    initializeBattle,
    handleAnswer,
    updateTimer,
    handleBattleError
  };
}