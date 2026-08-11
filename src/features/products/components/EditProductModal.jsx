import { useState } from "react";
import { X } from "lucide-react";
import { TextInput, TextArea, Select, SuffixInput } from "./FormFields";
import {
  STATUS_OPTIONS,
  PAYOUT_FREQUENCY_OPTIONS,
  capitalizeLabel,
} from "../mocks/productsMockData";

function getInitialForm(product, kind) {
  if (kind === "loan") {
    return {
      id: product.id,
      name: product.name ?? "",
      description: product.description ?? "",
      min_interest_rate:
        product.min_interest_rate ?? product.percentage_per_annum ?? "",
      max_interest_rate: product.max_interest_rate ?? "",
      min_amount: product.min_amount ?? product.minimum_amount ?? "",
      max_amount: product.max_amount ?? product.maxAmount ?? "",
      processing_fee_percentage: product.processing_fee_percentage ?? "",
      is_active: product.is_active,
    };
  }

  return {
    id: product.id,
    name: product.name ?? "",
    description: product.description ?? "",
    minimum_amount: product.minimum_amount ?? "",
    maximum_amount: product.maximum_amount ?? "",
    roi_percentage: product.roi_percentage ?? "",
    payout_frequency: product.payout_frequency ?? "",
    payout_cycle_in_months:
      product.payout_cycle_in_months ?? product.payoutCycleInMonths ?? "",
    is_active: product.is_active,
  };
}

export default function EditProductModal({ product, kind, onClose, onSave }) {
  const [form, setForm] = useState(() => getInitialForm(product, kind));

  if (!product) return null;

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const updateIsActive = (e) =>
    setForm((f) => ({ ...f, is_active: e.target.value === "Active" }));

  const handleSave = () => onSave(form);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {kind === "loan" ? (
          <>
            <TextInput
              label="Name"
              value={form.name}
              onChange={update("name")}
            />
            <TextArea
              label="Description"
              value={form.description}
              onChange={update("description")}
            />
            <div className="grid grid-cols-2 gap-4">
              <SuffixInput
                label="Min Interest Rate"
                suffix="%"
                value={form.min_interest_rate}
                onChange={update("min_interest_rate")}
              />
              <SuffixInput
                label="Max Interest Rate"
                suffix="%"
                value={form.max_interest_rate}
                onChange={update("max_interest_rate")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SuffixInput
                label="Minimum Amount"
                suffix="₦"
                value={form.min_amount}
                onChange={update("min_amount")}
              />
              <SuffixInput
                label="Maximum Amount"
                suffix="₦"
                value={form.max_amount}
                onChange={update("max_amount")}
              />
            </div>
            <SuffixInput
              label="Processing Fee Percentage"
              suffix="%"
              value={form.processing_fee_percentage}
              onChange={update("processing_fee_percentage")}
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={form.is_active ? "Active" : "Inactive"}
              onChange={updateIsActive}
            />
          </>
        ) : (
          <>
            <TextInput
              label="Name"
              value={form.name}
              onChange={update("name")}
            />
            <TextArea
              label="Description"
              value={form.description}
              onChange={update("description")}
            />
            <div className="grid grid-cols-2 gap-4">
              <SuffixInput
                label="Minimum Amount"
                suffix="₦"
                value={form.minimum_amount}
                onChange={update("minimum_amount")}
              />
              <SuffixInput
                label="Maximum Amount"
                suffix="₦"
                value={form.maximum_amount}
                onChange={update("maximum_amount")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SuffixInput
                label="ROI Percentage"
                suffix="%"
                value={form.roi_percentage}
                onChange={update("roi_percentage")}
              />
              <Select
                label="Payout Frequency"
                options={PAYOUT_FREQUENCY_OPTIONS}
                display={capitalizeLabel}
                value={form.payout_frequency}
                onChange={update("payout_frequency")}
              />
            </div>
            <SuffixInput
              label="Payout Cycle (Months)"
              suffix="months"
              value={form.payout_cycle_in_months}
              onChange={update("payout_cycle_in_months")}
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={form.is_active ? "Active" : "Inactive"}
              onChange={updateIsActive}
            />
          </>
        )}

        <div className="border-t border-gray-100 pt-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 text-sm font-medium py-3 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#C2185B] hover:opacity-90 transition-opacity text-white text-sm font-medium py-3 rounded-lg cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
