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
