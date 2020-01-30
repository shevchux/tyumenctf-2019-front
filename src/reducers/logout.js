import { handleActions, combineActions } from "redux-actions";
import {
  setLogoutSending,
  setLogoutSendingError,
  setClearLogout,
} from "../actions/logout";

const defaultState = {
  success: false,
  sending: false,
  error: false,
};

const logoutReducer = handleActions(
  {
    [combineActions(setLogoutSending, setLogoutSendingError, setClearLogout)]: (
      state,
      { payload }
    ) => ({
      ...state,
      ...payload,
    }),
  },
  defaultState
);

export default logoutReducer;
