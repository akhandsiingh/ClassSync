"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"

const StudentSignup = () => {
  const [formData, setFormData] = useState({
    // User fields
    username: "",
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    // Student specific fields
    registrationNumber: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    parentName: "",
    parentContact: "",
    bloodGroup: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })

  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }

    // Fetch available classes
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/api/classes/public")
        setClasses(res.data || [])
      } catch (err) {
        console.error("Failed to fetch classes")
        setClasses([]) // Set empty array as fallback
      }
    }
    fetchClasses()
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

    if (!selectedClass) {
      setError("Please select a class")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post("/api/auth/student-signup", {
        ...formData,
        classId: selectedClass,
      })

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
        <h1 className="text-primary">Student Registration</h1>
        <p className="lead">
          <i className="fas fa-user-graduate"></i> Create Your Student Account
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

          <h3>Academic Information</h3>

          <div className="form-group">
            <input
              type="text"
              placeholder="Registration Number"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="class">Select Class:</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} required>
              <option value="">Choose your class...</option>
              {classes && classes.length > 0 ? (
                classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} - {cls.section} ({cls.academicYear})
                  </option>
                ))
              ) : (
                <option disabled>Loading classes...</option>
              )}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth:</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender:</label>
              <select name="gender" value={formData.gender} onChange={onChange} required>
                <option value="">Select gender...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
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

          <div className="form-group">
            <select name="bloodGroup" value={formData.bloodGroup} onChange={onChange}>
              <option value="">Select blood group (optional)...</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <h3>Parent/Guardian Information</h3>

          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Parent/Guardian Name"
                name="parentName"
                value={formData.parentName}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                placeholder="Parent/Guardian Contact"
                name="parentContact"
                value={formData.parentContact}
                onChange={onChange}
              />
            </div>
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
            {loading ? "Creating Account..." : "Register as Student"}
          </button>
        </form>

        <p className="auth-links">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
        <p className="auth-links">
          Are you a teacher? <Link to="/teacher-signup">Teacher Registration</Link>
        </p>
      </div>
    </div>
  )
}

export default StudentSignup
