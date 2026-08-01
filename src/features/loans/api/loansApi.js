import { walletApi } from "@/services/walletApiClient";

export async function fetchLoans() {
  const { data } = await walletApi.get("/admin/loans");

  return data;
}

export async function fetchLoanDetail(id) {
  const { data } = await walletApi.get(`/admin/loans/${id}`);

  return data;
}

export async function disburseLoan(id, amount) {
  const { data } = await walletApi.post(`/admin/loans/${id}/approve`, {
    amount,
  });

  return data;
}

export async function rejectLoan(id, reason) {
  const { data } = await walletApi.post(`/admin/loans/${id}/reject`, {
    note: reason,
  });

  return data;
}
