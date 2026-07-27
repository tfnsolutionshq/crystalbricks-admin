// src/components/Toggle.jsx
// NEW SHARED ATOM — an on/off switch, used by Settings > Security (2FA)
// and reusable by any future feature needing a boolean toggle control.

export default function Toggle({ checked, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-100 disabled:opacity-40 disabled:cursor-not-allowed ${
        checked ? "bg-pink-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5.5" : "translate-x-1"
        }`}
      />
    </button>
  );
}
