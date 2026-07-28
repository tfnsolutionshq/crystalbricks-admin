import { X } from "lucide-react";

/**
 * Generic modal/dialog shell. Cross-feature atom — lives in shared
 * src/components since every feature that needs a confirmation dialog
 * or form modal can reuse it.
 *
 * Usage:
 *   <Modal open={open} onClose={() => setOpen(false)} title="Approve KYC Documents">
 *     ...body...
 *   </Modal>
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}

/** Shared footer row used by nearly every modal (Cancel + primary action). */
export function ModalFooter({ children }) {
  return (
    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
      {children}
    </div>
  );
}
