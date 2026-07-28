import Card from "@/shared/components/Card";

import {
  formatNaira,
  formatDateTime,
} from "@/features/loans/helpers/loanHelpers";

function Field({ label, children, strikeThrough }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`mt-1 text-sm font-medium text-gray-900 ${strikeThrough ? "line-through text-gray-400" : ""}`}
      >
        {children ?? "-"}
      </p>
    </div>
  );
}

export default function ApprovalDetailsTab({
  approval,
  canEdit,
  onDownload,
  onEdit,
}) {
  if (!approval) return null;
  const {
    amount,
    interestPercent,
    interestAmount,
    instalmentAmount,
    accepted,
    startDate,
    endDate,
    period,
    defaultPaymentMethod,
    declined,
    declinedState,
  } = approval;

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-gray-900">Approval Details</h3>
        {declined ? (
          <button
            type="button"
            onClick={onDownload}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Download
          </button>
        ) : canEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Edit
          </button>
        ) : (
          <button
            type="button"
            onClick={onDownload}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Download
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
        <Field label="Amount" strikeThrough={declinedState}>
          {formatNaira(amount)}
        </Field>
        <Field label="Interest">
          {interestPercent}% ({formatNaira(interestAmount)})
        </Field>

        <Field label="Instalment Amount">{formatNaira(instalmentAmount)}</Field>
        {declined ? (
          <Field label="Declined">{formatDateTime(declined)}</Field>
        ) : (
          <Field label="Accepted">
            {accepted ? formatDateTime(accepted) : "-"}
          </Field>
        )}

        <Field label="Start Date" strikeThrough={declinedState}>
          {formatDateTime(startDate)}
        </Field>
        <Field label="End Date" strikeThrough={declinedState}>
          {formatDateTime(endDate)}
        </Field>

        <Field label="Period">{period}</Field>
        <Field label="Default Payment Method">{defaultPaymentMethod}</Field>
      </div>
    </Card>
  );
}
