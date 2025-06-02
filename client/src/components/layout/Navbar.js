"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext)

  const onLogout = () => {
    logout()
  }

  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      {user && user.role === "teacher" && (
        <>
          <li>
            <Link to="/students">Students</Link>
          </li>
          <li>
            <Link to="/marks">Marks</Link>
          </li>
          <li>
            <Link to="/attendance">Attendance</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
        </>
      )}
      {user && user.role === "student" && (
        <>
          <li>
            <Link to="/student/marks">My Marks</Link>
          </li>
          <li>
            <Link to="/student/attendance">My Attendance</Link>
          </li>
        </>
      )}
      <li>
        <Link to="/profile">Profile</Link>
      </li>
      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt"></i> <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  )

  return (
    <nav className="navbar">
      <h1>
        <Link to="/">
          <i className="fas fa-school"></i> ClassSync
        </Link>
      </h1>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  )
}

export default Navbar
