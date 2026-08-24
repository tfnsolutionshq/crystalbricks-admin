import { useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/shared/components/Layout";
import Badge from "@/shared/components/Badge";
import SearchInput from "@/shared/components/SearchInput";
import FilterDropdown from "@/shared/components/FilterDropdown";
import AmountRangeFilter from "@/shared/components/AmountRangeFilter";
import DateRangeFilter from "@/shared/components/DateRangeFilter";
import SortDropdown from "@/shared/components/SortDropdown";
import Pagination from "@/shared/components/Pagination";

import formatCurrency from "@/shared/utils/formatCurrency";
import formatNumber from "@/shared/utils/formatNumber";
import formatDateTime from "@/shared/utils/formatDateTime";
import exportToExcel from "@/shared/utils/exportToExcel";

import ContributionDetailsModal from "@/features/contributions/components/ContributionDetailsModal";

import {
  fetchInvestments,
  fetchInvestmentSummary,
  fetchLiquidityRequests,
} from "@/features/contributions/api/contributionsApi";

import { getStatusLabel } from "@/features/contributions/helpers/contributionsHelpers";

const TABS = [
  { key: "contributions", label: "All Contributions" },
  { key: "liquidity_requests", label: "Liquidity Requests" },
];

const CONTRIBUTION_STATUS_OPTIONS = [
  { id: "", menuLabel: "All statuses", buttonLabel: "All statuses" },
  { id: "PENDING", menuLabel: "Pending", buttonLabel: "Pending" },
  { id: "ACTIVE", menuLabel: "Active", buttonLabel: "Active" },
  { id: "REJECTED", menuLabel: "Rejected", buttonLabel: "Rejected" },
  { id: "USER_CANCELLED", menuLabel: "User Cancelled", buttonLabel: "User Cancelled" },
];

const LIQUIDITY_STATUS_OPTIONS = [
  { id: "", menuLabel: "All statuses", buttonLabel: "All statuses" },
  { id: "UNDER_REVIEW", menuLabel: "Under Review", buttonLabel: "Under Review" },
  { id: "APPROVED", menuLabel: "Approved", buttonLabel: "Approved" },
  { id: "COMPLETED", menuLabel: "Completed", buttonLabel: "Completed" },
  { id: "REJECTED", menuLabel: "Rejected", buttonLabel: "Rejected" },
  { id: "PENDING", menuLabel: "Pending", buttonLabel: "Pending" },
];

const FREQUENCY_LABELS = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  ANNUALLY: "Annually",
  WEEKLY: "Weekly",
  DAILY: "Daily",
};

