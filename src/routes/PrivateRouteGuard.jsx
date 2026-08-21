import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/shared/context/AuthContext";

const PrivateRouteGuard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="bg-white h-screen"></div>;
  }

  // roles may be strings ["Admin"] or objects [{ name: "Admin" }] — check case-insensitively
  const roles = user?.roles ?? [];
  const isAdmin = roles.some(
    (r) => (typeof r === "string" ? r : r?.name ?? "").toLowerCase() === "admin",
  );

  if (!user || !isAdmin) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default PrivateRouteGuard;
