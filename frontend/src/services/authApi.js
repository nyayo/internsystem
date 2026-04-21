import { httpClient } from "./httpClient";

function responseData(response) {
  return response.data;
}

export async function login(loginCredentials = {}) {
  const credentials = loginCredentials ?? {};
  return responseData(
    await httpClient.post("/auth/login", {
      role: credentials.role,
      email: credentials.email,
      password: credentials.password,
    }),
  );
}

export async function register(registrationPayload = {}) {
  return responseData(
    await httpClient.post("/auth/register", registrationPayload),
  );
}

export async function getCurrentUser() {
  return responseData(await httpClient.get("/auth/me"));
}

const authApi = {
  login,
  register,
  getCurrentUser,
};

export default authApi;
