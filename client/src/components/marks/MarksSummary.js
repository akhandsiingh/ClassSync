const MarksSummary = ({ marks }) => {
  return (
    <div className="marks-summary">
      <table className="marks-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Exam Type</th>
            <th>Marks</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((mark) => (
            <tr key={mark._id}>
              <td>{mark.subject.name}</td>
              <td className="capitalize">{mark.examType}</td>
              <td>
                {mark.marks}/{mark.totalMarks}
              </td>
              <td>{mark.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MarksSummary
