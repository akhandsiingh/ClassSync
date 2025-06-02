const AttendanceSummary = ({ attendance }) => {
  return (
    <div className="attendance-summary">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record._id} className={`status-${record.status}`}>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>{record.subject.name}</td>
              <td className="capitalize">{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AttendanceSummary
