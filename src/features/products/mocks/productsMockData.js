export const STATUS_BADGE_STYLES = {
  Active: "bg-emerald-50 text-emerald-600",
  Inactive: "bg-red-50 text-red-500",
};

export const TABS = [
  { key: "fixed-deposits", label: "Fixed Deposits" },
  { key: "loans", label: "Loans" },
];

export const DATA_BY_TAB = {
  loans: {
    stats: {
      avgInterestRate: "12.3%",
      totalActiveProducts: 1,
      newSignups: 142,
    },
    rows: Array.from({ length: 6 }).map((_, i) => ({
      id: `loan-${i}`,
      name: "Government Salary Workers Loan",
      type: "Individual",
      rate: "20%",
      status: "Active",
      dateCreated: "Apr 10, 2025 12:32 PM",
    })),
    showing: 10,
    total: 4523,
    page: 1,
    pageCount: 46,
  },
  "fixed-deposits": {
    stats: {
      avgInterestRate: "12.3%",
      totalActiveProducts: 3,
      newSignups: 142,
    },
    rows: [
      {
        id: "fd-1",
        name: "SmartSaver Plan",
        type: "Individual",
        rate: "12%",
        status: "Active",
        dateCreated: "Apr 10, 2025 12:32 PM",
      },
      {
        id: "fd-2",
        name: "Tenor Investment Plan",
        type: "Individual",
        rate: "15%",
        status: "Active",
        dateCreated: "Apr 10, 2025 12:32 PM",
      },
      {
        id: "fd-3",
        name: "Tenor Investment Plan",
        type: "Individual",
        rate: "15%",
        status: "Active",
        dateCreated: "Apr 10, 2025 12:32 PM",
      },
      {
        id: "fd-4",
        name: "Tenor Investment Plan",
        type: "Individual",
        rate: "15%",
        status: "Active",
        dateCreated: "Apr 10, 2025 12:32 PM",
      },
      {
        id: "fd-5",
        name: "Tenor Investment Plan",
        type: "Individual",
        rate: "15%",
        status: "Active",
        dateCreated: "Apr 10, 2025 12:32 PM",
      },
      {
        id: "fd-6",
        name: "Diaspora Delight Plan",
        type: "Individual",
        rate: "10%",
        status: "Inactive",
        dateCreated: "Apr 10, 2025 12:32 PM",
      },
    ],
    showing: 10,
    total: 4523,
    page: 1,
    pageCount: 46,
  },
};
