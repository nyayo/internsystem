export default function AcademicStudentsTable({ students }) {
    if (!students || students.length === 0) {
    return <p>No students assigned</p>;
  }

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
            
        
         {students.map((student) => {
             const progress = Math.round(
                 (student.completedWeeks / student.totalWeeks) * 100
            );
             return (
                
      

  
  

    <tr key={student.id}>
      <td>{student.firstName} {student.lastName}</td>
      <td>{student.programme}</td>
      <td>{student.year}</td>
      <td>{student.organization}</td>
      <td>{progress}%</td>
      <td>{student.status}</td>
      <td>
      <button onClick={() => onView?.(student)}>
        View
        </button>
    </td>
    </tr>
);
})}
</tbody>
</table>
</div>
    
  
    
  );
  
}