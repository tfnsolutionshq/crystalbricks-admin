import { useEffect } from "react";
import {
  LayoutGrid,
  ListChecks,
  SlidersHorizontal,
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

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { label: "Products", icon: ListChecks, href: "/products" },
  { label: "Rate Config", icon: SlidersHorizontal, href: "/rate-config" },
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
 */
export default function Sidebar({ activeItem = "Dashboard", isOpen, onClose }) {
  const { logout } = useAuth();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile off-canvas sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-300 lg:static lg:z-auto lg:flex lg:translate-x-0 pb-4 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button — mobile only */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        <nav className="px-3 pt-5">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
              const isActive = label === activeItem;
              return (
                <li key={label}>
                  <Link
                    to={href}
                    onClick={onClose}
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

        <div className="px-3">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => logout()}
          >
            <LogOut size={18} strokeWidth={2} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
