import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import skyscraperImage from "@/assets/images/skyscrapers.jpg";
import crystalBricksLogo from "@/assets/images/crystal_bricks_logo.png";
import { useAuth } from "@/shared/context/AuthContext";

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({
        email,
        password: passcode,
      });

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ??
          error.message ??
          error ??
          "An error occurred during login. Please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT PANEL */}
      <div className="relative hidden md:flex md:w-[57%] flex-col justify-between overflow-hidden bg-linear-to-br from-[#3a0a2e] via-[#7a1361] to-[#c21c86] p-10 text-white">
        {/* Background building photo */}
        <img
          src={skyscraperImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-overlay"
        />
        {/* Extra gradient wash so photo stays subtle & on-brand */}
        <div className="absolute inset-0 bg-linear-to-br from-[#3a0a2e]/90 via-[#7a1361]/70 to-[#c21c86]/60" />

        {/* HEADER */}
        <div className="relative z-10 flex items-center justify-between">
          {/* CRYSTAL BRICKS LOGO */}
          <div className="flex items-center gap-2">
            <img src={crystalBricksLogo} alt="" />
            <span className="text-lg font-semibold">Crystal Bricks</span>
          </div>
        </div>

        {/* CAPTION TEXT AND SUB-TEXT */}
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
          <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <h2 className="mb-1 text-2xl font-bold text-slate-900">
              Admin Portal
            </h2>
            <p className="mb-8 text-sm text-slate-500">
              Welcome! Please enter your details to log in
            </p>

            <div>
              {error && (
                <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* EMAIL */}
            <div className="mb-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#c21c86] focus:outline-none focus:ring-1 focus:ring-[#c21c86]"
                />
              </div>
            </div>

            {/* PASSCODE */}
            <div className="mb-4">
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
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
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

            {/* REMEMBER ME / FORGOT PASSCODE */}
            <div className="mb-6 flex items-center justify-between gap-2 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#c21c86] focus:ring-[#c21c86]"
                />
                Remember me
              </label>

              <Link
                to="/reset-passcode"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Forgot passcode?
              </Link>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#c21c86] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a8176f] focus:outline-none focus:ring-2 focus:ring-[#c21c86] focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <>Logging in...</>
                </span>
              ) : (
                "Log in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
