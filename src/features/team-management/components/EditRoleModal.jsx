import { useState } from "react";
import { Shield } from "lucide-react";

import ModalShell from "@/shared/components/ModalShell";
import TextInput from "@/shared/components/TextInput";
import Toggle from "@/shared/components/Toggle";

import Field from "./Field";

import { capitalizeFirst } from "../helpers/teamManagementHelpers";
import {
  ROLE_PERMISSIONS,
  buildPermissions,
  getPermissionSelection,
} from "../helpers/rolePermissions";

export default function EditRoleModal({
  open,
  role,
  onClose,
  onSubmit,
  submitting = false,
  error = null,
}) {
  const [name, setName] = useState(() => capitalizeFirst(role?.name ?? ""));
  const [isActive, setIsActive] = useState(role?.is_active ?? true);
  const [permissions, setPermissions] = useState(() =>
    getPermissionSelection(role?.permissions ?? []),
  );

  if (!role) return null;

  function togglePermission(moduleKey, access) {
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [access]: !prev[moduleKey]?.[access],
      },
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(role, {
      name,
      is_active: isActive,
      permissions: buildPermissions(permissions),
    });
  }

  const isValid = name.trim();

  return (
    <ModalShell open={open} onClose={onClose} title="Edit Role Details">
      <form onSubmit={handleSubmit}>
        <Field label="Role Name" required>
          <TextInput
            type="text"
            placeholder="e.g. Manager"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="Status">
          <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2.5">
            <span className="text-sm text-slate-700">
              {isActive ? "Active" : "Inactive"}
            </span>
            <Toggle
              checked={isActive}
              onChange={setIsActive}
              label="Toggle role status"
            />
          </div>
        </Field>

        <Field
          label="Permissions"
          hint="Select the access level for each module."
        >
          <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {ROLE_PERMISSIONS.filter((m) => m.readOnly).map((module) => (
              <div
                key={module.key}
                className="flex items-center justify-between px-3 py-2.5"
              >
                <span className="text-sm font-medium text-slate-700">
                  {module.label}
                </span>
                <Toggle
                  checked={permissions[module.key]?.read ?? false}
                  onChange={() => togglePermission(module.key, "read")}
                  label={`Toggle ${module.label} access`}
                />
              </div>
            ))}
            {ROLE_PERMISSIONS.filter((m) => !m.readOnly).map((module) => (
              <div
                key={module.key}
                className="flex items-center justify-between px-3 py-2.5"
              >
                <span className="text-sm font-medium text-slate-700">
                  {module.label}
                </span>
                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions[module.key]?.read ?? false}
                      onChange={() => togglePermission(module.key, "read")}
                      className="w-4 h-4 rounded accent-pink-600"
                    />
                    Read
                  </label>
                  <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions[module.key]?.write ?? false}
                      onChange={() => togglePermission(module.key, "write")}
                      className="w-4 h-4 rounded accent-pink-600"
                    />
                    Write
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Field>

        {error && <p className="text-sm text-red-500 mt-1 mb-3">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
