import { Search } from "lucide-react";
import DropdownButton from "@/features/rate-config/components/DropdownButton";

export default function FilterBar({ searchValue, onSearchChange }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="relative flex-1 min-w-60 max-w-sm">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search product"
          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
        />
      </div>

      <div className="flex items-center gap-2.5">
        <DropdownButton label="Date" />
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg pl-3 pr-1 py-1 text-sm bg-white">
          <span className="bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md">
            This week
          </span>
        </div>
        <DropdownButton label="Type" />
        <DropdownButton label="Status" />
      </div>
    </div>
  );
}
