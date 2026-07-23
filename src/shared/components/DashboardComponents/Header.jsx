import crystalBricksLogo from "@/assets/images/crystal_bricks_logo.png";
import { Search, Moon, Bell, ChevronDown, Gem, Menu } from "lucide-react";
import { useAuth } from "@/shared/context/AuthContext";

/**
 * Header
 * Top navigation bar shown across every page of the admin portal.
 * Contains the app brand mark and account/utility actions on the right.
 */
export default function Header({ onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="h-18.25 w-full flex items-center justify-between px-6 border-b border-gray-200 bg-white shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="p-1 -ml-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <img src={crystalBricksLogo} alt="" />
          <span className="text-lg font-semibold">Crystal Bricks</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Search"
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Search size={18} />
        </button>
        <button
          type="button"
          aria-label="Toggle dark mode"
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Moon size={18} />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Bell size={18} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <button
          type="button"
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <img
            src={user.avatar}
            alt="Kelechi's avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-700">
            {user.email}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
