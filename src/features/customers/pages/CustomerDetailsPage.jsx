import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

import Layout from "@/shared/components/Layout.jsx";
import Badge from "@/shared/components/Badge.jsx";
import Card from "@/shared/components/Card.jsx";
import Field from "@/shared/components/Field.jsx";
import KebabButton from "@/shared/components/KebabButton.jsx";
import Toggle from "@/shared/components/Toggle.jsx";
import SearchInput from "@/shared/components/SearchInput.jsx";
import FilterDropdown from "@/shared/components/FilterDropdown.jsx";
import SortDropdown from "@/shared/components/SortDropdown.jsx";
import Pagination from "@/shared/components/Pagination.jsx";

import formatCurrency from "@/shared/utils/formatCurrency";
import formatDateTime from "@/shared/utils/formatDateTime";
import formatStatus from "@/shared/utils/formatStatus";

import {
  fetchCustomerDetail,
  toggleCustomerStatus,
} from "@/features/customers/api/customerApi.js";

import { fetchTransactions } from "@/features/transactions/api/transactionsApi";
import {
  formatTransactionType,
  STATUS_OPTIONS,
  TRANSACTION_TYPES,
} from "@/features/transactions/helpers/transactionHelpers";

const TABS = ["Details", "KYC Details", "Transactions"];

const TYPE_LABELS = {
  investment_debit: "Contribution Debit",
  investment_roi_credit: "Contribution RORC Credit",
  investment_redemption: "Contribution Redemption",
};

