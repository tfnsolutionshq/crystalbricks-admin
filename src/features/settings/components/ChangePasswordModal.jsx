// src/features/settings/components/ChangePasswordModal.jsx

import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import Modal from "@/features/team-management/components/ModalShell";
import Field, { TextInput } from "@/features/team-management/components/Field";
import { Badge } from "@/features/customers/components/GeneralCustomerComponents";
import { getPasswordStrength } from "@/features/settings/helpers/settingsHelpers";

const emptyForm = { current: "", next: "", confirm: "" };

export default function ChangePasswordModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [reveal, setReveal] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleReveal(key) {
    setReveal((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleClose() {
    setForm(emptyForm);
    onClose?.();
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(form);
    setForm(emptyForm);
  }

  const strength = getPasswordStrength(form.next);
  const passwordsMatch =
    form.confirm.length === 0 || form.confirm === form.next;
  const isValid =
    form.current.trim() &&
    form.next.trim().length >= 8 &&
    form.confirm === form.next;

  return (
    <Modal open={open} onClose={handleClose} title="Change Password">
      <form onSubmit={handleSubmit}>
        <Field label="Current Password" required>
          <div className="relative">
            <TextInput
              type={reveal.current ? "text" : "password"}
              placeholder="Enter current password"
              value={form.current}
              onChange={(e) => handleChange("current", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => toggleReveal("current")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              tabIndex={-1}
            >
              {reveal.current ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </Field>

        <Field
          label="New Password"
          required
          hint="Use at least 8 characters, with a mix of letters, numbers and symbols."
        >
          <div className="relative">
            <TextInput
              type={reveal.next ? "text" : "password"}
              placeholder="Enter new password"
              value={form.next}
              onChange={(e) => handleChange("next", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => toggleReveal("next")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              tabIndex={-1}
            >
              {reveal.next ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {form.next && (
            <div className="mt-2">
              <Badge variant={strength.variant}>{strength.label}</Badge>
            </div>
          )}
        </Field>

        <Field label="Confirm New Password" required>
          <div className="relative">
            <TextInput
              type={reveal.confirm ? "text" : "password"}
              placeholder="Re-enter new password"
              value={form.confirm}
              onChange={(e) => handleChange("confirm", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => toggleReveal("confirm")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              tabIndex={-1}
            >
              {reveal.confirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {!passwordsMatch && (
            <p className="text-xs text-red-500 mt-1.5">
              Passwords do not match.
            </p>
          )}
        </Field>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            Save Password
          </button>
        </div>
      </form>
    </Modal>
  );
}
