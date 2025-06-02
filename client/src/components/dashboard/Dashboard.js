"use client"

import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import TeacherDashboard from "./TeacherDashboard"
import StudentDashboard from "./StudentDashboard"

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  if (!user) {
    return <div>Please log in to view your dashboard</div>
  }

  return (
    <div className="dashboard-container">{user.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}</div>
  )
}

export default Dashboard
