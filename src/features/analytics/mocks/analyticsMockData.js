// src/features/analytics/mocks/analyticsData.js
// Mock data for the Analytics dashboard. Replace with real API data later —
// shapes are kept flat and chart-library-friendly on purpose.

export const summaryStats = [
  {
    key: "revenue",
    label: "Total Revenue",
    value: 6223990.54,
    isCurrency: true,
  },
  {
    key: "customers",
    label: "Active Customers",
    value: 4500,
    isCurrency: false,
  },
  {
    key: "transactions",
    label: "Transactions",
    value: 8421,
    isCurrency: false,
  },
  { key: "loans", label: "Active Loans", value: 321, isCurrency: false },
];

// Stacked bar chart: Loans (green, top) vs Investment (red, bottom).
// `mutedInvestment` flags Jan, which renders in the neutral/gray tone
// shown in the design (no investment activity recorded yet that month).
export const loansVsInvestment = [
  { month: "Jan", loans: 480000, investment: 1180000, mutedInvestment: true },
  { month: "Feb", loans: 610000, investment: 2040000 },
  { month: "Mar", loans: 390000, investment: 1120000 },
  { month: "Apr", loans: 520000, investment: 1860000 },
  { month: "May", loans: 470000, investment: 1240000 },
  { month: "Jun", loans: 720000, investment: 2540000, highlight: true },
  { month: "Jul", loans: 410000, investment: 1580000 },
  { month: "Aug", loans: 440000, investment: 1420000 },
  { month: "Sep", loans: 400000, investment: 1360000 },
  { month: "Oct", loans: 540000, investment: 1780000 },
  { month: "Nov", loans: 610000, investment: 2120000 },
  { month: "Dec", loans: 470000, investment: 1660000 },
];

export const loansVsInvestmentTooltip = {
  Jun: { loans: 32443945.3, investment: 118250000 },
};

// Line chart: Customer Growth (active users over the year)
export const customerGrowth = [
  { month: "Jan", activeUsers: 1180 },
  { month: "Feb", activeUsers: 1340 },
  { month: "Mar", activeUsers: 1290 },
  { month: "Apr", activeUsers: 1520 },
  { month: "May", activeUsers: 1810 },
  { month: "Jun", activeUsers: 2342, highlight: true },
  { month: "Jul", activeUsers: 2110 },
  { month: "Aug", activeUsers: 2260 },
  { month: "Sep", activeUsers: 2390 },
  { month: "Oct", activeUsers: 2410 },
  { month: "Nov", activeUsers: 2470 },
  { month: "Dec", activeUsers: 2536 },
];

export const customerGrowthTotal = 2536;

// Donut: Products — Fixed Deposits vs Loans, by share of portfolio value
export const productsBreakdown = [
  {
    key: "fixedDeposits",
    name: "Fixed Deposits",
    color: "#0d9f6e",
    share: 25,
    count: 2,
    amount: 12709301.55,
  },
  {
    key: "loans",
    name: "Loans",
    color: "#0f172a",
    share: 75,
    count: 6,
    amount: 38129580.2,
  },
];

export const productsTotalCount = 2;

export const keyMetrics = [
  {
    key: "avgTransaction",
    label: "Average Transaction Value",
    value: 40738,
    isCurrency: true,
    change: 5.2,
    direction: "up",
  },
  {
    key: "retentionRate",
    label: "Customer Retention Rate",
    value: 94.3,
    suffix: "%",
    change: 2.1,
    direction: "up",
  },
  {
    key: "defaultRate",
    label: "Loan Default Rate",
    value: 2.8,
    suffix: "%",
    change: 0.5,
    direction: "down",
  },
  {
    key: "avgDeposit",
    label: "Average Deposit Amount",
    value: 125450,
    isCurrency: true,
    change: 8.7,
    direction: "up",
  },
];

export const analyticsFilters = {
  date: "This year",
  category: "All",
  customerType: "All",
};

export const analyticsPagination = {
  showing: 10,
  total: 5392,
  page: 1,
  pages: 54,
};
