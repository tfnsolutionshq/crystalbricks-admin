import { walletApi } from "@/services/walletApiClient";

export async function fetchTransactions() {
  const { data } = await walletApi.get("/admin/transactions");

  return data;
}

export async function fetchTransactionDetail(id) {
  const { data } = await walletApi.get(`/admin/transactions/${id}`);

  return data;
}
