// ============================================================================
// SHARED UI ATOMS
// Tiny presentational pieces reused by CustomersPage, CustomerDetailsPage and
// TransactionViewPage. Kept here (not duplicated per page) since they carry
// no page-specific logic.
// ============================================================================

// Colour map for every status/kyc/type pill that shows up across the designs.
const BADGE_STYLES = {
  // KYC / general success states
  Verified: "bg-green-50 text-green-600",
  Completed: "bg-green-50 text-green-600",
  Active: "bg-blue-50 text-blue-600",
  // Neutral / in-progress
  Pending: "bg-gray-100 text-gray-500",
  "In progress": "bg-orange-50 text-orange-500",
  // Negative states
  Rejected: "bg-red-50 text-red-500",
  Inactive: "bg-red-50 text-red-500",
  Failed: "bg-red-50 text-red-500",
  Blocked: "bg-red-50 text-red-500",
  // Customer type
  Individual: "bg-purple-50 text-purple-500",
  Corporate: "bg-blue-50 text-blue-500",
};

export function Badge({ children }) {
  const style = BADGE_STYLES[children] || "bg-gray-100 text-gray-500";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style}`}
    >
      {children}
    </span>
  );
}

export function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex-1">
      <p className="text-sm text-gray-400 mb-2">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

// A dropdown-style filter chip, e.g. "Type +", "Status +". Purely visual —
// wire up `onClick` to open your real dropdown/menu implementation.
export function FilterPill({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 whitespace-nowrap"
    >
      {label}
      <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] leading-none text-gray-400">
        +
      </span>
    </button>
  );
}

export function SearchInput({ placeholder, value, onChange }) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 bg-white flex-1 min-w-55">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-4 h-4 text-gray-400 shrink-0"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="text-sm outline-none w-full placeholder:text-gray-400"
      />
    </div>
  );
}

// Bottom-of-table pagination footer: "Showing X of Y" ... "Page A of B" <> .
export function Pagination({ showing, total, page, pageCount }) {
  return (
    <div className="flex items-center justify-between px-1 pt-4 text-sm text-gray-400">
      <span>
        Showing {showing} of {total}
      </span>
      <div className="flex items-center gap-3">
        <span>
          Page {page} of {pageCount}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={page <= 1}
            className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40"
            aria-label="Previous page"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            disabled={page >= pageCount}
            className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40"
            aria-label="Next page"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// The "•••" icon button seen top-right of cards/pages (kebab menu trigger).
export function KebabButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50"
      aria-label="More options"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <circle cx="5" cy="12" r="1.6" />
        <circle cx="12" cy="12" r="1.6" />
        <circle cx="19" cy="12" r="1.6" />
      </svg>
    </button>
  );
}

// A small labelled data point used everywhere inside "Details"-style cards
// (Personal Information, Contact Information, Bank Details, ...).
export function Field({ label, children }) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-1.5">{label}</p>
      <div className="text-sm font-medium text-gray-900">{children}</div>
    </div>
  );
}

// Card wrapper used across Details/KYC/Loans tabs.
export function Card({ title, action, children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
