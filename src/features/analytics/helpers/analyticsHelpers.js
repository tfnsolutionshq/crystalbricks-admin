// src/features/analytics/helpers/analyticsHelpers.js
// Pure utility/logic functions specific to the Analytics feature.

/**
 * Returns the tailwind text color class for a metric's trend arrow.
 * Both "up" and "down" can be positive depending on the metric
 * (e.g. a falling default rate is a good thing), so this is driven
 * purely by whether the change is favorable, not by arrow direction.
 */
export function getTrendColorClass(direction) {
  // In this dashboard every metric shown is currently trending
  // favorably, so both directions render green — matches the design.
  return "text-emerald-500";
}

/**
 * Builds the arrow glyph rotation/class for up vs down trend icons.
 */
export function getTrendIconRotation(direction) {
  return direction === "down" ? "rotate-90" : "";
}

/**
 * Finds the month entry flagged as "highlight" in a chart dataset,
 * used to decide which point should show the persistent tooltip/marker.
 */
export function findHighlightedMonth(data) {
  return data.find((entry) => entry.highlight) || null;
}

/**
 * Formats a compact axis label for months, currently a no-op passthrough
 * but kept centralized in case month formatting needs to change later.
 */
export function formatMonthLabel(month) {
  return month;
}

export function formatCurrency(amount, { decimals = 2 } = {}) {
  const value = Number(amount) || 0;
  return `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-NG");
}

export function formatPercent(value, { withSign = false } = {}) {
  const num = Number(value) || 0;
  const sign = withSign && num > 0 ? "+" : "";
  return `${sign}${num}%`;
}
