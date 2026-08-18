import Card from "@/shared/components/Card";
import Badge from "@/shared/components/Badge";

import formatDateTime from "@/shared/utils/formatDateTime";
import formatCurrency from "@/shared/utils/formatCurrency";

function formatStatusLabel(status) {
  if (!status) return status;
  return String(status)
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export default function PayoutScheduleTab({ loan }) {
  if (!loan) return null;

  const repayments = loan.repayments ?? [];
  const principal = Number(loan.amount) || 0;
  const totalRepaid = Number(loan.total_repaid) || 0;
  const progress =
    principal > 0 ? Math.round((totalRepaid / principal) * 100) : 0;

  const paidCount = repayments.filter(
    (r) => Number(r.amount_paid) > 0,
  ).length;

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">
            Repayment Progress ({paidCount}/{repayments.length} repayments paid)
          </p>
          <span className="text-sm font-semibold text-pink-700">
            {progress}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden mb-2">
          <div
            className="h-full bg-pink-700 rounded-full"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatDateTime(loan.started_at)}</span>
          <span>{formatDateTime(loan.due_at)}</span>
        </div>
      </Card>

      {/* Payout schedule */}
      <Card padded={false}>
        <div className="px-6 pt-6 pb-5">
          <h3 className="text-base font-bold text-gray-900">
            Payout Schedule
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-gray-100 text-left text-gray-500">
                <th className="px-6 py-3 font-medium whitespace-nowrap">#</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">
                  Payout Date
                </th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">
                  Principal
                </th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">
                  Interest
                </th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">
                  Amount Due
                </th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">
                  Amount Paid
                </th>
                <th className="px-6 py-3 font-medium whitespace-nowrap text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {repayments.map((repayment, idx) => (
                <tr key={repayment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {formatDateTime(repayment.due_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {formatCurrency(repayment.principal_due)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {formatCurrency(repayment.interest_due)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {formatCurrency(repayment.amount_due)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {Number(repayment.amount_paid) > 0
                      ? formatCurrency(repayment.amount_paid)
                      : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Badge>{formatStatusLabel(repayment.status)}</Badge>
                  </td>
                </tr>
              ))}

              {repayments.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    No payouts scheduled yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}