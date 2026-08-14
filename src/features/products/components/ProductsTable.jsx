import Badge from "@/shared/components/Badge";
import formatCurrency from "@/shared/utils/formatCurrency";

const COLUMNS = {
  investments: [
    "Name",
    "Minimum Amount",
    "Maximum Amount",
    "ROI Percentage",
    "Status",
  ],
  loans: [
    "Name",
    "Minimum Amount",
    "Maximum Amount",
    "Processing Fee Percentage",
    "Status",
  ],
};

const SKELETON_COUNT = 5;

function SkeletonRow({ count }) {
  return (
    <tr className="animate-pulse border-b border-gray-50">
      {Array.from({ length: count }).map((_, i) => (
        <td key={i} className="py-4 pr-4">
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </td>
      ))}
    </tr>
  );
}

export default function ProductsTable({
  rows,
  tab,
  loading = false,
  error = null,
  onRetry,
  onRowClick,
}) {
  const headers = COLUMNS[tab] ?? COLUMNS.investments;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-100">
            {headers.map((header, i) => (
              <th
                key={header}
                className={`font-medium pb-3 ${
                  i === headers.length - 1 ? "" : "pr-4"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {loading ? (
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonRow key={i} count={headers.length} />
            ))
          ) : error ? (
            <tr>
              <td colSpan={headers.length} className="py-10 text-center">
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
                colSpan={headers.length}
                className="py-10 text-center text-sm text-gray-500"
              >
                No products found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick(row)}
                className="border-b border-gray-50 cursor-pointer hover:bg-gray-50"
              >
                {tab === "investments" ? (
                  <>
                    <td className="py-4 pr-4 text-gray-900 font-semibold max-w-55 truncate">
                      {row.name}
                    </td>
                    <td className="py-4 pr-4 text-gray-500">
                      {row.minimum_amount != null
                        ? formatCurrency(row.minimum_amount)
                        : "-"}
                    </td>
                    <td className="py-4 pr-4 text-gray-500">
                      {row.maximum_amount != null
                        ? formatCurrency(row.maximum_amount)
                        : "-"}
                    </td>
                    <td className="py-4 pr-4 text-gray-900">{row.rate}</td>
                    <td className="py-4 pr-4">
                      <Badge variant={row.is_active ? "success" : "error"}>
                        {row.status}
                      </Badge>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-4 pr-4 text-gray-900 font-semibold max-w-55 truncate">
                      {row.name}
                    </td>
                    <td className="py-4 pr-4 text-gray-500">
                      {row.minimum_amount != null
                        ? formatCurrency(row.minimum_amount)
                        : "-"}
                    </td>
                    <td className="py-4 pr-4 text-gray-900">
                      {row.maximum_amount != null || row.maxAmount != null
                        ? formatCurrency(row.maximum_amount ?? row.maxAmount)
                        : "-"}
                    </td>
                    <td className="py-4 pr-4 text-gray-900">
                      {row.processing_fee_percentage != null
                        ? `${row.processing_fee_percentage}%`
                        : "-"}
                    </td>
                    <td className="py-4 pr-4">
                      <Badge variant={row.is_active ? "success" : "error"}>
                        {row.status}
                      </Badge>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
