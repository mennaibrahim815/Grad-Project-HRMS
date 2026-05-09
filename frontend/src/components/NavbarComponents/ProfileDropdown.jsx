import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// import { logout } from "../../store/HrSlices/auth/loginSlice";
import { fetchMyHRProfile } from "../../store/HrSlices/navbar/hrProfileSlice";

import defaultAvatar from "../../assets/avatars/avatar-default-symbolic-svgrepo-com.svg";

const ProfileDropdown = ({ isOpen, setIsOpen, profileRef }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: authUser } = useSelector((state) => state.auth);
  const { data: hrProfile, loading } = useSelector((state) => state.hrProfile);

  useEffect(() => {
    if (authUser && !hrProfile) {
      dispatch(fetchMyHRProfile());
    }
  }, [dispatch, authUser, hrProfile]);

  const displayUser = hrProfile || authUser;

  const handleLogout = () => {
    // dispatch(logout());
    navigate("/login");
    setIsOpen(false);
  };

  // const goToProfile = () => {
  //   navigate("/profile");
  //   setIsOpen(false);
  // };
  const goToProfile = () => {
    // بنقول له روح لصفحة السيتنج وخد معاك معلومة إننا عاوزين نفتح تاب الأكونت
    navigate("/settings", { state: { activeTab: "account" } });
    setIsOpen(false);
  };

  return (
    <div className="relative ml-2" ref={profileRef}>
      {/* زر البروفايل */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-[#142129]/80 hover:bg-[#1c2e38] p-1.5 pr-4 rounded-full border border-gray-800 transition-all group"
      >
        {/* صورة المستخدم */}
        <div className="w-9 h-9 rounded-full overflow-hidden border border-blue-500/30 bg-gray-800">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <i className="fas fa-spinner fa-spin text-gray-500 text-xs"></i>
            </div>
          ) : (
            <img
              src={displayUser?.image || displayUser?.avatar || defaultAvatar}
              //
              className="w-full h-full object-cover"
              alt={displayUser?.name || "User"}
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
          )}
        </div>

        {/* اسم المستخدم */}
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
            {displayUser?.name || "Loading..."}
          </p>
          {displayUser?.role && (
            <p className="text-[10px] text-gray-500">{displayUser.role}</p>
          )}
        </div>

        {/* أيقونة السهم */}
        <i
          className={`fas fa-chevron-down text-[10px] text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-blue-400" : ""
          }`}
        ></i>
      </button>

      {/* القائمة المنسدلة */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-4 w-56 bg-[#142129] border border-gray-800 rounded-[1.5rem] shadow-2xl py-2 z-50 backdrop-blur-xl overflow-hidden"
          >
            {/* معلومات المستخدم */}
            {displayUser && (
              <div className="px-6 py-4 border-b border-gray-800/50">
                <p className="text-sm font-bold text-white truncate">
                  {displayUser.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {displayUser.email}
                </p>
              </div>
            )}

            {/* رابط البروفايل */}
            <button
              onClick={goToProfile}
              className="w-full text-left px-6 py-3.5 text-sm text-gray-300 hover:bg-blue-600/10 hover:text-white flex items-center gap-3 transition-all"
            >
              <i className="far fa-user text-blue-400"></i> Profile
            </button>

            {/* فاصل */}
            <div className="border-t border-gray-800/50 my-1 mx-2"></div>

            {/* زر تسجيل الخروج */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-6 py-3.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-all font-bold"
            >
              <i className="fas fa-sign-out-alt"></i> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
