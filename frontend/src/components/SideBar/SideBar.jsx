// import { NavLink, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import icon from "../../assets/icons/Icon.svg";
// // import { logoutUser } from "../../store/HrSlices/auth/loginSlice";

// const Sidebar = () => {
//   const dispatch = useDispatch();
//   const isCollapsed = useSelector((state) => state.ui.isSidebarCollapsed);
//   const { user } = useSelector((state) => state.auth);
//   const userRole = user?.general?.role;
//   const location = useLocation();
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [flyoutPos, setFlyoutPos] = useState({ top: 0, visible: false, item: null });
//   const flyoutTimeout = useRef(null);

//   const hrMenuItems = [
//     { name: "Dashboard", icon: "fas fa-th-large", path: "/dashboard" },
//     { name: "Employees", icon: "fas fa-users", path: "/employees" },
//     { name: "Project", icon: "fas fa-project-diagram", path: "/project" },
//     {
//       name: "Tasks",
//       icon: "fas fa-check-circle",
//       children: [
//         { name: "AllTasks", path: "/Tasks/alltasks" },
//         { name: "OngoingTasks", path: "/Tasks/ongoingtasks" },
//       ],
//     },
//     {
//       name: "Payroll",
//       icon: "fas fa-wallet",
//       children: [
//         { name: "Dashboard", path: "/payroll/dashboard" },
//         { name: "Management", path: "/payroll/management" },
//       ],
//     },
//     // { name: "Hiring", icon: "fas fa-user-plus", path: "/hiring" },
//     {
//       name: "Hiring",
//       icon: "fas fa-user-plus",
//       children: [
//         { name: "Applicants", path: "/hiring" },
//         { name: "Jobs", path: "/hiring/jobs" },
//       ],
//     },
//     { name: "Attendance", icon: "fas fa-calendar-check", path: "/attendance" },
//     { name: "Leave", icon: "fas fa-envelope-open-text", path: "/leave-requests" },
//     { name: "Requests", icon: "fas fa-file-alt", path: "/requests" },
//     { name: "Performance", icon: "fas fa-chart-line", path: "/performance" },
//   ];

//     if (userRole === "MANAGER") {
//     hrMenuItems.push({ name: "Manage HRs", icon: "fas fa-user-shield", path: "/manage-hrs" });
//   }
//   const employeeMenuItems = [
//     { name: "Dashboard", icon: "fas fa-th-large", path: "/my-dashboard" },
//     { name: "My Profile", icon: "fas fa-user-circle", path: "/profile" },
//     { name: "Attendance", icon: "fas fa-calendar-alt", path: "/my-attendance" },
//     { name: "Payroll", icon: "fas fa-wallet", path: "/my-payroll" },
//     { name: "My Leaves", icon: "fas fa-plane", path: "/my-leaves" },
//     { name: "My Requests", icon: "fas fa-file-alt", path: "/my-requests" },
//     { name: "My Tasks", icon: "fas fa-check-circle", path: "/my-tasks" },
//     { name: "Performance", icon: "fas fa-chart-line", path: "/my-performance" },
//     { name: "Notifications", icon: "fas fa-bell", path: "/notifications" },
//   ];

//   const menuItems = userRole === "HR" || userRole === "MANAGER" ? hrMenuItems : employeeMenuItems;

//   const handleMouseEnter = (e, itemName) => {
//     if (!isCollapsed) return;
//     clearTimeout(flyoutTimeout.current);
//     const rect = e.currentTarget.getBoundingClientRect();
//     setFlyoutPos({ top: rect.top, visible: true, item: itemName });
//   };

//   const handleMouseLeave = () => {
//     flyoutTimeout.current = setTimeout(() => {
//       setFlyoutPos({ top: 0, visible: false, item: null });
//     }, 100);
//   };

//   return (
// <motion.aside
//   animate={{ width: isCollapsed ? 80 : 175 }}
//   className="fixed h-screen bg-[#0b161d] text-gray-400 flex flex-col border-r border-gray-900  top-0 overflow-x-auto scroll-hiden z-50"
// >
//      {/* Logo */}
//       <NavLink
//         to={userRole === "HR" ? "/dashboard" : "/my-dashboard"}
//         className={`h-20 flex items-center px-6 mb-4 ${isCollapsed ? "justify-center" : "justify-start gap-3"
//           }`}
//       >
//         <div className="w-9 flex items-center justify-center">
//           <img src={icon} alt="Logo" className="w-8 h-8" />
//         </div>
//         {!isCollapsed && (
//           <span className="text-xl text-white font-bold italic">
//             Staf<span className="text-blue-500">fly</span>
//           </span>
//         )}
//       </NavLink>

