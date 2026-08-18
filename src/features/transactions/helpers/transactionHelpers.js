// ============================================================================
// TRANSACTION HELPERS
// Small, pure functions specific to the Transactions feature. General-purpose
// stuff (currency formatting, badge colours) lives in the shared
// src/components/ui.jsx instead — only feature-specific logic belongs here.
// ============================================================================

import exportToExcel from "@/shared/utils/exportToExcel";

// Complete list of transaction types the wallet API can return.
export const TRANSACTION_TYPES = [
  "deposit",
  "withdrawal",
  "transfer",
  "fee",
  "refund",
  "adjustment",
  "bill_payment",
  "investment_debit",
  "investment_roi_credit",
  "investment_redemption",
  "loan_repayment",
  "loan_disbursement",
];

// Status filter options shared by the main transactions list and the
// per-customer transactions tab.
export const STATUS_OPTIONS = [
  { id: "", menuLabel: "All statuses", buttonLabel: "All statuses" },
  { id: "pending", menuLabel: "Pending", buttonLabel: "Pending" },
  { id: "failed", menuLabel: "Failed", buttonLabel: "Failed" },
  { id: "reversed", menuLabel: "Reversed", buttonLabel: "Reversed" },
  { id: "success", menuLabel: "Success", buttonLabel: "Success" },
];

// Whether a transaction type adds money to the balance (credit) or takes it
// away (debit). Used to work out the "New Available" figure after approval.
const CREDIT_TYPES = ["Deposit"];

export function isCredit(type) {
  return CREDIT_TYPES.includes(type);
}

// Balance the customer would have once an "In progress" transaction is
// approved. Mirrors the "New Available" figure shown on completed
// transactions in the design.
export function calculateNewAvailable(transaction) {
  const { previousAvailable = 0, amount = 0, type } = transaction;
  return isCredit(type)
    ? previousAvailable + amount
    : previousAvailable - amount;
}

// Masks all but the first 4 digits of an account number, e.g. "1234******".
export function maskAccountNumber(accountNumber = "") {
  const visible = accountNumber.replace(/\D/g, "").slice(0, 4);
  return `${visible}${"*".repeat(Math.max(accountNumber.length - visible.length, 0))}`;
}

