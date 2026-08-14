import { Link } from "react-router-dom";
import Badge from "@/shared/components/Badge";

import formatCurrency from "@/shared/utils/formatCurrency";
import formatDateTime from "@/shared/utils/formatDateTime";
import formatStatus from "@/shared/utils/formatStatus";

export default function RecentTransactionsTable({ transactions = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex-[1.6] min-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">
          Recent Transactions
        </h3>
        <Link
          to="/transactions"
          type="button"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          See all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-400">
              <th className="font-medium pb-3 pr-4">Reference</th>
              <th className="font-medium pb-3 pr-4">Customer</th>
              <th className="font-medium pb-3 pr-4">Amount</th>
              <th className="font-medium pb-3 pr-4">Date</th>
              <th className="font-medium pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="py-3 pr-4 text-gray-900 font-medium underline decoration-gray-300 underline-offset-2">
                  <Link to={`/transactions/${t.id}`}>{t.reference}</Link>
                </td>
                <td className="py-3 pr-4 text-gray-900 font-medium underline decoration-gray-300 underline-offset-2">
                  <Link to={`/customers/${t.details.user_id}`}>
                    {t.customer_name}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-gray-900">
                  {formatCurrency(t.amount)}
                </td>
                <td className="py-3 pr-4 text-gray-500">
                  {formatDateTime(t.created_at)}
                </td>
                <td className="py-3">
                  <Badge>{formatStatus(t.status)}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
