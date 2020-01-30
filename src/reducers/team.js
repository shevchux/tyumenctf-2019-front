import { handleActions, combineActions } from "redux-actions";
import {
  setTeamLoading,
  setTeamRatings,
  setTeamScore,
  setTeamLoadingSuccess,
  setTeamLoadingError,
  setBeenLoggedIn,
  setTeamGlobalPlace,
} from "../actions/team";

const defaultState = {
  success: false,
  loading: false,
  error: false,
  beenLoggedIn: false,
  loggedIn: false,
  name: undefined,
  logo: undefined,
  score: undefined,
  globalPlace: undefined,
  place: undefined,
  teamId: undefined,
  groupId: undefined,
  defaultLang: "ru",
};

const teamReducer = handleActions(
  {
    [combineActions(
      setTeamLoading,
      setTeamRatings,
      setTeamScore,
      setTeamLoadingSuccess,
      setTeamLoadingError,
      setTeamGlobalPlace,
      setBeenLoggedIn
    )]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  defaultState
);

export default teamReducer;
