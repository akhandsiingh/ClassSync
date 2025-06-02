"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

const AttendanceBySubject = () => {
  const { subjectId } = useParams()
  const [attendance, setAttendance] = useState([])
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectRes] = await Promise.all([axios.get(`/api/subjects/${subjectId}`)])

        setSubject(subjectRes.data)
        // This is a placeholder - you'd need to implement the backend endpoint
        setAttendance([])
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load attendance")
        setLoading(false)
      }
    }

    fetchData()
  }, [subjectId])

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="attendance-by-subject-container">
      <div className="attendance-header">
        <h1>Attendance for {subject?.name}</h1>
        <div className="actions">
          <Link to="/attendance/add" className="btn btn-primary">
            Mark Attendance
          </Link>
          <Link to="/attendance" className="btn btn-secondary">
            Back to Attendance
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

      {attendance.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Class</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id} className={`status-${record.status}`}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    {record.student.userId.firstName} {record.student.userId.lastName}
                  </td>
                  <td>
                    {record.class.name} - {record.class.section}
                  </td>
                  <td className="capitalize">{record.status}</td>
                  <td>{record.remarks || "-"}</td>
                  <td>
                    <Link to={`/attendance/edit/${record._id}`} className="btn btn-warning btn-sm">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No attendance records found for this subject.</p>
      )}
    </div>
  )
}

export default AttendanceBySubject
