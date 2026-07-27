// src/features/settings/helpers/settingsHelpers.js
// Pure utility/logic functions specific to the Settings feature.

/** Formats an ISO date string as "12 Apr, 2026". */
export function formatSettingsDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Formats an ISO datetime as a relative-ish "Today, 9:14 AM" / "26 Jul, 9:40 PM" string. */
export function formatLastActive(isoDateTime) {
  const date = new Date(isoDateTime);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) return `Today, ${time}`;
  return `${date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}, ${time}`;
}

/** Masks an email for display in the verification modal, e.g. k***i@iil.com */
export function maskEmail(email = "") {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  return `${name[0]}${"*".repeat(Math.max(name.length - 2, 1))}${name[name.length - 1]}@${domain}`;
}

/** Very light password strength check used only for inline UI hints. */
export function getPasswordStrength(password = "") {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: "Weak", variant: "danger" };
  if (score <= 2) return { label: "Fair", variant: "warning" };
  if (score === 3) return { label: "Good", variant: "info" };
  return { label: "Strong", variant: "success" };
}
