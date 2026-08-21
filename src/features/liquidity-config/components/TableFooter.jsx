import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TableFooter({ showing, total, page, pageCount }) {
  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-gray-500">
        Showing {showing} of {total.toLocaleString()}
      </p>
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-700">
          Page {page} of {pageCount}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
