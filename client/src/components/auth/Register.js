"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    role: "student",
  })

  const { username, email, password, password2, firstName, lastName, role } = formData
  const { register, isAuthenticated, error } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
    // eslint-disable-next-line
  }, [isAuthenticated])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (password !== password2) {
      console.log("Passwords do not match")
    } else {
      register({
        username,
        email,
        password,
        firstName,
        lastName,
        role,
      })
    }
  }

  return (
    <div className="register-container">
      <div className="register-form-container">
        <h1 className="text-primary">Sign Up for ClassSync</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Create Your Account
        </p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={firstName}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Last Name" name="lastName" value={lastName} onChange={onChange} required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <select name="role" value={role} onChange={onChange}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
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
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={password2}
              onChange={onChange}
              minLength="6"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
