import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { fetchMyHRProfile } from '../../store/HrSlices/navbar/hrProfileSlice';

import GeneralTab from '../../HrComponents/SettingsComponents/GeneralTab';
import AccountTab from '../../HrComponents/SettingsComponents/AccountTab';
import HelpTab from '../../HrComponents/SettingsComponents/HelpTab';
import LegalTab from '../../HrComponents/SettingsComponents/LegalTab';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(location.state?.tab || 'general');

  useEffect(() => {
    dispatch(fetchMyHRProfile());
  }, [dispatch]);

  const menuItems = [
    { id: 'general', title: 'General', desc: 'Theme, notifications', icon: 'fas fa-cog' },
    { id: 'account', title: 'Account', desc: 'Profile, security', icon: 'fas fa-user-shield' },
    { id: 'access', title: 'Access', desc: 'Permissions, roles', icon: 'fas fa-key' },
    { id: 'help', title: 'Help', desc: 'FAQs, support', icon: 'far fa-question-circle' },
    { id: 'legal', title: 'Legal', desc: 'Privacy, app info', icon: 'fas fa-info-circle' },
  ];

  return (
    // الحاوية الكبيرة: تأخذ كامل الطول المتاح وتمنع السكرول الخارجي
    <div className="max-w-[1450px] mx-auto p-4 md:p-8 text-white h-[calc(100vh-100px)] flex flex-col overflow-hidden">
      
      {/* 1. الهيدر (Back Button + Title) */}
      <div className="flex items-center gap-4 mb-6 md:mb-10 shrink-0">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-[#142129] rounded-xl flex items-center justify-center text-gray-400 hover:text-white border border-gray-800 transition-all">
          <i className="fas fa-arrow-left text-sm"></i>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      {/* 2. منطقة العمل الرئيسية (تتحول من عمود لصف بناءً على عرض 900px) */}
      <div className="flex flex-col min-[900px]:flex-row flex-1 gap-6 md:gap-8 overflow-hidden">
        
        {/* --- القائمة اليسرى (Sidebar) --- */}
        {/* في الشاشات الصغيرة: تظهر فوق المحتوى وتسمح بالسكرول العرضي */}
        {/* في الشاشات الكبيرة: تثبت على اليسار بعرض 380px */}
        <aside className="w-full min-[900px]:w-[350px] shrink-0 flex flex-row min-[900px]:flex-col gap-3 overflow-x-auto min-[900px]:overflow-y-visible scrollbar-hide pb-2 min-[900px]:pb-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 p-4 min-w-[160px] min-[900px]:min-w-0 min-[900px]:w-full rounded-2xl md:rounded-[1.8rem] transition-all text-left border ${
                activeTab === item.id 
                ? 'bg-[#142129] border-gray-700 shadow-xl' 
                : 'bg-transparent border-transparent hover:bg-white/[0.02]'
              }`}
            >
              <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center text-base md:text-lg ${
                activeTab === item.id ? 'bg-[#1e293b] text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-[#142129] text-gray-500'
              }`}>
                <i className={item.icon}></i>
              </div>
              <div className="min-w-0">
                <h4 className={`text-xs md:text-sm font-bold truncate ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`}>{item.title}</h4>
                <p className="text-[9px] md:text-[10px] text-gray-600 font-medium truncate hidden md:block">{item.desc}</p>
              </div>
            </button>
          ))}
        </aside>

        {/* --- منطقة المحتوى اليمنى (Main Content) --- */}
        {/* هي المنطقة الوحيدة المسموح لها بالسكرول العمودي */}
        <main className="flex-1 bg-[#142129] rounded-3xl md:rounded-[2.5rem] border border-gray-800/40 shadow-2xl overflow-hidden flex flex-col relative">
          <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'general' && <GeneralTab />}
                {activeTab === 'account' && <AccountTab />}
                {activeTab === 'help' && <HelpTab />}
                {activeTab === 'legal' && <LegalTab />}
                {activeTab === 'access' && (
                   <div className="py-20 text-center opacity-30 italic">
                      <i className="fas fa-lock text-4xl mb-4"></i>
                      <p>Access settings coming soon...</p>
                   </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

      </div>
    </div>
  );
};

export default Settings;