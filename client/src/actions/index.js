import axios from 'axios';
import Auth from '../modules/Auth';
import { FETCH_USER, LOG_IN, LOG_OUT } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user', {
    headers: { Authorization: `Bearer ${Auth.getToken()}` }
  });

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const login = (username, password) => async dispatch => {
  let res = {};
  try {
    res = await axios.post('/auth/login', { username, password });
    Auth.authenticateUser(res.data.token);
  } catch (error) {
    res.data = error.response;
  }

  dispatch({ type: LOG_IN, payload: res.data });
};

export const signup = (username, password) => async dispatch => {
  let res;

  try {
    res = await axios.post('/auth/signup', { username, password });
  } catch (error) {
    dispatch(authError(error.response));
    return;
  }

  console.log(res);
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
