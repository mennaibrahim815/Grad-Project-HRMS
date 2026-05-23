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

  // ✅ الداتا الحالية
  const displayUser = hrProfile || authUser;

  // ✅ تجهيز الاسم والصورة والروول
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

  // ✅ Logout
  const handleLogout = async () => {
    await dispatch(logoutUser());

    navigate("/login");

    setIsOpen(false);
  };

  // ✅ فتح صفحة الاعدادات على تاب الاكونت
  const goToProfile = () => {
    navigate("/settings", {
      state: {
        tab: "account",
      },
    });

    setIsOpen(false);
  };

  return (
    <div className="relative ml-2" ref={profileRef}>
      {/* زر البروفايل */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-[#142129]/80 hover:bg-[#1c2e38] p-1.5 pr-4 rounded-full border border-gray-800 transition-all group"
      >
        {/* الصورة */}
        <div className="w-9 h-9 rounded-full overflow-hidden border border-blue-500/30 bg-gray-800">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <i className="fas fa-spinner fa-spin text-gray-500 text-xs"></i>
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

        {/* الاسم */}
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
            {fullName}
          </p>

          {role && (
            <p className="text-[10px] text-gray-500">
              {role}
            </p>
          )}
        </div>

        {/* السهم */}
        <i
          className={`fas fa-chevron-down text-[10px] text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-blue-400" : ""
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
            className="absolute right-0 mt-4 w-60 bg-[#142129] border border-gray-800 rounded-[1.5rem] shadow-2xl py-2 z-50 backdrop-blur-xl overflow-hidden"
          >
            {/* Show My Profile */}
            <button
              onClick={goToProfile}
              className="w-full text-left px-6 py-4 text-sm text-gray-300 hover:bg-blue-600/10 hover:text-white flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <i className="far fa-user text-blue-400"></i>

                <span>Show My Profile</span>
              </div>

              <i className="fas fa-chevron-right text-xs text-gray-500"></i>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-800/50 my-1 mx-2"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-6 py-4 text-sm text-red-400 hover:bg-red-500/10 flex items-center justify-between transition-all font-bold"
            >
              <div className="flex items-center gap-3">
                <i className="fas fa-sign-out-alt"></i>

                <span>Log out</span>
              </div>

              <i className="fas fa-chevron-right text-xs text-red-300"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;