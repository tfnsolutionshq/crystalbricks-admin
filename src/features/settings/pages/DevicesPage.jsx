// src/features/settings/pages/DevicesPage.jsx
// Main "Devices" tab of Settings. Table + log-out confirm are built inline
// since the confirm dialog here is a single, simple case (unlike Team
// Management's multi-action ConfirmActionModal).

import { useState } from "react";
import { Laptop, Smartphone, LogOut } from "lucide-react";

import Layout from "@/shared/components/Layout.jsx";

import Badge from "@/shared/components/Badge";
import KebabButton from "@/shared/components/KebabButton";
import ModalShell from "@/shared/components/ModalShell";

import SettingsTabs from "@/features/settings/components/SettingsTabs";
import { devices as initialDevices } from "@/features/settings/mocks/settingsMockData";
import { formatLastActive } from "@/features/settings/helpers/settingsHelpers";

function DeviceIcon({ deviceName }) {
  const isMobile = /iphone|android|galaxy/i.test(deviceName);
  const Icon = isMobile ? Smartphone : Laptop;
  return (
    <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5" />
    </span>
  );
}

export default function DevicesPage() {
  const [devices, setDevices] = useState(initialDevices);
  const [confirmTarget, setConfirmTarget] = useState(null); // 'all' | device object | null

  function handleLogOutDevice(device) {
    setDevices((prev) => prev.filter((d) => d.id !== device.id));
    setConfirmTarget(null);
  }

  function handleLogOutAll() {
    setDevices((prev) => prev.filter((d) => d.current));
    setConfirmTarget(null);
  }

  const isAllConfirm = confirmTarget === "all";
  const targetDevice = isAllConfirm ? null : confirmTarget;

  return (
    <Layout activeNavItem="Settings">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
          {/* ------------------------------------------------------------- */}
          {/* Header                                                       */}
          {/* ------------------------------------------------------------- */}
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>
          <SettingsTabs />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Active Sessions
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Devices currently signed in to your Crystal App account.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmTarget("all")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" />
              Log Out All Other Devices
            </button>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Devices table                                                */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-400">
                    <th className="px-5 py-3.5 font-medium">Device</th>
                    <th className="px-5 py-3.5 font-medium">Location</th>
                    <th className="px-5 py-3.5 font-medium">IP Address</th>
                    <th className="px-5 py-3.5 font-medium">Last Active</th>
                    <th className="px-5 py-3.5 font-medium w-12" />
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr
                      key={device.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <DeviceIcon deviceName={device.deviceName} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-800 truncate">
                                {device.deviceName}
                              </p>
                              {device.current && (
                                <Badge variant="success">This device</Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate">
                              {device.browser}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                        {device.location}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                        {device.ip}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                        {formatLastActive(device.lastActive)}
                      </td>
                      <td className="px-5 py-3.5">
                        {!device.current && (
                          <KebabButton
                            items={[
                              {
                                label: "Log Out",
                                icon: <LogOut className="w-4 h-4" />,
                                danger: true,
                                onClick: () => setConfirmTarget(device),
                              },
                            ]}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Log out confirm modal                                        */}
          {/* ------------------------------------------------------------- */}
          <ModalShell
            open={!!confirmTarget}
            onClose={() => setConfirmTarget(null)}
            maxWidth="max-w-sm"
          >
            <div className="flex flex-col items-center text-center">
              <span className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
                <LogOut className="w-6 h-6" />
              </span>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                {isAllConfirm
                  ? "Log Out All Other Devices?"
                  : "Log Out This Device?"}
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                {isAllConfirm
                  ? "This will sign you out of every device except this one. You will need to sign in again on those devices."
                  : `This will end the session on "${targetDevice?.deviceName}". You will need to sign in again on that device.`}
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setConfirmTarget(null)}
                  className="flex-1 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    isAllConfirm
                      ? handleLogOutAll()
                      : handleLogOutDevice(targetDevice)
                  }
                  className="flex-1 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          </ModalShell>
        </div>
      </div>
    </Layout>
  );
}
