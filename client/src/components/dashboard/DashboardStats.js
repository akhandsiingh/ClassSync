const DashboardStats = ({ stats }) => {
  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <h3>Students</h3>
        <p>{stats.totalStudents || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Classes</h3>
        <p>{stats.totalClasses || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Subjects</h3>
        <p>{stats.totalSubjects || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Today's Attendance</h3>
        <p>{stats.todayAttendance || 0}</p>
      </div>
    </div>
  )
}

export default DashboardStats
