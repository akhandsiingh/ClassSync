"use client"

import { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import AttendanceSummary from "../attendance/AttendanceSummary"
import MarksSummary from "../marks/MarksSummary"

const StudentDashboard = () => {
  const { user } = useContext(AuthContext)
  const [student, setStudent] = useState(null)
  const [recentMarks, setRecentMarks] = useState([])
  const [recentAttendance, setRecentAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student profile
        const studentRes = await axios.get("/api/students/profile/me")
        setStudent(studentRes.data)

        // Fetch recent marks
        const marksRes = await axios.get(`/api/marks/student/${studentRes.data._id}`)
        setRecentMarks(marksRes.data.slice(0, 5)) // Get last 5 marks

        // Fetch recent attendance
        const attendanceRes = await axios.get(`/api/attendance/student/${studentRes.data._id}`)
        setRecentAttendance(attendanceRes.data.slice(0, 10)) // Get last 10 attendance records

        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>
      <p className="welcome-message">Welcome to ClassSync, {user && user.firstName}!</p>

      {student && (
        <div className="student-info-card">
          <div className="student-details">
            <h3>
              {student.userId.firstName} {student.userId.lastName}
            </h3>
            <p>
              <strong>Registration Number:</strong> {student.registrationNumber}
            </p>
            <p>
              <strong>Class:</strong> {student.classId.name} - {student.classId.section}
            </p>
          </div>
          <div className="student-actions">
            <Link to="/profile" className="btn btn-primary">
              View Profile
            </Link>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Recent Marks</h3>
          {recentMarks.length > 0 ? <MarksSummary marks={recentMarks} /> : <p>No marks available yet.</p>}
          <Link to="/student/marks" className="btn btn-primary btn-sm">
            View All Marks
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Recent Attendance</h3>
          {recentAttendance.length > 0 ? (
            <AttendanceSummary attendance={recentAttendance} />
          ) : (
            <p>No attendance records available yet.</p>
          )}
          <Link to="/student/attendance" className="btn btn-primary btn-sm">
            View Full Attendance
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
