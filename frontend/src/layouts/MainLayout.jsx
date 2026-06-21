

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

  useEffect(() => {
    if (!userRole) return;

    console.log("Attempting to connect to socket... Role:", userRole);

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

    socket.on("new_notification", (data) => {
      console.log("🔔 New Notification Received:", data);

      if (userRole === "HR" || userRole === "MANAGER") {
        dispatch(addLiveNotification(data));

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
  }, [dispatch, userRole]); 

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

      <AnimatePresence>
        {activeToast && (
          <LiveNotificationToast 
            key={activeToast.id} 
            notification={activeToast} 
            onClose={() => setActiveToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;