import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, RefreshCw } from "lucide-react";

import Layout from "@/shared/components/Layout";
import Card from "@/shared/components/Card";
import Badge from "@/shared/components/Badge";
import FilterPill from "@/shared/components/FilterPill";
import FilterDropdown from "@/shared/components/FilterDropdown";
import AmountRangeFilter from "@/shared/components/AmountRangeFilter";
import DateRangeFilter from "@/shared/components/DateRangeFilter";
import SortDropdown from "@/shared/components/SortDropdown";
import SearchInput from "@/shared/components/SearchInput";
import Pagination from "@/shared/components/Pagination";

import formatStatus from "@/shared/utils/formatStatus";
import formatCurrency from "@/shared/utils/formatCurrency";
import formatDateTime from "@/shared/utils/formatDateTime";

import {
  getStatusVariant,
  getTypeVariant,
} from "@/features/loans/helpers/loanHelpers";

import { fetchLoans } from "@/features/loans/api/loansApi";
import { handleExport } from "../helpers/loanHelpers";

const PAGE_SIZE = 10;

const TYPE_OPTIONS = ["All", "Individual", "Corporate"];
const CATEGORY_OPTIONS = ["All", "Government Salary Workers Loan"];
const STATUS_OPTIONS = [
  { id: "", menuLabel: "All statuses", buttonLabel: "All statuses" },
  { id: "Waiting", menuLabel: "Waiting", buttonLabel: "Waiting" },
  { id: "Pending", menuLabel: "Pending", buttonLabel: "Pending" },
  { id: "Active", menuLabel: "Active", buttonLabel: "Active" },
  { id: "Completed", menuLabel: "Completed", buttonLabel: "Completed" },
  { id: "Rejected", menuLabel: "Rejected", buttonLabel: "Rejected" },
];

export default function LoanList() {
  const navigate = useNavigate();

  // ---- Filter state (header section) ----
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("");
  const [minAmount, setMinAmount] = useState(undefined);
  const [maxAmount, setMaxAmount] = useState(undefined);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [sortBy, setSortBy] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [page, setPage] = useState(1);
  const [appliedSearch, setAppliedSearch] = useState("");

  const [loans, setLoans] = useState([]);
  const [meta, setMeta] = useState({ total: 0, last_page: 1, per_page: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  async function loadLoans(
    pageNumber = page,
    query = appliedSearch,
    statusFilter = status,
    min = minAmount,
    max = maxAmount,
    start = startDate,
    end = endDate,
    sort = sortBy,
    order = sortOrder,
  ) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchLoans({
        page: pageNumber,
        search: query,
        status: statusFilter,
        min_amount: min,
        max_amount: max,
        start_date: start,
        end_date: end,
        sort_by: sort,
        sort_order: order,
      });
      setLoans(data.data ?? []);
      setMeta({
        total: data.total ?? 0,
        last_page: data.last_page ?? 1,
        per_page: data.per_page ?? 0,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLoans(
      page,
      appliedSearch,
      status,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    );
  }, [
    page,
    appliedSearch,
    status,
    minAmount,
    maxAmount,
    startDate,
    endDate,
    sortBy,
    sortOrder,
  ]);

  const resetPage = () => setPage(1);

  // ---- Filtering (table section) ----
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesType = type === "All" || loan.type === type;
      const matchesCategory = category === "All" || loan.category === category;
      return matchesType && matchesCategory;
    });
  }, [type, category, loans]);

  const totalCount = meta.total;
  const pageCount = Math.max(1, meta.last_page);

  const loadingSkeletonCount = meta.per_page || PAGE_SIZE;

  const pageLoans = filteredLoans;

  const goToDetail = (loanId) => {
    navigate(`/loans/${loanId}`);
  };

  return (
    <Layout activeNavItem="Loans">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6">
          {/* ---- Page header ---- */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">Loans</h1>
            <button
              type="button"
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium transition-colors"
              onClick={() => handleExport(pageLoans)}
            >
              Export
              <Download size={16} />
            </button>
          </div>

          {/* ---- Search + filter bar ---- */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="w-full sm:w-72">
              <SearchInput
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPage();
                }}
                placeholder="Search by loan name"
              />
            </div>
            <FilterDropdown
              options={STATUS_OPTIONS}
              selected={status}
              onSelect={(value) => {
                setStatus(value);
                resetPage();
              }}
            />
            <AmountRangeFilter
              minAmount={minAmount}
              maxAmount={maxAmount}
              onApply={({ minAmount: min, maxAmount: max }) => {
                setMinAmount(min);
                setMaxAmount(max);
                resetPage();
              }}
            />
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onApply={({ startDate: start, endDate: end }) => {
                setStartDate(start);
                setEndDate(end);
                resetPage();
              }}
            />
            <SortDropdown
              sortBy={sortBy}
              sortOrder={sortOrder}
              onApply={({ sortBy: field, sortOrder: order }) => {
                setSortBy(field);
                setSortOrder(order);
                resetPage();
              }}
            />
          </div>

          {/* ---- Loans table ---- */}
          <Card padded={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="px-6 py-3 font-medium whitespace-nowrap">
                      Customer
                    </th>
                    <th className="px-6 py-3 font-medium whitespace-nowrap">
                      Loan Name
                    </th>
                    <th className="px-6 py-3 font-medium whitespace-nowrap">
                      Plan
                    </th>
                    <th className="px-6 py-3 font-medium whitespace-nowrap">
                      Amount
                    </th>
                    <th className="px-6 py-3 font-medium whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-6 py-3 font-medium whitespace-nowrap text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: loadingSkeletonCount }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-28 bg-gray-200 rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-36 bg-gray-200 rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-5 w-20 bg-gray-200 rounded-full" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-32 bg-gray-200 rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-28 bg-gray-200 rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="h-5 w-16 bg-gray-200 rounded-full ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center">
                        <p className="text-sm text-gray-500 mb-3">{error}</p>
                        <button
                          type="button"
                          onClick={() => loadLoans(page, appliedSearch)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
                        >
                          <RefreshCw size={16} />
                          Retry
                        </button>
                      </td>
                    </tr>
                  ) : pageLoans.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center">
                        <p className="text-sm text-gray-500 mb-3">
                          No loans match your filters.
                        </p>
                        <button
                          type="button"
                          onClick={() => loadLoans(page, appliedSearch)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
                        >
                          <RefreshCw size={16} />
                          Retry
                        </button>
                      </td>
                    </tr>
                  ) : (
                    pageLoans.map((loan, index) => (
                      <tr
                        key={loan.id}
                        onClick={() => goToDetail(loan.id)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          <Link
                            href={`/customers/${loan?.user?.id ?? ""}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-900 underline underline-offset-2"
                          >
                            {!loan?.user?.first_name || !loan?.user?.last_name
                              ? "N/A"
                              : `${loan?.user?.first_name} ${loan?.user?.last_name}`}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {loan.loan_name ?? "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getTypeVariant(loan.type)}>
                            {loan?.plan?.name ?? "N/A"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {loan.amount != null
                            ? formatCurrency(loan.amount)
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {loan.created_at
                            ? formatDateTime(loan.created_at)
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Badge variant={getStatusVariant(loan.status)}>
                            {loan.status ? formatStatus(loan.status) : "N/A"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              showing={pageLoans.length}
              total={totalCount}
              page={page}
              pageCount={pageCount}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(pageCount, p + 1))}
            />
          </Card>
        </div>
      </div>
    </Layout>
  );
}
