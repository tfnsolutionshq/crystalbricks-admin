// src/features/settings/pages/PersonalInfoPage.jsx
// Main "Personal Info" tab of Settings. All page-unique sections (avatar
// card, form) are built inline here per project convention.

import { useState } from "react";
import { Camera, BadgeCheck } from "lucide-react";

import Layout from "@/shared/components/Layout";
import Badge from "@/shared/components/Badge";

import Field from "@/shared/components/Field";
import TextInput from "@/shared/components/TextInput";

import SettingsTabs from "@/features/settings/components/SettingsTabs";
import { currentUser } from "@/features/settings/mocks/settingsMockData";

export default function PersonalInfoPage() {
  const [form, setForm] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    phone: currentUser.phone,
    jobTitle: currentUser.jobTitle,
    department: currentUser.department,
  });
  const [saved, setSaved] = useState(false);

  function handleChange(key, value) {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    // Wire up to your API here.
    setSaved(true);
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

          <form onSubmit={handleSubmit} className="max-w-3xl">
            {/* --------------------------------------------------------- */}
            {/* Avatar card                                                */}
            {/* --------------------------------------------------------- */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="w-16 h-16 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-xl font-semibold">
                    {currentUser.avatarInitials}
                  </span>
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center border-2 border-white hover:bg-pink-700 transition-colors"
                    aria-label="Change photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {currentUser.jobTitle}
                  </p>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* Form card                                                  */}
            {/* --------------------------------------------------------- */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-base font-semibold text-slate-900 mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Field label="First Name" required>
                  <TextInput
                    type="text"
                    value={form.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </Field>
                <Field label="Last Name" required>
                  <TextInput
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Email Address">
                <div className="relative">
                  <TextInput
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="pr-24 bg-slate-50 text-slate-400"
                  />
                  {currentUser.emailVerified && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Badge variant="success" className="gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </Badge>
                    </span>
                  )}
                </div>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Field label="Phone Number">
                  <TextInput
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </Field>
                <Field label="Job Title">
                  <TextInput
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) => handleChange("jobTitle", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Department">
                <TextInput
                  type="text"
                  value={form.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                />
              </Field>

              <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-slate-100">
                {saved && (
                  <span className="text-sm text-emerald-600 mr-auto">
                    Changes saved.
                  </span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
