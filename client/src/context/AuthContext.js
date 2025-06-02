"use client"

import { createContext, useReducer, useEffect } from "react"
import axios from "axios"
import authReducer from "./authReducer"
import setAuthToken from "../utils/setAuthToken"

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
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }

    try {
      const res = await axios.get("/api/auth/me")

      dispatch({
        type: "USER_LOADED",
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
      })
    }
  }

  // Register user
  const register = async (formData, userType = "user") => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      let endpoint = "/api/users"

      if (userType === "student") {
        endpoint = "/api/auth/student-signup"
      } else if (userType === "teacher") {
        endpoint = "/api/auth/teacher-signup"
      }

      const res = await axios.post(endpoint, formData, config)

      if (userType === "user") {
        dispatch({
          type: "REGISTER_SUCCESS",
          payload: res.data,
        })
        loadUser()
      } else {
        // For student/teacher signup, just return success
        return { success: true, message: res.data.msg }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Registration failed"

      if (userType === "user") {
        dispatch({
          type: "REGISTER_FAIL",
          payload: errorMsg,
        })
      } else {
        throw new Error(errorMsg)
      }
    }
  }

  // Login user
  const login = async (username, password) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await axios.post("/api/auth/login", { username, password }, config)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data,
      })

      loadUser()
    } catch (err) {
      dispatch({
        type: "LOGIN_FAIL",
        payload: err.response.data.msg,
      })
    }
  }

  // Logout
  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: "CLEAR_ERRORS" })
  }

  useEffect(() => {
    loadUser()
  }, [])

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
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
