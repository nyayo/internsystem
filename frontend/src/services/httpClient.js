import axios from "axios";

const DEFAULT_TIMEOUT_MS = 15000;
const AUTH_SESSION_KEY = "internship_auth_session";
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const PUBLIC_AUTH_PATHS = [
  "/accounts/auth/login/",
  "/accounts/auth/register/",
  "/accounts/auth/verify-email/",
];

export const API_BASE_URL =
  typeof rawApiBaseUrl === "string" ? rawApiBaseUrl.trim() : "";

function normalizeToken(value) {
  const t = String(value ?? "").trim();
  if (!t) return "";
  return t.toLowerCase().startsWith("bearer ") ? t.slice(7).trim() : t;
}

function getStoredToken() {
  if (typeof window === "undefined" || typeof localStorage === "undefined")
    return "";

  const rawSession = localStorage.getItem(AUTH_SESSION_KEY);
  if (!rawSession) return "";

  try {
    const session = JSON.parse(rawSession);

    // if session is plain token string
    if (typeof session === "string") return normalizeToken(session);

    // if session is object
    if (session && typeof session === "object") {
      return normalizeToken(
        session.token ?? session.access ?? session.access_token ?? "",
      );
    }

    return "";
  } catch {
    // raw plain token only (not JSON)
    return rawSession.trim().startsWith("{") ? "" : normalizeToken(rawSession);
  }
}

function shouldAttachAuthHeader(url) {
  if (typeof url !== "string" || !url) {
    return true;
  }

  const normalizedUrl = url.toLowerCase();
  return !PUBLIC_AUTH_PATHS.some((path) => normalizedUrl.includes(path));
}

export const httpClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: DEFAULT_TIMEOUT_MS,
});

httpClient.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token && shouldAttachAuthHeader(config.url)) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default httpClient;
