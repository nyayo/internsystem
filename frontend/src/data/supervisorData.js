// Mock data for Workplace and Academic Supervisor Dashboards
// import { formatDateTimeValue, formatDateValue } from "../utils/dateUtils";

// Current logged-in workplace supervisor
export const currentWorkplaceSupervisor = {
  id: 1,
  firstName: 'James',
  lastName: 'Ssemakula',
  email: 'james.ssemakula@techcorp.ug',
  phone: '+256 772 123 456',
  role: 'workplace_supervisor',
  organization: 'TechCorp Uganda Ltd',
  department: 'Information Technology',
  position: 'IT Manager',
  profilePic: null,
};

// Current logged-in academic supervisor
export const currentAcademicSupervisor = {
  id: 2,
  firstName: 'Dr. Agnes',
  lastName: 'Nakayiza',
  email: 'agnes.nakayiza@mak.ac.ug',
  phone: '+256 701 234 567',
  role: 'academic_supervisor',
  department: 'Computer Science',
  title: 'Senior Lecturer',
  university: 'Makerere University',
  profilePic: null,
};

// Students assigned to workplace supervisor
export const workplaceAssignedStudents = [
  {
    id: 1,
    studentId: 'STU-2024-001',
    firstName: 'Sarah',
    lastName: 'Namukasa',
    email: 'sarah.namukasa@students.mak.ac.ug',
    programme: 'BSc Computer Science',
    year: 3,
    placementId: 1,
    startDate: '2026-02-03',
    endDate: '2026-04-25',
    status: 'active',
    totalWeeks: 12,
    completedWeeks: 6,
    pendingLogs: 1,
    profilePic: null,
  },
  {
    id: 2,
    studentId: 'STU-2024-002',
    firstName: 'John',
    lastName: 'Mukiibi',
    email: 'john.mukiibi@students.mak.ac.ug',
    programme: 'BSc Information Technology',
    year: 3,
    placementId: 2,
    startDate: '2026-02-10',
    endDate: '2026-05-01',
    status: 'active',
    totalWeeks: 12,
    completedWeeks: 5,
    pendingLogs: 0,
    profilePic: null,
  },
  {
    id: 3,
    studentId: 'STU-2024-003',
    firstName: 'Grace',
    lastName: 'Atim',
    email: 'grace.atim@students.mak.ac.ug',
    programme: 'BSc Software Engineering',
    year: 4,
    placementId: 3,
    startDate: '2026-01-20',
    endDate: '2026-04-11',
    status: 'active',
    totalWeeks: 12,
    completedWeeks: 8,
    pendingLogs: 2,
    profilePic: null,
  },
];

// Students assigned to academic supervisor
export const academicAssignedStudents = [
  {
    id: 1,
    studentId: 'STU-2024-001',
    firstName: 'Sarah',
    lastName: 'Namukasa',
    email: 'sarah.namukasa@students.mak.ac.ug',
    programme: 'BSc Computer Science',
    year: 3,
    placementId: 1,
    organization: 'TechCorp Uganda Ltd',
    workplaceSupervisor: 'James Ssemakula',
    startDate: '2026-02-03',
    endDate: '2026-04-25',
    status: 'active',
    totalWeeks: 12,
    completedWeeks: 6,
    averageGrade: 88.5,
    pendingAssessment: 1,
    profilePic: null,
  },
  {
    id: 4,
    studentId: 'STU-2024-004',
    firstName: 'Peter',
    lastName: 'Ochieng',
    email: 'peter.ochieng@students.mak.ac.ug',
    programme: 'BSc Computer Science',
    year: 3,
    placementId: 4,
    organization: 'DataSoft Solutions',
    workplaceSupervisor: 'Mary Tendo',
    startDate: '2026-02-17',
    endDate: '2026-05-08',
    status: 'active',
    totalWeeks: 12,
    completedWeeks: 4,
    averageGrade: 85.0,
    pendingAssessment: 0,
    profilePic: null,
  },
  {
    id: 5,
    studentId: 'STU-2024-005',
    firstName: 'Esther',
    lastName: 'Namutebi',
    email: 'esther.namutebi@students.mak.ac.ug',
    programme: 'BSc Information Systems',
    year: 4,
    placementId: 5,
    organization: 'Uganda Revenue Authority',
    workplaceSupervisor: 'Robert Kiiza',
    startDate: '2026-01-27',
    endDate: '2026-04-18',
    status: 'active',
    totalWeeks: 12,
    completedWeeks: 7,
    averageGrade: 91.2,
    pendingAssessment: 2,
    profilePic: null,
  },
];

