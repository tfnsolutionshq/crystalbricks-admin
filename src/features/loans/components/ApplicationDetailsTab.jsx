import { Copy } from "lucide-react";

import Card from "@/shared/components/Card";
import Badge from "@/shared/components/Badge";

import {
  formatNaira,
  formatDateTime,
  getTypeVariant,
} from "@/features/loans/helpers/loanHelpers";

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

/**
 * Two layouts exist in the design:
 *  - "New" applications (not yet reviewed) show Oracle/IPPS/Employer fields
 *    instead of Loan Purpose, since those haven't been captured yet.
 *  - Every other stage shows the standard Account Balance -> Loan Purpose layout.
 */
export default function ApplicationDetailsTab({ application }) {
  if (!application) return null;
  const {
    customer,
    customerId,
    reference,
    oracleNumber,
    ipps,
    employer,
    accountBalance,
    accountType,
    loanAmount,
    loanType,
    period,
    date,
    category,
    loanPurpose,
  } = application;

  const isNewApplication = Boolean(oracleNumber);

  const handleCopy = () => {
    navigator.clipboard?.writeText(reference);
  };

  const ReferenceField = (
    <Field label="Reference">
      <span className="inline-flex items-center gap-2">
        {reference}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy reference"
          className="text-gray-400 hover:text-gray-600"
        >
          <Copy size={14} />
        </button>
      </span>
    </Field>
  );

  return (
    <Card>
      <h3 className="text-base font-bold text-gray-900 mb-5">
        Application Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
        <Field label="Customer">
          <a
            href={`/customers/${customerId || ""}`}
            className="text-gray-900 underline underline-offset-2"
          >
            {customer}
          </a>
        </Field>
        {ReferenceField}

        {isNewApplication ? (
          <>
            <Field label="Oracle number">{oracleNumber}</Field>
            <Field label="Employer">{employer}</Field>
            <Field label="IPPS number">{ipps}</Field>
            <div />
            <Field label="Account Balance">
              <span className="underline underline-offset-2">
                {formatNaira(accountBalance)}
              </span>
            </Field>
            <Field label="Account Type">
              <Badge variant={getTypeVariant(accountType)}>{accountType}</Badge>
            </Field>
            <Field label="Loan Amount">{formatNaira(loanAmount)}</Field>
            <Field label="Date">{formatDateTime(date)}</Field>
            <Field label="Loan Type">
              <Badge variant={getTypeVariant(loanType)}>{loanType}</Badge>
            </Field>
            <Field label="Category">{category}</Field>
            <Field label="Period">{period}</Field>
          </>
        ) : (
          <>
            <Field label="Account Balance">
              <span className="underline underline-offset-2">
                {formatNaira(accountBalance)}
              </span>
            </Field>
            <Field label="Account Type">
              <Badge variant={getTypeVariant(accountType)}>{accountType}</Badge>
            </Field>
            <Field label="Loan Amount">{formatNaira(loanAmount)}</Field>
            <Field label="Date">{formatDateTime(date)}</Field>
            <Field label="Loan Type">
              <Badge variant={getTypeVariant(loanType)}>{loanType}</Badge>
            </Field>
            <Field label="Category">{category}</Field>
            <Field label="Period">{period}</Field>
            <Field label="Loan Purpose">{loanPurpose || "-"}</Field>
          </>
        )}
      </div>
    </Card>
  );
}
