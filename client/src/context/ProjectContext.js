"use client"

import { createContext, useReducer } from "react"
import projectReducer from "../reducers/projectReducer"
import api from "../utils/api"

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  tasks: [],
  loading: true,
  error: null,
}

// Create context
export const ProjectContext = createContext(initialState)

// Provider component
export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState)

  // Get all projects
  const getProjects = async () => {
    try {
      const res = await api.get("/projects")

      dispatch({
        type: "GET_PROJECTS",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "PROJECT_ERROR",
        payload: err.response.data.message,
      })
    }
  }

  // Get project by ID
  const getProject = async (id) => {
    try {
      const res = await api.get(`/projects/${id}`)

      dispatch({
        type: "GET_PROJECT",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "PROJECT_ERROR",
        payload: err.response.data.message,
      })
    }
  }

  // Create new project
  const createProject = async (project) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await api.post("/projects", project, config)

      dispatch({
        type: "CREATE_PROJECT",
        payload: res.data,
      })

      return res.data
    } catch (err) {
      dispatch({
        type: "PROJECT_ERROR",
        payload: err.response.data.message,
      })
      throw err
    }
  }

  // Update project
  const updateProject = async (id, project) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await api.put(`/projects/${id}`, project, config)

      dispatch({
        type: "UPDATE_PROJECT",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "PROJECT_ERROR",
        payload: err.response.data.message,
      })
    }
  }

  // Delete project
  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`)

      dispatch({
        type: "DELETE_PROJECT",
        payload: id,
      })
    } catch (err) {
      dispatch({
        type: "PROJECT_ERROR",
        payload: err.response.data.message,
      })
    }
  }

  // Create new task
  const createTask = async (task) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await api.post("/tasks", task, config)

      dispatch({
        type: "CREATE_TASK",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "PROJECT_ERROR",
        payload: err.response.data.message,
      })
    }
  }

  // Update task
  const updateTask = async (id, task) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await api.put(`/tasks/${id}`, task, config)

      dispatch({
        type: "UPDATE_TASK",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "PROJECT_ERROR",
        payload: err.response.data.message,
      })
    }
  }

  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`)

      dispatch({
        type: "DELETE_TASK",
        payload: id,
      })
    } catch (err) {
      dispatch({
        type: "PROJECT_ERROR",
        payload: err.response.data.message,
      })
    }
  }

  // Clear errors
  const clearErrors = () => dispatch({ type: "CLEAR_ERRORS" })

  return (
    <ProjectContext.Provider
      value={{
        projects: state.projects,
        currentProject: state.currentProject,
        tasks: state.tasks,
        loading: state.loading,
        error: state.error,
        getProjects,
        getProject,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        deleteTask,
        clearErrors,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
