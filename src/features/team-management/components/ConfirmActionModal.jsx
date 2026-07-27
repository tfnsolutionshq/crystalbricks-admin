import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import ModalShell from "./ModalShell";

const ACTION_CONFIG = {
  deactivate: {
    icon: AlertTriangle,
    iconClass: "bg-red-50 text-red-500",
    title: "Deactivate Member",
    confirmLabel: "Deactivate",
    confirmClass: "bg-red-500 hover:bg-red-600",
    describe: (name) =>
      `${name} will lose access to the admin panel immediately. You can reactivate this member at any time.`,
  },
  activate: {
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-600",
    title: "Activate Member",
    confirmLabel: "Activate",
    confirmClass: "bg-emerald-600 hover:bg-emerald-700",
    describe: (name) =>
      `${name} will regain access to the admin panel immediately.`,
  },
  remove: {
    icon: Trash2,
    iconClass: "bg-red-50 text-red-500",
    title: "Remove Member",
    confirmLabel: "Remove",
    confirmClass: "bg-red-500 hover:bg-red-600",
    describe: (name) =>
      `This permanently removes ${name} from the team. This action cannot be undone.`,
  },
};

export default function ConfirmActionModal({
  open,
  action,
  member,
  onClose,
  onConfirm,
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
          {config.title}?
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {config.describe(member.name)}
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.(member, action)}
            className={`flex-1 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors ${config.confirmClass}`}
          >
            {config.confirmLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
