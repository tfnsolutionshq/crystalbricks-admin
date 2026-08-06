import { idApi } from "@/services/idApiClient";

export async function loginRequest(credentials) {
  const { data } = await idApi.post("/login", credentials);

  return data;
}
