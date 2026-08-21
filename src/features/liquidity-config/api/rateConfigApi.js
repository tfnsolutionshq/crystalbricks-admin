// src/features/rate-config/api/rateConfigApi.js
// API functions for the Rate Configuration feature. Admins configure the
// liquidation penalty rates for all contribution (investment) products.

import { walletApi } from "@/services/walletApiClient";

export async function fetchLiquidityPenaltyConfigs() {
  const { data } = await walletApi.get("/admin/liquidity-penalty-configs");

  return data;
}

export async function createLiquidityPenaltyConfig(payload) {
  const { data } = await walletApi.post(
    "/admin/liquidity-penalty-configs",
    payload,
  );

  return data;
}

export async function updateLiquidityPenaltyConfig(id, payload) {
  const { data } = await walletApi.put(
    `/admin/liquidity-penalty-configs/${id}`,
    payload,
  );

  return data;
}

export async function deleteLiquidityPenaltyConfig(id) {
  const { data } = await walletApi.delete(
    `/admin/liquidity-penalty-configs/${id}`,
  );

  return data;
}