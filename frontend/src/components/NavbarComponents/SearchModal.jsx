// import { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { executeSearch, clearSearch } from "../../store/HrSlices/navbar/searchSlice";
// import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

// const SearchModal = ({ isOpen, onClose, searchRef }) => {
// const dispatch = useDispatch();
// const navigate = useNavigate();

// const [query, setQuery] = useState("");

// const { user } = useSelector((state) => state.auth);
// const userRole = user?.general?.role;
// const isEmployee = userRole === "EMPLOYEE";

// const { results, loading } = useSelector((state) => state.search);

// const [activeTab, setActiveTab] = useState("employees");

// useEffect(() => {
//   if (isEmployee) {
//     setActiveTab("myTasks");
//   }
// }, [isEmployee]);


//   // const { results, loading } = useSelector((state) => state.search);

// // const { user } = useSelector((state) => state.auth);
// // const userRole = user?.general?.role;
// // const isEmployee = userRole === "EMPLOYEE";

//   // 1. إغلاق المودال عند الضغط على زر ESC
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") {
//         onClose();
//       }
//     };
//     if (isOpen) {
//       window.addEventListener("keydown", handleKeyDown);
//     }
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [isOpen, onClose]);

//   // 2. البحث مع الـ Debounce
//   useEffect(() => {
//     if (query.trim().length > 0) {
//       const timeoutId = setTimeout(() => {
// if (isEmployee) {
//   dispatch(
//     executeSearch({
//       query: query.trim(),
//       type: "myTasks",
//     })
//   );
// } else {
//   dispatch(
//     executeSearch({
//       query: query.trim(),
//       type: activeTab,
//     })
//   );
// }      }, 300);
//       return () => clearTimeout(timeoutId);
//     } else {
//       dispatch(clearSearch());
//     }
//   }, [query, activeTab, dispatch]);

//   // 3. تنظيف البحث عند القفل
//   useEffect(() => {
//     if (!isOpen) {
//       setQuery("");
//       dispatch(clearSearch());
//     }
//   }, [isOpen, dispatch]);

//   const handleResultClick = (result) => {
// const routes = {
//   employees: `/employee/${result.id}`,
//   projects: `/project?highlightId=${result.id}`,
//   hiring: `/hiring?highlightId=${result.id}`,
//   leave: `/leave?highlightId=${result.id}`,
//   myTasks: `/my-tasks`,
// };

//     if (routes[activeTab]) {
// navigate(`${routes[activeTab]}?highlightId=${result.id}`);    }
//     onClose();
//   };

// const tabs = isEmployee
//   ? [
//       {
//         id: "myTasks",
//         label: "My Tasks",
//         icon: "fa-check-circle",
//       },
//     ]
//   : [
//       { id: "employees", label: "Employees", icon: "fa-users" },
//       { id: "projects", label: "Projects", icon: "fa-tasks" },
//       { id: "hiring", label: "Hiring", icon: "fa-user-tie" },
//       { id: "leave", label: "Leaves", icon: "fa-calendar-times" },
//     ];

//   if (!isOpen) return null;




