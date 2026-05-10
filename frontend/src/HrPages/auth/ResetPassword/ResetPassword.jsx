import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { resetPassword, resetResetState } from "../../../store/HrSlices/auth/resetPasswordSlice";

import icon from "../../../assets/icons/Icon.svg";
import loginSide from "../../../assets/loginImg/loginSide.avif";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = location.state?.email || "user@staffly.com";
  const { loading, error, success } = useSelector((state) => state.resetPassword);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [matchError, setMatchError] = useState("");

  useEffect(() => {
    return () => dispatch(resetResetState());
  }, [dispatch]);

  // 💡 بمجرد ما المستخدم يبدأ يعدل، بنخفي رسالة الخطأ عشان يحاول تاني
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (matchError) setMatchError("");
  }, [newPassword, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. التحقق من التطابق عند الضغط فقط
    if (newPassword !== confirmPassword) {
      setMatchError("Passwords do not match. Please check again.");
      return; // وقف الإرسال
    }

    // 2. التحقق من الطول
    if (newPassword.length < 8) {
      setMatchError("Password must be at least 8 characters long.");
      return;
    }

    // 3. لو كله تمام، ابعت للسيرفر
    dispatch(resetPassword({ email, newPassword }));
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white font-sans overflow-hidden relative">
      
      <motion.div 
        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 overflow-y-auto"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-16">
            <img src={icon} alt="Logo" className="w-12 h-12" />
            <span className="text-xl font-bold italic">Staf<span className="text-blue-500">fly</span></span>
          </div>

          <Link to="/login" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6 group transition-all w-fit">
            <i className="fas fa-chevron-left text-xs"></i> Back to login
          </Link>

          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl font-bold mb-2 tracking-tight">set a new password</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enter a new password for <span className="text-blue-500 font-bold">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">New Password</label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create new password"
                  className={`w-full bg-[#1e293b] p-4 rounded-xl border outline-none transition-all ${matchError || error ? 'border-red-500/50' : 'border-transparent focus:border-blue-500'}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  <i className={`far ${showPass ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full bg-[#1e293b] p-4 rounded-xl border outline-none transition-all ${matchError ? 'border-red-500/50 focus:border-red-500' : 'border-transparent focus:border-blue-500'}`}
                />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  <i className={`far ${showConfirmPass ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              
              {/* إظهار خطأ عدم التطابق أو خطأ الطول */}
              <AnimatePresence>
                {matchError && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[10px] font-bold italic ml-1 uppercase tracking-tighter">
                    <i className="fas fa-times-circle mr-1"></i> {matchError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* خطأ السيرفر الحقيقي */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl text-center font-bold">
                   <i className="fas fa-exclamation-circle mr-2"></i> {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 💡 الزرار: يتفعل بمجرد وجود نص في الخانتين */}
            <motion.button 
              whileHover={newPassword && confirmPassword && !loading ? { scale: 1.01 } : {}}
              whileTap={newPassword && confirmPassword && !loading ? { scale: 0.99 } : {}}
              type="submit" 
              disabled={loading || !newPassword || !confirmPassword}
              className={`w-full p-4 rounded-xl font-bold transition-all shadow-lg ${
                newPassword && confirmPassword && !loading 
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer" 
                : "bg-[#2d3a4f] text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
              ) : "Update Password"}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* الجانب الأيمن */}
      <div className="hidden lg:flex w-1/2 p-4">
        <div className="w-full h-full rounded-[2.5rem] bg-cover bg-center flex flex-col justify-end p-12 relative overflow-hidden shadow-2xl" style={{ backgroundImage: `linear-gradient(to bottom, transparent, #000000dd), url(${loginSide})` }}>
           <h2 className="text-4xl font-bold mb-4 z-10 leading-tight">Secure Your Account</h2>
           <p className="text-gray-300 z-10 max-w-sm mb-6 font-light">Your new password should be unique and strong to protect your sensitive data.</p>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-[#142129] border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                <i className="fas fa-check-circle shadow-[0_0_20px_rgba(34,197,94,0.3)]"></i>
              </div>
              <h3 className="text-2xl font-black mb-3 text-white">Successful</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">Your password has been changed. You can now use it to login.</p>
              <button 
                onClick={() => navigate("/login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95"
              >
                Back to Login
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResetPassword;