import {
  formatDateRange as formatDateRangeValue,
  formatDateValue,
} from "../utils/dateUtils";
import { loadJSON, removeStorageItem, saveJSON } from "../services/storageService";

// Student Dashboard Data - Mock data for the student portal

// Current logged-in student (would come from auth context in production)
export const currentStudent = {
  id: 1,
  firstName: 'Sarah',
  lastName: 'Nakamya',
  email: 'nakamya@student.muk.ac.ug',
  phone: '+256 700 111111',
  studentNumber: '21/U/1245',
  programme: 'BSc. Computer Science',
  yearOfStudy: 3,
  university: 'Makerere University',
  faculty: 'Computing & IT',
  department: 'Computer Science',
  gender: 'female',
  district: 'Kampala',
  accountStatus: 'active',
  dateJoined: '2024-01-15',
  profilePhoto: '/assets/images/profile-1.jpg',
};

// Student's current placement (if any)
// Set to null to show the "Apply Now" button, or use an object with status
// export const studentPlacement = null;

// Example placement data (uncomment to test active placement):
export const studentPlacement = {
  id: 1,
  status: 'active',
  organisationName: 'Stanbic Bank Uganda',
  organisationType: 'private',
  organisationDistrict: 'Kampala',
  organisationAddress: 'Plot 17 Hannington Road, Kampala',
  department: 'Information Technology',
  
  // Workplace supervisor contact
  wpSupervisorName: 'Mr. Ssemakula John',
  wpSupervisorEmail: 'ssemakula@stanbic.co.ug',
  wpSupervisorPhone: '+256 700 123456',
  wpSupervisorTitle: 'IT Manager',
  
  // Assigned supervisors
  workplaceSupervisor: {
    id: 1,
    name: 'Mr. Ssemakula John',
    email: 'ssemakula@stanbic.co.ug',
    phone: '+256 700 123456',
  },
  academicSupervisor: {
    id: 1,
    name: 'Dr. Muwanga Francis',
    email: 'muwanga@muk.ac.ug',
    phone: '+256 706 111222',
  },
  
  // Dates
  startDate: '2026-02-03',
  endDate: '2026-05-02',
  intakeCohort: 'january',
  
  // Remuneration
  remunerationType: 'stipend',
  placementFee: null,
  
  // Documents
  requestLetter: '/placements/request_letters/sarah_nakamya_request.pdf',
  acceptanceLetter: '/placements/acceptance_letters/sarah_nakamya_acceptance.pdf',
  finalReport: null,
  finalReportAbstract: null,
  reportDeclaration: false,
  
  // Workflow
  approvalDate: '2026-01-28T10:30:00Z',
  activatedAt: '2026-02-03T08:00:00Z',
  completedAt: null,
  
  // Audit
  createdAt: '2026-01-20T14:30:00Z',
  updatedAt: '2026-03-15T09:00:00Z',
};

// Weekly log status choices
export const weeklyLogStatusChoices = [
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'endorsed', label: 'Endorsed' },
  { value: 'resubmit', label: 'Resubmit' },
  { value: 'assessed', label: 'Assessed' },
  { value: 'closed', label: 'Closed' },
];