//       {/* Menu */}
//       <div className="flex-1 px-3 space-y-2 overflow-hidden">
//         <p className="text-[10px] text-gray-600 font-black uppercase mb-4 ml-3 tracking-widest">
//           {/* {isCollapsed ? "•••" : "Main Menu"} */}
//         </p>

//         {menuItems.map((item) => (
//           <div
//             key={item.name}
//             className="relative"
//             onMouseEnter={(e) => handleMouseEnter(e, item.name)}
//             onMouseLeave={handleMouseLeave}
//           >
//             {item.children ? (
//               <button
//                 onClick={() => !isCollapsed && setOpenDropdown(openDropdown === item.name ? null : item.name)}
//                 className={[
//                   "w-full flex items-center gap-4 p-3.5 rounded-xl transition-all hover:bg-[#142129] hover:text-white",
//                   (item.name === "Payroll" && location.pathname.startsWith("/payroll")) ||
//                     (item.name === "Hiring" && location.pathname.startsWith("/hiring"))
//                     ? "bg-[#182731] text-white"
//                     : "",
//                   isCollapsed ? "justify-center" : ""
//                 ].join(" ")}
//               >
              
//                 <i className={`${item.icon} text-lg`}></i>
//                 {!isCollapsed && (
//                   <>
//                     <span className="text-sm font-medium flex-1 text-left">{item.name}</span>
//                     <i className={[
//                       "fas fa-chevron-down text-xs transition-transform duration-200",
//                       openDropdown === item.name ? "rotate-180" : ""
//                     ].join(" ")} />
//                   </>
//                 )}
//               </button>
//             ) : (
//               <NavLink
//                 to={item.path}
//                 className={({ isActive }) => [
//                   "flex items-center gap-4 p-3.5 rounded-xl transition-all relative",
//                   isActive
//                     ? "bg-[#182731] text-white shadow-lg shadow-blue-500/30"
//                     : "hover:bg-[#142129] hover:text-white",
//                   isCollapsed ? "justify-center" : ""
//                 ].join(" ")}
//               >
//                 <i className={`${item.icon} text-lg`}></i>
//                 {!isCollapsed && (
//                   <span className="text-sm font-medium flex-1">{item.name}</span>
//                 )}
//                 {!isCollapsed && item.badge && (
//                   <span className="bg-blue-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
//                     {item.badge}
//                   </span>
//                 )}
//               </NavLink>
//             )}

         
//             {item.children && !isCollapsed && (
//               <AnimatePresence>
//                 {openDropdown === item.name && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0, y: -10 }}
//                     animate={{ opacity: 1, height: "auto", y: 0 }}
//                     exit={{ opacity: 0, height: 0, y: -10 }}
//                     transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
//                     className="overflow-hidden"
//                   >
//                     <div className="ml-4 mt-1 space-y-1 border-l border-slate-700/50 pl-3">
//                       {item.children.map((child, index) => (
//                         <motion.div
//                           key={child.name}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.07, duration: 0.2 }}
//                         >
//                           <NavLink
//                             to={child.path}
//                             className={({ isActive }) => [
//                               "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all",
//                               isActive
//                                 ? "bg-[#182731] text-white"
//                                 : "text-gray-400 hover:bg-[#142129] hover:text-white"
//                             ].join(" ")}
//                           >
//                             <span className="w-1.5 h-1.5 rounded-full bg-current" />
//                             {child.name}
//                           </NavLink>
//                         </motion.div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Logout */}
//       {/* <div className="p-3 border-t border-gray-900/50">
//         <button
//           onClick={() => dispatch(logoutUser())}
//           className={[
//             "w-full flex items-center gap-4 p-3.5 rounded-xl hover:bg-red-500/10 hover:text-red-500",
//             isCollapsed ? "justify-center" : ""
//           ].join(" ")}
//         >
//           <i className="fas fa-sign-out-alt text-lg"></i>
//           {!isCollapsed && <span className="text-sm font-bold">Logout</span>}
//         </button>
//       </div> */}

