import { formatDateValue } from "../utils/dateUtils";

// Dynamic data for the Internship Management System Dashboard

// User role choices
export const userRoles = [
  { value: 'student', label: 'Student' },
  { value: 'workplace_supervisor', label: 'Workplace Supervisor' },
  { value: 'academic_supervisor', label: 'Academic Supervisor' },
  { value: 'internship_administrator', label: 'Internship Administrator' },
];

export const genderChoices = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'prefer_not_say', label: 'Prefer not to say' },
];

export const accountStatusChoices = [
  { value: 'registered', label: 'Registered' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'deactivated', label: 'Deactivated' },
];

// Students data
export const initialStudents = [
  { id: 1, firstName: 'Sarah', lastName: 'Nakamya', email: 'nakamya@student.muk.ac.ug', phone: '+256 700 111111', studentNumber: '21/U/1245', programme: 'BSc. Computer Science', yearOfStudy: 3, university: 'Makerere University', faculty: 'Computing & IT', department: 'Computer Science', gender: 'female', district: 'Kampala', accountStatus: 'active', dateJoined: '2024-01-15' },
  { id: 2, firstName: 'James', lastName: 'Okello', email: 'okello@student.muk.ac.ug', phone: '+256 700 222222', studentNumber: '22/U/0892', programme: 'BBA Accounting', yearOfStudy: 2, university: 'Makerere University', faculty: 'Business', department: 'Accounting', gender: 'male', district: 'Gulu', accountStatus: 'active', dateJoined: '2024-02-20' },
  { id: 3, firstName: 'Grace', lastName: 'Auma', email: 'auma@student.muk.ac.ug', phone: '+256 700 333333', studentNumber: '21/U/2341', programme: 'BSc. Engineering', yearOfStudy: 3, university: 'Makerere University', faculty: 'Engineering', department: 'Civil Engineering', gender: 'female', district: 'Lira', accountStatus: 'active', dateJoined: '2024-01-10' },
  { id: 4, firstName: 'Peter', lastName: 'Mugisha', email: 'mugisha@student.muk.ac.ug', phone: '+256 700 444444', studentNumber: '20/U/3421', programme: 'BSc. Nursing', yearOfStudy: 4, university: 'Makerere University', faculty: 'Health Sciences', department: 'Nursing', gender: 'male', district: 'Mbarara', accountStatus: 'active', dateJoined: '2023-09-01' },
  { id: 5, firstName: 'Catherine', lastName: 'Nambi', email: 'nambi@student.muk.ac.ug', phone: '+256 700 555555', studentNumber: '21/U/4521', programme: 'BSc. Computer Science', yearOfStudy: 3, university: 'Makerere University', faculty: 'Computing & IT', department: 'Computer Science', gender: 'female', district: 'Jinja', accountStatus: 'active', dateJoined: '2024-01-20' },
  { id: 6, firstName: 'Samuel', lastName: 'Opio', email: 'opio@student.muk.ac.ug', phone: '+256 700 666666', studentNumber: '22/U/1876', programme: 'BBA Management', yearOfStudy: 2, university: 'Makerere University', faculty: 'Business', department: 'Management', gender: 'male', district: 'Soroti', accountStatus: 'active', dateJoined: '2024-03-05' },
  { id: 7, firstName: 'Joy', lastName: 'Nakato', email: 'nakato@student.muk.ac.ug', phone: '+256 700 777777', studentNumber: '21/U/5678', programme: 'BSc. Information Technology', yearOfStudy: 3, university: 'Makerere University', faculty: 'Computing & IT', department: 'Information Technology', gender: 'female', district: 'Kampala', accountStatus: 'active', dateJoined: '2024-01-18' },
  { id: 8, firstName: 'David', lastName: 'Kato', email: 'kato@student.muk.ac.ug', phone: '+256 700 888888', studentNumber: '20/U/6789', programme: 'BEng. Electrical Engineering', yearOfStudy: 4, university: 'Makerere University', faculty: 'Engineering', department: 'Electrical Engineering', gender: 'male', district: 'Entebbe', accountStatus: 'active', dateJoined: '2023-08-15' },
  { id: 9, firstName: 'Faith', lastName: 'Amongi', email: 'amongi@student.muk.ac.ug', phone: '+256 700 999999', studentNumber: '22/U/7890', programme: 'BSc. Statistics', yearOfStudy: 2, university: 'Makerere University', faculty: 'Science', department: 'Statistics', gender: 'female', district: 'Arua', accountStatus: 'registered', dateJoined: '2024-04-01' },
  { id: 10, firstName: 'Moses', lastName: 'Wasswa', email: 'wasswa@student.muk.ac.ug', phone: '+256 700 101010', studentNumber: '21/U/8901', programme: 'LLB Law', yearOfStudy: 3, university: 'Makerere University', faculty: 'Law', department: 'Law', gender: 'male', district: 'Masaka', accountStatus: 'active', dateJoined: '2024-02-01' },
];

