// ============================================================================
// SHARED UI ATOMS
// Tiny presentational pieces reused by CustomersPage, CustomerDetailsPage and
// TransactionViewPage. Kept here (not duplicated per page) since they carry
// no page-specific logic.
// ============================================================================

export function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex-1">
      <p className="text-sm text-gray-400 mb-2">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
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
