"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const StudentForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    userId: "",
    registrationNumber: "",
    classId: "",
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

  const [users, setUsers] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users and classes
        const [usersRes, classesRes] = await Promise.all([axios.get("/api/users"), axios.get("/api/classes")])

        setUsers(usersRes.data.filter((user) => user.role === "student"))
        setClasses(classesRes.data)

        // If editing, fetch student data
        if (isEdit) {
          const studentRes = await axios.get(`/api/students/${id}`)
          const student = studentRes.data
          setFormData({
            userId: student.userId._id,
            registrationNumber: student.registrationNumber,
            classId: student.classId._id,
            dateOfBirth: new Date(student.dateOfBirth).toISOString().split("T")[0],
            gender: student.gender,
            phoneNumber: student.phoneNumber,
            parentName: student.parentName || "",
            parentContact: student.parentContact || "",
            bloodGroup: student.bloodGroup || "",
            address: student.address || {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
          })
        }
      } catch (err) {
        console.error(err)
        setError("Failed to load form data")
      }
    }

    fetchData()
  }, [id, isEdit])

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

    try {
      if (isEdit) {
        await axios.put(`/api/students/${id}`, formData)
      } else {
        await axios.post("/api/students", formData)
      }
      navigate("/students")
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.msg || "Failed to save student")
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1>{isEdit ? "Edit Student" : "Add New Student"}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="userId">Select User:</label>
          <select name="userId" value={formData.userId} onChange={onChange} required disabled={isEdit}>
            <option value="">Select a user...</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName} ({user.username})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="registrationNumber">Registration Number:</label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="classId">Class:</label>
          <select name="classId" value={formData.classId} onChange={onChange} required>
            <option value="">Select a class...</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.section}
              </option>
            ))}
          </select>
        </div>

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

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="parentName">Parent/Guardian Name:</label>
          <input type="text" name="parentName" value={formData.parentName} onChange={onChange} />
        </div>

        <div className="form-group">
          <label htmlFor="parentContact">Parent/Guardian Contact:</label>
          <input type="tel" name="parentContact" value={formData.parentContact} onChange={onChange} />
        </div>

        <div className="form-group">
          <label htmlFor="bloodGroup">Blood Group:</label>
          <select name="bloodGroup" value={formData.bloodGroup} onChange={onChange}>
            <option value="">Select blood group...</option>
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

        <h3>Address</h3>
        <div className="form-group">
          <label htmlFor="address.street">Street:</label>
          <input type="text" name="address.street" value={formData.address.street} onChange={onChange} />
        </div>

        <div className="form-group">
          <label htmlFor="address.city">City:</label>
          <input type="text" name="address.city" value={formData.address.city} onChange={onChange} />
        </div>

        <div className="form-group">
          <label htmlFor="address.state">State:</label>
          <input type="text" name="address.state" value={formData.address.state} onChange={onChange} />
        </div>

        <div className="form-group">
          <label htmlFor="address.zipCode">Zip Code:</label>
          <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={onChange} />
        </div>

        <div className="form-group">
          <label htmlFor="address.country">Country:</label>
          <input type="text" name="address.country" value={formData.address.country} onChange={onChange} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Student" : "Add Student"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/students")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default StudentForm
