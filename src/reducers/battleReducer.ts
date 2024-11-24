import { BattleState, BattleStatus } from '../types/battle';
import { BATTLE_CONFIG } from '../config/battleConfig';
import { BattleAction } from '../contexts/BattleContext';


const initialState: BattleState = {
    status: 'searching',
    inProgress: false,
    winStreak: 0,
    totalBattles: 0,
    questions: [],
    currentQuestion: 0,
    score: { player: 0, opponent: 0 },
    timePerQuestion: BATTLE_CONFIG.timePerQuestion,
    playerAnswers: [],
    timeLeft: BATTLE_CONFIG.questionTime
  };

 export function battleReducer(state: BattleState, action: BattleAction): BattleState {
    switch (action.type) {
      case 'START_BATTLE':
        return {
          ...initialState,
          inProgress: true,
          winStreak: state.winStreak,
          totalBattles: state.totalBattles
        };
  
      case 'SET_STATUS':
        const newStatus = action.payload;
        return {
          ...state,
          status: newStatus,
          timeLeft: newStatus === 'battle' ? BATTLE_CONFIG.questionTime : state.timeLeft,
          inProgress: newStatus === 'battle'
        };
  
      case 'INITIALIZE_BATTLE':
        return {
          ...state,
          questions: action.payload.questions,
          timePerQuestion: action.payload.timePerQuestion,
          currentQuestion: 0,
          playerAnswers: [],
          score: { player: 0, opponent: 0 },
          status: 'searching',
          inProgress: false
        };
  
      case 'UPDATE_BATTLE_PROGRESS':
        return {
          ...state,
          score: action.payload.score,
          playerAnswers: action.payload.playerAnswers,
          timeLeft: BATTLE_CONFIG.questionTime
        };
  
      case 'ADVANCE_QUESTION':
        return {
          ...state,
          currentQuestion: action.payload,
          timeLeft: BATTLE_CONFIG.questionTime
        };
  
      case 'SET_TIME_LEFT':
        return {
          ...state,
          timeLeft: action.payload
        };
  
      case 'END_BATTLE':
        return {
          ...state,
          status: 'completed',
          inProgress: false,
          results: action.payload,
          endTime: new Date().toISOString()
        };
  
      case 'RESET_BATTLE':
        return initialState;
  
      default:
        return state;
    }
  }

export { initialState };