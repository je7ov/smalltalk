import { NEW_ROOM } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case NEW_ROOM:
      return action.payload;
    default:
      return state;
  }
}
