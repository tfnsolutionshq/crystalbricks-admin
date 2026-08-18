import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

import Layout from "@/shared/components/Layout";
import Badge from "@/shared/components/Badge";

import {
  Card,
  Field,
} from "@/features/transactions/components/GeneralTransactionsUIComponents.jsx";

import formatCurrency from "@/shared/utils/formatCurrency";
import formatDateTime from "@/shared/utils/formatDateTime";
import formatStatus from "@/shared/utils/formatStatus";

import { fetchTransactionDetail } from "@/features/transactions/api/transactionsApi";

import {
  formatTransactionType,
  getTransactionDetailFields,
} from "@/features/transactions/helpers/transactionHelpers.js";

// Renders a detail fields depending on its `kind` (currency/date/percentage/...).
function DetailValue({ kind, value }) {
  if (kind === "currency") return formatCurrency(value);
  if (kind === "date") return formatDateTime(value);
  if (kind === "percentage") return `${value}%`;
  if (kind === "duration") {
    const n = Number(value);
    return `${n} month${n === 1 ? "" : "s"}`;
  }
  return value;
}

// ============================================================================
// TRANSACTION VIEW PAGE
// Reached from a row on TransactionsPage (/transactions/:transactionId).
// Fetches the single transaction from GET /admin/transactions/:id. Because the
// `details` payload varies by transaction type, the "Additional Details" card
// renders only the fields relevant to that type.
// ============================================================================
export default function TransactionViewPage() {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTransaction = useCallback(() => {
    return fetchTransactionDetail(transactionId)
      .then((response) => {
        setTransaction(response.data ?? null);
        setError(null);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ?? err.message ?? "An error occurred",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [transactionId]);

  useEffect(() => {
    loadTransaction();
  }, [loadTransaction]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setTransaction(null);
    loadTransaction();
  };

  if (loading) {
    return (
      <Layout activeNavItem="Transactions">
        <div className="p-4 sm:p-6 space-y-6 max-w-[1600px]">
          {/* Header skeleton */}
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-9 h-9 rounded-lg bg-gray-200" />
            <div className="space-y-2">
              <div className="h-5 w-64 bg-gray-200 rounded" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
          </div>
          {/* Card skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
            <div className="h-64 bg-gray-100 rounded-2xl" />
            <div className="h-64 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!loading && error) {
    return (
      <Layout activeNavItem="Transactions">
        <div className="p-4 sm:p-6 max-w-[1600px]">
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <p className="text-sm text-gray-500">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!transaction) {
    return (
      <Layout activeNavItem="Transactions">
        <div className="p-4 sm:p-6 space-y-6 max-w-[1600px]">
          <p className="text-sm text-gray-500">Transaction not found.</p>
        </div>
      </Layout>
    );
  }

  const detailFields = getTransactionDetailFields(transaction);
  const isCredit = transaction.direction === "credit";
  const sign = isCredit ? "+" : "−";

  return (
    <Layout activeNavItem="Transactions">
      <div className="p-4 sm:p-6 space-y-6 max-w-[1600px]">
        {/* ------------------------------------------------------------------
          HEADER: back button, reference + status + date
      ------------------------------------------------------------------ */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-9 h-9 shrink-0 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
              aria-label="Back to transactions"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {transaction.reference}
                </h1>
                <Badge>{formatStatus(transaction.status)}</Badge>
              </div>
              <p className="text-sm text-gray-400">
                {formatDateTime(transaction.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------
          TRANSACTION + BALANCE CARDS
      ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card title="Transaction">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
              <Field label="Reference">{transaction.reference}</Field>
              <Field label="Type">
                {formatTransactionType(transaction.type)}
              </Field>
              <Field label="Amount">{formatCurrency(transaction.amount)}</Field>
              <Field label="Direction">
                {transaction.direction === "credit" ? "Credit" : "Debit"}
              </Field>
              <Field label="Status">{formatStatus(transaction.status)}</Field>
              <Field label="Counterparty">
                <span className="flex flex-col">
                  <span>{transaction.counterparty?.name ?? "—"}</span>
                  {transaction.counterparty?.account_number && (
                    <span className="text-gray-500">
                      {transaction.counterparty.account_number}
                    </span>
                  )}
                </span>
              </Field>
              <Field label="Description">
                <span className="text-gray-600">
                  {transaction.description ?? "—"}
                </span>
              </Field>
              <Field label="Date">
                {formatDateTime(transaction.created_at)}
              </Field>
            </div>
          </Card>

          <Card title="Balance Movement">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
              <Field label="Balance Before">
                <span className="line-through text-gray-400">
                  {formatCurrency(transaction.balance_before)}
                </span>
              </Field>
              <Field label="Balance After">
                {formatCurrency(transaction.balance_after)}
              </Field>
              <div className="sm:col-span-2 bg-gray-50 rounded-xl px-4 py-3">
                <Field label="Transaction Amount">
                  <span
                    className={isCredit ? "text-green-600" : "text-red-500"}
                  >
                    {sign}
                    {formatCurrency(transaction.amount)}
                  </span>
                </Field>
              </div>
            </div>
          </Card>
        </div>

        {/* ------------------------------------------------------------------
          ADDITIONAL DETAILS (type-specific payload)
      ------------------------------------------------------------------ */}
        {detailFields.length > 0 && (
          <Card title="Additional Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5">
              {detailFields.map(({ label, value, kind }) => (
                <Field key={label} label={label}>
                  <DetailValue kind={kind} value={value} />
                </Field>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