function toTitleCase(value) {
  if (!value) return value;
  return String(value)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getFrequencyLabel(frequency) {
  return toTitleCase(FREQUENCY_LABELS[frequency] || frequency);
}

const CONTRIBUTION_EXPORT_COLUMNS = [
  { key: "reference", header: "Reference", width: 22 },
  { key: "plan.name", header: "Plan", width: 22 },
  { key: "amount", header: "Amount (₦)", width: 18 },
  { key: "payout_frequency", header: "Frequency", width: 14 },
  { key: "status", header: "Status", width: 12 },
  { key: "created_at", header: "Date", width: 22 },
];

const LIQUIDITY_EXPORT_COLUMNS = [
  { key: "reference", header: "Liquidity Reference", width: 24 },
  { key: "investment.reference", header: "Investment Reference", width: 24 },
  { key: "principal_amount", header: "Principal Amount (₦)", width: 20 },
  { key: "status", header: "Status", width: 14 },
  { key: "created_at", header: "Date", width: 22 },
];

export default function ContributionsPage() {
  const navigate = useNavigate();

  // ---- Active Tab State ----
  const [activeTab, setActiveTab] = useState("contributions");

  // ---- All Contributions State ----
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [maturityFrom, setMaturityFrom] = useState("");
  const [maturityTo, setMaturityTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const [investments, setInvestments] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- Liquidity Requests State ----
  const [liquiditySearchInput, setLiquiditySearchInput] = useState("");
  const [liquiditySearch, setLiquiditySearch] = useState("");
  const [liquidityStatus, setLiquidityStatus] = useState("");
  const [liquidityFrom, setLiquidityFrom] = useState("");
  const [liquidityTo, setLiquidityTo] = useState("");
  const [liquidityMinAmount, setLiquidityMinAmount] = useState("");
  const [liquidityMaxAmount, setLiquidityMaxAmount] = useState("");
  const [liquiditySortBy, setLiquiditySortBy] = useState("date");
  const [liquiditySortOrder, setLiquiditySortOrder] = useState("desc");
  const [liquidityPage, setLiquidityPage] = useState(1);

  const [liquidityRequests, setLiquidityRequests] = useState([]);
  const [liquidityMeta, setLiquidityMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15,
  });
  const [liquidityLoading, setLiquidityLoading] = useState(true);
  const [liquidityError, setLiquidityError] = useState(null);

  // ---- Investment summary (stat cards) ----
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // ---- Detail modal ----
  const [detail, setDetail] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Debounce search input for All Contributions
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Debounce search input for Liquidity Requests
  useEffect(() => {
    const timer = setTimeout(
      () => setLiquiditySearch(liquiditySearchInput.trim()),
      400,
    );
    return () => clearTimeout(timer);
  }, [liquiditySearchInput]);

  // Fetch the investment summary once to populate the stat cards
  useEffect(() => {
    let active = true;
    async function loadSummary() {
      setSummaryLoading(true);
      try {
        const res = await fetchInvestmentSummary();
        if (active) setSummary(res?.data ?? res);
      } catch {
        // leave the stat cards empty on failure
      } finally {
        if (active) setSummaryLoading(false);
      }
    }
    loadSummary();
    return () => {
      active = false;
    };
  }, []);

  // Load All Contributions
  async function loadInvestments() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchInvestments({
        page,
        search,
        status,
        from,
        to,
        maturityFrom,
        maturityTo,
        minAmount,
        maxAmount,
        sortBy,
        sortOrder,
      });
      const payload = res?.data ?? res;
      setInvestments(payload?.data ?? []);
      if (payload?.meta) {
        setMeta({
          current_page: payload.meta.current_page ?? 1,
          last_page: payload.meta.last_page ?? 1,
          total: payload.meta.total ?? 0,
          per_page: payload.meta.per_page ?? 15,
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  // Load Liquidity Requests
  async function loadLiquidityRequests() {
    setLiquidityLoading(true);
    setLiquidityError(null);
    try {
      const res = await fetchLiquidityRequests({
        page: liquidityPage,
        search: liquiditySearch,
        status: liquidityStatus,
        from: liquidityFrom,
        to: liquidityTo,
        minAmount: liquidityMinAmount,
        maxAmount: liquidityMaxAmount,
        sortBy: liquiditySortBy,
        sortOrder: liquiditySortOrder,
      });
      const payload = res?.data ?? res;
      setLiquidityRequests(payload?.data ?? []);
      if (payload?.meta) {
        setLiquidityMeta({
          current_page: payload.meta.current_page ?? 1,
          last_page: payload.meta.last_page ?? 1,
          total: payload.meta.total ?? 0,
          per_page: payload.meta.per_page ?? 15,
        });
      }
    } catch (err) {
      setLiquidityError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLiquidityLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "contributions") {
      loadInvestments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    page,
    search,
    status,
    sortBy,
    sortOrder,
    from,
    to,
    maturityFrom,
    maturityTo,
    minAmount,
    maxAmount,
  ]);

  useEffect(() => {
    if (activeTab === "liquidity_requests") {
      loadLiquidityRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    liquidityPage,
    liquiditySearch,
    liquidityStatus,
    liquiditySortBy,
    liquiditySortOrder,
    liquidityFrom,
    liquidityTo,
    liquidityMinAmount,
    liquidityMaxAmount,
  ]);

  // ---- Stats from the investment summary ----
  const stats = {
    totalContributions: summary?.portfolio?.total_investments ?? 0,
    activeContributions: summary?.status_breakdown?.active ?? 0,
    totalValueActive: summary?.portfolio?.total_active_principal ?? 0,
  };

  function handleExport() {
    if (activeTab === "contributions") {
      exportToExcel(investments, {
        fileName: "Crystal_Bricks_Contributions",
        sheetName: "Contributions",
        columns: CONTRIBUTION_EXPORT_COLUMNS,
      });
    } else {
      exportToExcel(liquidityRequests, {
        fileName: "Crystal_Bricks_Liquidity_Requests",
        sheetName: "Liquidity Requests",
        columns: LIQUIDITY_EXPORT_COLUMNS,
      });
    }
  }

  const isContributionsTab = activeTab === "contributions";

  return (
    <Layout activeNavItem="Contributions">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6">
          {/* ------------------------------------------------------------- */}
          {/* Header                                                       */}
          {/* ------------------------------------------------------------- */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">Contributions</h1>
            <button
              type="button"
              onClick={handleExport}
              disabled={
                isContributionsTab
                  ? !investments.length
                  : !liquidityRequests.length
              }
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Export
              <Download size={16} />
            </button>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Tabs                                                         */}
          {/* ------------------------------------------------------------- */}
          <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 cursor-pointer text-sm font-medium -mb-px border-b-2 transition-colors ${
                    isActive
                      ? "text-gray-900 border-gray-900"
                      : "text-gray-400 border-transparent hover:text-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* TAB 1: ALL CONTRIBUTIONS                                     */}
          {/* ------------------------------------------------------------- */}
          {isContributionsTab ? (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-sm text-gray-500 mb-2">
                    Total Contributions
                  </p>
                  {summaryLoading ? (
                    <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(stats.totalContributions)}
                    </p>
                  )}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-sm text-gray-500 mb-2">
                    Active Contributions
                  </p>
                  {summaryLoading ? (
                    <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(stats.activeContributions)}
                    </p>
                  )}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-sm text-gray-500 mb-2">
                    Total Value of Active Contributions
                  </p>
                  {summaryLoading ? (
                    <div className="h-7 w-28 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stats.totalValueActive, { decimals: 0 })}
                    </p>
                  )}
                </div>
              </div>

              {/* Search + filter bar */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex-1 min-w-55">
                  <SearchInput
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by reference"
                  />
                </div>
                <FilterDropdown
                  options={CONTRIBUTION_STATUS_OPTIONS}
                  selected={status}
                  onSelect={(value) => {
                    setStatus(value);
                    setPage(1);
                  }}
                />
                <SortDropdown
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onApply={({ sortBy: field, sortOrder: order }) => {
                    setSortBy(field ?? "date");
                    setSortOrder(order ?? "desc");
                    setPage(1);
                  }}
                />
                <DateRangeFilter
                  startDate={from || undefined}
                  endDate={to || undefined}
                  onApply={({ startDate, endDate }) => {
                    setFrom(startDate ?? "");
                    setTo(endDate ?? "");
                    setPage(1);
                  }}
                />
                <AmountRangeFilter
                  minAmount={minAmount ? Number(minAmount) : undefined}
                  maxAmount={maxAmount ? Number(maxAmount) : undefined}
                  onApply={({ minAmount: min, maxAmount: max }) => {
                    setMinAmount(min ?? "");
                    setMaxAmount(max ?? "");
                    setPage(1);
                  }}
                />
                <DateRangeFilter
                  label="Maturity"
                  startLabel="Maturity from"
                  endLabel="Maturity to"
                  startDate={maturityFrom || undefined}
                  endDate={maturityTo || undefined}
                  onApply={({ startDate, endDate }) => {
                    setMaturityFrom(startDate ?? "");
                    setMaturityTo(endDate ?? "");
                    setPage(1);
                  }}
                />
              </div>

              {/* Contributions table */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-gray-500">
                        <th className="px-6 py-3 font-medium whitespace-nowrap">
                          Reference
                        </th>
                        <th className="px-6 py-3 font-medium whitespace-nowrap">
                          Plan
                        </th>
                        <th className="px-6 py-3 font-medium whitespace-nowrap">
                          Amount
                        </th>
                        <th className="px-6 py-3 font-medium whitespace-nowrap">
                          Frequency
                        </th>
                        <th className="px-6 py-3 font-medium whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-6 py-3 font-medium whitespace-nowrap">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {loading ? (
                        Array.from({ length: meta.per_page || 15 }).map(
                          (_, i) => (
                            <tr key={i} className="animate-pulse">
                              {Array.from({ length: 6 }).map((__, j) => (
                                <td
                                  key={j}
                                  className="px-6 py-4 whitespace-nowrap"
                                >
                                  <div
                                    className={`bg-gray-200 rounded ${
                                      j === 4
                                        ? "h-5 w-16 rounded-full"
                                        : j === 5
                                          ? "h-4 w-24"
                                          : "h-4 w-28"
                                    }`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ),
                        )
                      ) : error ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center">
                            <p className="text-sm text-gray-500 mb-3">
                              {error}
                            </p>
                            <button
                              type="button"
                              onClick={loadInvestments}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
                            >
                              <RefreshCw size={16} />
                              Retry
                            </button>
                          </td>
                        </tr>
                      ) : investments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center">
                            <p className="text-sm text-gray-500 mb-3">
                              No contributions match your filters.
                            </p>
                            <button
                              type="button"
                              onClick={loadInvestments}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
                            >
                              <RefreshCw size={16} />
                              Retry
                            </button>
                          </td>
                        </tr>
                      ) : (
                        investments.map((investment) => (
                          <tr
                            key={investment.id}
                            onClick={() =>
                              navigate(`/contributions/${investment.id}`)
                            }
                            className="cursor-pointer hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {investment.reference || "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                              {investment.plan?.name || "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {formatCurrency(investment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                              {getFrequencyLabel(investment.payout_frequency)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge>{getStatusLabel(investment.status)}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                              {formatDateTime(investment.created_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 sm:p-6">
                  <Pagination
                    showing={investments.length}
                    total={meta.total}
                    page={meta.current_page}
                    pageCount={meta.last_page}
                    onPrev={() => setPage((p) => Math.max(1, p - 1))}
                    onNext={() =>
                      setPage((p) => Math.min(meta.last_page, p + 1))
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            /* ------------------------------------------------------------- */
            /* TAB 2: LIQUIDITY REQUESTS                                    */
            /* ------------------------------------------------------------- */
            <>
              {/* Search + filter bar */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex-1 min-w-55">
                  <SearchInput
                    value={liquiditySearchInput}
                    onChange={(e) => setLiquiditySearchInput(e.target.value)}
                    placeholder="Search by reference"
                  />
                </div>
                <FilterDropdown
                  options={LIQUIDITY_STATUS_OPTIONS}
                  selected={liquidityStatus}
                  onSelect={(value) => {
                    setLiquidityStatus(value);
                    setLiquidityPage(1);
                  }}
                />
                <SortDropdown
                  sortBy={liquiditySortBy}
                  sortOrder={liquiditySortOrder}
                  onApply={({ sortBy: field, sortOrder: order }) => {
                    setLiquiditySortBy(field ?? "date");
                    setLiquiditySortOrder(order ?? "desc");
                    setLiquidityPage(1);
                  }}
                />
                <DateRangeFilter
                  startDate={liquidityFrom || undefined}
                  endDate={liquidityTo || undefined}
                  onApply={({ startDate, endDate }) => {
                    setLiquidityFrom(startDate ?? "");
                    setLiquidityTo(endDate ?? "");
                    setLiquidityPage(1);
                  }}
                />
                <AmountRangeFilter
                  minAmount={
                    liquidityMinAmount ? Number(liquidityMinAmount) : undefined
                  }
                  maxAmount={
                    liquidityMaxAmount ? Number(liquidityMaxAmount) : undefined
                  }
                  onApply={({ minAmount: min, maxAmount: max }) => {
                    setLiquidityMinAmount(min ?? "");
                    setLiquidityMaxAmount(max ?? "");
                    setLiquidityPage(1);
                  }}
                />
              </div>

              {/* Liquidity Requests Table */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-gray-500">
                        <th className="px-6 py-3 font-medium whitespace-nowrap">
                          Liquidity Reference
                        </th>
                        <th className="px-6 py-3 font-medium whitespace-nowrap">
                          Investment Reference
                        </th>
                        <th className="px-6 py-3 font-medium whitespace-nowrap">
                          Principal Amount
                        </th>
                        <th className="px-6 py-3 font-medium whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-6 py-3 font-medium whitespace-nowrap">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {liquidityLoading ? (
                        Array.from({
                          length: liquidityMeta.per_page || 15,
                        }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            {Array.from({ length: 5 }).map((__, j) => (
                              <td
                                key={j}
                                className="px-6 py-4 whitespace-nowrap"
                              >
                                <div
                                  className={`bg-gray-200 rounded ${
                                    j === 3
                                      ? "h-5 w-16 rounded-full"
                                      : j === 4
                                        ? "h-4 w-24"
                                        : "h-4 w-28"
                                  }`}
                                />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : liquidityError ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center">
                            <p className="text-sm text-gray-500 mb-3">
                              {liquidityError}
                            </p>
                            <button
                              type="button"
                              onClick={loadLiquidityRequests}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
                            >
                              <RefreshCw size={16} />
                              Retry
                            </button>
                          </td>
                        </tr>
                      ) : liquidityRequests.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center">
                            <p className="text-sm text-gray-500 mb-3">
                              No liquidity requests match your filters.
                            </p>
                            <button
                              type="button"
                              onClick={loadLiquidityRequests}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
                            >
                              <RefreshCw size={16} />
                              Retry
                            </button>
                          </td>
                        </tr>
                      ) : (
                        liquidityRequests.map((request) => (
                          <tr
                            key={request.id}
                            onClick={() =>
                              navigate(
                                `/contributions/liquidity-requests/${request.id}`,
                              )
                            }
                            className="cursor-pointer hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {request.reference || "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                              {request.investment?.reference || "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {formatCurrency(request.principal_amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge>{getStatusLabel(request.status)}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                              {formatDateTime(request.created_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 sm:p-6">
                  <Pagination
                    showing={liquidityRequests.length}
                    total={liquidityMeta.total}
                    page={liquidityMeta.current_page}
                    pageCount={liquidityMeta.last_page}
                    onPrev={() =>
                      setLiquidityPage((p) => Math.max(1, p - 1))
                    }
                    onNext={() =>
                      setLiquidityPage((p) =>
                        Math.min(liquidityMeta.last_page, p + 1),
                      )
                    }
                  />
                </div>
              </div>
            </>
          )}

          {/* ------------------------------------------------------------- */}
          {/* Detail modal                                                 */}
          {/* ------------------------------------------------------------- */}
          <ContributionDetailsModal
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            detail={detail}
            loading={detailLoading}
          />
        </div>
      </div>
    </Layout>
  );
}
