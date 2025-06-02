"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const ClassForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: "",
    section: "",
    academicYear: "",
    classTeacher: "",
  })

  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teachers
        const teachersRes = await axios.get("/api/teachers")
        setTeachers(teachersRes.data)

        // If editing, fetch class data
        if (isEdit) {
          const classRes = await axios.get(`/api/classes/${id}`)
          const classData = classRes.data
          setFormData({
            name: classData.name,
            section: classData.section,
            academicYear: classData.academicYear,
            classTeacher: classData.classTeacher ? classData.classTeacher._id : "",
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
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isEdit) {
        await axios.put(`/api/classes/${id}`, formData)
      } else {
        await axios.post("/api/classes", formData)
      }
      navigate("/classes")
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.msg || "Failed to save class")
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1>{isEdit ? "Edit Class" : "Add New Class"}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Class Name:</label>
          <input type="text" name="name" value={formData.name} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="section">Section:</label>
          <input type="text" name="section" value={formData.section} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="academicYear">Academic Year:</label>
          <input type="text" name="academicYear" value={formData.academicYear} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="classTeacher">Class Teacher:</label>
          <select name="classTeacher" value={formData.classTeacher} onChange={onChange}>
            <option value="">Select a teacher...</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.userId.firstName} {teacher.userId.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Class" : "Add Class"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/classes")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClassForm
