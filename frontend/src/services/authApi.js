import { httpClient } from "./httpClient";

const AUTH_BASE_PATH = "/accounts/auth";

function responseData(response) {
  return response.data;
}

export async function login(loginCredentials = {}) {
  const credentials = loginCredentials ?? {};
  return responseData(
    await httpClient.post(`${AUTH_BASE_PATH}/login/`, {
      // role: credentials.role,
      email: credentials.email,
      password: credentials.password,
    }),
  );
}

export async function register(registrationPayload = {}) {
  return responseData(
    await httpClient.post(`${AUTH_BASE_PATH}/register/`, registrationPayload),
  );
}

export async function verifyEmail(token = "") {
  return responseData(
    await httpClient.post(`${AUTH_BASE_PATH}/verify-email/`, {
      token,
    }),
  );
}

export async function getCurrentUser() {
  return responseData(await httpClient.get(`${AUTH_BASE_PATH}/me/`));
}

const authApi = {
  login,
  register,
  verifyEmail,
  getCurrentUser,
};

export default authApi;
