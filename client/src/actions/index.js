import axios from 'axios';
import Auth from '../modules/Auth';
import {
  AUTH,
  FETCH_USER,
  LOG_IN,
  LOG_OUT,
  LOADING,
  ROOM,
  NEW_ROOM,
  DELETE_ROOM,
  GET_MESSAGES
} from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user', {
    headers: { Authorization: `Bearer ${Auth.getToken()}` }
  });

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const login = (username, password) => async dispatch => {
  dispatch(loading(AUTH));

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
  dispatch(doneLoading(AUTH));
};

export const signup = (username, password) => async dispatch => {
  dispatch(loading(AUTH));

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
  dispatch({ type: FETCH_USER, payload: {} });
};

export const logout = () => async dispatch => {
  dispatch(loading(AUTH));
  await axios.get('/api/logout', {
    headers: { Authorization: `Bearer ${Auth.getToken()}` }
  });

  Auth.deauthenticateUser();
  dispatch({ type: LOG_OUT, payload: null });
  dispatch(doneLoading(AUTH));
};

export const loading = target => dispatch => {
  dispatch({ type: LOADING, payload: { target, isLoading: true } });
};

export const doneLoading = target => dispatch => {
  dispatch({ type: LOADING, payload: { target, isLoading: false } });
};

export const createRoom = name => async dispatch => {
  dispatch(loading(ROOM));
  const newRoom = await axios.post(
    '/api/new_room',
    { name },
    { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
  );

  if (newRoom.data.success) {
    await dispatch(fetchUser());
  }
  dispatch({ type: NEW_ROOM, payload: { success: newRoom.success } });
  dispatch(doneLoading(ROOM));
};

export const deleteRoom = id => async dispatch => {
  dispatch(loading(ROOM));
  const deleteRoom = await axios.post(
    '/api/delete_room',
    { id },
    { headers: { Authorization: `Bearer ${Auth.getToken()}` } }
  );

  if (deleteRoom.data.success) {
    await dispatch(fetchUser());
  }
  dispatch({ type: DELETE_ROOM, payload: { success: deleteRoom.success } });
  dispatch(doneLoading(ROOM));
};

export const getMessages = id => async dispatch => {
  dispatch(loading(ROOM));
  const messages = await axios.get(`/api/messages/${id}`, {
    headers: { Authorization: `Bearer ${Auth.getToken()}` }
  });

  dispatch({ type: GET_MESSAGES, payload: messages.data });
  dispatch(doneLoading(ROOM));
};
