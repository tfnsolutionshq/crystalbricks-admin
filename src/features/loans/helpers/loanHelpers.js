// Pure helper functions for the Loans feature.
// Centralizes the status -> UI mapping so LoanList / LoanDetail / tabs
// all agree on colors, available tabs, and which header actions to show.

// ---- Status -> Badge variant ------------------------------------------------
// NOTE: 'neutral' (gray) and 'dark' (solid black) are new Badge variants —
// see the shared-file callout for src/components/Badge.jsx.
export const STATUS_BADGE_VARIANT = {
  New: "blue",
  Processing: "neutral",
  "On hold": "blue",
  Awaiting: "orange",
  Pending: "orange",
  Active: "green",
  Declined: "red",
  Rejected: "red",
  Repaid: "dark",
};

export function getStatusVariant(status) {
  return STATUS_BADGE_VARIANT[status] || "neutral";
}

// Individual/Corporate loan-type tag, and CSCS/DCS account-type tag.
export const TYPE_TAG_VARIANT = {
  Individual: "blue",
  Corporate: "purple",
  CSCS: "purple",
  DCS: "blue",
};

export function getTypeVariant(value) {
  return TYPE_TAG_VARIANT[value] || "blue";
}

export const REVIEW_STATUS_VARIANT = {
  pending: "orange",
  approved: "green",
  rejected: "red",
  on_hold: "blue",
};

export function getReviewVariant(status) {
  return REVIEW_STATUS_VARIANT[status] || "neutral";
}

export const RATING_VARIANT = {
  Good: "green",
  Fair: "purple",
  Poor: "red",
  "Very poor": "red",
};
export function getRatingVariant(rating) {
  return RATING_VARIANT[rating] || "neutral";
}

export const RISK_VARIANT = {
  Low: "green",
  Medium: "purple",
  High: "red",
  "Very high": "red",
};
export function getRiskVariant(risk) {
  return RISK_VARIANT[risk] || "neutral";
}

// ---- Tab visibility ---------------------------------------------------------
// Approval Details only shows once a loan has reached a decision stage.
const STATUSES_WITH_APPROVAL = [
  "Awaiting",
  "Pending",
  "Declined",
  "Active",
  "Repaid",
];
// Repayment Schedule only exists once a loan has been disbursed.
const STATUSES_WITH_SCHEDULE = ["Active", "Repaid"];

export function getAvailableTabs(loan) {
  const tabs = [
    { key: "application", label: "Application Details" },
    { key: "kyc", label: "KYC Documents" },
    { key: "credit", label: "Credit Check" },
  ];
  if (STATUSES_WITH_APPROVAL.includes(loan.status)) {
    tabs.push({ key: "approval", label: "Approval Details" });
  }
  if (STATUSES_WITH_SCHEDULE.includes(loan.status)) {
    tabs.push({ key: "schedule", label: "Repayment Schedule" });
  }
  tabs.push({ key: "notes", label: "Notes" });
  return tabs;
}

// ---- Header-level actions ---------------------------------------------------
// Returns which action buttons show next to the status badge in the page header.
export function getHeaderActions(loan) {
  switch (loan.status) {
    case "On hold":
      return ["approve", "reject"]; // Approve/Reject the overall application
    case "Processing":
      return loan.reviewReady ? ["approve", "reject"] : [];
    case "Awaiting":
      return ["reject"];
    case "Pending":
      return ["disburse", "reject"];
    default:
      return [];
  }
}

// ---- Formatting --------------------------------------------------------------
export function formatNaira(amount) {
  if (amount === null || amount === undefined) return "-";
  return `₦${Number(amount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateShort(value) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ---- Fallback detail generation ---------------------------------------------
// Ensures navigating into any filler/mock loan (beyond the 10 fully-detailed
// ones) never renders an empty page.
export function buildFallbackDetail(loan) {
  const approvedStatuses = [
    "Awaiting",
    "Pending",
    "Declined",
    "Active",
    "Repaid",
  ];
  const kycCreditApproved =
    approvedStatuses.includes(loan.status) || loan.status === "Processing";

  return {
    application: {
      customer: loan.customer,
      reference: loan.reference,
      accountBalance: 556738.99,
      accountType: loan.type === "Corporate" ? "DCS" : "CSCS",
      loanAmount: loan.amount,
      loanType: loan.type,
      period: "6 months",
      date: loan.date,
      category: loan.category,
      loanPurpose: "Personal / business use.",
    },
    kyc: {
      status:
        loan.status === "Rejected"
          ? "rejected"
          : kycCreditApproved
            ? "approved"
            : "pending",
      documents: [
        {
          section: "Identity Document",
          label: "Passport Photograph",
          filename: "VotersCard.jpeg",
        },
        { section: "Pay Slip", label: "Document", filename: "PayInvoice.pdf" },
        {
          section: "Employment/confirmation/promotion letter",
          label: "Document",
          filename: "Utility-bill.pdf",
        },
      ],
    },
    credit: {
      status:
        loan.status === "Rejected"
          ? "rejected"
          : kycCreditApproved
            ? "approved"
            : "pending",
      score: 650,
      rating: "Good",
      risk: "Medium",
    },
    approval: approvedStatuses.includes(loan.status)
      ? {
          amount: loan.amount,
          interestPercent: 13,
          interestAmount: Math.round(loan.amount * 0.13),
          instalmentAmount: Math.round((loan.amount * 1.13) / 6),
          accepted: loan.status === "Awaiting" ? null : loan.date,
          startDate: loan.date,
          endDate: loan.date,
          period: "6 months",
          defaultPaymentMethod: "Wallet",
        }
      : null,
    schedule:
      loan.status === "Active" || loan.status === "Repaid"
        ? [
            {
              transactionId: loan.status === "Repaid" ? "rpy_sample01" : null,
              amountDue: Math.round((loan.amount * 1.13) / 6),
              paymentMethod: loan.status === "Repaid" ? "Wallet" : null,
              dueDate: loan.date,
              paidDate: loan.status === "Repaid" ? loan.date : null,
              status: loan.status === "Repaid" ? "Paid" : "Pending",
            },
          ]
        : null,
    notes: [],
  };
}
