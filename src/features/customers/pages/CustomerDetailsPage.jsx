import { Fragment, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/shared/components/DashboardComponents/Layout.jsx";
import {
  Badge,
  Card,
  Field,
  KebabButton,
  Pagination,
  SearchInput,
  FilterPill,
  formatNaira,
} from "@/features/customers/components/GeneralCustomerComponents.jsx";
import { getCustomerById } from "@/features/customers/mocks/customerMockData.js";

const TABS = [
  "Details",
  "KYC Documents",
  "Balances",
  "Transactions",
  "Loans",
  "Audit Log",
];

// ============================================================================
// CUSTOMER DETAILS PAGE
// Reached from a row on CustomersPage (/customers/:id). All six tabs are
// implemented in this single file as small components below — they're
// switched with local state rather than separate routes, matching the
// design (the header stays put, only the panel underneath changes).
// The Transactions tab is the one exception that navigates to a real
// separate subpage (TransactionViewPage) when a row is clicked.
// ============================================================================
export default function CustomerDetailsPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const customer = getCustomerById(customerId);
  const [activeTab, setActiveTab] = useState("Details");

  return (
    <AppLayout activeNavItem="Customers">
      <div className="p-4 sm:p-6 space-y-6 max-w-[1600px]">
        {/* ------------------------------------------------------------------
          HEADER: back button, name, verification/status, kebab menu
      ------------------------------------------------------------------ */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => navigate("/customers")}
              className="w-9 h-9 shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50"
              aria-label="Back to customers"
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {customer.name}
            </h1>
            <Badge>{customer.kyc}</Badge>

            {activeTab === "Details" ? (
              <>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    defaultChecked={customer.status === "Active"}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-checked:bg-blue-500 rounded-full transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                </label>
                {customer.accountNumber && (
                  <span className="text-sm text-blue-600 font-medium whitespace-nowrap">
                    Account Number:{customer.accountNumber}
                  </span>
                )}
              </>
            ) : (
              <Badge>{customer.status}</Badge>
            )}
          </div>
          <KebabButton />
        </div>

        {/* ------------------------------------------------------------------
          TABS
      ------------------------------------------------------------------ */}
        <div className="flex items-center gap-4 sm:gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm -mb-px border-b-2 transition-colors whitespace-nowrap ${
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
        {activeTab === "Details" && <DetailsTab customer={customer} />}
        {activeTab === "KYC Documents" && (
          <KycDocumentsTab customer={customer} />
        )}
        {activeTab === "Balances" && <BalancesTab customer={customer} />}
        {activeTab === "Transactions" && (
          <TransactionsTab customer={customer} />
        )}
        {activeTab === "Loans" && <LoansTab customer={customer} />}
        {activeTab === "Audit Log" && <AuditLogTab customer={customer} />}
      </div>
    </AppLayout>
  );
}

