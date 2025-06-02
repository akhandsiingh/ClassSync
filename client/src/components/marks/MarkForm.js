"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const MarkForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    student: "",
    subject: "",
    class: "",
    examType: "",
    marks: "",
    totalMarks: "",
    remarks: "",
  })

  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, subjectsRes, classesRes] = await Promise.all([
          axios.get("/api/students"),
          axios.get("/api/subjects"),
          axios.get("/api/classes"),
        ])

        setStudents(studentsRes.data)
        setSubjects(subjectsRes.data)
        setClasses(classesRes.data)

        // If editing, fetch mark data
        if (isEdit) {
          const markRes = await axios.get(`/api/marks/${id}`)
          const mark = markRes.data
          setFormData({
            student: mark.student._id,
            subject: mark.subject._id,
            class: mark.class._id,
            examType: mark.examType,
            marks: mark.marks.toString(),
            totalMarks: mark.totalMarks.toString(),
            remarks: mark.remarks || "",
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
        marks: Number.parseInt(formData.marks),
        totalMarks: Number.parseInt(formData.totalMarks),
      }

      if (isEdit) {
        await axios.put(`/api/marks/${id}`, submitData)
      } else {
        await axios.post("/api/marks", submitData)
      }
      navigate("/marks")
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.msg || "Failed to save mark")
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1>{isEdit ? "Edit Mark" : "Add New Mark"}</h1>

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
          <label htmlFor="examType">Exam Type:</label>
          <select name="examType" value={formData.examType} onChange={onChange} required>
            <option value="">Select exam type...</option>
            <option value="quiz">Quiz</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="assignment">Assignment</option>
            <option value="project">Project</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="marks">Marks Obtained:</label>
          <input type="number" name="marks" value={formData.marks} onChange={onChange} min="0" required />
        </div>

        <div className="form-group">
          <label htmlFor="totalMarks">Total Marks:</label>
          <input type="number" name="totalMarks" value={formData.totalMarks} onChange={onChange} min="1" required />
        </div>

        <div className="form-group">
          <label htmlFor="remarks">Remarks:</label>
          <textarea name="remarks" value={formData.remarks} onChange={onChange} rows="3" />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Mark" : "Add Mark"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/marks")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default MarkForm