// Weekly logs for workplace supervisor (need endorsement)
export const workplaceWeeklyLogs = [
  // Sarah's logs
  {
    id: 101,
    studentId: 1,
    studentName: 'Sarah Namukasa',
    programme: 'BSc Computer Science',
    weekNumber: 6,
    weekStartDate: '2026-03-09',
    weekEndDate: '2026-03-15',
    activitiesPerformed: 'Worked on API integration for the mobile app. Implemented authentication flow and tested endpoints.',
    skillsGained: 'REST API design, JWT authentication, Postman testing.',
    challengesFaced: 'Debugging CORS issues when connecting frontend to backend.',
    supervisorInteractions: 'Daily standups, code review session on Thursday.',
    studentRemarks: 'Great progress on the mobile app backend!',
    status: 'submitted',
    submittedAt: '2026-03-16T10:30:00Z',
    createdAt: '2026-03-09T09:00:00Z',
    updatedAt: '2026-03-16T10:30:00Z',
  },
  {
    id: 102,
    studentId: 1,
    studentName: 'Sarah Namukasa',
    programme: 'BSc Computer Science',
    weekNumber: 5,
    weekStartDate: '2026-03-02',
    weekEndDate: '2026-03-08',
    activitiesPerformed: 'Database schema design for inventory module. Created ER diagrams and implemented migrations.',
    skillsGained: 'PostgreSQL, database normalization, Django ORM.',
    challengesFaced: 'Balancing normalization with query performance.',
    supervisorInteractions: 'Design review meeting, approved schema.',
    studentRemarks: 'Learned a lot about production database design.',
    status: 'endorsed',
    workplaceComment: 'Excellent database design work. Schema is well-normalized.',
    workplaceEndorsedAt: '2026-03-10T14:00:00Z',
    submittedAt: '2026-03-09T09:30:00Z',
    createdAt: '2026-03-02T09:00:00Z',
    updatedAt: '2026-03-10T14:00:00Z',
  },
  // Grace's logs (2 pending)
  {
    id: 103,
    studentId: 3,
    studentName: 'Grace Atim',
    programme: 'BSc Software Engineering',
    weekNumber: 8,
    weekStartDate: '2026-03-09',
    weekEndDate: '2026-03-15',
    activitiesPerformed: 'Led code review sessions for junior developers. Refactored legacy authentication module.',
    skillsGained: 'Code review best practices, refactoring patterns, mentorship.',
    challengesFaced: 'Managing time between own work and helping others.',
    supervisorInteractions: 'Weekly one-on-one, discussed career growth.',
    studentRemarks: 'Enjoying the leadership opportunities.',
    status: 'submitted',
    submittedAt: '2026-03-16T11:00:00Z',
    createdAt: '2026-03-09T09:00:00Z',
    updatedAt: '2026-03-16T11:00:00Z',
  },
  {
    id: 104,
    studentId: 3,
    studentName: 'Grace Atim',
    programme: 'BSc Software Engineering',
    weekNumber: 7,
    weekStartDate: '2026-03-02',
    weekEndDate: '2026-03-08',
    activitiesPerformed: 'Implemented real-time notifications using WebSockets. Deployed feature to staging.',
    skillsGained: 'WebSocket protocol, Django Channels, async programming.',
    challengesFaced: 'Handling connection drops gracefully.',
    supervisorInteractions: 'Technical deep-dive session on async patterns.',
    studentRemarks: 'WebSockets are challenging but rewarding.',
    status: 'submitted',
    submittedAt: '2026-03-09T10:00:00Z',
    createdAt: '2026-03-02T09:00:00Z',
    updatedAt: '2026-03-09T10:00:00Z',
  },
  // John's endorsed log
  {
    id: 105,
    studentId: 2,
    studentName: 'John Mukiibi',
    programme: 'BSc Information Technology',
    weekNumber: 5,
    weekStartDate: '2026-03-09',
    weekEndDate: '2026-03-15',
    activitiesPerformed: 'Network troubleshooting and documentation. Updated network topology diagrams.',
    skillsGained: 'Network diagnostics, Cisco IOS, documentation practices.',
    challengesFaced: 'Identifying intermittent network issues.',
    supervisorInteractions: 'Shadowed senior network admin.',
    studentRemarks: 'Network admin work is very detail-oriented.',
    status: 'endorsed',
    workplaceComment: 'Good technical documentation. Keep improving troubleshooting skills.',
    workplaceEndorsedAt: '2026-03-17T09:00:00Z',
    submittedAt: '2026-03-16T14:00:00Z',
    createdAt: '2026-03-09T09:00:00Z',
    updatedAt: '2026-03-17T09:00:00Z',
  },
];

