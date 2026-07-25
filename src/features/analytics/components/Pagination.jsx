// src/components/Pagination.jsx
// Shared footer pagination atom used across every feature's list page.

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  showing,
  total,
  page,
  pages,
  onPrev,
  onNext,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-4 text-sm text-slate-500">
      <span>
        Showing {showing} of {total.toLocaleString("en-NG")}
      </span>
      <div className="flex items-center gap-4">
        <span className="text-slate-700 font-medium">
          Page {page} of {pages}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            disabled={page <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={page >= pages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
