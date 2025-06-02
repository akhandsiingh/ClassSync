"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

const StudentDetail = () => {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`/api/students/${id}`)
        setStudent(res.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load student details")
        setLoading(false)
      }
    }

    fetchStudent()
  }, [id])

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  if (!student) {
    return <div>Student not found</div>
  }

  return (
    <div className="student-detail-container">
      <div className="student-detail-header">
        <h1>Student Details</h1>
        <div className="actions">
          <Link to={`/students/edit/${student._id}`} className="btn btn-warning">
            Edit Student
          </Link>
          <Link to="/students" className="btn btn-secondary">
            Back to Students
          </Link>
        </div>
      </div>

      <div className="student-detail-card">
        <div className="detail-section">
          <h3>Personal Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Name:</strong> {student.userId.firstName} {student.userId.lastName}
            </div>
            <div className="detail-item">
              <strong>Email:</strong> {student.userId.email}
            </div>
            <div className="detail-item">
              <strong>Registration Number:</strong> {student.registrationNumber}
            </div>
            <div className="detail-item">
              <strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}
            </div>
            <div className="detail-item">
              <strong>Gender:</strong> {student.gender}
            </div>
            <div className="detail-item">
              <strong>Blood Group:</strong> {student.bloodGroup || "Not specified"}
            </div>
            <div className="detail-item">
              <strong>Phone Number:</strong> {student.phoneNumber}
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Academic Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Class:</strong> {student.classId.name} - {student.classId.section}
            </div>
            <div className="detail-item">
              <strong>Admission Date:</strong> {new Date(student.admissionDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {student.address && (
          <div className="detail-section">
            <h3>Address</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <strong>Street:</strong> {student.address.street}
              </div>
              <div className="detail-item">
                <strong>City:</strong> {student.address.city}
              </div>
              <div className="detail-item">
                <strong>State:</strong> {student.address.state}
              </div>
              <div className="detail-item">
                <strong>Zip Code:</strong> {student.address.zipCode}
              </div>
              <div className="detail-item">
                <strong>Country:</strong> {student.address.country}
              </div>
            </div>
          </div>
        )}

        <div className="detail-section">
          <h3>Parent/Guardian Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Parent Name:</strong> {student.parentName || "Not specified"}
            </div>
            <div className="detail-item">
              <strong>Parent Contact:</strong> {student.parentContact || "Not specified"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDetail
