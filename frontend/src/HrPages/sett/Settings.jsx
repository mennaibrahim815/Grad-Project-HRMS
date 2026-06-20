
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { fetchMyHRProfile } from "../../store/HrSlices/navbar/hrProfileSlice";

import GeneralTab from "../../HrComponents/SettingsComponents/GeneralTab";
import ProfileTab  from "../../HrComponents/SettingsComponents/ProfileTab";
import HelpTab from "../../HrComponents/SettingsComponents/HelpTab";
import LegalTab from "../../HrComponents/SettingsComponents/LegalTab";
import AccessTab from "../../HrComponents/SettingsComponents/AccessTab";
import { fetchSettings } from "../../store/HrSlices/navbar/settingsSlice";

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(location.state?.tab || "general");

  useEffect(() => {
    dispatch(fetchMyHRProfile());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const menuItems = [
    {
      id: "general",
      title: "General",
      desc: "Theme, notifications",
      icon: "fas fa-cog",
    },
    {
      id: "profile",
      title: "My Profile",
      desc: "Personal & Job Info",
      icon: "fas fa-user",
    },
    {
      id: "access",
      title: "Access",
      desc: "Permissions, roles",
      icon: "fas fa-key",
    },
    {
      id: "help",
      title: "Help",
      desc: "FAQs, support",
      icon: "far fa-question-circle",
    },
    {
      id: "legal",
      title: "Legal",
      desc: "Privacy, app info",
      icon: "fas fa-info-circle",
    },
  ];

  return (
    <div 
      style={{ backgroundColor: 'var(--bg-deep)', color: 'var(--text-main)' }}
      className="max-w-[1450px] mx-auto p-4 md:p-8 h-[calc(100vh)] flex flex-col overflow-hidden transition-colors duration-300"
    >
      {/* 1. الهيدر (Back Button + Title) */}
      <div className="flex items-center gap-4 mb-6 md:mb-10 shrink-0">
        <button
          onClick={() => navigate(-1)}
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white border transition-all"
        >
          <i style={{ color: 'var(--text-muted)' }} className="fas fa-arrow-left text-sm"></i>
        </button>
        <h1 style={{ color: 'var(--text-main)' }} className="text-2xl md:text-3xl font-bold tracking-tight">
          Settings
        </h1>
      </div>

      {/* 2. منطقة العمل الرئيسية */}
      <div className="flex flex-col min-[900px]:flex-row flex-1 gap-6 md:gap-8 overflow-hidden">
        
        {/* --- القائمة اليسرى (Sidebar) --- */}
        <aside className="w-full min-[900px]:w-[350px] shrink-0 flex flex-row min-[900px]:flex-col gap-3 overflow-x-auto min-[900px]:overflow-y-visible scrollbar-hide pb-2 min-[900px]:pb-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{ 
                backgroundColor: activeTab === item.id ? 'var(--bg-card)' : 'transparent',
                borderColor: activeTab === item.id ? 'var(--border-main)' : 'transparent'
              }}
              className={`flex items-center gap-4 p-4 min-w-[160px] min-[900px]:min-w-0 min-[900px]:w-full rounded-2xl md:rounded-[1.8rem] transition-all text-left border hover:bg-[var(--hover-bg)]`}
            >
              <div
                style={{ 
                  backgroundColor: activeTab === item.id ? 'var(--bg-deep)' : 'var(--bg-card)',
                  boxShadow: activeTab === item.id ? '0 0 15px rgba(59,130,246,0.1)' : 'none'
                }}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center text-base md:text-lg ${
                  activeTab === item.id ? "text-blue-500" : "text-gray-500"
                }`}
              >
                <i className={item.icon}></i>
              </div>
              <div className="min-w-0">
                <h4
                  style={{ color: activeTab === item.id ? 'var(--text-main)' : 'var(--text-muted)' }}
                  className="text-xs md:text-sm font-bold truncate"
                >
                  {item.title}
                </h4>
                <p style={{ color: 'var(--text-muted)', opacity: 0.6 }} className="text-[9px] md:text-[10px] font-medium truncate hidden md:block">
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </aside>

        {/* --- منطقة المحتوى اليمنى (Main Content) --- */}
        <main 
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
          className="flex-1 h-[100%] rounded-3xl md:rounded-[2.5rem] border shadow-2xl overflow-hidden flex flex-col relative"
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "general" && <GeneralTab />}
                {activeTab === "profile" && <ProfileTab />}
                {activeTab === "help" && <HelpTab />}
                {activeTab === "legal" && <LegalTab />}
                {activeTab === "access" && <AccessTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;