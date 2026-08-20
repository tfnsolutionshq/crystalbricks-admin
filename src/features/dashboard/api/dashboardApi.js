import { walletApi } from "@/services/walletApiClient";

export async function fetchDashboard(date = "all_time") {
  const { data } = await walletApi.get("/admin/dashboard", {
    params: { date },
  });

  return data;
}
