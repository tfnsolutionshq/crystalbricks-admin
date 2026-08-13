import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import {
  TextInput,
  TextArea,
  Select,
  SuffixInput,
  Checkbox,
} from "./FormFields";
import {
  LOAN_TYPE_OPTIONS,
  TENOR_OPTIONS,
  STATUS_OPTIONS,
  PAYOUT_FREQUENCY_OPTIONS,
  capitalizeLabel,
} from "../mocks/productsMockData";

const emptyLoanForm = {
  type: "",
  name: "",
  description: "",
  rate: "",
  tenor: "",
  minAmount: "",
  maxAmount: "",
  minAge: "",
  maxAge: "",
  status: "Active",
  eligibilityCriteria: [
    "Applicants must be at least 18 years and not more than 55 years old",
    "Applicant must be a confirmed staff.",
    "",
  ],
  supportingDocuments: [
    { name: "CAC Incorporation Documents", mandatory: true },
    { name: "", mandatory: false },
  ],
};

const emptyFdForm = {
  name: "",
  description: "",
  minimum_amount: "",
  maximum_amount: "",
  roi_percentage: "",
  payout_frequency: "",
  payout_cycle_in_months: "",
  is_active: true,
};

export default function AddProductModal({ kind, onClose, onSave }) {
  const [form, setForm] = useState(
    kind === "loan" ? emptyLoanForm : emptyFdForm,
  );

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const updateIsActive = (e) =>
    setForm((f) => ({ ...f, is_active: e.target.value === "Active" }));

  const updateCriterion = (index) => (e) => {
    const next = [...form.eligibilityCriteria];
    next[index] = e.target.value;
    setForm((f) => ({ ...f, eligibilityCriteria: next }));
  };

  const addCriterion = () =>
    setForm((f) => ({
      ...f,
      eligibilityCriteria: [...f.eligibilityCriteria, ""],
    }));

  const removeCriterion = (index) =>
    setForm((f) => ({
      ...f,
      eligibilityCriteria: f.eligibilityCriteria.filter((_, i) => i !== index),
    }));

  const updateDocument = (index, key) => (eOrValue) => {
    const next = [...form.supportingDocuments];
    next[index] = {
      ...next[index],
      [key]:
        key === "mandatory" ? eOrValue.target.checked : eOrValue.target.value,
    };
    setForm((f) => ({ ...f, supportingDocuments: next }));
  };

  const addDocument = () =>
    setForm((f) => ({
      ...f,
      supportingDocuments: [
        ...f.supportingDocuments,
        { name: "", mandatory: false },
      ],
    }));

  const removeDocument = (index) =>
    setForm((f) => ({
      ...f,
      supportingDocuments: f.supportingDocuments.filter((_, i) => i !== index),
    }));

  const handleSave = () => onSave(form);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {kind === "loan" ? "Add Loan product" : "Add Contribution"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {kind === "loan" ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Loan Type"
                options={LOAN_TYPE_OPTIONS}
                value={form.type}
                onChange={update("type")}
              />
              <TextInput
                label="Loan Name"
                placeholder="Enter loan name"
                value={form.name}
                onChange={update("name")}
              />
            </div>

            <TextArea
              label="Description"
              placeholder="Enter product description"
              value={form.description}
              onChange={update("description")}
            />

            <div className="grid grid-cols-2 gap-4">
              <SuffixInput
                label="Rate"
                suffix="%"
                placeholder="Enter interest rate"
                value={form.rate}
                onChange={update("rate")}
              />
              <Select
                label="Tenor"
                options={TENOR_OPTIONS}
                value={form.tenor}
                onChange={update("tenor")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SuffixInput
                label="Minimum Amount (Optional)"
                suffix="₦"
                placeholder="Enter min amount"
                value={form.minAmount}
                onChange={update("minAmount")}
              />
              <SuffixInput
                label="Maximum Amount (Optional)"
                suffix="₦"
                placeholder="Enter max amount"
                value={form.maxAmount}
                onChange={update("maxAmount")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Minimum Age (Optional)"
                placeholder="Enter min age"
                value={form.minAge}
                onChange={update("minAge")}
              />
              <TextInput
                label="Maximum Age (Optional)"
                placeholder="Enter max age"
                value={form.maxAge}
                onChange={update("maxAge")}
              />
            </div>

            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={update("status")}
            />

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">
                  Eligibility Criteria (Text Requirements)
                </h3>
                <button
                  onClick={addCriterion}
                  className="flex items-center gap-1 text-[#C2185B] text-sm font-medium"
                >
                  Add Criterion <Plus size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {form.eligibilityCriteria.map((value, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={value}
                      onChange={updateCriterion(i)}
                      placeholder="Enter eligibility requirement"
                      className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-[#C2185B]"
                    />
                    <button
                      onClick={() => removeCriterion(i)}
                      className="w-11 h-11 flex items-center justify-center bg-gray-50 hover:bg-red-50 rounded-lg text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">
                  Supporting Documents (Upload Requirements)
                </h3>
                <button
                  onClick={addDocument}
                  className="flex items-center gap-1 text-[#C2185B] text-sm font-medium"
                >
                  Add Document <Plus size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {form.supportingDocuments.map((doc, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={doc.name}
                      onChange={updateDocument(i, "name")}
                      placeholder="Document name (E.g Bank Statements)"
                      className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-[#C2185B]"
                    />
                    <div className="border border-gray-200 rounded-lg px-4 py-3">
                      <Checkbox
                        label="Mandatory"
                        checked={doc.mandatory}
                        onChange={updateDocument(i, "mandatory")}
                      />
                    </div>
                    <button
                      onClick={() => removeDocument(i)}
                      className="w-11 h-11 flex items-center justify-center bg-gray-50 hover:bg-red-50 rounded-lg text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <TextInput
              label="Name"
              placeholder="Enter plan name"
              value={form.name}
              onChange={update("name")}
            />
            <TextArea
              label="Description"
              placeholder="Enter plan description"
              value={form.description}
              onChange={update("description")}
            />
            <div className="grid grid-cols-2 gap-4">
              <SuffixInput
                label="Minimum Amount"
                suffix="₦"
                placeholder="Enter minimum amount"
                value={form.minimum_amount}
                onChange={update("minimum_amount")}
              />
              <SuffixInput
                label="Maximum Amount"
                suffix="₦"
                placeholder="Enter maximum amount"
                value={form.maximum_amount}
                onChange={update("maximum_amount")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SuffixInput
                label="ROI Percentage"
                suffix="%"
                placeholder="Enter ROI percentage"
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
              placeholder="Enter payout cycle in months"
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
            className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 text-sm font-medium py-3 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#C2185B] hover:opacity-90 transition-opacity text-white text-sm font-medium py-3 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