// Student's weekly logs
export const studentWeeklyLogs = [
  {
    id: 1,
    weekNumber: 1,
    weekStartDate: '2026-02-03',
    weekEndDate: '2026-02-09',
    activitiesPerformed: 'Orientation and introduction to the IT department. Met team members and received overview of systems used. Set up workstation and development environment.',
    skillsGained: 'Understanding of enterprise IT infrastructure, networking basics, team collaboration tools.',
    challengesFaced: 'Initial adjustment to corporate environment, learning internal communication protocols.',
    supervisorInteractions: 'Daily check-ins with Mr. Ssemakula, introduced to key team members.',
    studentRemarks: 'Exciting first week! Looking forward to contributing to actual projects.',
    status: 'closed',
    workplaceComment: 'Sarah showed enthusiasm and adapted quickly to the team environment.',
    workplaceEndorsedAt: '2026-02-11T14:00:00Z',
    academicComment: 'Good start. Continue documenting your learning experiences.',
    academicGrade: 85.00,
    academicAssessedAt: '2026-02-13T10:00:00Z',
    submittedAt: '2026-02-10T16:30:00Z',
    createdAt: '2026-02-03T09:00:00Z',
    updatedAt: '2026-02-13T10:00:00Z',
  },
  {
    id: 2,
    weekNumber: 2,
    weekStartDate: '2026-02-10',
    weekEndDate: '2026-02-16',
    activitiesPerformed: 'Started working on internal ticketing system improvements. Reviewed existing codebase and documentation. Attended team stand-up meetings.',
    skillsGained: 'React.js best practices, code review processes, Agile methodology.',
    challengesFaced: 'Understanding legacy code structure, complex business logic.',
    supervisorInteractions: 'Pair programming sessions with senior developer, code review feedback.',
    studentRemarks: 'Challenging but rewarding week. Learning a lot from code reviews.',
    status: 'closed',
    workplaceComment: 'Excellent progress on understanding the codebase.',
    workplaceEndorsedAt: '2026-02-18T11:00:00Z',
    academicComment: 'Good technical progress documented.',
    academicGrade: 88.00,
    academicAssessedAt: '2026-02-20T09:00:00Z',
    submittedAt: '2026-02-17T15:00:00Z',
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-20T09:00:00Z',
  },
  {
    id: 3,
    weekNumber: 3,
    weekStartDate: '2026-02-17',
    weekEndDate: '2026-02-23',
    activitiesPerformed: 'Implemented new features for the ticketing system dashboard. Created responsive UI components. Participated in sprint planning.',
    skillsGained: 'Advanced React patterns, responsive design, sprint planning.',
    challengesFaced: 'Cross-browser compatibility issues, tight deadlines.',
    supervisorInteractions: 'Weekly one-on-one with supervisor, demo to team.',
    studentRemarks: 'Delivered first feature! Great feedback from the team.',
    status: 'assessed',
    workplaceComment: 'Sarah delivered quality work on time. Great team player.',
    workplaceEndorsedAt: '2026-02-25T10:00:00Z',
    academicComment: 'Excellent practical application of skills.',
    academicGrade: 92.00,
    academicAssessedAt: '2026-02-27T14:00:00Z',
    submittedAt: '2026-02-24T17:00:00Z',
    createdAt: '2026-02-17T09:00:00Z',
    updatedAt: '2026-02-27T14:00:00Z',
  },
  {
    id: 4,
    weekNumber: 4,
    weekStartDate: '2026-02-24',
    weekEndDate: '2026-03-02',
    activitiesPerformed: 'Bug fixes and performance optimization. Code refactoring for better maintainability. Documentation updates.',
    skillsGained: 'Performance profiling, code optimization, technical writing.',
    challengesFaced: 'Debugging complex async issues, balancing speed vs. quality.',
    supervisorInteractions: 'Code review sessions, performance optimization guidance.',
    studentRemarks: 'Learning the importance of clean, maintainable code.',
    status: 'endorsed',
    workplaceComment: 'Good attention to code quality and documentation.',
    workplaceEndorsedAt: '2026-03-04T11:30:00Z',
    academicComment: null,
    academicGrade: null,
    academicAssessedAt: null,
    submittedAt: '2026-03-03T16:00:00Z',
    createdAt: '2026-02-24T09:00:00Z',
    updatedAt: '2026-03-04T11:30:00Z',
  },
  {
    id: 5,
    weekNumber: 5,
    weekStartDate: '2026-03-03',
    weekEndDate: '2026-03-09',
    activitiesPerformed: 'API integration work, connecting frontend to new backend services. Unit testing implementation.',
    skillsGained: 'REST API design, unit testing with Jest, error handling patterns.',
    challengesFaced: 'API response format inconsistencies, test coverage requirements.',
    supervisorInteractions: 'Backend team collaboration, testing workshop.',
    studentRemarks: 'Testing is crucial! Will prioritize it in future work.',
    status: 'under_review',
    workplaceComment: null,
    workplaceEndorsedAt: null,
    academicComment: null,
    academicGrade: null,
    academicAssessedAt: null,
    submittedAt: '2026-03-10T14:30:00Z',
    createdAt: '2026-03-03T09:00:00Z',
    updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 6,
    weekNumber: 6,
    weekStartDate: '2026-03-10',
    weekEndDate: '2026-03-16',
    activitiesPerformed: 'Working on mobile-responsive features. User experience improvements based on feedback.',
    skillsGained: 'Mobile-first design, UX principles, accessibility.',
    challengesFaced: 'Touch interactions, varying screen sizes.',
    supervisorInteractions: 'UX team collaboration, user feedback sessions.',
    studentRemarks: 'User feedback is invaluable for product improvement.',
    status: 'submitted',
    workplaceComment: null,
    workplaceEndorsedAt: null,
    academicComment: null,
    academicGrade: null,
    academicAssessedAt: null,
    submittedAt: '2026-03-17T16:00:00Z',
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-17T16:00:00Z',
  },
  {
    id: 7,
    weekNumber: 7,
    weekStartDate: '2026-03-17',
    weekEndDate: '2026-03-23',
    activitiesPerformed: 'Security audit assistance, implementing authentication improvements.',
    skillsGained: 'Security best practices, authentication flows, OWASP guidelines.',
    challengesFaced: 'Balancing security with user experience.',
    supervisorInteractions: 'Security team sessions, code security review.',
    studentRemarks: '',
    status: 'resubmit',
    workplaceComment: 'Please add more details about the specific security implementations.',
    workplaceEndorsedAt: null,
    academicComment: null,
    academicGrade: null,
    academicAssessedAt: null,
    submittedAt: '2026-03-24T15:00:00Z',
    createdAt: '2026-03-17T09:00:00Z',
    updatedAt: '2026-03-26T10:00:00Z',
  },
  {
    id: 8,
    weekNumber: 8,
    weekStartDate: '2026-03-24',
    weekEndDate: '2026-03-30',
    activitiesPerformed: 'Started working on data visualization components for reports dashboard.',
    skillsGained: 'Chart libraries, data visualization principles.',
    challengesFaced: 'Large dataset performance, choosing right chart types.',
    supervisorInteractions: 'Design review meetings.',
    studentRemarks: 'Work in progress - need to complete visualization section.',
    status: 'draft',
    workplaceComment: null,
    workplaceEndorsedAt: null,
    academicComment: null,
    academicGrade: null,
    academicAssessedAt: null,
    submittedAt: null,
    createdAt: '2026-03-24T09:00:00Z',
    updatedAt: '2026-03-28T14:00:00Z',
  },
];