//   return createPortal(
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-20"
//         onClick={onClose}
//       >
//         <motion.div
//           ref={searchRef}
//           initial={{ y: -50, opacity: 0, scale: 0.95 }}
//           animate={{ y: 0, opacity: 1, scale: 1 }}
//           exit={{ y: -50, opacity: 0, scale: 0.95 }}
//           onClick={(e) => e.stopPropagation()}
//           className="w-full max-w-2xl bg-[#142129] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
//         >
//           {/* Input Area */}
//           <div className="p-6 border-b border-gray-800">
//             <div className="relative">
//               <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"></i>
//               <input
//                 type="text"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder={`Search ${activeTab}...`}
//                 autoFocus
//                 className="w-full bg-[#1c2e38] border border-gray-700 rounded-2xl pl-14 pr-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//               />
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="px-6 py-3 border-b border-gray-800/50 flex gap-2 overflow-x-auto scrollbar-hide">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   dispatch(clearSearch());
//                 }}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
//                   activeTab === tab.id
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-gray-800/50 text-gray-500 hover:text-white"
//                 }`}
//               >
//                 <i className={`fas ${tab.icon}`}></i>
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Results Area */}
//           <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-[#0f1920]/30">
//             {loading ? (
//               <div className="py-20 text-center">
//                 <i className="fas fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
//                 <p className="text-gray-500 text-sm italic font-medium">Scanning {activeTab} Records...</p>
//               </div>
//             ) : results?.length > 0 ? (
//               <div className="divide-y divide-gray-800/20">
//                 {results.map((result) => (
//                   <button
//                     key={result.id}
//                     onClick={() => handleResultClick(result)}
//                     className="w-full px-6 py-4 flex items-center gap-4 hover:bg-white/[0.03] transition-all text-left group"
//                   >
//                     <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-gray-800 group-hover:border-blue-500/40 shadow-lg flex items-center justify-center bg-gray-800">
//                       <img
//                         src={result.image || defaultAvatar}
//                         className="w-full h-full object-cover"
//                         alt=""
//                         onError={(e) => { e.target.src = defaultAvatar; }}
//                       />
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-bold text-gray-200 group-hover:text-blue-400 transition-colors truncate">
//                         {result.name}
//                       </p>
//                       <div className="flex items-center gap-2 mt-0.5">
//                         <span className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${
//                           result.department === 'Approved' ? 'text-green-500 bg-green-500/10' : 
//                           result.department === 'Rejected' ? 'text-red-500 bg-red-500/10' : 'text-gray-500'
//                         }`}>
//                            {result.department}
//                         </span>
//                         <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
//                         <span className="text-[10px] text-gray-600 font-bold italic truncate">
//                            {result.position}
//                         </span>
//                       </div>
//                     </div>

//                     <i className="fas fa-chevron-right text-gray-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"></i>
//                   </button>
//                 ))}
//               </div>
//             ) : query.trim() ? (
//               <div className="py-20 text-center text-gray-600 opacity-40">
//                 <i className="fas fa-search-minus text-4xl mb-4"></i>
//                 <p className="text-sm font-bold uppercase tracking-widest">No match found</p>
//               </div>
//             ) : (
//               <div className="py-20 text-center text-gray-800 font-black uppercase text-[10px] tracking-[0.3em] opacity-20">
//                 Type to search database
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="px-6 py-3 border-t border-gray-800/50 flex justify-between items-center bg-[#142129]">
//              <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
//                Search Results: {results.length}
//              </span>
//              <span className="text-[10px] text-gray-700 font-bold flex items-center gap-2">
//                <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-[9px] text-gray-400">ESC</kbd>
//                to close
//              </span>
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>,
//     document.body,
//   );
// };

// export default SearchModal;


import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { executeSearch, clearSearch } from "../../store/HrSlices/navbar/searchSlice";
import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

