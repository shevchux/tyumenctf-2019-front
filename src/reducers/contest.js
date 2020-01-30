import { handleActions, combineActions } from "redux-actions";
import {
  setContestTimes,
  setContestStatus,
  setNewsCount,
  setNewsLoading,
  setNewsLoaded,
  setNews,
  setParamS,
  setRefreshLoading,
  setGroupRatingLoading,
  setGroupRatingLoaded,
  setGroupRating,
} from "../actions/contest";
import { TEAM_GROUPS, CONTEST_STATUS } from "../config";

const defaultState = {
  now: undefined,
  registrationEnds: undefined,
  contestStarts: undefined,
  contestEnds: undefined,
  afterContestEnds: undefined,
  status: {
    type: CONTEST_STATUS.REGISTRATION_RUNNING,
    from: -Infinity,
    until: Infinity,
  },
  s: undefined,
  refreshLoading: true,
  news: {
    count: 0,
    items: [],
  },
  rating: Object.entries(TEAM_GROUPS).map(([id, name]) => ({
    id: +id,
    name,
    loading: false,
    loaded: false,
    teams: [],
  })),
};

const contestReducer = handleActions(
  {
    [combineActions(setContestTimes, setParamS, setRefreshLoading, setContestStatus)]: (
      state,
      { payload }
    ) => ({
      ...state,
      ...payload,
    }),
    [combineActions(setNewsCount, setNewsLoading, setNewsLoaded, setNews)]: (
      state,
      { payload }
    ) => ({
      ...state,
      news: {
        ...state.news,
        ...payload,
      },
    }),
    [combineActions(setGroupRatingLoading, setGroupRatingLoaded)]: (
      state,
      { payload: { id, loading, loaded } }
    ) => ({
      ...state,
      rating: state.rating.map(item => {
        if (item.id === id) {
          return { ...item, loading, loaded: loaded || item.loaded };
        }
        return item;
      }),
    }),
    [setGroupRating]: (state, { payload: { id, teams } }) => ({
      ...state,
      rating: state.rating.map(item => {
        if (item.id === id) {
          return { ...item, teams };
        }
        return item;
      }),
    }),
  },
  defaultState
);

export default contestReducer;
