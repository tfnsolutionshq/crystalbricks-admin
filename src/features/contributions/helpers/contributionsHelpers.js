// src/features/contributions/helpers/contributionsHelpers.js
// Pure utility/logic functions specific to the Contributions feature.

import {
  customers,
  planCategories,
  frequencyOptions,
} from "@/features/contributions/mocks/contributionsMockData";

/** Looks up a customer by id. */
export function getCustomerById(customerId) {
  return customers.find((c) => c.id === customerId) || null;
}

/** All investments belonging to a given customer. */
export function getInvestmentsForCustomer(investments, customerId) {
  return investments.filter((inv) => inv.customerId === customerId);
}

/** Human-friendly plan category label. */
export function getCategoryLabel(category) {
  return planCategories.find((c) => c.value === category)?.label || category;
}

/** Human-friendly frequency label. */
export function getFrequencyLabel(frequency) {
  return (
    frequencyOptions.find((f) => f.value === frequency)?.label || frequency
  );
}

/** Maps a contribution/investment status to its Badge variant. */
export function getStatusVariant(status) {
  switch (status) {
    case "active":
      return "success";
    case "paused":
      return "warning";
    case "completed":
      return "info";
    case "defaulted":
      return "danger";
    default:
      return "neutral";
  }
}

/** Human-friendly status label. */
export function getStatusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/** Maps a KYC status to its Badge variant. */
export function getKycVariant(kycStatus) {
  switch (kycStatus) {
    case "verified":
      return "success";
    case "pending":
      return "warning";
    case "unverified":
      return "danger";
    default:
      return "neutral";
  }
}

/** Maps a transaction status to its Badge variant. */
export function getTransactionVariant(status) {
  return status === "success" ? "success" : "danger";
}

/** Formats an ISO date string as "14 Jan, 2025". Passes through "—" as-is. */
export function formatContributionDate(isoDate) {
  if (!isoDate || isoDate === "—") return "—";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Percentage progress toward a target amount (0-100). Null target => open-ended plan. */
export function getProgressPercent(totalContributed, targetAmount) {
  if (!targetAmount) return null;
  return Math.min(100, Math.round((totalContributed / targetAmount) * 100));
}

/** Filters investments (joined with customer) by search text, category and status. */
export function filterInvestments(
  investments,
  { search = "", category = "all", status = "all" } = {},
) {
  const query = search.trim().toLowerCase();
  return investments.filter((inv) => {
    const customer = getCustomerById(inv.customerId);
    const matchesSearch =
      !query ||
      customer?.name.toLowerCase().includes(query) ||
      customer?.email.toLowerCase().includes(query) ||
      inv.planName.toLowerCase().includes(query);
    const matchesCategory = category === "all" || inv.category === category;
    const matchesStatus = status === "all" || inv.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });
}
