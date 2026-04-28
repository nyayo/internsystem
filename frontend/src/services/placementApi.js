import { httpClient } from "./httpClient";

const AUTH_BASE_PATH = "/placement/placement";

function responseData(response) {
  return response.data;
}

export async function getMyPlacement() {
  try {
    const response = await httpClient.get(`${AUTH_BASE_PATH}/my-placement`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function createPlacement(placementPayload = {}) {
  try {
    const response = await httpClient.post(
      `${AUTH_BASE_PATH}/create/`,
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

const placementApi = {
  getMyPlacement,
  createPlacement,
};

export default placementApi;
