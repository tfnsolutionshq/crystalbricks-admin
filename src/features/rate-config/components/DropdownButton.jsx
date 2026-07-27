import { Plus } from "lucide-react";

export default function DropdownButton({ label, value }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 border border-gray-200 rounded-lg pl-3 pr-2.5 py-2 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors"
    >
      <span className="text-gray-500">{label}</span>
      {value ? (
        <span className="bg-gray-900 text-white text-xs font-medium px-2 py-0.5 rounded-md">
          {value}
        </span>
      ) : (
        <span className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-gray-400">
          <Plus size={11} />
        </span>
      )}
    </button>
  );
}
