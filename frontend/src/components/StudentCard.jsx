import React from 'react';

const StudentCard = ({ student }) => {
  return (
    <div className="student-card">
      <h3>{student.firstName} {student.lastName}</h3>
      <p>Email: {student.email}</p>
      <p>Student Number: {student.studentNumber}</p>
      <p>Programme: {student.programme}</p>
      <p>Year: {student.yearOfStudy}</p>
      <p>University: {student.university}</p>
    </div>
  );
};

export default StudentCard;