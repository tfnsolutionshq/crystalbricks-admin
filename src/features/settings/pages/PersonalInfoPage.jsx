// src/features/settings/pages/PersonalInfoPage.jsx
// Main "Personal Info" tab of Settings. All page-unique sections (avatar
// card, form) are built inline here per project convention.

import { useState, useEffect } from "react";
import { KeyRound, Loader2 } from "lucide-react";

import Layout from "@/shared/components/Layout";

import Field from "@/shared/components/Field";
import TextInput from "@/shared/components/TextInput";

import ChangePasswordModal from "@/features/settings/components/ChangePasswordModal";
import { useAuth } from "@/shared/context/AuthContext";
import {
  fetchTeamMember,
  updateTeamMember,
} from "@/features/team-management/api/teamManagementApi";

export default function PersonalInfoPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });
  const [original, setOriginal] = useState({
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadUser() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { data } = await fetchTeamMember(user.id);
        if (cancelled) return;
        const next = {
          name: data?.name ?? "",
          phone: data?.phone_number ?? data?.phone ?? "",
        };
        setForm(next);
        setOriginal(next);
      } catch {
        if (cancelled) return;
        const next = {
          name: user?.name ?? "",
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
    if (form.name !== original.name) payload.name = form.name;
    if (form.phone !== original.phone) payload.phone_number = form.phone || null;
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

  function handleSavePassword(form) {
    // Wire up to your API here.
    setPasswordModalOpen(false);
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
                <Field label="Name" required>
                  <TextInput
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </Field>

                <Field label="Email Address">
                  <TextInput
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    className="bg-slate-50 text-slate-400"
                  />
                </Field>

                <Field label="Phone Number">
                  <TextInput
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </Field>
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
                  onClick={() => setPasswordModalOpen(true)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Change Password
                </button>
              </div>
            </div>
          </form>

          <ChangePasswordModal
            open={passwordModalOpen}
            onClose={() => setPasswordModalOpen(false)}
            onSubmit={handleSavePassword}
          />
        </div>
      </div>
    </Layout>
  );
}