// Supervisors data (expanded)
export const workplaceSupervisors = [
  { id: 1, firstName: 'John', lastName: 'Ssemakula', name: 'Mr. Ssemakula John', email: 'ssemakula@stanbic.co.ug', phone: '+256 700 123456', organisation: 'Stanbic Bank', jobTitle: 'IT Manager', gender: 'male', district: 'Kampala', accountStatus: 'active', dateJoined: '2023-06-01' },
  { id: 2, firstName: 'Rose', lastName: 'Nabukenya', name: 'Ms. Nabukenya Rose', email: 'nabukenya@kcca.go.ug', phone: '+256 701 234567', organisation: 'KCCA', jobTitle: 'Senior Engineer', gender: 'female', district: 'Kampala', accountStatus: 'active', dateJoined: '2023-07-15' },
  { id: 3, firstName: 'Patrick', lastName: 'Ochieng', name: 'Mr. Ochieng Patrick', email: 'ochieng@ura.go.ug', phone: '+256 702 345678', organisation: 'URA', jobTitle: 'Tax Officer', gender: 'male', district: 'Kampala', accountStatus: 'active', dateJoined: '2023-05-20' },
  { id: 4, firstName: 'Betty', lastName: 'Namukasa', name: 'Mrs. Namukasa Betty', email: 'namukasa@mtn.co.ug', phone: '+256 703 456789', organisation: 'MTN Uganda', jobTitle: 'HR Manager', gender: 'female', district: 'Kampala', accountStatus: 'active', dateJoined: '2023-08-01' },
  { id: 5, firstName: 'Robert', lastName: 'Kizza', name: 'Mr. Kizza Robert', email: 'kizza@nwsc.co.ug', phone: '+256 704 567890', organisation: 'NWSC', jobTitle: 'Operations Manager', gender: 'male', district: 'Kampala', accountStatus: 'active', dateJoined: '2023-09-10' },
  { id: 6, firstName: 'Agnes', lastName: 'Nabatanzi', name: 'Ms. Nabatanzi Agnes', email: 'nabatanzi@airtel.co.ug', phone: '+256 705 678901', organisation: 'Airtel Uganda', jobTitle: 'Network Engineer', gender: 'female', district: 'Kampala', accountStatus: 'active', dateJoined: '2023-10-05' },
];

export const academicSupervisors = [
  { id: 1, firstName: 'Francis', lastName: 'Muwanga', name: 'Dr. Muwanga Francis', email: 'muwanga@muk.ac.ug', phone: '+256 706 111222', department: 'Computer Science', faculty: 'Computing & IT', gender: 'male', district: 'Kampala', accountStatus: 'active', dateJoined: '2022-01-15' },
  { id: 2, firstName: 'Mary', lastName: 'Kasozi', name: 'Prof. Kasozi Mary', email: 'kasozi@muk.ac.ug', phone: '+256 706 222333', department: 'Business Administration', faculty: 'Business', gender: 'female', district: 'Kampala', accountStatus: 'active', dateJoined: '2021-06-01' },
  { id: 3, firstName: 'Paul', lastName: 'Byaruhanga', name: 'Dr. Byaruhanga Paul', email: 'byaruhanga@muk.ac.ug', phone: '+256 706 333444', department: 'Health Sciences', faculty: 'Medicine', gender: 'male', district: 'Kampala', accountStatus: 'active', dateJoined: '2022-03-10' },
  { id: 4, firstName: 'Alice', lastName: 'Nakabugo', name: 'Dr. Nakabugo Alice', email: 'nakabugo@muk.ac.ug', phone: '+256 706 444555', department: 'Engineering', faculty: 'Engineering', gender: 'female', district: 'Kampala', accountStatus: 'active', dateJoined: '2022-08-20' },
  { id: 5, firstName: 'Joseph', lastName: 'Ssentongo', name: 'Dr. Ssentongo Joseph', email: 'ssentongo@muk.ac.ug', phone: '+256 706 555666', department: 'Statistics', faculty: 'Science', gender: 'male', district: 'Kampala', accountStatus: 'active', dateJoined: '2023-01-05' },
];

