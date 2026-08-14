import { Menu } from "lucide-react";

/**
 * Header
 * Top navigation bar shown across every page of the admin portal.
 * Contains only the sidebar toggle.
 */
export default function Header({ onToggleSidebar }) {
  return (
    <header className="h-18.25 w-full flex items-center justify-between px-6 border-b border-gray-200 bg-white shrink-0">
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="p-1 -ml-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}
