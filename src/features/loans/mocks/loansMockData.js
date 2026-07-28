// Mock data for the Loans list table.
// The first 10 entries match the uploaded design exactly.
// The remainder are generated to support pagination ("Showing 10 of 124").

export const CATEGORY = "Government Salary Workers Loan";

// The 10 loans that appear in the design screenshots, with the exact
// reference / customer / amount / date / status shown.
// `reviewReady` distinguishes the two "Processing" sub-states seen in the
// designs: once KYC + Credit Check are both approved, the loan surfaces
// header-level Approve/Reject actions (the overall loan decision).
export const FEATURED_LOANS = [
  {
    reference: "lon_f5r3i354224",
    customer: "Joseph Awolowo",
    customerId: "cus_awolowoj",
    type: "Individual",
    category: CATEGORY,
    amount: 20000,
    date: "2025-04-07T10:34:00",
    status: "New",
  },
  {
    reference: "lon_3r342224kj",
    customer: "David Zakariya",
    customerId: "cus_zakariyad",
    type: "Corporate",
    category: CATEGORY,
    amount: 1250000,
    date: "2025-04-21T13:34:00",
    status: "Processing",
    reviewReady: false,
  },
  {
    reference: "lon_f53wkek332",
    customer: "Elizabeth Ebizi",
    customerId: "cus_ebizie",
    type: "Individual",
    category: CATEGORY,
    amount: 500000,
    date: "2025-04-09T21:04:00",
    status: "On hold",
  },
  {
    reference: "lon_4kr43fei42",
    customer: "Priscilla Olabode",
    customerId: "cus_olabodep",
    type: "Individual",
    category: CATEGORY,
    amount: 25000,
    date: "2025-04-15T13:34:00",
    status: "Processing",
    reviewReady: true,
  },
  {
    reference: "lon_jkfnei3mw2",
    customer: "Peter Ateli",
    customerId: "cus_atelip",
    type: "Corporate",
    category: CATEGORY,
    amount: 900500,
    date: "2025-04-06T09:10:00",
    status: "Rejected",
  },
  {
    reference: "lon_dwdr929eww",
    customer: "Victoria Nwachukwu",
    customerId: "cus_nwachukwuv",
    type: "Individual",
    category: CATEGORY,
    amount: 50000,
    date: "2025-04-01T07:45:00",
    status: "Active",
  },
  {
    reference: "lon_z0cwfer222",
    customer: "Peter Gambo",
    customerId: "cus_gambop",
    type: "Corporate",
    category: CATEGORY,
    amount: 2000000,
    date: "2025-03-30T11:10:00",
    status: "Awaiting",
  },
  {
    reference: "lon_f03wfei433",
    customer: "Lydia Musa",
    customerId: "cus_musal",
    type: "Corporate",
    category: CATEGORY,
    amount: 50000,
    date: "2025-03-28T10:34:00",
    status: "Declined",
  },
  {
    reference: "lon_3o12krjfjs9",
    customer: "Grace Kawu",
    customerId: "cus_kawug",
    type: "Individual",
    category: CATEGORY,
    amount: 85000,
    date: "2025-03-21T13:34:00",
    status: "Pending",
  },
  {
    reference: "lon_jkfn32ke3o",
    customer: "Jasmine Omisore",
    customerId: "cus_omisorej",
    type: "Corporate",
    category: CATEGORY,
    amount: 250000,
    date: "2025-03-10T12:32:00",
    status: "Repaid",
  },
];

const FIRST_NAMES = [
  "Chidinma",
  "Emeka",
  "Ngozi",
  "Tunde",
  "Aisha",
  "Bola",
  "Chukwuemeka",
  "Funmilayo",
  "Ikechukwu",
  "Kemi",
  "Nnamdi",
  "Oluwaseun",
  "Uche",
  "Yetunde",
  "Ifeoma",
  "Segun",
  "Amaka",
  "Kelechi",
  "Titi",
  "Obinna",
  "Halima",
  "Femi",
  "Blessing",
  "Chinedu",
  "Adaeze",
];
const LAST_NAMES = [
  "Okafor",
  "Balogun",
  "Eze",
  "Adeyemi",
  "Ibrahim",
  "Nwosu",
  "Okonkwo",
  "Abubakar",
  "Chukwu",
  "Adebayo",
  "Danladi",
  "Okeke",
  "Uzoma",
  "Bello",
  "Ogunleye",
  "Nnaji",
  "Yusuf",
  "Anyanwu",
  "Ojo",
  "Madu",
];
const STATUS_POOL = [
  "New",
  "Processing",
  "On hold",
  "Awaiting",
  "Pending",
  "Active",
  "Declined",
  "Rejected",
  "Repaid",
];
const TYPES = ["Individual", "Corporate"];

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function generateFillerLoans(count) {
  const rand = seededRandom(42);
  const loans = [];
  let day = 8; // start just before the earliest featured date (Mar 10, 2025)
  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const status = STATUS_POOL[Math.floor(rand() * STATUS_POOL.length)];
    const type = TYPES[Math.floor(rand() * TYPES.length)];
    const amount = Math.round((5000 + rand() * 1995000) / 1000) * 1000;
    day -= Math.ceil(rand() * 3);
    const monthOffset = day <= 0 ? 1 : 0;
    const safeDay = day <= 0 ? day + 28 : day;
    const month = 3 - monthOffset; // walk backward from March into earlier months
    const hh = Math.floor(rand() * 12) + 1;
    const mm = Math.floor(rand() * 60);
    const dateObj = new Date(
      2025,
      Math.max(month - 1, 0),
      Math.max(safeDay, 1),
      hh,
      mm,
    );

    loans.push({
      reference: `lon_${Math.random().toString(36).slice(2, 8)}${i}`,
      customer: `${first} ${last}`,
      customerId: `cus_${first.toLowerCase()}${last.toLowerCase()}`,
      type,
      category: CATEGORY,
      amount,
      date: dateObj.toISOString(),
      status,
    });
  }
  return loans;
}

export const TOTAL_LOANS = 124;

export const ALL_LOANS = [
  ...FEATURED_LOANS,
  ...generateFillerLoans(TOTAL_LOANS - FEATURED_LOANS.length),
];

export function getLoanByReference(reference) {
  return ALL_LOANS.find((loan) => loan.reference === reference);
}
