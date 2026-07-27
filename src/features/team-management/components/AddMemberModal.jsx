import { useState } from "react";
import { UserPlus } from "lucide-react";
import ModalShell from "./ModalShell";
import Field, { TextInput } from "./Field";
import RoleSelect from "./RoleSelect";

const emptyForm = { name: "", email: "", phone: "", role: "" };

export default function AddMemberModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(form);
    setForm(emptyForm);
  }

  function handleClose() {
    setForm(emptyForm);
    onClose?.();
  }

  const isValid = form.name.trim() && form.email.trim() && form.role;

  return (
    <ModalShell open={open} onClose={handleClose} title="Add Member">
      <form onSubmit={handleSubmit}>
        <Field label="Full Name" required>
          <TextInput
            type="text"
            placeholder="e.g. Chiamaka Eze"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </Field>

        <Field label="Email Address" required>
          <TextInput
            type="email"
            placeholder="e.g. chiamaka.eze@crystalapp.ng"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Field>

        <Field label="Phone Number">
          <TextInput
            type="tel"
            placeholder="e.g. +234 803 214 5567"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </Field>

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
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
