"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const Sidebar = () => {
  const { user } = useContext(AuthContext)

  if (!user) return null

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>ClassSync</h2>
      </div>

      {user.role === "teacher" && (
        <div className="sidebar-menu">
          <h3>Teacher Menu</h3>
          <ul>
            <li>
              <Link to="/dashboard">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/students">
                <i className="fas fa-user-graduate"></i> Students
              </Link>
            </li>
            <li>
              <Link to="/classes">
                <i className="fas fa-chalkboard"></i> Classes
              </Link>
            </li>
            <li>
              <Link to="/subjects">
                <i className="fas fa-book"></i> Subjects
              </Link>
            </li>
            <li>
              <Link to="/marks">
                <i className="fas fa-chart-line"></i> Marks
              </Link>
            </li>
            <li>
              <Link to="/attendance">
                <i className="fas fa-calendar-check"></i> Attendance
              </Link>
            </li>
            <li>
              <Link to="/users">
                <i className="fas fa-users"></i> Users
              </Link>
            </li>
          </ul>
        </div>
      )}

      {user.role === "student" && (
        <div className="sidebar-menu">
          <h3>Student Menu</h3>
          <ul>
            <li>
              <Link to="/dashboard">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <i className="fas fa-user"></i> Profile
              </Link>
            </li>
            <li>
              <Link to="/student/marks">
                <i className="fas fa-chart-line"></i> My Marks
              </Link>
            </li>
            <li>
              <Link to="/student/attendance">
                <i className="fas fa-calendar-check"></i> My Attendance
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Sidebar
