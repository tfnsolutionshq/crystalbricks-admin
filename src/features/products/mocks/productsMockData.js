export const TABS = [
  { key: "investments", label: "Contributions" },
  { key: "loans", label: "Loans" },
];

export const LOAN_TYPE_OPTIONS = ["Individual", "Corporate", "Group"];
export const TENOR_OPTIONS = [
  "6 – 12 months",
  "12 – 24 months",
  "24 – 36 months",
  "36 – 48 months",
];
export const REQUIREMENT_OPTIONS = [
  "KYC Documents",
  "Financial Documents",
  "Collateral Documents",
];
export const FD_CATEGORY_OPTIONS = [
  "Fixed Deposits",
  "Target Savings",
  "Flexible Savings",
];
export const FD_TYPE_OPTIONS = ["Individual", "Corporate"];
export const DURATION_OPTIONS = [
  "30 days",
  "60 days",
  "90 days",
  "180 days",
  "365 days",
];
export const STATUS_OPTIONS = ["Active", "Inactive"];
export const PAYOUT_FREQUENCY_OPTIONS = [
  "MONTHLY",
  "QUARTERLY",
  "BIANNUALLY",
  "ANNUALLY",
];

export function capitalizeLabel(value) {
  if (!value) return "";
  const lower = String(value).toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

const loanRows = [
  {
    id: "loan-1",
    name: "Government Salary Workers Loan",
    type: "Individual",
    rate: "20%",
    status: "Active",
    dateCreated: "Apr 10, 2025 12:32 PM",
    description:
      "We offer an affordable way for women and women-owned business owners to secure competitive rates on loans so they can get their small businesses up and running.",
    tenor: "12 – 24 months",
    minAmount: "500,000.00",
    maxAmount: "500,000.00",
    minAge: "",
    maxAge: "",
    eligibilityCriteria: [
      "Company must be duly incorporated.",
      "Applicant must satisfy KYC requirements.",
      "Loan utilization must be clearly defined.",
    ],
    supportingDocuments: [
      { name: "Certificate of Incorporation", mandatory: true },
      { name: "Memorandum & Articles of Association", mandatory: true },
      { name: "CAC Forms (CAC2, CAC7)", mandatory: false },
    ],
    requirement: "KYC Documents",
    createdBy: "Adebanjo Thomas",
    activeUsers: 209,
    loanVolume: "3,209,329.55",
    repaymentVolume: "3,209,329.55",
    loanInterestVolume: "3,209,329.55",
  },
  {
    id: "loan-2",
    name: "SME Growth Loan",
    type: "Individual",
    rate: "20%",
    status: "Inactive",
    dateCreated: "Apr 10, 2025 12:32 PM",
    description:
      "A flexible loan product designed to help small and medium enterprises scale operations.",
    tenor: "6 – 12 months",
    minAmount: "250,000.00",
    maxAmount: "2,000,000.00",
    minAge: "21",
    maxAge: "60",
    eligibilityCriteria: [
      "Business must be registered.",
      "Minimum 6 months of trading history.",
    ],
    supportingDocuments: [
      { name: "Business Registration Certificate", mandatory: true },
      { name: "Bank Statements", mandatory: true },
    ],
    requirement: "Financial Documents",
    createdBy: "Adebanjo Thomas",
    activeUsers: 87,
    loanVolume: "1,120,000.00",
    repaymentVolume: "980,000.00",
    loanInterestVolume: "140,000.00",
  },
];

const fdRows = [
  {
    id: "fd-1",
    name: "SmartSaver Plan",
    category: "Fixed Deposits",
    type: "Individual",
    rate: "12%",
    status: "Active",
    dateCreated: "Apr 10, 2025 12:32 PM",
    minAmount: "500,000.00",
    duration: "30 days",
    createdBy: "Adebanjo Thomas",
    activeUsers: 209,
    tradeVolume: "3,209,329.55",
    investmentVolume: "3,209,329.55",
  },
  {
    id: "fd-2",
    name: "Tenor Investment Plan",
    category: "Fixed Deposits",
    type: "Individual",
    rate: "15%",
    status: "Active",
    dateCreated: "Apr 10, 2025 12:32 PM",
    minAmount: "1,000,000.00",
    duration: "90 days",
    createdBy: "Adebanjo Thomas",
    activeUsers: 154,
    tradeVolume: "2,004,120.00",
    investmentVolume: "2,004,120.00",
  },
  {
    id: "fd-3",
    name: "Diaspora Delight Plan",
    category: "Fixed Deposits",
    type: "Individual",
    rate: "10%",
    status: "Inactive",
    dateCreated: "Apr 10, 2025 12:32 PM",
    minAmount: "750,000.00",
    duration: "180 days",
    createdBy: "Adebanjo Thomas",
    activeUsers: 42,
    tradeVolume: "650,000.00",
    investmentVolume: "650,000.00",
  },
];

export const DATA_BY_TAB = {
  investments: {
    stats: {
      avgInterestRate: "12.3%",
      totalActiveProducts: 3,
      newSignups: 142,
    },
    rows: fdRows,
    showing: 10,
    total: 4523,
    page: 1,
    pageCount: 46,
  },
  loans: {
    stats: {
      avgInterestRate: "12.3%",
      totalActiveProducts: 1,
      newSignups: 142,
    },
    rows: loanRows,
    showing: 10,
    total: 4523,
    page: 1,
    pageCount: 46,
  },
};
