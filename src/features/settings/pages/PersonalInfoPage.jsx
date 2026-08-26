// src/features/settings/pages/PersonalInfoPage.jsx
// Main "Personal Info" tab of Settings. All page-unique sections (avatar
// card, form) are built inline here per project convention.

import { useState, useEffect } from "react";
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react";

import Layout from "@/shared/components/Layout";

import Field from "@/shared/components/Field";
import TextInput from "@/shared/components/TextInput";

import ChangePasswordModal from "@/features/settings/components/ChangePasswordModal";
import { useAuth } from "@/shared/context/AuthContext";
import {
  fetchTeamMember,
  updateTeamMember,
} from "@/features/team-management/api/teamManagementApi";
import { forgotPasswordRequest } from "@/features/auth/api/authApi";

export default function PersonalInfoPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_country_code: "",
    phone: "",
  });
  const [original, setOriginal] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_country_code: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  // Change password states
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [requestingReset, setRequestingReset] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadUser() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { data } = await fetchTeamMember(user.id);
        if (cancelled) return;
        // Split name into first and last name
        const fullName = data?.name ?? "";
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] ?? "";
        const lastName = nameParts.slice(1).join(" ");

        const next = {
          first_name: firstName,
          last_name: lastName,
          email: data?.email ?? "",
          phone_country_code: data?.phone_country_code ?? "",
          phone: data?.phone_number ?? data?.phone ?? "",
        };
        setForm(next);
        setOriginal(next);
      } catch {
        if (cancelled) return;
        // Split name into first and last name
        const fullName = user?.name ?? "";
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] ?? "";
        const lastName = nameParts.slice(1).join(" ");

        const next = {
          first_name: firstName,
          last_name: lastName,
          email: user?.email ?? "",
          phone_country_code: user?.phone_country_code ?? "",
          phone: user?.phone_number ?? user?.phone ?? "",
        };
        setForm(next);
        setOriginal(next);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadUser();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  function handleChange(key, value) {
    setSaved(false);
    setError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!user?.id) return;
    const payload = {};
    if (form.first_name !== original.first_name)
      payload.first_name = form.first_name;
    if (form.last_name !== original.last_name)
      payload.last_name = form.last_name;
    if (form.phone_country_code !== original.phone_country_code) {
      payload.phone_country_code = form.phone_country_code || null;
    }
    if (form.phone !== original.phone) {
      payload.phone_number = form.phone || null;
    }
    if (Object.keys(payload).length === 0) {
      setSaved(true);
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateTeamMember(user.id, payload);
      setOriginal(form);
      setSaved(true);
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "Failed to save changes",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleInitiateChangePassword() {
    if (!user?.email || requestingReset) return;
    setRequestingReset(true);
    setResetError(null);
    setPasswordSuccess(false);

    try {
      await forgotPasswordRequest(user.email);
      setPasswordModalOpen(true);
    } catch (err) {
      setResetError(
        err.response?.data?.message ??
        err.message ??
        "Failed to send password reset code. Please try again.",
      );
    } finally {
      setRequestingReset(false);
    }
  }

  return (
    <Layout activeNavItem="Settings">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
          {/* ------------------------------------------------------------- */}
          {/* Header                                                       */}
          {/* ------------------------------------------------------------- */}
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>

          <form onSubmit={handleSubmit} className="max-w-3xl">
            {/* --------------------------------------------------------- */}
            {/* Form card                                                  */}
            {/* --------------------------------------------------------- */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-slate-900">
                  Personal Information
                </h3>
                {loading && (
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Loading...
                  </span>
                )}
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="First Name" required>
                    <TextInput
                      type="text"
                      value={form.first_name}
                      onChange={(e) =>
                        handleChange("first_name", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Last Name">
                    <TextInput
                      type="text"
                      value={form.last_name}
                      onChange={(e) =>
                        handleChange("last_name", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <Field label="Email Address">
                  <TextInput
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    readOnly={true}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Country Code">
                    <TextInput
                      type="text"
                      placeholder="e.g. +234"
                      value={form.phone_country_code}
                      onChange={(e) =>
                        handleChange("phone_country_code", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Phone Number">
                    <TextInput
                      type="tel"
                      placeholder="e.g. 9012345677"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </Field>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-slate-100">
                {error && (
                  <span className="text-sm text-red-500 mr-auto">{error}</span>
                )}
                {saved && !error && (
                  <span className="text-sm text-emerald-600 mr-auto">
                    Changes saved.
                  </span>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* Change Password card                                        */}
            {/* --------------------------------------------------------- */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mt-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Password
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Choose a strong, unique password to protect your account.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleInitiateChangePassword}
                  disabled={requestingReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {requestingReset && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  {requestingReset ? "Sending Code..." : "Change Password"}
                </button>
              </div>

              {resetError && (
                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                  {resetError}
                </div>
              )}

              {passwordSuccess && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  Password updated successfully.
                </div>
              )}
            </div>
          </form>

          <ChangePasswordModal
            open={passwordModalOpen}
            onClose={() => setPasswordModalOpen(false)}
            email={user?.email ?? ""}
            onSuccess={() => {
              setPasswordSuccess(true);
              setTimeout(() => setPasswordSuccess(false), 5000);
            }}
          />
        </div>
      </div>
    </Layout>
  );
}
