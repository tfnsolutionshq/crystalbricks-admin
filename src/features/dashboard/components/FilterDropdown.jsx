import { ChevronDown } from "lucide-react";

export default function FilterDropdown({ label }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
    >
      {label}
      <ChevronDown size={16} />
    </button>
  );
}
