export default (state, action) => {
  switch (action.type) {
    case "GET_PROJECTS":
      return {
        ...state,
        projects: action.payload,
        loading: false,
      }
    case "GET_PROJECT":
      return {
        ...state,
        currentProject: action.payload.project,
        tasks: action.payload.tasks,
        loading: false,
      }
    case "CREATE_PROJECT":
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        loading: false,
      }
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((project) => (project._id === action.payload._id ? action.payload : project)),
        currentProject: action.payload,
        loading: false,
      }
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((project) => project._id !== action.payload),
        loading: false,
      }
    case "CREATE_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        loading: false,
      }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task._id === action.payload._id ? action.payload : task)),
        loading: false,
      }
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
        loading: false,
      }
    case "PROJECT_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}
