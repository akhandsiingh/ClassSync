"use client"

import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"

const StudentMarks = () => {
  const { user } = useContext(AuthContext)
  const [student, setStudent] = useState(null)
  const [marks, setMarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState({
    subject: "",
    examType: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student profile
        const studentRes = await axios.get("/api/students/profile/me")
        setStudent(studentRes.data)

        // Fetch marks
        const marksRes = await axios.get(`/api/marks/student/${studentRes.data._id}`)
        setMarks(marksRes.data)

        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load marks")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const { subject, examType } = filter

  const onChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
  }

  // Get unique subjects from marks
  const subjects = [...new Set(marks.map((mark) => mark.subject.name))]

  // Filter marks based on selected filters
  const filteredMarks = marks.filter((mark) => {
    return (subject === "" || mark.subject.name === subject) && (examType === "" || mark.examType === examType)
  })

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="marks-container">
      <h1>My Marks</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {student && (
        <div className="student-info">
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Registration Number:</strong> {student.registrationNumber}
          </p>
          <p>
            <strong>Class:</strong> {student.classId.name} - {student.classId.section}
          </p>
        </div>
      )}

      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="subject">Subject:</label>
          <select name="subject" value={subject} onChange={onChange}>
            <option value="">All Subjects</option>
            {subjects.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="examType">Exam Type:</label>
          <select name="examType" value={examType} onChange={onChange}>
            <option value="">All Types</option>
            <option value="quiz">Quiz</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="assignment">Assignment</option>
            <option value="project">Project</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {filteredMarks.length > 0 ? (
        <div className="marks-table-container">
          <table className="marks-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Exam Type</th>
                <th>Marks</th>
                <th>Total</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarks.map((mark) => (
                <tr key={mark._id}>
                  <td>{mark.subject.name}</td>
                  <td className="capitalize">{mark.examType}</td>
                  <td>{mark.marks}</td>
                  <td>{mark.totalMarks}</td>
                  <td>{mark.percentage.toFixed(2)}%</td>
                  <td>{mark.grade}</td>
                  <td>{new Date(mark.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No marks found for the selected filters.</p>
      )}
    </div>
  )
}

export default StudentMarks
