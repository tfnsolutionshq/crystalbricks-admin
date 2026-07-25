// src/components/FilterPill.jsx
// Shared filter-bar atom: a label pill with a "+" affordance, paired with a
// value pill (e.g. "Date [+]" next to "This year"). Reused across feature
// list pages wherever a filter bar appears.

import { Plus } from "lucide-react";

export default function FilterPill({ label, value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 shrink-0"
    >
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 transition-colors">
        {label}
        <Plus className="w-3.5 h-3.5 text-slate-400" />
      </span>
      {value && (
        <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-sm font-medium text-slate-700 whitespace-nowrap">
          {value}
        </span>
      )}
    </button>
  );
}
