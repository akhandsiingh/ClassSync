"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const AttendanceForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    student: "",
    class: "",
    subject: "",
    date: new Date().toISOString().split("T")[0],
    status: "",
    remarks: "",
  })

  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, classesRes, subjectsRes] = await Promise.all([
          axios.get("/api/students"),
          axios.get("/api/classes"),
          axios.get("/api/subjects"),
        ])

        setStudents(studentsRes.data)
        setClasses(classesRes.data)
        setSubjects(subjectsRes.data)

        // If editing, fetch attendance data
        if (isEdit) {
          const attendanceRes = await axios.get(`/api/attendance/${id}`)
          const attendance = attendanceRes.data
          setFormData({
            student: attendance.student._id,
            class: attendance.class._id,
            subject: attendance.subject._id,
            date: new Date(attendance.date).toISOString().split("T")[0],
            status: attendance.status,
            remarks: attendance.remarks || "",
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
        await axios.put(`/api/attendance/${id}`, formData)
      } else {
        await axios.post("/api/attendance", formData)
      }
      navigate("/attendance")
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.msg || "Failed to save attendance")
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1>{isEdit ? "Edit Attendance" : "Mark Attendance"}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="student">Student:</label>
          <select name="student" value={formData.student} onChange={onChange} required>
            <option value="">Select a student...</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.userId.firstName} {student.userId.lastName} ({student.registrationNumber})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="class">Class:</label>
          <select name="class" value={formData.class} onChange={onChange} required>
            <option value="">Select a class...</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.section}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <select name="subject" value={formData.subject} onChange={onChange} required>
            <option value="">Select a subject...</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name} ({subject.code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input type="date" name="date" value={formData.date} onChange={onChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select name="status" value={formData.status} onChange={onChange} required>
            <option value="">Select status...</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="remarks">Remarks:</label>
          <textarea name="remarks" value={formData.remarks} onChange={onChange} rows="3" />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Attendance" : "Mark Attendance"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/attendance")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AttendanceForm
