// src/features/settings/components/VerificationCodeModal.jsx

import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

import ModalShell from "@/shared/components/ModalShell";

import { maskEmail } from "@/features/settings/helpers/settingsHelpers";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerificationCodeModal({
  open,
  email,
  onClose,
  onSubmit,
}) {
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!open) return;
    setDigits(Array(CODE_LENGTH).fill(""));
    setSecondsLeft(RESEND_SECONDS);
  }, [open]);

  useEffect(() => {
    if (!open || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [open, secondsLeft]);

  function handleDigitChange(index, value) {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event) {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    setDigits(
      pasted
        .split("")
        .concat(Array(CODE_LENGTH).fill(""))
        .slice(0, CODE_LENGTH),
    );
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(digits.join(""));
  }

  const code = digits.join("");
  const isValid = code.length === CODE_LENGTH;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Enter Verification Code"
      maxWidth="max-w-sm"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center text-center mb-5">
          <span className="w-12 h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <p className="text-sm text-slate-500">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-slate-700">
              {maskEmail(email)}
            </span>
            . Enter it below to confirm two-factor authentication.
          </p>
        </div>

        <div
          className="flex items-center justify-center gap-2 mb-5"
          onPaste={handlePaste}
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-12 text-center text-lg font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
            />
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mb-6">
          {secondsLeft > 0 ? (
            `Resend code in 00:${String(secondsLeft).padStart(2, "0")}`
          ) : (
            <button
              type="button"
              onClick={() => setSecondsLeft(RESEND_SECONDS)}
              className="text-pink-600 font-medium hover:underline"
            >
              Resend code
            </button>
          )}
        </p>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="px-5 py-2.5 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Verify
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
