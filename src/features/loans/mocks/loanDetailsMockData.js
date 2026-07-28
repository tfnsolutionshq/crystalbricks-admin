// Full detail records for each loan, keyed by reference.
// These back the "View Loan" page's six tabs: Application Details,
// KYC Documents, Credit Check, Approval Details, Repayment Schedule, Notes.
//
// Only the tabs relevant to a loan's stage are shown by the UI (see
// helpers/loanHelpers.js -> getAvailableTabs), so not every record below
// populates every section.

const kycDocsBase = [
  {
    section: "Identity Document",
    label: "Passport Photograph",
    filename: "VotersCard_AwolowoJ.jpeg",
  },
  {
    section: "Pay Slip",
    label: "Document",
    filename: "PoInvome_AwolowoJ.pdf",
  },
  {
    section: "Employment/confirmation/promotion letter",
    label: "Document",
    filename: "Utility-bill.pdf",
  },
];

export const LOAN_DETAILS = {
  // 1. New — nothing reviewed yet
  lon_f5r3i354224: {
    application: {
      customer: "Joseph Awolowo",
      reference: "lon_f5r3i354224",
      oracleNumber: "098766",
      ipps: "098766",
      employer: "Huawei Corporation",
      accountBalance: 556738.99,
      accountType: "CSCS",
      loanAmount: 20000,
      loanType: "Individual",
      period: "N/A",
      date: "2025-04-07T10:34:00",
      category: "Governmnet",
      loanPurpose: null,
    },
    kyc: { status: "pending", documents: kycDocsBase },
    credit: { status: "pending", score: 713, rating: "Good", risk: "Medium" },
    approval: null,
    schedule: null,
    notes: [],
  },

  // 2. Processing (not yet review-ready) — KYC / credit still pending
  lon_3r342224kj: {
    application: {
      customer: "David Zakariya",
      reference: "lon_f5r3i354224",
      accountBalance: 556738.99,
      accountType: "CSCS",
      loanAmount: 1250000,
      loanType: "Individual",
      period: "6 months",
      date: "2025-04-07T10:34:00",
      category: "Government Salary Workers Loan",
      loanPurpose: null,
    },
    kyc: { status: "pending", documents: kycDocsBase },
    credit: { status: "pending", score: null, rating: null, risk: null },
    approval: null,
    schedule: null,
    notes: [],
  },

  // 3. On hold — additional document requested
  lon_f53wkek332: {
    application: {
      customer: "Elizabeth Ebizi",
      reference: "lon_f53wkek332",
      accountBalance: 556738.99,
      accountType: "CSCS",
      loanAmount: 500000,
      loanType: "Individual",
      period: "3 months",
      date: "2025-04-09T21:04:00",
      category: "Government Salary Workers Loan",
      loanPurpose: "Further my studies in business administration",
    },
    kyc: {
      status: "on_hold",
      documents: kycDocsBase,
      note: "Requested clearer copy of pay slip.",
    },
    credit: { status: "approved", score: 713, rating: "Good", risk: "Medium" },
    approval: null,
    schedule: null,
    notes: [
      {
        author: "Uche Peters",
        role: "Compliance",
        tag: "Comment",
        message:
          "Requested a clearer copy of the pay slip document before proceeding.",
        date: "2025-04-09T18:00:00",
      },
    ],
  },

  // 4. Processing (review-ready) — KYC + Credit approved, awaiting loan decision
  lon_4kr43fei42: {
    application: {
      customer: "Priscilla Olabode",
      reference: "lon_4kr43fei42",
      accountBalance: 573843,
      accountType: "CSCS",
      loanAmount: 25000,
      loanType: "Individual",
      period: "6 months",
      date: "2025-04-07T10:34:00",
      category: "Government Salary Workers Loan",
      loanPurpose: null,
    },
    kyc: {
      status: "approved",
      documents: kycDocsBase,
      reviewedBy: "Theopilus Makun (Compliance)",
      reviewedDate: "2025-04-11T12:00:00",
    },
    credit: {
      status: "approved",
      score: 713,
      rating: "Good",
      risk: "Medium",
      reviewedBy: "Ayodele Onome (Credit Appraisal)",
      reviewedDate: "2025-04-12T17:31:00",
    },
    approval: null,
    schedule: null,
    notes: [
      {
        author: "Ayodele Onome",
        role: "Credit Appraisal",
        tag: "Approved",
        message: "Approved credit check.",
        date: "2025-04-12T17:31:00",
      },
      {
        author: "Theopilus Makun",
        role: "Compliance",
        tag: "Approved",
        message: "Approved KYC documents.",
        date: "2025-04-11T12:00:00",
      },
    ],
  },

  // 5. Rejected — credit check failed, application closed
  lon_jkfnei3mw2: {
    application: {
      customer: "Peter Ateli",
      reference: "lon_jkfnei3mw2",
      accountBalance: 91088.5,
      accountType: "DCS",
      loanAmount: 900500,
      loanType: "Corporate",
      period: "3 months",
      date: "2025-04-07T10:34:00",
      category: "Government Salary Workers Loan",
      loanPurpose: "Business purposes.",
    },
    kyc: {
      status: "rejected",
      documents: kycDocsBase,
      reason: "Documents inconsistent with application details.",
    },
    credit: {
      status: "rejected",
      score: 402,
      rating: "Very poor",
      risk: "Very high",
      reason: "Credit score below minimum threshold.",
    },
    approval: null,
    schedule: null,
    notes: [],
  },

  // 6. Active — disbursed, repayments in progress
  lon_dwdr929eww: {
    application: {
      customer: "Victoria Nwachukwu",
      reference: "lon_dwdr929eww",
      accountBalance: 96708.05,
      accountType: "CSCS",
      loanAmount: 50000,
      loanType: "Individual",
      period: "5 months",
      date: "2025-04-01T07:45:00",
      category: "Government Salary Workers Loan",
      loanPurpose: "Business Expansion - new equipment purchase.",
    },
    kyc: {
      status: "approved",
      documents: kycDocsBase,
      reviewedBy: "Theopilus Makun (Compliance)",
    },
    credit: { status: "approved", score: 713, rating: "Good", risk: "Medium" },
    approval: {
      amount: 50000,
      interestPercent: 13,
      interestAmount: 6500,
      instalmentAmount: 11300,
      accepted: "2025-04-02T09:46:00",
      startDate: "2025-04-03T07:45:00",
      endDate: "2025-09-02T12:00:00",
      period: "5 months",
      defaultPaymentMethod: "Wallet",
    },
    schedule: [
      {
        transactionId: null,
        amountDue: 11300,
        paymentMethod: null,
        dueDate: "2025-09-03T07:45:00",
        paidDate: null,
        status: "Pending",
      },
      {
        transactionId: null,
        amountDue: 11300,
        paymentMethod: null,
        dueDate: "2025-08-03T07:45:00",
        paidDate: null,
        status: "Pending",
      },
      {
        transactionId: null,
        amountDue: 11300,
        fineAmount: 1465.32,
        paymentMethod: null,
        dueDate: "2025-07-03T07:45:00",
        paidDate: null,
        status: "Overdue",
      },
      {
        transactionId: "rpy_edsd2244t",
        amountDue: 11300,
        paymentMethod: "Wallet",
        dueDate: "2025-06-03T07:45:00",
        paidDate: "2025-06-03T07:45:00",
        status: "Paid",
      },
      {
        transactionId: "rpy_2424rese3q",
        amountDue: 11300,
        paymentMethod: "Wallet",
        dueDate: "2025-05-03T07:45:00",
        paidDate: "2025-05-03T07:45:00",
        status: "Paid",
      },
    ],
    notes: [
      {
        author: "Uche Peters",
        role: "Compliance",
        tag: "Comment",
        message: "₦1,465.32 added to Amount Due as overdue repayment fine.",
        date: "2025-07-07T17:31:00",
      },
      {
        author: "Theopilus Makun",
        role: "Compliance",
        tag: "Approved",
        message:
          "Congratulations. Your loan has been approved and will be disbursed to your wallet shortly.",
        date: "2025-04-03T12:21:00",
      },
    ],
  },

  // 7. Awaiting — approved by admin, not yet accepted by customer
  lon_z0cwfer222: {
    application: {
      customer: "Peter Gambo",
      reference: "lon_z0cwfer222",
      accountBalance: 556738.99,
      accountType: "DCS",
      loanAmount: 2000000,
      loanType: "Corporate",
      period: "12 months",
      date: "2025-03-30T11:10:00",
      category: "Government Salary Workers Loan",
      loanPurpose: "Business Expansion - new equipment purchase.",
    },
    kyc: { status: "approved", documents: kycDocsBase },
    credit: { status: "approved", score: 713, rating: "Good", risk: "Medium" },
    approval: {
      amount: 1500000,
      interestPercent: 20,
      interestAmount: 300000,
      instalmentAmount: 150385.33,
      accepted: null,
      startDate: "2025-03-31T12:00:00",
      endDate: "2026-03-30T12:00:00",
      period: "12 months",
      defaultPaymentMethod: "Wallet",
    },
    schedule: null,
    notes: [],
  },

  // 8. Declined — approval was declined
  lon_f03wfei433: {
    application: {
      customer: "Lydia Musa",
      reference: "lon_f03wfei433",
      accountBalance: 556738.99,
      accountType: "CSCS",
      loanAmount: 50000,
      loanType: "Corporate",
      period: "2 months",
      date: "2025-03-28T10:34:00",
      category: "Government Salary Workers Loan",
      loanPurpose: null,
    },
    kyc: { status: "approved", documents: kycDocsBase },
    credit: { status: "approved", score: 697, rating: "Fair", risk: "Medium" },
    approval: {
      amount: 35000,
      interestPercent: 12,
      interestAmount: 4200,
      instalmentAmount: 19600,
      declined: "2026-03-30T12:00:00",
      startDate: "2025-03-29T10:34:00",
      endDate: "2025-04-28T12:00:00",
      period: "2 months",
      defaultPaymentMethod: "Wallet",
      declinedState: true,
    },
    schedule: null,
    notes: [],
  },

  // 9. Pending — customer accepted, awaiting disbursement
  lon_3o12krjfjs9: {
    application: {
      customer: "Grace Kawu",
      reference: "lon_3o12krjfjs9",
      accountBalance: 556738.99,
      accountType: "DCS",
      loanAmount: 85000,
      loanType: "Individual",
      period: "12 months",
      date: "2025-03-21T13:34:00",
      category: "Government Salary Workers Loan",
      loanPurpose: "Business Expansion - new equipment purchase.",
    },
    kyc: { status: "approved", documents: kycDocsBase },
    credit: { status: "approved", score: 713, rating: "Good", risk: "Medium" },
    approval: {
      amount: 1500000,
      interestPercent: 20,
      interestAmount: 300000,
      instalmentAmount: 150385.33,
      accepted: "2025-04-11T12:31:00",
      startDate: "2025-03-31T12:00:00",
      endDate: "2026-03-30T12:00:00",
      period: "12 months",
      defaultPaymentMethod: "Wallet",
    },
    schedule: null,
    notes: [],
  },

  // 10. Repaid — fully paid off
  lon_jkfn32ke3o: {
    application: {
      customer: "Jasmine Omisore",
      reference: "lon_jkfn32ke3o",
      accountBalance: 556738.99,
      accountType: "Individual",
      loanAmount: 250000,
      loanType: "Individual",
      period: "3 months",
      date: "2025-04-10T12:32:00",
      category: "Government Salary Workers Loan",
      loanPurpose: "Business Expansion - new equipment purchase.",
    },
    kyc: { status: "approved", documents: kycDocsBase },
    credit: { status: "approved", score: 713, rating: "Good", risk: "Medium" },
    approval: {
      amount: 250000,
      interestPercent: 13,
      interestAmount: 33430.35,
      instalmentAmount: 94385.33,
      accepted: "2025-04-11T12:00:00",
      startDate: "2025-04-11T12:00:00",
      endDate: "2025-07-10T12:00:00",
      period: "3 months",
      defaultPaymentMethod: "Wallet",
    },
    schedule: [
      {
        transactionId: "rpy_rwrfdxcss2",
        amountDue: 94385.33,
        paymentMethod: "Wallet",
        dueDate: "2025-07-10T12:32:00",
        paidDate: "2025-07-10T12:32:00",
        status: "Paid",
      },
      {
        transactionId: "rpy_riri93i3nrj",
        amountDue: 94385.33,
        paymentMethod: "Debit card",
        dueDate: "2025-06-10T12:32:00",
        paidDate: "2025-06-11T09:19:00",
        status: "Paid",
      },
      {
        transactionId: "rpy_jfjfi32bisq",
        amountDue: 94385.33,
        paymentMethod: "Wallet",
        dueDate: "2025-05-10T12:32:00",
        paidDate: "2025-05-10T12:32:00",
        status: "Paid",
      },
    ],
    notes: [],
  },
};

export function getLoanDetail(reference) {
  return LOAN_DETAILS[reference] || null;
}
