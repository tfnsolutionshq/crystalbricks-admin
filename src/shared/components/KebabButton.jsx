// The "•••" icon button seen top-right of cards/pages (kebab menu trigger).
export default function KebabButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50"
      aria-label="More options"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <circle cx="5" cy="12" r="1.6" />
        <circle cx="12" cy="12" r="1.6" />
        <circle cx="19" cy="12" r="1.6" />
      </svg>
    </button>
  );
}