// Choices from Django model
export const organisationTypes = [
  { value: 'private', label: 'Private Company' },
  { value: 'government', label: 'Government Ministry / Agency' },
  { value: 'ngo', label: 'NGO / Civil Society' },
  { value: 'parastatal', label: 'Parastatal' },
  { value: 'international', label: 'International Organisation' },
  { value: 'research', label: 'Research Institution' },
];

export const remunerationTypes = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'stipend', label: 'Stipend-based' },
  { value: 'paid', label: 'Paid (Salary)' },
];

export const intakeCohorts = [
  { value: 'january', label: 'January Intake' },
  { value: 'april', label: 'April Intake' },
  { value: 'june', label: 'June Intake' },
];

export const statusChoices = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'active', label: 'Active' },
  { value: 'withdrawn', label: 'Withdrawn' },
  { value: 'completed', label: 'Completed' },
];

// Full placement data based on InternshipPlacement model
export const initialPlacements = [
  {
    id: 1,
    student: { id: 1, name: 'Nakamya Sarah', regNumber: '21/U/1245', program: 'BSc. Computer Science', email: 'nakamya@student.muk.ac.ug' },
    organisationName: 'MTN Uganda',
    organisationType: 'private',
    organisationDistrict: 'Kampala',
    organisationAddress: 'Plot 69-71, Jinja Road, Kampala',
    department: 'IT Department',
    wpSupervisorName: 'Mr. Kizza Robert',
    wpSupervisorEmail: 'kizza.robert@mtn.co.ug',
    wpSupervisorPhone: '+256 777 123456',
    wpSupervisorTitle: 'Senior Software Engineer',
    startDate: '2026-05-01',
    endDate: '2026-07-31',
    intakeCohort: 'april',
    remunerationType: 'stipend',
    placementFee: null,
    requestLetter: 'request_letter_1.pdf',
    acceptanceLetter: 'acceptance_letter_1.pdf',
    status: 'pending_approval',
    workplaceSupervisor: null,
    academicSupervisor: null,
    rejectionReason: null,
    createdAt: '2026-03-28T10:30:00Z',
  },
  {
    id: 2,
    student: { id: 2, name: 'Okello James', regNumber: '22/U/0892', program: 'BBA Accounting', email: 'okello@student.muk.ac.ug' },
    organisationName: 'Bank of Uganda',
    organisationType: 'government',
    organisationDistrict: 'Kampala',
    organisationAddress: '37-43 Kampala Road, Kampala',
    department: 'Finance & Accounting',
    wpSupervisorName: 'Ms. Nansubuga Grace',
    wpSupervisorEmail: 'nansubuga@bou.or.ug',
    wpSupervisorPhone: '+256 700 987654',
    wpSupervisorTitle: 'Chief Accountant',
    startDate: '2026-05-15',
    endDate: '2026-08-15',
    intakeCohort: 'april',
    remunerationType: 'unpaid',
    placementFee: null,
    requestLetter: 'request_letter_2.pdf',
    acceptanceLetter: 'acceptance_letter_2.pdf',
    status: 'pending_approval',
    workplaceSupervisor: 2,
    academicSupervisor: 2,
    rejectionReason: null,
    createdAt: '2026-03-25T14:15:00Z',
  },
  {
    id: 3,
    student: { id: 3, name: 'Auma Grace', regNumber: '21/U/2341', program: 'BSc. Engineering', email: 'auma@student.muk.ac.ug' },
    organisationName: 'Uganda National Roads Authority',
    organisationType: 'parastatal',
    organisationDistrict: 'Kampala',
    organisationAddress: 'Plot 5, Lourdel Road, Nakasero',
    department: 'Civil Engineering',
    wpSupervisorName: 'Eng. Mukasa David',
    wpSupervisorEmail: 'mukasa@unra.go.ug',
    wpSupervisorPhone: '+256 752 456789',
    wpSupervisorTitle: 'Principal Engineer',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    intakeCohort: 'june',
    remunerationType: 'paid',
    placementFee: 150000,
    requestLetter: 'request_letter_3.pdf',
    acceptanceLetter: 'acceptance_letter_3.pdf',
    status: 'pending_approval',
    workplaceSupervisor: null,
    academicSupervisor: null,
    rejectionReason: null,
    createdAt: '2026-03-30T09:45:00Z',
  },
  {
    id: 4,
    student: { id: 4, name: 'Mugisha Peter', regNumber: '20/U/3421', program: 'BSc. Nursing', email: 'mugisha@student.muk.ac.ug' },
    organisationName: 'Mulago National Referral Hospital',
    organisationType: 'government',
    organisationDistrict: 'Kampala',
    organisationAddress: 'Mulago Hill, Kampala',
    department: 'Pediatrics Ward',
    wpSupervisorName: 'Sr. Nalwanga Florence',
    wpSupervisorEmail: 'nalwanga@mulago.go.ug',
    wpSupervisorPhone: '+256 701 111222',
    wpSupervisorTitle: 'Senior Nursing Officer',
    startDate: '2026-05-01',
    endDate: '2026-07-31',
    intakeCohort: 'april',
    remunerationType: 'unpaid',
    placementFee: null,
    requestLetter: 'request_letter_4.pdf',
    acceptanceLetter: 'acceptance_letter_4.pdf',
    status: 'pending_approval',
    workplaceSupervisor: 3,
    academicSupervisor: 3,
    rejectionReason: null,
    createdAt: '2026-03-20T11:00:00Z',
  },
  {
    id: 5,
    student: { id: 5, name: 'Nambi Catherine', regNumber: '21/U/4521', program: 'BSc. Computer Science', email: 'nambi@student.muk.ac.ug' },
    organisationName: 'Andela Uganda',
    organisationType: 'private',
    organisationDistrict: 'Kampala',
    organisationAddress: 'Design Hub, 5th Street Industrial Area',
    department: 'Software Development',
    wpSupervisorName: 'Mr. Ssekyondwa Ivan',
    wpSupervisorEmail: 'ivan@andela.com',
    wpSupervisorPhone: '+256 788 333444',
    wpSupervisorTitle: 'Tech Lead',
    startDate: '2026-04-15',
    endDate: '2026-07-15',
    intakeCohort: 'april',
    remunerationType: 'stipend',
    placementFee: null,
    requestLetter: 'request_letter_5.pdf',
    acceptanceLetter: 'acceptance_letter_5.pdf',
    status: 'pending_approval',
    workplaceSupervisor: null,
    academicSupervisor: 1,
    rejectionReason: null,
    createdAt: '2026-04-01T08:30:00Z',
  },
  {
    id: 6,
    student: { id: 6, name: 'Opio Samuel', regNumber: '22/U/1876', program: 'BBA Management', email: 'opio@student.muk.ac.ug' },
    organisationName: 'UNICEF Uganda',
    organisationType: 'international',
    organisationDistrict: 'Kampala',
    organisationAddress: 'Plot 9, George Street, Kampala',
    department: 'Programme Management',
    wpSupervisorName: 'Ms. Jennifer Ouma',
    wpSupervisorEmail: 'jouma@unicef.org',
    wpSupervisorPhone: '+256 799 555666',
    wpSupervisorTitle: 'Programme Officer',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    intakeCohort: 'june',
    remunerationType: 'paid',
    placementFee: null,
    requestLetter: 'request_letter_6.pdf',
    acceptanceLetter: 'acceptance_letter_6.pdf',
    status: 'pending_approval',
    workplaceSupervisor: null,
    academicSupervisor: null,
    rejectionReason: null,
    createdAt: '2026-04-02T16:20:00Z',
  },
  // Active internships
  {
    id: 7,
    student: { id: 7, name: 'Nakato Joy', regNumber: '21/U/5678', program: 'BSc. Information Technology', email: 'nakato@student.muk.ac.ug' },
    organisationName: 'Stanbic Bank Uganda',
    organisationType: 'private',
    organisationDistrict: 'Kampala',
    organisationAddress: 'Plot 17, Hannington Road, Kampala',
    department: 'Digital Banking',
    wpSupervisorName: 'Mr. Ssemakula John',
    wpSupervisorEmail: 'ssemakula@stanbic.co.ug',
    wpSupervisorPhone: '+256 700 123456',
    wpSupervisorTitle: 'IT Manager',
    startDate: '2026-02-01',
    endDate: '2026-04-30',
    intakeCohort: 'january',
    remunerationType: 'stipend',
    placementFee: null,
    requestLetter: 'request_letter_7.pdf',
    acceptanceLetter: 'acceptance_letter_7.pdf',
    status: 'active',
    workplaceSupervisor: 1,
    academicSupervisor: 1,
    rejectionReason: null,
    approvalDate: '2026-01-20T10:00:00Z',
    activatedAt: '2026-02-01T08:00:00Z',
    createdAt: '2026-01-10T09:30:00Z',
  },
  {
    id: 8,
    student: { id: 8, name: 'Kato David', regNumber: '20/U/6789', program: 'BEng. Electrical Engineering', email: 'kato@student.muk.ac.ug' },
    organisationName: 'KCCA',
    organisationType: 'government',
    organisationDistrict: 'Kampala',
    organisationAddress: 'City Hall, Kampala',
    department: 'Infrastructure Development',
    wpSupervisorName: 'Ms. Nabukenya Rose',
    wpSupervisorEmail: 'nabukenya@kcca.go.ug',
    wpSupervisorPhone: '+256 701 234567',
    wpSupervisorTitle: 'Senior Engineer',
    startDate: '2026-01-15',
    endDate: '2026-04-15',
    intakeCohort: 'january',
    remunerationType: 'unpaid',
    placementFee: null,
    requestLetter: 'request_letter_8.pdf',
    acceptanceLetter: 'acceptance_letter_8.pdf',
    status: 'active',
    workplaceSupervisor: 2,
    academicSupervisor: 4,
    rejectionReason: null,
    approvalDate: '2026-01-05T14:00:00Z',
    activatedAt: '2026-01-15T08:00:00Z',
    createdAt: '2025-12-20T11:00:00Z',
  },
  {
    id: 9,
    student: { id: 9, name: 'Amongi Faith', regNumber: '22/U/7890', program: 'BSc. Statistics', email: 'amongi@student.muk.ac.ug' },
    organisationName: 'URA',
    organisationType: 'government',
    organisationDistrict: 'Kampala',
    organisationAddress: 'Plot 56, Jinja Road, Kampala',
    department: 'Data Analytics',
    wpSupervisorName: 'Mr. Ochieng Patrick',
    wpSupervisorEmail: 'ochieng@ura.go.ug',
    wpSupervisorPhone: '+256 702 345678',
    wpSupervisorTitle: 'Tax Officer',
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    intakeCohort: 'january',
    remunerationType: 'stipend',
    placementFee: null,
    requestLetter: 'request_letter_9.pdf',
    acceptanceLetter: 'acceptance_letter_9.pdf',
    status: 'active',
    workplaceSupervisor: 3,
    academicSupervisor: 5,
    rejectionReason: null,
    approvalDate: '2026-02-15T09:00:00Z',
    activatedAt: '2026-03-01T08:00:00Z',
    createdAt: '2026-02-01T10:00:00Z',
  },
  // Completed internships
  {
    id: 10,
    student: { id: 10, name: 'Wasswa Moses', regNumber: '21/U/8901', program: 'LLB Law', email: 'wasswa@student.muk.ac.ug' },
    organisationName: 'Ministry of Justice',
    organisationType: 'government',
    organisationDistrict: 'Kampala',
    organisationAddress: 'Parliament Avenue, Kampala',
    department: 'Legal Services',
    wpSupervisorName: 'Mr. Kanyike Robert',
    wpSupervisorEmail: 'kanyike@justice.go.ug',
    wpSupervisorPhone: '+256 700 888999',
    wpSupervisorTitle: 'Senior State Attorney',
    startDate: '2025-09-01',
    endDate: '2025-11-30',
    intakeCohort: 'june',
    remunerationType: 'unpaid',
    placementFee: null,
    requestLetter: 'request_letter_10.pdf',
    acceptanceLetter: 'acceptance_letter_10.pdf',
    finalReport: 'final_report_10.pdf',
    status: 'completed',
    workplaceSupervisor: 4,
    academicSupervisor: 2,
    rejectionReason: null,
    approvalDate: '2025-08-15T10:00:00Z',
    activatedAt: '2025-09-01T08:00:00Z',
    completedAt: '2025-12-05T16:00:00Z',
    createdAt: '2025-08-01T09:00:00Z',
  },
];

