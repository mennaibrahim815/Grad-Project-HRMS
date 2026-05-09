import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar/SideBar"; // الموحد
import Navbar from "../components/navbar/Navbar";

const EmployeeLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#0b141a]">
      {/* السايد بار سيعرض منيو الموظف تلقائياً */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Navbar />

        {/* p-4 md:p-8 ليكون المحتوى واسع ومريح للموظف */}
        <main className="flex-1 p-4 md:p-8 pt-24 overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;