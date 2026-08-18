import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, RefreshCw } from "lucide-react";

import Layout from "@/shared/components/Layout.jsx";
import Badge from "@/shared/components/Badge.jsx";
import StatCard from "@/shared/components/StatCard.jsx";
import Pagination from "@/shared/components/Pagination.jsx";
import SearchInput from "@/shared/components/SearchInput.jsx";
import FilterDropdown from "@/shared/components/FilterDropdown.jsx";

import exportToExcel from "@/shared/utils/exportToExcel";

import {
  fetchCustomers,
  fetchCustomerStats,
} from "@/features/customers/api/customerApi.js";

const PAGE_SIZE = 15;

const EXPORT_COLUMNS = [
  {
    key: "name",
    header: "Name",
    width: 25,
    accessor: (c) => getCustomerName(c),
  },
  { key: "email", header: "Email", width: 30 },
  {
    key: "phone_number",
    header: "Phone Number",
    width: 20,
    accessor: (c) =>
      [c.phone_country_code, c.phone_number].filter(Boolean).join(" ") || "N/A",
  },
  { key: "referral_code", header: "Referral Code", width: 20 },
  { key: "created_at", header: "Member Since", width: 25 },
  {
    key: "status",
    header: "Status",
    width: 15,
    accessor: (c) => (c.is_active ? "Active" : "Inactive"),
  },
];

const STATUS_OPTIONS = [
  { id: "", menuLabel: "All statuses", buttonLabel: "All statuses" },
  { id: "active", menuLabel: "Active", buttonLabel: "Active" },
  { id: "inactive", menuLabel: "Inactive", buttonLabel: "Inactive" },
];

function getCustomerName(customer) {
  return (
    customer.name ||
    [customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
    customer.custom_username ||
    customer.username ||
    "N/A"
  );
}

function getInitials(customer) {
  const name = getCustomerName(customer);
  if (name !== "N/A") {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  return (customer.email || "C")[0].toUpperCase();
}

// ============================================================================
// CUSTOMERS PAGE
// Main landing page for the Customers section. The table is backed by the
// /admin/customers endpoint: live search, status filtering, server-side
// pagination and skeleton loading states. Clicking a row routes to
// /customers/:id (CustomerDetailsPage).
// ============================================================================
export default function CustomersPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [customers, setCustomers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, last_page: 1, per_page: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    total_customers: 0,
    total_active: 0,
    total_inactive: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setStatsLoading(true);
    fetchCustomerStats()
      .then(({ data }) => {
        setStats({
          total_customers: data?.total_customers ?? 0,
          total_active: data?.total_active ?? 0,
          total_inactive: data?.total_inactive ?? 0,
        });
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  async function loadCustomers(
    pageNumber = page,
    query = appliedSearch,
    statusFilter = status,
  ) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchCustomers({
        page: pageNumber,
        search: query,
        status: statusFilter,
      });
      setCustomers(data.data ?? []);
      setMeta({
        total: data.meta?.total ?? 0,
        last_page: data.meta?.last_page ?? 1,
        per_page: data.meta?.per_page ?? 0,
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
    loadCustomers(page, appliedSearch, status);
  }, [page, appliedSearch, status]);

  const resetPage = () => setPage(1);

  const totalCount = meta.total;
  const pageCount = Math.max(1, meta.last_page);
  const loadingSkeletonCount = meta.per_page || PAGE_SIZE;

  function handleExport() {
    exportToExcel(customers, {
      fileName: "Crystal_Bricks_Customer_List",
      sheetName: "Customer List",
      columns: EXPORT_COLUMNS,
    });
  }

  return (
    <Layout activeNavItem="Customers">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">Customers</h1>
            <button
              onClick={handleExport}
              disabled={loading}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export
              <Download size={16} />
            </button>
          </div>

        {/* ------------------------------------------------------------------
          STAT CARDS
      ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Total Customers"
            value={
              statsLoading ? (
                <span className="h-7 w-20 bg-gray-200 rounded animate-pulse block" />
              ) : (
                stats.total_customers.toLocaleString()
              )
            }
          />
          <StatCard
            label="Total Active"
            value={
              statsLoading ? (
                <span className="h-7 w-20 bg-gray-200 rounded animate-pulse block" />
              ) : (
                stats.total_active.toLocaleString()
              )
            }
          />
          <StatCard
            label="Total Inactive"
            value={
              statsLoading ? (
                <span className="h-7 w-20 bg-gray-200 rounded animate-pulse block" />
              ) : (
                stats.total_inactive.toLocaleString()
              )
            }
          />
        </div>

        {/* ------------------------------------------------------------------
          SEARCH + FILTER BAR
      ------------------------------------------------------------------ */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex-1 min-w-55">
            <SearchInput
              placeholder="Search customer name or email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
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
        </div>

        {/* ------------------------------------------------------------------
          CUSTOMERS TABLE
      ------------------------------------------------------------------ */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-400">
                  <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                    Name
                  </th>
                  <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                    Email
                  </th>
                  <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                    Phone Number
                  </th>
                  <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: loadingSkeletonCount }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
                          <div className="h-4 w-28 bg-gray-200 rounded" />
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-48 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="h-5 w-16 bg-gray-200 rounded-full" />
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="px-4 sm:px-6 py-10 text-center">
                      <p className="text-sm text-gray-500 mb-3">{error}</p>
                      <button
                        type="button"
                        onClick={() =>
                          loadCustomers(page, appliedSearch, status)
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
                      >
                        <RefreshCw size={16} />
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 sm:px-6 py-10 text-center">
                      <p className="text-sm text-gray-500 mb-3">
                        No customers match your filters.
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          loadCustomers(page, appliedSearch, status)
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
                      >
                        <RefreshCw size={16} />
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => navigate(`/customers/${customer.id}`)}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 cursor-pointer"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          {customer.avatar ? (
                            <img
                              src={customer.avatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 text-xs font-semibold flex items-center justify-center shrink-0">
                              {getInitials(customer)}
                            </div>
                          )}
                          <span className="font-medium text-gray-900 whitespace-nowrap">
                            {getCustomerName(customer)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap">
                        {customer.email}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap">
                        {[customer.phone_country_code, customer.phone_number]
                          .filter(Boolean)
                          .join(" ") || "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <Badge>
                          {customer.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 sm:px-6 pb-4">
            <Pagination
              showing={customers.length}
              total={totalCount}
              page={page}
              pageCount={pageCount}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(pageCount, p + 1))}
            />
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}
