"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const SubjectForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    credits: "",
    teacher: "",
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

        // If editing, fetch subject data
        if (isEdit) {
          const subjectRes = await axios.get(`/api/subjects/${id}`)
          const subject = subjectRes.data
          setFormData({
            name: subject.name,
            code: subject.code,
            description: subject.description || "",
            credits: subject.credits.toString(),
            teacher: subject.teacher ? subject.teacher._id : "",
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
      const submitData = {
        ...formData,
        credits: Number.parseInt(formData.credits),
      }

      if (isEdit) {
        await axios.put(`/api/subjects/${id}`, submitData)
      } else {
        await axios.post("/api/subjects", submitData)
      }
      navigate("/subjects")
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.msg || "Failed to save subject")
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1>{isEdit ? "Edit Subject" : "Add New Subject"}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Subject Name:</label>
          <input type="text" name="name" value={formData.name} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="code">Subject Code:</label>
          <input type="text" name="code" value={formData.code} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea name="description" value={formData.description} onChange={onChange} rows="4" />
        </div>

        <div className="form-group">
          <label htmlFor="credits">Credits:</label>
          <input type="number" name="credits" value={formData.credits} onChange={onChange} min="1" required />
        </div>

        <div className="form-group">
          <label htmlFor="teacher">Teacher:</label>
          <select name="teacher" value={formData.teacher} onChange={onChange}>
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
            {loading ? "Saving..." : isEdit ? "Update Subject" : "Add Subject"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/subjects")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SubjectForm
