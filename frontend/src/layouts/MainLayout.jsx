

// // import { Outlet } from "react-router-dom";
// // import { useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";

// // import Sidebar from "../components/SideBar/SideBar";
// // import Navbar from "../components/navbar/Navbar";
// // import AIChat from "../components/AIChatBot/AIChat";
// // import { setSidebarCollapsed } from "../store/HrSlices/navbar/sideMenuSlice";

// // const MainLayout = () => {
// //   const dispatch = useDispatch();
// //   const { isSidebarCollapsed } = useSelector((state) => state.ui);

// //   useEffect(() => {
// //     const handleResize = () => {
// //       dispatch(setSidebarCollapsed(window.innerWidth < 1024));
// //     };

// //     handleResize();
// //     window.addEventListener("resize", handleResize);

// //     return () => window.removeEventListener("resize", handleResize);
// //   }, [dispatch]);

// //   return (
// //    <div className="flex min-h-screen bg-[#0b141a] overflow-hidden">
// //   <Sidebar />

// //   <div className="flex-1 flex flex-col min-w-0 ml-80px lg:ml-175px
// //    transition-all duration-300">
// //     <Navbar />

// //     <main className="flex-1 p-4 md:p-6 pt-24 mt-10 overflow-y-auto scrollbar-hide ">
// //       <Outlet />
// //     </main>
// //   </div>
// // {/* </div> */}

// //       {/* AI Chat */}
// //       <AIChat />
// //     </div>
// //   );
// // };

// // export default MainLayout;



// import { Outlet } from "react-router-dom";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import Sidebar from "../components/SideBar/SideBar";
// import Navbar from "../components/navbar/Navbar";
// import AIChat from "../components/AIChatBot/AIChat";
// import { setSidebarCollapsed } from "../store/HrSlices/navbar/sideMenuSlice";

// const MainLayout = () => {
//   const dispatch = useDispatch();
//   const { isSidebarCollapsed } = useSelector((state) => state.ui);

//   useEffect(() => {
//     const handleResize = () => {
//       dispatch(setSidebarCollapsed(window.innerWidth < 1024));
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, [dispatch]);

//   return (
//     <div className="flex min-h-screen bg-[#0b141a] overflow-hidden">
//       {/* Sidebar fixed */}
//       <Sidebar />

//       {/* Content wrapper */}
//       <div
//         className={`flex-1 flex flex-col min-w-0 transition-all duration-300
//         ${isSidebarCollapsed ? "ml-[80px]" : "ml-[175px]"}`}
//       >
//         <Navbar />

//         <main className="flex-1 p-4 md:p-6 pt-24 md:mt-10  overflow-y-auto scrollbar-hide">
//           <Outlet />
//         </main>
//       </div>

//       <AIChat />
//     </div>
//   );
// };

// export default MainLayout;



import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../components/SideBar/SideBar";
import Navbar from "../components/navbar/Navbar";
import AIChat from "../components/AIChatBot/AIChat";
import { setSidebarCollapsed } from "../store/HrSlices/navbar/sideMenuSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { isSidebarCollapsed } = useSelector((state) => state.ui);
  
  // حالة لمعرفة إذا كانت الشاشة أصغر من 360 بكسل
  const [isTinyScreen, setIsTinyScreen] = useState(window.innerWidth < 360);

  useEffect(() => {
    const handleResize = () => {
      dispatch(setSidebarCollapsed(window.innerWidth < 1024));
      setIsTinyScreen(window.innerWidth < 360);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    // لو الشاشة أصغر من 360 هتبقى flex-col (تحت بعض) ومفيش ارتفاع ثابت عشان الصفحة تسكرول طبيعي
    <div className={`flex ${isTinyScreen ? "flex-col min-h-screen" : "min-h-screen"}`}>
      
      {/* القائمة الجانبية - هنمرر لها بروبس يعرفها إن الشاشة صغيرة لو محتاجة تعديل داخلي */}
      <Sidebar isTinyScreen={isTinyScreen} /> 

      {/* Content wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300
        ${isTinyScreen ? "ml-0" : isSidebarCollapsed ? "ml-[80px]" : "ml-[175px]"}`}
      >
        {/* في الشاشات الصغيرة جداً الـ Navbar هينزل تحت الـ Sidebar بشكل طبيعي */}
        <Navbar />

        {/* لو الشاشة صغيرة بنلغي الـ overflow-y-auto والـ pt العالية عشان المحتوى يظهر طبيعي ويسكرول مع الصفحة */}
        <main className={`flex-1 p-4 md:p-6 ${isTinyScreen ? "pt-4" : "pt-24 md:mt-10 overflow-y-auto scrollbar-hide"}`}>
          <Outlet />
        </main>
      </div>

      <AIChat />
    </div>
  );
};

export default MainLayout;