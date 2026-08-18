// ============================================================================
// ROLE PERMISSIONS
// Describes every permission a role can carry, grouped by module and split
// into Read (view-only) and Write (create/update/delete/manage/approve...)
// access so admins can configure roles via simple Read/Write checkboxes.
// ============================================================================

export const ROLE_PERMISSIONS = [
  {
    key: "users",
    label: "Users",
    read: ["users.view"],
    write: ["users.create", "users.update", "users.delete"],
  },
  {
    key: "roles",
    label: "Roles",
    read: ["roles.view"],
    write: ["roles.create", "roles.update", "roles.delete"],
  },
  {
    key: "permissions",
    label: "Permissions",
    read: ["permissions.view"],
    write: [],
  },
  {
    key: "kyc",
    label: "KYC",
    read: ["kyc.view"],
    write: ["kyc.approve"],
  },
  {
    key: "loans",
    label: "Loans",
    read: ["loans.view", "loans.reports.view"],
    write: [
      "loans.create",
      "loans.update",
      "loans.delete",
      "loans.approve",
      "loans.reject",
      "loans.disburse",
    ],
  },
  {
    key: "loan-plans",
    label: "Loan Plans",
    read: [],
    write: ["loan-plans.manage"],
  },
  {
    key: "savings",
    label: "Savings",
    read: ["savings.view", "savings.reports.view"],
    write: [
      "savings.create",
      "savings.update",
      "savings.delete",
      "savings.approve",
      "savings.withdraw-approve",
    ],
  },
  {
    key: "saving-plans",
    label: "Saving Plans",
    read: [],
    write: ["saving-plans.manage"],
  },
  {
    key: "investments",
    label: "Investments",
    read: ["investments.view", "investments.reports.view"],
    write: [
      "investments.create",
      "investments.update",
      "investments.delete",
      "investments.approve",
      "investments.reject",
      "investments.mature",
      "investments.process-payouts",
    ],
  },
  {
    key: "investment-plans",
    label: "Investment Plans",
    read: [],
    write: ["investment-plans.manage"],
  },
  {
    key: "liquidity-penalty-configs",
    label: "Liquidity Penalty Configs",
    read: [],
    write: ["liquidity-penalty-configs.manage"],
  },
  {
    key: "fixed-deposits",
    label: "Fixed Deposits",
    read: ["fixed-deposits.view"],
    write: [
      "fixed-deposits.create",
      "fixed-deposits.update",
      "fixed-deposits.delete",
      "fixed-deposits.approve",
    ],
  },
  {
    key: "fixed-deposit-plans",
    label: "Fixed Deposit Plans",
    read: [],
    write: ["fixed-deposit-plans.manage"],
  },
  {
    key: "wallet",
    label: "Wallet",
    read: ["wallet.view", "wallet.reports.view"],
    write: ["wallet.debit", "wallet.credit", "wallet.freeze", "wallet.unfreeze"],
  },
  {
    key: "account-tiers",
    label: "Account Tiers",
    read: [],
    write: ["account-tiers.manage"],
  },
  {
    key: "dashboard",
    label: "Dashboard",
    read: ["dashboard.view"],
    write: [],
  },
  {
    key: "audit",
    label: "Audit",
    read: ["audit.view"],
    write: [],
  },
  {
    key: "reports",
    label: "Reports",
    read: ["reports.view"],
    write: [],
  },
];

/** Maps a role's permission array into a { moduleKey: { read, write } } map. */
export function getPermissionSelection(permissions = []) {
  const selection = {};
  for (const module of ROLE_PERMISSIONS) {
    selection[module.key] = {
      read: module.read.some((perm) => permissions.includes(perm)),
      write: module.write.some((perm) => permissions.includes(perm)),
    };
  }
  return selection;
}

/** Builds the permission array from a { moduleKey: { read, write } } map. */
export function buildPermissions(selection) {
  const result = [];
  for (const module of ROLE_PERMISSIONS) {
    if (selection[module.key]?.read) result.push(...module.read);
    if (selection[module.key]?.write) result.push(...module.write);
  }
  return result;
}