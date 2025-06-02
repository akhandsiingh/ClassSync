"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

const MarksBySubject = () => {
  const { subjectId } = useParams()
  const [marks, setMarks] = useState([])
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Note: This would need a backend endpoint for marks by subject
        // For now, we'll fetch all marks and filter by subject
        const [subjectRes] = await Promise.all([axios.get(`/api/subjects/${subjectId}`)])

        setSubject(subjectRes.data)
        // This is a placeholder - you'd need to implement the backend endpoint
        setMarks([])
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load marks")
        setLoading(false)
      }
    }

    fetchData()
  }, [subjectId])

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="marks-by-subject-container">
      <div className="marks-header">
        <h1>Marks for {subject?.name}</h1>
        <div className="actions">
          <Link to="/marks/add" className="btn btn-primary">
            Add New Mark
          </Link>
          <Link to="/marks" className="btn btn-secondary">
            Back to Marks
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="subject-info">
        <p>
          <strong>Subject Code:</strong> {subject?.code}
        </p>
        <p>
          <strong>Credits:</strong> {subject?.credits}
        </p>
        <p>
          <strong>Teacher:</strong>{" "}
          {subject?.teacher ? `${subject.teacher.firstName} ${subject.teacher.lastName}` : "Not assigned"}
        </p>
      </div>

      {marks.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Exam Type</th>
                <th>Marks</th>
                <th>Total</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark) => (
                <tr key={mark._id}>
                  <td>
                    {mark.student.userId.firstName} {mark.student.userId.lastName}
                  </td>
                  <td>
                    {mark.class.name} - {mark.class.section}
                  </td>
                  <td className="capitalize">{mark.examType}</td>
                  <td>{mark.marks}</td>
                  <td>{mark.totalMarks}</td>
                  <td>{mark.percentage.toFixed(2)}%</td>
                  <td>{mark.grade}</td>
                  <td>{new Date(mark.date).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/marks/edit/${mark._id}`} className="btn btn-warning btn-sm">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No marks found for this subject.</p>
      )}
    </div>
  )
}

export default MarksBySubject
