"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users")
        setUsers(res.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load users")
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/users/${id}`)
        setUsers(users.filter((user) => user._id !== id))
      } catch (err) {
        console.error(err)
        setError("Failed to delete user")
      }
    }
  }

  if (loading) {
    return <div className="loader">Loading...</div>
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>User Management</h1>
        <Link to="/users/add" className="btn btn-primary">
          Add New User
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {users.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/users/edit/${user._id}`} className="btn btn-warning btn-sm">
                      Edit
                    </Link>
                    <button onClick={() => deleteUser(user._id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No users found.</p>
      )}
    </div>
  )
}

export default Users
