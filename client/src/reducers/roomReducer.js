import {
  ROOM,
  NEW_ROOM,
  DELETE_ROOM,
  GET_MESSAGES,
  LOADING
} from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case NEW_ROOM:
      return action.payload;
    case DELETE_ROOM:
      return action.payload;
    case GET_MESSAGES:
      let newState = Object.assign({}, state);
      newState.messages = action.payload;
      return newState;
    case LOADING:
      if (action.payload.target === ROOM) {
        state.isLoading = action.payload.isLoading;
      }
      return state;
    default:
      return state;
  }
}
