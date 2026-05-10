

import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/SideBar/SideBar"; // السايد بار الديناميكي
import Navbar from "../components/navbar/Navbar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#0b141a]">
      {/* السايد بار ثابت في مكانه */}
      <Sidebar />

      {/* منطقة المحتوى */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Navbar />

        {/* pt-24 لضمان عدم اختفاء المحتوى خلف الناف بار الثابت */}
        <main className="flex-1 p-4 md:p-6 pt-24 mt-10 overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;