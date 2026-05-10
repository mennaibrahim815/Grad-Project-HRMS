import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { toggleSidebar } from "../../store/HrSlices/navbar/sideMenuSlice";

// components
import NavSearchTrigger from "../NavbarComponents/NavSearchTrigger";
import NotificationDropdown from "../NavbarComponents/NotificationDropdown";
import ProfileDropdown from "../NavbarComponents/ProfileDropdown";
import SearchModal from "../NavbarComponents/SearchModal";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isCollapsed = useSelector((state) => state.ui.isSidebarCollapsed);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }

      if (notifRef.current && !notifRef.current.contains(event.target)) {
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchModalOpen]);

  return (
    <>
      {/* Navbar */}
      <nav
        style={{
          left: isCollapsed ? "70px" : "175px",
        }}
        className="fixed top-0 right-0 h-20 backdrop-blur-sm flex items-center justify-between px-8 z-40  rounded-xl transition-all duration-300"
      >
        {/* --- الجانب الأيسر: زر المينيو والبحث --- */}
        <div className="flex items-center gap-5">
          {/* زر فتح/إغلاق السايد بار */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="text-gray-400 hover:text-white transition-all transform hover:scale-110"
            title="Toggle Sidebar"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>

          <NavSearchTrigger onClick={() => setIsSearchModalOpen(true)} />
        </div>

        {/* --- الجانب الأيمن: الإعدادات والإشعارات والبروفايل --- */}
        <div className="flex items-center gap-4">
          {/* زر الإعدادات  */}
          <button
            className="w-10 h-10 bg-[#142129] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all"
            title="Settings"
          >
            <i className="fas fa-cog" onClick={() => navigate("/settings")}></i>
          </button>

          {/* قائمة الإشعارات */}
          <NotificationDropdown
            isOpen={showNotifMenu}
            setIsOpen={setShowNotifMenu}
            notifRef={notifRef}
          />

          {/* قائمة البروفايل */}
          <ProfileDropdown
            isOpen={showProfileMenu}
            setIsOpen={setShowProfileMenu}
            profileRef={profileRef}
          />
        </div>
      </nav>

      {/* مودال البحث (Portal) */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchRef={searchRef}
      />
    </>
  );
};

export default Navbar;
