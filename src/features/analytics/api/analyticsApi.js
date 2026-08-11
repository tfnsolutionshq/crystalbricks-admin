import { walletApi } from "@/services/walletApiClient";

export async function fetchAnalytics() {
  const { data } = await walletApi.get("/admin/analytics");

  return data;
}
