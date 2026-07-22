// ============================================================================
// TRANSACTION HELPERS
// Small, pure functions specific to the Transactions feature. General-purpose
// stuff (currency formatting, badge colours) lives in the shared
// src/components/ui.jsx instead — only feature-specific logic belongs here.
// ============================================================================

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

// Simple client-side filter used by the Transactions table search box.
export function filterTransactions(transactions, query) {
  if (!query.trim()) return transactions;
  const q = query.toLowerCase();
  return transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q),
  );
}
