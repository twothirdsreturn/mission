// Initial state
const initialState = {
  gameState: 'MAIN_MENU', // MAIN_MENU, CHARACTER_SELECT, GALACTIC_MAP, FLIGHT, PLATFORMER, BOSS_FIGHT, DEAL_DECISION
  score: 0,
  dealsCompleted: 0,
  dealsPursued: 0,
  dealsDropped: 0
};

// Action types
export const SET_GAME_STATE = 'SET_GAME_STATE';
export const INCREMENT_SCORE = 'INCREMENT_SCORE';
export const INCREMENT_DEALS_COMPLETED = 'INCREMENT_DEALS_COMPLETED';
export const INCREMENT_DEALS_PURSUED = 'INCREMENT_DEALS_PURSUED';
export const INCREMENT_DEALS_DROPPED = 'INCREMENT_DEALS_DROPPED';
export const RESET_GAME = 'RESET_GAME';

// Reducer
const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GAME_STATE:
      return {
        ...state,
        gameState: action.payload
      };
    case INCREMENT_SCORE:
      return {
        ...state,
        score: state.score + action.payload
      };
    case INCREMENT_DEALS_COMPLETED:
      return {
        ...state,
        dealsCompleted: state.dealsCompleted + 1
      };
    case INCREMENT_DEALS_PURSUED:
      return {
        ...state,
        dealsPursued: state.dealsPursued + 1
      };
    case INCREMENT_DEALS_DROPPED:
      return {
        ...state,
        dealsDropped: state.dealsDropped + 1
      };
    case RESET_GAME:
      return initialState;
    default:
      return state;
  }
};

export default gameReducer;