//       {/* Flyout */}
//       {isCollapsed && flyoutPos.visible && (() => {
//         const item = menuItems.find(i => i.name === flyoutPos.item);
//         if (!item) return null;
//         return (
//           <div
//             className="fixed z-[999] min-w-[160px]"
//             style={{ top: flyoutPos.top, left: "82px" }}
//             onMouseEnter={() => {
//               clearTimeout(flyoutTimeout.current);
//               setFlyoutPos(prev => ({ ...prev, visible: true }));
//             }}
//             onMouseLeave={handleMouseLeave}
//           >
//             <div className="absolute -left-1.5 top-4 w-3 h-3 bg-[#182731] rotate-45 border-l border-b border-gray-700/50" />
//             <div className="bg-[#182731] border border-gray-700/50 rounded-xl overflow-hidden shadow-xl">
//               <div className="px-4 py-2.5 border-b border-gray-700/50">
//                 <span className="text-white text-xs font-semibold">{item.name}</span>
//               </div>

//               {item.children ? (
//                 item.children.map((child) => (
//                   <NavLink
//                     key={child.name}
//                     to={child.path}
//                     onClick={() => setFlyoutPos({ top: 0, visible: false, item: null })}
//                     className={({ isActive }) => [
//                       "flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all",
//                       isActive ? "text-white bg-[#0b161d]" : "text-gray-400 hover:text-white hover:bg-[#0b161d]"
//                     ].join(" ")}
//                   >
//                     <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
//                     {child.name}
//                   </NavLink>
//                 ))
//               ) : (
//                 <NavLink
//                   to={item.path}
//                   onClick={() => setFlyoutPos({ top: 0, visible: false, item: null })}
//                   className={({ isActive }) => [
//                     "flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all",
//                     isActive ? "text-white bg-[#0b161d]" : "text-gray-400 hover:text-white hover:bg-[#0b161d]"
//                   ].join(" ")}
//                 >
//                   <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
//                   {item.name}
//                 </NavLink>
//               )}
//             </div>
//           </div>
//         );
//       })()}

//     </motion.aside>
//   );
// };

// export default Sidebar;


// import { NavLink, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import icon from "../../assets/icons/Icon.svg";

// const Sidebar = () => {
//   const dispatch = useDispatch();
//   const isCollapsed = useSelector((state) => state.ui.isSidebarCollapsed);
//   const { user } = useSelector((state) => state.auth);
//   const userRole = user?.general?.role;
//   const location = useLocation();
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [flyoutPos, setFlyoutPos] = useState({ top: 0, visible: false, item: null });
//   const flyoutTimeout = useRef(null);

//   const hrMenuItems = [
//     { name: "Dashboard", icon: "fas fa-th-large", path: "/dashboard" },
//     { name: "Employees", icon: "fas fa-users", path: "/employees" },
//     { name: "Project", icon: "fas fa-project-diagram", path: "/project" },
//     {
//       name: "Tasks",
//       icon: "fas fa-check-circle",
//       children: [
//         { name: "AllTasks", path: "/Tasks/alltasks" },
//         { name: "OngoingTasks", path: "/Tasks/ongoingtasks" },
//       ],
//     },
//     {
//       name: "Payroll",
//       icon: "fas fa-wallet",
//       children: [
//         { name: "Dashboard", path: "/payroll/dashboard" },
//         { name: "Management", path: "/payroll/management" },
//       ],
//     },
//     {
//       name: "Hiring",
//       icon: "fas fa-user-plus",
//       children: [
//         { name: "Applicants", path: "/hiring" },
//         { name: "Jobs", path: "/hiring/jobs" },
//       ],
//     },
//     { name: "Attendance", icon: "fas fa-calendar-check", path: "/attendance" },
//     { name: "Leave", icon: "fas fa-envelope-open-text", path: "/leave-requests" },
//     { name: "Requests", icon: "fas fa-file-alt", path: "/requests" },
//     { name: "Performance", icon: "fas fa-chart-line", path: "/performance" },
//   ];

