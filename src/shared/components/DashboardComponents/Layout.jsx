import { useState } from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

/**
 * Layout
 * Wraps every portal page with the shared Header (top) and Sidebar (left).
 * Pass `activeNavItem` so the Sidebar can highlight the current page.
 */
export default function AppLayout({ children, activeNavItem }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      <Header onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          activeItem={activeNavItem}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
