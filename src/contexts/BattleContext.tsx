import React, { createContext, useContext, useReducer } from 'react';
import { BattleState, BattleStatus } from '../types/battle';
import { BATTLE_CONFIG } from '../config/battleConfig';

interface BattleContextType {
  state: BattleState;
  dispatch: React.Dispatch<BattleAction>;
}

export type BattleAction =
  | { type: 'START_BATTLE' }
  | { type: 'SET_STATUS'; payload: BattleStatus }
  | { type: 'INITIALIZE_BATTLE'; payload: { questions: any[]; timePerQuestion: number } }
  | { type: 'UPDATE_BATTLE_PROGRESS'; payload: any }
  | { type: 'ADVANCE_QUESTION'; payload: number }
  | { type: 'SET_TIME_LEFT'; payload: number }
  | { type: 'END_BATTLE'; payload: any }
  | { type: 'RESET_BATTLE' };

const initialState: BattleState = {
  status: 'searching',
  inProgress: false,
  questions: [],
  currentQuestion: 0,
  score: { player: 0, opponent: 0 },
  timeLeft: BATTLE_CONFIG.timePerQuestion,
  timePerQuestion: BATTLE_CONFIG.timePerQuestion,
  playerAnswers: []
};

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export function BattleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(battleReducer, initialState);

  return (
    <BattleContext.Provider value={{ state, dispatch }}>
      {children}
    </BattleContext.Provider>
  );
}

export function useBattleContext() {
  const context = useContext(BattleContext);
  if (context === undefined) {
    throw new Error('useBattleContext must be used within a BattleProvider');
  }
  return context;
}

function battleReducer(state: BattleState, action: BattleAction): BattleState {
  console.log('Battle reducer:', { type: action.type, payload: action.payload });
  
  switch (action.type) {
    case 'START_BATTLE':
      console.log('Starting battle...');
      return {
        ...initialState,
        inProgress: true,
        status: 'searching',
        timeLeft: BATTLE_CONFIG.timePerQuestion
      };

    case 'SET_STATUS':
      console.log('Setting battle status:', action.payload);
      return {
        ...state,
        status: action.payload,
        timeLeft: action.payload === 'battle' ? BATTLE_CONFIG.timePerQuestion : state.timeLeft
      };

    case 'INITIALIZE_BATTLE':
      console.log('Initializing battle with questions:', action.payload.questions.length);
      return {
        ...state,
        questions: action.payload.questions,
        timePerQuestion: action.payload.timePerQuestion,
        currentQuestion: 0,
        playerAnswers: [],
        score: { player: 0, opponent: 0 },
        inProgress: true,
        status: 'ready',
        timeLeft: BATTLE_CONFIG.timePerQuestion
      };

    case 'UPDATE_BATTLE_PROGRESS':
      console.log('Updating battle progress:', action.payload);
      return {
        ...state,
        ...action.payload,
        // Preserve certain state properties that shouldn't be overwritten
        questions: state.questions,
        inProgress: true
      };

    case 'ADVANCE_QUESTION':
      console.log('Advancing to question:', action.payload);
      const nextQuestion = action.payload;
      
      if (nextQuestion >= state.questions.length) {
        console.log('Battle complete - all questions answered');
        return {
          ...state,
          currentQuestion: state.questions.length - 1,
          status: 'completed',
          inProgress: false
        };
      }

      return {
        ...state,
        currentQuestion: nextQuestion,
        timeLeft: BATTLE_CONFIG.timePerQuestion,
        status: 'battle'
      };

    case 'SET_TIME_LEFT':
      // Only update time if battle is in progress
      if (!state.inProgress || state.status !== 'battle') {
        return state;
      }
      
      const newTimeLeft = Math.max(0, action.payload);
      
      // If time runs out, move to next question
      if (newTimeLeft === 0 && state.currentQuestion < state.questions.length - 1) {
        console.log('Time ran out - advancing to next question');
        return {
          ...state,
          timeLeft: BATTLE_CONFIG.timePerQuestion,
          currentQuestion: state.currentQuestion + 1
        };
      }
      
      return {
        ...state,
        timeLeft: newTimeLeft
      };

    case 'END_BATTLE':
      console.log('Ending battle with results:', action.payload);
      return {
        ...state,
        ...action.payload,
        status: 'completed',
        inProgress: false
      };

    case 'RESET_BATTLE':
      console.log('Resetting battle state');
      return {
        ...initialState,
        timeLeft: BATTLE_CONFIG.timePerQuestion,
        timePerQuestion: BATTLE_CONFIG.timePerQuestion
      };

    default:
      console.warn('Unknown battle action:', action.type);
      return state;
  }
}

/**
 * Role: Battle state management
 * 
 * Dependencies:
 * - Battle types
 * - Battle configuration
 * 
 * Used by:
 * - Battle components
 * - Game system
 * 
 * Features:
 * - Centralized battle state
 * - Type-safe actions
 * - Battle flow control
 * 
 * Scalability:
 * - Easy to add new actions
 * - Proper state isolation
 * - Clear state updates
 */
