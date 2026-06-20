// // import React from 'react';

// // const LegalTab = () => {
// //   return (
// //     <div className="space-y-12 animate-in fade-in duration-500">
      
// //       {/* 1. App Information Section */}
// //       <section>
// //         <h3 className="text-lg font-bold text-gray-200 mb-8 border-b border-gray-800 pb-4">App information</h3>
        
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
// //           {/* الوصف */}
// //           <div className="space-y-2">
// //             <h5 className="text-[11px] font-black uppercase text-gray-500 tracking-widest">Description</h5>
// //             <p className="text-xs text-gray-400 leading-relaxed font-medium">
// //               The Staffly Dashboard App is designed to streamline warehouse and HR operations by providing real-time tracking, inventory management, order processing, and employee scheduling. It helps businesses improve efficiency and enhance overall productivity.
// //             </p>
// //           </div>

// //           {/* تفاصيل الإصدار */}
// //           <div className="grid grid-cols-2 gap-6">
// //             <InfoBlock label="App Name" value="Staffly Dashboard App" />
// //             <InfoBlock label="Version" value="5.02.221" />
// //             <InfoBlock label="Platform" value="Dashboard & Phone" />
// //             <InfoBlock label="Release Date" value="20 December, 2024" />
// //           </div>

// //           {/* المميزات */}
// //           <div className="space-y-2">
// //             <h5 className="text-[11px] font-black uppercase text-gray-500 tracking-widest">Feature</h5>
// //             <ul className="text-xs text-gray-400 space-y-1 font-medium">
// //               <li className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> Employee Data Management</li>
// //               <li className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> Attendance & Time Tracking</li>
// //               <li className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> Leave & Time-Off Management</li>
// //               <li className="flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> Payroll Management</li>
// //             </ul>
// //           </div>
// //         </div>
// //       </section>

// //       {/* 2. Privacy Policy Section */}
// //       <section className="pt-8 border-t border-gray-800/50">
// //         <h3 className="text-lg font-bold text-gray-200 mb-8 border-b border-gray-800 pb-4">Privacy policy</h3>
        
// //         <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
// //           <div className="space-y-3">
// //             <p className="text-xs text-gray-300 font-bold italic">Welcome to Staffly Dashboard App.</p>
// //             <p className="text-xs text-gray-400 leading-relaxed font-medium">
// //               Your privacy is important, and this policy outlines how we collect, use, and protect your information within the dashboard environment.
// //             </p>
// //           </div>

// //           <PolicyBlock 
// //             title="Information we collect" 
// //             points={[
// //               "Personal: Name, email, phone number, login details.",
// //               "Attendance Data: Clock-in/out times, location for remote security.",
// //               "Device & Usage: IP address, browser type, analytics data."
// //             ]} 
// //           />

// //           <PolicyBlock 
// //             title="How we use your information" 
// //             points={[
// //               "Manage Staffly operations and HR processes.",
// //               "Enhance security and system performance.",
// //               "Provide real-time notifications and support."
// //             ]} 
// //           />

// //           <PolicyBlock 
// //             title="Data sharing" 
// //             points={[
// //               "Authorized administrative personnel only.",
// //               "Third-party providers hosting our secure servers.",
// //               "Legal authorities if required by law."
// //             ]} 
// //           />

// //           <div className="pt-4 text-center">
// //             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">© 2026 Staffly. All rights reserved.</p>
// //           </div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // };

// // // مكونات مساعدة للتبسيط
// // const InfoBlock = ({ label, value }) => (
// //   <div className="space-y-1">
// //     <h5 className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">{label}</h5>
// //     <p className="text-xs text-gray-300 font-bold">{value}</p>
// //   </div>
// // );

// // const PolicyBlock = ({ title, points }) => (
// //   <div className="space-y-3">
// //     <h4 className="text-sm font-bold text-gray-200">{title}</h4>
// //     <ul className="space-y-2">
// //       {points.map((p, i) => (
// //         <li key={i} className="text-xs text-gray-500 flex items-start gap-2 leading-relaxed">
// //           <span className="mt-1.5 w-1 h-1 bg-gray-700 rounded-full shrink-0"></span>
// //           {p}
// //         </li>
// //       ))}
// //     </ul>
// //   </div>
// // );

