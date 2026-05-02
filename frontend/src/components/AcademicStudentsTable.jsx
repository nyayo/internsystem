export default function AcademicStudentsTable({ students }) {
  return (
  <div>
    <h3>Assigned Students</h3>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Programme</th>
            <th>Year</th>
            <th>Status</th>
            <th>Organization</th>
    <th>Progress</th>
    <th>Status</th>
          </tr>
        </thead>

        <tbody>
            <tbody>
  {students.map((student) => (
    <tr key={student.id}>
      <td>{student.firstName} {student.lastName}</td>
      <td>{student.programme}</td>
      <td>{student.year}</td>
      <td>{student.status}</td>
    </tr>
  ))}
</tbody>
        </tbody>
      </table>
    </div>
    
  );
  
}