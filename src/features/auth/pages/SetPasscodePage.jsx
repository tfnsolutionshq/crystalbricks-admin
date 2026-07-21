import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import skyscraperImage from "@/assets/images/skyscrapers.jpg";
import crystalBricksLogo from "@/assets/images/crystal_bricks_logo.png";

const SetPasscodePage = () => {
  const [showPasscode, setShowPasscode] = useState(false);
  const [showConfirmPasscode, setShowConfirmPasscode] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT PANEL */}
      <div className="relative hidden md:flex md:w-[57%] flex-col justify-between overflow-hidden bg-linear-to-br from-[#3a0a2e] via-[#7a1361] to-[#c21c86] p-10 text-white">
        <img
          src={skyscraperImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#3a0a2e]/90 via-[#7a1361]/70 to-[#c21c86]/60" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={crystalBricksLogo} alt="" />
            <span className="text-lg font-semibold">Crystal Bricks</span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="mb-3 text-3xl font-bold leading-tight md:text-4xl">
            Banking made easy for all
          </h1>
          <p className="max-w-md text-white/80">
            Secure, fast, and reliable banking solutions designed for your
            financial success
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full flex-1 flex-col bg-slate-50 md:w-[43%]">
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <form className="w-full max-w-sm">
            <h2 className="mb-1 text-2xl font-bold text-slate-900">
              Set Passcode
            </h2>
            <p className="mb-8 text-sm text-slate-500">
              Choose a secure passcode to protect your account
            </p>

            {/* PASSCODE */}
            <div className="mb-5">
              <label
                htmlFor="passcode"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Passcode
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPasscode ? "text" : "password"}
                  name="passcode"
                  id="passcode"
                  placeholder="Enter passcode"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#c21c86] focus:outline-none focus:ring-1 focus:ring-[#c21c86]"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode((prev) => !prev)}
                  aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSCODE */}
            <div className="mb-6">
              <label
                htmlFor="confirmPasscode"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Confirm Passcode
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showConfirmPasscode ? "text" : "password"}
                  name="confirmPasscode"
                  id="confirmPasscode"
                  placeholder="Confirm passcode"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#c21c86] focus:outline-none focus:ring-1 focus:ring-[#c21c86]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPasscode((prev) => !prev)}
                  aria-label={
                    showConfirmPasscode ? "Hide passcode" : "Show passcode"
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPasscode ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#c21c86] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a8176f] focus:outline-none focus:ring-2 focus:ring-[#c21c86] focus:ring-offset-2"
            >
              Set Passcode
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPasscodePage;
