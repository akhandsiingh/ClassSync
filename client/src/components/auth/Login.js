"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const { username, password } = formData
  const { login, isAuthenticated, error, clearErrors, user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard")
    }
    // eslint-disable-next-line
  }, [isAuthenticated, user])

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
    }
  }, [location])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    login(username, password)
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="text-primary">ClassSync Login</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign Into Your Account
        </p>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              minLength="6"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <div className="signup-links">
            <p>Don't have an account?</p>
            <div className="signup-options">
              <Link to="/student-signup" className="btn btn-outline-primary">
                Register as Student
              </Link>
              <Link to="/teacher-signup" className="btn btn-outline-success">
                Register as Teacher
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
