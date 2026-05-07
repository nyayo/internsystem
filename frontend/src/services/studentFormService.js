const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_PLACEMENT_FIELDS = {
  organisationName: "Organisation name is required",
  organisationType: "Organisation type is required",
  organisationDistrict: "District is required",
  department: "Department is required",
  wpSupervisorName: "Supervisor name is required",
  wpSupervisorEmail: "Supervisor email is required",
  wpSupervisorPhone: "Supervisor phone is required",
  startDate: "Start date is required",
  endDate: "End date is required",
};
const MIN_TEXT_RULES = [
  {
    field: "activitiesPerformed",
    minLength: 50,
    error: "Please provide at least 50 characters describing your activities",
  },
  {
    field: "skillsGained",
    minLength: 30,
    error: "Please provide at least 30 characters describing skills gained",
  },
  {
    field: "challengesFaced",
    minLength: 30,
    error: "Please provide at least 30 characters describing challenges",
  },
  // {
  //   field: "supervisorInteractions",
  //   minLength: 20,
  //   error: "Please describe your supervisor interactions",
  // },
];

function hasEnoughText(value, minLength) {
  return typeof value === "string" && value.trim().length >= minLength;
}

export function validatePlacementApplication(formData) {
  const errors = {};

  for (const [fieldName, message] of Object.entries(REQUIRED_PLACEMENT_FIELDS)) {
    if (!formData[fieldName]) {
      errors[fieldName] = message;
    }
  }

  if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
    errors.endDate = "End date must be after start date";
  }

  if (formData.wpSupervisorEmail && !EMAIL_PATTERN.test(formData.wpSupervisorEmail)) {
    errors.wpSupervisorEmail = "Invalid email format";
  }

  return errors;
}

export function validateWeeklyLogEntry(formData) {
  const errors = {};

  for (const rule of MIN_TEXT_RULES) {
    if (!hasEnoughText(formData[rule.field], rule.minLength)) {
      errors[rule.field] = rule.error;
    }
  }

  return errors;
}
