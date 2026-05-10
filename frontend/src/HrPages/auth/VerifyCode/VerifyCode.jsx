import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import {
  verifyOtpCode,
  resetVerifyState,
  resendCode,
  clearVerifyError,
} from "../../../store/HrSlices/auth/verifyCodeSlice";
import icon from "../../../assets/icons/Icon.svg";
import loginSide from "../../../assets/loginImg/loginSide.avif";

const VerifyCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = location.state?.email;
  const { loading, error } = useSelector((state) => state.verifyCode);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(32);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  useEffect(() => {
    dispatch(resetVerifyState());
    let interval = setInterval(
      () => setTimer((prev) => (prev > 0 ? prev - 1 : 0)),
      1000,
    );
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    // 💡 تصفير الإيرور بمجرد ما تبدأي تكتبي حرف جديد
    if (error) dispatch(clearVerifyError());

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0)
      inputRefs.current[index - 1].focus();
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) return;

    dispatch(verifyOtpCode({ email, code: fullCode })).then((res) => {
      if (!res.error) {
        // 💡 النجاح: تحويل لصفحة Reset Password وتمرير الإيميل والكود
        setIsRedirecting(true);
        setTimeout(() => {
          navigate("/reset-password", { state: { email, code: fullCode } });
        }, 1500);
      } else {
        inputRefs.current[0].focus();
      }
    });
  };

  const handleResend = () => {
    if (timer > 0) return;
    dispatch(resendCode(email)).then((res) => {
      if (!res.error) {
        setTimer(60);
        alert("Verification code has been resent!");
      }
    });
  };

  return (
    <>
      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-[#0b141a] flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-6"
            />
            <h2 className="text-white text-xl font-bold tracking-widest uppercase text-center">
              Verifying Code...
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex bg-[#0f172a] text-white font-sans overflow-hidden relative">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 overflow-y-auto"
        >
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-16">
              <div className="bg-blue-600/10 w-16 h-16 rounded-full flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <img src={icon} alt="Logo" className="w-10 h-10" />
              </div>
            </div>

            <Link
              to="/forgot-password"
              size="sm"
              className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6 group transition-all w-fit"
            >
              <i className="fas fa-chevron-left text-xs"></i> Back to previous
            </Link>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-2 tracking-tight">
                Verify Code
              </h1>
              <p className="text-gray-400 text-sm">
                Enter the 6-digit code sent to{" "}
                <span className="text-blue-500 font-bold">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-between gap-2">
                {code.map((num, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={num}
                    onChange={(e) => handleChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className={`w-12 h-14 bg-[#1e293b] text-center text-xl font-bold rounded-xl border outline-none transition-all ${error ? "border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "border-transparent focus:border-blue-500 text-white"}`}
                  />
                ))}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl text-center font-bold"
                  >
                    <i className="fas fa-exclamation-circle mr-2"></i> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 italic">
                  {timer > 0 ? `Resend code in ${timer}s` : "Ready to resend"}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 0}
                  className={`underline font-bold transition-colors ${timer > 0 ? "text-gray-700 cursor-not-allowed" : "text-blue-500 hover:text-white"}`}
                >
                  Resend now
                </button>
              </div>

              <motion.button
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.99 } : {}}
                type="submit"
                disabled={loading}
                className={`w-full p-4 rounded-xl font-bold transition-all flex justify-center items-center h-12 shadow-lg ${loading ? "bg-[#2d3a4f] cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"}`}
              >
                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  "Verify & Sign in"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex w-1/2 p-4"
        >
          <div
            className="w-full h-full rounded-[2rem] bg-cover bg-center flex flex-col justify-end p-12 relative overflow-hidden shadow-2xl"
            style={{
              backgroundImage: `linear-gradient(to bottom, transparent, #000000dd), url(${loginSide})`,
            }}
          >
            <h2 className="text-4xl font-bold mb-4 z-10 leading-tight">
              Secure & Fast Authentication
            </h2>
            <p className="text-gray-300 z-10 max-w-sm mb-6 font-light">
              We protect your account using end-to-end encrypted verification
              codes sent directly to your professional email.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default VerifyCode;
