import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Check, RefreshCw } from "lucide-react";
import { fetchRoles } from "@/features/team-management/api/teamManagementApi";
import { capitalizeFirst } from "@/features/team-management/helpers/teamManagementHelpers";

export default function RoleSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ref = useRef(null);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRoles();
      // API returns { status, message, data: [...] }
      const list = response?.data ?? [];
      setRoles(list.filter((r) => r.is_active));
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "Failed to load roles.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = roles.find((r) => r.name === value || r.id === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => !loading && !error && setOpen((prev) => !prev)}
        disabled={loading || !!error}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center gap-2 text-slate-400">
            <span className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-pink-500 animate-spin" />
            Loading roles...
          </span>
        ) : error ? (
          <span className="text-slate-400">Unable to load roles</span>
        ) : (
          <span className={selected ? "text-slate-700" : "text-slate-400"}>
            {selected ? capitalizeFirst(selected.name) : "Select a role"}
          </span>
        )}
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {/* Retry button shown on error */}
      {error && !loading && (
        <div className="mt-1.5 flex items-center gap-2">
          <p className="text-xs text-red-500">{error}</p>
          <button
            type="button"
            onClick={loadRoles}
            className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 font-medium cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {open && !loading && !error && roles.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-slate-100 py-1.5">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => {
                onChange(role.name);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="block font-medium text-slate-700">
                {capitalizeFirst(role.name)}
              </span>
              {(role.name === value || role.id === value) && (
                <Check className="w-4 h-4 text-pink-600 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
