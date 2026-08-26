// src/features/settings/components/ChangePasswordModal.jsx

import { useState, useEffect } from "react";
import { Eye, EyeOff, KeyRound, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

import ModalShell from "@/shared/components/ModalShell";
import Badge from "@/shared/components/Badge";
import Field from "@/shared/components/Field";
import TextInput from "@/shared/components/TextInput";

import { getPasswordStrength } from "@/features/settings/helpers/settingsHelpers";
import {
  forgotPasswordRequest,
  resetPasswordRequest,
} from "@/features/auth/api/authApi";

const emptyForm = {
  token: "",
  password: "",
  password_confirmation: "",
};

export default function ChangePasswordModal({
  open,
  onClose,
  email,
  onSuccess,
}) {
  const [form, setForm] = useState(emptyForm);
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealConfirm, setRevealConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [resendMessage, setResendMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setError(null);
      setResendMessage(null);
      setSuccess(false);
    }
  }, [open]);

  function handleChange(key, value) {
    setError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleClose() {
    setForm(emptyForm);
    setError(null);
    setResendMessage(null);
    onClose?.();
  }

  async function handleResend() {
    if (!email || resending) return;
    setResending(true);
    setError(null);
    setResendMessage(null);
    try {
      await forgotPasswordRequest(email);
      setResendMessage("A new verification code has been sent to your email.");
    } catch (err) {
      setError(
        err.response?.data?.message ??
        err.message ??
        "Failed to resend verification code.",
      );
    } finally {
      setResending(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email) return;

    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await resetPasswordRequest({
        email,
        token: form.token.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ??
        err.message ??
        "Failed to change password. Please verify the token and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const strength = getPasswordStrength(form.password);
  const passwordsMatch =
    form.password_confirmation.length === 0 ||
    form.password_confirmation === form.password;
  const isValid =
    form.token.trim().length > 0 &&
    form.password.trim().length >= 6 &&
    form.password_confirmation === form.password;

  return (
    <ModalShell open={open} onClose={handleClose} title="Change Password">
      {success ? (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Password Changed Successfully
          </h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Your password has been updated. You can now use your new password for
            future logins.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slate-500">
            We sent a verification token to{" "}
            <span className="font-medium text-slate-700">{email}</span>. Please
            enter the token and your new password below.
          </p>

          <Field label="Verification Token" required>
            <TextInput
              type="number"
              min={0}
              maxLength={6}
              placeholder="e.g. 543841"
              value={form.token}
              onChange={(e) => handleChange("token", e.target.value)}
              className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </Field>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || submitting}
              className="text-xs text-pink-600 hover:text-pink-700 font-medium inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {resending ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Sending code...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3" />
                  Resend token
                </>
              )}
            </button>
            {resendMessage && (
              <span className="text-xs text-emerald-600 font-medium">
                {resendMessage}
              </span>
            )}
          </div>

          <Field
            label="New Password"
            required
            hint="Use at least 8 characters with letters, numbers, and symbols."
          >
            <div className="relative">
              <TextInput
                type={revealPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setRevealPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={revealPassword ? "Hide new password" : "Show new password"}
              >
                {revealPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {form.password && (
              <div className="mt-2">
                <Badge variant={strength.variant}>{strength.label}</Badge>
              </div>
            )}
          </Field>

          <Field label="Confirm New Password" required>
            <div className="relative">
              <TextInput
                type={revealConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                value={form.password_confirmation}
                onChange={(e) =>
                  handleChange("password_confirmation", e.target.value)
                }
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setRevealConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={revealConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {revealConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {!passwordsMatch && (
              <p className="text-xs text-red-500 mt-1.5">
                Passwords do not match.
              </p>
            )}
          </Field>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}
