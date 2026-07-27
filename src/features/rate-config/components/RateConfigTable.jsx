import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import StatusBadge from "@/features/rate-config/components/StatusBadge";
import TypeLabel from "@/features/rate-config/components/TypeLabel";

export default function RateConfigTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-100">
            <th className="font-medium pb-3 pr-4">Product Name</th>
            <th className="font-medium pb-3 pr-4">Type</th>
            <th className="font-medium pb-3 pr-4">Rates</th>
            <th className="font-medium pb-3 pr-4">Last Updated</th>
            <th className="font-medium pb-3 pr-4">Effective Date</th>
            <th className="font-medium pb-3 pr-4">Status</th>
            <th className="font-medium pb-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-50">
              <td className="py-4 pr-4 text-gray-900 font-semibold max-w-45 truncate">
                {row.name}
              </td>
              <td className="py-4 pr-4">
                <TypeLabel type={row.type} />
              </td>
              <td className="py-4 pr-4 text-gray-900">{row.rates}</td>
              <td className="py-4 pr-4 text-gray-500">{row.lastUpdated}</td>
              <td className="py-4 pr-4 text-gray-500">{row.effectiveDate}</td>
              <td className="py-4 pr-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="py-4">
                <Link
                  to={`/rate-config/${row.id}`}
                  className="inline-flex items-center gap-1 bg-pink-600 hover:bg-pink-700 transition-colors text-white text-sm font-medium pl-3.5 pr-2.5 py-2 rounded-lg"
                >
                  Configure
                  <ChevronRight size={15} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
