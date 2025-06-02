"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"

const StudentProfile = () => {
  const { user } = useContext(AuthContext)
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/students/profile/me")
        setStudent(res.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load profile")
        setLoading(false)
      }
    }

    if (user && user.role === "student") {
      fetchProfile()
    }
  }, [user])

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  if (!student) {
    return <div>Student profile not found</div>
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <div className="profile-card">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="profile-details">
            <p>
              <strong>Name:</strong> {student.userId.firstName} {student.userId.lastName}
            </p>
            <p>
              <strong>Email:</strong> {student.userId.email}
            </p>
            <p>
              <strong>Registration Number:</strong> {student.registrationNumber}
            </p>
            <p>
              <strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}
            </p>
            <p>
              <strong>Gender:</strong> {student.gender}
            </p>
            <p>
              <strong>Blood Group:</strong> {student.bloodGroup || "Not specified"}
            </p>
            <p>
              <strong>Phone Number:</strong> {student.phoneNumber}
            </p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Academic Information</h3>
          <div className="profile-details">
            <p>
              <strong>Class:</strong> {student.classId.name} - {student.classId.section}
            </p>
            <p>
              <strong>Admission Date:</strong> {new Date(student.admissionDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {student.address && (
          <div className="profile-section">
            <h3>Address</h3>
            <div className="profile-details">
              <p>
                <strong>Street:</strong> {student.address.street}
              </p>
              <p>
                <strong>City:</strong> {student.address.city}
              </p>
              <p>
                <strong>State:</strong> {student.address.state}
              </p>
              <p>
                <strong>Zip Code:</strong> {student.address.zipCode}
              </p>
              <p>
                <strong>Country:</strong> {student.address.country}
              </p>
            </div>
          </div>
        )}

        <div className="profile-section">
          <h3>Parent/Guardian Information</h3>
          <div className="profile-details">
            <p>
              <strong>Parent Name:</strong> {student.parentName || "Not specified"}
            </p>
            <p>
              <strong>Parent Contact:</strong> {student.parentContact || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
