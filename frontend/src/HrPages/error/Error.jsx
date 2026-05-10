import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

import icon from "../../assets/icons/icon.svg";
import ufoIcon from "../../assets/ufo/ufo.svg";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b141a] flex flex-col items-center justify-center px-6 relative overflow-hidden text-white font-sans">
      <NavLink
        to="/dashboard"
        className="absolute top-8 left-8 flex items-center gap-2 cursor-pointer group transition-transform hover:scale-105"
      >
        <a href="">
          <img src={icon} alt="Staffly Logo" className="w-8 h-8" />
        </a>
        <span className="text-xl font-bold tracking-tight italic">
          Staf<span className="text-blue-500 cursor-pointer">fly</span>
        </span>
      </NavLink>

      <div className="relative flex items-center justify-center mb-12">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-[180px] md:text-[280px] font-black leading-none tracking-tighter select-none"
        >
          404
        </motion.h1>

        <motion.div
          animate={{
            y: [0, -2, 0],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="relative">
            <img
              src={ufoIcon}
              alt="UFO"
              className="w-40 md:w-60 relative z-20 drop-shadow-[0_20px_50px_rgba(59,130,246,0.5)]"
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-20 h-40 bg-gradient-to-b from-blue-500/30 to-transparent blur-xl z-10"></div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center z-30"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Signal Lost</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-10 leading-relaxed text-sm md:text-base">
          The page you're looking for has vanished into deep space.{" "}
          <br className="hidden md:block" />
          It might have been abducted, or simply doesn't exist.
        </p>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#0081dd" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard")}
          className="bg-[#0095ff] text-white px-12 py-3.5 rounded-full font-bold shadow-[0_10px_20px_rgba(0,149,255,0.3)] transition-all flex items-center gap-2 mx-auto"
        >
          <i className="fas fa-home text-sm"></i>
          Back to home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Error;
