import { ArrowLeft, Mail } from "lucide-react";
import skyscraperImage from "@/assets/images/skyscrapers.jpg";
import crystalBricksLogo from "@/assets/images/crystal_bricks_logo.png";
import { Link } from "react-router-dom";

const ResetPasscodePage = () => {
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
        {/* Mobile branding - visible only when left panel is hidden */}
        <div className="flex md:hidden items-center gap-2 px-4 sm:px-6 pt-6 pb-4">
          <img src={crystalBricksLogo} alt="" className="h-7 w-7" />
          <span className="text-base font-semibold text-slate-900">
            Crystal Bricks
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 sm:px-6 pb-12 sm:pb-16">
          <form className="w-full max-w-sm">
            <Link
              to={-1}
              type="button"
              className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-700"
            >
              <ArrowLeft size={16} />
              Back
            </Link>

            <h2 className="mb-1 text-2xl font-bold text-slate-900">
              Reset Passcode
            </h2>
            <p className="mb-8 text-sm text-slate-500">
              Enter your email address and we&apos;ll send you instructions to
              reset your passcode
            </p>

            {/* EMAIL */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#c21c86] focus:outline-none focus:ring-1 focus:ring-[#c21c86]"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#c21c86] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a8176f] focus:outline-none focus:ring-2 focus:ring-[#c21c86] focus:ring-offset-2"
            >
              Send Reset Instructions
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasscodePage;
