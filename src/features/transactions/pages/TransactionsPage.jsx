import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, RefreshCw } from "lucide-react";

import Layout from "@/shared/components/Layout.jsx";

import Badge from "@/shared/components/Badge";
import FilterDropdown from "@/shared/components/FilterDropdown";
import Pagination from "@/shared/components/Pagination";
import SearchInput from "@/shared/components/SearchInput";
import SortDropdown from "@/shared/components/SortDropdown";

import formatCurrency from "@/shared/utils/formatCurrency";
import formatDateTime from "@/shared/utils/formatDateTime";
import formatStatus from "@/shared/utils/formatStatus";

import { fetchTransactions } from "@/features/transactions/api/transactionsApi";

import {
  formatTransactionType,
  handleExport,
  TRANSACTION_TYPES,
} from "@/features/transactions/helpers/transactionHelpers.js";

const STATUS_OPTIONS = [
  { id: "", menuLabel: "All statuses", buttonLabel: "All statuses" },
  { id: "pending", menuLabel: "Pending", buttonLabel: "Pending" },
  { id: "failed", menuLabel: "Failed", buttonLabel: "Failed" },
  { id: "reversed", menuLabel: "Reversed", buttonLabel: "Reversed" },
  { id: "success", menuLabel: "Success", buttonLabel: "Success" },
];

const TYPE_LABELS = {
  investment_roi_credit: "Investment RORC Credit",
};

const TYPE_OPTIONS = [
  { id: "", menuLabel: "All types", buttonLabel: "All types" },
  ...TRANSACTION_TYPES.map((type) => {
    const label = TYPE_LABELS[type] ?? formatTransactionType(type);
    return { id: type, menuLabel: label, buttonLabel: label };
  }),
];

// ============================================================================
// TRANSACTIONS PAGE
// Main landing page for the Transactions section (/transactions). Header,
// search/filter bar and the transactions table all live in this one file.
// Clicking a row routes to /transactions/:transactionId (TransactionViewPage).
// ============================================================================
export default function TransactionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [sortBy, setSortBy] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);

  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState({ total: 0, last_page: 1, per_page: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const appliedSearchRef = useRef("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = search.trim();
      if (next !== appliedSearchRef.current) {
        appliedSearchRef.current = next;
        setLoading(true);
        setAppliedSearch(next);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const loadTransactions = useCallback(() => {
    return fetchTransactions({
      page,
      reference: appliedSearch,
      status,
      type,
      sort_by: sortBy,
      sort_order: sortOrder,
    })
      .then((response) => {
        setTransactions(response.data.data ?? []);
        setMeta({
          total: response.data.meta?.total ?? 0,
          last_page: response.data.meta?.last_page ?? 1,
          per_page: response.data.meta?.per_page ?? 0,
        });
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
  }, [page, appliedSearch, status, type, sortBy, sortOrder]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const resetPage = () => setPage(1);

  const handleRetry = () => {
    setLoading(true);
    setTransactions([]);
    loadTransactions();
  };

  const goToPage = (nextPage) => {
    setLoading(true);
    setPage(nextPage);
  };

  async function exportAllTransactions() {
    setExporting(true);
    setError(null);
    try {
      const allTransactions = [];
      let pageNumber = 1;
      let lastPage = 1;

      do {
        const response = await fetchTransactions({
          page: pageNumber,
          reference: appliedSearch,
          status,
          type,
          sort_by: sortBy,
          sort_order: sortOrder,
        });
        allTransactions.push(...(response.data.data ?? []));
        lastPage = response.data.meta?.last_page ?? 1;
        pageNumber += 1;
      } while (pageNumber <= lastPage);

      handleExport(allTransactions);
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setExporting(false);
    }
  }

  const pageCount = Math.max(1, meta.last_page);
  const loadingSkeletonCount = meta.per_page || 10;

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
            onClick={exportAllTransactions}
            disabled={exporting}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? "Exporting..." : "Export"}
            <Download size={16} />
          </button>
        </div>

        {/* ------------------------------------------------------------------
          SEARCH + FILTER BAR
      ------------------------------------------------------------------ */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <SearchInput
            placeholder="Search by reference"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
          <div className="flex items-center gap-3 ml-auto">
            <FilterDropdown
              options={STATUS_OPTIONS}
              selected={status}
              onSelect={(value) => {
                if (value !== status) {
                  setLoading(true);
                  setStatus(value);
                  resetPage();
                }
              }}
            />
            <FilterDropdown
              options={TYPE_OPTIONS}
              selected={type}
              onSelect={(value) => {
                if (value !== type) {
                  setLoading(true);
                  setType(value);
                  resetPage();
                }
              }}
            />
            <SortDropdown
              sortBy={sortBy}
              sortOrder={sortOrder}
              onApply={({ sortBy: field, sortOrder: order }) => {
                if (field !== sortBy || order !== sortOrder) {
                  setLoading(true);
                  setSortBy(field);
                  setSortOrder(order);
                  resetPage();
                }
              }}
            />
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
                Array.from({ length: loadingSkeletonCount }).map((_, i) => (
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
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <p className="text-sm text-gray-500 mb-3">
                      No transactions match your filters.
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
                transactions.map((txn) => (
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
              showing={transactions.length}
              total={meta.total}
              page={page}
              pageCount={pageCount}
              onPrev={() => goToPage(Math.max(1, page - 1))}
              onNext={() => goToPage(Math.min(pageCount, page + 1))}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
