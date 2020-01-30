import { createAction } from "redux-actions";
import { setTeamRatings, setTeamGlobalPlace, setTeamScore } from "./team";
import marked from "marked";
import { CONTEST_STATUS } from "../config";

export const setParamS = createAction("CONTEST_SET_PARAM_S", s => ({ s }));

export const setContestTimes = createAction(
  "CONTEST_SET_TIMES",
  ({
    now,
    clientNow,
    contestStarts,
    registrationEnds,
    contestEnds,
    afterContestEnds,
  }) => ({
    now: now * 1000,
    clientNow,
    registrationEnds: registrationEnds * 1000,
    contestStarts: contestStarts * 1000,
    contestEnds: contestEnds * 1000,
    afterContestEnds: afterContestEnds * 1000,
  })
);

export const setContestStatus = createAction(
  "CONTEST_SET_STATUS",
  ({ type, from, until }) => ({
    status: { type, from, until },
  })
);

export const runCorrectContestStatus = () => (dispatch, getState) => {
  const {
    now,
    registrationEnds,
    contestStarts,
    contestEnds,
    afterContestEnds,
  } = getState().contest;

  // Current state
  if (now < registrationEnds) {
    dispatch(
      setContestStatus({
        type: CONTEST_STATUS.REGISTRATION_RUNNING,
        from: -Infinity,
        until: registrationEnds,
      })
    );
  } else if (now < contestStarts) {
    dispatch(
      setContestStatus({
        type: CONTEST_STATUS.BEFORE_CONTEST_START,
        from: registrationEnds,
        until: contestStarts,
      })
    );
  } else if (now < contestEnds) {
    dispatch(
      setContestStatus({
        type: CONTEST_STATUS.CONTEST_RUNNING,
        from: contestStarts,
        until: contestEnds,
      })
    );
  } else if (now < afterContestEnds) {
    dispatch(
      setContestStatus({
        type: CONTEST_STATUS.SOLVE_UP_RUNNING,
        from: contestEnds,
        until: afterContestEnds,
      })
    );
  } else {
    dispatch(
      setContestStatus({
        type: CONTEST_STATUS.SOLVE_UP_ENDS,
        from: afterContestEnds,
        until: Infinity,
      })
    );
  }

  // Future states

  const registrationEndsTimeout = registrationEnds - now;
  if (registrationEndsTimeout > 0) {
    setTimeout(
      () =>
        dispatch(
          setContestStatus({
            type: CONTEST_STATUS.BEFORE_CONTEST_START,
            from: registrationEnds,
            until: contestStarts,
          })
        ),
      registrationEndsTimeout
    );
  }

  const contestStartsTimeout = contestStarts - now;
  if (contestStartsTimeout > 0) {
    setTimeout(
      () =>
        dispatch(
          setContestStatus({
            type: CONTEST_STATUS.CONTEST_RUNNING,
            from: contestStarts,
            until: contestEnds,
          })
        ),
      contestStartsTimeout
    );
  }

  const contestEndsTimeout = contestEnds - now;
  if (contestEndsTimeout > 0) {
    setTimeout(
      () =>
        dispatch(
          setContestStatus({
            type: CONTEST_STATUS.SOLVE_UP_RUNNING,
            from: contestEnds,
            until: afterContestEnds,
          })
        ),
      contestEndsTimeout
    );
  }

  const afterContestEndsTimeout = afterContestEnds - now;
  if (afterContestEndsTimeout > 0) {
    setTimeout(
      () =>
        dispatch(
          setContestStatus({
            type: CONTEST_STATUS.SOLVE_UP_ENDS,
            from: afterContestEnds,
            until: Infinity,
          })
        ),
      afterContestEndsTimeout
    );
  }
};

export const setRefreshLoading = createAction(
  "CONTEST_SET_REFRESH_LOADING",
  refreshLoading => ({ refreshLoading })
);

export const setGroupRatingLoading = createAction(
  "CONTEST_SET_GROUP_RATING_LOADING",
  groupId => ({ id: groupId, loading: true })
);

export const setGroupRatingLoaded = createAction(
  "CONTEST_SET_GROUP_RATING_LOADED",
  groupId => ({ id: groupId, loading: false, loaded: Date.now() })
);

export const setGroupRating = createAction(
  "CONTEST_SET_GROUP_RATING",
  (groupId, rating) => ({
    id: groupId,
    teams: rating.map(
      ({ id, name, logo, place, score, taskCount, lastActivity }) => ({
        id,
        name,
        logo,
        place,
        score,
        tasksCount: taskCount,
        lastActivity: lastActivity * 1000,
      })
    ),
  })
);

export const refresh = () => (dispatch, _, { api }) => {
  dispatch(setRefreshLoading(true));
  api
    .refresh()
    .then(result => {
      if (result && "NewsCount" in result) {
        const {
          NewsCount: newsCount,
          Place: place,
          Score: score,
          GlobalPlace,
        } = result;
        dispatch(setNewsCount({ newsCount }));
        dispatch(setTeamRatings({ place, score }));
        dispatch(setTeamGlobalPlace(GlobalPlace));
      }
    })
    .finally(() => dispatch(setRefreshLoading(false)));
};

export const fetchRating = groupId => (dispatch, getState, { api }) => {
  dispatch(setGroupRatingLoading(groupId));
  api
    .getRating(groupId)
    .then(result => {
      if (Array.isArray(result)) {
        dispatch(setGroupRating(groupId, result));
        const state = getState();
        const currentTeamIndex = result.findIndex(
          r => r.id === state.team.teamId
        );
        if (currentTeamIndex !== -1) {
          if (groupId === 0) {
            dispatch(setTeamGlobalPlace(result[currentTeamIndex].place));
            dispatch(setTeamScore(result[currentTeamIndex].score));
          } else {
            dispatch(
              setTeamRatings({
                score: result[currentTeamIndex].score,
                place: result[currentTeamIndex].place,
              })
            );
          }
        }
      }
    })
    .finally(() => dispatch(setGroupRatingLoaded(groupId)));
};

/* NEWS */

export const setNewsCount = createAction(
  "CONTEST_SET_NEWS_COUNT",
  ({ newsCount }) => ({
    count: newsCount,
  })
);

export const setNewsLoading = createAction("CONTEST_SET_NEWS_LOADING", () => ({
  loading: true,
}));

export const setNewsLoaded = createAction("CONTEST_SET_NEWS_LOADED", () => ({
  loading: false,
  loaded: Date.now(),
}));

export const setNews = createAction("CONTEST_SET_NEWS", news => ({
  count: news.length,
  items: news.map(({ title, body, time }) => ({
    title,
    body: marked(body),
    time: time * 1000,
  })),
}));

export const fetchAllNews = () => (dispatch, _, { api }) => {
  dispatch(setNewsLoading());
  api
    .getNews()
    .then(result => {
      if (result) {
        dispatch(setNews(result));
      }
    })
    .finally(() => dispatch(setNewsLoaded()));
};
