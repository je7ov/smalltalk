import { combineReducers } from 'redux';
import authReducer from './authReducer';
import roomReducer from './roomReducer';
import loadingReducer from './loadingReducer';

export default combineReducers({
  auth: authReducer,
  room: roomReducer,
  load: loadingReducer
});
