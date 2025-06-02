"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

const SubjectDetail = () => {
  const { id } = useParams()
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await axios.get(`/api/subjects/${id}`)
        setSubject(res.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load subject details")
        setLoading(false)
      }
    }

    fetchSubject()
  }, [id])

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  if (!subject) {
    return <div>Subject not found</div>
  }

  return (
    <div className="subject-detail-container">
      <div className="subject-detail-header">
        <h1>Subject Details</h1>
        <div className="actions">
          <Link to={`/subjects/edit/${subject._id}`} className="btn btn-warning">
            Edit Subject
          </Link>
          <Link to="/subjects" className="btn btn-secondary">
            Back to Subjects
          </Link>
        </div>
      </div>

      <div className="subject-detail-card">
        <div className="detail-section">
          <h3>Subject Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Subject Code:</strong> {subject.code}
            </div>
            <div className="detail-item">
              <strong>Subject Name:</strong> {subject.name}
            </div>
            <div className="detail-item">
              <strong>Credits:</strong> {subject.credits}
            </div>
            <div className="detail-item">
              <strong>Teacher:</strong>{" "}
              {subject.teacher ? `${subject.teacher.firstName} ${subject.teacher.lastName}` : "Not assigned"}
            </div>
            <div className="detail-item">
              <strong>Description:</strong> {subject.description || "No description provided"}
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Classes ({subject.classes ? subject.classes.length : 0})</h3>
          {subject.classes && subject.classes.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Section</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subject.classes.map((cls) => (
                    <tr key={cls._id}>
                      <td>{cls.name}</td>
                      <td>{cls.section}</td>
                      <td>
                        <Link to={`/classes/${cls._id}`} className="btn btn-info btn-sm">
                          View Class
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>This subject is not assigned to any classes.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubjectDetail
