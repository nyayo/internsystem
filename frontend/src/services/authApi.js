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

export async function logout(refreshToken = "") {
  return responseData(
    await httpClient.post(`${AUTH_BASE_PATH}/logout/`, {
      refresh: refreshToken,
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

export async function forgotPassword(email = "") {
  return responseData(
    await httpClient.post(`${AUTH_BASE_PATH}/forgot-password/`, {
      email,
    }),
  );
}

export async function resetPassword({
  token = "",
  newPassword = "",
  newPassword2 = "",
} = {}) {
  return responseData(
    await httpClient.post(`${AUTH_BASE_PATH}/reset-password/`, {
      token,
      new_password: newPassword,
      new_password2: newPassword2,
    }),
  );
}

export async function getCurrentUser(token = "") {
   const clean = String(token).replace(/^Bearer\s+/i, "").trim();
   const config = clean
     ? { headers: { Authorization: `Bearer ${clean}` } }
     : undefined;
 
   return responseData(await httpClient.get("/accounts/auth/me/", config));
 }

const authApi = {
  login,
  logout,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};

export default authApi;
