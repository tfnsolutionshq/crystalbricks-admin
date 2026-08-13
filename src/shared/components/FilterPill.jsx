// A dropdown-style filter chip, e.g. "Type +", "Status +". Purely visual —
// wire up `onClick` to open your real dropdown/menu implementation.
export default function FilterPill({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 whitespace-nowrap cursor-pointer"
    >
      {label}
      <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] leading-none text-gray-400">
        +
      </span>
    </button>
  );
}