// Weekly logs for academic supervisor (need assessment)
export const academicWeeklyLogs = [
  // Sarah's endorsed log ready for assessment
  {
    id: 102,
    studentId: 1,
    studentName: 'Sarah Namukasa',
    programme: 'BSc Computer Science',
    organization: 'TechCorp Uganda Ltd',
    weekNumber: 5,
    weekStartDate: '2026-03-02',
    weekEndDate: '2026-03-08',
    activitiesPerformed: 'Database schema design for inventory module. Created ER diagrams and implemented migrations.',
    skillsGained: 'PostgreSQL, database normalization, Django ORM.',
    challengesFaced: 'Balancing normalization with query performance.',
    supervisorInteractions: 'Design review meeting, approved schema.',
    studentRemarks: 'Learned a lot about production database design.',
    status: 'endorsed',
    workplaceComment: 'Excellent database design work. Schema is well-normalized.',
    workplaceEndorsedBy: 'James Ssemakula',
    workplaceEndorsedAt: '2026-03-10T14:00:00Z',
    submittedAt: '2026-03-09T09:30:00Z',
    createdAt: '2026-03-02T09:00:00Z',
    updatedAt: '2026-03-10T14:00:00Z',
  },
  // Esther's logs (2 pending assessment)
  {
    id: 201,
    studentId: 5,
    studentName: 'Esther Namutebi',
    programme: 'BSc Information Systems',
    organization: 'Uganda Revenue Authority',
    weekNumber: 7,
    weekStartDate: '2026-03-09',
    weekEndDate: '2026-03-15',
    activitiesPerformed: 'Implemented tax calculation module. Wrote comprehensive unit tests.',
    skillsGained: 'Financial software development, unit testing, domain knowledge.',
    challengesFaced: 'Understanding complex tax regulations.',
    supervisorInteractions: 'Met with finance team for requirements clarification.',
    studentRemarks: 'Government software has unique challenges.',
    status: 'endorsed',
    workplaceComment: 'Excellent attention to detail on tax calculations. All tests passing.',
    workplaceEndorsedBy: 'Robert Kiiza',
    workplaceEndorsedAt: '2026-03-17T10:00:00Z',
    submittedAt: '2026-03-16T15:00:00Z',
    createdAt: '2026-03-09T09:00:00Z',
    updatedAt: '2026-03-17T10:00:00Z',
  },
  {
    id: 202,
    studentId: 5,
    studentName: 'Esther Namutebi',
    programme: 'BSc Information Systems',
    organization: 'Uganda Revenue Authority',
    weekNumber: 6,
    weekStartDate: '2026-03-02',
    weekEndDate: '2026-03-08',
    activitiesPerformed: 'Security audit of taxpayer portal. Documented vulnerabilities and fixes.',
    skillsGained: 'Security auditing, OWASP Top 10, penetration testing basics.',
    challengesFaced: 'Balancing security with user experience.',
    supervisorInteractions: 'Security team briefing.',
    studentRemarks: 'Security is crucial in government systems.',
    status: 'endorsed',
    workplaceComment: 'Thorough security analysis. Recommendations are being implemented.',
    workplaceEndorsedBy: 'Robert Kiiza',
    workplaceEndorsedAt: '2026-03-10T11:00:00Z',
    submittedAt: '2026-03-09T16:00:00Z',
    createdAt: '2026-03-02T09:00:00Z',
    updatedAt: '2026-03-10T11:00:00Z',
  },
  // Peter's assessed log
  {
    id: 203,
    studentId: 4,
    studentName: 'Peter Ochieng',
    programme: 'BSc Computer Science',
    organization: 'DataSoft Solutions',
    weekNumber: 4,
    weekStartDate: '2026-03-09',
    weekEndDate: '2026-03-15',
    activitiesPerformed: 'Built data visualization dashboard using React and D3.js.',
    skillsGained: 'D3.js, data visualization, React hooks.',
    challengesFaced: 'Performance optimization for large datasets.',
    supervisorInteractions: 'Demo to stakeholders.',
    studentRemarks: 'Dashboard received positive feedback!',
    status: 'assessed',
    workplaceComment: 'Impressive visualization work. Client was very satisfied.',
    workplaceEndorsedBy: 'Mary Tendo',
    workplaceEndorsedAt: '2026-03-17T13:00:00Z',
    academicComment: 'Excellent practical application of visualization concepts learned in class.',
    academicGrade: 90.0,
    academicAssessedAt: '2026-03-18T10:00:00Z',
    submittedAt: '2026-03-16T17:00:00Z',
    createdAt: '2026-03-09T09:00:00Z',
    updatedAt: '2026-03-18T10:00:00Z',
  },
];

