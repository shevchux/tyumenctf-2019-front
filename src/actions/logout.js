import { createAction } from "redux-actions";
import { Delay } from "../utils/api";
import { SHUTDOWN_TIMEOUT } from "../config";

export const setLogoutSending = createAction("LOGOUT_SET_SENDING", () => ({
  sending: true,
  success: false,
  error: false,
}));

export const setLogoutSendingError = createAction(
  "LOGOUT_SENDING_ERROR",
  () => ({
    sending: true,
    success: false,
    error: true,
  })
);

export const setClearLogout = createAction("LOGOUT_SET_CLEAR", () => ({
  sending: false,
  success: false,
  error: false,
}));

export const fetchLogout = () => (dispatch, _, { api }) => {
  dispatch(setLogoutSending());
  const logoutPromise = api.logout();
  const delayPromise = Delay(SHUTDOWN_TIMEOUT);
  Promise.all([logoutPromise, delayPromise])
    .then(([logoutResult]) => logoutResult)
    .then(result => {
      if (result && result.loggedIn === false) {
        setTimeout(() => window.location.reload(), 2000);
      } else {
        dispatch(setLogoutSendingError());
      }
    })
    .catch(() => dispatch(setLogoutSendingError()));
};
