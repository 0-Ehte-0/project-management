"use client"

import { createContext, useReducer, useEffect } from "react"
import authReducer from "../reducers/authReducer"
import setAuthToken from "../utils/setAuthToken"
// Import the API utility at the top
import api from "../utils/api"

// Initial state
const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
}

// Create context
export const AuthContext = createContext(initialState)

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        setAuthToken(localStorage.token)
      }

      try {
        // Replace all axios.get/post calls with api.get/post
        // For example:
        // Replace:
        // const res = await axios.get("/api/users/me")
        // With:
        // const res = await api.get("/users/me")
        const res = await api.get("/users/me")

        dispatch({
          type: "USER_LOADED",
          payload: res.data,
        })
      } catch (err) {
        dispatch({ type: "AUTH_ERROR" })
      }
    }

    loadUser()
  }, [])

  // Register user
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      // Replace:
      // const res = await axios.post("/api/auth/register", formData, config)
      // With:
      // const res = await api.post("/auth/register", formData)
      const res = await api.post("/auth/register", formData)

      dispatch({
        type: "REGISTER_SUCCESS",
        payload: res.data,
      })

      loadUser()
    } catch (err) {
      dispatch({
        type: "REGISTER_FAIL",
        payload: err.response.data.message,
      })
    }
  }

  // Login user
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      // Replace:
      // const res = await axios.post("/api/auth/login", formData, config)
      // With:
      // const res = await api.post("/auth/login", formData)
      const res = await api.post("/auth/login", formData)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data,
      })

      loadUser()
    } catch (err) {
      dispatch({
        type: "LOGIN_FAIL",
        payload: err.response.data.message,
      })
    }
  }

  // Logout
  const logout = () => dispatch({ type: "LOGOUT" })

  // Clear errors
  const clearErrors = () => dispatch({ type: "CLEAR_ERRORS" })

  // Load user function for reuse
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }

    try {
      const res = await api.get("/users/me")

      dispatch({
        type: "USER_LOADED",
        payload: res.data,
      })
    } catch (err) {
      dispatch({ type: "AUTH_ERROR" })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
