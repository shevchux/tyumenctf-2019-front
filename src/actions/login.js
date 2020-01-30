import { createAction } from "redux-actions";
import { setTeamLoadingSuccess } from "./team";
import { setContestTimes, setParamS, runCorrectContestStatus } from "./contest";

export const setAuthSending = createAction("LOGIN_SET_AUTH_SENDING", () => ({
  sending: true,
  success: false,
  error: false,
}));

export const setAuthSendingSuccess = createAction(
  "LOGIN_AUTH_SENDING_SUCCESS",
  () => ({
    sending: false,
    success: true,
    error: false,
  })
);

export const setAuthSendingError = createAction(
  "LOGIN_AUTH_SENDING_ERROR",
  (errorCode = 0) => ({
    sending: false,
    success: false,
    error: true,
    errorCode,
  })
);

export const clearAuth = createAction(
  "LOGIN_AUTH_CLEAR_AUTH",
  () => ({
    sending: false,
    success: false,
    error: false,
  })
);

export const fetchAuth = (login, password) => (dispatch, _, { api }) => {
  dispatch(setAuthSending());
  api
    .login(login, password)
    .then(result => {
      if (result && result.loggedIn) {
        dispatch(setContestTimes(result.times));
        dispatch(runCorrectContestStatus());
        dispatch(setAuthSendingSuccess());
        dispatch(setTeamLoadingSuccess(result, false));
        dispatch(setParamS(result.s))
      } else {
        dispatch(setAuthSendingError(result.errorCode));
      }
    })
    .catch(() => dispatch(setAuthSendingError(-1)));
};