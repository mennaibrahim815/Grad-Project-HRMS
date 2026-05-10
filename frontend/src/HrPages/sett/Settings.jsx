import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// استيراد التابات (سنقوم بتكويدهم بالأسفل)
import GeneralTab from '../../HrComponents/SettingsComponents/GeneralTab';
import AccountTab from '../../HrComponents/SettingsComponents/AccountTab';
import HelpTab from '../../HrComponents/SettingsComponents/HelpTab';
import LegalTab from '../../HrComponents/SettingsComponents/LegalTab';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // تحديد التاب النشطة بناءً على الحالة القادمة من الـ Navigation (مثل الضغط على Profile)
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'general');

  const menuItems = [
    { id: 'general', title: 'General', desc: 'Language, theme, preferences', icon: 'fas fa-cog' },
    { id: 'account', title: 'Account & security', desc: 'Profile, password, privacy', icon: 'fas fa-user-shield' },
    { id: 'access', title: 'Access', desc: 'Permission, roles, integration', icon: 'fas fa-key' },
    { id: 'help', title: 'Help & support', desc: 'FAQs, contact support', icon: 'far fa-question-circle' },
    { id: 'legal', title: 'Legal & app information', desc: 'Help center', icon: 'fas fa-info-circle' },
  ];

  return (
    <div className="max-w-[1450px] mx-auto p-4 md:p-8 text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-[#142129] rounded-xl flex items-center justify-center text-gray-400 hover:text-white border border-gray-800 transition-all">
          <i className="fas fa-arrow-left text-sm"></i>
        </button>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* سـايد بار الإعدادات */}
        <aside className="col-span-12 lg:col-span-4 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-5 p-5 rounded-[1.8rem] transition-all text-left border ${
                activeTab === item.id ? 'bg-[#142129] border-gray-700 shadow-xl' : 'bg-transparent border-transparent hover:bg-white/[0.02]'
              }`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg ${activeTab === item.id ? 'bg-[#1e293b] text-blue-400' : 'bg-[#142129] text-gray-500'}`}>
                <i className={item.icon}></i>
              </div>
              <div className="hidden sm:block">
                <h4 className={`text-sm font-bold ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`}>{item.title}</h4>
                <p className="text-[10px] text-gray-600 font-medium">{item.desc}</p>
              </div>
            </button>
          ))}
        </aside>

        {/* محتوى الإعدادات المتغير */}
        <main className="col-span-12 lg:col-span-8 bg-[#142129] rounded-[2.5rem] p-6 md:p-10 border border-gray-800/40 shadow-2xl min-h-[600px]">
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
              {activeTab === 'access' && <div className="p-20 text-center text-gray-500 italic">Access roles coming soon...</div>}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Settings;