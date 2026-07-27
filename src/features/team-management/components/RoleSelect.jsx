import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { TEAM_ROLES } from "@/features/team-management/mocks/teamManagementMockData";

export default function RoleSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = TEAM_ROLES.find((role) => role.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
      >
        <span className={selected ? "text-slate-700" : "text-slate-400"}>
          {selected ? selected.label : "Select a role"}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-slate-100 py-1.5">
          {TEAM_ROLES.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => {
                onChange(role.value);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <span>
                <span className="block font-medium text-slate-700">
                  {role.label}
                </span>
                <span className="block text-xs text-slate-400">
                  {role.description}
                </span>
              </span>
              {role.value === value && (
                <Check className="w-4 h-4 text-pink-600 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
