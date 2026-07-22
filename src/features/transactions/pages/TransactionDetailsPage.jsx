import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/shared/components/DashboardComponents/Layout.jsx";
import {
  Badge,
  Card,
  Field,
  KebabButton,
  formatNaira,
} from "@/features/transactions/components/GeneralTransactionsUIComponents.jsx";
import { getTransactionById } from "@/features/transactions/mocks/transactionMockData.js";
import { calculateNewAvailable } from "@/features/transactions/helpers/transactionHelpers.js";
import ConfirmApprovalModal from "@/features/transactions/components/ConfirmApprovalModal.jsx";
import ConfirmRejectionModal from "@/features/transactions/components/ConfirmRejectionModal.jsx";
import ResultModal from "@/features/transactions/components/ResultModal.jsx";

// Modal flow states: null (no modal) -> "confirmApprove" | "confirmReject"
// -> "resultSuccess" | "resultRejected" -> back to null.
const FLOW = {
  NONE: null,
  CONFIRM_APPROVE: "confirmApprove",
  CONFIRM_REJECT: "confirmReject",
  RESULT_SUCCESS: "resultSuccess",
  RESULT_REJECTED: "resultRejected",
};

// ============================================================================
// TRANSACTION VIEW PAGE
// Reached from a row on TransactionsPage (/transactions/:transactionId).
// For "In progress" transactions this also owns the Approve/Reject flow:
// Approve -> Confirm Approval -> Transaction Successful
// Reject  -> Confirm Rejection (pick a reason) -> Transaction rejected
// ============================================================================
export default function TransactionViewPage() {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  // Local copy of the transaction so we can flip its status once an
  // approval/rejection is confirmed, without needing a real backend.
  const [transaction, setTransaction] = useState(() =>
    getTransactionById(transactionId),
  );
  const [flow, setFlow] = useState(FLOW.NONE);

  if (!transaction) {
    return (
      <Layout>
        <div className="p-4 sm:p-6 space-y-6 max-w-[1600px]">
          <p className="text-sm text-gray-500">Transaction not found.</p>
        </div>
      </Layout>
    );
  }

  const isInProgress = transaction.status === "In progress";
  const isFailed = transaction.status === "Failed";
  const isCompleted = transaction.status === "Completed";

  function handleApprove() {
    setTransaction((t) => ({
      ...t,
      status: "Completed",
      newAvailable: calculateNewAvailable(t),
    }));
    setFlow(FLOW.RESULT_SUCCESS);
  }

  function handleReject(reason) {
    setTransaction((t) => ({ ...t, status: "Failed", reason }));
    setFlow(FLOW.RESULT_REJECTED);
  }

  function closeFlow() {
    setFlow(FLOW.NONE);
  }

  return (
    <AppLayout activeNavItem="Transactions">
      <div className="p-4 sm:p-6 space-y-6 max-w-[1600px]">
        {/* ------------------------------------------------------------------
          HEADER: back button, id + timestamp, status, account number,
          Reject/Approve actions (only while "In progress"), kebab menu
      ------------------------------------------------------------------ */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50"
              aria-label="Back to transactions"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">
                  {transaction.id}
                </h1>
                <Badge>{transaction.status}</Badge>
                <span className="text-sm text-blue-600 font-medium">
                  Account Number:{transaction.accountNumber}
                </span>
              </div>
              <p className="text-sm text-gray-400">{transaction.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isInProgress && (
              <>
                <button
                  onClick={() => setFlow(FLOW.CONFIRM_REJECT)}
                  className="px-5 py-2 rounded-full border border-red-300 text-red-500 text-sm font-medium hover:bg-red-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => setFlow(FLOW.CONFIRM_APPROVE)}
                  className="px-5 py-2 rounded-full bg-pink-600 text-white text-sm font-medium hover:bg-pink-700"
                >
                  Approve
                </button>
              </>
            )}
            <KebabButton />
          </div>
        </div>

        {/* ------------------------------------------------------------------
          DETAILS + BALANCE CARDS
      ------------------------------------------------------------------ */}
        <div className="grid grid-cols-2 gap-5">
          <Card title="Details">
            <div className="grid grid-cols-2 gap-y-5">
              <Field label="Customer">
                <span className="underline">{transaction.customer}</span>
              </Field>
              <Field label="Transaction ID">
                <span className="flex items-center gap-1.5">
                  {transaction.id}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="w-3.5 h-3.5 text-gray-400"
                  >
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                </span>
              </Field>
              <Field label="Amount">{formatNaira(transaction.amount)}</Field>
              <Field label="Fee">
                <span className="underline">
                  {formatNaira(transaction.fee || 0)}
                </span>
              </Field>
              <Field label="Type">{transaction.type}</Field>
              <Field label="Category">{transaction.category}</Field>

              {/* Failed transactions show "Beneficiary Bank" here instead of
                "Sender Details", per the design. */}
              {isFailed ? (
                <Field label="Beneficiary Bank">
                  {transaction.beneficiaryBank}
                </Field>
              ) : (
                <Field label="Sender Details">
                  {transaction.senderDetails}
                </Field>
              )}
              <Field label="Beneficiary Account number">
                {transaction.beneficiaryAccountNumber}
              </Field>
            </div>
          </Card>

          <Card title="Balance">
            <div className="grid grid-cols-2 gap-y-5">
              <Field label="Previous Available">
                <span className="line-through text-gray-400">
                  {formatNaira(transaction.previousAvailable)}
                </span>
              </Field>
              <Field label="Transaction Amount">
                +{formatNaira(transaction.amount)}
              </Field>

              {isCompleted && (
                <Field label="New Available">
                  {formatNaira(transaction.newAvailable)}
                </Field>
              )}

              {isFailed && (
                <div className="col-span-2 bg-gray-50 rounded-xl px-4 py-3 mt-1">
                  <Field label="Reason">{transaction.reason}</Field>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ------------------------------------------------------------------
          MODAL FLOW: Confirm Approval / Confirm Rejection / Result
      ------------------------------------------------------------------ */}
        {flow === FLOW.CONFIRM_APPROVE && (
          <ConfirmApprovalModal onClose={closeFlow} onConfirm={handleApprove} />
        )}
        {flow === FLOW.CONFIRM_REJECT && (
          <ConfirmRejectionModal onClose={closeFlow} onConfirm={handleReject} />
        )}
        {flow === FLOW.RESULT_SUCCESS && (
          <ResultModal variant="success" onDone={closeFlow} />
        )}
        {flow === FLOW.RESULT_REJECTED && (
          <ResultModal variant="rejected" onDone={closeFlow} />
        )}
      </div>
    </AppLayout>
  );
}
