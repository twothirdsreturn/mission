// Initial state
const initialState = {
  deals: [],
  selectedDeal: null,
  dealStatus: {
    fresh: { label: 'Fresh Deal', color: 'green', timeRemaining: [75, 100] },
    aging: { label: 'Aging Deal', color: 'yellow', timeRemaining: [50, 75] },
    stale: { label: 'Stale Deal', color: 'red', timeRemaining: [25, 50] },
    expired: { label: 'Expired Deal', color: 'gray', timeRemaining: [0, 25] }
  }
};

// Action types
export const SET_DEALS = 'SET_DEALS';
export const ADD_DEAL = 'ADD_DEAL';
export const UPDATE_DEAL = 'UPDATE_DEAL';
export const REMOVE_DEAL = 'REMOVE_DEAL';
export const SELECT_DEAL = 'SELECT_DEAL';
export const DECAY_DEALS = 'DECAY_DEALS';
export const COLLECT_GEM = 'COLLECT_GEM';
export const DEFEAT_BOSS = 'DEFEAT_BOSS';
export const MAKE_DECISION = 'MAKE_DECISION';

// Reducer
const dealReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DEALS:
      return {
        ...state,
        deals: action.payload
      };
    case ADD_DEAL:
      return {
        ...state,
        deals: [...state.deals, action.payload]
      };
    case UPDATE_DEAL:
      return {
        ...state,
        deals: state.deals.map(deal => 
          deal.id === action.payload.id ? { ...deal, ...action.payload } : deal
        )
      };
    case REMOVE_DEAL:
      return {
        ...state,
        deals: state.deals.filter(deal => deal.id !== action.payload)
      };
    case SELECT_DEAL:
      return {
        ...state,
        selectedDeal: action.payload
      };
    case DECAY_DEALS:
      return {
        ...state,
        deals: state.deals.map(deal => {
          const newTimeRemaining = deal.timeRemaining - action.payload;
          let status = 'fresh';
          
          if (newTimeRemaining <= 0) {
            status = 'expired';
          } else if (newTimeRemaining <= 25) {
            status = 'stale';
          } else if (newTimeRemaining <= 75) {
            status = 'aging';
          }
          
          return {
            ...deal,
            timeRemaining: Math.max(0, newTimeRemaining),
            status
          };
        })
      };
    case COLLECT_GEM:
      return {
        ...state,
        deals: state.deals.map(deal => {
          if (deal.id === action.payload.dealId) {
            const updatedGems = deal.gems.map(gem => 
              gem.id === action.payload.gemId ? { ...gem, collected: true } : gem
            );
            return { ...deal, gems: updatedGems };
          }
          return deal;
        })
      };
    case DEFEAT_BOSS:
      return {
        ...state,
        deals: state.deals.map(deal => 
          deal.id === action.payload ? { ...deal, boss: { ...deal.boss, defeated: true } } : deal
        )
      };
    case MAKE_DECISION:
      return {
        ...state,
        deals: state.deals.map(deal => 
          deal.id === action.payload.dealId 
            ? { 
                ...deal, 
                pursued: action.payload.decision === 'pursue',
                completed: true 
              } 
            : deal
        )
      };
    default:
      return state;
  }
};

export default dealReducer;
