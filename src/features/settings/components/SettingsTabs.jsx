// src/features/settings/components/SettingsTabs.jsx
// Tab navigation shared by PersonalInfoPage / SecurityPage / DevicesPage.
// Kept feature-local (not in shared components/) since it hard-codes the
// three Settings routes and isn't reused by any other feature.

import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/settings/personal-info", label: "Personal Info" },
  { to: "/settings/security", label: "Security" },
  { to: "/settings/devices", label: "Devices" },
];

export default function SettingsTabs() {
  return (
    <div className="flex items-center gap-6 border-b border-slate-200 mb-6 overflow-x-auto">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              isActive
                ? "text-slate-900 border-slate-900"
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
