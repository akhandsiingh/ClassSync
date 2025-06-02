"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Classes = () => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/api/classes")
        setClasses(res.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load classes")
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  const deleteClass = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await axios.delete(`/api/classes/${id}`)
        setClasses(classes.filter((cls) => cls._id !== id))
      } catch (err) {
        console.error(err)
        setError("Failed to delete class")
      }
    }
  }

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="classes-container">
      <div className="classes-header">
        <h1>Classes Management</h1>
        <Link to="/classes/add" className="btn btn-primary">
          Add New Class
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {classes.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Section</th>
                <th>Academic Year</th>
                <th>Class Teacher</th>
                <th>Students Count</th>
                <th>Subjects Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls._id}>
                  <td>{cls.name}</td>
                  <td>{cls.section}</td>
                  <td>{cls.academicYear}</td>
                  <td>
                    {cls.classTeacher ? `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}` : "Not assigned"}
                  </td>
                  <td>{cls.students ? cls.students.length : 0}</td>
                  <td>{cls.subjects ? cls.subjects.length : 0}</td>
                  <td>
                    <Link to={`/classes/${cls._id}`} className="btn btn-info btn-sm">
                      View
                    </Link>
                    <Link to={`/classes/edit/${cls._id}`} className="btn btn-warning btn-sm">
                      Edit
                    </Link>
                    <button onClick={() => deleteClass(cls._id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No classes found.</p>
      )}
    </div>
  )
}

export default Classes
