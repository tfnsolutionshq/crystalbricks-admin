import { walletApi } from "@/services/walletApiClient";

export async function fetchTransactions({
  page = 1,
  reference = "",
  status = "",
  type = "",
  sort_by,
  sort_order,
  user_id,
} = {}) {
  const { data } = await walletApi.get("/admin/transactions", {
    params: {
      page: page > 1 ? page : undefined,
      reference: reference || undefined,
      status: status || undefined,
      type: type || undefined,
      sort_by: sort_by || undefined,
      sort_order: sort_order || undefined,
      user_id: user_id || undefined,
    },
  });

  return data;
}

export async function fetchTransactionDetail(id) {
  const { data } = await walletApi.get(`/admin/transactions/${id}`);

  return data;
}
