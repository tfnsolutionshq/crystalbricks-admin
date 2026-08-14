import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

import Layout from "@/shared/components/Layout.jsx";
import Badge from "@/shared/components/Badge.jsx";
import Card from "@/shared/components/Card.jsx";
import Field from "@/shared/components/Field.jsx";
import KebabButton from "@/shared/components/KebabButton.jsx";
import Toggle from "@/shared/components/Toggle.jsx";

import formatDateTime from "@/shared/utils/formatDateTime";

import {
  fetchCustomerDetail,
  toggleCustomerStatus,
} from "@/features/customers/api/customerApi.js";

const TABS = ["Details", "KYC Documents"];

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
            {activeTab === "KYC Documents" && (
              <KycDocumentsTab customer={customer} />
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
          No KYC documents on file for this customer yet.
        </p>
      </Card>
    );
  }

  return (
    <Card title="KYC Documents">
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
