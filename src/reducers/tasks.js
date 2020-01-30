import { handleActions, combineActions } from "redux-actions";
import {
  setTasksLoading,
  setTasksSuccess,
  setTasksLoadingError,
  setCategoryTasksLoading,
  setCategoryTasksLoaded,
  setCategoryTasksData,
  setTaskData,
  setTaskLoaded,
  setTaskLoading,
  setTaskSolvedAndPrice,
} from "../actions/tasks";

const defaultState = {
  success: false,
  loading: false,
  error: false,
  items: [],
  categories: [],
};

const tasksReducer = handleActions(
  {
    [combineActions(setTasksLoading, setTasksSuccess, setTasksLoadingError)]: (
      state,
      { payload }
    ) => ({ ...state, ...payload }),
    [setCategoryTasksLoading]: (state, { payload }) => ({
      ...state,
      categories: state.categories.map(category => {
        if (category.id !== payload.categoryId) return category;
        return { ...category, loading: true };
      }),
    }),
    [setCategoryTasksLoaded]: (state, { payload }) => ({
      ...state,
      categories: state.categories.map(category => {
        if (category.id !== payload.categoryId) return category;
        return { ...category, loading: false };
      }),
    }),
    [setCategoryTasksData]: (state, { payload }) => ({
      ...state,
      categories: state.categories.map(category => {
        if (category.id !== payload.category.id) return category;
        return { ...category, ...payload.category };
      }),
      items: state.items
        .map(t => {
          if (payload.tasksById[t.id]) {
            return { ...t, ...payload.tasksById[t.id] };
          }
          if (t.categoryId === payload.category.id)
            return { ...t, categoryId: undefined };
          return t;
        })
        .filter(t => t),
    }),
    [setTaskLoading]: (state, { payload }) => ({
      ...state,
      items: state.items.map(task => {
        if (task.id !== payload.taskId) return task;
        return { ...task, loading: true };
      }),
    }),
    [setTaskLoaded]: (state, { payload }) => ({
      ...state,
      items: state.items.map(task => {
        if (task.id !== payload.taskId) return task;
        return { ...task, loading: false };
      }),
    }),
    [setTaskData]: (state, { payload }) => ({
      ...state,
      items: state.items.map(task => {
        if (task.id !== payload.id) return task;
        return { ...task, ...payload, loaded: Date.now() };
      }),
    }),
    [setTaskSolvedAndPrice]: (state, { payload }) => ({
      ...state,
      items: state.items.map(task => {
        if (task.id !== payload.taskId) return task;

        const solvedTeams = [...task.solvedTeams];
        if (!solvedTeams.find(st => st.id === payload.teamId)) {
          solvedTeams.push({ id: payload.teamId, name: payload.name });
        }

        return {
          ...task,
          solved: true,
          price: payload.price,
          solvedCount: solvedTeams.length,
          solvedTeams,
        };
      }),
    }),
  },
  defaultState
);

export default tasksReducer;
