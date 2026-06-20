// // import { useState, useEffect, useRef } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate } from "react-router-dom";

// // import { toggleSidebar } from "../../store/HrSlices/navbar/sideMenuSlice";

// // // components
// // import NavSearchTrigger from "../NavbarComponents/NavSearchTrigger";
// // import NotificationDropdown from "../NavbarComponents/NotificationDropdown";
// // import ProfileDropdown from "../NavbarComponents/ProfileDropdown";
// // import SearchModal from "../NavbarComponents/SearchModal";
// // import ThemeToggle from "../NavbarComponents/ThemeToggle";

// // const Navbar = () => {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const isCollapsed = useSelector(
// //     (state) => state.ui.isSidebarCollapsed
// //   );

// //   const [showProfileMenu, setShowProfileMenu] = useState(false);
// //   const [showNotifMenu, setShowNotifMenu] = useState(false);
// //   const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

// //   const profileRef = useRef(null);
// //   const notifRef = useRef(null);
// //   const searchRef = useRef(null);

// //   // Close dropdowns on outside click
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (
// //         profileRef.current &&
// //         !profileRef.current.contains(event.target)
// //       ) {
// //         setShowProfileMenu(false);
// //       }

// //       if (
// //         notifRef.current &&
// //         !notifRef.current.contains(event.target)
// //       ) {
// //         setShowNotifMenu(false);
// //       }

// //       if (
// //         isSearchModalOpen &&
// //         searchRef.current &&
// //         !searchRef.current.contains(event.target)
// //       ) {
// //         setIsSearchModalOpen(false);
// //       }
// //     };

// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () =>
// //       document.removeEventListener("mousedown", handleClickOutside);
// //   }, [isSearchModalOpen]);



// // const { user } = useSelector((state) => state.auth);
// // const userRole = user?.general?.role;  

// // return (
// //     <>
// //       {/* NAVBAR */}
// //       {/* Navbar */}
// //       <nav
// //         style={{
// //           left: isCollapsed ? "70px" : "175px",
// //         }}
// //         className="fixed top-0 right-0 h-20 backdrop-blur-sm flex items-center justify-between px-8 z-40  rounded-xl transition-all duration-300"
// //       >
// //         {/* LEFT SIDE */}
// //         <div className="flex items-center gap-5">
// //           {/* Sidebar toggle */}
// //           <button
// //             onClick={() => dispatch(toggleSidebar())}
// //             className="text-gray-400 hover:text-white transition-all transform hover:scale-110"
// //             title="Toggle Sidebar"
// //           >
// //             <i className="fas fa-bars text-xl"></i>
// //           </button>

// //           {/* Search */}
// //           <NavSearchTrigger
// //             onClick={() => setIsSearchModalOpen(true)}
// //           />
// //         </div>

// //         {/* RIGHT SIDE */}
// //         <div className="flex items-center gap-4">

// //           {/* Theme Toggle */}
// //           <ThemeToggle />
// // {(userRole === "HR" || userRole === "MANAGER") && (
// //   <button
// //     onClick={() => navigate("/settings")}
// //     className="w-10 h-10 bg-[#142129] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all"
// //     title="Settings"
// //   >
// //     <i className="fas fa-cog"></i>
// //   </button>
// // )}

// //           {/* Notifications */}
// //           <NotificationDropdown
// //             isOpen={showNotifMenu}
// //             setIsOpen={setShowNotifMenu}
// //             notifRef={notifRef}
// //           />

// //           {/* Profile */}
// //           <ProfileDropdown
// //             isOpen={showProfileMenu}
// //             setIsOpen={setShowProfileMenu}
// //             profileRef={profileRef}
// //           />
// //         </div>
// //       </nav>

// //       {/* Search Modal */}
// //       <SearchModal
// //         isOpen={isSearchModalOpen}
// //         onClose={() => setIsSearchModalOpen(false)}
// //         searchRef={searchRef}
// //       />
// //     </>
// //   );
// // };

// // export default Navbar;



// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// import { toggleSidebar } from "../../store/HrSlices/navbar/sideMenuSlice";

// // components
// import NavSearchTrigger from "../NavbarComponents/NavSearchTrigger";
// import NotificationDropdown from "../NavbarComponents/NotificationDropdown";
// import ProfileDropdown from "../NavbarComponents/ProfileDropdown";
// import SearchModal from "../NavbarComponents/SearchModal";
// import ThemeToggle from "../NavbarComponents/ThemeToggle";

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const isCollapsed = useSelector(
//     (state) => state.ui.isSidebarCollapsed
//   );

//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [showNotifMenu, setShowNotifMenu] = useState(false);
//   const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

//   const profileRef = useRef(null);
//   const notifRef = useRef(null);
//   const searchRef = useRef(null);

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(event.target)
//       ) {
//         setShowProfileMenu(false);
//       }

//       if (
//         notifRef.current &&
//         !notifRef.current.contains(event.target)
//       ) {
//         setShowNotifMenu(false);
//       }

//       if (
//         isSearchModalOpen &&
//         searchRef.current &&
//         !searchRef.current.contains(event.target)
//       ) {
//         setIsSearchModalOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, [isSearchModalOpen]);

//   const { user } = useSelector((state) => state.auth);
//   const userRole = user?.general?.role;  

//   return (
//     <>
//       {/* NAVBAR */}
//       <nav
//         style={{
//           left: isCollapsed ? "70px" : "175px",
//           // backgroundColor: 'var(--bg-card)',
//           // borderBottom: '1px solid var(--border-main)'
//         }}
//         className="fixed top-0 right-0 h-20 backdrop-blur-md flex items-center justify-between px-8 z-40 transition-all duration-300"
//       >
//         {/* LEFT SIDE */}
//         <div className="flex items-center gap-5">
//           {/* Sidebar toggle */}
//           <button
//             onClick={() => dispatch(toggleSidebar())}
//             style={{ color: 'var(--text-muted)',
//              }}
//             className="hover:opacity-80 transition-all transform hover:scale-110"
//             title="Toggle Sidebar"
//           >
//             <i className="fas fa-bars text-xl"></i>
//           </button>

//           {/* Search */}
//           <NavSearchTrigger
//             onClick={() => setIsSearchModalOpen(true)}
//           />
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="flex items-center gap-4">

//           {/* Theme Toggle */}
//           <ThemeToggle />

//           {(userRole === "HR" || userRole === "MANAGER") && (
//             <button
//               onClick={() => navigate("/settings")}
//               style={{ 
//                 backgroundColor: 'var(--card-border)', 
//                 color: 'var(--text-muted)' 
//               }}
//               className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-all"
//               title="Settings"
//             >
//               <i className="fas fa-cog"></i>
//             </button>
//           )}

//           {/* Notifications */}
//           <NotificationDropdown
//             isOpen={showNotifMenu}
//             setIsOpen={setShowNotifMenu}
//             notifRef={notifRef}
            
            
//           />

//           {/* Profile */}
//           <ProfileDropdown
//             isOpen={showProfileMenu}
//             setIsOpen={setShowProfileMenu}
//             profileRef={profileRef}
//           />
//         </div>
//       </nav>

//       {/* Search Modal */}
//       <SearchModal
//         isOpen={isSearchModalOpen}
//         onClose={() => setIsSearchModalOpen(false)}
//         searchRef={searchRef}
//       />
//     </>
//   );
// };

// export default Navbar;


import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { toggleSidebar } from "../../store/HrSlices/navbar/sideMenuSlice";

// components
import NavSearchTrigger from "../NavbarComponents/NavSearchTrigger";
import NotificationDropdown from "../NavbarComponents/NotificationDropdown";
import ProfileDropdown from "../NavbarComponents/ProfileDropdown";
import SearchModal from "../NavbarComponents/SearchModal";
import ThemeToggle from "../NavbarComponents/ThemeToggle";

// نمرر الـ isTinyScreen كـ prop
const Navbar = ({ isTinyScreen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isCollapsed = useSelector(
    (state) => state.ui.isSidebarCollapsed
  );

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setShowNotifMenu(false);
      }

      if (
        isSearchModalOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchModalOpen]);

  const { user } = useSelector((state) => state.auth);
  const userRole = user?.general?.role;  

  return (
    <>
      {/* Navbar */}
      <nav
        style={{
          // التحديث: إذا كانت شاشة صغيرة جداً، نلغي الإزاحة والوضع الثابت
          left: isTinyScreen ? "0" : (isCollapsed ? "70px" : "175px"),
          position: isTinyScreen ? "relative" : "fixed",
          width: isTinyScreen ? "100%" : "auto"
        }}
        className={`top-0 right-0 h-20 backdrop-blur-md flex items-center justify-between z-40 transition-all duration-300 ${isTinyScreen ? 'px-4' : 'px-8'}`}
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-5">
          {/* Sidebar toggle - يختفي في الشاشة الصغيرة جداً لأن المنيو أصبح مفروداً فوق */}
          {!isTinyScreen && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              style={{ color: 'var(--text-muted)' }}
              className="hover:opacity-80 transition-all transform hover:scale-110"
              title="Toggle Sidebar"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          )}

          {/* Search */}
          <NavSearchTrigger
            onClick={() => setIsSearchModalOpen(true)}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <ThemeToggle />

          {(userRole === "HR" || userRole === "MANAGER") && (
            <button
              onClick={() => navigate("/settings")}
              style={{ 
                backgroundColor: 'var(--card-border)', 
                color: 'var(--text-muted)' 
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-all"
              title="Settings"
            >
              <i className="fas fa-cog"></i>
            </button>
          )}

          {/* Notifications */}
          <NotificationDropdown
            isOpen={showNotifMenu}
            setIsOpen={setShowNotifMenu}
            notifRef={notifRef}
          />

          {/* Profile */}
          <ProfileDropdown
            isOpen={showProfileMenu}
            setIsOpen={setShowProfileMenu}
            profileRef={profileRef}
          />
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchRef={searchRef}
      />
    </>
  );
};

export default Navbar;