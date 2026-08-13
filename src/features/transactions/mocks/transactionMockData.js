// ============================================================================
// TRANSACTIONS MOCKS
// Feature-local mock data. Swap for real API calls once the backend exists —
// the shapes here are exactly what TransactionsPage / TransactionViewPage
// expect to receive.
// ============================================================================

// Rows shown in the Transactions table (list page).
export const transactionsList = [
  {
    id: "dpt_jkfn32ke3o",
    customer: "Olamilekan Adams",
    description: "Received ₦50,000 via OPAY DIGITAL SERVICES LIMITED...",
    amount: 50000.0,
    date: "Apr 10, 2025 12:32 PM",
    status: "Completed",
  },
  {
    id: "fee_jkfn32ke3o",
    customer: "Temidayo Kolapo",
    description: "Charges",
    amount: 50.0,
    date: "Apr 10, 2025 12:32 PM",
    status: "Completed",
  },
  {
    id: "trf_f53wkek332",
    customer: "Kio Ogan",
    description: "Sent ₦20,000 Coralpay-Nextgen Pg/4849483949/Wema...",
    amount: 20000.0,
    date: "Apr 7, 2025 10:34 AM",
    status: "In progress",
  },
  {
    id: "inv_jkfnei3mw2",
    customer: "Seyi Ojo-Benson",
    description: "Bought ACCESSCORP shares...",
    amount: 9030.0,
    date: "Apr 6, 2025 9:10 AM",
    status: "Completed",
  },
  {
    id: "inv_dwdr929eww",
    customer: "Yewande Ojo",
    description: "Bought AIRTELCO shares...",
    amount: 5030.0,
    date: "Apr 1, 2025 7:45 AM",
    status: "In progress",
  },
  {
    id: "trf_f03wfei432",
    customer: "Fiyinfolu Tubonimi",
    description: "Sent ₦20,000 Coralpay-Nextgen Pg/4849483949/Wema...",
    amount: 20000.0,
    date: "Mar 30, 2025 11:10 AM",
    status: "Failed",
  },
  {
    id: "trf_f03wfei433",
    customer: "Isobo Kalio",
    description: "Sent ₦20,000 Coralpay-Nextgen Pg/4849483949/Wema...",
    amount: 20000.0,
    date: "Mar 30, 2025 10:34 AM",
    status: "Failed",
  },
  {
    id: "dpt_3o12krjfjs9",
    customer: "Gbegha Ekisagha",
    description: "Received ₦25,000 via OPAY DIGITAL SERVICES LIMITED...",
    amount: 25000.0,
    date: "Mar 21, 2025 1:34 PM",
    status: "Completed",
  },
  {
    id: "fee_3o12krjfjs9",
    customer: "Erekosima Fubara",
    description: "Charges",
    amount: 50.0,
    date: "Mar 21, 2025 1:34 PM",
    status: "Completed",
  },
  {
    id: "lon_4kr43fei42",
    customer: "Ogechi Kanu",
    description: "Loan repayment ID: 848292332",
    amount: 25000.0,
    date: "Mar 21, 2025 1:34 PM",
    status: "Completed",
  },
];

// Full detail records for the transaction view page, keyed by transaction id.
// Only a handful are fleshed out (enough to demo each status state) — every
// other id falls back to a generated record in getTransactionById below.
export const transactionDetails = {
  dpt_jkfn32ke3o: {
    id: "dpt_jkfn32ke3o",
    customer: "Olamilekan Adams",
    accountNumber: "1234567890",
    date: "Apr 10, 2025 12:32 PM",
    status: "Completed",
    amount: 50000.0,
    fee: 50.0,
    type: "Deposit",
    category: "Capital",
    senderDetails: "Osa Ero (UBA)",
    beneficiaryAccountNumber: "1234******",
    previousAvailable: 9590.54,
    newAvailable: 59590.54,
  },
  trf_f53wkek332: {
    id: "trf_f53wkek332",
    customer: "Kio Ogan",
    accountNumber: "2093882910",
    date: "Apr 7, 2025 10:34 AM",
    status: "In progress",
    amount: 20000.0,
    fee: 50.0,
    type: "Withdrawal",
    category: "Capital",
    senderDetails: "Osa Ero (UBA)",
    beneficiaryAccountNumber: "1234******",
    previousAvailable: 45210.0,
  },
  inv_dwdr929eww: {
    id: "inv_dwdr929eww",
    customer: "Yewande Ojo",
    accountNumber: "3311098234",
    date: "Apr 1, 2025 7:45 AM",
    status: "In progress",
    amount: 5030.0,
    fee: 30.0,
    type: "Withdrawal",
    category: "Investment",
    senderDetails: "Osa Ero (UBA)",
    beneficiaryAccountNumber: "1234******",
    previousAvailable: 12040.0,
  },
  trf_f03wfei432: {
    id: "trf_f03wfei432",
    customer: "Fiyinfolu Tubonimi",
    accountNumber: "7729103845",
    date: "Mar 30, 2025 11:10 AM",
    status: "Failed",
    amount: 20000.0,
    fee: 50.0,
    type: "Deposit",
    category: "Capital",
    beneficiaryBank: "Osa Ero (UBA)",
    beneficiaryAccountNumber: "1234******",
    previousAvailable: 9590.54,
    reason: "Network Failure",
  },
  trf_f03wfei433: {
    id: "trf_f03wfei433",
    customer: "Isobo Kalio",
    accountNumber: "8820019273",
    date: "Mar 30, 2025 10:34 AM",
    status: "Failed",
    amount: 20000.0,
    fee: 50.0,
    type: "Deposit",
    category: "Capital",
    beneficiaryBank: "Osa Ero (UBA)",
    beneficiaryAccountNumber: "1234******",
    previousAvailable: 9590.54,
    reason: "Network Failure",
  },
};

// Reasons shown in the "Confirm Rejection" reason dropdown.
export const rejectionReasons = [
  "Suspicious activity",
  "Invalid beneficiary details",
  "Insufficient documentation",
  "Duplicate transaction",
  "Network Failure",
  "Other",
];

export function getTransactionById(id) {
  if (transactionDetails[id]) return transactionDetails[id];

  // Fallback: build a reasonable-looking detail record from the list row so
  // every transaction in the table has somewhere to land.
  const row = transactionsList.find((t) => t.id === id);
  if (!row) return null;

  return {
    id: row.id,
    customer: row.customer,
    accountNumber: "1234567890",
    date: row.date,
    status: row.status,
    amount: row.amount,
    fee: row.amount >= 1000 ? 50.0 : 0,
    type: row.id.startsWith("dpt")
      ? "Deposit"
      : row.id.startsWith("trf")
        ? "Withdrawal"
        : "Transfer",
    category: row.id.startsWith("inv")
      ? "Investment"
      : row.id.startsWith("lon")
        ? "Repayment"
        : "Capital",
    senderDetails: row.status !== "Failed" ? "Osa Ero (UBA)" : undefined,
    beneficiaryBank: row.status === "Failed" ? "Osa Ero (UBA)" : undefined,
    beneficiaryAccountNumber: "1234******",
    previousAvailable: 9590.54,
    newAvailable: row.status === "Completed" ? 9590.54 + row.amount : undefined,
    reason: row.status === "Failed" ? "Network Failure" : undefined,
  };
}
