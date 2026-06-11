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
  { value: 'technical_skill', label: 'Technical Skill' },
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
