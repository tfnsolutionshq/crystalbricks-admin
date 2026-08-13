import { Copy } from "lucide-react";

import Card from "@/shared/components/Card";
import Badge from "@/shared/components/Badge";

import formatStatus from "@/shared/utils/formatStatus";
import formatDateTime from "@/shared/utils/formatDateTime";
import formatCurrency from "@/shared/utils/formatCurrency";
import { getStatusVariant } from "@/features/loans/helpers/loanHelpers";

function Field({ label, children }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-1 text-sm font-medium text-gray-900">
        {children ?? "-"}
      </div>
    </div>
  );
}

export default function ApplicationDetailsTab({ loan }) {
  if (!loan) return null;

  const {
    id,
    loan_name,
    amount,
    tenure_months,
    interest_rate,
    processing_fee,
    status,
    created_at,
    plan,
  } = loan;

  const handleCopy = () => {
    navigator.clipboard?.writeText(id);
  };

  return (
    <Card>
      <h3 className="text-base font-bold text-gray-900 mb-5">
        Application Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
        <Field label="Loan Name">{loan_name}</Field>
        <Field label="Plan">{plan?.name ?? "-"}</Field>
        <Field label="Plan Description">{plan?.description ?? "-"}</Field>
        <Field label="Amount">{formatCurrency(amount)}</Field>
        <Field label="Tenure">{tenure_months} months</Field>
        <Field label="Interest Rate">{interest_rate}%</Field>
        <Field label="Processing Fee">{formatCurrency(processing_fee)}</Field>
        <Field label="Status">
          <Badge variant={getStatusVariant(status)}>
            {formatStatus(status)}
          </Badge>
        </Field>
        <Field label="Date Applied">{formatDateTime(created_at)}</Field>
      </div>
    </Card>
  );
}
