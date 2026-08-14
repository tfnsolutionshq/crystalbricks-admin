import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import Layout from "@/shared/components/Layout";
import StatCard from "@/shared/components/StatCard";

import ProductTabs from "@/features/products/components/ProductTabs";
import ProductsTable from "@/features/products/components/ProductsTable";
import ProductDetailsPanel from "@/features/products/components/ProductDetailsPanel";
import EditProductModal from "@/features/products/components/EditProductModal";
import AddProductModal from "@/features/products/components/AddProductModal";

import formatDateTime from "@/shared/utils/formatDateTime";

import {
  activateInvestmentPlan,
  activateLoanPlan,
  createInvestmentPlan,
  deactivateInvestmentPlan,
  deactivateLoanPlan,
  deleteInvestmentPlan,
  fetchInvestmentPlans,
  fetchLoanPlans,
  updateInvestmentPlan,
  updateLoanPlan,
} from "@/features/products/api/productsApi";

const PAYOUT_FREQUENCY_LABELS = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  BIANNUALLY: "Bi-Annual",
  ANNUALLY: "Annual",
};

function normalizeInvestment(item) {
  const isActive = item.is_active === true;

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.description,
    rate: item.roi_percentage != null ? `${item.roi_percentage}%` : "-",
    status: isActive ? "Active" : "Inactive",
    is_active: isActive,
    dateCreated: formatDateTime(item.created_at),
    created_at: item.created_at,
    updatedAt: formatDateTime(item.updated_at),
    updated_at: item.updated_at,
    payoutFrequency:
      PAYOUT_FREQUENCY_LABELS[item.payout_frequency] ?? item.payout_frequency,
    payout_frequency: item.payout_frequency,
    payoutCycleInMonths: item.payout_cycle_in_months,
    roi_percentage: item.roi_percentage,
    minimum_amount: item.minimum_amount,
    maximum_amount: item.maximum_amount,
    minAmount: item.minimum_amount,
    maxAmount: item.maximum_amount,
  };
}

function normalizeLoanPlan(item) {
  const isActive = item.is_active === true;
  const minAmount = item.min_amount != null ? Number(item.min_amount) : null;
  const maxAmount = item.max_amount != null ? Number(item.max_amount) : null;

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    rate:
      item.percentage_per_annum != null ? `${item.percentage_per_annum}%` : "-",
    status: isActive ? "Active" : "Inactive",
    is_active: isActive,
    dateCreated: formatDateTime(item.created_at),
    created_at: item.created_at,
    updatedAt: formatDateTime(item.updated_at),
    updated_at: item.updated_at,
    percentage_per_annum: item.percentage_per_annum,
    min_interest_rate: item.min_interest_rate,
    max_interest_rate: item.max_interest_rate,
    processing_fee_percentage: item.processing_fee_percentage,
    minimum_amount: minAmount,
    maximum_amount: maxAmount,
    minAmount,
    maxAmount,
    min_amount: item.min_amount,
    max_amount: item.max_amount,
    roi_percentage: item.percentage_per_annum
      ? parseFloat(item.percentage_per_annum)
      : null,
  };
}

