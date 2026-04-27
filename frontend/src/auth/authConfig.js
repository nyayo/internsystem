export const ROLE_LABELS = {
  student: "Student",
  workplace_supervisor: "Workplace Supervisor",
  academic_supervisor: "Academic Supervisor",
  admin: "Admin",
};

export const LOGIN_ROLE_OPTIONS = [
  { value: "student", label: ROLE_LABELS.student },
  { value: "workplace_supervisor", label: ROLE_LABELS.workplace_supervisor },
  { value: "academic_supervisor", label: ROLE_LABELS.academic_supervisor },
  { value: "admin", label: ROLE_LABELS.admin },
];

export const SELF_REGISTRATION_ROLES = [
  "student",
  "workplace_supervisor",
  "academic_supervisor",
];

export const REGISTER_ROLE_OPTIONS = SELF_REGISTRATION_ROLES.map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

export const ROLE_HOME_PATHS = {
  student: "/student",
  workplace_supervisor: "/supervisor/workplace",
  academic_supervisor: "/supervisor/academic",
  admin: "/admin",
};

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer_not_say", label: "Prefer not to say" },
];

export const REGISTRATION_FIELDS_BY_ROLE = {
  student: [
    { name: "username", label: "Username", type: "text", placeholder: "Username" },
    { name: "first_name", label: "First name", type: "text", placeholder: "First name" },
    { name: "last_name", label: "Last name", type: "text", placeholder: "Last name" },
    { name: "email", label: "Email", type: "email", placeholder: "Email address" },
    { name: "phone_number", label: "Phone", type: "tel", placeholder: "Phone number" },
    { name: "student_number", label: "Student number", type: "text", placeholder: "e.g. 21/U/1245" },
    { name: "programme", label: "Programme", type: "text", placeholder: "e.g. BSc. Computer Science" },
    { name: "year_of_study", label: "Year of study", type: "number", placeholder: "e.g. 3", min: 1, max: 8 },
    { name: "university", label: "University", type: "text", placeholder: "University" },
    { name: "gender", label: "Gender", type: "select", options: GENDER_OPTIONS },
    { name: "district", label: "District", type: "text", placeholder: "District" },
  ],
  workplace_supervisor: [
    { name: "username", label: "Username", type: "text", placeholder: "Username" },
    { name: "first_name", label: "First name", type: "text", placeholder: "First name" },
    { name: "last_name", label: "Last name", type: "text", placeholder: "Last name" },
    { name: "email", label: "Email", type: "email", placeholder: "Email address" },
    { name: "phone_number", label: "Phone", type: "tel", placeholder: "Phone number" },
    { name: "organisation_name", label: "Organization", type: "text", placeholder: "Organization name" },
    { name: "job_title", label: "Job title", type: "text", placeholder: "Job title" },
    { name: "gender", label: "Gender", type: "select", options: GENDER_OPTIONS },
    { name: "district", label: "District", type: "text", placeholder: "District" },
  ],
  academic_supervisor: [
    { name: "username", label: "Username", type: "text", placeholder: "Username" },
    { name: "first_name", label: "First name", type: "text", placeholder: "First name" },
    { name: "last_name", label: "Last name", type: "text", placeholder: "Last name" },
    { name: "email", label: "Email", type: "email", placeholder: "Email address" },
    { name: "phone_number", label: "Phone", type: "tel", placeholder: "Phone number" },
    { name: "job_title", label: "Job title", type: "text", placeholder: "e.g. Senior Lecturer" },
    { name: "university", label: "University", type: "text", placeholder: "University" },
    { name: "gender", label: "Gender", type: "select", options: GENDER_OPTIONS },
    { name: "district", label: "District", type: "text", placeholder: "District" },
  ],
};

export const getRegistrationFieldsForRole = (role) =>
  REGISTRATION_FIELDS_BY_ROLE[role] ?? [];

export const getRequiredRegistrationFieldNames = (role) =>
  getRegistrationFieldsForRole(role).map((field) => field.name);

export const getRoleHomePath = (role) => ROLE_HOME_PATHS[role] ?? "/login";
