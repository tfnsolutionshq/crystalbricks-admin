import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/shared/context/AuthContext";

const PrivateRouteGuard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="bg-white h-screen"></div>;
  }

  if (!user || !user?.roles?.includes("admin")) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default PrivateRouteGuard;
