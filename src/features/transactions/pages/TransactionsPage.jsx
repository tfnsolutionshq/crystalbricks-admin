import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/shared/components/DashboardComponents/Layout.jsx";
import {
  Badge,
  FilterPill,
  Pagination,
  SearchInput,
  formatNaira,
} from "@/features/transactions/components/GeneralTransactionsUIComponents.jsx";
import { transactionsList } from "@/features/transactions/mocks/transactionMockData.js";
import { filterTransactions } from "@/features/transactions/helpers/transactionHelpers.js";

// ============================================================================
// TRANSACTIONS PAGE
// Main landing page for the Transactions section (/transactions). Header,
// search/filter bar and the transactions table all live in this one file.
// Clicking a row routes to /transactions/:transactionId (TransactionViewPage).
// ============================================================================
export default function TransactionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => filterTransactions(transactionsList, search),
    [search],
  );

  return (
    <AppLayout activeNavItem="Transactions">
      <div className="p-4 sm:p-6 space-y-6 max-w-[1600px]">
        {/* ------------------------------------------------------------------
          PAGE HEADER: title + Export button
      ------------------------------------------------------------------ */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            Export
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M4 21h16" />
            </svg>
          </button>
        </div>

        {/* ------------------------------------------------------------------
          SEARCH + FILTER BAR
      ------------------------------------------------------------------ */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <SearchInput
            placeholder="Search transaction ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-3 ml-auto">
            <FilterPill label="Date" />
            <FilterPill label="Type" />
            <FilterPill label="Category" />
            <FilterPill label="Status" />
          </div>
        </div>

        {/* ------------------------------------------------------------------
          TRANSACTIONS TABLE
      ------------------------------------------------------------------ */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-400">
                <th className="font-medium px-6 py-4">Transaction ID</th>
                <th className="font-medium px-6 py-4">Customer</th>
                <th className="font-medium px-6 py-4">Description</th>
                <th className="font-medium px-6 py-4">Amount</th>
                <th className="font-medium px-6 py-4">Date</th>
                <th className="font-medium px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => (
                <tr
                  key={txn.id}
                  onClick={() => navigate(`/transactions/${txn.id}`)}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {txn.id}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-blue-600 underline">
                      {txn.customer}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                    {txn.description}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {formatNaira(txn.amount)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{txn.date}</td>
                  <td className="px-6 py-4">
                    <Badge>{txn.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-6 pb-4">
            <Pagination
              showing={filtered.length}
              total={5392}
              page={1}
              pageCount={54}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
