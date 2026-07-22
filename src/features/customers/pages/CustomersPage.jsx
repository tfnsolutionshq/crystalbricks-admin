import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/shared/components/DashboardComponents/Layout.jsx";
import {
  Badge,
  StatCard,
  FilterPill,
  SearchInput,
  Pagination,
} from "@/features/customers/components/GeneralCustomerComponents.jsx";
import {
  customers,
  customerStats,
} from "@/features/customers/mocks/customerMockData.js";

// ============================================================================
// CUSTOMERS PAGE
// Main landing page for the Customers section. Everything specific to this
// screen — the header, the 3 stat cards, the search/filter bar and the
// customer table — lives in this one file, split into clearly labelled
// sections below. Clicking a row routes to /customers/:id (CustomerDetailsPage).
// ============================================================================
export default function CustomersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <AppLayout activeNavItem="Customers">
      <div className="p-4 sm:p-6 space-y-6 max-w-[1600px]">
        {/* ------------------------------------------------------------------
          PAGE HEADER: title + Export button
      ------------------------------------------------------------------ */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Customers
          </h1>
          <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            Export
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M4 21h16" />
            </svg>
          </button>
        </div>

        {/* ------------------------------------------------------------------
          STAT CARDS
      ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Total Customers"
            value={customerStats.totalCustomers.toLocaleString()}
          />
          <StatCard
            label="Total Active"
            value={customerStats.totalActive.toLocaleString()}
          />
          <StatCard
            label="Inactive"
            value={customerStats.inactive.toLocaleString()}
          />
        </div>

        {/* ------------------------------------------------------------------
          SEARCH + FILTER BAR
      ------------------------------------------------------------------ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <SearchInput
            placeholder="Search customer name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-3 flex-wrap">
            <FilterPill label="Created" />
            <span className="px-3.5 py-2 rounded-lg bg-gray-100 text-sm text-gray-600 font-medium">
              This week
            </span>
            <FilterPill label="Type" />
            <FilterPill label="KYC" />
            <FilterPill label="Status" />
          </div>
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
                    KYC
                  </th>
                  <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                    Type
                  </th>
                  <th className="font-medium px-4 sm:px-6 py-4 whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 cursor-pointer"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 text-xs font-semibold flex items-center justify-center shrink-0">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <span className="font-medium text-gray-900 whitespace-nowrap">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap">
                      {customer.email}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap">
                      {customer.phone}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <Badge>{customer.kyc}</Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <Badge>{customer.type}</Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <Badge>{customer.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 sm:px-6 pb-4">
            <Pagination
              showing={filteredCustomers.length}
              total={4523}
              page={1}
              pageCount={46}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
