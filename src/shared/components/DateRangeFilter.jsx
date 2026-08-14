import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function DateRangeFilter({
  startDate,
  endDate,
  onApply,
  label = "Date",
  startLabel = "Start date",
  endLabel = "End date",
  missingStart = "Any",
  missingEnd = "onwards",
}) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(startDate ?? "");
  const [end, setEnd] = useState(endDate ?? "");
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActive = startDate != null || endDate != null;
  const activeStartLabel = startDate ? startDate : missingStart;
  const activeEndLabel = endDate ? endDate : missingEnd;

  const handleApply = () => {
    onApply({
      startDate: start === "" ? undefined : start,
      endDate: end === "" ? undefined : end,
    });
    setOpen(false);
  };

  const handleClear = () => {
    setStart("");
    setEnd("");
    onApply({ startDate: undefined, endDate: undefined });
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {hasActive ? `${activeStartLabel} - ${activeEndLabel}` : label}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-20 space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">
              {startLabel}
            </label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">
              {endLabel}
            </label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
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
