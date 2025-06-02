"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Marks = () => {
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
    <div className="marks-container">
      <div className="marks-header">
        <h1>Marks Management</h1>
        <Link to="/marks/add" className="btn btn-primary">
          Add New Mark
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="marks-navigation">
        <div className="nav-section">
          <h3>View Marks by Class</h3>
          <div className="class-grid">
            {classes.map((cls) => (
              <Link key={cls._id} to={`/marks/class/${cls._id}`} className="nav-card">
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
          <h3>View Marks by Subject</h3>
          <div className="subject-grid">
            {subjects.map((subject) => (
              <Link key={subject._id} to={`/marks/subject/${subject._id}`} className="nav-card">
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

export default Marks
