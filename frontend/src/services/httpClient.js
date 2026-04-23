import axios from "axios";

const DEFAULT_TIMEOUT_MS = 15000;
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL =
  typeof rawApiBaseUrl === "string" ? rawApiBaseUrl.trim() : "";

const SESSION_TOKEN_STORAGE_KEYS = [
  "internship_auth_session",
  "auth_session",
  "session",
];
const DIRECT_TOKEN_STORAGE_KEYS = [
  "token",
  "accessToken",
  "authToken",
  "sessionToken",
];
const TOKEN_FIELD_CANDIDATES = [
  "token",
  "accessToken",
  "authToken",
  "jwt",
  "sessionToken",
];

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanToken(value) {
  if (typeof value !== "string") {
    return "";
  }
  const token = value.trim();
  return token || "";
}

function tryParseJSON(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getTokenFromRecord(record) {
  if (!isRecord(record)) {
    return "";
  }

  for (const fieldName of TOKEN_FIELD_CANDIDATES) {
    const token = cleanToken(record[fieldName]);
    if (token) {
      return token;
    }
  }

  return "";
}

function getTokenFromUnknown(value) {
  if (typeof value === "string") {
    return cleanToken(value);
  }

  if (isRecord(value)) {
    return getTokenFromRecord(value);
  }

  return "";
}

function readSessionToken() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return "";
  }

  for (const storageKey of SESSION_TOKEN_STORAGE_KEYS) {
    const rawStoredValue = localStorage.getItem(storageKey);
    if (!rawStoredValue) {
      continue;
    }

    const parsedValue = tryParseJSON(rawStoredValue);
    const sessionToken = getTokenFromUnknown(
      parsedValue !== null ? parsedValue : rawStoredValue,
    );
    if (sessionToken) {
      return sessionToken;
    }
  }

  for (const storageKey of DIRECT_TOKEN_STORAGE_KEYS) {
    const token = cleanToken(localStorage.getItem(storageKey));
    if (token) {
      return token;
    }
  }

  return "";
}

function normalizeApiError(error) {
  const requestConfig = error?.config ?? {};
  const response = error?.response;
  const responseData = response?.data ?? null;

  let message = "Request failed";
  if (isRecord(responseData)) {
    message =
      typeof responseData.message === "string" && responseData.message.trim()
        ? responseData.message.trim()
        : message;
  } else if (typeof responseData === "string" && responseData.trim()) {
    message = responseData.trim();
  } else if (typeof error?.message === "string" && error.message.trim()) {
    message = error.message.trim();
  }

  return {
    message,
    status: response?.status ?? null,
    code: error?.code ?? null,
    method: (requestConfig.method ?? "get").toUpperCase(),
    url: requestConfig.url ?? "",
    data: responseData,
  };
}

export const httpClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: DEFAULT_TIMEOUT_MS,
});

httpClient.interceptors.request.use(
  (config) => {
    const sessionToken = readSessionToken();

    if (sessionToken) {
      if (typeof config.headers?.set === "function") {
        config.headers.set("Authorization", `Bearer ${sessionToken}`);
      } else {
        config.headers = {
          ...(config.headers ?? {}),
          Authorization: `Bearer ${sessionToken}`,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeApiError(error);
    console.error(
      `[httpClient] ${normalizedError.method} ${normalizedError.url || "(unknown-url)"} failed`,
      normalizedError,
    );
    return Promise.reject(normalizedError);
  },
);

export default httpClient;
