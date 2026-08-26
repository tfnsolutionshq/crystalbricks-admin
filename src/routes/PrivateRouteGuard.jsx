import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/shared/context/AuthContext";

const PrivateRouteGuard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="bg-white h-screen"></div>;
  }

  // roles may be strings ["Admin", "Super Admin"] or objects [{ name: "Admin" }] — check case-insensitively
  const roles = user?.roles ?? [];
  const isAuthorized = roles.some((r) => {
    const roleName = (typeof r === "string" ? r : r?.name ?? "")
      .toLowerCase()
      .replace(/[_\s-]+/g, "");
    return roleName === "admin" || roleName === "superadmin";
  });

  if (!user || !isAuthorized) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default PrivateRouteGuard;
