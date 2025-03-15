import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import gameReducer from './reducers/gameReducer';
import characterReducer from './reducers/characterReducer';
import dealReducer from './reducers/dealReducer';

const rootReducer = combineReducers({
  game: gameReducer,
  character: characterReducer,
  deals: dealReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
