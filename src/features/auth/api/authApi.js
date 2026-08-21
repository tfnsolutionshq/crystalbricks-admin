import { idApi } from "@/services/idApiClient";

export async function loginRequest(credentials) {
  const { data } = await idApi.post("/login", credentials);

  return data;
}

export async function forgotPasswordRequest(email) {
  const { data } = await idApi.post("/password/forgot", { email });

  return data;
}

export async function resetPasswordRequest(payload) {
  const { data } = await idApi.post("/password/reset", payload);

  return data;
}
