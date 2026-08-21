// src/features/rate-config/pages/RateConfigPage.jsx
// Main page for the Rate Configuration feature. Admins manage the
// liquidation penalty rate configurations for contribution products.
// No tabs — just a list of all active and inactive configurations.
// Clicking a row reveals a sidebar with the full details and Edit/Delete
// actions.

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Layout from "@/shared/components/Layout";

import RateConfigTable from "@/features/liquidity-config/components/LiquidityConfigTable";
import AddConfigurationModal from "@/features/liquidity-config/components/AddConfigurationModal";
import ConfigDetailsSidebar from "@/features/liquidity-config/components/ConfigDetailsSidebar";

import formatDateTime from "@/shared/utils/formatDateTime";

import {
  fetchLiquidityPenaltyConfigs,
  createLiquidityPenaltyConfig,
  updateLiquidityPenaltyConfig,
  deleteLiquidityPenaltyConfig,
} from "@/features/liquidity-config/api/rateConfigApi";

function normalizeConfig(item) {
  return {
    id: item.id,
    name: item.name,
    penalty_type: item.penalty_type,
    penalty_value: item.penalty_value,
    apply_to_accrued_interest: item.apply_to_accrued_interest,
    is_active: item.is_active,
    is_default: item.is_default,
    description: item.description,
    effectiveDate: formatDateTime(item.created_at),
    created_at: item.created_at,
  };
}

export default function LiquidityConfiguration() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [viewingConfig, setViewingConfig] = useState(null);

  const loadConfigs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLiquidityPenaltyConfigs();
      const payload = res?.data ?? res;
      const list = Array.isArray(payload) ? payload : payload?.data ?? [];
      const normalized = list.map(normalizeConfig);
      setConfigs(normalized);
      return normalized;
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const handleAdd = async (form) => {
    await createLiquidityPenaltyConfig(form);
    setIsAddOpen(false);
    await loadConfigs();
  };

  const handleUpdate = async (id, form) => {
    await updateLiquidityPenaltyConfig(id, form);
    setEditingConfig(null);
    setIsAddOpen(false);
    await loadConfigs();
  };

  const handleDelete = async (config) => {
    try {
      await deleteLiquidityPenaltyConfig(config.id);
      setViewingConfig(null);
      await loadConfigs();
    } catch (err) {
      const message =
        err.response?.data?.message ?? err.message ?? "An error occurred";
      window.alert(message);
    }
  };

  const handleToggleStatus = async (config, nextActive) => {
    try {
      await updateLiquidityPenaltyConfig(config.id, { is_active: nextActive });
      setViewingConfig((v) =>
        v && v.id === config.id ? { ...v, is_active: nextActive } : v,
      );
      await loadConfigs();
    } catch (err) {
      const message =
        err.response?.data?.message ?? err.message ?? "An error occurred";
      window.alert(message);
    }
  };

  const openDetails = (config) => {
    setViewingConfig(config);
  };

  const openEdit = (config) => {
    setViewingConfig(null);
    setEditingConfig(config);
    setIsAddOpen(true);
  };

  return (
    <Layout activeNavItem="Liquidity Config">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              Liquidity Configuration
            </h1>
            <button
              type="button"
              onClick={() => {
                setEditingConfig(null);
                setIsAddOpen(true);
              }}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Configuration
              <Plus size={16} />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <RateConfigTable
              rows={configs}
              loading={loading}
              error={error}
              onRetry={loadConfigs}
              onSelect={openDetails}
            />
          </div>
        </div>
      </div>

      {isAddOpen && (
        <AddConfigurationModal
          open
          initial={editingConfig}
          onClose={() => {
            setIsAddOpen(false);
            setEditingConfig(null);
          }}
          onSave={handleAdd}
          onUpdate={handleUpdate}
        />
      )}

      {viewingConfig && (
        <ConfigDetailsSidebar
          config={viewingConfig}
          onClose={() => setViewingConfig(null)}
          onEdit={openEdit}
          onToggle={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}
    </Layout>
  );
}