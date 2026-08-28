// src/features/rate-config/components/ConfigDetailsSidebar.jsx
// Slide-over panel revealing the full details of a selected configuration.
// Mirrors the ProductDetailsPanel pattern used on the Products page.

import { useState } from "react";
import { X, Loader2, Pencil, Power, Trash2 } from "lucide-react";

import Badge from "@/shared/components/Badge";

import { getPenaltyTypeLabel } from "@/features/liquidity-config/helpers/rateConfigHelpers";

function Row({ children }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1">{value || "-"}</p>
    </div>
  );
}

export default function ConfigDetailsSidebar({
  config,
  onClose,
  onEdit,
  onToggle,
  onDelete,
}) {
  const [busyAction, setBusyAction] = useState(null);
  if (!config) return null;

  const isActive = config.is_active;

  const rate =
    config.penalty_value != null
      ? `${config.penalty_value}${
          config.penalty_type === "PERCENTAGE" ? "%" : ""
        }`
      : "-";

  const handleToggle = async () => {
    if (busyAction) return;
    setBusyAction(isActive ? "deactivate" : "activate");
    try {
      await onToggle(config, !isActive);
    } finally {
      setBusyAction(null);
    }
  };

  const handleDelete = async () => {
    if (busyAction) return;
    setBusyAction("delete");
    try {
      await onDelete(config);
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/30 animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-100 bg-white h-full shadow-xl overflow-y-auto animate-slide-in-right">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Configuration Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900">{config.name}</h3>
            <Badge variant={isActive ? "success" : "error"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {config.description || "-"}
            </p>
          </div>

          <Row>
            <Field
              label="Penalty Type"
              value={getPenaltyTypeLabel(config.penalty_type)}
            />
            <Field label="Rate" value={rate} />
          </Row>
          <Row>
            <Field
              label="Applies to Accrued Interest"
              value={config.apply_to_accrued_interest ? "Yes" : "No"}
            />
            <Field
              label="Default Config"
              value={config.is_default ? "Yes" : "No"}
            />
          </Row>
          <Field label="Effective Date" value={config.effectiveDate} />

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onEdit(config)}
              className="w-full flex items-center justify-center gap-2 bg-[#C2185B] hover:opacity-90 transition-opacity text-white text-sm font-medium py-3 rounded-lg cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
              Edit configuration
            </button>
            {isActive ? (
              <button
                onClick={handleToggle}
                disabled={busyAction !== null}
                className="w-full flex items-center justify-center gap-2 bg-[#C2185B] hover:opacity-90 transition-opacity text-white text-sm font-medium py-3 rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busyAction === "deactivate" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Power className="h-4 w-4" />
                )}
                Deactivate
              </button>
            ) : (
              <button
                onClick={handleToggle}
                disabled={busyAction !== null}
                className="w-full flex items-center justify-center gap-2 bg-[#C2185B] hover:opacity-90 transition-opacity text-white text-sm font-medium py-3 rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busyAction === "activate" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Power className="h-4 w-4" />
                )}
                Activate
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={busyAction !== null}
              className="w-full flex items-center justify-center gap-2 bg-[#C2185B] hover:opacity-90 transition-opacity text-white text-sm font-medium py-3 rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busyAction === "delete" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}