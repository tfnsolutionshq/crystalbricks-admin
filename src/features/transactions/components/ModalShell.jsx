// ============================================================================
// MODAL (shared shell for this feature)
// A plain centered dialog with a dimmed backdrop. Kept feature-local since
// nothing outside Transactions uses it yet — promote to src/components if a
// second feature needs the same shell.
// ============================================================================
export default function Modal({ onClose, children, className = "" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full max-w-sm bg-white rounded-2xl p-6 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