// ============================================================================
// TAB: Details
// Personal / Contact / Bank / Metadata / Next of Kin / Account Officer cards.
// ============================================================================
function DetailsTab({ customer }) {
  const { personal, contact, bank, metadata, nextOfKin, accountOfficer } =
    customer;

  if (!personal) {
    return (
      <Card>
        <p className="text-sm text-gray-400 text-center py-10">
          No further details on file for this customer yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
          <Field label="First Name">{personal.firstName}</Field>
          <Field label="Last Name">{personal.lastName}</Field>
          <Field label="Gender">{personal.gender}</Field>
          <Field label="Date of Birth">{personal.dob}</Field>
          <Field label="Nationality">{personal.nationality}</Field>
        </div>
      </Card>

      <Card title="Contact Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
          <Field label="Phone Number">{contact.phone}</Field>
          <Field label="Email">{contact.email}</Field>
          <div className="sm:col-span-2">
            <Field label="Address">{contact.address}</Field>
          </div>
          <Field label="State">{contact.state}</Field>
          <Field label="Country">{contact.country}</Field>
        </div>
      </Card>

      <Card title="Bank Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
          <Field label="BVN">{bank.bvn}</Field>
          <Field label="Account Number">{bank.accountNumber}</Field>
          <Field label="Bank Name">{bank.bankName}</Field>
          <Field label="Account Name">{bank.accountName}</Field>
          <Field label="Credit Score">{bank.creditScore}</Field>
          <Field label="Credit Rating">
            <Badge>{bank.creditRating}</Badge>
          </Field>
        </div>
      </Card>

      <Card title="Metadata">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
          <Field label="ID">{metadata.id}</Field>
          <Field label="Username">{metadata.username}</Field>
          <Field label="Date created">{metadata.dateCreated}</Field>
          <Field label="Last login">{metadata.lastLogin}</Field>
          <Field label="Date verified">{metadata.dateVerified}</Field>
          <Field label="KYC">
            <Badge>{metadata.kyc}</Badge>
          </Field>
        </div>
      </Card>

      <Card title="Next of Kin">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
          <Field label="First Name">{nextOfKin.firstName}</Field>
          <Field label="Last Name">{nextOfKin.lastName}</Field>
          <Field label="Relationship">{nextOfKin.relationship}</Field>
          <Field label="Phone number">{nextOfKin.phone}</Field>
          <Field label="Email address">{nextOfKin.email}</Field>
          <Field label="Country">{nextOfKin.country}</Field>
          <Field label="State">{nextOfKin.state}</Field>
          <Field label="Address">{nextOfKin.address}</Field>
        </div>
      </Card>

      <Card title="Account Officer">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
          <Field label="First Name">{accountOfficer.firstName}</Field>
          <Field label="Last Name">{accountOfficer.lastName}</Field>
          <Field label="Email address">{accountOfficer.email}</Field>
          <Field label="Phone number">{accountOfficer.phone}</Field>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// TAB: KYC Documents
// Liveness check image + identity document fields/links.
// ============================================================================
function KycDocumentsTab({ customer }) {
  const kyc = customer.kycDocuments;

  if (!kyc) {
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
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-4">Liveness Check</h4>
        <Field label="Image">
          <a href="#" className="text-blue-600 underline">
            {kyc.livenessImage}
          </a>
        </Field>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Identity Document</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
          <Field label="ID Type">{kyc.idType}</Field>
          <Field label="ID Number">{kyc.idNumber}</Field>
          <Field label="Proof of Address">{kyc.proofOfAddress}</Field>
          <Field label="Passport Photo">
            <a href="#" className="text-blue-600 underline">
              {kyc.passportPhoto}
            </a>
          </Field>
          <Field label="Signature Photo">
            <a href="#" className="text-blue-600 underline">
              {kyc.signaturePhoto}
            </a>
          </Field>
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// TAB: Balances
// Wallet / Fixed Deposit / Loans balance table.
// ============================================================================
function BalancesTab({ customer }) {
  const balances = customer.balances || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-400">
              <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                Type
              </th>
              <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                Available
              </th>
              <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                Total
              </th>
              <th className="px-4 sm:px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {balances.map((row) => (
              <tr
                key={row.type}
                className="border-b border-gray-50 last:border-0"
              >
                <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {row.type}
                </td>
                <td className="px-4 sm:px-6 py-4 text-gray-400 line-through whitespace-nowrap">
                  {formatNaira(row.available)}
                </td>
                <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {formatNaira(row.total)}
                </td>
                <td className="px-4 sm:px-6 py-4 text-right">
                  <KebabButton />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 sm:px-6 pb-4">
        <Pagination
          showing={balances.length}
          total={balances.length}
          page={1}
          pageCount={1}
        />
      </div>
    </div>
  );
}

// ============================================================================
// TAB: Transactions
// Search/filter bar + transaction table. Clicking a row navigates to the
// separate TransactionViewPage subpage.
// ============================================================================
function TransactionsTab({ customer }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const transactions = (customer.transactions || []).filter((t) =>
    t.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <SearchInput
          placeholder="Search transaction ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-3 flex-wrap">
          <FilterPill label="Date" />
          <FilterPill label="Type" />
          <FilterPill label="Category" />
          <FilterPill label="Status" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-400">
                <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                  Transaction ID
                </th>
                <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                  Description
                </th>
                <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                  Amount
                </th>
                <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                  Date
                </th>
                <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr
                  key={txn.id}
                  onClick={() =>
                    navigate(`/customers/${customer.id}/transactions/${txn.id}`)
                  }
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 cursor-pointer"
                >
                  <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {txn.id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-500 max-w-xs truncate">
                    {txn.description}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-900 whitespace-nowrap">
                    {formatNaira(txn.amount)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap">
                    {txn.date}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <Badge>{txn.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 sm:px-6 pb-4">
          <Pagination
            showing={transactions.length}
            total={transactions.length}
            page={1}
            pageCount={1}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TAB: Loans
// Shows either the loan detail card, or an empty state if the customer has
// never applied for a loan.
// ============================================================================
function LoansTab({ customer }) {
  const loan = customer.loan;

  if (!loan) {
    return (
      <Card>
        <p className="text-sm text-gray-500 text-center py-16">
          {customer.name} is yet to apply for a loan.
        </p>
      </Card>
    );
  }

  return (
    <Card
      title="Loan Details"
      action={
        <Link to="#" className="text-sm text-blue-600 underline">
          View
        </Link>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5">
        <Field label="Loan Reference ID">
          <span className="underline">{loan.referenceId}</span>
        </Field>
        <Field label="Interest">
          {loan.interestRate} ({formatNaira(loan.interestAmount)})
        </Field>
        <Field label="Amount">{formatNaira(loan.amount)}</Field>
        <Field label="Accepted">{loan.accepted}</Field>
        <Field label="Instalment Amount">
          {formatNaira(loan.instalmentAmount)}
        </Field>
        <Field label="End Date">{loan.endDate}</Field>
        <Field label="Start Date">{loan.startDate}</Field>
        <Field label="Default Payment Method">
          {loan.defaultPaymentMethod}
        </Field>
        <Field label="Period">{loan.period}</Field>
      </div>
    </Card>
  );
}

// ============================================================================
// TAB: Audit Log
// Search/filter bar + activity table grouped by date.
// ============================================================================
function AuditLogTab({ customer }) {
  const groups = customer.auditLog || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <SearchInput placeholder="Search audit logs by action" />
        <div className="flex items-center gap-3 flex-wrap">
          <FilterPill label="Performed by" />
          <FilterPill label="Status" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-400">
                <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                  Time
                </th>
                <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                  Performed by
                </th>
                <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                  Action
                </th>
                <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                  Device
                </th>
                <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                  IP
                </th>
                <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                  Location
                </th>
                <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <Fragment key={group.group}>
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 sm:px-6 pt-5 pb-2 text-sm font-medium text-gray-500"
                    >
                      {group.group}
                    </td>
                  </tr>
                  {group.entries.map((entry, i) => (
                    <tr
                      key={`${group.group}-${i}`}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap">
                        {entry.time}
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {entry.performedBy}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap">
                        {entry.action}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap">
                        {entry.device}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap">
                        {entry.ip}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap">
                        {entry.location}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <Badge>{entry.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
