// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// const JobApplicants = ({ applicants = [] }) => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("Hired");
//   const tabs = ["Hired", "Rejected", "In-review"];

//   const filteredApplicants = applicants
//     .filter((app) => app.status.toLowerCase() === activeTab.toLowerCase())
//     .slice(-4)
//     .reverse();

//   const getStatusStyle = (status) => {
//     switch (status.toLowerCase()) {
//       case "hired":
//         return "border-green-500/30 text-green-400 bg-green-500/5";
//       case "rejected":
//         return "border-pink-500/30 text-pink-400 bg-pink-500/5";
//       case "in-review":
//         return "border-blue-500/30 text-blue-400 bg-blue-500/5";
//       default:
//         return "border-gray-500/30 text-gray-400 bg-gray-500/5";
//     }
//   };

//   return (
//     <div className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-[20px] rounded-[2.5rem] border border-gray-800/50 shadow-xl h-[480px] flex flex-col transition-all">
//       <div className="flex justify-between items-center mb-8">
//         <h3 className="text-xl font-bold text-white">Job applicant</h3>
//         <button
//           onClick={() => navigate("/hiring")}
//           className="w-9 h-9 bg-[#0b141a] rounded-full flex items-center justify-center text-gray-500 hover:text-blue-500 transition-all border border-transparent hover:border-blue-500/30"
//         >
//           <i className="fas fa-arrow-right -rotate-45 text-xs"></i>
//         </button>
//       </div>

//       <div className="flex gap-2 bg-[#0b141a]/60 p-1.5 rounded-2xl mb-8">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
//               activeTab === tab
//                 ? "bg-[#142129] text-white shadow-lg border border-gray-800"
//                 : "text-gray-600 hover:text-gray-400"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       <div className="space-y-6 flex-1 pr-1 custom-scrollbar overflow-y-auto scrollbar-hide">
//         <AnimatePresence mode="wait">
//           {filteredApplicants.length > 0 ? (
//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.3 }}
//               className="space-y-6"
//             >
//               {filteredApplicants.map((app) => (
//                 <div
//                   key={app.id}
//                   className="flex items-center justify-between group cursor-pointer hover:bg-white/[0.01] transition-all p-2 rounded-xl"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="relative">
//                       <img
//                         src={app.image}
//                         //
//                         className="w-11 h-11 rounded-full object-cover border-2 border-gray-800 shadow-lg group-hover:border-blue-500/50 transition-all"
//                         alt={app.name}
//                       />
//                       <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#142129] rounded-full"></span>
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
//                         {app.name}
//                       </p>
//                       <p className="text-[11px] text-gray-500 font-medium">
//                         {app.role}
//                       </p>
//                     </div>
//                   </div>

//                   <div
//                     className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${getStatusStyle(app.status)}`}
//                   >
//                     • {app.status}
//                   </div>
//                 </div>
//               ))}
//             </motion.div>
//           ) : (
//             <div className="h-full flex flex-col items-center justify-center py-10 opacity-20">
//               <i className="fas fa-user-clock text-4xl mb-4"></i>
//               <p className="text-xs uppercase font-bold tracking-widest text-center">
//                 No applicants for {activeTab}
//               </p>
//             </div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default JobApplicants;




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const JobApplicants = ({ applicants = [] }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Applied");

  const tabs = ["Applied", "Interviewing", "Hired", "Rejected"];

  // Normalize data (API safe)
  const normalizedApplicants = (applicants || []).map((app) => ({
    id: app._id,
    name: app.name || "Unknown Applicant",
    role: app.role || "No role",
    image: app.image || "https://i.pravatar.cc/100",
    status: app.status,
  }));

  const filteredApplicants = normalizedApplicants
    .filter((app) => app.status?.toLowerCase() === activeTab.toLowerCase())
    .slice(-4)
    .reverse();

  const getStatusStyle = (status = "") => {
    switch (status.toLowerCase()) {
      case "Hired":
        return "border-green-500/30 text-green-400 bg-green-500/5";
      case "Rejected":
        return "border-pink-500/30 text-pink-400 bg-pink-500/5";
      case "Interviewing":
        return "border-blue-500/30 text-blue-400 bg-blue-500/5";
      case "Applied":
        return "border-yellow-500/30 text-yellow-400 bg-yellow-500/5";
      default:
        return "border-gray-500/30 text-gray-400 bg-gray-500/5";
    }
  };

  return (
    <div className="bg-gradient-to-br from-transparent/20 to-45% to-[#182731] p-[20px] rounded-[2.5rem] border border-gray-800/50 shadow-xl h-[480px] flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-white">Job Applicants</h3>
        <button
          onClick={() => navigate("/hiring")}
          className="w-9 h-9 bg-[#0b141a] rounded-full flex items-center justify-center text-gray-500 hover:text-blue-500 transition-all"
        >
          <i className="fas fa-arrow-right -rotate-45 text-xs"></i>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#0b141a]/60 p-1.5 rounded-2xl mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === tab
                ? "bg-[#142129] text-white shadow-lg border border-gray-800"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-6 flex-1 overflow-y-auto pr-1 scrollbar-hide">

        <AnimatePresence mode="wait">
          {filteredApplicants.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {filteredApplicants.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between group cursor-pointer hover:bg-white/[0.01] transition-all p-2 rounded-xl"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={app.image}
                        className="w-11 h-11 rounded-full object-cover border-2 border-gray-800 group-hover:border-blue-500/50 transition-all"
                        alt={app.name}
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#142129] rounded-full"></span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                        {app.name}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {app.role}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${getStatusStyle(
                      app.status
                    )}`}
                  >
                    • {app.status}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <i className="fas fa-user-clock text-4xl mb-4"></i>
              <p className="text-xs uppercase font-bold tracking-widest">
                No applicants for {activeTab}
              </p>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default JobApplicants;