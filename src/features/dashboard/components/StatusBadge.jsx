import { STATUS_BADGE_STYLES } from "@/features/dashboard/mocks/dashboardMockData";

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