const SearchModal = ({ isOpen, onClose, searchRef }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const { user } = useSelector((state) => state.auth);
  const userRole = user?.general?.role;
  const isEmployee = userRole === "EMPLOYEE";

  const { results, loading } = useSelector((state) => state.search);

  const [activeTab, setActiveTab] = useState("employees");

  useEffect(() => {
    if (isEmployee) {
      setActiveTab("myTasks");
    }
  }, [isEmployee]);

  // 1. إغلاق المودال عند الضغط على زر ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 2. البحث مع الـ Debounce
  useEffect(() => {
    if (query.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        if (isEmployee) {
          dispatch(
            executeSearch({
              query: query.trim(),
              type: "myTasks",
            })
          );
        } else {
          dispatch(
            executeSearch({
              query: query.trim(),
              type: activeTab,
            })
          );
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      dispatch(clearSearch());
    }
  }, [query, activeTab, dispatch, isEmployee]);

  // 3. تنظيف البحث عند القفل
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      dispatch(clearSearch());
    }
  }, [isOpen, dispatch]);

  const handleResultClick = (result) => {
    const routes = {
      employees: `/employee/${result.id}`,
      projects: `/project?highlightId=${result.id}`,
      hiring: `/hiring?highlightId=${result.id}`,
      leave: `/leave?highlightId=${result.id}`,
      myTasks: `/my-tasks`,
    };

    if (routes[activeTab]) {
      navigate(`${routes[activeTab]}?highlightId=${result.id}`);
    }
    onClose();
  };

  const tabs = isEmployee
    ? [
        {
          id: "myTasks",
          label: "My Tasks",
          icon: "fa-check-circle",
        },
      ]
    : [
        { id: "employees", label: "Employees", icon: "fa-users" },
        { id: "projects", label: "Projects", icon: "fa-tasks" },
        { id: "hiring", label: "Hiring", icon: "fa-user-tie" },
        { id: "leave", label: "Leaves", icon: "fa-calendar-times" },
      ];

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          ref={searchRef}
          initial={{ y: -50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-main)' 
          }}
          className="w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Input Area */}
          <div style={{ borderBottom: '1px solid var(--border-main)' }} className="p-6">
            <div className="relative">
              <i style={{ color: 'var(--text-muted)' }} className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2"></i>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                autoFocus
                style={{ 
                  backgroundColor: 'var(--input-bg)', 
                  borderColor: 'var(--border-main)', 
                  color: 'var(--text-main)' 
                }}
                className="w-full border rounded-2xl pl-14 pr-12 py-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: '1px solid var(--border-main)' }} className="px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  dispatch(clearSearch());
                }}
                style={activeTab === tab.id ? {} : { 
                  backgroundColor: 'var(--bg-deep)', 
                  color: 'var(--text-muted)' 
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "hover:opacity-80"
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="py-20 text-center">
                <i className="fas fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
                <p style={{ color: 'var(--text-muted)' }} className="text-sm italic font-medium">Scanning {activeTab} Records...</p>
              </div>
            ) : results?.length > 0 ? (
              <div style={{ borderColor: 'var(--border-main)' }} className="divide-y opacity-90">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-white/[0.03] transition-all text-left group"
                  >
                    <div 
                      style={{ 
                        borderColor: 'var(--border-main)', 
                        backgroundColor: 'var(--bg-deep)' 
                      }} 
                      className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 group-hover:border-blue-500/40 shadow-lg flex items-center justify-center"
                    >
                      <img
                        src={result.image || defaultAvatar}
                        className="w-full h-full object-cover"
                        alt=""
                        onError={(e) => { e.target.src = defaultAvatar; }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p style={{ color: 'var(--text-main)' }} className="text-sm font-bold group-hover:text-blue-400 transition-colors truncate">
                        {result.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${
                          result.department === 'Approved' ? 'text-green-500 bg-green-500/10' : 
                          result.department === 'Rejected' ? 'text-red-500 bg-red-500/10' : 'text-slate-500'
                        }`}>
                           {result.department}
                        </span>
                        <span style={{ backgroundColor: 'var(--border-main)' }} className="w-1 h-1 rounded-full"></span>
                        <span style={{ color: 'var(--text-muted)' }} className="text-[10px] font-bold italic truncate">
                           {result.position}
                        </span>
                      </div>
                    </div>

                    <i style={{ color: 'var(--border-main)' }} className="fas fa-chevron-right group-hover:text-blue-500 group-hover:translate-x-1 transition-all"></i>
                  </button>
                ))}
              </div>
            ) : query.trim() ? (
              <div style={{ color: 'var(--text-muted)' }} className="py-20 text-center">
                <i className="fas fa-search-minus text-4xl mb-4"></i>
                <p className="text-sm font-bold uppercase tracking-widest">No match found</p>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', opacity: 0.3 }} className="py-20 text-center font-black uppercase text-[10px] tracking-[0.3em]">
                Type to search database
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid var(--border-main)' }} className="px-6 py-3 flex justify-between items-center">
             <span style={{ color: 'var(--text-muted)' }} className="text-[10px] font-black uppercase tracking-widest">
               Search Results: {results.length}
             </span>
             <span style={{ color: 'var(--text-muted)' }} className="text-[10px] font-bold flex items-center gap-2">
               <kbd style={{ backgroundColor: 'var(--bg-deep)', borderColor: 'var(--border-main)' }} className="px-1.5 py-0.5 border rounded text-[9px]">ESC</kbd>
               to close
             </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

export default SearchModal;