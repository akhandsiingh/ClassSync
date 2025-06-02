"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

const AttendanceByClass = () => {
  const { classId } = useParams()
  const [attendance, setAttendance] = useState([])
  const [classData, setClassData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceRes, classRes] = await Promise.all([
          axios.get(`/api/attendance/class/${classId}`),
          axios.get(`/api/classes/${classId}`),
        ])

        setAttendance(attendanceRes.data)
        setClassData(classRes.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load attendance")
        setLoading(false)
      }
    }

    fetchData()
  }, [classId])

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="attendance-by-class-container">
      <div className="attendance-header">
        <h1>
          Attendance for {classData?.name} - {classData?.section}
        </h1>
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

      {attendance.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Registration No.</th>
                <th>Subject</th>
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
                  <td>{record.student.registrationNumber}</td>
                  <td>{record.subject.name}</td>
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
        <p className="no-data">No attendance records found for this class.</p>
      )}
    </div>
  )
}

export default AttendanceByClass
