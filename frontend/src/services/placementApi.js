import { httpClient } from "./httpClient";

const AUTH_BASE_PATH = "/placements/placements";

function responseData(response) {
  return response.data;
}

export async function listPlacements() {
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

export async function createPlacementDraft(placementPayload = {}) {
  try {
    const response = await httpClient.post(
      `${AUTH_BASE_PATH}/`,
      placementPayload,
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

export async function updatePlacementDraft(placementId, placementPayload = {}) {
  try {
    const response = await httpClient.patch(
      `${AUTH_BASE_PATH}/${placementId}/`,
      placementPayload,
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

export async function submitPlacement(placementId) {
  try {
    const response = await httpClient.post(`${AUTH_BASE_PATH}/${placementId}/submit/`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function getPlacementStats() {
  try {
    const response = await httpClient.get(`${AUTH_BASE_PATH}/stats/`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function getAdminReportStats() {
  try {
    const response = await httpClient.get(`${AUTH_BASE_PATH}/reports/`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function approvePlacement(placementId, payload) {
  try {
    const response = await httpClient.post(`${AUTH_BASE_PATH}/${placementId}/approve/`, payload);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

const placementApi = {
  listPlacements,
  createPlacementDraft,
  updatePlacementDraft,
  submitPlacement,
  getPlacementStats,
  getAdminReportStats,
  approvePlacement
};

export default placementApi;