//   if (userRole === "MANAGER") {
//     hrMenuItems.push({ name: "Manage HRs", icon: "fas fa-user-shield", path: "/manage-hrs" });
//   }

//   const employeeMenuItems = [
//     { name: "Dashboard", icon: "fas fa-th-large", path: "/my-dashboard" },
//     { name: "My Profile", icon: "fas fa-user-circle", path: "/profile" },
//     { name: "Attendance", icon: "fas fa-calendar-alt", path: "/my-attendance" },
//     { name: "Payroll", icon: "fas fa-wallet", path: "/my-payroll" },
//     { name: "My Leaves", icon: "fas fa-plane", path: "/my-leaves" },
//     { name: "My Requests", icon: "fas fa-file-alt", path: "/my-requests" },
//     { name: "My Tasks", icon: "fas fa-check-circle", path: "/my-tasks" },
//     { name: "Performance", icon: "fas fa-chart-line", path: "/my-performance" },
//     // { name: "Notifications", icon: "fas fa-bell", path: "/notifications" },
//   ];

//   const menuItems = userRole === "HR" || userRole === "MANAGER" ? hrMenuItems : employeeMenuItems;

//   const handleMouseEnter = (e, itemName) => {
//     if (!isCollapsed) return;
//     clearTimeout(flyoutTimeout.current);
//     const rect = e.currentTarget.getBoundingClientRect();
//     setFlyoutPos({ top: rect.top, visible: true, item: itemName });
//   };

//   const handleMouseLeave = () => {
//     flyoutTimeout.current = setTimeout(() => {
//       setFlyoutPos({ top: 0, visible: false, item: null });
//     }, 100);
//   };

//   // دوال مساعدة للألوان التفاعلية
//   const getActiveStyle = (isActive) => ({
//     backgroundColor: isActive ? 'var(--bg-deep)' : 'transparent',
//     color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
//   });

//   return (
//     <motion.aside
//       animate={{ width: isCollapsed ? 80 : 175 }}
//       style={{ 
//         backgroundColor: 'var(--bg-card)', 
//         borderRight: '1px solid var(--border-main)' 
//       }}
//       className="fixed h-screen  flex flex-col top-0 overflow-x-auto scrollbar-hide z-50 transition-colors duration-300"
//     >
//       {/* Logo */}
//       <NavLink
//         to={userRole === "HR" || userRole === "MANAGER" ? "/dashboard" : "/my-dashboard"}
//         className={`h-20 flex items-center px-6 mb-4 ${isCollapsed ? "justify-center" : "justify-start gap-3"}`}
//       >
//         <div className="w-9 flex items-center justify-center">
//           <img src={icon} alt="Logo" className="w-8 h-8" />
//         </div>
//         {!isCollapsed && (
//           <span className="text-xl font-bold italic" style={{ color: 'var(--text-main)' }}>
//             Staf<span className="text-blue-500">fly</span>
//           </span>
//         )}
//       </NavLink>

//       {/* Menu */}
//       <div className="flex-1 px-3 space-y-2 overflow-hidden">
//         {menuItems.map((item) => {
//           const isParentActive = item.children && item.children.some(child => location.pathname.startsWith(child.path));

//           return (
//             <div
//               key={item.name}
//               className="relative"
//               onMouseEnter={(e) => handleMouseEnter(e, item.name)}
//               onMouseLeave={handleMouseLeave}
//             >
//               {item.children ? (
//                 <button
//                   onClick={() => !isCollapsed && setOpenDropdown(openDropdown === item.name ? null : item.name)}
//                   style={{ 
//                     backgroundColor: isParentActive ? 'var(--bg-deep)' : 'transparent',
//                     color: isParentActive ? 'var(--text-main)' : 'var(--text-muted)'
//                   }}
//                   className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all hover:bg-[var(--hover-bg)] hover:text-[var(--text-main)] ${isCollapsed ? "justify-center" : ""}`}
//                 >
//                   <i className={`${item.icon} text-lg`}></i>
//                   {!isCollapsed && (
//                     <>
//                       <span className="text-sm font-medium flex-1 text-left">{item.name}</span>
//                       <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${openDropdown === item.name ? "rotate-180" : ""}`} />
//                     </>
//                   )}
//                 </button>
//               ) : (
//                 <NavLink
//                   to={item.path}
//                   style={({ isActive }) => getActiveStyle(isActive)}
//                   className={`flex items-center gap-4 p-3.5 rounded-xl transition-all relative hover:bg-[var(--hover-bg)] hover:text-[var(--text-main)] ${isCollapsed ? "justify-center" : ""}`}
//                 >
//                   <i className={`${item.icon} text-lg`}></i>
//                   {!isCollapsed && (
//                     <span className="text-sm font-medium flex-1">{item.name}</span>
//                   )}
//                   {!isCollapsed && item.badge && (
//                     <span className="bg-blue-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
//                       {item.badge}
//                     </span>
//                   )}
//                 </NavLink>
//               )}

