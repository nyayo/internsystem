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
const TOKEN_FIELD_CANDIDATES = [
  "token",
  "accessToken",
  "authToken",
  "jwt",
  "sessionToken",
];

const DEFAULT_AUTH_USERS = createDefaultAuthUsers({
  currentStudent,
  currentWorkplaceSupervisor,
  currentAcademicSupervisor,
});
const IS_API_LOGIN_ENABLED = Boolean(API_BASE_URL);

function toRecord(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  return null;
}

function getTokenFromRecord(record) {
  if (!record) {
    return "";
  }

  for (const fieldName of TOKEN_FIELD_CANDIDATES) {
    const fieldValue = record[fieldName];
    if (typeof fieldValue === "string" && fieldValue.trim()) {
      return fieldValue.trim();
    }
  }

  return "";
}

function readApiLoginPayload(apiLoginResponse) {
  const rootPayload = toRecord(apiLoginResponse) ?? {};
  const nestedPayload = toRecord(rootPayload.data);
  const nestedUser = toRecord(nestedPayload?.user) ?? toRecord(rootPayload.user);

  return {
    userPayload: nestedUser ?? nestedPayload ?? rootPayload,
    token:
      getTokenFromRecord(nestedUser) ||
      getTokenFromRecord(nestedPayload) ||
      getTokenFromRecord(rootPayload),
  };
}

function createSessionUserFromApiLogin(apiLoginResponse) {
  const { userPayload, token } = readApiLoginPayload(apiLoginResponse);
  const sessionUser = toSessionUser(userPayload);
  const userRole =
    typeof sessionUser.role === "string" && sessionUser.role.trim()
      ? sessionUser.role.trim()
      : "";

  if (!userRole) {
    throw new Error("Login response is missing a user role.");
  }

  if (token) {
    sessionUser.token = token;
  }

  return sessionUser;
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
    (registrationData) => {
      const createdUser = createUserFromRegistration(
        registrationData,
        registeredUsers,
      );
      setRegisteredUsers((previousUsers) => [...previousUsers, createdUser]);
      const { password: _password, ...sessionUser } = createdUser;
      return sessionUser;
    },
    [registeredUsers],
  );

  const login = useCallback(
    async (credentials) => {
      const loginWithLocalFallback = () => {
        const fallbackSessionUser = getLoggedInUser(credentials, registeredUsers);
        setUser(fallbackSessionUser);
        return fallbackSessionUser;
      };

      if (!IS_API_LOGIN_ENABLED) {
        return loginWithLocalFallback();
      }

      try {
        const apiLoginResponse = await authApi.login(credentials);
        const sessionUser = createSessionUserFromApiLogin(apiLoginResponse);
        setUser(sessionUser);
        return sessionUser;
      } catch {
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
