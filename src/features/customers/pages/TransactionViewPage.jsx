import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/shared/components/DashboardComponents/Layout.jsx";
import {
  Badge,
  Card,
  Field,
  KebabButton,
  formatNaira,
} from "@/features/customers/components/GeneralCustomerComponents.jsx";
import { getTransaction } from "@/features/customers/mocks/customerMockData.js";

// ============================================================================
// TRANSACTION VIEW PAGE
// Reached from a row on the Customer Details "Transactions" tab
// (/customers/:customerId/transactions/:transactionId). Shows transaction
// details on the left and the resulting balance movement on the right.
// ============================================================================
export default function TransactionViewPage() {
  const { customerId, transactionId } = useParams();
  const navigate = useNavigate();
  const txn = getTransaction(customerId, transactionId);

  if (!txn) {
    return (
      <AppLayout activeNavItem="Customers">
        <div className="p-4 sm:p-6 space-y-6 max-w-[1600px]">
          <p className="text-sm text-gray-500">Transaction not found.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeNavItem="Customers">
      <div className="p-4 sm:p-6 space-y-6 max-w-[1600px]">
        {/* ------------------------------------------------------------------
          HEADER: back button, transaction id + timestamp, status, kebab menu
      ------------------------------------------------------------------ */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => navigate(`/customers/${customerId}`)}
              className="w-9 h-9 shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50"
              aria-label="Back to customer"
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
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {txn.id}
                </h1>
                <Badge>{txn.status}</Badge>
              </div>
              <p className="text-sm text-gray-400">{txn.date}</p>
            </div>
          </div>
          <KebabButton />
        </div>

        {/* ------------------------------------------------------------------
          DETAILS + BALANCE CARDS
      ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card title="Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
              <Field label="Customer">
                <span className="underline">{txn.customerName}</span>
              </Field>
              <Field label="Transaction ID">
                <span className="flex items-center gap-1.5">
                  {txn.id}
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
              <Field label="Amount">{formatNaira(txn.amount)}</Field>
              <Field label="Fee">
                <span className="underline">{formatNaira(txn.fee || 0)}</span>
              </Field>
              <Field label="Type">{txn.type}</Field>
              <Field label="Category">{txn.category}</Field>
            </div>
          </Card>

          <Card title="Balance">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
              <Field label="Previous Available">
                <span className="line-through text-gray-400">
                  {formatNaira(txn.previousAvailable)}
                </span>
              </Field>
              <Field label="Pending">
                <span className="text-gray-400">
                  {formatNaira(txn.pending)}
                </span>
              </Field>
              <Field label="Transaction Amount">
                +{formatNaira(txn.amount)}
              </Field>
              <div />
              <Field label="New Available">
                {formatNaira(txn.newAvailable)}
              </Field>
              <Field label="New Pending">{formatNaira(txn.newPending)}</Field>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
