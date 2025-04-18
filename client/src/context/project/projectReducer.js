import {
  GET_PROJECTS,
  ADD_PROJECT,
  DELETE_PROJECT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_PROJECT,
  PROJECT_ERROR,
  CLEAR_PROJECTS,
  GET_TASKS,
  ADD_TASK,
  DELETE_TASK,
  UPDATE_TASK,
  TASK_ERROR,
  CLEAR_TASKS,
} from "../types"

export default (state, action) => {
  switch (action.type) {
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        loading: false,
      }
    case ADD_PROJECT:
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        loading: false,
      }
    case UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map((project) => (project._id === action.payload._id ? action.payload : project)),
        loading: false,
      }
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter((project) => project._id !== action.payload),
        loading: false,
      }
    case CLEAR_PROJECTS:
      return {
        ...state,
        projects: [],
        current: null,
        tasks: [],
        error: null,
      }
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload,
      }
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null,
      }
    case PROJECT_ERROR:
      return {
        ...state,
        error: action.payload,
      }
    case GET_TASKS:
      return {
        ...state,
        tasks: action.payload,
        loading: false,
      }
    case ADD_TASK:
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false,
      }
    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) => (task._id === action.payload._id ? action.payload : task)),
        loading: false,
      }
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
        loading: false,
      }
    case CLEAR_TASKS:
      return {
        ...state,
        tasks: [],
      }
    case TASK_ERROR:
      return {
        ...state,
        error: action.payload,
      }
    default:
      return state
  }
}
