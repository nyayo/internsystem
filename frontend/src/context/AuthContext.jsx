/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getRoleHomePath } from "../auth/authConfig";
import { currentStudent } from "../data/studentDashboardData";
import {
  currentAcademicSupervisor,
  currentWorkplaceSupervisor,
} from "../data/supervisorData";
import {
  createDefaultAuthUsers,
  createUserFromRegistration,
  getLoggedInUser,
  loadRegisteredUsers,
  loadSessionUser,
  saveRegisteredUsers,
  saveSessionUser,
  toSessionUser,
} from "../services/authService";
import authApi from "../services/authApi";
import { API_BASE_URL } from "../services/httpClient";

const AuthContext = createContext(null);
const IS_API_LOGIN_ENABLED = Boolean(API_BASE_URL);
const REGISTER_SUCCESS_MESSAGE =
  "Account created. Please check your email to verify your account.";

const DEFAULT_AUTH_USERS = createDefaultAuthUsers({
  currentStudent,
  currentWorkplaceSupervisor,
  currentAcademicSupervisor,
});

function normalizeApiUser(raw = {}) {
  const user = toSessionUser(raw);
  return {
    ...user,
    role: user.role ?? user.user_type ?? "",
    firstName: user.firstName ?? user.first_name,
    lastName: user.lastName ?? user.last_name,
    fullName:
      user.fullName ??
      user.full_name ??
      [user.firstName ?? user.first_name, user.lastName ?? user.last_name]
        .filter(Boolean)
        .join(" "),
    phone: user.phone ?? user.phone_number,
    studentNumber: user.studentNumber ?? user.student_number,
    accountStatus: user.accountStatus ?? user.account_status,
    organization: user.organization ?? user.organisation_name,
    position: user.position ?? user.job_title,
    title: user.title ?? user.job_title,
  };
}

function hydrateRoleUser(apiUser) {
  const normalized = normalizeApiUser(apiUser);
  if (!normalized.role)
    throw new Error("Login response is missing a user role.");
  const fallback = ROLE_DEFAULTS[normalized.role] ?? {};
  return { ...fallback, ...normalized };
}

function createSessionUserFromApiLogin(apiLoginResponse) {
  const payload =
    apiLoginResponse && typeof apiLoginResponse === "object"
      ? apiLoginResponse
      : {};
  const source =
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
      ? payload.data
      : payload;
  const userPayload =
    source.user &&
    typeof source.user === "object" &&
    !Array.isArray(source.user)
      ? source.user
      : source;
  const tokenCandidate =
    typeof source.access === "string"
      ? source.access
      : typeof source.token === "string"
        ? source.token
        : typeof userPayload?.access === "string"
          ? userPayload.access
          : userPayload?.token;
  const refreshTokenCandidate =
    typeof source.refresh === "string" ? source.refresh : userPayload?.refresh;
  const token = typeof tokenCandidate === "string" ? tokenCandidate.trim() : "";
  const refreshToken =
    typeof refreshTokenCandidate === "string"
      ? refreshTokenCandidate.trim()
      : "";

  const sessionUser = toSessionUser(userPayload);

  if (
    !sessionUser.accountStatus &&
    typeof sessionUser.account_status === "string"
  ) {
    sessionUser.accountStatus = sessionUser.account_status;
  }

  if (
    !sessionUser.studentNumber &&
    typeof sessionUser.student_number === "string"
  ) {
    sessionUser.studentNumber = sessionUser.student_number;
  }

  if (!sessionUser.fullName && typeof sessionUser.full_name === "string") {
    sessionUser.fullName = sessionUser.full_name;
  }

  if (!sessionUser.role) {
    throw new Error("Login response is missing a user role.");
  }

  if (token) {
    sessionUser.token = token;
  }

  if (refreshToken) {
    sessionUser.refreshToken = refreshToken;
  }

  return sessionUser;
}

function prepareRegistrationData(registrationData) {
  if (!registrationData || typeof registrationData !== "object") {
    return {};
  }

  const preparedData = {};

  for (const [key, value] of Object.entries(registrationData)) {
    if (typeof value === "string" && key !== "password") {
      preparedData[key] = value.trim();
      continue;
    }
    preparedData[key] = value;
  }

  return preparedData;
}

function createRegisterResult(responseData, fallbackData) {
  const response =
    responseData && typeof responseData === "object" ? responseData : {};
  const fallback =
    fallbackData && typeof fallbackData === "object" ? fallbackData : {};

  return {
    ...response,
    detail:
      typeof response.detail === "string" && response.detail.trim()
        ? response.detail.trim()
        : REGISTER_SUCCESS_MESSAGE,
    email: response.email ?? fallback.email ?? "",
    role: response.role ?? fallback.role ?? "",
  };
}

export function AuthProvider({ children }) {
  const [registeredUsers, setRegisteredUsers] = useState(() =>
    loadRegisteredUsers(DEFAULT_AUTH_USERS),
  );
  const [user, setUser] = useState(() => loadSessionUser());

  useEffect(() => {
    saveRegisteredUsers(registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    saveSessionUser(user);
  }, [user]);

  const register = useCallback(
    async (registrationData) => {
      const preparedData = prepareRegistrationData(registrationData);

      const registerWithLocalFallback = () => {
        const createdUser = createUserFromRegistration(
          preparedData,
          registeredUsers,
        );
        setRegisteredUsers((previousUsers) => [...previousUsers, createdUser]);
        return createRegisterResult(null, toSessionUser(createdUser));
      };

      if (!IS_API_LOGIN_ENABLED) {
        return registerWithLocalFallback();
      }

      try {
        const apiRegisterResponse = await authApi.register(preparedData);
        return createRegisterResult(apiRegisterResponse, preparedData);
      } catch (error) {
        if (error?.response) {
          throw error;
        }
        return registerWithLocalFallback();
      }
    },
    [registeredUsers],
  );

  const login = useCallback(
    async (credentials) => {
      const loginWithLocalFallback = () => {
        const fallbackSessionUser = getLoggedInUser(
          credentials,
          registeredUsers,
        );
        setUser(fallbackSessionUser);
        return fallbackSessionUser;
      };

      if (!IS_API_LOGIN_ENABLED) {
        return loginWithLocalFallback();
      }

      try {
        const apiLoginResponse = await authApi.login(credentials);
        const baseSession = createSessionUserFromApiLogin(apiLoginResponse);
        let apiCurrentUser = null;

        try {
          apiCurrentUser = await authApi.getCurrentUser();
        } catch {
          // keep baseSession when /me is unavailable
        }

        const hydrated = hydrateRoleUser(apiCurrentUser ?? baseSession);
        const sessionUser = {
          ...hydrated,
          token: baseSession.token,
          refreshToken: baseSession.refreshToken,
        };
        setUser(sessionUser);
        return sessionUser;
      } catch (error) {
        if (error?.response) {
          throw error;
        }
        return loginWithLocalFallback();
      }
    },
    [registeredUsers],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      registeredUsers,
      register,
      login,
      logout,
      getRoleHomePath,
    }),
    [login, logout, register, registeredUsers, user],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
