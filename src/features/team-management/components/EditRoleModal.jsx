import { useEffect, useState } from "react";
import ModalShell from "./ModalShell";
import Field from "./Field";
import RoleSelect from "./RoleSelect";
import {
  getInitials,
  getAvatarColor,
} from "@/features/team-management/helpers/teamManagementHelpers";

export default function EditRoleModal({ open, member, onClose, onSubmit }) {
  const [role, setRole] = useState(member?.role || "");

  // Keep the local role selection in sync whenever a different member is opened.
  useEffect(() => {
    setRole(member?.role || "");
  }, [member]);

  if (!member) return null;

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(member, role);
  }

  return (
    <ModalShell open={open} onClose={onClose} title="Edit Member Role">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 mb-5 bg-slate-50 rounded-xl px-4 py-3">
          <span
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${getAvatarColor(
              member.name,
            )}`}
          >
            {getInitials(member.name)}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {member.name}
            </p>
            <p className="text-xs text-slate-500 truncate">{member.email}</p>
          </div>
        </div>

        <Field
          label="Role"
          required
          hint="Changing this updates what the member can access immediately."
        >
          <RoleSelect value={role} onChange={setRole} />
        </Field>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!role}
            className="px-5 py-2.5 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
