import { Pencil } from "lucide-react";

import Card from "@/shared/components/Card";
import Badge from "@/shared/components/Badge";

import {
  formatNaira,
  formatDateTime,
} from "@/features/helpers/loans/loanHelpers";

import UpdateAmountModal from "@/features/loans/components/UpdateAmountModal";
import AddRepaymentEntryModal from "@/features/loans/components/AddRepaymentEntryModal";

const SCHEDULE_BADGE_VARIANT = {
  Pending: "neutral",
  Overdue: "red",
  Paid: "green",
};

export default function RepaymentScheduleTab({
  schedule,
  allowEdits,
  onUpdateAmount,
  onAddEntry,
}) {
  const [editingRow, setEditingRow] = useState(null);
  const [addingEntry, setAddingEntry] = useState(false);

  if (!schedule) return null;

  return (
    <Card padded={false}>
      <div className="flex items-center justify-between px-6 pt-6 pb-5">
        <h3 className="text-base font-bold text-gray-900">
          Repayment Schedule
        </h3>
        <div className="flex items-center gap-4 text-sm font-medium">
          {allowEdits && (
            <button
              type="button"
              onClick={() => setAddingEntry(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              Add entry
            </button>
          )}
          <button type="button" className="text-gray-500 hover:text-gray-700">
            Download
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-100 text-left text-gray-500">
              <th className="px-6 py-3 font-medium whitespace-nowrap">
                Transaction ID
              </th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">
                Amount Due
              </th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">
                Payment Method
              </th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">
                Due Date
              </th>
              <th className="px-6 py-3 font-medium whitespace-nowrap">
                Paid Date
              </th>
              <th className="px-6 py-3 font-medium whitespace-nowrap text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedule.map((row, idx) => (
              <tr key={row.transactionId || idx}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {row.transactionId ? (
                    <a
                      href={`/transactions/${row.transactionId}`}
                      className="text-gray-900 underline underline-offset-2"
                    >
                      {row.transactionId}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  <span className="inline-flex items-center gap-2">
                    {formatNaira(row.amountDue)}
                    {allowEdits && row.status !== "Paid" && (
                      <button
                        type="button"
                        onClick={() => setEditingRow(row)}
                        aria-label="Edit amount due"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Pencil size={13} />
                      </button>
                    )}
                    {row.fineAmount && (
                      <span className="text-red-500 line-through">
                        {formatNaira(row.fineAmount)}
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {row.paymentMethod || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {formatDateTime(row.dueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {row.paidDate ? formatDateTime(row.paidDate) : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Badge
                    variant={SCHEDULE_BADGE_VARIANT[row.status] || "neutral"}
                  >
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UpdateAmountModal
        open={Boolean(editingRow)}
        onClose={() => setEditingRow(null)}
        currentAmountDue={editingRow?.amountDue}
        onConfirm={(payload) => {
          onUpdateAmount?.(editingRow, payload);
          setEditingRow(null);
        }}
      />
      <AddRepaymentEntryModal
        open={addingEntry}
        onClose={() => setAddingEntry(false)}
        onConfirm={(payload) => {
          onAddEntry?.(payload);
          setAddingEntry(false);
        }}
      />
    </Card>
  );
}
