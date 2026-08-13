// ============================================================================
// MOCK DATA
// Central place for fake data so the Customers list, Customer details tabs,
// and Transaction view pages all reference consistent records.
// Swap these out for real API calls whenever the backend is ready — the
// shapes below are what the components expect.
// ============================================================================

export const customerStats = {
  totalCustomers: 8909,
  totalActive: 1,
  inactive: 142,
};

export const customers = [
  {
    id: "75484yr8-3euef-jrjtti844",
    name: "Olamilekan Adams",
    email: "olamilekanagbemu@gmail.com",
    phone: "08138940403",
    kyc: "Verified",
    type: "Individual",
    status: "Active",
    accountNumber: "1234567890",
    personal: {
      firstName: "Olamilekan",
      lastName: "Adams",
      gender: "Male",
      dob: "Jan 4, 1994",
      nationality: "Nigerian",
    },
    contact: {
      phone: "08094893211",
      email: "olamilekanagbemu@gmail.com",
      address: "12, Riff Sopeola Street, Off Admiralty Rd., Lekki Phase 1",
      state: "Lagos",
      country: "Nigeria",
    },
    bank: {
      bvn: "2393939330201",
      accountNumber: "3088743237",
      bankName: "Access Bank PLC",
      accountName: "OLAMILEKAN ADAMS UCHE",
      creditScore: "697/850",
      creditRating: "Fair",
    },
    metadata: {
      id: "75484yr8-3euef-jrjtti844",
      username: "-",
      dateCreated: "Mar 2, 2024 at 12:32 PM",
      lastLogin: "Apr 2, 2025 at 9:32 AM",
      dateVerified: "Mar 4, 2024 at 1:30 PM",
      kyc: "Verified",
    },
    nextOfKin: {
      firstName: "Olamilekan",
      lastName: "Adams",
      relationship: "Brother",
      phone: "+2347069790950",
      email: "olamilekanagbemu@gmail.com",
      country: "Nigeria",
      state: "Lagos",
      address: "Olongo aguchi bus stop Lekki VI",
    },
    accountOfficer: {
      firstName: "Kelechi",
      lastName: "Nwankwo",
      email: "Nigerian",
      phone: "+2348093783927",
    },
    kycDocuments: {
      livenessImage: "VotersCard_AwolowoJ.jpeg",
      idType: "Voter's card",
      idNumber: "1234567890ADV",
      proofOfAddress: "24 Lekki Street",
      passportPhoto: "VotersCard_AwolowoJ.jpeg",
      signaturePhoto: "VotersCard_AwolowoJ.jpeg",
    },
    balances: [
      { type: "Wallet", available: 53930.5, total: 58971.48 },
      { type: "Fixed Deposit", available: 293992.98, total: 293992.98 },
      { type: "Loans", available: 44903.32, total: 44903.32 },
    ],
    loan: {
      referenceId: "uohsyCB123",
      amount: 50000.0,
      interestRate: "13%",
      interestAmount: 6500.0,
      instalmentAmount: 11300.0,
      accepted: "Apr 2, 2025 9:46 AM",
      startDate: "Apr 3, 2025 7:45 AM",
      endDate: "Sep 2, 2025 12:00 PM",
      period: "5 months",
      defaultPaymentMethod: "Wallet",
    },
    auditLog: [
      {
        group: "Today, Apr 10",
        entries: [
          {
            time: "12:32 PM",
            performedBy: "User",
            action: "Sent money",
            device: "iPhone 12 Mini",
            ip: "137.323.34.311",
            location: "Lagos, Nigeria",
            status: "Completed",
          },
          {
            time: "10:52 AM",
            performedBy: "User",
            action: "Updated profile",
            device: "iPhone 12 Mini",
            ip: "137.323.34.311",
            location: "Lagos, Nigeria",
            status: "Completed",
          },
          {
            time: "10:40 AM",
            performedBy: "User",
            action: "Signed in",
            device: "iPhone 12 Mini",
            ip: "137.323.34.311",
            location: "Lagos, Nigeria",
            status: "Completed",
          },
        ],
      },
      {
        group: "Yesterday, Apr 9",
        entries: [
          {
            time: "12:32 PM",
            performedBy: "Theopilus Makun...",
            action: "Updated profile",
            device: "Web Chrome 2.32",
            ip: "192.38.955.01",
            location: "Lagos, Nigeria",
            status: "Completed",
          },
          {
            time: "12:32 PM",
            performedBy: "User",
            action: "Signed in",
            device: "iPhone 12 Mini",
            ip: "137.323.34.311",
            location: "Lagos, Nigeria",
            status: "Completed",
          },
        ],
      },
      {
        group: "Apr 2, 2025",
        entries: [
          {
            time: "12:32 PM",
            performedBy: "User",
            action: "Signed in",
            device: "iPhone 12 Mini",
            ip: "137.323.34.311",
            location: "Lagos, Nigeria",
            status: "Blocked",
          },
        ],
      },
    ],
    transactions: [
      {
        id: "dpt_jkfn32ke3o",
        description: "Received ₦50,000 via OPAY DIGITAL SERVICES LIMITED...",
        amount: 50000.0,
        date: "Apr 10, 2025 12:32 PM",
        status: "Completed",
        type: "Deposit",
        category: "Capital",
        fee: 50.0,
      },
      {
        id: "fee_jkfn32ke3o",
        description: "Charges",
        amount: 50.0,
        date: "Apr 10, 2025 12:32 PM",
        status: "Completed",
        type: "Fee",
        category: "Charges",
        fee: 0,
      },
      {
        id: "trf_f53wkek332",
        description: "Sent ₦20,000 Coralpay-Nextgen Pg/4849483949/Wema...",
        amount: 20000.0,
        date: "Apr 7, 2025 10:34 AM",
        status: "Pending",
        type: "Transfer",
        category: "Payout",
        fee: 20.0,
      },
      {
        id: "trf_f03wfei432",
        description: "Sent ₦20,000 Coralpay-Nextgen Pg/4849483949/Wema...",
        amount: 20000.0,
        date: "Mar 30, 2025 11:10 AM",
        status: "Failed",
        type: "Transfer",
        category: "Payout",
        fee: 20.0,
      },
      {
        id: "trf_f03wfei433",
        description: "Sent ₦20,000 Coralpay-Nextgen Pg/4849483949/Wema...",
        amount: 20000.0,
        date: "Mar 30, 2025 10:34 AM",
        status: "Failed",
        type: "Transfer",
        category: "Payout",
        fee: 20.0,
      },
      {
        id: "dpt_3o12krjfjs9",
        description: "Received ₦25,000 via OPAY DIGITAL SERVICES LIMITED...",
        amount: 25000.0,
        date: "Mar 21, 2025 1:34 PM",
        status: "Completed",
        type: "Deposit",
        category: "Capital",
        fee: 50.0,
      },
      {
        id: "fee_3o12krjfjs9",
        description: "Charges",
        amount: 50.0,
        date: "Mar 21, 2025 1:34 PM",
        status: "Completed",
        type: "Fee",
        category: "Charges",
        fee: 0,
      },
      {
        id: "lon_4kr43fei42",
        description: "Loan repayment ID: 848292332",
        amount: 25000.0,
        date: "Mar 21, 2025 1:34 PM",
        status: "Completed",
        type: "Loan",
        category: "Repayment",
        fee: 0,
      },
    ],
  },
  {
    id: "cust-002",
    name: "Joshua Usman",
    email: "joshuausman87@gmail.com",
    phone: "08138940403",
    kyc: "Verified",
    type: "Individual",
    status: "Inactive",
  },
  {
    id: "cust-003",
    name: "Timothy Kemepade",
    email: "timkem23@yahoo.com",
    phone: "08138940403",
    kyc: "Pending",
    type: "Individual",
    status: "Active",
  },
  {
    id: "cust-004",
    name: "Nengi Gbobo",
    email: "ngengigb89@outlook.com",
    phone: "08138940403",
    kyc: "Rejected",
    type: "Corporate",
    status: "Active",
  },
  {
    id: "cust-005",
    name: "Ogechi Orji",
    email: "ogeorji101@gmail.com",
    phone: "08138940403",
    kyc: "Verified",
    type: "Individual",
    status: "Active",
  },
  {
    id: "cust-006",
    name: "Timipre Aganaba",
    email: "timagan77@hotmail.com",
    phone: "08138940403",
    kyc: "Verified",
    type: "Individual",
    status: "Active",
  },
  {
    id: "cust-007",
    name: "Erekosima Izuokumo",
    email: "erekosimaizuok@gmail.com",
    phone: "08138940403",
    kyc: "Verified",
    type: "Corporate",
    status: "Active",
  },
  {
    id: "cust-008",
    name: "Kemepade Obubra",
    email: "kemobubra21@yahoo.com",
    phone: "08138940403",
    kyc: "Pending",
    type: "Individual",
    status: "Active",
  },
  {
    id: "cust-009",
    name: "Mary Ateli",
    email: "maryateli19@outlook.com",
    phone: "08138940403",
    kyc: "Verified",
    type: "Individual",
    status: "Inactive",
  },
  {
    id: "cust-010",
    name: "Ugochukwu Obiano",
    email: "ugochukwuobiano@gmail.com",
    phone: "08138940403",
    kyc: "Rejected",
    type: "Corporate",
    status: "Active",
  },
];

// Helper: find a customer by id, falling back to the fully-detailed demo
// record (Olamilekan Adams) so every route has something rich to render.
export function getCustomerById(id) {
  return customers.find((c) => c.id === id) || customers[0];
}

// Helper: find a transaction that belongs to a given customer.
export function getTransaction(customerId, txnId) {
  const customer = getCustomerById(customerId);
  const txn = (customer.transactions || []).find((t) => t.id === txnId);
  if (!txn) return null;

  // Balance snapshot shown on the transaction view page. In a real backend
  // this would come from a ledger entry tied to the transaction itself.
  return {
    ...txn,
    customerName: customer.name,
    previousAvailable: 9590.54,
    pending: 5040.98,
    newAvailable: 59590.54,
    newPending: 5040.98,
  };
}
