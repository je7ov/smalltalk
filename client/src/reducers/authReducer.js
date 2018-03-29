import { FETCH_USER, LOG_IN, LOG_OUT } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false;
    case LOG_IN:
      return action.payload || false;
    case LOG_OUT:
      return action.payload || false;
    default:
      return state;
  }
}
