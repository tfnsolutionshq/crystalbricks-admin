import crystalBricksLogo from "@/assets/images/crystal_bricks_logo.png";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/shared/context/AuthContext";

/**
 * Header
 * Top navigation bar shown across every page of the admin portal.
 * Contains the app brand mark and account/utility actions on the right.
 */
export default function Header({ onToggleSidebar }) {
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-18.25 w-full flex items-center justify-between px-6 border-b border-gray-200 bg-white shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="p-1 -ml-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Menu size={22} />
        </button>
        <div className="items-center gap-2 hidden sm:flex">
          <img src={crystalBricksLogo} alt="" />
          <span className="text-lg font-semibold">Crystal Bricks</span>
        </div>
      </div>

      {/* Account */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setProfileOpen((prev) => !prev)}
          className="hidden sm:flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <img
            src={user.avatar}
            alt="Admin avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="hidden sm:inline text-sm font-medium text-gray-700">
            {user.email}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>

        {profileOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setProfileOpen(false)}
            />
            <div className="absolute right-0 mt-2 z-50 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-3 px-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.first_name
                    ? `${user.first_name} ${user.last_name ?? ""}`.trim()
                    : "Admin"}
                </p>
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Close profile menu"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 break-all">{user.email}</p>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