// // export default LegalTab;





// import React from 'react';

// const LegalAppTab = () => {
//   return (
//     <div className="space-y-6 text-slate-300 bg-[#111c24] border border-slate-800/60 rounded-2xl p-6">
//       <div>
//         <h3 className="text-base font-semibold text-white mb-5">App Information</h3>
//         <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
//           <div>
//             <span className="block text-xs text-slate-500">App Name</span>
//             <span className="text-white font-medium">Staffly HRMS Dashboard</span>
//           </div>
//           <div>
//             <span className="block text-xs text-slate-500">Version</span>
//             <span className="text-white font-medium">1.0.0 (Build 2026)</span>
//           </div>
//           <div>
//             <span className="block text-xs text-slate-500">Platform</span>
//             <span className="text-white font-medium">Dashboard & Admin Panel</span>
//           </div>
//           <div>
//             <span className="block text-xs text-slate-500">Release Date</span>
//             <span className="text-white font-medium">20 October, 2026</span>
//           </div>
//         </div>
//       </div>

//       <div className="border-t border-slate-800/60 my-6" />

//       <div>
//         <h3 className="text-base font-semibold text-white mb-3">Privacy Policy</h3>
//         <p className="text-xs text-slate-400 leading-relaxed mb-4">
//           Welcome to Staffly Dashboard App. Your enterprise security is highly important to us, and this policy outlines how we handle, process, and protect your cloud database assets.
//         </p>
//         <h4 className="text-xs font-semibold text-white mb-2">Information We Collect</h4>
//         <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
//           <li>Corporate credentials and legal enterprise registry contact profiles.</li>
//           <li>Hardware IoT identities (RFID, ESP32 attendance tracking logs).</li>
//           <li>Employee biometric metrics, shift check-ins, and geo-location hashes.</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default LegalAppTab;



import React from 'react';

const LegalAppTab = () => {
  return (
    <div 
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }} 
      className="space-y-6 border rounded-2xl p-6 shadow-sm"
    >
      <div>
        <h3 style={{ color: 'var(--text-main)' }} className="text-base font-bold mb-5">
          App Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div>
            <span style={{ color: 'var(--text-muted)' }} className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
              App Name
            </span>
            <span style={{ color: 'var(--text-main)' }} className="font-bold">Staffly HRMS Dashboard</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }} className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
              Version
            </span>
            <span style={{ color: 'var(--text-main)' }} className="font-bold">1.0.0 (Build 2026)</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }} className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
              Platform
            </span>
            <span style={{ color: 'var(--text-main)' }} className="font-bold">Dashboard & Admin Panel</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }} className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
              Release Date
            </span>
            <span style={{ color: 'var(--text-main)' }} className="font-bold">20 October, 2026</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-main)' }} className="my-6 opacity-50" />

      <div>
        <h3 style={{ color: 'var(--text-main)' }} className="text-base font-bold mb-3">
          Privacy Policy
        </h3>
        <p style={{ color: 'var(--text-muted)' }} className="text-xs leading-relaxed mb-6 font-medium">
          Welcome to Staffly Dashboard App. Your enterprise security is highly important to us, and this policy outlines how we handle, process, and protect your cloud database assets.
        </p>
        
        <h4 style={{ color: 'var(--text-main)' }} className="text-xs font-bold mb-3 uppercase tracking-widest">
          Information We Collect
        </h4>
        <ul style={{ color: 'var(--text-muted)' }} className="list-disc list-inside text-xs space-y-2 font-medium">
          <li>Corporate credentials and legal enterprise registry contact profiles.</li>
          <li>Hardware IoT identities (RFID, ESP32 attendance tracking logs).</li>
          <li>Employee biometric metrics, shift check-ins, and geo-location hashes.</li>
        </ul>
      </div>
    </div>
  );
};

export default LegalAppTab;