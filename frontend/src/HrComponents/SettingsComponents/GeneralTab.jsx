import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import { toggleTheme, updateSetting } from '../../store/HrSlices/navbar/sideMenuSlice';
import { motion } from "framer-motion";

const GeneralTab = () => {
  const dispatch = useDispatch();
  const { darkMode, settings } = useSelector((state) => state.ui);

  //   const handleToggle = (key, val) => dispatch(updateSetting({ key, value: !val }));

  return (
    <div className="space-y-12">
      <section>
        <h3 className="text-lg font-bold text-gray-200 mb-8 border-b border-gray-800 pb-4">
          General notifications
        </h3>
        <div className="space-y-8">
          {/* <ToggleItem label="Enable Notifications" desc="Turn all notifications on or off." enabled={settings.enableNotifications} onToggle={() => handleToggle('enableNotifications', settings.enableNotifications)} /> */}
          {/* <ToggleItem label="Notification Sound" desc="Play a sound when a new alert is received." enabled={settings.notificationSound} onToggle={() => handleToggle('notificationSound', settings.notificationSound)} /> */}
          {/* <ToggleItem label="Do Not Disturb Mode" desc="Mute notifications during specific times." enabled={settings.doNotDisturb} onToggle={() => handleToggle('doNotDisturb', settings.doNotDisturb)} /> */}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-200 mb-8 border-b border-gray-800 pb-4">
          Language & region
        </h3>
        <div className="flex items-center justify-between bg-[#0b141a] p-5 rounded-2xl border border-gray-800/50">
          <div>
            <h5 className="text-sm font-bold text-gray-300">System Language</h5>
            <p className="text-[11px] text-gray-600 mt-1">
              English (United States)
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#142129] px-4 py-2 rounded-xl border border-gray-700">
            <img
              src="https://flagcdn.com/w20/us.png"
              alt="us"
              className="w-5 h-3 object-cover"
            />
            <span className="text-xs font-bold">English</span>
            <i className="fas fa-chevron-down text-[8px] text-gray-600"></i>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-200 mb-8 border-b border-gray-800 pb-4">
          Theme
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Switch between dark and light appearance
          </p>
          {/* <button onClick={() => dispatch(toggleTheme())} className={`w-14 h-7 rounded-full relative transition-all ${darkMode ? 'bg-blue-600' : 'bg-gray-400'}`}>
            <motion.div animate={{ x: darkMode ? 32 : 4 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center">
               <i className={`fas ${darkMode ? 'fa-moon text-blue-600' : 'fa-sun text-yellow-500'} text-[10px]`}></i>
            </motion.div>
          </button> */}
        </div>
      </section>
    </div>
  );
};

// مكون الـ Toggle الموحد
const ToggleItem = ({ label, desc, enabled, onToggle }) => (
  <div className="flex items-center justify-between group">
    <div>
      <h5 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
        {label}
      </h5>
      <p className="text-[11px] text-gray-600 font-medium">{desc}</p>
    </div>
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${enabled ? "bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]" : "bg-gray-800"}`}
    >
      <motion.div
        animate={{ x: enabled ? 26 : 4 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </button>
  </div>
);

export default GeneralTab;
