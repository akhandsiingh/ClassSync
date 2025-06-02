"use client"

import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const TeacherRoute = () => {
  const { isAuthenticated, loading, user } = useContext(AuthContext)

  if (loading) return <div className="loader">Loading...</div>

  return isAuthenticated && user && (user.role === "teacher" || user.role === "admin") ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  )
}

export default TeacherRoute
