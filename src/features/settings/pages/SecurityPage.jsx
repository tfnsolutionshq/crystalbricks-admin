// src/features/settings/pages/SecurityPage.jsx
// Main "Security" tab of Settings. Password + 2FA cards are built inline;
// the two modals they trigger live in components/ since they're
// self-contained dialogs reused only from this page.

import { useState } from "react";
import { KeyRound, ShieldCheck, Monitor } from "lucide-react";
import { Link } from "react-router-dom";

import Layout from "@/shared/components/DashboardComponents/Layout.jsx";

import Toggle from "@/shared/components/DashboardComponents/Toggle";
import { Badge } from "@/features/customers/components/GeneralCustomerComponents";

import SettingsTabs from "@/features/settings/components/SettingsTabs";
import ChangePasswordModal from "@/features/settings/components/ChangePasswordModal";
import VerificationCodeModal from "@/features/settings/components/VerificationCodeModal";

import {
  currentUser,
  securityOverview,
} from "@/features/settings/mocks/settingsMockData";
import { formatSettingsDate } from "@/features/settings/helpers/settingsHelpers";

export default function SecurityPage() {
  const [passwordLastChanged, setPasswordLastChanged] = useState(
    securityOverview.passwordLastChanged,
  );
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    securityOverview.twoFactorEnabled,
  );

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  function handleToggle2FA(nextValue) {
    if (nextValue) {
      // Enabling requires verifying a code first — don't flip the toggle yet.
      setVerifyModalOpen(true);
    } else {
      setTwoFactorEnabled(false);
    }
  }

  function handleSavePassword(form) {
    // Wire up to your API here.
    setPasswordLastChanged(new Date().toISOString().slice(0, 10));
    setPasswordModalOpen(false);
  }

  function handleVerifyCode(code) {
    // Wire up to your API here.
    setTwoFactorEnabled(true);
    setVerifyModalOpen(false);
  }

  return (
    <Layout activeNavItem="Settings">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
          {/* ------------------------------------------------------------- */}
          {/* Header                                                       */}
          {/* ------------------------------------------------------------- */}
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>
          <SettingsTabs />

          <div className="max-w-3xl space-y-4">
            {/* --------------------------------------------------------- */}
            {/* Password card                                              */}
            {/* --------------------------------------------------------- */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Password
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Last changed {formatSettingsDate(passwordLastChanged)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(true)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* Two-Factor Authentication card                             */}
            {/* --------------------------------------------------------- */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Two-Factor Authentication
                      </h3>
                      <Badge variant={twoFactorEnabled ? "success" : "neutral"}>
                        {twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-md">
                      Add an extra layer of security to your account. We'll send
                      a verification code to {currentUser.email} whenever you
                      sign in from a new device.
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={twoFactorEnabled}
                  onChange={handleToggle2FA}
                  label="Toggle two-factor authentication"
                />
              </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* Active sessions shortcut card                              */}
            {/* --------------------------------------------------------- */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <Monitor className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Active Sessions
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Review and manage devices currently signed in to your
                      account.
                    </p>
                  </div>
                </div>
                <Link
                  to="/settings/devices"
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  View Devices
                </Link>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Modals                                                       */}
          {/* ------------------------------------------------------------- */}
          <ChangePasswordModal
            open={passwordModalOpen}
            onClose={() => setPasswordModalOpen(false)}
            onSubmit={handleSavePassword}
          />

          <VerificationCodeModal
            open={verifyModalOpen}
            email={currentUser.email}
            onClose={() => setVerifyModalOpen(false)}
            onSubmit={handleVerifyCode}
          />
        </div>
      </div>
    </Layout>
  );
}
