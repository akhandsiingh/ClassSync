"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

const ClassDetail = () => {
  const { id } = useParams()
  const [classData, setClassData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get(`/api/classes/${id}`)
        setClassData(res.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load class details")
        setLoading(false)
      }
    }

    fetchClass()
  }, [id])

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  if (!classData) {
    return <div>Class not found</div>
  }

  return (
    <div className="class-detail-container">
      <div className="class-detail-header">
        <h1>Class Details</h1>
        <div className="actions">
          <Link to={`/classes/edit/${classData._id}`} className="btn btn-warning">
            Edit Class
          </Link>
          <Link to="/classes" className="btn btn-secondary">
            Back to Classes
          </Link>
        </div>
      </div>

      <div className="class-detail-card">
        <div className="detail-section">
          <h3>Class Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Class Name:</strong> {classData.name}
            </div>
            <div className="detail-item">
              <strong>Section:</strong> {classData.section}
            </div>
            <div className="detail-item">
              <strong>Academic Year:</strong> {classData.academicYear}
            </div>
            <div className="detail-item">
              <strong>Class Teacher:</strong>{" "}
              {classData.classTeacher
                ? `${classData.classTeacher.firstName} ${classData.classTeacher.lastName}`
                : "Not assigned"}
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Students ({classData.students ? classData.students.length : 0})</h3>
          {classData.students && classData.students.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Registration No.</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classData.students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.registrationNumber}</td>
                      <td>
                        {student.userId.firstName} {student.userId.lastName}
                      </td>
                      <td>
                        <Link to={`/students/${student._id}`} className="btn btn-info btn-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No students enrolled in this class.</p>
          )}
        </div>

        <div className="detail-section">
          <h3>Subjects ({classData.subjects ? classData.subjects.length : 0})</h3>
          {classData.subjects && classData.subjects.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Credits</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classData.subjects.map((subject) => (
                    <tr key={subject._id}>
                      <td>{subject.code}</td>
                      <td>{subject.name}</td>
                      <td>{subject.credits}</td>
                      <td>
                        <Link to={`/subjects/${subject._id}`} className="btn btn-info btn-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No subjects assigned to this class.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClassDetail
