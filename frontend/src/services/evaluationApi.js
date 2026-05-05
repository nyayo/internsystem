import { httpClient } from "./httpClient";

const EVALUATION_BASE_PATH = "/evaluations";
const CRITERIA_BASE_PATH = `${EVALUATION_BASE_PATH}/criteria`;
const EVALUATIONS_BASE_PATH = `${EVALUATION_BASE_PATH}/evaluations`;

function responseData(response) {
  return response.data;
}

export async function listCriteria() {
  try {
    const response = await httpClient.get(`${CRITERIA_BASE_PATH}/`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function createCriteria(criteriaPayload = {}) {
  const response = await httpClient.post(`${CRITERIA_BASE_PATH}/`, criteriaPayload);
  return responseData(response);
}

export async function updateCriteria(criteriaId, criteriaPayload = {}) {
  const response = await httpClient.patch(
    `${CRITERIA_BASE_PATH}/${criteriaId}/`,
    criteriaPayload,
  );
  return responseData(response);
}

export async function listPendingEvaluations() {
  try {
    const response = await httpClient.get(`${EVALUATIONS_BASE_PATH}/pending/`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

const evaluationApi = {
  listCriteria,
  createCriteria,
  updateCriteria,
  listPendingEvaluations,
};

export default evaluationApi;