//               {/* Dropdown for non-collapsed state */}
//               {item.children && !isCollapsed && (
//                 <AnimatePresence>
//                   {openDropdown === item.name && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0, y: -10 }}
//                       animate={{ opacity: 1, height: "auto", y: 0 }}
//                       exit={{ opacity: 0, height: 0, y: -10 }}
//                       transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
//                       className="overflow-hidden"
//                     >
//                       <div className="ml-4 mt-1 space-y-1 border-l pl-3" style={{ borderColor: 'var(--border-main)' }}>
//                         {item.children.map((child, index) => (
//                           <motion.div
//                             key={child.name}
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: index * 0.07, duration: 0.2 }}
//                           >
//                             <NavLink
//                               to={child.path}
//                               style={({ isActive }) => getActiveStyle(isActive)}
//                               className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-[var(--hover-bg)]"
//                             >
//                               <span className="w-1.5 h-1.5 rounded-full bg-current" />
//                               {child.name}
//                             </NavLink>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Flyout for collapsed state */}
//       {isCollapsed && flyoutPos.visible && (() => {
//         const item = menuItems.find(i => i.name === flyoutPos.item);
//         if (!item) return null;
//         return (
//           <div
//             className="fixed z-[999] min-w-[160px]"
//             style={{ top: flyoutPos.top, left: "82px" }}
//             onMouseEnter={() => {
//               clearTimeout(flyoutTimeout.current);
//               setFlyoutPos(prev => ({ ...prev, visible: true }));
//             }}
//             onMouseLeave={handleMouseLeave}
//           >
//             <div 
//               style={{ backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-main)', borderBottom: '1px solid var(--border-main)' }}
//               className="absolute -left-1.5 top-4 w-3 h-3 rotate-45" 
//             />
//             <div 
//               style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
//               className="border rounded-xl overflow-hidden shadow-xl"
//             >
//               <div className="px-4 py-2.5 border-b" style={{ borderColor: 'var(--border-main)' }}>
//                 <span className="text-xs font-semibold" style={{ color: 'var(--text-main)' }}>{item.name}</span>
//               </div>

//               {item.children ? (
//                 item.children.map((child) => (
//                   <NavLink
//                     key={child.name}
//                     to={child.path}
//                     onClick={() => setFlyoutPos({ top: 0, visible: false, item: null })}
//                     style={({ isActive }) => getActiveStyle(isActive)}
//                     className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all hover:bg-[var(--hover-bg)]"
//                   >
//                     <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
//                     {child.name}
//                   </NavLink>
//                 ))
//               ) : (
//                 <NavLink
//                   to={item.path}
//                   onClick={() => setFlyoutPos({ top: 0, visible: false, item: null })}
//                   style={({ isActive }) => getActiveStyle(isActive)}
//                   className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all hover:bg-[var(--hover-bg)]"
//                 >
//                   <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
//                   {item.name}
//                 </NavLink>
//               )}
//             </div>
//           </div>
//         );
//       })()}
//     </motion.aside>
//   );
// };

// export default Sidebar;



import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import icon from "../../assets/icons/Icon.svg";

