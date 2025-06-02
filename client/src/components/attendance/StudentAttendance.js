"use client"

import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"

const StudentAttendance = () => {
  const { user } = useContext(AuthContext)
  const [student, setStudent] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState({
    subject: "",
    status: "",
    month: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student profile
        const studentRes = await axios.get("/api/students/profile/me")
        setStudent(studentRes.data)

        // Fetch attendance
        const attendanceRes = await axios.get(`/api/attendance/student/${studentRes.data._id}`)
        setAttendance(attendanceRes.data)

        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load attendance")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const { subject, status, month } = filter

  const onChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value })
  }

  // Get unique subjects from attendance
  const subjects = [...new Set(attendance.map((record) => record.subject.name))]

  // Get unique months from attendance
  const months = [
    ...new Set(
      attendance.map((record) => {
        const date = new Date(record.date)
        return `${date.getMonth() + 1}-${date.getFullYear()}`
      }),
    ),
  ]

  // Filter attendance based on selected filters
  const filteredAttendance = attendance.filter((record) => {
    const recordMonth = `${new Date(record.date).getMonth() + 1}-${new Date(record.date).getFullYear()}`

    return (
      (subject === "" || record.subject.name === subject) &&
      (status === "" || record.status === status) &&
      (month === "" || recordMonth === month)
    )
  })

  // Calculate attendance statistics
  const calculateStats = () => {
    if (attendance.length === 0) return { present: 0, absent: 0, late: 0, excused: 0, total: 0 }

    const stats = {
      present: attendance.filter((record) => record.status === "present").length,
      absent: attendance.filter((record) => record.status === "absent").length,
      late: attendance.filter((record) => record.status === "late").length,
      excused: attendance.filter((record) => record.status === "excused").length,
    }

    stats.total = stats.present + stats.absent + stats.late + stats.excused

    return stats
  }

  const stats = calculateStats()

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="attendance-container">
      <h1>My Attendance</h1>

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

      <div className="attendance-stats">
        <div className="stat-card">
          <h3>Present</h3>
          <p>{stats.present}</p>
          <p className="percentage">{stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(2) : 0}%</p>
        </div>
        <div className="stat-card">
          <h3>Absent</h3>
          <p>{stats.absent}</p>
          <p className="percentage">{stats.total > 0 ? ((stats.absent / stats.total) * 100).toFixed(2) : 0}%</p>
        </div>
        <div className="stat-card">
          <h3>Late</h3>
          <p>{stats.late}</p>
          <p className="percentage">{stats.total > 0 ? ((stats.late / stats.total) * 100).toFixed(2) : 0}%</p>
        </div>
        <div className="stat-card">
          <h3>Excused</h3>
          <p>{stats.excused}</p>
          <p className="percentage">{stats.total > 0 ? ((stats.excused / stats.total) * 100).toFixed(2) : 0}%</p>
        </div>
      </div>

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
          <label htmlFor="status">Status:</label>
          <select name="status" value={status} onChange={onChange}>
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="month">Month:</label>
          <select name="month" value={month} onChange={onChange}>
            <option value="">All Months</option>
            {months.map((m, index) => {
              const [monthNum, year] = m.split("-")
              const monthName = new Date(year, monthNum - 1).toLocaleString("default", { month: "long" })
              return (
                <option key={index} value={m}>
                  {monthName} {year}
                </option>
              )
            })}
          </select>
        </div>
      </div>

      {filteredAttendance.length > 0 ? (
        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr key={record._id} className={`status-${record.status}`}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.subject.name}</td>
                  <td className="capitalize">{record.status}</td>
                  <td>{record.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No attendance records found for the selected filters.</p>
      )}
    </div>
  )
}

export default StudentAttendance
