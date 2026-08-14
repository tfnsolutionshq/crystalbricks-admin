import { useEffect } from "react";
import {
  LayoutGrid,
  ListChecks,
  // SlidersHorizontal,
  Users,
  ArrowLeftRight,
  Percent,
  TrendingDown,
  BarChart3,
  UserCog,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/shared/context/AuthContext";
import crystalBricksLogo from "@/assets/images/crystal_bricks_logo.png";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { label: "Products", icon: ListChecks, href: "/products" },
  // { label: "Rate Config", icon: SlidersHorizontal, href: "/rate-config" },
  { label: "Customers", icon: Users, href: "/customers" },
  { label: "Transactions", icon: ArrowLeftRight, href: "/transactions" },
  { label: "Loans", icon: Percent, href: "/loans" },
  { label: "Contributions", icon: TrendingDown, href: "/contributions" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Team Management", icon: UserCog, href: "/team-management" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

/**
 * Sidebar
 * Left-hand navigation shown across every page of the admin portal.
 * `activeItem` lets each page highlight the nav entry that matches it.
 *
 * - Mobile (< lg): slides in as a full-height drawer over the page with a
 *   brand header, close button, and a user card + logout pinned to the bottom.
 * - Desktop (>= lg): a static collapsible rail next to the main content.
 */
export default function Sidebar({ activeItem = "Dashboard", isOpen, onClose }) {
  const { user, logout } = useAuth();
  const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

  useEffect(() => {
    if (isOpen && !isDesktop()) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = () => {
    if (!isDesktop()) onClose();
  };

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name ?? ""}`.trim()
    : "Admin";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile off-canvas drawer / collapsible desktop sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 shrink-0 bg-white flex flex-col overflow-hidden transition-all duration-300 ease-in-out lg:static lg:z-auto ${
          isOpen
            ? "translate-x-0 shadow-2xl lg:shadow-none lg:w-64 lg:border-r lg:border-gray-200"
            : "-translate-x-full lg:w-0"
        }`}
      >
        {/* Drawer brand header — mobile only */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0 lg:hidden">
          <div className="flex items-center gap-2">
            <img
              src={crystalBricksLogo}
              alt="Crystal Bricks"
              className="w-7 h-7 object-contain"
            />
            <span className="text-base font-semibold text-gray-900">
              Crystal Bricks
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1.5 -mr-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 lg:pt-5">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-gray-400 lg:hidden">
            Menu
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
              const isActive = label === activeItem;
              return (
                <li key={label}>
                  <Link
                    to={href}
                    onClick={handleNavClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-pink-50 text-pink-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User card + logout — mobile only */}
        <div className="border-t border-gray-100 px-3 py-4 shrink-0 lg:hidden">
          <div className="flex items-center gap-3 px-3 pb-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center text-sm font-semibold shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {displayName}
              </p>
              {user?.email && (
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut size={18} strokeWidth={2} />
            Log out
          </button>
        </div>

        {/* Logout — desktop only */}
        <div className="px-3 pb-4 shrink-0 hidden lg:block">
          <button
            type="button"
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <LogOut size={18} strokeWidth={2} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
