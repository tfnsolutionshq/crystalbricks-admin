import { ChevronRight } from "lucide-react";

import StatusBadge from "@/features/rate-config/components/StatusBadge";

const COLUMNS = ["Product Name", "Rate", "Status", "Effective Date"];

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-gray-50">
      {Array.from({ length: 4 }).map((_, i) => (
        <td key={i} className="py-4 pr-4">
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </td>
      ))}
    </tr>
  );
}

export default function RateConfigTable({
  rows,
  loading = false,
  error = null,
  onRetry,
  onSelect,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-100">
            {COLUMNS.map((header, i) => (
              <th
                key={header}
                className={`font-medium pb-3 ${
                  i === COLUMNS.length - 1 ? "" : "pr-4"
                }`}
              >
                {header}
              </th>
            ))}
            <th className="font-medium pb-3" />
          </tr>
        </thead>
        <tbody className="text-sm">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : error ? (
            <tr>
              <td colSpan={COLUMNS.length + 1} className="py-10 text-center">
                <p className="text-sm text-gray-500 mb-3">{error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors text-white text-sm font-medium cursor-pointer"
                >
                  Retry
                </button>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={COLUMNS.length + 1}
                className="py-10 text-center text-sm text-gray-500"
              >
                No configurations found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onSelect(row)}
                className="group border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 pr-4 text-gray-900 font-semibold max-w-45 truncate">
                  {row.name}
                </td>
                <td className="py-4 pr-4 text-gray-900">
                  {row.penalty_value != null
                    ? `${row.penalty_value}${
                        row.penalty_type === "PERCENTAGE" ? "%" : ""
                      }`
                    : "-"}
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={row.is_active ? "Active" : "Inactive"} />
                </td>
                <td className="py-4 pr-4 text-gray-500">
                  {row.effectiveDate || "-"}
                </td>
                <td className="py-4">
                  <ChevronRight
                    size={16}
                    className="text-gray-300 group-hover:text-gray-500"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}