export default function Products() {
  const [activeTab, setActiveTab] = useState("investments");

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [loans, setLoans] = useState([]);
  const [loansLoading, setLoansLoading] = useState(false);
  const [loansError, setLoansError] = useState(null);

  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const isInvestments = activeTab === "investments";
  const isLoans = activeTab === "loans";
  const kind = isInvestments ? "fd" : "loan";

  const loadInvestments = useCallback(async () => {
    try {
      const { data } = await fetchInvestmentPlans();
      setInvestments((data ?? []).map(normalizeInvestment));
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLoans = useCallback(async () => {
    try {
      setLoansLoading(true);
      setLoansError(null);
      const { data } = await fetchLoanPlans();
      setLoans((data ?? []).map(normalizeLoanPlan));
    } catch (err) {
      setLoansError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLoansLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    loadInvestments();
  }, [loadInvestments]);

  useEffect(() => {
    if (!isLoans) return;
    if (loans.length > 0 || loansLoading || loansError) return;
    loadLoans();
  }, [isLoans, loans.length, loansLoading, loansError, loadLoans]);

  const handleRetry = () => {
    if (isInvestments) {
      setLoading(true);
      setError(null);
      loadInvestments();
    } else {
      loadLoans();
    }
  };

  const rows = isInvestments ? investments : loans;

  const stats = useMemo(() => {
    const source = isInvestments ? investments : loans;
    if (source.length === 0) {
      return {
        avgInterestRate: "0%",
        totalActiveProducts: 0,
      };
    }
    const avg =
      source.reduce(
        (sum, i) =>
          sum +
          Number(
            isInvestments ? (i.roi_percentage ?? 0) : (i.processing_fee_percentage ?? 0),
          ),
        0,
      ) / source.length;
    return {
      avgInterestRate: `${avg.toFixed(1)}%`,
      totalActiveProducts: source.filter((i) => i.is_active).length,
    };
  }, [isInvestments, investments, loans]);

  const isLoading = isInvestments ? loading : loansLoading;
  const tableError = isInvestments ? error : loansError;
  const statsLoading = isLoading;
  const skeletonValue = (
    <span className="h-7 w-20 bg-gray-200 rounded animate-pulse block" />
  );

  const handleToggleStatus = async (product, nextActive) => {
    try {
      if (isInvestments) {
        if (nextActive) {
          await activateInvestmentPlan(product.id);
        } else {
          await deactivateInvestmentPlan(product.id);
        }
      } else if (nextActive) {
        await activateLoanPlan(product.id);
      } else {
        await deactivateLoanPlan(product.id);
      }
      const nextStatus = nextActive ? "Active" : "Inactive";
      setViewingProduct((v) =>
        v && v.id === product.id
          ? { ...v, status: nextStatus, is_active: nextActive }
          : v,
      );
      if (isInvestments) {
        setLoading(true);
        await loadInvestments();
      } else {
        loadLoans();
      }
    } catch (err) {
      const message =
        err.response?.data?.message ?? err.message ?? "An error occurred";
      window.alert(message);
    }
  };

  const handleDeactivate = (product) => handleToggleStatus(product, false);

  const handleActivate = (product) => handleToggleStatus(product, true);

  const handleDelete = async (product) => {
    try {
      await deleteInvestmentPlan(product.id);
      setViewingProduct(null);
      setLoading(true);
      await loadInvestments();
    } catch (err) {
      const message =
        err.response?.data?.message ?? err.message ?? "An error occurred";
      window.alert(message);
    }
  };

  const handleEditSave = async (updated) => {
    if (isInvestments) {
      const payload = {
        name: updated.name,
        description: updated.description,
        minimum_amount: updated.minimum_amount
          ? Number(updated.minimum_amount)
          : null,
        maximum_amount: updated.maximum_amount
          ? Number(updated.maximum_amount)
          : null,
        roi_percentage: updated.roi_percentage
          ? Number(updated.roi_percentage)
          : null,
        payout_frequency: updated.payout_frequency,
        payout_cycle_in_months: updated.payout_cycle_in_months
          ? Number(updated.payout_cycle_in_months)
          : null,
        is_active: updated.is_active,
      };
      try {
        await updateInvestmentPlan(updated.id, payload);
        setEditingProduct(null);
        setLoading(true);
        await loadInvestments();
      } catch (err) {
        const message =
          err.response?.data?.message ?? err.message ?? "An error occurred";
        window.alert(message);
      }
      return;
    }

    const payload = {
      name: updated.name,
      description: updated.description,
      min_interest_rate: updated.min_interest_rate
        ? Number(updated.min_interest_rate)
        : null,
      max_interest_rate: updated.max_interest_rate
        ? Number(updated.max_interest_rate)
        : null,
      min_amount: updated.min_amount ? Number(updated.min_amount) : null,
      max_amount: updated.max_amount ? Number(updated.max_amount) : null,
      processing_fee_percentage: updated.processing_fee_percentage
        ? Number(updated.processing_fee_percentage)
        : null,
      is_active: updated.is_active,
    };
    try {
      await updateLoanPlan(updated.id, payload);
      setEditingProduct(null);
      loadLoans();
    } catch (err) {
      const message =
        err.response?.data?.message ?? err.message ?? "An error occurred";
      window.alert(message);
    }
  };

  const handleAddSave = async (newProduct) => {
    if (isInvestments) {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        minimum_amount: newProduct.minimum_amount
          ? Number(newProduct.minimum_amount)
          : null,
        maximum_amount: newProduct.maximum_amount
          ? Number(newProduct.maximum_amount)
          : null,
        roi_percentage: newProduct.roi_percentage
          ? Number(newProduct.roi_percentage)
          : null,
        payout_frequency: newProduct.payout_frequency,
        payout_cycle_in_months: newProduct.payout_cycle_in_months
          ? Number(newProduct.payout_cycle_in_months)
          : null,
        is_active: newProduct.is_active,
      };
      try {
        await createInvestmentPlan(payload);
        setIsAddOpen(false);
        setLoading(true);
        await loadInvestments();
      } catch (err) {
        const message =
          err.response?.data?.message ?? err.message ?? "An error occurred";
        window.alert(message);
      }
      return;
    }

    const dateCreated = new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const status = newProduct.is_active ? "Active" : "Inactive";
    setLoans((prev) => [
      {
        id: `loan-${Date.now()}`,
        name: newProduct.name,
        rate: "-",
        status,
        is_active: newProduct.is_active,
        dateCreated,
        min_interest_rate: newProduct.min_interest_rate ?? null,
        max_interest_rate: newProduct.max_interest_rate ?? null,
        min_amount: newProduct.min_amount ?? null,
        max_amount: newProduct.max_amount ?? null,
        minimum_amount: newProduct.min_amount ?? null,
        maximum_amount: newProduct.max_amount ?? null,
        minAmount: newProduct.min_amount ?? null,
        maxAmount: newProduct.max_amount ?? null,
        processing_fee_percentage: newProduct.processing_fee_percentage ?? null,
        ...newProduct,
      },
      ...prev,
    ]);
    setIsAddOpen(false);
    loadLoans();
  };

  return (
    <Layout activeNavItem="Products">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 transition-colors text-white text-sm font-medium pl-4 pr-3 py-2.5 rounded-lg cursor-pointer"
          >
            Add product
            <Plus size={16} />
          </button>
        </div>

        <ProductTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="flex flex-wrap gap-6">
          <StatCard
            label={
              isInvestments ? "Avg ROI Percentage" : "Avg Processing Fee Percentage"
            }
            value={statsLoading ? skeletonValue : stats.avgInterestRate}
          />
          <StatCard
            label="Total Active Products"
            value={statsLoading ? skeletonValue : stats.totalActiveProducts}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <ProductsTable
            rows={rows}
            tab={activeTab}
            loading={isLoading}
            error={tableError}
            onRetry={handleRetry}
            onRowClick={setViewingProduct}
          />
        </div>
      </div>

      {viewingProduct && (
        <ProductDetailsPanel
          product={viewingProduct}
          kind={kind}
          onClose={() => setViewingProduct(null)}
          onEdit={(p) => {
            setViewingProduct(null);
            setEditingProduct(p);
          }}
          onDeactivate={handleDeactivate}
          onActivate={handleActivate}
          onDelete={handleDelete}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          kind={kind}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditSave}
        />
      )}

      {isAddOpen && (
        <AddProductModal
          kind={kind}
          onClose={() => setIsAddOpen(false)}
          onSave={handleAddSave}
        />
      )}
    </Layout>
  );
}
