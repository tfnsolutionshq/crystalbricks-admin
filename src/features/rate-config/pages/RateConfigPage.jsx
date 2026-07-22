import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import AppLayout from "@/shared/components/DashboardComponents/Layout.jsx";

/* -------------------------------------------------------------------------- */
/* Dummy data                                                                  */
/* -------------------------------------------------------------------------- */
/* Exported so the detail page can look up a product by id without a real API */

export const RATE_PRODUCTS = [
  {
    id: "tenor-investment-1",
    name: "Tenor Investment Plan",
    type: "Deposit",
    rates: "8.00% - 10.25%",
    lastUpdated: "Apr 10, 2025",
    effectiveDate: "Jan 1, 2024",
    status: "Active",
  },
  {
    id: "tenor-investment-2",
    name: "Tenor Investment Plan",
    type: "Deposit",
    rates: "8.00% - 10.25%",
    lastUpdated: "Apr 10, 2025",
    effectiveDate: "Jan 1, 2024",
    status: "Active",
  },
  {
    id: "tenor-investment-3",
    name: "Tenor Investment Plan",
    type: "Deposit",
    rates: "8.00% - 10.25%",
    lastUpdated: "Apr 10, 2025",
    effectiveDate: "Jan 1, 2024",
    status: "Active",
  },
  {
    id: "tenor-investment-4",
    name: "Tenor Investment Plan",
    type: "Borrowings",
    rates: "8.00% - 10.25%",
    lastUpdated: "Apr 10, 2025",
    effectiveDate: "Jan 1, 2024",
    status: "Active",
  },
  {
    id: "tenor-investment-5",
    name: "Tenor Investment Plan",
    type: "Borrowings",
    rates: "8.00% - 10.25%",
    lastUpdated: "Apr 10, 2025",
    effectiveDate: "Jan 1, 2024",
    status: "Inactive",
  },
];

const TABS = [
  { key: "contributions", label: "Contributions" },
  { key: "loans", label: "Loans" },
];

/* -------------------------------------------------------------------------- */
/* Small shared bits                                                          */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-600",
    Inactive: "bg-red-50 text-red-500",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function TypeLabel({ type }) {
  const styles = {
    Deposit: "text-amber-600",
    Borrowings: "text-indigo-500",
  };
  return <span className={`text-sm font-medium ${styles[type]}`}>{type}</span>;
}

function DropdownButton({ label, value }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 border border-gray-200 rounded-lg pl-3 pr-2.5 py-2 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors"
    >
      <span className="text-gray-500">{label}</span>
      {value ? (
        <span className="bg-gray-900 text-white text-xs font-medium px-2 py-0.5 rounded-md">
          {value}
        </span>
      ) : (
        <span className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-gray-400">
          <Plus size={11} />
        </span>
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Tabs                                                                        */
/* -------------------------------------------------------------------------- */

function RateConfigTabs({ activeTab, onChange }) {
  return (
    <div className="flex items-center gap-6 border-b border-gray-200">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`pb-3 text-sm font-medium -mb-px border-b-2 transition-colors ${
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
  );
}

/* -------------------------------------------------------------------------- */
/* Filter bar                                                                  */
/* -------------------------------------------------------------------------- */

function FilterBar({ searchValue, onSearchChange }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="relative flex-1 min-w-60 max-w-sm">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search product"
          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
        />
      </div>

      <div className="flex items-center gap-2.5">
        <DropdownButton label="Date" />
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg pl-3 pr-1 py-1 text-sm bg-white">
          <span className="bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md">
            This week
          </span>
        </div>
        <DropdownButton label="Type" />
        <DropdownButton label="Status" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Table                                                                       */
/* -------------------------------------------------------------------------- */

function RateConfigTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-100">
            <th className="font-medium pb-3 pr-4">Product Name</th>
            <th className="font-medium pb-3 pr-4">Type</th>
            <th className="font-medium pb-3 pr-4">Rates</th>
            <th className="font-medium pb-3 pr-4">Last Updated</th>
            <th className="font-medium pb-3 pr-4">Effective Date</th>
            <th className="font-medium pb-3 pr-4">Status</th>
            <th className="font-medium pb-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-50">
              <td className="py-4 pr-4 text-gray-900 font-semibold max-w-45 truncate">
                {row.name}
              </td>
              <td className="py-4 pr-4">
                <TypeLabel type={row.type} />
              </td>
              <td className="py-4 pr-4 text-gray-900">{row.rates}</td>
              <td className="py-4 pr-4 text-gray-500">{row.lastUpdated}</td>
              <td className="py-4 pr-4 text-gray-500">{row.effectiveDate}</td>
              <td className="py-4 pr-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="py-4">
                <Link
                  to={`/rate-config/${row.id}`}
                  className="inline-flex items-center gap-1 bg-pink-600 hover:bg-pink-700 transition-colors text-white text-sm font-medium pl-3.5 pr-2.5 py-2 rounded-lg"
                >
                  Configure
                  <ChevronRight size={15} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Pagination footer                                                          */
/* -------------------------------------------------------------------------- */

function TableFooter({ showing, total, page, pageCount }) {
  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-gray-500">
        Showing {showing} of {total.toLocaleString()}
      </p>
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-700">
          Page {page} of {pageCount}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function RateConfiguration() {
  const [activeTab, setActiveTab] = useState("contributions");
  const [search, setSearch] = useState("");

  return (
    <AppLayout activeNavItem="Rate Config">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <h1 className="text-2xl font-bold text-gray-900">Rate Configuration</h1>

        <RateConfigTabs activeTab={activeTab} onChange={setActiveTab} />

        <FilterBar searchValue={search} onSearchChange={setSearch} />

        <RateConfigTable rows={RATE_PRODUCTS} />

        <TableFooter showing={10} total={4523} page={1} pageCount={46} />
      </div>
    </AppLayout>
  );
}
