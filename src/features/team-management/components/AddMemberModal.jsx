import { useState } from "react";
import { UserPlus } from "lucide-react";

import ModalShell from "@/shared/components/ModalShell";
import TextInput from "@/shared/components/TextInput";

import Field from "./Field";
import RoleSelect from "./RoleSelect";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone_country_code: "",
  phone_number: "",
  role: "",
};

export default function AddMemberModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
  error = null,
}) {
  const [form, setForm] = useState(emptyForm);

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(form);
  }

  function handleClose() {
    setForm(emptyForm);
    onClose?.();
  }

  const isValid =
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.email.trim() &&
    form.role;

  return (
    <ModalShell open={open} onClose={handleClose} title="Add Member">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="First Name" required>
            <TextInput
              type="text"
              placeholder="e.g. Chiamaka"
              value={form.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
          </Field>
          <Field label="Last Name" required>
            <TextInput
              type="text"
              placeholder="e.g. Eze"
              value={form.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Email Address" required>
          <TextInput
            type="email"
            placeholder="e.g. chiamaka.eze@crystalapp.ng"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Phone Country Code">
            <TextInput
              type="text"
              placeholder="e.g. +234"
              value={form.phone_country_code}
              onChange={(e) =>
                handleChange("phone_country_code", e.target.value)
              }
            />
          </Field>
          <Field label="Phone Number">
            <TextInput
              type="tel"
              placeholder="e.g. 9012345677"
              value={form.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
            />
          </Field>
        </div>

        <Field
          label="Role"
          required
          hint="Determines what this member can access."
        >
          <RoleSelect
            value={form.role}
            onChange={(value) => handleChange("role", value)}
          />
        </Field>

        {error && <p className="text-sm text-red-500 mt-1 mb-3">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={handleClose}
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
            <UserPlus className="w-4 h-4" />
            {submitting ? "Adding..." : "Add Member"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
