import Card from "@/shared/components/Card";
import formatCurrency from "@/shared/utils/formatCurrency";

function formatCell(value, { currency, suffix }) {
  if (value == null || value === "") return "-";
  const display = currency
    ? formatCurrency(value)
    : Number(value) || value;
  return `${display}${suffix ?? ""}`;
}

export default function ApprovalDetailsTab({ loan }) {
  if (!loan) return null;

  const approved = loan.approved_terms ?? {};

  const rows = [
    {
      label: "Loan Amount",
      requested: loan.amount,
      approved: approved.amount,
      currency: true,
    },
    {
      label: "Interest Rate",
      requested: loan.interest_rate,
      approved: approved.interest_rate,
      suffix: "%",
    },
    {
      label: "Tenure",
      requested: loan.tenure_months,
      approved: approved.tenure_months,
      suffix: " months",
    },
    {
      label: "Processing Fee",
      requested: loan.processing_fee,
      approved: approved.processing_fee,
      currency: true,
    },
  ];

  const requestedAmount = Number(loan.amount) || 0;
  const approvedAmount = Number(approved.amount) || 0;
  const amountDelta = requestedAmount - approvedAmount;

  return (
    <Card>
      <h3 className="text-base font-bold text-gray-900 mb-5">
        Approval Details
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-100 text-left text-gray-500">
              <th className="py-3 font-medium">Field</th>
              <th className="py-3 font-medium">Requested</th>
              <th className="py-3 font-medium">Approved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="py-4 whitespace-nowrap text-gray-500">
                  {row.label}
                </td>
                <td className="py-4 whitespace-nowrap text-gray-700">
                  {formatCell(row.requested, row)}
                </td>
                <td className="py-4 whitespace-nowrap font-medium text-gray-900">
                  {formatCell(row.approved, row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {requestedAmount > 0 && approvedAmount > 0 && amountDelta > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          The approved amount is{" "}
          <span className="font-semibold text-gray-900">
            {formatCurrency(amountDelta)}
          </span>{" "}
          lower than the amount requested by the customer.
        </p>
      )}
    </Card>
  );
}