// نستقبل prop الـ isTinyScreen المرسل من الـ MainLayout
const Sidebar = ({ isTinyScreen }) => {
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state) => state.ui.isSidebarCollapsed);
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.general?.role;
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [flyoutPos, setFlyoutPos] = useState({ top: 0, visible: false, item: null });
  const flyoutTimeout = useRef(null);

  const hrMenuItems = [
    { name: "Dashboard", icon: "fas fa-th-large", path: "/dashboard" },
    { name: "Employees", icon: "fas fa-users", path: "/employees" },
    { name: "Project", icon: "fas fa-project-diagram", path: "/project" },
    {
      name: "Tasks",
      icon: "fas fa-check-circle",
      children: [
        { name: "AllTasks", path: "/Tasks/alltasks" },
        { name: "OngoingTasks", path: "/Tasks/ongoingtasks" },
      ],
    },
    {
      name: "Payroll",
      icon: "fas fa-wallet",
      children: [
        { name: "Dashboard", path: "/payroll/dashboard" },
        { name: "Management", path: "/payroll/management" },
      ],
    },
    {
      name: "Hiring",
      icon: "fas fa-user-plus",
      children: [
        { name: "Applicants", path: "/hiring" },
        { name: "Jobs", path: "/hiring/jobs" },
      ],
    },
    { name: "Attendance", icon: "fas fa-calendar-check", path: "/attendance" },
    { name: "Leave", icon: "fas fa-envelope-open-text", path: "/leave-requests" },
    { name: "Requests", icon: "fas fa-file-alt", path: "/requests" },
    { name: "Performance", icon: "fas fa-chart-line", path: "/performance" },
  ];

  if (userRole === "MANAGER") {
    hrMenuItems.push({ name: "Manage HRs", icon: "fas fa-user-shield", path: "/manage-hrs" });
  }

  const employeeMenuItems = [
    { name: "Dashboard", icon: "fas fa-th-large", path: "/my-dashboard" },
    { name: "My Profile", icon: "fas fa-user-circle", path: "/profile" },
    { name: "Attendance", icon: "fas fa-calendar-alt", path: "/my-attendance" },
    { name: "Payroll", icon: "fas fa-wallet", path: "/my-payroll" },
    { name: "My Leaves", icon: "fas fa-plane", path: "/my-leaves" },
    { name: "My Requests", icon: "fas fa-file-alt", path: "/my-requests" },
    { name: "My Tasks", icon: "fas fa-check-circle", path: "/my-tasks" },
    { name: "Performance", icon: "fas fa-chart-line", path: "/my-performance" },
  ];

  const menuItems = userRole === "HR" || userRole === "MANAGER" ? hrMenuItems : employeeMenuItems;

  const handleMouseEnter = (e, itemName) => {
    if (!isCollapsed || isTinyScreen) return; // نمنع الـ Flyout في الشاشات الصغيرة
    clearTimeout(flyoutTimeout.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setFlyoutPos({ top: rect.top, visible: true, item: itemName });
  };

  const handleMouseLeave = () => {
    flyoutTimeout.current = setTimeout(() => {
      setFlyoutPos({ top: 0, visible: false, item: null });
    }, 100);
  };

const getActiveStyle = (isActive) => ({
  backgroundColor: isActive ? 'var(--bg-deep)' : 'transparent',
  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
});

  return (
    <motion.aside
      // إذا كانت الشاشة صغيرة جداً، العرض 100%. وإلا يتبع حالة الـ Collapse
      animate={{ width: isTinyScreen ? "100%" : (isCollapsed ? 80 : 175) }}
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        // نغير اتجاه الحدود بناءً على مكان السايد بار
        borderRight: isTinyScreen ? 'none' : '1px solid var(--border-main)',
        borderBottom: isTinyScreen ? '1px solid var(--border-main)' : 'none'
      }}
      className={`z-50 transition-colors duration-300 flex flex-col border-gray-900 
        ${isTinyScreen 
          ? "relative h-auto pb-4" // في الشاشة الصغيرة يكون جزء من الصفحة (يظهر في الأعلى)
          : "fixed h-screen top-0 overflow-x-auto scrollbar-hide" // الوضع العادي الثابت
        }`}
    >
      {/* Logo */}
      <NavLink
        to={userRole === "HR" || userRole === "MANAGER" ? "/dashboard" : "/my-dashboard"}
        className={`h-20 flex items-center px-6 mb-4 ${isCollapsed && !isTinyScreen ? "justify-center" : "justify-start gap-3"}`}
      >
        <div className="w-9 flex items-center justify-center">
          <img src={icon} alt="Logo" className="w-8 h-8" />
        </div>
        {(!isCollapsed || isTinyScreen) && (
          <span className="text-xl font-bold italic" style={{ color: 'var(--text-main)' }}>
            Staf<span className="text-blue-500">fly</span>
          </span>
        )}
      </NavLink>

      {/* Menu */}
      <div className="flex-1 px-3 space-y-2 overflow-hidden">
        {menuItems.map((item) => {
          const isParentActive = item.children && item.children.some(child => location.pathname.startsWith(child.path));

          return (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={(e) => handleMouseEnter(e, item.name)}
              onMouseLeave={handleMouseLeave}
            >
              {item.children ? (
                <button
                  onClick={() => (!isCollapsed || isTinyScreen) && setOpenDropdown(openDropdown === item.name ? null : item.name)}
                  style={{ 
                    backgroundColor: isParentActive ? 'var(--bg-deep)' : 'transparent',
                    color: isParentActive ? 'var(--text-main)' : 'var(--text-muted)'
                  }}
                  className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all hover:bg-[var(--hover-bg)] hover:text-[var(--text-main)] ${isCollapsed && !isTinyScreen ? "justify-center" : ""}`}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  {(!isCollapsed || isTinyScreen) && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left">{item.name}</span>
                      <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${openDropdown === item.name ? "rotate-180" : ""}`} />
                    </>
                  )}
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  style={({ isActive }) => getActiveStyle(isActive)}
                  className={`flex items-center gap-4 p-3.5 rounded-xl transition-all relative hover:bg-[var(--hover-bg)] hover:text-[var(--text-main)] ${isCollapsed && !isTinyScreen ? "justify-center" : ""}`}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  {(!isCollapsed || isTinyScreen) && (
                    <span className="text-sm font-medium flex-1">{item.name}</span>
                  )}
                  {(!isCollapsed || isTinyScreen) && item.badge && (
                    <span className="bg-blue-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )}

              {/* Dropdown for non-collapsed or tiny state */}
              {item.children && (!isCollapsed || isTinyScreen) && (
                <AnimatePresence>
                  {openDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 space-y-1 border-l pl-3" style={{ borderColor: 'var(--border-main)' }}>
                        {item.children.map((child, index) => (
                          <motion.div
                            key={child.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.07, duration: 0.2 }}
                          >
                            <NavLink
                              to={child.path}
                              style={({ isActive }) => getActiveStyle(isActive)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-[var(--hover-bg)]"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {child.name}
                            </NavLink>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>

      {/* Flyout (معطل في حالة الشاشة الصغيرة جداً) */}
      {isCollapsed && !isTinyScreen && flyoutPos.visible && (() => {
        const item = menuItems.find(i => i.name === flyoutPos.item);
        if (!item) return null;
        return (
          <div
            className="fixed z-[999] min-w-[160px]"
            style={{ top: flyoutPos.top, left: "82px" }}
            onMouseEnter={() => {
              clearTimeout(flyoutTimeout.current);
              setFlyoutPos(prev => ({ ...prev, visible: true }));
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              style={{ backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-main)', borderBottom: '1px solid var(--border-main)' }}
              className="absolute -left-1.5 top-4 w-3 h-3 rotate-45" 
            />
            <div 
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}
              className="border rounded-xl overflow-hidden shadow-xl"
            >
              <div className="px-4 py-2.5 border-b" style={{ borderColor: 'var(--border-main)' }}>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-main)' }}>{item.name}</span>
              </div>
              {/* ... باقي كود الـ Flyout ... */}
              {item.children ? (
                item.children.map((child) => (
                  <NavLink
                    key={child.name}
                    to={child.path}
                    onClick={() => setFlyoutPos({ top: 0, visible: false, item: null })}
                    style={({ isActive }) => getActiveStyle(isActive)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all hover:bg-[var(--hover-bg)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                    {child.name}
                  </NavLink>
                ))
              ) : (
                <NavLink
                  to={item.path}
                  onClick={() => setFlyoutPos({ top: 0, visible: false, item: null })}
                  style={({ isActive }) => getActiveStyle(isActive)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all hover:bg-[var(--hover-bg)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                  {item.name}
                </NavLink>
              )}
            </div>
          </div>
        );
      })()}
    </motion.aside>
  );
};

export default Sidebar;