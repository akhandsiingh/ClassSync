"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Attendance = () => {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, subjectsRes] = await Promise.all([axios.get("/api/classes"), axios.get("/api/subjects")])

        setClasses(classesRes.data)
        setSubjects(subjectsRes.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load data")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>Attendance Management</h1>
        <Link to="/attendance/add" className="btn btn-primary">
          Mark Attendance
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="attendance-navigation">
        <div className="nav-section">
          <h3>View Attendance by Class</h3>
          <div className="class-grid">
            {classes.map((cls) => (
              <Link key={cls._id} to={`/attendance/class/${cls._id}`} className="nav-card">
                <h4>
                  {cls.name} - {cls.section}
                </h4>
                <p>Academic Year: {cls.academicYear}</p>
                <p>Students: {cls.students ? cls.students.length : 0}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="nav-section">
          <h3>View Attendance by Subject</h3>
          <div className="subject-grid">
            {subjects.map((subject) => (
              <Link key={subject._id} to={`/attendance/subject/${subject._id}`} className="nav-card">
                <h4>{subject.name}</h4>
                <p>Code: {subject.code}</p>
                <p>Credits: {subject.credits}</p>
                <p>Teacher: {subject.teacher ? `${subject.teacher.firstName} ${subject.teacher.lastName}` : "N/A"}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Attendance
