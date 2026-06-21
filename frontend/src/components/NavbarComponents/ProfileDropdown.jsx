

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../../store/HrSlices/auth/loginSlice";
import { fetchMyHRProfile } from "../../store/HrSlices/navbar/hrProfileSlice";

import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

const ProfileDropdown = ({ isOpen, setIsOpen, profileRef }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: authUser } = useSelector((state) => state.auth);

  const { data: hrProfile, loading } = useSelector(
    (state) => state.hrProfile
  );

  useEffect(() => {
    if (authUser && !hrProfile) {
      dispatch(fetchMyHRProfile());
    }
  }, [dispatch, authUser, hrProfile]);

  const displayUser = hrProfile || authUser;

  const fullName = displayUser?.general
    ? `${displayUser.general.firstName} ${displayUser.general.lastName}`
    : displayUser?.name || "Loading...";

  const avatar =
    displayUser?.general?.avatar ||
    displayUser?.avatar ||
    displayUser?.image ||
    defaultAvatar;

  const role =
    displayUser?.general?.role ||
    displayUser?.role;

  const { user } = useSelector((state) => state.auth);
  const userRole = user?.general?.role; 

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
    setIsOpen(false);
  };

  const goToProfile = () => {
    navigate("/settings", {
      state: {
        tab: "profile",
      },
    });
    setIsOpen(false);
  };

  return (
    <div className="relative ml-2" ref={profileRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-main)' 
        }}
        className="flex items-center gap-3 p-1.5 pr-4 rounded-full border transition-all group backdrop-blur-sm"
      >
        <div 
          style={{ backgroundColor: 'var(--bg-deep)', borderColor: 'rgba(59, 130, 246, 0.3)' }}
          className="w-9 h-9 rounded-full overflow-hidden border"
        >
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <i style={{ color: 'var(--text-muted)' }} className="fas fa-spinner fa-spin text-xs"></i>
            </div>
          ) : (
            <img
              src={avatar}
              className="w-full h-full object-cover"
              alt={fullName}
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
          )}
        </div>

        <div className="text-left hidden sm:block">
          <p 
            style={{ color: 'var(--text-main)' }} 
            className="text-sm font-semibold group-hover:text-blue-400 transition-colors"
          >
            {fullName}
          </p>

          {role && (
            <p style={{ color: 'var(--text-muted)' }} className="text-[10px]">
              {role}
            </p>
          )}
        </div>

        <i
          style={{ color: 'var(--text-muted)' }}
          className={`fas fa-chevron-down text-[10px] transition-transform duration-300 ${
            isOpen ? "rotate-180 !text-blue-400" : ""
          }`}
        ></i>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-main)' 
            }}
            className="absolute right-0 mt-4 w-60 border rounded-[1.5rem] shadow-2xl py-2 z-50 backdrop-blur-xl overflow-hidden"
          >
            {/* Show My Profile */}
            {(userRole === "HR" || userRole === "MANAGER") && (
              <button
                onClick={goToProfile}
                style={{ color: 'var(--text-main)' }}
                className="w-full text-left px-6 py-4 text-sm hover:bg-blue-600/10 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <i className="far fa-user text-blue-400"></i>
                  <span>Show My Profile</span>
                </div>
                <i style={{ color: 'var(--text-muted)' }} className="fas fa-chevron-right text-xs"></i>
              </button>
            )}

            {/* Divider */}
            <div 
              style={{ borderColor: 'var(--border-main)' }} 
              className="border-t opacity-50 my-1 mx-2"
            ></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-6 py-4 text-sm text-red-500 hover:bg-red-500/10 flex items-center justify-between transition-all font-bold"
            >
              <div className="flex items-center gap-3">
                <i className="fas fa-sign-out-alt"></i>
                <span>Log out</span>
              </div>
              <i className="fas fa-chevron-right text-xs opacity-70"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;