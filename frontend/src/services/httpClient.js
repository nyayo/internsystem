import axios from "axios";

const DEFAULT_TIMEOUT_MS = 15000;
const AUTH_SESSION_KEY = "internship_auth_session";
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const PUBLIC_AUTH_PATHS = [
  "/accounts/auth/login/",
  "/accounts/auth/register/",
  "/accounts/auth/verify-email/",
];

let isRefreshing = false;
let failedQueue = [];
let sessionPromptCallback = null;

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

function getStoredRefreshToken() {
  if (typeof window === "undefined" || typeof localStorage === "undefined")
    return "";

  const rawSession = localStorage.getItem(AUTH_SESSION_KEY);
  if (!rawSession) return "";

  try {
    const session = JSON.parse(rawSession);
    if (session && typeof session === "object") {
      return normalizeToken(session.refreshToken ?? session.refresh ?? "");
    }
    return "";
  } catch {
    return "";
  }
}

function updateStoredToken(accessToken) {
  if (typeof window === "undefined" || typeof localStorage === "undefined")
    return;

  const rawSession = localStorage.getItem(AUTH_SESSION_KEY);
  if (!rawSession) return;

  try {
    const session = JSON.parse(rawSession);
    if (session && typeof session === "object") {
      session.token = accessToken;
      session.access = accessToken;
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    }
  } catch {
    // Unable to update stored token
  }
}

function shouldAttachAuthHeader(url) {
  if (typeof url !== "string" || !url) {
    return true;
  }

  const normalizedUrl = url.toLowerCase();
  return !PUBLIC_AUTH_PATHS.some((path) => normalizedUrl.includes(path));
}

export function registerSessionPrompt(callback) {
  sessionPromptCallback = callback;
}

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

function forceLogout() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  window.location.href = '/login';
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
  async (error) => {
    const originalRequest = error.config;

    if (
      !error?.response ||
      error.response.status !== 401 ||
      originalRequest._retry ||
      PUBLIC_AUTH_PATHS.some((p) => originalRequest.url?.includes(p))
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return httpClient(originalRequest);
      }).catch((err) => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Pause here — wait for user decision
      const shouldExtend = await promptUser();

      if (!shouldExtend) {
        processQueue(new Error('Session expired'), null);
        forceLogout();
        return Promise.reject(new Error('User chose to logout'));
      }

      // User chose to extend — refresh token
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(
        `${API_BASE_URL}/accounts/auth/token/refresh/`,
        { refresh: refreshToken },
      );

      updateStoredToken(data.access);
      processQueue(null, data.access);

      originalRequest.headers.Authorization = `Bearer ${data.access}`;
      return httpClient(originalRequest);

    } catch (err) {
      processQueue(err, null);
      forceLogout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

function promptUser() {
  return new Promise((resolve) => {
    if (sessionPromptCallback) {
      sessionPromptCallback(resolve); 
    } else {
      resolve(false);
    }
  });
}

export default httpClient;
