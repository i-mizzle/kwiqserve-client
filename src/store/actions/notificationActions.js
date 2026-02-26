import { SET_NOTIFICATION, CLEAR_NOTIFICATION } from '../types.js';

export const setNotification = (message) => (dispatch) => {
  dispatch({
    type: SET_NOTIFICATION,
    payload: message,
  });

  // Auto-clear notification after 7 seconds
  setTimeout(() => {
    dispatch({
      type: CLEAR_NOTIFICATION,
      payload: null,
    });
  }, 7000);
};

export const clearNotification = () => (dispatch) => {
  dispatch({
    type: CLEAR_NOTIFICATION,
    payload: null,
  });
};
