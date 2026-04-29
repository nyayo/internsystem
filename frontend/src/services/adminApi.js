import { httpClient } from "./httpClient";

const AUTH_BASE_PATH = "/accounts/auth";

function responseData(response) {
  return response.data;
}

export async function listStudents() {
  try {
    const response = await httpClient.get(`${AUTH_BASE_PATH}/users/?role=student`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function listWorkplaceSupervisor() {
  try {
    const response = await httpClient.get(`${AUTH_BASE_PATH}/users/?role=workplace_supervisor`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function listAcademicSupervisor() {
  try {
    const response = await httpClient.get(`${AUTH_BASE_PATH}/users/?role=academic_supervisor`);
    return responseData(response);
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      return null;
    }
    throw error;
  }
}

const adminApi = {
  listStudents,
  listAcademicSupervisor,
  listWorkplaceSupervisor
};

export default adminApi;