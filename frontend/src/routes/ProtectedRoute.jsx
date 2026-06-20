// // // import { Navigate, Outlet } from "react-router-dom";
// // // import { useSelector } from "react-redux";

// // // const ProtectedRoute = ({ children, allowedRoles }) => {
// // //   const { user, isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);

// // //   // ⏳ استنى لما نتأكد من الجلسة (مهم جدا مع الكوكيز)
// // //   if (isCheckingAuth) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-[#0b141a] text-white uppercase tracking-widest animate-pulse">
// // //         Verifying Session...
// // //       </div>
// // //     );
// // //   }

// // //   // ❌ مش لوجين
// // //   if (!isAuthenticated || !user) {
// // //     return <Navigate to="/login" replace />;
// // //   }

// // //   const userRole = user?.general?.role;

// // //   // ❌ مش مصرحله بالدخول
// // //   if (allowedRoles && !allowedRoles.includes(userRole)) {
// // //     const fallbackPath =
// // //       userRole === "HR" ? "/dashboard" : "/my-dashboard";

// // //     return <Navigate to={fallbackPath} replace />;
// // //   }

// // //   // ✅ تمام
// // //   return children ? children : <Outlet />;
// // // };

// // // export default ProtectedRoute;



// // // import { Navigate, Outlet, useLocation } from "react-router-dom";
// // // import { useSelector } from "react-redux";

// // // const ProtectedRoute = ({ children, allowedRoles }) => {
// // //   const { user, isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);
// // //   const location = useLocation(); // ✅ إضافة جديدة فقط

// // //   // ⏳ استنى لما نتأكد من الجلسة (مهم جدا مع الكوكيز)
// // //   if (isCheckingAuth) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-[#0b141a] text-white uppercase tracking-widest animate-pulse">
// // //         Verifying Session...
// // //       </div>
// // //     );
// // //   }

// // //   // ❌ مش لوجين
// // //   if (!isAuthenticated || !user) {
// // //     return <Navigate to="/login" replace />;
// // //   }

// // //   // 🆕 إضافة: لو المستخدم already logged in وحاول يفتح /login يرجعه
// // //   if (isAuthenticated && user && location.pathname === "/login") {
// // //     const userRole = user?.general?.role;

// // //     const fallbackPath =
// // //       userRole === "HR" ? "/dashboard" : "/my-dashboard";

// // //     return <Navigate to={fallbackPath} replace />;
// // //   }

// // //   const userRole = user?.general?.role;

// // //   // ❌ مش مصرحله بالدخول
// // //   if (allowedRoles && !allowedRoles.includes(userRole)) {
// // //     const fallbackPath =
// // //       userRole === "HR" ? "/dashboard" : "/my-dashboard";

// // //     return <Navigate to={fallbackPath} replace />;
// // //   }

// // //   // ✅ تمام
// // //   return children ? children : <Outlet />;
// // // };

// // // export default ProtectedRoute;



// // import { Navigate, Outlet, useLocation } from "react-router-dom";
// // import { useSelector } from "react-redux";

// // const ProtectedRoute = ({ children, allowedRoles }) => {
// //   const { user, isAuthenticated, isCheckingAuth } = useSelector(
// //     (state) => state.auth
// //   );

// //   const location = useLocation();

// //   // ⏳ استنى لما نتأكد من الجلسة (مهم جدا مع الكوكيز)
// //   if (isCheckingAuth) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-[#0b141a] text-white uppercase tracking-widest animate-pulse">
// //         Verifying Session...
// //       </div>
// //     );
// //   }

// //   // 🆕 مهم جدًا: لو رايح /login وهو authenticated امنعه
// //   if (
// //     isAuthenticated &&
// //     user &&
// //     location.pathname === "/login"
// //   ) {
// //     const userRole = user?.general?.role;

// //     const fallbackPath =
// //       userRole === "HR" ? "/dashboard" : "/my-dashboard";

// //     return <Navigate to={fallbackPath} replace />;
// //   }

// //   // ❌ مش لوجين
// //   if (!isAuthenticated || !user) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   const userRole = user?.general?.role;

// //   // ❌ مش مصرحله بالدخول
// //   if (allowedRoles && !allowedRoles.includes(userRole)) {
// //     const fallbackPath =
// //       userRole === "HR" ? "/dashboard" : "/my-dashboard";

// //     return <Navigate to={fallbackPath} replace />;
// //   }

// //   // ✅ تمام
// //   return children ? children : <Outlet />;
// // };

// // export default ProtectedRoute;




// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);
//   const location = useLocation();

//   if (isCheckingAuth) {
//     return <div>Verifying Session...</div>;
//   }

//   const userRole = user?.general?.role;

//   // دالة مساعدة لمعرفة لو المستخدم الحالي إتش آر أو مدير
//   const isHrOrManager = userRole === "HR" || userRole === "MANAGER";

//   // لو رايح /login وهو مسجل دخول بالفعل
//   if (isAuthenticated && user && location.pathname === "/login") {
//     const fallbackPath = isHrOrManager ? "/dashboard" : "/my-dashboard";
//     return <Navigate to={fallbackPath} replace />;
//   }

//   // لو مش مسجل دخول
//   if (!isAuthenticated || !user) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   // لو الصلاحية بتاعته مش في قائمة الصلاحيات المسموحة
//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     const fallbackPath = isHrOrManager ? "/dashboard" : "/my-dashboard";
//     return <Navigate to={fallbackPath} replace />;
//   }

//   return children ? children : <Outlet />;
// };

// export default ProtectedRoute;



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