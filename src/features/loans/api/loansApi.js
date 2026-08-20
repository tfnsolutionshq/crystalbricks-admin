import { walletApi } from "@/services/walletApiClient";

export async function fetchLoans({
  page = 1,
  search = "",
  status = "",
  min_amount,
  max_amount,
  start_date,
  end_date,
  sort_by,
  sort_order,
} = {}) {
  const { data } = await walletApi.get("/admin/loans", {
    params: {
      page,
      search,
      status,
      min_amount,
      max_amount,
      start_date,
      end_date,
      sort_by,
      sort_order,
    },
  });

  return data;
}

export async function fetchLoanDetail(id) {
  const { data } = await walletApi.get(`/admin/loans/${id}`);

  return data;
}

export async function disburseLoan(id, payload) {
  const { data } = await walletApi.post(`/admin/loans/${id}/approve`, payload);

  return data;
}

export async function rejectLoan(id, reason) {
  const { data } = await walletApi.post(`/admin/loans/${id}/reject`, {
    note: reason,
  });

  return data;
}

export async function approveKYC(id) {
  const { data } = await walletApi.post(`/admin/loans/${id}/kyc/approve`);

  return data;
}

export async function rejectKYC(id, note) {
  const { data } = await walletApi.post(`/admin/loans/${id}/kyc/reject`, {
    note,
  });

  return data;
}
