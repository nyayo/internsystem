// import {
//   formatDateRange as formatDateRangeValue,
//   formatDateValue,
// } from "../utils/dateUtils";
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

export const studentPlacement = {
  id: 1,
  status: 'active',
  organisationName: 'Stanbic Bank Uganda',
  organisationType: 'private',
  organisationDistrict: 'Kampala',
  organisationAddress: 'Plot 17 Hannington Road, Kampala',
  department: 'Information Technology',
  wpSupervisorName: 'Mr. Ssemakula John',
  wpSupervisorEmail: 'ssemakula@stanbic.co.ug',
  wpSupervisorPhone: '+256 700 123456',
  wpSupervisorTitle: 'IT Manager',
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
  startDate: '2026-02-03',
  endDate: '2026-05-02',
  intakeCohort: 'january',
  remunerationType: 'stipend',
  placementFee: null,
  requestLetter: '/placements/request_letters/sarah_nakamya_request.pdf',
  acceptanceLetter: '/placements/acceptance_letters/sarah_nakamya_acceptance.pdf',
  finalReport: null,
  finalReportAbstract: null,
  reportDeclaration: false,
  approvalDate: '2026-01-28T10:30:00Z',
  activatedAt: '2026-02-03T08:00:00Z',
  completedAt: null,
  createdAt: '2026-01-20T14:30:00Z',
  updatedAt: '2026-03-15T09:00:00Z',
};

export const studentWeeklyLogs = [
  {
    id: 1,
    weekNumber: 1,
    weekStartDate: '2026-02-03',
    weekEndDate: '2026-02-09',
    activitiesPerformed: 'Orientation and introduction to the IT department.',
    skillsGained: 'Understanding of enterprise IT infrastructure.',
    challengesFaced: 'Initial adjustment to corporate environment.',
    supervisorInteractions: 'Daily check-ins with Mr. Ssemakula.',
    studentRemarks: 'Exciting first week!',
    status: 'closed',
    workplaceComment: 'Sarah showed enthusiasm.',
    workplaceEndorsedAt: '2026-02-11T14:00:00Z',
    academicComment: 'Good start.',
    academicGrade: 85.00,
    academicAssessedAt: '2026-02-13T10:00:00Z',
    submittedAt: '2026-02-10T16:30:00Z',
    createdAt: '2026-02-03T09:00:00Z',
    updatedAt: '2026-02-13T10:00:00Z',
  },
];

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
