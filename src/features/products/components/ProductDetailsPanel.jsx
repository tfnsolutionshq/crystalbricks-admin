import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import Badge from "@/shared/components/Badge";

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

function Naira({ amount }) {
  return <>{amount ? `₦${amount}` : "-"}</>;
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
        <Field label="Percentage Per Annum" value={product.rate} />
        <Field
          label="Minimum Amount"
          value={<Naira amount={product.minAmount} />}
        />
      </Row>
      <Row>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <div className="mt-1">
            <Badge variant="success">{product.status}</Badge>
          </div>
        </div>
        <Field label="Date Created" value={product.dateCreated} />
      </Row>
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
        <Field label="Percentage Per Annum" value={product.rate} />
        <Field
          label="Minimum Amount"
          value={<Naira amount={product.minAmount} />}
        />
      </Row>
      <Row>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <div className="mt-1">
            <Badge variant="error">{product.status}</Badge>
          </div>
        </div>
        <Field label="Date Created" value={product.dateCreated} />
      </Row>
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
          value={<Naira amount={product.minAmount} />}
        />
      </Row>
      <Row>
        <Field
          label="Maximum Amount"
          value={<Naira amount={product.maxAmount} />}
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
          value={<Naira amount={product.minAmount} />}
        />
      </Row>
      <Row>
        <Field
          label="Maximum Amount"
          value={<Naira amount={product.maxAmount} />}
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
              className="w-full bg-[#C2185B] hover:opacity-90 transition-opacity text-white text-sm font-medium py-3 rounded-lg cursor-pointer"
            >
              Edit product
            </button>
            {isActive ? (
              <button
                onClick={handleToggle}
                disabled={busyAction !== null}
                className="w-full flex items-center justify-center gap-2 bg-[#EF5350] hover:bg-[#e53e3e] transition-colors text-white text-sm font-medium py-3 rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busyAction === "deactivate" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Deactivate
              </button>
            ) : (
              <button
                onClick={handleToggle}
                disabled={busyAction !== null}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition-colors text-white text-sm font-medium py-3 rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busyAction === "activate" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Activate
              </button>
            )}
            {kind === "fd" && (
              <button
                onClick={handleDelete}
                disabled={busyAction !== null}
                className="w-full flex items-center justify-center gap-2 border border-[#EF5350] text-[#EF5350] hover:bg-[#EF5350] hover:text-white transition-colors text-sm font-medium py-3 rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busyAction === "delete" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
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
