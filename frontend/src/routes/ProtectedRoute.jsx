import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);

  // ⏳ استنى لما نتأكد من الجلسة (مهم جدا مع الكوكيز)
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b141a] text-white uppercase tracking-widest animate-pulse">
        Verifying Session...
      </div>
    );
  }

  // ❌ مش لوجين
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.general?.role;

  // ❌ مش مصرحله بالدخول
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const fallbackPath =
      userRole === "HR" ? "/dashboard" : "/my-dashboard";

    return <Navigate to={fallbackPath} replace />;
  }

  // ✅ تمام
  return children ? children : <Outlet />;
};

export default ProtectedRoute;