import React from 'react';

const LegalTab = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* 1. App Information Section */}
      <section>
        <h3 className="text-lg font-bold text-gray-200 mb-8 border-b border-gray-800 pb-4">App information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* الوصف */}
          <div className="space-y-2">
            <h5 className="text-[11px] font-black uppercase text-gray-500 tracking-widest">Description</h5>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              The Staffly Dashboard App is designed to streamline warehouse and HR operations by providing real-time tracking, inventory management, order processing, and employee scheduling. It helps businesses improve efficiency and enhance overall productivity.
            </p>
          </div>

          {/* تفاصيل الإصدار */}
          <div className="grid grid-cols-2 gap-6">
            <InfoBlock label="App Name" value="Staffly Dashboard App" />
            <InfoBlock label="Version" value="5.02.221" />
            <InfoBlock label="Platform" value="Dashboard & Phone" />
            <InfoBlock label="Release Date" value="20 December, 2024" />
          </div>

          {/* المميزات */}
          <div className="space-y-2">
            <h5 className="text-[11px] font-black uppercase text-gray-500 tracking-widest">Feature</h5>
            <ul className="text-xs text-gray-400 space-y-1 font-medium">
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> Employee Data Management</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> Attendance & Time Tracking</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> Leave & Time-Off Management</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> Payroll Management</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Privacy Policy Section */}
      <section className="pt-8 border-t border-gray-800/50">
        <h3 className="text-lg font-bold text-gray-200 mb-8 border-b border-gray-800 pb-4">Privacy policy</h3>
        
        <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
          <div className="space-y-3">
            <p className="text-xs text-gray-300 font-bold italic">Welcome to Staffly Dashboard App.</p>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Your privacy is important, and this policy outlines how we collect, use, and protect your information within the dashboard environment.
            </p>
          </div>

          <PolicyBlock 
            title="Information we collect" 
            points={[
              "Personal: Name, email, phone number, login details.",
              "Attendance Data: Clock-in/out times, location for remote security.",
              "Device & Usage: IP address, browser type, analytics data."
            ]} 
          />

          <PolicyBlock 
            title="How we use your information" 
            points={[
              "Manage Staffly operations and HR processes.",
              "Enhance security and system performance.",
              "Provide real-time notifications and support."
            ]} 
          />

          <PolicyBlock 
            title="Data sharing" 
            points={[
              "Authorized administrative personnel only.",
              "Third-party providers hosting our secure servers.",
              "Legal authorities if required by law."
            ]} 
          />

          <div className="pt-4 text-center">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">© 2026 Staffly. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// مكونات مساعدة للتبسيط
const InfoBlock = ({ label, value }) => (
  <div className="space-y-1">
    <h5 className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">{label}</h5>
    <p className="text-xs text-gray-300 font-bold">{value}</p>
  </div>
);

const PolicyBlock = ({ title, points }) => (
  <div className="space-y-3">
    <h4 className="text-sm font-bold text-gray-200">{title}</h4>
    <ul className="space-y-2">
      {points.map((p, i) => (
        <li key={i} className="text-xs text-gray-500 flex items-start gap-2 leading-relaxed">
          <span className="mt-1.5 w-1 h-1 bg-gray-700 rounded-full shrink-0"></span>
          {p}
        </li>
      ))}
    </ul>
  </div>
);

export default LegalTab;