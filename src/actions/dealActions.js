// Actions for data sourcing and deal management
import DataSourcingService from '../services/DataSourcingService';
import { SET_DEALS, ADD_DEAL, UPDATE_DEAL, DECAY_DEALS } from '../reducers/dealReducer';

// Fetch all MSP listings from marketplaces
export const fetchMSPListings = () => {
  return async (dispatch) => {
    try {
      // Fetch listings from the data sourcing service
      const listings = await DataSourcingService.fetchAllListings();
      
      // Dispatch action to update the store
      dispatch({
        type: SET_DEALS,
        payload: listings
      });
      
      return listings;
    } catch (error) {
      console.error('Error fetching MSP listings:', error);
      
      // Use fallback listings in case of error
      const fallbackListings = DataSourcingService.getFallbackListings();
      
      dispatch({
        type: SET_DEALS,
        payload: fallbackListings
      });
      
      return fallbackListings;
    }
  };
};

// Add a new MSP listing
export const addMSPListing = (listing) => {
  return {
    type: ADD_DEAL,
    payload: listing
  };
};

// Update an existing MSP listing
export const updateMSPListing = (id, updates) => {
  return {
    type: UPDATE_DEAL,
    payload: { id, ...updates }
  };
};

// Decay all deals (reduce time remaining)
export const decayDeals = (amount) => {
  return {
    type: DECAY_DEALS,
    payload: amount
  };
};

// Set up hourly deal refresh
export const setupDealRefresh = () => {
  return (dispatch) => {
    // Initial fetch
    dispatch(fetchMSPListings());
    
    // Set up hourly refresh
    setInterval(() => {
      dispatch(fetchMSPListings());
    }, 60 * 60 * 1000); // 1 hour
    
    // Set up deal decay (every 10 minutes)
    setInterval(() => {
      dispatch(decayDeals(1));
    }, 10 * 60 * 1000); // 10 minutes
  };
};
