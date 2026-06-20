

// // // import { Outlet } from "react-router-dom";
// // // import { useEffect } from "react";
// // // import { useDispatch, useSelector } from "react-redux";

// // // import Sidebar from "../components/SideBar/SideBar";
// // // import Navbar from "../components/navbar/Navbar";
// // // import AIChat from "../components/AIChatBot/AIChat";
// // // import { setSidebarCollapsed } from "../store/HrSlices/navbar/sideMenuSlice";

// // // const MainLayout = () => {
// // //   const dispatch = useDispatch();
// // //   const { isSidebarCollapsed } = useSelector((state) => state.ui);

// // //   useEffect(() => {
// // //     const handleResize = () => {
// // //       dispatch(setSidebarCollapsed(window.innerWidth < 1024));
// // //     };

// // //     handleResize();
// // //     window.addEventListener("resize", handleResize);

// // //     return () => window.removeEventListener("resize", handleResize);
// // //   }, [dispatch]);

// // //   return (
// // //    <div className="flex min-h-screen bg-[#0b141a] overflow-hidden">
// // //   <Sidebar />

// // //   <div className="flex-1 flex flex-col min-w-0 ml-80px lg:ml-175px
// // //    transition-all duration-300">
// // //     <Navbar />

// // //     <main className="flex-1 p-4 md:p-6 pt-24 mt-10 overflow-y-auto scrollbar-hide ">
// // //       <Outlet />
// // //     </main>
// // //   </div>
// // // {/* </div> */}

// // //       {/* AI Chat */}
// // //       <AIChat />
// // //     </div>
// // //   );
// // // };

// // // export default MainLayout;



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
// //     <div className="flex min-h-screen bg-[#0b141a] overflow-hidden">
// //       {/* Sidebar fixed */}
// //       <Sidebar />

// //       {/* Content wrapper */}
// //       <div
// //         className={`flex-1 flex flex-col min-w-0 transition-all duration-300
// //         ${isSidebarCollapsed ? "ml-[80px]" : "ml-[175px]"}`}
// //       >
// //         <Navbar />

// //         <main className="flex-1 p-4 md:p-6 pt-24 md:mt-10  overflow-y-auto scrollbar-hide">
// //           <Outlet />
// //         </main>
// //       </div>

// //       <AIChat />
// //     </div>
// //   );
// // };

// // export default MainLayout;



// import { Outlet } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import Sidebar from "../components/SideBar/SideBar";
// import Navbar from "../components/navbar/Navbar";
// import AIChat from "../components/AIChatBot/AIChat";
// import { setSidebarCollapsed } from "../store/HrSlices/navbar/sideMenuSlice";

// const MainLayout = () => {
//   const dispatch = useDispatch();
//   const { isSidebarCollapsed } = useSelector((state) => state.ui);
  
//   // حالة لمعرفة إذا كانت الشاشة أصغر من 360 بكسل
//   const [isTinyScreen, setIsTinyScreen] = useState(window.innerWidth < 360);

//   useEffect(() => {
//     const handleResize = () => {
//       dispatch(setSidebarCollapsed(window.innerWidth < 1024));
//       setIsTinyScreen(window.innerWidth < 360);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, [dispatch]);

//   return (
//     <div className={`flex ${isTinyScreen ? "flex-col min-h-screen" : "min-h-screen"}`}>
      
//       <Sidebar isTinyScreen={isTinyScreen} /> 

//       {/* Content wrapper */}
//       <div
//         className={`flex-1 flex flex-col min-w-0 transition-all duration-300
//         ${isTinyScreen ? "ml-0" : isSidebarCollapsed ? "ml-[80px]" : "ml-[175px]"}`}
//       >
//         <Navbar />

//         <main className={`flex-1 p-4 md:p-6 ${isTinyScreen ? "pt-4" : "pt-24 md:mt-10 overflow-y-auto scrollbar-hide"}`}>
//           <Outlet />
//         </main>
//       </div>

//       <AIChat />
//     </div>
//   );
// };

// export default MainLayout;



import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { AnimatePresence } from "framer-motion";

import { addLiveNotification } from "../store/HrSlices/navbar/notificationSlice";
import { setSidebarCollapsed } from "../store/HrSlices/navbar/sideMenuSlice";

import Sidebar from "../components/SideBar/SideBar";
import Navbar from "../components/navbar/Navbar";
import AIChat from "../components/AIChatBot/AIChat";
import LiveNotificationToast from "../components/NavbarComponents/LiveNotificationToast";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isSidebarCollapsed } = useSelector((state) => state.ui);
  
  const userRole = user?.general?.role;
  const [activeToast, setActiveToast] = useState(null);
  const [isTinyScreen, setIsTinyScreen] = useState(window.innerWidth < 360);

  useEffect(() => {
    const handleResize = () => {
      dispatch(setSidebarCollapsed(window.innerWidth < 1024));
      setIsTinyScreen(window.innerWidth < 360);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // --- منطق السوكيت المحدث ---
  useEffect(() => {
    // 1. لا تحاول الاتصال إلا إذا كان الـ userRole موجوداً
    if (!userRole) return;

    console.log("Attempting to connect to socket... Role:", userRole);

    // 2. الرابط الأساسي للسيرفر (Railway غالباً لا يحتاج مسار إضافي)
    const socket = io("https://grad-project-hrms-production-7.up.railway.app", {
      transports: ["websocket", "polling"],
      withCredentials: true
    });

    socket.on("connect", () => {
      console.log("✅ Socket Connected Successfully! ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket Connection Error:", err.message);
    });

    // 3. استلام الإشعار
    socket.on("new_notification", (data) => {
      console.log("🔔 New Notification Received:", data);

      if (userRole === "HR" || userRole === "MANAGER") {
        // تحديث الريدكس
        dispatch(addLiveNotification(data));

        // إظهار التوست
        setActiveToast({
          id: data._id || Date.now(),
          title: data.title || "New Update",
          message: data.message || "You have a new notification",
          employeeName: data.sender?.general?.firstName 
            ? `${data.sender.general.firstName} ${data.sender.general.lastName}`
            : "System",
          avatar: data.sender?.general?.avatar,
          type: data.type?.toLowerCase(),
          targetId: data.relatedId
        });
      }
    });

    return () => {
      console.log("Cleaning up socket...");
      socket.disconnect();
    };
  }, [dispatch, userRole]); // يعيد الاتصال لو الرول اتغيرت أو اليوزر حمل

  return (
    <div style={{ backgroundColor: 'var(--bg-deep)' }} className={`flex ${isTinyScreen ? "flex-col" : "flex-row"} min-h-screen overflow-x-hidden`}>
      <Sidebar isTinyScreen={isTinyScreen} /> 

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isTinyScreen ? "ml-0 w-full" : isSidebarCollapsed ? "ml-[80px]" : "ml-[175px]"}`}>
        <Navbar isTinyScreen={isTinyScreen} />
        <main className={`flex-1 p-4 md:p-6 ${isTinyScreen ? "pt-4" : "pt-24 md:mt-10 overflow-y-auto scrollbar-hide"}`}>
          <Outlet />
        </main>
      </div>

      <AIChat />

      {/* الـ Toast يوضع خارج الـ main لضمان ظهوره فوق كل شيء */}
      <AnimatePresence>
        {activeToast && (
          <LiveNotificationToast 
            key={activeToast.id} // مهم جداً للـ AnimatePresence
            notification={activeToast} 
            onClose={() => setActiveToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;