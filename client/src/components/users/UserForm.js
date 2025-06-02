"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const UserForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "student",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isEdit) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`/api/users/${id}`)
          const user = res.data
          setFormData({
            username: user.username,
            email: user.email,
            password: "",
            confirmPassword: "",
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          })
        } catch (err) {
          console.error(err)
          setError("Failed to load user data")
        }
      }
      fetchUser()
    }
  }, [id, isEdit])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate passwords match for new users or when password is being changed
    if (!isEdit || formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setLoading(false)
        return
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        setLoading(false)
        return
      }
    }

    try {
      const submitData = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
      }

      // Only include password if it's provided
      if (formData.password) {
        submitData.password = formData.password
      }

      if (isEdit) {
        await axios.put(`/api/users/${id}`, submitData)
      } else {
        await axios.post("/api/users", submitData)
      }
      navigate("/users")
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.msg || "Failed to save user")
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1>{isEdit ? "Edit User" : "Add New User"}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" value={formData.username} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select name="role" value={formData.role} onChange={onChange} required>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="password">{isEdit ? "New Password (leave blank to keep current):" : "Password:"}:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required={!isEdit}
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            required={!isEdit || formData.password}
            minLength="6"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update User" : "Create User"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/users")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserForm
