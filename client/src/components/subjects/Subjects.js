"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Subjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("/api/subjects")
        setSubjects(res.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load subjects")
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  const deleteSubject = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await axios.delete(`/api/subjects/${id}`)
        setSubjects(subjects.filter((subject) => subject._id !== id))
      } catch (err) {
        console.error(err)
        setError("Failed to delete subject")
      }
    }
  }

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="subjects-container">
      <div className="subjects-header">
        <h1>Subjects Management</h1>
        <Link to="/subjects/add" className="btn btn-primary">
          Add New Subject
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {subjects.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Credits</th>
                <th>Teacher</th>
                <th>Classes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject._id}>
                  <td>{subject.code}</td>
                  <td>{subject.name}</td>
                  <td>{subject.credits}</td>
                  <td>
                    {subject.teacher ? `${subject.teacher.firstName} ${subject.teacher.lastName}` : "Not assigned"}
                  </td>
                  <td>{subject.classes ? subject.classes.length : 0}</td>
                  <td>
                    <Link to={`/subjects/${subject._id}`} className="btn btn-info btn-sm">
                      View
                    </Link>
                    <Link to={`/subjects/edit/${subject._id}`} className="btn btn-warning btn-sm">
                      Edit
                    </Link>
                    <button onClick={() => deleteSubject(subject._id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No subjects found.</p>
      )}
    </div>
  )
}

export default Subjects
