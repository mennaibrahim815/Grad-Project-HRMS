
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import {
  requestResetCode,
  resetForgotState,
  clearForgotError,
} from "../../../store/HrSlices/auth/forgotPasswordSlice";

import icon from "../../../assets/icons/Icon.svg";
import loginSide from "../../../assets/loginImg/loginSide.avif";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // سحب الحالة من الريدوكس
  const { loading, error } = useSelector((state) => state.forgotPassword);

  const [email, setEmail] = useState("");

  // تصفير الحالة عند الدخول أو الخروج من الصفحة
  useEffect(() => {
    dispatch(resetForgotState());
  }, [dispatch]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return;

    // 💡 إرسال الطلب فوراً عند الضغط
    dispatch(requestResetCode(email)).then((res) => {
      if (!res.error) {
        // لو نجح، حول لصفحة التأكيد ومرر الإيميل في الـ state
        navigate("/verify", { state: { email } });
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white font-sans overflow-hidden">
      {/* الجانب الأيسر - الفورم */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 overflow-y-auto"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="flex items-center gap-2 mb-16"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center">
              <img src={icon} alt="Staffly Logo" className="" />
            </div>
            <span className="text-xl font-bold tracking-tight italic">
              Staf<span className="text-blue-500 cursor-pointer">fly</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/login"
              className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6 transition-all group w-fit"
            >
              <i className="fas fa-chevron-left text-xs group-hover:-translate-x-1 transition-transform"></i>
              Back to login
            </Link>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold mb-2 tracking-tight"
          >
            Forgot password
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 text-sm mb-8 leading-relaxed"
          >
            Enter your email to receive a 6-digit verification code.
          </motion.p>

          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 ml-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) dispatch(clearForgotError()); // مسح الخطأ بمجرد البدء في الكتابة
                }}
                placeholder="Enter your registered email"
                className={`w-full bg-[#1e293b] p-3.5 rounded-xl border outline-none transition-all ${
                  error
                    ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.05)]"
                    : "border-transparent focus:border-blue-500"
                }`}
                required
              />

              {/* 💡 عرض الخطأ القادم من الباك إيند (User not found) */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl text-center font-bold mt-4"
                  >
                    <i className="fas fa-exclamation-circle mr-2"></i> {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              type="submit"
              disabled={loading}
              className={`w-full p-4 rounded-xl font-bold transition-all flex justify-center items-center h-12 shadow-lg ${
                loading
                  ? "bg-[#2d3a4f] cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer"
              }`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Send Reset Code"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* الجانب الأيمن */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 p-4"
      >
        <div
          className="w-full h-full rounded-[2.5rem] bg-cover bg-center flex flex-col justify-end p-12 relative overflow-hidden shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to bottom, transparent, #000000dd), url(${loginSide})`,
          }}
        >
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-4xl font-bold mb-4 z-10 leading-tight"
          >
            Identity Verification
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-300 z-10 max-w-sm mb-6 font-light"
          >
            Your security is our priority. We'll send a code to your email to
            verify your identity.
          </motion.p>
          <div className="flex gap-1.5 z-10">
            <div className="h-1.5 w-2 bg-gray-700 rounded-full"></div>
            <motion.div
              animate={{ width: [8, 24, 8] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            ></motion.div>
            <div className="h-1.5 w-2 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