// Legacy format for backwards compatibility
export const initialPendingApplications = initialPlacements
  .filter(p => p.status === 'pending_approval')
  .map(p => ({
    id: p.id,
    studentName: p.student.name,
    regNumber: p.student.regNumber,
    program: p.student.program,
    workplaceSupervisor: p.workplaceSupervisor ? workplaceSupervisors.find(s => s.id === p.workplaceSupervisor)?.name : '',
    academicSupervisor: p.academicSupervisor ? academicSupervisors.find(s => s.id === p.academicSupervisor)?.name : '',
    status: 'pending',
  }));

// Helper functions
export const getOrganisationTypeLabel = (value) => {
  return organisationTypes.find(t => t.value === value)?.label || value;
};

export const getRemunerationLabel = (value) => {
  return remunerationTypes.find(t => t.value === value)?.label || value;
};

export const getIntakeCohortLabel = (value) => {
  return intakeCohorts.find(c => c.value === value)?.label || value;
};

export const getStatusLabel = (value) => {
  return statusChoices.find(s => s.value === value)?.label || value;
};

export const formatDate = (dateString) => {
  return formatDateValue(dateString, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const calculateDurationWeeks = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor((end - start) / (7 * 24 * 60 * 60 * 1000));
};

export const initialEvaluationCriteria = [
  {
    id: 1,
    title: 'Professional Conduct',
    description: 'Ethics, dress code, workplace behavior',
    category: 'professional_conduct',
    categoryDisplay: 'Professional Conduct',
    maxScore: 20,
    evaluatorRole: 'both',
    evaluatorDisplay: 'Both Supervisors',
    isActive: true,
  },
  {
    id: 2,
    title: 'Technical Skills',
    description: 'Application of learned skills and knowledge',
    category: 'technical_skills',
    categoryDisplay: 'Technical Skills',
    maxScore: 25,
    evaluatorRole: 'workplace_supervisor',
    evaluatorDisplay: 'Workplace Supervisor',
    isActive: true,
  },
  {
    id: 3,
    title: 'Communication',
    description: 'Written and verbal communication skills',
    category: 'communication',
    categoryDisplay: 'Communication',
    maxScore: 15,
    evaluatorRole: 'both',
    evaluatorDisplay: 'Both Supervisors',
    isActive: true,
  },
  {
    id: 4,
    title: 'Initiative & Problem Solving',
    description: 'Creativity and proactive approach',
    category: 'initiative',
    categoryDisplay: 'Initiative',
    maxScore: 20,
    evaluatorRole: 'workplace_supervisor',
    evaluatorDisplay: 'Workplace Supervisor',
    isActive: true,
  },
  {
    id: 5,
    title: 'Teamwork & Collaboration',
    description: 'Working effectively with others',
    category: 'teamwork',
    categoryDisplay: 'Teamwork',
    maxScore: 10,
    evaluatorRole: 'both',
    evaluatorDisplay: 'Both Supervisors',
    isActive: true,
  },
  {
    id: 6,
    title: 'Punctuality & Attendance',
    description: 'Timeliness and presence at workplace',
    category: 'punctuality',
    categoryDisplay: 'Punctuality',
    maxScore: 10,
    evaluatorRole: 'workplace_supervisor',
    evaluatorDisplay: 'Workplace Supervisor',
    isActive: true,
  },
];

export const recentUpdates = [
  {
    id: 1,
    profileImage: 'profile-2.jpg',
    message: '<b>Nakato Joy</b> submitted a new internship application for Stanbic Bank.',
    time: '5 Minutes Ago',
  },
  {
    id: 2,
    profileImage: 'profile-3.jpg',
    message: "<b>Kato David</b>'s internship at KCCA was approved by the committee.",
    time: '15 Minutes Ago',
  },
  {
    id: 3,
    profileImage: 'profile-4.jpg',
    message: '<b>Amongi Faith</b> submitted her weekly progress report from URA.',
    time: '1 Hour Ago',
  },
];

export const dashboardStats = {
  pendingApplications: 12,
  activeInternships: 87,
  completedThisSemester: 156,
  workplaceSupervisorsCount: 28,
  academicSupervisorsCount: 15,
  activeCriteria: 6,
};

export const categoryOptions = [
  { value: 'professional_conduct', label: 'Professional Conduct' },
  { value: 'technical_skills', label: 'Technical Skills' },
  { value: 'communication', label: 'Communication' },
  { value: 'initiative', label: 'Initiative & Problem Solving' },
  { value: 'teamwork', label: 'Teamwork & Collaboration' },
  { value: 'punctuality', label: 'Punctuality & Attendance' },
];

export const evaluatorRoleOptions = [
  { value: 'workplace_supervisor', label: 'Workplace Supervisor' },
  { value: 'academic_supervisor', label: 'Academic Supervisor' },
  { value: 'both', label: 'Both Supervisors' },
];

// Helper to get category display name
export const getCategoryDisplay = (category) => {
  const option = categoryOptions.find(o => o.value === category);
  return option ? option.label : category;
};

// Helper to get evaluator role display name
export const getEvaluatorDisplay = (role) => {
  const option = evaluatorRoleOptions.find(o => o.value === role);
  return option ? option.label : role;
};
