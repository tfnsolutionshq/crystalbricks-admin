// src/features/rate-config/components/AddConfigurationModal.jsx
// Modal for creating a new liquidation penalty rate configuration.
// When an `initial` config is provided, it switches to edit mode and
// calls `onUpdate` instead of `onSave`.

import { useState } from "react";
import { Loader2 } from "lucide-react";

import Modal from "@/shared/components/ModalShell";
import {
  TextInput,
  TextArea,
  Select,
  SuffixInput,
  Checkbox,
} from "@/features/products/components/FormFields";

import {
  PENALTY_TYPE_LABELS,
  PENALTY_TYPE_OPTIONS,
} from "@/features/rate-config/helpers/rateConfigHelpers";

export default function AddConfigurationModal({
  open,
  onClose,
  onSave,
  onUpdate,
  initial = null,
}) {
  const [form, setForm] = useState(() =>
    initial
      ? {
          name: initial.name ?? "",
          penalty_type: initial.penalty_type ?? "PERCENTAGE",
          penalty_value: initial.penalty_value ?? "",
          apply_to_accrued_interest: initial.apply_to_accrued_interest ?? true,
          is_default: initial.is_default ?? false,
          description: initial.description ?? "",
        }
      : {
          name: "",
          penalty_type: "PERCENTAGE",
          penalty_value: "",
          apply_to_accrued_interest: true,
          is_default: false,
          description: "",
        },
  );
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(initial);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggle = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.checked }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        penalty_type: form.penalty_type,
        penalty_value: form.penalty_value
          ? Number(form.penalty_value)
          : null,
        apply_to_accrued_interest: form.apply_to_accrued_interest,
        is_default: form.is_default,
        description: form.description || null,
      };
      if (isEditing) {
        await onUpdate(initial.id, payload);
      } else {
        await onSave(payload);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Configuration" : "Add Configuration"}
    >
      <div className="space-y-4">
        <TextInput
          label="Product Name"
          placeholder="Enter product name"
          value={form.name}
          onChange={update("name")}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Penalty Type"
            options={PENALTY_TYPE_OPTIONS}
            display={(opt) => PENALTY_TYPE_LABELS[opt] ?? opt}
            value={form.penalty_type}
            onChange={update("penalty_type")}
          />
          <SuffixInput
            label="Penalty Value"
            suffix={form.penalty_type === "PERCENTAGE" ? "%" : "₦"}
            placeholder="Enter penalty value"
            value={form.penalty_value}
            onChange={update("penalty_value")}
          />
        </div>
        <TextArea
          label="Description"
          placeholder="Enter description"
          value={form.description}
          onChange={update("description")}
        />
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Checkbox
            label="Apply to accrued interest"
            checked={form.apply_to_accrued_interest}
            onChange={toggle("apply_to_accrued_interest")}
          />
          <Checkbox
            label="Set as default"
            checked={form.is_default}
            onChange={toggle("is_default")}
          />
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100 flex gap-4">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 text-sm font-medium py-3 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 transition-colors text-white text-sm font-medium py-3 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : isEditing ? "Update" : "Save"}
        </button>
      </div>
    </Modal>
  );
}