// Helper functions
export const getWeeklyLogStatusLabel = (status) => {
  const choice = weeklyLogStatusChoices.find(c => c.value === status);
  return choice ? choice.label : status;
};

export const getWeeklyLogStatusClass = (status) => {
  const classes = {
    draft: 'muted',
    submitted: 'info',
    under_review: 'warning',
    endorsed: 'primary',
    resubmit: 'danger',
    assessed: 'success',
    closed: 'muted-outline',
  };
  return classes[status] || '';
};

export const calculateInternshipProgress = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  
  if (today < start) return 0;
  if (today > end) return 100;
  
  const totalDays = (end - start) / (1000 * 60 * 60 * 24);
  const elapsedDays = (today - start) / (1000 * 60 * 60 * 24);
  
  return Math.round((elapsedDays / totalDays) * 100);
};

export const getCurrentWeekNumber = (startDate) => {
  const start = new Date(startDate);
  const today = new Date();
  
  if (today < start) return 0;
  
  const daysDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return Math.floor(daysDiff / 7) + 1;
};

export const getTotalWeeks = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  return Math.ceil(daysDiff / 7);
};

export const formatDate = (dateString) => {
  return formatDateValue(dateString, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateRange = (startDate, endDate) => {
  return formatDateRangeValue(startDate, endDate);
};

// Draft persistence keys
export const DRAFT_KEYS = {
  placement: 'student_placement_draft',
  weeklyLog: 'student_weekly_log_draft',
};

// Get draft from localStorage
export const getDraft = (key) => {
  return loadJSON(key, null);
};

// Save draft to localStorage
export const saveDraft = (key, data) => {
  saveJSON(key, data);
};

// Clear draft from localStorage
export const clearDraft = (key) => {
  removeStorageItem(key);
};

// Student sidebar navigation links
export const studentNavLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'placement', label: 'My Placement', icon: 'work' },
  { id: 'logs', label: 'Weekly Logs', icon: 'edit_note' },
  { id: 'evaluations', label: 'Evaluations', icon: 'assessment' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];