// Converts a snake_case transaction type into a readable label, e.g.
// "loan_repayment" -> "Loan Repayment", "investment_debit" -> "Investment Debit".
export function formatTransactionType(type = "") {
  if (!type) return "";
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Simple client-side filter used by the Transactions table search box.
export function filterTransactions(transactions, query) {
  if (!query.trim()) return transactions;
  const q = query.toLowerCase();
  return transactions.filter(
    (t) =>
      (t.reference ?? "").toLowerCase().includes(q) ||
      formatTransactionType(t.type).toLowerCase().includes(q) ||
      (t.description ?? "").toLowerCase().includes(q),
  );
}

// ----------------------------------------------------------------------------
// TRANSACTION DETAIL FIELDS
// The `details` payload on a transaction differs by type (loan vs deposit vs
// transfer vs investment...). Each field carries a `kind` so the view can
// format currency/date/percentage/duration values consistently.
// ----------------------------------------------------------------------------
function field(label, value, kind = "text") {
  if (value === null || value === undefined || value === "") return null;
  return { label, value, kind };
}

export function getTransactionDetailFields(txn) {
  const { type, details = {} } = txn ?? {};
  const fields = [];

  switch (type) {
    case "deposit":
      fields.push(
        field("Deposit Reference", details.reference),
        field("Currency", details.currency),
        field("Amount", details.amount, "currency"),
        field("Fee", details.fee, "currency"),
        field("Net Amount", details.net_amount, "currency"),
        field("Payment Method", details.payment_method_type),
        field("Card", details.display_card),
        field("Gateway", details.gateway_name),
        field("Gateway Transaction ID", details.gateway_transaction_id),
        field("Processed At", details.processed_at, "date"),
      );
      break;

    case "withdrawal":
      fields.push(
        field("Withdrawal Reference", details.reference),
        field("Currency", details.currency),
        field("Amount", details.amount, "currency"),
        field("Fee", details.fee, "currency"),
        field("Net Amount", details.net_amount, "currency"),
        field(
          "Payment Method",
          details.payment_method_type ?? details.method,
        ),
        field(
          "Destination",
          details.display_account ?? details.account_number ?? details.destination,
        ),
        field("Bank", details.bank),
        field("Processed At", details.processed_at, "date"),
      );
      break;

    case "transfer": {
      const counterparty = details.counterparty ?? txn.counterparty;
      fields.push(
        field("Transfer Reference", details.reference),
        field("Amount", details.amount, "currency"),
        field("Fee", details.fee, "currency"),
        field("Total Amount", details.total_amount, "currency"),
        field("Narration", details.narration),
        field("Counterparty Name", counterparty?.account_name ?? counterparty?.name),
        field("Counterparty Account", counterparty?.account_number),
        field("Counterparty Bank", counterparty?.bank),
      );
      break;
    }

    case "fee":
      fields.push(
        field("Fee Reference", details.reference),
        field("Amount", details.amount, "currency"),
        field("Fee", details.fee, "currency"),
        field("Description", details.description ?? details.narration),
        field("Status", details.status),
        field("Processed At", details.processed_at, "date"),
      );
      break;

    case "refund":
      fields.push(
        field("Refund Reference", details.reference),
        field("Amount", details.amount, "currency"),
        field(
          "Original Reference",
          details.original_reference ?? details.source_reference,
        ),
        field("Reason", details.reason ?? details.description),
        field("Status", details.status),
        field("Processed At", details.processed_at, "date"),
      );
      break;

    case "adjustment":
      fields.push(
        field("Adjustment Reference", details.reference),
        field("Amount", details.amount, "currency"),
        field("Note", details.note ?? details.description),
        field("Status", details.status),
        field("Processed At", details.processed_at, "date"),
      );
      break;

    case "bill_payment":
      fields.push(
        field("Bill Reference", details.reference),
        field("Amount", details.amount, "currency"),
        field("Fee", details.fee, "currency"),
        field("Total Amount", details.total_amount, "currency"),
        field(
          "Provider",
          details.provider ?? details.biller ?? details.service_provider,
        ),
        field("Description", details.description),
        field("Status", details.status),
        field("Processed At", details.processed_at, "date"),
      );
      break;

    case "investment_debit":
    case "investment_roi_credit":
    case "investment_redemption":
      fields.push(
        field("Investment Name", details.investment_name),
        field("Investment Reference", details.reference),
        field("Amount", details.amount, "currency"),
        field("ROI Rate", details.roi_percentage_snapshot, "percentage"),
        field("Payout Frequency", details.payout_frequency_snapshot),
        field("Duration", details.duration_in_months, "duration"),
        field("Investment Status", details.status),
        field("Start Date", details.start_date, "date"),
        field("Maturity Date", details.maturity_date, "date"),
        field("Total Expected Return", details.total_expected_return, "currency"),
      );
      break;

    default:
      // loan_repayment, loan_disbursement and any future loan-type payloads.
      fields.push(
        field("Loan Reference", details.reference),
        field("Loan Name", details.loan_name),
        field("Loan Amount", details.amount, "currency"),
        field("Tenure", details.tenure_months, "duration"),
        field("Interest Rate", details.interest_rate, "percentage"),
        field("Processing Fee", details.processing_fee, "currency"),
        field("Loan Status", details.status),
        field("Principal Balance", details.principal_balance, "currency"),
        field("Total Repaid", details.total_repaid, "currency"),
        field("Approved At", details.approved_at, "date"),
        field("Due At", details.due_at, "date"),
      );
      break;
  }

  return fields.filter(Boolean);
}

// ---- Exporting Spreadsheet --------------------------------------------------------------
const EXPORT_COLUMNS = [
  { key: "reference", header: "Reference", width: 25 },
  {
    key: "type",
    header: "Type",
    width: 25,
    accessor: (row) => formatTransactionType(row.type),
  },
  { key: "description", header: "Description", width: 50 },
  { key: "amount", header: "Amount (₦)", width: 15 },
  { key: "created_at", header: "Date", width: 25 },
  { key: "status", header: "Status", width: 15 },
];

export function handleExport(transactionList) {
  exportToExcel(transactionList, {
    fileName: "Crystal_Bricks_Transactions",
    sheetName: "Transactions",
    columns: EXPORT_COLUMNS,
  });
}
