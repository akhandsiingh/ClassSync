"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"

const TeacherSignup = () => {
  const [formData, setFormData] = useState({
    // User fields
    username: "",
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    // Teacher specific fields
    employeeId: "",
    qualification: "",
    specialization: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const onChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1]
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.password2) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post("/api/auth/teacher-signup", formData)

      if (response.status === 200) {
        navigate("/login", {
          state: { message: "Registration successful! Please login with your credentials." },
        })
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed")
    }

    setLoading(false)
  }

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h1 className="text-primary">Teacher Registration</h1>
        <p className="lead">
          <i className="fas fa-chalkboard-teacher"></i> Create Your Teacher Account
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit}>
          <h3>Personal Information</h3>

          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
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
                value={formData.password2}
                onChange={onChange}
                minLength="6"
                required
              />
            </div>
          </div>

          <h3>Professional Information</h3>

          <div className="form-group">
            <input
              type="text"
              placeholder="Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Qualification (e.g., M.Sc, B.Ed)"
              name="qualification"
              value={formData.qualification}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Specialization (e.g., Mathematics, Physics)"
              name="specialization"
              value={formData.specialization}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              placeholder="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={onChange}
              required
            />
          </div>

          <h3>Address (Optional)</h3>

          <div className="form-group">
            <input
              type="text"
              placeholder="Street Address"
              name="address.street"
              value={formData.address.street}
              onChange={onChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="City"
                name="address.city"
                value={formData.address.city}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="State"
                name="address.state"
                value={formData.address.state}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Zip Code"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Country"
                name="address.country"
                value={formData.address.country}
                onChange={onChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Creating Account..." : "Register as Teacher"}
          </button>
        </form>

        <p className="auth-links">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
        <p className="auth-links">
          Are you a student? <Link to="/student-signup">Student Registration</Link>
        </p>
      </div>
    </div>
  )
}

export default TeacherSignup
