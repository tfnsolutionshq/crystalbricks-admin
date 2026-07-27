import { TEAM_ROLES } from "@/features/team-management/mocks/teamManagementMockData";

/** Returns the two-letter initials used for a member's avatar fallback. */
export function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** Deterministic avatar background color derived from the member's name. */
const AVATAR_COLORS = [
  "bg-pink-100 text-pink-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-cyan-100 text-cyan-700",
];

export function getAvatarColor(name = "") {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index] || AVATAR_COLORS[0];
}

/** Looks up display label + badge variant for a role value. */
export function getRoleMeta(roleValue) {
  return (
    TEAM_ROLES.find((role) => role.value === roleValue) || {
      label: roleValue,
      badgeVariant: "neutral",
    }
  );
}

/** Maps a member status to its Badge variant. */
export function getStatusBadgeVariant(status) {
  return status === "active" ? "success" : "danger";
}

/** Human-friendly status label. */
export function getStatusLabel(status) {
  return status === "active" ? "Active" : "Inactive";
}

/** Formats an ISO date string as "14 Jan, 2025". */
export function formatDateAdded(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Filters members by search text (name/email) and optional role/status. */
export function filterMembers(
  members,
  { search = "", role = "all", status = "all" } = {},
) {
  const query = search.trim().toLowerCase();
  return members.filter((member) => {
    const matchesSearch =
      !query ||
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query);
    const matchesRole = role === "all" || member.role === role;
    const matchesStatus = status === "all" || member.status === status;
    return matchesSearch && matchesRole && matchesStatus;
  });
}
