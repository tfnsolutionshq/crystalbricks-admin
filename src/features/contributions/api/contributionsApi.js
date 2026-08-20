import { walletApi } from "@/services/walletApiClient";

export async function fetchInvestments({
  page = 1,
  search = "",
  status = "",
  from = "",
  to = "",
  maturityFrom = "",
  maturityTo = "",
  minAmount = "",
  maxAmount = "",
  sortBy = "",
  sortOrder = "",
} = {}) {
  const params = { page };

  if (search) params.search = search;
  if (status) params.status = status;
  if (from) params.from = from;
  if (to) params.to = to;
  if (maturityFrom) params.maturity_from = maturityFrom;
  if (maturityTo) params.maturity_to = maturityTo;
  if (minAmount) params.min_amount = minAmount;
  if (maxAmount) params.max_amount = maxAmount;
  if (sortBy) params.sort_by = sortBy;
  if (sortOrder) params.sort_order = sortOrder;

  const { data } = await walletApi.get("/admin/investments", { params });

  return data;
}

export async function fetchInvestmentDetail(id) {
  const { data } = await walletApi.get(`/admin/investments/${id}`);

  return data;
}

export async function fetchInvestmentSummary() {
  const { data } = await walletApi.get("/admin/investments/summary");

  return data;
}

export async function approveInvestment(id, adminNote) {
  const { data } = await walletApi.post(
    `/admin/investments/${id}/approve`,
    { admin_note: adminNote },
  );

  return data;
}

export async function rejectInvestment(id, adminNote) {
  const { data } = await walletApi.post(
    `/admin/investments/${id}/reject`,
    { admin_note: adminNote },
  );

  return data;
}
