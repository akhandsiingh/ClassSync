"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

const MarksByClass = () => {
  const { classId } = useParams()
  const [marks, setMarks] = useState([])
  const [classData, setClassData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marksRes, classRes] = await Promise.all([
          axios.get(`/api/marks/class/${classId}`),
          axios.get(`/api/classes/${classId}`),
        ])

        setMarks(marksRes.data)
        setClassData(classRes.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load marks")
        setLoading(false)
      }
    }

    fetchData()
  }, [classId])

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="marks-by-class-container">
      <div className="marks-header">
        <h1>
          Marks for {classData?.name} - {classData?.section}
        </h1>
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

      {marks.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Registration No.</th>
                <th>Subject</th>
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
                  <td>{mark.student.registrationNumber}</td>
                  <td>{mark.subject.name}</td>
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
        <p className="no-data">No marks found for this class.</p>
      )}
    </div>
  )
}

export default MarksByClass
