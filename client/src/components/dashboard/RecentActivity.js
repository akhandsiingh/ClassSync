"use client"

import { useState, useEffect } from "react"

const RecentActivity = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // This would be replaced with an actual API call in a production app
        // For now, we'll use mock data
        const mockActivities = [
          { id: 1, type: "attendance", message: "Marked attendance for Class 10A", time: new Date() },
          { id: 2, type: "marks", message: "Added marks for Physics midterm", time: new Date(Date.now() - 3600000) },
          {
            id: 3,
            type: "student",
            message: "Updated student profile for John Doe",
            time: new Date(Date.now() - 7200000),
          },
        ]

        setActivities(mockActivities)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) {
    return <div className="loading">Loading recent activities...</div>
  }

  return (
    <div className="recent-activity-container">
      <h3>Recent Activity</h3>
      {activities.length > 0 ? (
        <ul className="activity-list">
          {activities.map((activity) => (
            <li key={activity.id} className={`activity-item ${activity.type}`}>
              <div className="activity-content">
                <p>{activity.message}</p>
                <span className="activity-time">
                  {new Date(activity.time).toLocaleTimeString()} - {new Date(activity.time).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activities</p>
      )}
    </div>
  )
}

export default RecentActivity
