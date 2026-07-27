export default function Field({ label, children, hint, required = false }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

// Added for Team Management (role dropdowns) — shared going forward for any
// feature that needs a plain select input styled to match TextInput.
export function Select({ options = [], className = "", ...props }) {
  return (
    <select
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300 ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
