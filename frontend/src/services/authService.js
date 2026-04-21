import {
  LOGIN_ROLE_OPTIONS,
  SELF_REGISTRATION_ROLES,
  getRegistrationFieldsForRole,
} from "../auth/authConfig";
import { loadJSON, removeStorageItem, saveJSON } from "./storageService";

export const AUTH_USERS_KEY = "internship_auth_users";
export const AUTH_SESSION_KEY = "internship_auth_session";

const DEMO_ADMIN_USER = {
  id: 9000,
  firstName: "System",
  lastName: "Admin",
  email: "admin@internship.local",
  role: "admin",
  password: "admin123",
  accountStatus: "active",
};

const cleanString = (value) => `${value ?? ""}`.trim();
const cleanEmail = (value) => cleanString(value).toLowerCase();

export function createDefaultAuthUsers({
  currentStudent,
  currentWorkplaceSupervisor,
  currentAcademicSupervisor,
}) {
  return [
    {
      id: currentStudent.id,
      firstName: currentStudent.firstName,
      lastName: currentStudent.lastName,
      email: currentStudent.email,
      phone: currentStudent.phone,
      studentNumber: currentStudent.studentNumber,
      programme: currentStudent.programme,
      yearOfStudy: currentStudent.yearOfStudy,
      university: currentStudent.university,
      faculty: currentStudent.faculty,
      department: currentStudent.department,
      gender: currentStudent.gender,
      district: currentStudent.district,
      role: "student",
      password: "password123",
      accountStatus: currentStudent.accountStatus ?? "active",
    },
    {
      id: currentWorkplaceSupervisor.id,
      firstName: currentWorkplaceSupervisor.firstName,
      lastName: currentWorkplaceSupervisor.lastName,
      email: currentWorkplaceSupervisor.email,
      phone: currentWorkplaceSupervisor.phone,
      organization: currentWorkplaceSupervisor.organization,
      department: currentWorkplaceSupervisor.department,
      position: currentWorkplaceSupervisor.position,
      role: "workplace_supervisor",
      password: "password123",
      accountStatus: "active",
    },
    {
      id: currentAcademicSupervisor.id,
      firstName: currentAcademicSupervisor.firstName,
      lastName: currentAcademicSupervisor.lastName,
      email: currentAcademicSupervisor.email,
      phone: currentAcademicSupervisor.phone,
      department: currentAcademicSupervisor.department,
      faculty: currentAcademicSupervisor.faculty ?? "Not specified",
      title: currentAcademicSupervisor.title,
      university: currentAcademicSupervisor.university,
      role: "academic_supervisor",
      password: "password123",
      accountStatus: "active",
    },
    DEMO_ADMIN_USER,
  ];
}

export function toSessionUser(rawUser) {
  const { password: _password, ...safeUser } = rawUser;
  return safeUser;
}

export function loadRegisteredUsers(defaultUsers) {
  const storedUsers = loadJSON(AUTH_USERS_KEY, []);
  if (!Array.isArray(storedUsers) || storedUsers.length === 0) {
    return defaultUsers;
  }
  return storedUsers;
}

export function loadSessionUser() {
  return loadJSON(AUTH_SESSION_KEY, null);
}

export function saveRegisteredUsers(users) {
  saveJSON(AUTH_USERS_KEY, users);
}

export function saveSessionUser(user) {
  if (!user) {
    removeStorageItem(AUTH_SESSION_KEY);
    return;
  }
  saveJSON(AUTH_SESSION_KEY, user);
}

export function createUserFromRegistration(registrationData, registeredUsers) {
  const role = cleanString(registrationData.role);
  if (!SELF_REGISTRATION_ROLES.includes(role)) {
    throw new Error("This role cannot self-register.");
  }

  const roleFields = getRegistrationFieldsForRole(role);
  const roleProfile = {};

  for (const field of roleFields) {
    const fieldValue = cleanString(registrationData[field.name]);
    if (!fieldValue) {
      throw new Error("Please fill in all required fields.");
    }
    roleProfile[field.name] = fieldValue;
  }

  const password = cleanString(registrationData.password);
  if (!password) {
    throw new Error("Password is required.");
  }

  const normalizedEmail = cleanEmail(roleProfile.email);
  const emailExists = registeredUsers.some(
    (existingUser) => cleanEmail(existingUser.email) === normalizedEmail,
  );

  if (emailExists) {
    throw new Error("An account with this email already exists.");
  }

  return {
    id: Date.now(),
    role,
    accountStatus: "registered",
    createdAt: new Date().toISOString(),
    ...roleProfile,
    email: normalizedEmail,
    password,
  };
}

export function getLoggedInUser(credentials, registeredUsers) {
  const selectedRole = cleanString(credentials.role);
  const roleAllowed = LOGIN_ROLE_OPTIONS.some(
    (option) => option.value === selectedRole,
  );
  if (!roleAllowed) {
    throw new Error("Unsupported role selected.");
  }

  const normalizedEmail = cleanEmail(credentials.email);
  const password = cleanString(credentials.password);

  const matchedUser = registeredUsers.find(
    (candidate) =>
      candidate.role === selectedRole &&
      cleanEmail(candidate.email) === normalizedEmail,
  );

  if (!matchedUser || matchedUser.password !== password) {
    throw new Error("Invalid email, password, or role.");
  }

  return toSessionUser(matchedUser);
}
