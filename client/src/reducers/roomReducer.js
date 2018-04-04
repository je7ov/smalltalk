import { ROOM, NEW_ROOM, DELETE_ROOM, LOADING } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case NEW_ROOM:
      return action.payload;
    case DELETE_ROOM:
      return action.payload;
    case LOADING:
      if (action.payload.target === ROOM) {
        state.isLoading = action.payload.isLoading;
      }
      return state;
    default:
      return state;
  }
}
