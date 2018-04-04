import axios from 'axios';
import Auth from '../modules/Auth';
import {
  FETCH_USER,
  LOG_IN,
  LOG_OUT,
  LOADING,
  NEW_ROOM,
  DELETE_ROOM
} from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user', {
    headers: { Authorization: `Bearer ${Auth.getToken()}` }
  });

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const login = (username, password) => async dispatch => {
  dispatch(loading());

  let res = {};
  try {
    res = await axios.post('/auth/login', { username, password });
    Auth.authenticateUser(res.data.token);
  } catch (error) {
    // res.data = error.response;
    dispatch(authError(error.response));
    return;
  }

  dispatch({ type: LOG_IN, payload: res.data });
  dispatch(doneLoading());
};

export const signup = (username, password) => async dispatch => {
  dispatch(loading());

  try {
    await axios.post('/auth/signup', { username, password });
  } catch (error) {
    dispatch(authError(error.response));
    return;
  }

  dispatch(login(username, password));
};

export const authError = error => dispatch => {
  dispatch({ type: FETCH_USER, payload: error });
};

export const clearAuth = () => dispatch => {
  dispatch({ type: FETCH_USER, payload: null });
};

export const logout = () => async dispatch => {
  await axios.get('/api/logout', {
    headers: { Authorization: `Bearer ${Auth.getToken()}` }
  });

  Auth.deauthenticateUser();
  dispatch({ type: LOG_OUT, payload: null });
};

export const loading = () => dispatch => {
  dispatch({ type: LOADING, payload: { isLoading: true } });
};

export const doneLoading = () => dispatch => {
  dispatch({ type: LOADING, payload: { isLoading: false } });
};

export const createRoom = name => async dispatch => {
  dispatch(loading());

  const newRoom = await axios.post(
    '/api/new_room',
    { name },
    { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
  );

  if (newRoom.data.success) {
    dispatch(fetchUser());
  }
  dispatch({ type: NEW_ROOM, payload: { success: newRoom.success } });
  dispatch(doneLoading());
};

export const deleteRoom = name => async dispatch => {
  const deleteRoom = await axios.post(
    'api/delete_room',
    { name },
    { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
  );

  if (deleteRoom.data.success) {
    dispatch(fetchUser());
  }
  dispatch({ type: DELETE_ROOM, payload: { success: deleteRoom.success } });
};
