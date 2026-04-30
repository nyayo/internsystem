import { httpClient } from "./httpClient";

const AUTH_BASE_PATH = "/logs/logs";

function responseData(response) {
  return response.data;
}

export async function listLogs() {
  try {
    const response = await httpClient.get(`${AUTH_BASE_PATH}/`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function listPendingLogs() {
  try {
    const response = await httpClient.get(`${AUTH_BASE_PATH}/pending/`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function createLogDraft(logPayload = {}) {
  try {
    const response = await httpClient.post(`${AUTH_BASE_PATH}/`, logPayload);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateLogDraft(logId, logPayload = {}) {
  try {
    const response = await httpClient.patch(
      `${AUTH_BASE_PATH}/${logId}/`,
      logPayload,
    );
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function submitLog(logId) {
  try {
    const response = await httpClient.post(
      `${AUTH_BASE_PATH}/${logId}/submit/`,
    );
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function endorseLog(logId) {
  try {
    const response = await httpClient.post(
      `${AUTH_BASE_PATH}/${logId}/endorse/`,
    );
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function assessLog(logId) {
  try {
    const response = await httpClient.post(
      `${AUTH_BASE_PATH}/${logId}/assess/`,
    );
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function getLog(logId) {
  try {
    const response = await httpClient.get(`${AUTH_BASE_PATH}/${logId}/`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function closeLog(logId) {
  try {
    const response = await httpClient.post(`${AUTH_BASE_PATH}/${logId}/close/`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

const logsApi = {
  listLogs,
  listPendingLogs,
  createLogDraft,
  updateLogDraft,
  submitLog,
  endorseLog,
  assessLog,
  closeLog,
  getLog,
};

export default logsApi;
