import { httpClient } from "./httpClient";

const AUTH_BASE_PATH = "/logs/logs";

function responseData(response) {
  return response.data;
}

export async function listlogs() {
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

export async function createLogDraft(logPayload = {}) {
  try {
    const response = await httpClient.post(
      `${AUTH_BASE_PATH}/`,
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

const logsApi = {
  listLogs,
  createLogDraft,
  updateLog,
  deleteLog
};

export default logsApi;