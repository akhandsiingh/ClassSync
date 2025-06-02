"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("/api/students")
        setStudents(res.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load students")
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`/api/students/${id}`)
        setStudents(students.filter((student) => student._id !== id))
      } catch (err) {
        console.error(err)
        setError("Failed to delete student")
      }
    }
  }

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="students-container">
      <div className="students-header">
        <h1>Students Management</h1>
        <Link to="/students/add" className="btn btn-primary">
          Add New Student
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {students.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Registration No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Class</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.registrationNumber}</td>
                  <td>
                    {student.userId.firstName} {student.userId.lastName}
                  </td>
                  <td>{student.userId.email}</td>
                  <td>
                    {student.classId.name} - {student.classId.section}
                  </td>
                  <td>{student.phoneNumber}</td>
                  <td>
                    <Link to={`/students/${student._id}`} className="btn btn-info btn-sm">
                      View
                    </Link>
                    <Link to={`/students/edit/${student._id}`} className="btn btn-warning btn-sm">
                      Edit
                    </Link>
                    <button onClick={() => deleteStudent(student._id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No students found.</p>
      )}
    </div>
  )
}

export default Students
