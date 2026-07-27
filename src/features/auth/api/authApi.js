import { api } from "@/services/apiClient";

export async function loginRequest(credentials) {
  const { data } = await api.post("/login", credentials);

  return data;
}
