import { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowUpDown } from "lucide-react";

const SORT_FIELDS = [
  { id: "amount", label: "Amount" },
  { id: "date", label: "Date" },
];

const SORT_ORDERS = [
  { id: "asc", label: "Ascending" },
  { id: "desc", label: "Descending" },
];

export default function SortDropdown({ sortBy, sortOrder, onApply }) {
  const [open, setOpen] = useState(false);
  const [field, setField] = useState(sortBy ?? "amount");
  const [order, setOrder] = useState(sortOrder ?? "asc");
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActive = Boolean(sortBy);
  const fieldLabel = SORT_FIELDS.find((f) => f.id === sortBy)?.label ?? "";
  const orderLabel = SORT_ORDERS.find((o) => o.id === sortOrder)?.label ?? "";

  const handleApply = () => {
    onApply({
      sortBy: field === "" ? undefined : field,
      sortOrder: field === "" ? undefined : order,
    });
    setOpen(false);
  };

  const handleClear = () => {
    onApply({ sortBy: undefined, sortOrder: undefined });
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 transition-colors cursor-pointer"
      >
        <ArrowUpDown size={16} />
        {hasActive ? `${fieldLabel} · ${orderLabel}` : "Sort"}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-20 space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Sort by</label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
            >
              {SORT_FIELDS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Order</label>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
            >
              {SORT_ORDERS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 px-3 py-2 rounded-lg bg-[#C2185B] hover:bg-[#a8134d] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
