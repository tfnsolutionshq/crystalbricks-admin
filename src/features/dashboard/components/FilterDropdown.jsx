import { ChevronDown } from "lucide-react";

export default function FilterDropdown({ label }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium px-4 py-2 rounded-lg"
    >
      {label}
      <ChevronDown size={16} />
    </button>
  );
}
