import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../../../store/HrSlices/auth/loginSlice";
import icon from "../../../assets/icons/Icon.svg";
import loginSide from "../../../assets/loginImg/loginSide.avif";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const errorContains = (word) => {
    if (typeof error !== "string") return false;
    return error.toLowerCase().includes(word.toLowerCase());
  };

  const PasswordRules = /^.{8,}/
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Required"),
      password: Yup.string().min(8).matches(PasswordRules,{message:"password must be 8 characters at least"}).required("Required"),
    }),

    onSubmit: async (values) => {
      try {
        const user = await dispatch(loginUser(values)).unwrap();

        const userRole = user?.general?.role;

        setIsRedirecting(true);

        setTimeout(() => {
          if (userRole === "HR") {
            navigate("/dashboard");
          } else {
            navigate("/my-dashboard");
          }
        }, 1500);
      } catch (err) {
        console.log("Login failed:", err);
      }
    },
  });

  return (
    <>
      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ backgroundColor: 'var(--bg-main)' }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-6"
            />
            <h2 style={{ color: 'var(--text-main)' }} className="text-xl font-bold tracking-widest uppercase">
              Preparing Space...
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        style={{ backgroundColor: 'var(--bg-deep)', color: 'var(--text-main)' }} 
        className="min-h-screen flex font-sans overflow-hidden relative z-0"
      >
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[70%] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.05)_5%,transparent_70%)] blur-[100px] -z-10 pointer-events-none"></div>

        <div className="relative w-full z-10 flex">
          
          <Link
            to="/apply-job"
            style={{ borderColor: 'var(--border-main)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }}
            className="absolute top-8 left-6 flex items-center gap-2 px-4 py-2 rounded-xl border hover:opacity-80 text-sm font-medium transition-all"
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
              <i className="font-bold text-xl pb-1">←</i>
            </span>
            Go to Hiring
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 overflow-y-auto"
          >
            <div className="w-full max-w-md">
              <div className="flex justify-center mb-6">
                <div 
                  style={{ backgroundColor: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.2)' }}
                  className="w-16 h-16 rounded-full flex items-center justify-center border shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                >
                  <img src={icon} alt="Logo" className="w-10 h-10" />
                </div>
              </div>

              <div className="text-center mb-10">
                <h1 style={{ color: 'var(--text-main)' }} className="text-3xl font-bold mb-2 tracking-tight">
                  Welcome back!
                </h1>
                <p style={{ color: 'var(--text-muted)' }} className="text-sm">
                  Log in to manage your HRMS account.
                </p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label style={{ color: 'var(--text-muted)' }} className="block text-xs mb-1.5 ml-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Your email"
                    style={{ backgroundColor: 'var(--card-border)', color: 'var(--text-main)' }}
                    className={`w-full p-3.5 rounded-xl border outline-none transition-all ${error && !errorContains("password") ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.05)]" : "border-transparent focus:border-blue-500"}`}
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-400 text-[10px] mt-1.5 ml-1 font-medium">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label style={{ color: 'var(--text-muted)' }} className="block text-xs mb-1.5 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      placeholder="Enter password"
                      type={showPassword ? "text" : "password"}
                      style={{ backgroundColor: 'var(--card-border)', color: 'var(--text-main)' }}
                      className={`w-full p-3.5 rounded-xl border outline-none transition-all ${error && errorContains("password") ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.05)]" : "border-transparent focus:border-blue-500"}`}
                      {...formik.getFieldProps("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ color: 'var(--text-muted)' }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-colors"
                    >
                      <i className={`far ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-400 text-[10px] mt-1.5 ml-1 font-medium">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                <AnimatePresence>
                  {error && typeof error === "string" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl text-center font-bold"
                    >
                      <i className="fas fa-exclamation-circle mr-2"></i> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    intrinsic="true"
                    style={{ color: 'var(--text-muted)' }}
                    className="text-xs hover:opacity-80 transition-colors"
                  >
                    Forgot <span className="text-blue-500 font-bold">password?</span>
                  </Link>
                </div>

                <motion.button
                  whileHover={!loading ? { scale: 1.01 } : {}}
                  whileTap={!loading ? { scale: 0.99 } : {}}
                  type="submit"
                  disabled={loading}
                  className={`w-full p-4 rounded-xl font-bold transition-all flex justify-center items-center h-12 shadow-lg ${loading ? "bg-slate-700/50 cursor-not-allowed text-gray-500" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer"}`}
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    "Sign in"
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
              <h2 className="text-4xl font-bold mb-4 z-10 leading-tight text-white">
                It's time to make employee management easier and faster
              </h2>
              <p className="text-gray-300 z-10 max-w-sm mb-6 font-light">
                Manage attendance, leave, employee data, and payroll all in one
                simple and reliable app.
              </p>
              <div className="flex gap-1.5 z-10">
                <motion.div
                  animate={{ width: [8, 24, 8] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                ></motion.div>
                <div className="h-1.5 w-2 bg-gray-700 rounded-full"></div>
                <div className="h-1.5 w-2 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;