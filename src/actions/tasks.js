import { createAction } from "redux-actions";
import { Delay } from "../utils/api";
import { LOADING_TIMEOUT, GREETING_TIMEOUT, CATEGORY_ICONS } from "../config";
import { refresh } from "./contest";
import marked from "marked";

export const setTasksLoading = createAction("TASKS_SET_LOADING", () => ({
  loading: true,
  success: false,
  error: false,
}));

export const setTasksSuccess = createAction(
  "TASKS_SET_SUCCESS",
  (tasks, categories) => ({
    loading: false,
    success: true,
    error: false,
    items: tasks.map(t => ({
      id: t.TaskId,
      categoryId: t.CatId,
      name: t.Name,
      price: t.Price || 0,
      solved: t.Solved,
      solvedCount: t.Count,
    })),
    categories: categories.map(category => ({
      id: category.Id,
      name: category.Name,
      loaded: Date.now(),
      icon: CATEGORY_ICONS[category.Name.trim().toLowerCase()] || CATEGORY_ICONS[0],
    })),
  })
);

export const setTasksLoadingError = createAction(
  "TASKS_SET_LOADING_ERROR",
  () => ({
    loading: false,
    success: false,
    error: true,
  })
);

export const fetchTasks = () => (dispatch, getState, { api }) => {
  dispatch(setTasksLoading());
  const beenLoggedIn = getState().team.beenLoggedIn;
  const tasksPromise = api.getTasks();
  const delayPromise = Delay(beenLoggedIn ? LOADING_TIMEOUT : GREETING_TIMEOUT);
  Promise.all([tasksPromise, delayPromise])
    .then(([tasksResult]) => tasksResult)
    .then(result => {
      if (result && result.Tasks && result.Categories) {
        dispatch(setTasksSuccess(result.Tasks, result.Categories));
      } else {
        dispatch(setTasksLoadingError());
      }
    })
    .catch(() => dispatch(setTasksLoadingError()));
};

export const setCategoryTasksLoading = createAction(
  "CATEGORY_TASKS_SET_LOADING",
  categoryId => ({
    categoryId,
  })
);

export const setCategoryTasksLoaded = createAction(
  "CATEGORY_TASKS_SET_LOADED",
  categoryId => ({
    categoryId,
  })
);

export const setCategoryTasksData = createAction(
  "CATEGORY_TASKS_SET_DATA",
  (tasks, category) => ({
    category: {
      id: category.Id,
      name: category.Name,
      loaded: Date.now(),
      icon: CATEGORY_ICONS[category.Name.trim().toLowerCase()] || CATEGORY_ICONS[0],
    },
    tasksById: tasks.reduce((acc, t) => {
      acc[t.TaskId] = {
        id: t.TaskId,
        categoryId: t.CatId,
        name: t.Name,
        price: t.Price || 0,
        solved: t.Solved,
        solvedCount: t.Count,
      };
      return acc;
    }, {}),
  })
);

export const fetchCategoryTasks = categoryId => (dispatch, _, { api }) => {
  dispatch(setCategoryTasksLoading(categoryId));
  api
    .getTasks(categoryId)
    .then(result => {
      if (
        result &&
        result.Tasks &&
        result.Categories &&
        result.Categories[0] &&
        result.Categories[0].Id === categoryId
      ) {
        dispatch(
          setCategoryTasksData(
            result.Tasks.filter(task => task.CatId === categoryId),
            result.Categories[0]
          )
        );
      }
    })
    .finally(() => dispatch(setCategoryTasksLoaded(categoryId)));
};

export const setTaskLoading = createAction("TASK_SET_LOADING", taskId => ({
  taskId,
}));

export const setTaskLoaded = createAction("TASK_SET_LOADED", taskId => ({
  taskId,
}));

export const setTaskData = createAction(
  "TASK_SET_DATA",
  (
    taskId,
    { CatId, Name, Price, Min_price, Max_price, Solved, WhoSolved, Description, Files }
  ) => ({
    id: taskId,
    categoryId: CatId,
    name: Name,
    price: Price || 0,
    minPrice: Min_price || 0,
    maxPrice: Max_price || 0,
    solved: Solved === 1,
    solvedCount: WhoSolved.length,
    solvedTeams: WhoSolved.map(([ id, name ]) => ({ id, name })),
    description: {
      ru: marked(Description && Description.Rus),
      en: marked(Description && Description.En),
    },
    attaches: Files.map(f => ({ name: f.Name, path: f.Path, size: f.Size })),
  })
);

export const fetchTask = taskId => (dispatch, _, { api }) => {
  dispatch(setTaskLoading(taskId));
  api
    .getTask(taskId)
    .then(result => {
      if (result && "Description" in result) {
        dispatch(setTaskData(taskId, result));
      }
    })
    .finally(() => dispatch(setTaskLoaded(taskId)));
};

export const setTaskSolvedAndPrice = createAction(
  "TASK_SET_SOLVED",
  (taskId, teamId, name, price) => ({
    taskId,
    teamId,
    name,
    price
  })
);

export const makeTaskSolved = (taskId, price) => (dispatch, getState) => {
  const { teamId, name } = getState().team;
  dispatch(setTaskSolvedAndPrice(taskId, teamId, name, price));
  dispatch(refresh());
};