const TYPE_OPTIONS = [
  { id: "", menuLabel: "All types", buttonLabel: "All types" },
  ...TRANSACTION_TYPES.map((type) => {
    const label = TYPE_LABELS[type] ?? formatTransactionType(type);
    return { id: type, menuLabel: label, buttonLabel: label };
  }),
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

function capitalize(value) {
  if (!value) return "N/A";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// kyc.address is sometimes a plain string, sometimes an object with
// { country, state, city, address, postal_code }. Normalize to a list of
// label/value pairs so both shapes render correctly.
function getAddressFields(kyc) {
  const address = kyc?.address;
  if (!address) return [{ label: "Address", value: "N/A" }];
  if (typeof address === "string")
    return [{ label: "Address", value: address }];
  return [
    { label: "Address", value: address.address || "N/A" },
    { label: "City", value: address.city || "N/A" },
    { label: "State", value: address.state || "N/A" },
    { label: "Country", value: address.country || "N/A" },
    { label: "Postal Code", value: address.postal_code || "N/A" },
  ];
}

// ============================================================================
// CUSTOMER DETAILS PAGE
// Reached from a row on CustomersPage (/customers/:id). Backed by the
// /admin/customers/:id endpoint. Two tabs (Details + KYC Documents) are
// switched with local state rather than separate routes.
// ============================================================================
export default function CustomerDetailsPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Details");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [actionError, setActionError] = useState(null);

  async function loadCustomer() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchCustomerDetail(customerId);
      setCustomer(data);
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(nextValue) {
    setStatusUpdating(true);
    setActionError(null);
    try {
      const { data } = await toggleCustomerStatus(customerId, nextValue);
      setCustomer((prev) => ({
        ...prev,
        is_active: data?.is_active ?? nextValue,
      }));
    } catch (err) {
      setActionError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setStatusUpdating(false);
    }
  }

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  if (!loading && error) {
    return (
      <Layout activeNavItem="Customers">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <p className="text-sm text-gray-500">{error}</p>
            <button
              type="button"
              onClick={loadCustomer}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeNavItem="Customers">
      <div className="p-4 sm:p-6 space-y-6 max-w-[1600px]">
        {/* ------------------------------------------------------------------
          HEADER: back button, avatar, name, badges
      ------------------------------------------------------------------ */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {loading ? (
            <div className="flex items-center gap-3 flex-1 min-w-0 animate-pulse">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-gray-200" />
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
              <div className="h-5 w-48 bg-gray-200 rounded" />
              <div className="h-5 w-20 bg-gray-200 rounded-full" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => navigate("/customers")}
                  className="w-9 h-9 shrink-0 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                  aria-label="Back to customers"
                >
                  <ArrowLeft size={16} />
                </button>
                {customer?.avatar ? (
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {getCustomerName(customer)}
                </h1>
                <Badge>
                  {customer?.kyc?.status
                    ? customer.kyc.status.charAt(0).toUpperCase() +
                      customer.kyc.status.slice(1)
                    : "N/A"}
                </Badge>
                <Badge>{customer?.is_active ? "Active" : "Inactive"}</Badge>
                <Toggle
                  checked={customer?.is_active ?? false}
                  onChange={handleToggleStatus}
                  disabled={statusUpdating}
                  label="Toggle customer status"
                />
              </div>
              <KebabButton />
            </>
          )}
        </div>

        {actionError && (
          <p className="text-sm text-red-500 mb-4">{actionError}</p>
        )}

        {/* ------------------------------------------------------------------
          TABS
      ------------------------------------------------------------------ */}
        <div className="flex items-center gap-4 sm:gap-6 border-b border-gray-200 mb-6">
          {loading
            ? TABS.map((tab) => (
                <div key={tab} className="pb-3 animate-pulse">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              ))
            : TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 cursor-pointer text-sm -mb-px border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "border-gray-900 text-gray-900 font-medium"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
        </div>

        {/* ------------------------------------------------------------------
          TAB PANELS
      ------------------------------------------------------------------ */}
        {loading ? (
          <div className="animate-pulse">
            <Card>
              <div className="h-5 w-44 bg-gray-200 rounded mb-5" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-3 w-20 bg-gray-200 rounded mb-1" />
                    <div className="h-4 w-36 bg-gray-200 rounded mt-1" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <>
            {activeTab === "Details" && <DetailsTab customer={customer} />}
            {activeTab === "KYC Details" && (
              <KycDocumentsTab customer={customer} />
            )}
            {activeTab === "Transactions" && (
              <TransactionsTab customerId={customerId} />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

// ============================================================================
// TAB: Details
// Personal / Contact / Account information cards.
// ============================================================================
function DetailsTab({ customer }) {
  const kyc = customer?.kyc ?? {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
          <Field label="First Name">{kyc.first_name || "N/A"}</Field>
          <Field label="Last Name">{kyc.last_name || "N/A"}</Field>
          <Field label="Gender">{capitalize(kyc.gender)}</Field>
          <Field label="Date of Birth">{formatDate(kyc.date_of_birth)}</Field>
          <Field label="Identification Country">
            {kyc.identification_country || "N/A"}
          </Field>
          {getAddressFields(kyc).map((field) => (
            <Field key={field.label} label={field.label}>
              {field.value}
            </Field>
          ))}
        </div>
      </Card>

      <Card title="Contact Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
          <Field label="Email">{customer?.email || "N/A"}</Field>
          <Field label="Phone Number">
            {[customer?.phone_country_code, customer?.phone_number]
              .filter(Boolean)
              .join(" ") || "N/A"}
          </Field>
          <Field label="Email Verified At">
            {customer?.email_verified_at
              ? formatDateTime(customer.email_verified_at)
              : "N/A"}
          </Field>
          <Field label="Phone Verified At">
            {customer?.phone_verified_at
              ? formatDateTime(customer.phone_verified_at)
              : "N/A"}
          </Field>
        </div>
      </Card>

      <Card title="Account Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
          <Field label="Username">{customer?.username || "N/A"}</Field>
          <Field label="Custom Username">
            {customer?.custom_username || "N/A"}
          </Field>
          <Field label="Referral Code">
            {customer?.referral_code || "N/A"}
          </Field>
          <Field label="Roles">
            {customer?.roles?.length ? customer.roles.join(", ") : "N/A"}
          </Field>
          <Field label="Member Since">
            {customer?.created_at ? formatDateTime(customer.created_at) : "N/A"}
          </Field>
          <Field label="Last Updated">
            {customer?.updated_at ? formatDateTime(customer.updated_at) : "N/A"}
          </Field>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// TAB: KYC Documents
// KYC verification details on file for the customer.
// ============================================================================
function KycDocumentsTab({ customer }) {
  const kyc = customer?.kyc ?? {};

  if (!kyc.status) {
    return (
      <Card>
        <p className="text-sm text-gray-400 text-center py-10">
          No KYC details on file for this customer yet.
        </p>
      </Card>
    );
  }

  return (
    <Card title="KYC Details">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
        <Field label="Status">
          <Badge>{capitalize(kyc.status)}</Badge>
        </Field>
        <Field label="First Name">{kyc.first_name || "N/A"}</Field>
        <Field label="Last Name">{kyc.last_name || "N/A"}</Field>
        <Field label="Gender">{capitalize(kyc.gender)}</Field>
        <Field label="Date of Birth">{formatDate(kyc.date_of_birth)}</Field>
        <Field label="Identification Country">
          {kyc.identification_country || "N/A"}
        </Field>
        {getAddressFields(kyc).map((field) => (
          <Field key={field.label} label={field.label}>
            {field.value}
          </Field>
        ))}
      </div>
    </Card>
  );
}

// ============================================================================
// TAB: Transactions
// List of wallet transactions carried out by the customer. Backed by
// GET /admin/transactions?user_id={{customerId}}.
// ============================================================================
function TransactionsTab({ customerId }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [sortBy, setSortBy] = useState(undefined);
  const [sortOrder, setSortOrder] = useState(undefined);
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState({ total: 0, last_page: 1, per_page: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      user_id: customerId,
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
  }, [page, customerId, appliedSearch, status, type, sortBy, sortOrder]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const resetPage = () => setPage(1);

  const goToPage = (nextPage) => {
    setLoading(true);
    setPage(nextPage);
  };

  const handleRetry = () => {
    setLoading(true);
    setTransactions([]);
    loadTransactions();
  };

  const pageCount = Math.max(1, meta.last_page);
  const loadingSkeletonCount = Math.min(meta.per_page || 5, 10);

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      {/* Search + filter bar */}
      <div className="flex items-center gap-3 p-4 sm:p-5 flex-wrap">
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
            maxHeight="260px"
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

      {loading ? (
        <div className="p-6">
          {Array.from({ length: loadingSkeletonCount }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 animate-pulse">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
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
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-gray-100 text-left text-gray-400">
                  <th className="font-medium px-6 py-4">Reference</th>
                  <th className="font-medium px-6 py-4">Type</th>
                  <th className="font-medium px-6 py-4">Description</th>
                  <th className="font-medium px-6 py-4">Amount</th>
                  <th className="font-medium px-6 py-4">Date</th>
                  <th className="font-medium px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
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
          </div>
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
        </>
      )}
    </div>
  );
}
