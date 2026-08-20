import {
  Wallet,
  Repeat,
  Server,
  ArrowLeftRight,
  LayoutGrid,
} from "lucide-react";

export const STATS = [
  {
    label: "Total Revenue",
    value: "\u20a6343,209,329.55",
    icon: Wallet,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
  {
    label: "Total Transactions",
    value: "8,421",
    icon: Repeat,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    label: "Assets Managed",
    value: "1,329",
    icon: Server,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
  },
];

export const ACTIVE_USERS_DATA = [
  { month: "JAN", sessions: 180 },
  { month: "FEB", sessions: 130 },
  { month: "MAR", sessions: 260 },
  { month: "APR", sessions: 195 },
  { month: "MAY", sessions: 300 },
  { month: "JUN", sessions: 250 },
  { month: "JUL", sessions: 280 },
  { month: "AUG", sessions: 300 },
  { month: "SEP", sessions: 170 },
  { month: "OCT", sessions: 120 },
  { month: "NOV", sessions: 210 },
  { month: "DEC", sessions: 290 },
];

export const REPAYMENTS = Array.from({ length: 4 }).map((_, i) => ({
  id: i,
  name: "Olamilekan Adams",
  due: "Due in 2 days",
  date: "Apr 9, 2025",
  amount: "\u20a614,054.25",
}));

export const REVENUE_BREAKDOWN = [
  { name: "Loans", value: 65, color: "#2563eb" },
  { name: "Invertments", value: 35, color: "#60a5fa" },
];

export const TRANSACTIONS = [
  {
    id: "dpt_jkfn32ke3o",
    customer: "Olamilekan Adams",
    amount: "\u20a650,000.00",
    date: "Apr 10, 2025 12:34 PM",
    status: "Completed",
  },
  {
    id: "trf_f53wkek332",
    customer: "Kio Ogan",
    amount: "\u20a620,000.00",
    date: "Apr 7, 2025 10:12 AM",
    status: "Pending",
  },
  {
    id: "trf_f03wfei42",
    customer: "Fiyinfolu Tubonimi",
    amount: "\u20a620,000.00",
    date: "Mar 30, 2025 1:47 PM",
    status: "Failed",
  },
  {
    id: "lon_4kr43fei42",
    customer: "Ogechi Kanu",
    amount: "\u20a625,000.00",
    date: "Mar 21, 2025 1:09 PM",
    status: "Completed",
  },
  {
    id: "trf_9k3fei4321",
    customer: "Chidera Obi",
    amount: "\u20a615,500.00",
    date: "Mar 18, 2025 9:42 AM",
    status: "Completed",
  },
];

export const STATUS_BADGE_STYLES = {
  Completed: "bg-emerald-50 text-emerald-600",
  Pending: "bg-gray-100 text-gray-500",
  Failed: "bg-red-50 text-red-500",
};

export const STATS_FILTER_OPTIONS = [
  { id: "all", menuLabel: "All stats", buttonLabel: "All stats" },
  { id: "loans", menuLabel: "Loan", buttonLabel: "Loans" },
  { id: "investment", menuLabel: "Investment", buttonLabel: "Investment" },
];

export const TIME_FILTER_OPTIONS = [
  { id: "today", menuLabel: "Today", buttonLabel: "Today" },
  { id: "this_month", menuLabel: "This month", buttonLabel: "This month" },
  { id: "this_year", menuLabel: "This year", buttonLabel: "This year" },
  { id: "all_time", menuLabel: "All time", buttonLabel: "All time" },
];

export const STATS_INVESTMENT = [
  {
    label: "Total Investment",
    value: "343,209,329.55",
    icon: Wallet,
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    label: "Total Interest Volume",
    value: "343,209,329.55",
    icon: Wallet,
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    label: "Total Transactions",
    value: "8,421",
    icon: ArrowLeftRight,
    iconBg: "bg-orange-100 text-orange-600",
  },
  {
    label: "Assets Managed",
    value: "1,329",
    icon: LayoutGrid,
    iconBg: "bg-teal-100 text-teal-600",
  },
];

export const STATS_LOANS = [
  {
    label: "Total Disbursement",
    value: "343,209,329.55",
    icon: Wallet,
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    label: "Total Repayment",
    value: "343,209,329.55",
    icon: Wallet,
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    label: "Total Transactions",
    value: "8,421",
    icon: ArrowLeftRight,
    iconBg: "bg-orange-100 text-orange-600",
  },
  {
    label: "Assets Managed",
    value: "1,329",
    icon: LayoutGrid,
    iconBg: "bg-teal-100 text-teal-600",
  },
];

export const ACTIVE_SAVING_USERS = {
  title: "Active Saving Users",
  value: "4,272",
  data: [40, 55, 48, 60, 52, 65, 58, 70, 62, 75, 68, 80],
};

export const ACTIVE_LOAN_USERS = {
  title: "Active Loan Users",
  value: "4,272",
  data: [40, 55, 48, 60, 52, 65, 58, 70, 62, 75, 68, 80],
};

export const RECENT_INVESTMENTS = Array.from({ length: 6 }).map(() => ({
  name: "Olamilekan Adams",
  date: "Apr 9, 2025",
  amount: "₦14,054.25",
}));
