import { AlertTriangle, CheckCircle2 } from "lucide-react";
import ModalShell from "@/shared/components/ModalShell";
import { capitalizeFirst } from "../helpers/teamManagementHelpers";

const ACTION_CONFIG = {
  deactivate: {
    icon: AlertTriangle,
    iconClass: "bg-red-50 text-red-500",
    confirmLabel: "Deactivate",
    confirmClass: "bg-red-500 hover:bg-red-600",
    describe: (name, subject) =>
      `${name} will lose access to the admin panel immediately. You can reactivate this ${subject.toLowerCase()} at any time.`,
  },
  activate: {
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-600",
    confirmLabel: "Activate",
    confirmClass: "bg-emerald-600 hover:bg-emerald-700",
    describe: (name) =>
      `${name} will regain access to the admin panel immediately.`,
  },
};

export default function ConfirmActionModal({
  open,
  action,
  member,
  onClose,
  onConfirm,
  submitting = false,
  error = null,
  subject = "Member",
  title,
  description,
}) {
  if (!member || !action) return null;
  const config = ACTION_CONFIG[action];
  const Icon = config.icon;

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center">
        <span
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${config.iconClass}`}
        >
          <Icon className="w-6 h-6" />
        </span>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          {title ?? `${config.confirmLabel} ${subject}?`}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {description ??
            config.describe(capitalizeFirst(member.name), subject)}
        </p>

        {error && (
          <p className="text-sm text-red-500 mb-4 w-full">{error}</p>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.(member, action)}
            disabled={submitting}
            className={`flex-1 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${config.confirmClass}`}
          >
            {submitting ? "Please wait..." : config.confirmLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
