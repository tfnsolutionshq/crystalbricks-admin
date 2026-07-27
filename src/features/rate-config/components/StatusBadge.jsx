const STYLES = {
  Active: "bg-emerald-50 text-emerald-600",
  Inactive: "bg-red-50 text-red-500",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
