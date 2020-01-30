import { createAction } from "redux-actions";
import { setContestTimes, setParamS, runCorrectContestStatus } from "./contest";
import { GETTEAM_TIMEOUT } from "../config";
import { Delay } from "../utils/api";
import i18next from "i18next";

export const setTeamRatings = createAction(
  "SET_TEAM_RATING",
  ({ score, place }) => ({
    score,
    place,
  })
);

export const setTeamGlobalPlace = createAction(
  "SET_TEAM_GLOBAL_PLACE",
  globalPlace => ({ globalPlace })
);

export const setTeamScore = createAction(
  "SET_TEAM_SCORE",
  score => ({ score })
);

export const setTeamLoadingSuccess = createAction(
  "TEAM_SET_LOADING_SUCCESS",
  (
    { loggedIn, name, logo, GroupId, teamid, defaultLang },
    beenLoggedIn = true
  ) => {
    if (defaultLang) {
      defaultLang = defaultLang === "Rus" ? "ru" : "en";
      if (!beenLoggedIn) {
        i18next.changeLanguage(defaultLang);
        document.getElementsByTagName("html")[0].lang = defaultLang;
      }
    }

    return {
      success: true,
      loading: false,
      error: false,
      beenLoggedIn,
      loggedIn,
      name,
      logo,
      teamId: teamid,
      groupId: GroupId,
      defaultLang,
    };
  }
);

export const setTeamLoading = createAction("TEAM_SET_LOADING", () => ({
  success: false,
  loading: true,
  error: false,
}));

export const setTeamLoadingError = createAction(
  "TEAM_SET_LOADING_ERROR",
  () => ({
    success: false,
    loading: false,
    error: true,
  })
);

export const setBeenLoggedIn = createAction("TEAM_SET_BEEN_LOGGED_IN", () => ({
  beenLoggedIn: true,
}));

export const fetchTeam = () => (dispatch, _, { api }) => {
  dispatch(setTeamLoading());
  const teamPromise = api.getTeam();
  const delayPromise = Delay(GETTEAM_TIMEOUT);
  Promise.all([teamPromise, delayPromise])
    .then(([teamResult]) => teamResult)
    .then(result => {
      if (result) {
        dispatch(setTeamLoadingSuccess(result, result.loggedIn));
        if (result.loggedIn && result.times) {
          dispatch(setContestTimes(result.times));
          dispatch(runCorrectContestStatus());
          dispatch(setParamS(result.s));
        }
      } else {
        dispatch(setTeamLoadingError());
      }
    })
    .catch(() => dispatch(setTeamLoadingError()));
};
