import { walletApi } from "@/services/walletApiClient";

export async function fetchInvestmentPlans() {
  const { data } = await walletApi.get("/admin/investment-plans");

  return data;
}

export async function fetchLoanPlans() {
  const { data } = await walletApi.get("/admin/loan-plans");

  return data;
}

export async function createInvestmentPlan(payload) {
  const { data } = await walletApi.post("/admin/investment-plans", payload);

  return data;
}

export async function updateInvestmentPlan(id, payload) {
  const { data } = await walletApi.put(
    `/admin/investment-plans/${id}`,
    payload,
  );

  return data;
}

export async function activateInvestmentPlan(id) {
  const { data } = await walletApi.post(
    `/admin/investment-plans/${id}/activate`,
  );

  return data;
}

export async function deactivateInvestmentPlan(id) {
  const { data } = await walletApi.post(
    `/admin/investment-plans/${id}/deactivate`,
  );

  return data;
}

export async function deleteInvestmentPlan(id) {
  const { data } = await walletApi.delete(`/admin/investment-plans/${id}`);

  return data;
}

export async function updateLoanPlan(id, payload) {
  const { data } = await walletApi.put(`/admin/loan-plans/${id}`, payload);

  return data;
}

export async function activateLoanPlan(id) {
  const { data } = await walletApi.post(`/admin/loan-plans/${id}/activate`);

  return data;
}

export async function deactivateLoanPlan(id) {
  const { data } = await walletApi.post(`/admin/loan-plans/${id}/deactivate`);

  return data;
}
