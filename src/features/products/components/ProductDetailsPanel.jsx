import { useState } from "react";
import { X, Loader2, Pencil, Power, Trash2 } from "lucide-react";
import Badge from "@/shared/components/Badge";
import formatCurrency from "@/shared/utils/formatCurrency";

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

function formatKycRequirements(kycRequirements) {
  if (!kycRequirements || kycRequirements.length === 0) return null;
  return kycRequirements.map((req) => req.label).join(", ");
}

function RichTextBlock({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1 whitespace-pre-line">
        {value || "-"}
      </p>
    </div>
  );
}

function LoanFullDetails({ product }) {
  return (
    <>
      <Field label="Name" value={product.name} />
      <div>
        <p className="text-sm text-gray-500">Description</p>
        <p className="text-sm font-semibold text-gray-900 mt-1">
          {product.description || "-"}
        </p>
      </div>
      <Row>
        <Field
          label="Min Interest Rate"
          value={
            product.min_interest_rate != null
              ? `${product.min_interest_rate}%`
              : "-"
          }
        />
        <Field
          label="Max Interest Rate"
          value={
            product.max_interest_rate != null
              ? `${product.max_interest_rate}%`
              : "-"
          }
        />
      </Row>
      <Row>
        <Field
          label="Minimum Amount"
          value={product.minAmount ? formatCurrency(product.minAmount) : "-"}
        />
        <Field
          label="Maximum Amount"
          value={product.maxAmount ? formatCurrency(product.maxAmount) : "-"}
        />
      </Row>
      <Row>
        <Field
          label="Processing Fee Percentage"
          value={
            product.processing_fee_percentage != null
              ? `${product.processing_fee_percentage}%`
              : "-"
          }
        />
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <div className="mt-1">
            <Badge variant="success">{product.status}</Badge>
          </div>
        </div>
      </Row>
      <Field
        label="KYC Requirements"
        value={formatKycRequirements(product.kyc_requirements)}
      />
      <RichTextBlock
        label="Repayment Structure"
        value={product.repayment_structure}
      />
      <RichTextBlock
        label="Eligibility Criteria"
        value={product.eligibility_criteria}
      />
      <Field label="Date Created" value={product.dateCreated} />
      <Field label="Last Updated" value={product.updatedAt} />
    </>
  );
}

function LoanSimpleDetails({ product }) {
  return (
    <>
      <Field label="Name" value={product.name} />
      <div>
        <p className="text-sm text-gray-500">Description</p>
        <p className="text-sm font-semibold text-gray-900 mt-1">
          {product.description || "-"}
        </p>
      </div>
      <Row>
        <Field
          label="Min Interest Rate"
          value={
            product.min_interest_rate != null
              ? `${product.min_interest_rate}%`
              : "-"
          }
        />
        <Field
          label="Max Interest Rate"
          value={
            product.max_interest_rate != null
              ? `${product.max_interest_rate}%`
              : "-"
          }
        />
      </Row>
      <Row>
        <Field
          label="Minimum Amount"
          value={product.minAmount ? formatCurrency(product.minAmount) : "-"}
        />
        <Field
          label="Maximum Amount"
          value={product.maxAmount ? formatCurrency(product.maxAmount) : "-"}
        />
      </Row>
      <Row>
        <Field
          label="Processing Fee Percentage"
          value={
            product.processing_fee_percentage != null
              ? `${product.processing_fee_percentage}%`
              : "-"
          }
        />
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <div className="mt-1">
            <Badge variant="error">{product.status}</Badge>
          </div>
        </div>
      </Row>
      <Field
        label="KYC Requirements"
        value={formatKycRequirements(product.kyc_requirements)}
      />
      <RichTextBlock
        label="Repayment Structure"
        value={product.repayment_structure}
      />
      <RichTextBlock
        label="Eligibility Criteria"
        value={product.eligibility_criteria}
      />
      <Field label="Date Created" value={product.dateCreated} />
      <Field label="Last Updated" value={product.updatedAt} />
    </>
  );
}

function FdFullDetails({ product }) {
  return (
    <>
      <Field label="Name" value={product.name} />
      <Field label="Slug" value={product.slug} />
      <div>
        <p className="text-sm text-gray-500">Description</p>
        <p className="text-sm font-semibold text-gray-900 mt-1">
          {product.description || "-"}
        </p>
      </div>
      <Row>
        <Field label="Payout Frequency" value={product.payoutFrequency} />
        <Field
          label="Payout Cycle (Months)"
          value={product.payoutCycleInMonths}
        />
      </Row>
      <Row>
        <Field label="ROI Percentage" value={product.rate} />
        <Field
          label="Minimum Amount"
          value={product.minAmount ? formatCurrency(product.minAmount) : "-"}
        />
      </Row>
      <Row>
        <Field
          label="Maximum Amount"
          value={product.maxAmount ? formatCurrency(product.maxAmount) : "-"}
        />
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <div className="mt-1">
            <Badge variant="success">{product.status}</Badge>
          </div>
        </div>
      </Row>
      <Field label="Date Created" value={product.dateCreated} />
      <Field label="Last Updated" value={product.updatedAt} />
    </>
  );
}

function FdSimpleDetails({ product }) {
  return (
    <>
      <Field label="Name" value={product.name} />
      <Field label="Slug" value={product.slug} />
      <div>
        <p className="text-sm text-gray-500">Description</p>
        <p className="text-sm font-semibold text-gray-900 mt-1">
          {product.description || "-"}
        </p>
      </div>
      <Row>
        <Field label="Payout Frequency" value={product.payoutFrequency} />
        <Field
          label="Payout Cycle (Months)"
          value={product.payoutCycleInMonths}
        />
      </Row>
      <Row>
        <Field label="ROI Percentage" value={product.rate} />
        <Field
          label="Minimum Amount"
          value={product.minAmount ? formatCurrency(product.minAmount) : "-"}
        />
      </Row>
      <Row>
        <Field
          label="Maximum Amount"
          value={product.maxAmount ? formatCurrency(product.maxAmount) : "-"}
        />
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <div className="mt-1">
            <Badge variant="error">{product.status}</Badge>
          </div>
        </div>
      </Row>
      <Field label="Date Created" value={product.dateCreated} />
      <Field label="Last Updated" value={product.updatedAt} />
    </>
  );
}

export default function ProductDetailsPanel({
  product,
  kind,
  onClose,
  onEdit,
  onDeactivate,
  onActivate,
  onDelete,
}) {
  const [busyAction, setBusyAction] = useState(null);
  if (!product) return null;
  const isActive = product.status === "Active";

  const handleToggle = async () => {
    if (busyAction) return;
    setBusyAction(isActive ? "deactivate" : "activate");
    try {
      await (isActive ? onDeactivate(product) : onActivate(product));
    } finally {
      setBusyAction(null);
    }
  };

  const handleDelete = async () => {
    if (busyAction) return;
    setBusyAction("delete");
    try {
      await onDelete(product);
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-100 bg-white h-full shadow-xl overflow-y-auto animate-slide-in-right">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {kind === "loan" ? (
            isActive ? (
              <LoanFullDetails product={product} />
            ) : (
              <LoanSimpleDetails product={product} />
            )
          ) : isActive ? (
            <FdFullDetails product={product} />
          ) : (
            <FdSimpleDetails product={product} />
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onEdit(product)}
              className="w-full flex items-center justify-center gap-2 bg-[#C2185B] hover:opacity-90 transition-opacity text-white text-sm font-medium py-3 rounded-lg cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
              Edit product
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
            {kind === "fd" && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
