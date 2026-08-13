import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, RefreshCw } from "lucide-react";

import Layout from "@/shared/components/Layout.jsx";

import Badge from "@/shared/components/Badge";
import FilterPill from "@/shared/components/FilterPill";
import Pagination from "@/shared/components/Pagination";
import SearchInput from "@/shared/components/SearchInput";

import formatCurrency from "@/shared/utils/formatCurrency";
import formatDateTime from "@/shared/utils/formatDateTime";
import formatStatus from "@/shared/utils/formatStatus";

import { fetchTransactions } from "@/features/transactions/api/transactionsApi";

import {
  filterTransactions,
  formatTransactionType,
  handleExport,
} from "@/features/transactions/helpers/transactionHelpers.js";

// ============================================================================
// TRANSACTIONS PAGE
// Main landing page for the Transactions section (/transactions). Header,
// search/filter bar and the transactions table all live in this one file.
// Clicking a row routes to /transactions/:transactionId (TransactionViewPage).
// ============================================================================
export default function TransactionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTransactions = useCallback(() => {
    return fetchTransactions()
      .then((response) => {
        setTransactions(response.data ?? []);
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
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setTransactions([]);
    loadTransactions();
  };

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filtered = useMemo(
    () => filterTransactions(transactions, search),
    [transactions, search],
  );

  return (
    <Layout activeNavItem="Transactions">
      <div className="p-4 sm:p-6 space-y-6 max-w-[1600px]">
        {/* ------------------------------------------------------------------
          PAGE HEADER: title + Export button
      ------------------------------------------------------------------ */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <button
            type="button"
            onClick={() => handleExport(filtered)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Export
            <Download size={16} />
          </button>
        </div>

        {/* ------------------------------------------------------------------
          SEARCH + FILTER BAR
      ------------------------------------------------------------------ */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <SearchInput
            placeholder="Search reference, type or description"
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
                <th className="font-medium px-6 py-4">Reference</th>
                <th className="font-medium px-6 py-4">Type</th>
                <th className="font-medium px-6 py-4">Description</th>
                <th className="font-medium px-6 py-4">Amount</th>
                <th className="font-medium px-6 py-4">Date</th>
                <th className="font-medium px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-24 bg-gray-200 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-48 bg-gray-200 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-28 bg-gray-200 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <p className="text-sm text-gray-500 mb-3">{error}</p>
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
                    >
                      <RefreshCw size={16} />
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <p className="text-sm text-gray-500 mb-3">
                      No transactions match your search.
                    </p>
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
                    >
                      <RefreshCw size={16} />
                      Retry
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((txn) => (
                  <tr
                    key={txn.id}
                    onClick={() => navigate(`/transactions/${txn.id}`)}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {txn.reference}
                    </td>
                    <td className="px-6 py-4">
                      {formatTransactionType(txn.type)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {txn.description}
                    </td>
                    <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                      {formatCurrency(txn.amount)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {formatDateTime(txn.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge>{formatStatus(txn.status)}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="px-6 pb-4">
            <Pagination
              showing={filtered.length}
              total={transactions.length}
              page={1}
              pageCount={1}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
