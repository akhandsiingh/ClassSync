"use client"

import { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import DashboardStats from "./DashboardStats"
import RecentActivity from "./RecentActivity"

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalSubjects: 0,
    todayAttendance: 0,
  })
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classes
        const classesRes = await axios.get("/api/classes")
        setClasses(classesRes.data)

        // Fetch students count
        const studentsRes = await axios.get("/api/students")

        // Mock stats for now - in a real app, you'd have specific endpoints
        setStats({
          totalStudents: studentsRes.data.length,
          totalClasses: classesRes.data.length,
          totalSubjects: 0, // Would be fetched from subjects endpoint
          todayAttendance: 0, // Would be calculated from today's attendance
        })

        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="dashboard">
      <h1>Teacher Dashboard</h1>
      <p className="welcome-message">Welcome to ClassSync, {user && user.firstName}!</p>

      <DashboardStats stats={stats} />

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>My Classes</h3>
          {classes.length > 0 ? (
            <ul className="class-list">
              {classes.map((cls) => (
                <li key={cls._id}>
                  <Link to={`/classes/${cls._id}`}>
                    {cls.name} - {cls.section}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No classes assigned yet.</p>
          )}
          <Link to="/classes" className="btn btn-primary btn-sm">
            View All Classes
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/attendance/add" className="btn btn-primary">
              Mark Attendance
            </Link>
            <Link to="/marks/add" className="btn btn-success">
              Add Marks
            </Link>
            <Link to="/students" className="btn btn-info">
              View Students
            </Link>
            <Link to="/users/add" className="btn btn-warning">
              Add User
            </Link>
          </div>
        </div>
      </div>

      <RecentActivity />
    </div>
  )
}

export default TeacherDashboard
