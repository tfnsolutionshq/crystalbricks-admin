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

/** Human-friendly frequency label (for contribution plans, e.g. "weekly"/"monthly"). */
export function getFrequencyLabel(frequency) {
  return (
    frequencyOptions.find((f) => f.value === frequency)?.label || frequency
  );
}

/**
 * Human-friendly payout frequency label for investment plans, which use a
 * different (uppercase) vocabulary than contribution frequencyOptions —
 * e.g. "QUARTERLY", "MONTHLY", "AT_MATURITY".
 */
export function getPayoutFrequencyLabel(frequency) {
  const labels = {
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    BIANNUALLY: "Biannually",
    ANNUALLY: "Annually",
    AT_MATURITY: "At Maturity",
  };
  return labels[String(frequency).toUpperCase()] || frequency;
}

/**
 * Maps a status (investment, contribution, or payout) to its Badge variant.
 * Covers contribution/investment lifecycle statuses as well as individual
 * payout statuses (PAID/FAILED), since both render through the same Badge.
 */
export function getStatusVariant(status) {
  switch (String(status).toUpperCase()) {
    case "ACTIVE":
      return "Active";
    case "PENDING":
      return "Pending";
    case "APPROVED_PENDING_USER":
      return "Waiting";
    case "REJECTED":
      return "Rejected";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    case "USER_CANCELLED":
      return "User Cancelled";
    case "DEFAULTED":
      return "Defaulted";
    case "MATURED":
      return "Matured";
    case "PAID":
      return "Paid";
    case "FAILED":
      return "Failed";
    default:
      return "Pending";
  }
}

export function getStatusBadgeVariant(status) {
  return getStatusVariant(status);
}

export function getStatusLabel(status) {
  if (!status) return "—";
  const s = String(status).toUpperCase();
  if (s === "APPROVED_PENDING_USER") return "Waiting";
  if (s === "USER_CANCELLED") return "User Cancelled";
  if (s === "UNDER_REVIEW") return "Under Review";
  return String(status)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

/**
 * Formats a "YYYY-MM-DD HH:mm:ss" timestamp (e.g. investment.created_at) as
 * "14 Jan, 2025, 11:12 AM". Passes through "—" as-is.
 */
export function formatDateTime(dateTimeStr) {
  if (!dateTimeStr || dateTimeStr === "—") return "—";
  const date = new Date(dateTimeStr.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "—";
  return `${date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
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
