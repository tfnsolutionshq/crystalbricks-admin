import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function FilterDropdown({ label, options, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Backward compatible: static button when no options are passed
  if (!options) {
    return (
      <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 font-medium">
        {label}
        <ChevronDown size={16} />
      </button>
    );
  }

  const activeOption = options.find((o) => o.id === selected);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {activeOption?.buttonLabel}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                setOpen(false);
              }}
              className={`w-[calc(100%-8px)] mx-1 flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                option.id === selected ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <span
                className={
                  option.id === selected
                    ? "text-gray-900 font-medium"
                    : "text-gray-600"
                }
              >
                {option.menuLabel}
              </span>
              {option.id === selected && (
                <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-blue-600" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
