// A small labelled data point used everywhere inside "Details"-style cards
// (Personal Information, Contact Information, Bank Details, ...).
export default function Field({ label, children }) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-1.5">{label}</p>
      <div className="text-sm font-medium text-gray-900">{children}</div>
    </div>
  );
}
