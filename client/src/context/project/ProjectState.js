"use client"

import { useReducer } from "react"
import axios from "axios"
import ProjectContext from "./projectContext"
import projectReducer from "./projectReducer"
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

const ProjectState = (props) => {
  const initialState = {
    projects: [],
    current: null,
    tasks: [],
    error: null,
  }

  const [state, dispatch] = useReducer(projectReducer, initialState)

  // Get Projects
  const getProjects = async () => {
    try {
      const res = await axios.get("/api/projects")

      dispatch({
        type: GET_PROJECTS,
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: PROJECT_ERROR,
        payload: err.response.msg,
      })
    }
  }

  // Add Project
  const addProject = async (project) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await axios.post("/api/projects", project, config)

      dispatch({
        type: ADD_PROJECT,
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: PROJECT_ERROR,
        payload: err.response.msg,
      })
    }
  }

  // Delete Project
  const deleteProject = async (id) => {
    try {
      await axios.delete(`/api/projects/${id}`)

      dispatch({
        type: DELETE_PROJECT,
        payload: id,
      })
    } catch (err) {
      dispatch({
        type: PROJECT_ERROR,
        payload: err.response.msg,
      })
    }
  }

  // Update Project
  const updateProject = async (project) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await axios.put(`/api/projects/${project._id}`, project, config)

      dispatch({
        type: UPDATE_PROJECT,
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: PROJECT_ERROR,
        payload: err.response.msg,
      })
    }
  }

  // Set Current Project
  const setCurrent = (project) => {
    dispatch({ type: SET_CURRENT, payload: project })
  }

  // Clear Current Project
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT })
  }

  // Clear Projects
  const clearProjects = () => {
    dispatch({ type: CLEAR_PROJECTS })
  }

  // Get Tasks
  const getTasks = async (projectId) => {
    try {
      const res = await axios.get(`/api/tasks/project/${projectId}`)

      dispatch({
        type: GET_TASKS,
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: TASK_ERROR,
        payload: err.response.msg,
      })
    }
  }

  // Add Task
  const addTask = async (task) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await axios.post("/api/tasks", task, config)

      dispatch({
        type: ADD_TASK,
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: TASK_ERROR,
        payload: err.response.msg,
      })
    }
  }

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`)

      dispatch({
        type: DELETE_TASK,
        payload: id,
      })
    } catch (err) {
      dispatch({
        type: TASK_ERROR,
        payload: err.response.msg,
      })
    }
  }

  // Update Task
  const updateTask = async (task) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await axios.put(`/api/tasks/${task._id}`, task, config)

      dispatch({
        type: UPDATE_TASK,
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: TASK_ERROR,
        payload: err.response.msg,
      })
    }
  }

  // Clear Tasks
  const clearTasks = () => {
    dispatch({ type: CLEAR_TASKS })
  }

  return (
    <ProjectContext.Provider
      value={{
        projects: state.projects,
        current: state.current,
        tasks: state.tasks,
        error: state.error,
        getProjects,
        addProject,
        deleteProject,
        setCurrent,
        clearCurrent,
        updateProject,
        clearProjects,
        getTasks,
        addTask,
        deleteTask,
        updateTask,
        clearTasks,
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  )
}

export default ProjectState