// Evaluation criteria (from admin)
export const evaluationCriteria = [
  {
    id: 1,
    title: 'Punctuality & Attendance',
    description: 'Was the student present, on time, and reliable throughout the internship?',
    maxScore: 20,
    category: 'punctuality',
    categoryDisplay: 'Punctuality & Attendance',
    evaluatorRole: 'workplace_supervisor',
    isActive: true,
  },
  {
    id: 2,
    title: 'Professional Conduct',
    description: 'Did the student maintain professional behavior, dress code, and workplace etiquette?',
    maxScore: 20,
    category: 'professional_conduct',
    categoryDisplay: 'Professional Conduct',
    evaluatorRole: 'workplace_supervisor',
    isActive: true,
  },
  {
    id: 3,
    title: 'Technical Skills Applied',
    description: 'How well did the student apply technical knowledge from their degree programme?',
    maxScore: 20,
    category: 'technical_skills',
    categoryDisplay: 'Technical Skills',
    evaluatorRole: 'workplace_supervisor',
    isActive: true,
  },
  {
    id: 4,
    title: 'Communication Skills',
    description: 'Effectiveness in written and oral communication with team and stakeholders.',
    maxScore: 20,
    category: 'communication',
    categoryDisplay: 'Communication',
    evaluatorRole: 'both',
    isActive: true,
  },
  {
    id: 5,
    title: 'Initiative & Problem Solving',
    description: 'Did the student show self-motivation and ability to solve problems independently?',
    maxScore: 20,
    category: 'initiative',
    categoryDisplay: 'Initiative & Problem Solving',
    evaluatorRole: 'workplace_supervisor',
    isActive: true,
  },
  {
    id: 6,
    title: 'Teamwork & Collaboration',
    description: 'How well did the student work with others and contribute to team goals?',
    maxScore: 20,
    category: 'teamwork',
    categoryDisplay: 'Teamwork & Collaboration',
    evaluatorRole: 'both',
    isActive: true,
  },
];

