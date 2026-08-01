// Bottom-of-table pagination footer: "Showing X of Y" ... "Page A of B" <> .
export default function Pagination({ showing, total, page, pageCount }) {
  return (
    <div className="flex items-center justify-between px-1 pt-4 text-sm text-gray-400">
      <span>
        Showing {showing} of {total}
      </span>
      <div className="flex items-center gap-3">
        <span>
          Page {page} of {pageCount}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={page <= 1}
            className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            disabled={page >= pageCount}
            className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
