import { walletApi } from "@/services/walletApiClient";

export async function fetchDashboard() {
  const { data } = await walletApi.get("/admin/dashboard");

  return data;
}
