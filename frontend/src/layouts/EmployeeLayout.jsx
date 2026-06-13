// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/SideBar/SideBar"; // الموحد
// import Navbar from "../components/navbar/Navbar";

// const EmployeeLayout = () => {
//   return (
//     <div className="flex min-h-screen bg-[#0b141a]">
//       {/* السايد بار سيعرض منيو الموظف تلقائياً */}
//       <Sidebar />

//       <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
//         <Navbar />

//         {/* p-4 md:p-8 ليكون المحتوى واسع ومريح للموظف */}
//         <main className="flex-1 p-4  md:p-8 pt-24 overflow-y-auto scrollbar-hide">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default EmployeeLayout;

import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../components/SideBar/SideBar";
import Navbar from "../components/navbar/Navbar";
import { setSidebarCollapsed } from "../store/HrSlices/navbar/sideMenuSlice";

const EmployeeLayout = () => {
  const dispatch = useDispatch();
  const { isSidebarCollapsed } = useSelector((state) => state.ui);

  useEffect(() => {
    const handleResize = () => {
      dispatch(setSidebarCollapsed(window.innerWidth < 1024));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-[#0b141a] overflow-hidden">
      {/* Sidebar fixed */}
      <Sidebar />

      {/* Content wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300
        ${isSidebarCollapsed ? "ml-[80px]" : "ml-[175px]"}`}
      >
        <Navbar />

        <main className="flex-1 p-4 md:p-8 pt-24 md:mt-10 overflow-y-auto scrollbar-hide">

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;