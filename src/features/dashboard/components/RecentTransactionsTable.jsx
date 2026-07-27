import Badge from "@/shared/components/Badge";

import { TRANSACTIONS } from "@/features/dashboard/mocks/dashboardMockData";

export default function RecentTransactionsTable() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex-[1.6] min-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">
          Recent Transactions
        </h3>
        <button
          type="button"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          See all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-400">
              <th className="font-medium pb-3 pr-4">Transaction ID</th>
              <th className="font-medium pb-3 pr-4">Customer</th>
              <th className="font-medium pb-3 pr-4">Amount</th>
              <th className="font-medium pb-3 pr-4">Date</th>
              <th className="font-medium pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {TRANSACTIONS.map((t) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="py-3 pr-4 text-gray-600">{t.id}</td>
                <td className="py-3 pr-4 text-gray-900 font-medium underline decoration-gray-300 underline-offset-2">
                  {t.customer}
                </td>
                <td className="py-3 pr-4 text-gray-900">{t.amount}</td>
                <td className="py-3 pr-4 text-gray-500">{t.date}</td>
                <td className="py-3">
                  <Badge status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
