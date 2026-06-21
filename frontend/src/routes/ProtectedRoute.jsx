

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b141a] text-white uppercase tracking-widest animate-pulse">
        Verifying Session...
      </div>
    );
  }

  if (isAuthenticated && user && location.pathname === "/login") {
    const isAdmin = user?.general?.role === "HR" || user?.general?.role === "MANAGER";
    return <Navigate to={isAdmin ? "/dashboard" : "/my-dashboard"} replace />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.general?.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const isAdmin = userRole === "HR" || userRole === "MANAGER";
    const fallbackPath = isAdmin ? "/dashboard" : "/my-dashboard";

    return <Navigate to={fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;