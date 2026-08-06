import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

function formatAmount(value) {
  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

export default function AmountRangeFilter({ minAmount, maxAmount, onApply }) {
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(minAmount ?? "");
  const [max, setMax] = useState(maxAmount ?? "");
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActive = minAmount != null || maxAmount != null;
  const maxLabel =
    typeof maxAmount === "number" && !Number.isNaN(maxAmount)
      ? `₦${formatAmount(maxAmount)}`
      : "above";

  const handleApply = () => {
    onApply({
      minAmount: min === "" ? undefined : Number(min),
      maxAmount: max === "" ? undefined : Number(max),
    });
    setOpen(false);
  };

  const handleClear = () => {
    setMin("");
    setMax("");
    onApply({ minAmount: undefined, maxAmount: undefined });
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C2185B] text-white text-sm font-medium hover:bg-[#a8134d] transition-colors cursor-pointer"
      >
        {hasActive
          ? `₦${formatAmount(minAmount ?? 0)} - ${maxLabel}`
          : "Amount"}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-20 space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">
              Min amount
            </label>
            <input
              type="number"
              min="0"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">
              Max amount
            </label>
            <input
              type="number"
              min="0"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder="No limit"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
            />
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
