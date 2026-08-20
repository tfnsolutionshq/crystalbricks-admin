export const PENALTY_TYPE_OPTIONS = ["PERCENTAGE", "FIXED"];

export const PENALTY_TYPE_LABELS = {
  PERCENTAGE: "Percentage",
  FIXED: "Fixed",
};

export function getPenaltyTypeLabel(type) {
  return PENALTY_TYPE_LABELS[type] ?? type ?? "-";
}