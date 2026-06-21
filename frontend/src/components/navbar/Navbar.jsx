
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { toggleSidebar } from "../../store/HrSlices/navbar/sideMenuSlice";

import NavSearchTrigger from "../NavbarComponents/NavSearchTrigger";
import NotificationDropdown from "../NavbarComponents/NotificationDropdown";
import ProfileDropdown from "../NavbarComponents/ProfileDropdown";
import SearchModal from "../NavbarComponents/SearchModal";
import ThemeToggle from "../NavbarComponents/ThemeToggle";

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
      <nav
        style={{
          left: isTinyScreen ? "0" : (isCollapsed ? "70px" : "175px"),
          position: isTinyScreen ? "relative" : "fixed",
          width: isTinyScreen ? "100%" : "auto"
        }}
        className={`top-0 right-0 h-20 backdrop-blur-md flex items-center justify-between z-40 transition-all duration-300 ${isTinyScreen ? 'px-4' : 'px-8'}`}
      >
        <div className="flex items-center gap-5">
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

          <NavSearchTrigger
            onClick={() => setIsSearchModalOpen(true)}
          />
        </div>

        <div className="flex items-center gap-4">

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

          <NotificationDropdown
            isOpen={showNotifMenu}
            setIsOpen={setShowNotifMenu}
            notifRef={notifRef}
          />

          <ProfileDropdown
            isOpen={showProfileMenu}
            setIsOpen={setShowProfileMenu}
            profileRef={profileRef}
          />
        </div>
      </nav>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchRef={searchRef}
      />
    </>
  );
};

export default Navbar;