import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, RefreshCw } from "lucide-react";

import Layout from "@/shared/components/Layout";
import Card from "@/shared/components/Card";
import Badge from "@/shared/components/Badge";
import FilterPill from "@/shared/components/FilterPill";
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
  "All",
  "New",
  "Processing",
  "On hold",
  "Awaiting",
  "Pending",
  "Active",
  "Declined",
  "Rejected",
  "Repaid",
];
const DATE_OPTIONS = [
  "This week",
  "Today",
  "This month",
  "This year",
  "All time",
];

export default function LoanList() {
  const navigate = useNavigate();

  // ---- Filter state (header section) ----
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [dateRange, setDateRange] = useState("This week");
  const [page, setPage] = useState(1);

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadLoans() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchLoans();
      console.log("the data: ", data[0].user);
      setLoans(data);
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLoans();
  }, []);

  // ---- Filtering (table section) ----
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesSearch =
        !search ||
        (loan.reference ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (loan.customer ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesType = type === "All" || loan.type === type;
      const matchesCategory = category === "All" || loan.category === category;
      const matchesStatus = status === "All" || loan.status === status;
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
  }, [search, type, category, status, loans]);

  const totalCount = filteredLoans.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageLoans = filteredLoans.slice(pageStart, pageStart + PAGE_SIZE);

  const goToDetail = (reference) => navigate(`/loans/${reference}`);

  return (
    <Layout activeNavItem="Loans">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6">
          {/* ---- Page header ---- */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">Loans</h1>
            <button
              type="button"
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors"
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reference, customer"
              />
            </div>
            <FilterPill
              label="Type"
              value={type}
              options={TYPE_OPTIONS}
              onChange={setType}
            />
            <FilterPill
              label="Category"
              value={category}
              options={CATEGORY_OPTIONS}
              onChange={setCategory}
            />
            <FilterPill
              label="Status"
              value={status}
              options={STATUS_OPTIONS}
              onChange={setStatus}
            />
            <FilterPill
              label="Date"
              value={dateRange}
              options={DATE_OPTIONS}
              onChange={setDateRange}
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
                    Array.from({ length: 10 }).map((_, i) => (
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
                          onClick={loadLoans}
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
                          onClick={loadLoans}
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
                        key={loan.reference ?? loan.id ?? index}
                        onClick={() => goToDetail(loan.reference ?? loan.id)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          <Link
                            href={`/customers/${loan?.user?.id ?? ""}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-900 underline underline-offset-2"
                          >
                            {`${loan?.user?.first_name} ${loan?.user?.last_name}` ??
                              "N/A"}
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
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={PAGE_SIZE}
              shownCount={pageLoans.length}
              onPageChange={setPage}
            />
          </Card>
        </div>
      </div>
    </Layout>
  );
}