// Evaluations for workplace supervisor
export const workplaceEvaluations = [
  // Sarah's midterm - in progress
  {
    id: 1,
    studentId: 1,
    studentName: 'Sarah Namukasa',
    programme: 'BSc Computer Science',
    placementId: 1,
    evaluationType: 'midterm',
    evaluationTypeDisplay: 'Midterm Evaluation',
    status: 'in_progress',
    dueDate: '2026-03-20',
    totalScore: null,
    overallRemarks: '',
    scores: [
      { criteriaId: 1, criteriaTitle: 'Punctuality & Attendance', maxScore: 20, scoreAwarded: 18, comment: 'Always on time' },
      { criteriaId: 2, criteriaTitle: 'Professional Conduct', maxScore: 20, scoreAwarded: 17, comment: '' },
      { criteriaId: 3, criteriaTitle: 'Technical Skills Applied', maxScore: 20, scoreAwarded: null, comment: '' },
      { criteriaId: 4, criteriaTitle: 'Communication Skills', maxScore: 20, scoreAwarded: null, comment: '' },
      { criteriaId: 5, criteriaTitle: 'Initiative & Problem Solving', maxScore: 20, scoreAwarded: null, comment: '' },
      { criteriaId: 6, criteriaTitle: 'Teamwork & Collaboration', maxScore: 20, scoreAwarded: null, comment: '' },
    ],
    createdAt: '2026-02-03T00:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
  // Sarah's final - not started
  {
    id: 2,
    studentId: 1,
    studentName: 'Sarah Namukasa',
    programme: 'BSc Computer Science',
    placementId: 1,
    evaluationType: 'final',
    evaluationTypeDisplay: 'Final Evaluation',
    status: 'not_started',
    dueDate: '2026-04-25',
    totalScore: null,
    overallRemarks: '',
    scores: [],
    createdAt: '2026-02-03T00:00:00Z',
    updatedAt: '2026-02-03T00:00:00Z',
  },
  // John's midterm - submitted (waiting acknowledgement)
  {
    id: 3,
    studentId: 2,
    studentName: 'John Mukiibi',
    programme: 'BSc Information Technology',
    placementId: 2,
    evaluationType: 'midterm',
    evaluationTypeDisplay: 'Midterm Evaluation',
    status: 'submitted',
    dueDate: '2026-03-27',
    totalScore: 82,
    overallRemarks: 'John has shown consistent improvement throughout the internship. Strong networking skills.',
    scores: [
      { criteriaId: 1, criteriaTitle: 'Punctuality & Attendance', maxScore: 20, scoreAwarded: 16, comment: 'Occasionally late on Mondays' },
      { criteriaId: 2, criteriaTitle: 'Professional Conduct', maxScore: 20, scoreAwarded: 18, comment: 'Very professional' },
      { criteriaId: 3, criteriaTitle: 'Technical Skills Applied', maxScore: 20, scoreAwarded: 14, comment: 'Good networking knowledge' },
      { criteriaId: 4, criteriaTitle: 'Communication Skills', maxScore: 20, scoreAwarded: 16, comment: 'Clear communicator' },
      { criteriaId: 5, criteriaTitle: 'Initiative & Problem Solving', maxScore: 20, scoreAwarded: 10, comment: 'Needs more initiative' },
      { criteriaId: 6, criteriaTitle: 'Teamwork & Collaboration', maxScore: 20, scoreAwarded: 8, comment: 'Works well with IT team' },
    ],
    submittedAt: '2026-03-15T16:00:00Z',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-03-15T16:00:00Z',
  },
  // Grace's midterm - acknowledged
  {
    id: 4,
    studentId: 3,
    studentName: 'Grace Atim',
    programme: 'BSc Software Engineering',
    placementId: 3,
    evaluationType: 'midterm',
    evaluationTypeDisplay: 'Midterm Evaluation',
    status: 'acknowledged',
    dueDate: '2026-03-01',
    totalScore: 94,
    overallRemarks: 'Exceptional intern. Grace has leadership potential and excellent technical skills.',
    scores: [
      { criteriaId: 1, criteriaTitle: 'Punctuality & Attendance', maxScore: 20, scoreAwarded: 19, comment: 'Never late, always prepared' },
      { criteriaId: 2, criteriaTitle: 'Professional Conduct', maxScore: 20, scoreAwarded: 18, comment: 'Excellent professionalism' },
      { criteriaId: 3, criteriaTitle: 'Technical Skills Applied', maxScore: 20, scoreAwarded: 19, comment: 'Outstanding coding skills' },
      { criteriaId: 4, criteriaTitle: 'Communication Skills', maxScore: 20, scoreAwarded: 16, comment: 'Could be more vocal in meetings' },
      { criteriaId: 5, criteriaTitle: 'Initiative & Problem Solving', maxScore: 20, scoreAwarded: 14, comment: 'Proactive problem solver' },
      { criteriaId: 6, criteriaTitle: 'Teamwork & Collaboration', maxScore: 20, scoreAwarded: 8, comment: 'Mentors junior team members' },
    ],
    submittedAt: '2026-02-28T14:00:00Z',
    acknowledgedBy: 'Dr. Agnes Nakayiza',
    acknowledgedAt: '2026-03-02T10:00:00Z',
    acknowledgementNotes: 'Excellent midterm performance. Continue the good work in the second half.',
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-03-02T10:00:00Z',
  },
  // Grace's final - not started
  {
    id: 5,
    studentId: 3,
    studentName: 'Grace Atim',
    programme: 'BSc Software Engineering',
    placementId: 3,
    evaluationType: 'final',
    evaluationTypeDisplay: 'Final Evaluation',
    status: 'not_started',
    dueDate: '2026-04-11',
    totalScore: null,
    overallRemarks: '',
    scores: [],
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
];

// Evaluations for academic supervisor (pending acknowledgement)
export const academicEvaluations = [
  // John's midterm - pending acknowledgement
  {
    id: 3,
    studentId: 2,
    studentName: 'John Mukiibi',
    programme: 'BSc Information Technology',
    organization: 'TechCorp Uganda Ltd',
    workplaceSupervisor: 'James Ssemakula',
    placementId: 2,
    evaluationType: 'midterm',
    evaluationTypeDisplay: 'Midterm Evaluation',
    status: 'submitted',
    submittedAt: '2026-03-15T16:00:00Z',
    totalScore: 82,
    maxPossibleScore: 120,
    overallRemarks: 'John has shown consistent improvement throughout the internship. Strong networking skills.',
    scores: [
      { criteriaId: 1, criteriaTitle: 'Punctuality & Attendance', maxScore: 20, scoreAwarded: 16, comment: 'Occasionally late on Mondays' },
      { criteriaId: 2, criteriaTitle: 'Professional Conduct', maxScore: 20, scoreAwarded: 18, comment: 'Very professional' },
      { criteriaId: 3, criteriaTitle: 'Technical Skills Applied', maxScore: 20, scoreAwarded: 14, comment: 'Good networking knowledge' },
      { criteriaId: 4, criteriaTitle: 'Communication Skills', maxScore: 20, scoreAwarded: 16, comment: 'Clear communicator' },
      { criteriaId: 5, criteriaTitle: 'Initiative & Problem Solving', maxScore: 20, scoreAwarded: 10, comment: 'Needs more initiative' },
      { criteriaId: 6, criteriaTitle: 'Teamwork & Collaboration', maxScore: 20, scoreAwarded: 8, comment: 'Works well with IT team' },
    ],
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-03-15T16:00:00Z',
  },
  // Grace's acknowledged evaluation
  {
    id: 4,
    studentId: 3,
    studentName: 'Grace Atim',
    programme: 'BSc Software Engineering',
    organization: 'TechCorp Uganda Ltd',
    workplaceSupervisor: 'James Ssemakula',
    placementId: 3,
    evaluationType: 'midterm',
    evaluationTypeDisplay: 'Midterm Evaluation',
    status: 'acknowledged',
    submittedAt: '2026-02-28T14:00:00Z',
    totalScore: 94,
    maxPossibleScore: 120,
    overallRemarks: 'Exceptional intern. Grace has leadership potential and excellent technical skills.',
    scores: [
      { criteriaId: 1, criteriaTitle: 'Punctuality & Attendance', maxScore: 20, scoreAwarded: 19, comment: 'Never late, always prepared' },
      { criteriaId: 2, criteriaTitle: 'Professional Conduct', maxScore: 20, scoreAwarded: 18, comment: 'Excellent professionalism' },
      { criteriaId: 3, criteriaTitle: 'Technical Skills Applied', maxScore: 20, scoreAwarded: 19, comment: 'Outstanding coding skills' },
      { criteriaId: 4, criteriaTitle: 'Communication Skills', maxScore: 20, scoreAwarded: 16, comment: 'Could be more vocal in meetings' },
      { criteriaId: 5, criteriaTitle: 'Initiative & Problem Solving', maxScore: 20, scoreAwarded: 14, comment: 'Proactive problem solver' },
      { criteriaId: 6, criteriaTitle: 'Teamwork & Collaboration', maxScore: 20, scoreAwarded: 8, comment: 'Mentors junior team members' },
    ],
    acknowledgedBy: 'Dr. Agnes Nakayiza',
    acknowledgedAt: '2026-03-02T10:00:00Z',
    acknowledgementNotes: 'Excellent midterm performance. Continue the good work in the second half.',
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-03-02T10:00:00Z',
  },
  // Peter's pending from different workplace supervisor
  {
    id: 6,
    studentId: 4,
    studentName: 'Peter Ochieng',
    programme: 'BSc Computer Science',
    organization: 'DataSoft Solutions',
    workplaceSupervisor: 'Mary Tendo',
    placementId: 4,
    evaluationType: 'midterm',
    evaluationTypeDisplay: 'Midterm Evaluation',
    status: 'submitted',
    submittedAt: '2026-03-18T11:00:00Z',
    totalScore: 88,
    maxPossibleScore: 120,
    overallRemarks: 'Peter has excellent data visualization skills. Very creative approach to problems.',
    scores: [
      { criteriaId: 1, criteriaTitle: 'Punctuality & Attendance', maxScore: 20, scoreAwarded: 17, comment: 'Generally punctual' },
      { criteriaId: 2, criteriaTitle: 'Professional Conduct', maxScore: 20, scoreAwarded: 16, comment: 'Professional demeanor' },
      { criteriaId: 3, criteriaTitle: 'Technical Skills Applied', maxScore: 20, scoreAwarded: 18, comment: 'Excellent D3.js skills' },
      { criteriaId: 4, criteriaTitle: 'Communication Skills', maxScore: 20, scoreAwarded: 15, comment: 'Good presentations' },
      { criteriaId: 5, criteriaTitle: 'Initiative & Problem Solving', maxScore: 20, scoreAwarded: 12, comment: 'Creative solutions' },
      { criteriaId: 6, criteriaTitle: 'Teamwork & Collaboration', maxScore: 20, scoreAwarded: 10, comment: 'Collaborative' },
    ],
    createdAt: '2026-02-17T00:00:00Z',
    updatedAt: '2026-03-18T11:00:00Z',
  },
];

// Helper functions
export const getWorkplaceStats = () => ({
  totalStudents: workplaceAssignedStudents.length,
  pendingLogs: workplaceWeeklyLogs.filter(l => l.status === 'submitted').length,
  endorsedLogs: workplaceWeeklyLogs.filter(l => l.status === 'endorsed').length,
  pendingEvaluations: workplaceEvaluations.filter(e => e.status === 'in_progress' || e.status === 'not_started').length,
  submittedEvaluations: workplaceEvaluations.filter(e => e.status === 'submitted').length,
  completedEvaluations: workplaceEvaluations.filter(e => e.status === 'acknowledged').length,
});

export const getAcademicStats = () => ({
  totalStudents: academicAssignedStudents.length,
  pendingAssessment: academicWeeklyLogs.filter(l => l.status === 'endorsed').length,
  assessedLogs: academicWeeklyLogs.filter(l => l.status === 'assessed' || l.status === 'closed').length,
  pendingAcknowledgement: academicEvaluations.filter(e => e.status === 'submitted').length,
  acknowledgedEvaluations: academicEvaluations.filter(e => e.status === 'acknowledged').length,
  averageGrade: academicAssignedStudents.reduce((sum, s) => sum + (s.averageGrade || 0), 0) / academicAssignedStudents.length,
});

// Get recent activity for dashboard
export const getWorkplaceRecentActivity = () => {
  const logs = workplaceWeeklyLogs
    .filter(l => l.status === 'submitted')
    .slice(0, 3)
    .map(l => ({
      type: 'log',
      id: l.id,
      title: `Week ${l.weekNumber} Log`,
      studentName: l.studentName,
      action: 'Needs Endorsement',
      date: l.submittedAt,
    }));

  const evals = workplaceEvaluations
    .filter(e => e.status === 'in_progress' || e.status === 'not_started')
    .slice(0, 2)
    .map(e => ({
      type: 'evaluation',
      id: e.id,
      title: e.evaluationTypeDisplay,
      studentName: e.studentName,
      action: e.status === 'in_progress' ? 'Continue Evaluation' : 'Start Evaluation',
      date: e.dueDate,
      isDue: true,
    }));

  return [...logs, ...evals].slice(0, 5);
};

export const getAcademicRecentActivity = () => {
  const logs = academicWeeklyLogs
    .filter(l => l.status === 'endorsed')
    .slice(0, 3)
    .map(l => ({
      type: 'log',
      id: l.id,
      title: `Week ${l.weekNumber} Log`,
      studentName: l.studentName,
      organization: l.organization,
      action: 'Needs Assessment',
      date: l.workplaceEndorsedAt,
    }));

  const evals = academicEvaluations
    .filter(e => e.status === 'submitted')
    .slice(0, 2)
    .map(e => ({
      type: 'evaluation',
      id: e.id,
      title: e.evaluationTypeDisplay,
      studentName: e.studentName,
      organization: e.organization,
      action: 'Needs Acknowledgement',
      date: e.submittedAt,
    }));

  return [...logs, ...evals].slice(0, 5);
};

// Log status display helpers
export const getLogStatusBadgeClass = (status) => {
  switch (status) {
    case 'submitted': return 'warning';
    case 'endorsed': return 'info';
    case 'assessed': return 'success';
    case 'closed': return 'secondary';
    case 'resubmit': return 'danger';
    default: return 'secondary';
  }
};

export const getEvaluationStatusBadgeClass = (status) => {
  switch (status) {
    case 'not_started': return 'secondary';
    case 'in_progress': return 'warning';
    case 'submitted': return 'info';
    case 'acknowledged': return 'success';
    default: return 'secondary';
  }
};

export const formatDate = (dateString) => {
  return formatDateValue(dateString, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  return formatDateTimeValue(dateString);
};
