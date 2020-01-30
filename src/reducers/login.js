import { handleActions, combineActions } from "redux-actions";
import {
  setAuthSending,
  setAuthSendingError,
  setAuthSendingSuccess,
  clearAuth
} from "../actions/login";

const defaultState = {
  success: false,
  sending: false,
  error: false,
  errorCode: undefined,
};

const loginReducer = handleActions(
  {
    [combineActions(
      setAuthSending,
      setAuthSendingError,
      setAuthSendingSuccess,
      clearAuth
    )]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  defaultState
);

export default loginReducer;
